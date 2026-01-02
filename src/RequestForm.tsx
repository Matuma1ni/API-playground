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
import { REQUEST_STATUS_CONFIG } from "./constants";

interface IFormInput {
  method: string;
  url: string;
  requestBody?: string;
}

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

  const [requestState, setRequestState] = useState<RequestStatus>("success");
  const isInProgress = requestState == "waiting" || requestState == "sending";

  useEffect(() => {
    if (isDirty) {
      setRequestState("idle");
    }
  }, [isDirty]);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setRequestState("sending");
    console.log(data);
  };

  const method = watch("method");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row justify-between mb-3">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full mb-3">
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
                          <small className="text-red-500">{message}</small>
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
                          <small className="text-red-500">{message}</small>
                        )}
                      />
                    )}
                  </div>
                )}
              />
            </div>
            {(method === "post" || method === "put") && (
              <Controller
                disabled={isInProgress}
                name="requestBody"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Request body" />
                )}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button className="ml-3 px-7 self-end-safe" type="submit" disabled={isInProgress}>
            Send
          </Button>
          <div className="w-[200px]">
            {requestState !== "idle" && (
              <StatusIndicator config={REQUEST_STATUS_CONFIG[requestState]} />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
