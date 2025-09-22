import { strict as asserts } from "assert";
import { JSDOM } from "jsdom";
import { AccessStruct } from "../struct/AccessStruct";

const SCHEDULE_URL = process.env.NDHU_SCHEDULE_URL;

asserts(
    SCHEDULE_URL,
    "NDHU_SCHEDULE_URL is not defined in environment variables"
);

export async function getRequestData() {
    const data: AccessStruct = await fetch(SCHEDULE_URL!)
        .then((res) => res.text())
        .then((data) => new JSDOM(data))
        .then((dom) => {
            return {
                ctl00$MainContent$acc: "",
                ctl00$MainContent$pass: "",
                ctl00$MainContent$Button2: "登入",
                __VIEWSTATE:
                    dom.window.document.querySelector<HTMLInputElement>(
                        "input[name='__VIEWSTATE']"
                    )?.value || "",
                __VIEWSTATEGENERATOR:
                    dom.window.document.querySelector<HTMLInputElement>(
                        "input[name='__VIEWSTATEGENERATOR']"
                    )?.value || "",
                __VIEWSTATEENCRYPTED: "",
                __EVENTVALIDATION:
                    dom.window.document.querySelector<HTMLInputElement>(
                        "input[name='__EVENTVALIDATION']"
                    )?.value || "",
            };
        });

    return data;
}

export async function fetchSchedule(accessData: AccessStruct): Promise<ArrayBuffer> {
    const res = await fetch(SCHEDULE_URL!, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(accessData as unknown as Record<string, string>).toString(),
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch schedule: ${res.statusText}`);
    }

    if (res.headers.get("content-type") !== "application/pdf") {
        throw new Error("Failed to fetch schedule: Invalid credentials or unexpected response");
    }

    return await res.arrayBuffer();
}
