import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { BookSearch } from "lucide-react";

export const UserMonthScheduleEmpty = () => {
  return (
    <div className="mt-15 bg-black/90 backdrop-blur-sm rounded-xl p-8 border border-white/10">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookSearch />
          </EmptyMedia>
          <EmptyTitle className="font-medium text-2xl">У вас нету записей</EmptyTitle>
          <EmptyDescription>
            <p className="text-gray-400 text-[17px]">
              Для записи на прием и по всем вопросам —
              <a
                href="https://web.telegram.org/k/#@flowredup"
                className="ml-1 text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                @flowredup
              </a>
            </p>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};
