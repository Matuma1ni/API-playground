import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect, useState } from "react";
import { StatusIndicator } from "./StatusIndicator";
import type { RequestStatus } from "./types";
import { Label } from "./components/ui/label";
import { REQUEST_STATUS } from "./constants";

interface IFormInput {
  method: string;
  url: string;
  requestBody?: string;
}

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
    formState: { isDirty, errors },
    setValue,
  } = useForm({
    defaultValues: {
      method: "",
      url: "",
      requestBody: "",
    },
  });

  const [timeout, setTimeout] = useState<number>(30);
  const [timeoutError, setTimeoutError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(timeout);
  const [requestState, setRequestState] = useState<RequestStatus>(REQUEST_STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isInProgress = requestState == REQUEST_STATUS.WAITING || requestState == REQUEST_STATUS.SENDING;

  useEffect(() => {
    if (isDirty) {
      setRequestState(REQUEST_STATUS.IDLE);
    }
  }, [isDirty]);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setRequestState(REQUEST_STATUS.SENDING);
    setTimeLeft(timeout);
    console.log(data);
  };

  useEffect(() => {
    if (requestState !== REQUEST_STATUS.SENDING) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRequestState(REQUEST_STATUS.ERROR);
          setErrorMessage("Request timed out");
          return timeout;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [requestState, timeout]);

  const method = watch("method");

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
              <div className="flex flex-row w-full mb-4">
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
                          if (field.value !== "post" && field.value !== "put") {
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
                          <SelectItem value="get">Get</SelectItem>
                          <SelectItem value="post">Post</SelectItem>
                          <SelectItem value="put">Put</SelectItem>
                          <SelectItem value="delete">Delete</SelectItem>
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
                      value: /^https?:\/\/[^\/\s]+(\/.*)?$/,
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
            <Button
              className="ml-3 px-7 self-end-safe"
              type="submit"
              disabled={isInProgress || !!timeoutError}
            >
              Send
            </Button>
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
    </div>
  );
};
