import Schedule from "~/app/class/Schedule";
import { byteArrayToBase64 } from "./byte";

export function formatSchedulesToCreate(schedules: Schedule[]): string {
    let result = "dalist://create/";
    result += schedules.map((s) => byteArrayToBase64(s.toFormat().buffer as ArrayBuffer)).join("&");

    return result;
}