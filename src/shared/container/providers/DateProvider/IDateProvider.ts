interface IDateProvider {
  compareByHour(start_date: Date, end_date: Date): number;
  compareByDays(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  addDays(days: number): Date;
}

export { IDateProvider };
