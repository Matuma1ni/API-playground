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
    formState: { errors },
  } = useForm({
    defaultValues: {
      method: "",
      url: "",
      requestBody: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const method = watch("method");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row justify-between mb-3">
        <div className="flex flex-row w-full">
          <Controller
            name="method"
            control={control}
            rules={{ required: "Method is required" }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <Select value={field.value} onValueChange={field.onChange}>
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
                value:
                  /^https?:\/\/[^\/\s]+(\/.*)?$/,
                message: "Invalid URL format",
              },
            }}
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
        <Button className="ml-3" type="submit">
          Send
        </Button>
      </div>
      {(method === "post" || method === "put") && (
        <Controller
          name="requestBody"
          control={control}
          render={({ field }) => (
            <>
              <Textarea {...field} placeholder="Request body" />
            </>
          )}
        />
      )}
    </form>
  );
};
