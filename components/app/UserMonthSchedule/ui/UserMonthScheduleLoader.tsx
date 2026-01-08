import { Spinner } from "@/components/ui/spinner";

export const UserMonthScheduleLoader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Spinner className="size-15" />
    </div>
  );
};
