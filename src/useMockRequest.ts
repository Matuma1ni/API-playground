import { useCallback, useEffect, useRef, useState } from "react";
import { REQUEST_STATUS } from "./constants";
import type { RequestStatus, ResponseData } from "./types";

export function useMockRequest(timeout: number) {
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

    try {
      const start = performance.now();

      const result = await new Promise<ResponseData>((resolve, reject) => {
        const timeoutId = window.setTimeout(() => {
          resolve({
            status: 200,
            statusText: "OK",
            durationMs: Math.round(performance.now() - start),
            body: { method, url, body },
          });
        }, 500);

        controller.signal.addEventListener("abort", () => {
          clearTimeout(timeoutId);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });

      setResponse(result);
      setRequestState(REQUEST_STATUS.SUCCESS);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      setErrorMessage("Request failed");
      setRequestState(REQUEST_STATUS.ERROR);
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
      setTimeLeft((prev) => {
        if (prev <= 1) {
          cancel();
          setErrorMessage("Request timed out");
          setRequestState(REQUEST_STATUS.ERROR);
          return timeout;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [requestState, timeout, cancel]);

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
}
