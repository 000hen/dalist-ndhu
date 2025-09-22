import { intFromByteArray, stringToByteArray } from "~/app/utils/byte";
import ScheduleTime from "~/app/class/ScheduleTime";
import Week from "~/app/enums/week";

class Schedule {
    id: number;
    title: string;
    description?: string;
    at?: string;
    instructor?: string;
    location?: string;
    week: Week;
    from: ScheduleTime;
    to: ScheduleTime;
    notifiable: boolean;
    createAt: Date;
    enabled: boolean;

    constructor(params: {
        id?: number;
        title: string;
        description?: string;
        at?: string;
        instructor?: string;
        location?: string;
        week: Week;
        from: ScheduleTime;
        to: ScheduleTime;
        notifiable?: boolean;
        createAt?: Date;
        enabled?: boolean;
    }) {
        this.id = params.id ?? 0;
        this.title = params.title;
        this.description = params.description;
        this.at = params.at;
        this.instructor = params.instructor;
        this.location = params.location;
        this.week = params.week;
        this.from = params.from;
        this.to = params.to;
        this.notifiable = params.notifiable ?? true;
        this.createAt = params.createAt ?? new Date();
        this.enabled = params.enabled ?? true;
    }

    get duration(): ScheduleTime {
        return this.from.getDuration(this.to);
    }

    toFormat(): Uint8Array {
        const title = stringToByteArray(this.title);
        const description = stringToByteArray(this.description);
        const at = stringToByteArray(this.at);
        const instructor = stringToByteArray(this.instructor);
        const location = stringToByteArray(this.location);
        const week = new Uint8Array([this.week & 0xff]);
        const from = this.from.toByteArray();
        const to = this.to.toByteArray();

        // combine with separator 0x00
        const sep = new Uint8Array([0]);

        const combined = new Uint8Array(
            title.length +
                1 +
                description.length +
                1 +
                at.length +
                1 +
                instructor.length +
                1 +
                location.length +
                1 +
                week.length +
                from.length +
                to.length
        );

        let offset = 0;
        combined.set(title, offset);
        offset += title.length;
        combined.set(sep, offset);
        offset += 1;

        combined.set(description, offset);
        offset += description.length;
        combined.set(sep, offset);
        offset += 1;

        combined.set(at, offset);
        offset += at.length;
        combined.set(sep, offset);
        offset += 1;

        combined.set(instructor, offset);
        offset += instructor.length;
        combined.set(sep, offset);
        offset += 1;

        combined.set(location, offset);
        offset += location.length;
        combined.set(sep, offset);
        offset += 1;

        combined.set(week, offset);
        offset += week.length;

        combined.set(from, offset);
        offset += from.length;
        combined.set(to, offset);

        return combined;
    }

    static decodeFormat(data: Uint8Array): Schedule {
        let offset = 0;

        function readString(): string {
            const start = offset;
            while (offset < data.length && data[offset] !== 0) {
                offset++;
            }
            const strBytes = data.slice(start, offset);
            offset++; // skip separator
            return new TextDecoder().decode(strBytes);
        }

        const title = readString();
        const description = readString();
        const at = readString();
        const instructor = readString();
        const location = readString();

        const week = data[offset];
        offset += 1;

        const fromBytes = data.slice(offset, offset + 4);
        offset += 4;
        const toBytes = data.slice(offset, offset + 4);
        offset += 4;

        const fromInt = intFromByteArray(fromBytes);
        const toInt = intFromByteArray(toBytes);

        const from = ScheduleTime.fromInt(fromInt);
        const to = ScheduleTime.fromInt(toInt);

        return new Schedule({
            title,
            description: description || undefined,
            at: at || undefined,
            instructor: instructor || undefined,
            location: location || undefined,
            week,
            from,
            to,
        });
    }
}

export default Schedule;
