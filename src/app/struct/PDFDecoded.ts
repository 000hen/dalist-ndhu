import { ScheduleTime, Week } from "dalist_utils";

/**
 * Represents the decoded PDF schedule data.
 * The outer array represents days of the week (0-6 for Mon-Sun),
 * and the inner array represents time slots in a day.
 * 
 * Each entry can be a PDFRecord or null if no class is scheduled.
 */
export type PDFDecoded = Array<Array<PDFRecord | null>>;
export interface PDFRecord {
    name:  string;
    class: string;
}

export type FormatedPDFDecoded = Array<Array<PDFRecordWithTime>>;
export interface PDFRecordWithTime extends PDFRecord {
    week: Week;
    startTime: ScheduleTime;
    endTime: ScheduleTime;
}

/**
 * Represents the predefined schedule time slots.
 * Each entry is a tuple of [startTime, endTime].
 */
export const RECORD_TIME = [
    [new ScheduleTime(6, 10), new ScheduleTime(7, 0)],
    [new ScheduleTime(7, 10), new ScheduleTime(8, 0)],
    [new ScheduleTime(8, 10), new ScheduleTime(9, 0)],
    [new ScheduleTime(9, 10), new ScheduleTime(10, 0)],
    [new ScheduleTime(10, 10), new ScheduleTime(11, 0)],
    [new ScheduleTime(11, 10), new ScheduleTime(12, 0)],
    [new ScheduleTime(12, 10), new ScheduleTime(13, 0)],
    [new ScheduleTime(13, 10), new ScheduleTime(14, 0)],
    [new ScheduleTime(14, 10), new ScheduleTime(15, 0)],
    [new ScheduleTime(15, 10), new ScheduleTime(16, 0)],
    [new ScheduleTime(16, 10), new ScheduleTime(17, 0)],
    [new ScheduleTime(17, 10), new ScheduleTime(18, 0)],
    [new ScheduleTime(18, 10), new ScheduleTime(19, 0)],
    [new ScheduleTime(19, 10), new ScheduleTime(20, 0)],
    [new ScheduleTime(20, 10), new ScheduleTime(21, 0)],
    [new ScheduleTime(21, 10), new ScheduleTime(22, 0)],
]
