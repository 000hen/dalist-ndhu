import { Schedule } from "dalist_utils";
import { isBrowser } from "./browser";

export function byteArrayToBase64(value: ArrayBuffer): string {
    if (isBrowser()) {
        return btoa(String.fromCharCode(...new Uint8Array(value)))
            .replace(/\//g, "_")
            .replace(/\+/g, "-");
    }

    return Buffer.from(value)
        .toString("base64")
        .replace(/\//g, "_")
        .replace(/\+/g, "-");
}

export function formatSchedulesToCreate(schedules: Schedule[]): string {
    let result = "dalist://create/";
    result += schedules.map((s) => byteArrayToBase64(s.toFormat().buffer as ArrayBuffer)).join("&");

    return result;
}