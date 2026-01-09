import { Skeleton } from "@/components/ui/skeleton";

export const NearesetEntryDayLoader = () => {
  return (
    <div className="flex justify-center items-center border-2 rounded-[10px] mt-10 border-[#27272a] h-[245px]">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
