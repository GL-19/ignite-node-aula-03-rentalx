interface IDateProvider {
  compareByHour(start_date: Date, end_date: Date): number;
  compareByDays(start_date: Date, end_date: Date): number;
  compareIfBefore(start_date: Date, end_date: Date): boolean;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  addDays(days: number): Date;
  addHours(hours: number): Date;
}

export { IDateProvider };
