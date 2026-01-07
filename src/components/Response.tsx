import type { ResponseData } from "@/types/responseData.type";
import { Label } from "./ui/label";

export const Response = ({ response }: { response: ResponseData | null }) => {
  if (!response) return null;

  const responseStatus = response.status;

  return (
    <>
      <div className="w-full my-6 border" />
      <div className="flex flex-col gap-3 w-full">
        <Label>Response</Label>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="flex flex-row gap-4 self-start items-center">
              <div
                className={`flex px-3 py-1 ${
                  responseStatus >= 200 && responseStatus < 300
                    ? "bg-green-100 text-green-800"
                    : responseStatus >= 300 && responseStatus < 400
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                } rounded`}
              >
                {responseStatus}
              </div>
              <div className="">{response.statusText}</div>
            </div>
            <div className="italic text-sm">
              Completed in {response.durationMs}ms
            </div>
          </div>
          <div className="border border-gray-300 mx-2"></div>
          <div className="bg-gray-100 p-4 rounded-md overflow-x-auto w-full">
            {response.body ? (
              JSON.stringify(response.body, null, 2)
            ) : (
              <i>No body provided</i>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
