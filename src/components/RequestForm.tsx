import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { Method } from "@/types/method.type";
import { REQUEST_STATUS } from "../constants";
import { Response } from "./Response";
import { useMockRequest } from "../hooks/useMockRequest";
import { StatusIndicator } from "./StatusIndicator";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

type FormInput = {
  method: Method;
  url: string;
  requestBody?: string;
};

const validateTimeout = (value: number) => {
  if (value < 10) return "Timeout cannot be less than 10 seconds";
  if (value > 120) return "Timeout cannot exceed 120 seconds";
  return null;
};

export const RequestForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormInput>({
    defaultValues: {
      method: "get",
      url: "",
      requestBody: "",
    },
  });

  const [timeout, setTimeout] = useState<number>(30);
  const [timeoutError, setTimeoutError] = useState<string | null>(null);

  const hasSubmittedRef = useRef(false);

  const { requestState, response, errorMessage, timeLeft, send, cancel } =
    useMockRequest(timeout);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    hasSubmittedRef.current = true;
    await send(data.method, data.url, data.requestBody);
  };

  const onCancel = useCallback(() => {
    cancel();

    toast.info("Request cancelled", {
      description: "The request was cancelled.",
      duration: 3000,
    });
  }, [cancel]);

  const isInProgress =
    requestState === REQUEST_STATUS.WAITING ||
    requestState === REQUEST_STATUS.SENDING;

  const method = watch("method");
  const url = watch("url");
  const requestBody = watch("requestBody");

  useEffect(() => {
    if (!hasSubmittedRef.current) return;

    hasSubmittedRef.current = false;
    cancel();
  }, [method, url, requestBody, cancel]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isInProgress) {
          onCancel();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, isInProgress]);

  return (
    <div>
      <div className="w-full flex flex-col gap-2 justify-start">
        <Label htmlFor="timeout">Timeout (s)</Label>
        <Input
          type="number"
          placeholder="Timeout (seconds)"
          id="timeout"
          value={timeout}
          onChange={(e) => {
            setTimeout(Number(e.target.value));
            setTimeoutError(null);
          }}
          onBlur={() => {
            const error = validateTimeout(timeout);
            setTimeoutError(error);
          }}
          min={10}
          max={120}
          className={`max-w-[200px] ${
            !!timeoutError && "border border-red-500"
          }`}
        />
        {timeoutError && (
          <small className="text-left text-red-700">{timeoutError}</small>
        )}
      </div>
      <div className="w-full my-4 border" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row justify-between mb-3">
          <div className="flex flex-row w-full">
            <div className="flex flex-col w-full">
              <div className="flex flex-row w-full mb-4 gap-2">
                <Controller
                  name="method"
                  control={control}
                  rules={{ required: "Method is required" }}
                  disabled={isInProgress}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col">
                      <Select
                        disabled={field.disabled}
                        value={field.value}
                        onValueChange={(e) => {
                          field.onChange(e);
                          if (e !== "post" && e !== "put") {
                            setValue("requestBody", "");
                          }
                        }}
                      >
                        <SelectTrigger
                          className={`w-[100px] ${
                            fieldState.error ? "border border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="get">GET</SelectItem>
                          <SelectItem value="post">POST</SelectItem>
                          <SelectItem value="put">PUT</SelectItem>
                          <SelectItem value="delete">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <ErrorMessage
                          errors={errors}
                          name={field.name}
                          message={fieldState.error?.message}
                          render={({ message }) => (
                            <small className="text-red-700">{message}</small>
                          )}
                        />
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="url"
                  control={control}
                  rules={{
                    required: "URL is required",
                    pattern: {
                      value: /^https?:\/\/[^/\s]+(\/.*)?$/,
                      message: "Invalid URL format",
                    },
                  }}
                  disabled={isInProgress}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col w-full max-w-[600px]">
                      <Input
                        {...field}
                        placeholder="Input URL here"
                        className={`w-full ${
                          fieldState.error ? "border border-red-500" : ""
                        }`}
                      />
                      {fieldState.error && (
                        <ErrorMessage
                          errors={errors}
                          name={field.name}
                          message={fieldState.error?.message}
                          render={({ message }) => (
                            <small className="text-red-700">{message}</small>
                          )}
                        />
                      )}
                    </div>
                  )}
                />
              </div>
              {(method === "post" || method === "put") && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="requestBody">Request Body</Label>
                  <Controller
                    disabled={isInProgress}
                    name="requestBody"
                    control={control}
                    render={({ field }) => (
                      <Textarea {...field} placeholder="Request body" />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div
              className={`flex flex-row gap-2 ml-4 ${
                isInProgress ? "justify-between" : "justify-end"
              }`}
            >
              {isInProgress && (
                <Button variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                className="ml-3 px-7 self-end-safe"
                type="submit"
                disabled={isInProgress || !!timeoutError}
              >
                Send
              </Button>
            </div>
            <div className="w-[200px]">
              <StatusIndicator
                status={requestState}
                timeLeft={timeLeft}
                errorMessage={errorMessage}
              />
            </div>
          </div>
        </div>
      </form>
      <Response response={response} />
    </div>
  );
};
