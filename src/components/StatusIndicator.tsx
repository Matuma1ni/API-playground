import type { RequestStatus } from "@/types/requestStatus.type";
import { REQUEST_STATUS, REQUEST_STATUS_CONFIG } from "../constants";

type StatusIndicatorProps = {
  status: RequestStatus;
  timeLeft: number;
  errorMessage?: string | null;
};

export const StatusIndicator = ({
  status,
  timeLeft,
  errorMessage,
}: StatusIndicatorProps) => {
  const config = REQUEST_STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className={`w-4 h-4 rounded-full ${config.indicatorClassName}`} />
        <span className={config.messageClassName}>{config.label}</span>
      </div>
      {status === REQUEST_STATUS.ERROR && (
        <div className={config.messageClassName}>{errorMessage}</div>
      )}
      {status === REQUEST_STATUS.SENDING ||
        (status === REQUEST_STATUS.WAITING && (
          <span> {timeLeft}s until timeout</span>
        ))}
    </div>
  );
};
