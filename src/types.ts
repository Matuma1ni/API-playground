export type RequestStatus =
  | "idle"
  | "sending"
  | "waiting"
  | "error"
  | "success";

export interface StatusConfig {
  indicatorClassName: string;
  messageClassName?: string;
  label?: string;
}
