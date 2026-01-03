import type { RequestStatus, StatusConfig } from "./types";

export const REQUEST_STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  WAITING: "waiting",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const REQUEST_STATUS_CONFIG = {
  idle: null,
  sending: {
    label: "Sending…",
    indicatorClassName: "bg-blue-500",
    messageClassName: "text-blue-700",
  },
  waiting: {
    label: "Waiting",
    indicatorClassName: "bg-blue-500 animate-pulse",
    messageClassName: "text-blue-700",
  },
  success: {
    label: "Success",
    indicatorClassName: "bg-green-500",
    messageClassName: "text-green-700",
  },
  error: {
    label: "Error",
    indicatorClassName: "bg-red-500",
    messageClassName: "text-red-700",
  },
} satisfies Record<RequestStatus, StatusConfig | null>;