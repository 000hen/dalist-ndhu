import { spawn } from "child_process";
import {
    FormatedPDFDecoded,
    PDFDecoded,
    PDFRecord,
    RECORD_TIME,
} from "../struct/PDFDecoded";
import { ScheduleTime } from "dalist_utils";

export function decodePDF(
    data: ArrayBuffer,
    combine: boolean
): Promise<FormatedPDFDecoded> {
    return new Promise((resolve, reject) => {
        const pdftotext = spawn("python", ["./lib/extractor.py"]);

        let stdout = "";
        let stderr = "";

        pdftotext.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        pdftotext.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        pdftotext.on("close", (code) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `pdftotext process exited with code ${code}: ${stderr}`
                    )
                );
                return;
            }

            try {
                const result: PDFDecoded = JSON.parse(stdout);
                resolve(combine ? doCombine(result) : doNotCombine(result));
            } catch (e) {
                reject(new Error(`Failed to parse pdftotext output: ${e}`));
            }
        });

        pdftotext.stdin.write(Buffer.from(data));
        pdftotext.stdin.end();
    });
}

function doCombine(decoded: PDFDecoded): FormatedPDFDecoded {
    const formatted = [[], [], [], [], [], [], []] as FormatedPDFDecoded;

    let current: PDFRecord | null = null;
    let startTime: ScheduleTime = new ScheduleTime(0, 0);

    for (let day = 0; day < decoded.length; day++) {
        for (let slot = 0; slot < decoded[day].length; slot++) {
            const record = decoded[day][slot];
            if (
                record &&
                current &&
                record.name == current.name &&
                record.class == current.class
            )
                continue;
            if (current)
                formatted[day].push({
                    ...current,
                    startTime,
                    endTime: RECORD_TIME[slot - 1][1],
                    week: day,
                });

            if (record) {
                startTime = RECORD_TIME[slot][0];
            }

            current = record;
        }

        if (current) {
            formatted[day].push({
                ...current,
                startTime,
                endTime: RECORD_TIME[RECORD_TIME.length - 1][1],
                week: day,
            });
            current = null;
        }
    }

    return formatted;
}

function doNotCombine(decoded: PDFDecoded): FormatedPDFDecoded {
    const formatted = [[], [], [], [], [], [], []] as FormatedPDFDecoded;
    const seriesMap = new Map<string, string>();

    for (let day = 0; day < decoded.length; day++) {
        for (let slot = 0; slot < decoded[day].length; slot++) {
            const record = decoded[day][slot];
            if (!record) continue;
            
            const seriesKey = `${record.name}_${record.class}`;
            let seriesId = seriesMap.get(seriesKey);
            
            if (!seriesId) {
                seriesId = crypto.randomUUID();
                seriesMap.set(seriesKey, seriesId);
            }
            
            formatted[day].push({
                ...record,
                startTime: RECORD_TIME[slot][0],
                endTime: RECORD_TIME[slot][1],
                week: day,
                series: seriesId,
            });
        }
    }

    return formatted;
}
