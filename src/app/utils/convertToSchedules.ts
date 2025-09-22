import Schedule from '~/app/class/Schedule';
import ScheduleTime from '~/app/class/ScheduleTime';
import { FormatedPDFDecoded, PDFRecordWithTime } from '~/app/struct/PDFDecoded';
import Week from '~/app/enums/week';
import { fromPDFtoWeek } from './formatWeek';

export function convertToSchedules(formatedData: FormatedPDFDecoded): Schedule[] {
    const schedules: Schedule[] = [];

    formatedData.forEach((daySchedule, dayIndex) => {
        daySchedule.forEach((record: PDFRecordWithTime, recordIndex) => {
            if (!record.name || record.name.trim() === '') {
                return; // 跳過空課程
            }

            try {
                // 重新創建 ScheduleTime 實例，以確保方法可用
                const fromTime = new ScheduleTime(record.startTime.hour, record.startTime.minute);
                const toTime = new ScheduleTime(record.endTime.hour, record.endTime.minute);

                const schedule = new Schedule({
                    id: schedules.length + 1, // 簡單的 ID 生成
                    title: record.name.trim(),
                    description: record.class ? `課程地點：${record.class}` : undefined,
                    location: record.class || undefined,
                    week: fromPDFtoWeek(dayIndex) as Week,
                    from: fromTime,
                    to: toTime,
                    notifiable: true,
                    enabled: true,
                });

                schedules.push(schedule);
            } catch (error) {
                console.warn(`無法轉換課程記錄 [${dayIndex}][${recordIndex}]:`, record, error);
            }
        });
    });

    return schedules;
}