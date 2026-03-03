export interface IDaySchedule {
  date: Date | null;
  userCount: number;
}

export interface MonthData {
  label: string;
  days: IDaySchedule[];
}
