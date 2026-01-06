import { Spinner } from "@/components/ui/spinner";

export const TimeScheduleLoader = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100%-300px)]">
      <Spinner className="size-20 text-white" />
    </div>
  );
};
