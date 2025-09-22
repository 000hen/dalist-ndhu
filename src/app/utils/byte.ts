import { isBrowser } from "./browser";

export function intFromByteArray(bytes: Uint8Array): number {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return view.getInt32(0, true);
}

export function byteArrayToBase64(value: ArrayBuffer): string{
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

export function base64ToByteArray(value: string): Uint8Array {
    if (isBrowser()) {
        return new Uint8Array(
            atob(value)
                .replace(/_/g, "/")
                .replace(/-/g, "+")
                .split("")
                .map((c) => c.charCodeAt(0)),
        );
    }
    
    return new Uint8Array(Buffer.from(value, "base64"));
}

export function stringToByteArray(str?: string): Uint8Array {
    return str ? new TextEncoder().encode(str) : new Uint8Array();
}