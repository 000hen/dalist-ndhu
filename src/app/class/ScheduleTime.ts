class ScheduleTime {
    hour: number;
    minute: number;

    constructor(hour: number, minute: number) {
        this.hour = hour;
        this.minute = minute;
    }

    toInt(): number {
        return this.hour * 3600 + this.minute * 60;
    }

    toByteArray(): Uint8Array {
        const intVal = this.toInt();
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setInt32(0, intVal, true);
        return new Uint8Array(buffer);
    }

    getDuration(other: ScheduleTime): ScheduleTime {
        const fromSeconds = this.toInt();
        const toSeconds = other.toInt();
        const durationSeconds = toSeconds - fromSeconds;
        return ScheduleTime.fromInt(durationSeconds);
    }

    static fromInt(value: number): ScheduleTime {
        const hour = Math.floor(value / 3600);
        const minute = Math.floor((value % 3600) / 60);
        return new ScheduleTime(hour, minute);
    }
}

export default ScheduleTime;
