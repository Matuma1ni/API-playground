import type { StatusConfig } from "./types";

export const StatusIndicator = ({
  config,
}: {
  config: StatusConfig;
}) => {
  return (
    <div className="flex w-full justify-center items-center">
      <div
        className={`w-4 h-4 rounded-full mr-2 ${config.indicatorClassName}`}
      />
      <span className={config.messageClassName}>
        {config.label}
      </span>
    </div>
  );
};
