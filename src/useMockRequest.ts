import { useCallback, useEffect, useRef, useState } from "react";
import { REQUEST_STATUS } from "./constants";
import type { RequestStatus, ResponseData } from "./types";

type MockSuccessScenario = {
  type: "success";
  status: 200 | 304 | 404;
  statusText: string;
  body: unknown;
};

type MockScenario = MockSuccessScenario | { type: "timeout" };

const getScenarioFromUrl = (url: string): MockScenario => {
  if (url.includes("/success")) {
    return {
      type: "success",
      status: 200,
      statusText: "OK",
      body: {
        message: "Request completed successfully",
        data: { id: 1, name: "John Doe" },
      },
    };
  }

  if (url.includes("/not-modified")) {
    return {
      type: "success",
      status: 304,
      statusText: "Not Modified",
      body: null,
    };
  }

  if (url.includes("/not-found")) {
    return {
      type: "success",
      status: 404,
      statusText: "Not Found",
      body: {
        message: "Resource not found",
      },
    };
  }

  return { type: "timeout" };
};

const mockFetch = (
  scenario: MockScenario,
  signal: AbortSignal,
  timeoutMs: number
): Promise<ResponseData> => {
  return new Promise((resolve, reject) => {
    const start = performance.now();

    const timeoutId = window.setTimeout(() => {
      reject(new Error("TIMEOUT"));
    }, timeoutMs);

    const responseId =
      scenario.type === "success"
        ? window.setTimeout(() => {
            resolve({
              status: scenario.status,
              statusText:
                scenario.status === 200
                  ? "OK"
                  : scenario.status === 304
                  ? "Not Modified"
                  : "Not Found",
              durationMs: Math.round(performance.now() - start),
              body: { scenario },
            });
          }, 500)
        : null;

    signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      if (responseId) clearTimeout(responseId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
};

export const useMockRequest = (timeout: number) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const [requestState, setRequestState] = useState<RequestStatus>(
    REQUEST_STATUS.IDLE
  );
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeout);

  const send = async (method: string, url: string, body?: string) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setRequestState(REQUEST_STATUS.SENDING);
    setResponse(null);
    setErrorMessage(null);
    setTimeLeft(timeout);

    const scenario = getScenarioFromUrl(url);

    try {
      const result = await mockFetch(
        scenario,
        controller.signal,
        timeout * 1000
      );

      setResponse(result);
      setRequestState(REQUEST_STATUS.SUCCESS);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      if (err instanceof Error && err.message === "TIMEOUT") {
        setErrorMessage("Request timed out");
        setRequestState(REQUEST_STATUS.ERROR);
        return;
      }

      setErrorMessage("Request failed");
      setRequestState(REQUEST_STATUS.ERROR);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setRequestState(REQUEST_STATUS.IDLE);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (requestState !== REQUEST_STATUS.SENDING) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(id);
  }, [requestState]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  return {
    requestState,
    response,
    errorMessage,
    timeLeft,
    send,
    cancel,
  };
};
