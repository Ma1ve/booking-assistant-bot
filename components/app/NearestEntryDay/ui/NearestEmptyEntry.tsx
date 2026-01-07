import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { BookSearch } from "lucide-react";

export const NearestEmptyEntry = () => {
  return (
    <div className="flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookSearch />
          </EmptyMedia>
          <EmptyTitle className="font-medium">Ближайшей записи на сегодня нет</EmptyTitle>
          <EmptyDescription>
            Для создании записи нажмите <br />
            &quot;Приемы на сегодня&quot; &#8594; &quot;Добавить запись&quot;
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};
