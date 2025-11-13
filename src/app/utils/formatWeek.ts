import { Week } from "dalist_utils";

export function fromPDFtoWeek(week: number): Week {
    return (week + 1) % 7 + 1 as Week;
}
