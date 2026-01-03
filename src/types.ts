import type { REQUEST_STATUS } from "./constants";

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export interface StatusConfig {
  indicatorClassName: string;
  messageClassName?: string;
  label?: string;
}
