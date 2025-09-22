import { spawn } from 'child_process';
import fs from 'fs';

function extractPdfData(pdfPath) {
    return new Promise((resolve, reject) => {
        const pythonPath = 'python';
        const fileBuffer = fs.createReadStream(pdfPath);

        const process = spawn(pythonPath, ["./lib/extractor.py"]);

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve(stdout);
            } else {
                reject(new Error(`Python script exited with code ${code}: ${stderr}`));
            }
        });

        process.on('error', (err) => {
            reject(new Error(`Failed to write to stdin: ${err.message}`));
        });
        fileBuffer.pipe(process.stdin);
    });
}

try {
    const result = await extractPdfData(process.argv[2]);
    // replace \uXXXX to real unicode characters
    const jsonString = result.replace(/\\u([\dA-F]{4})/gi, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16));
    });
    const jsonData = JSON.parse(jsonString);
    console.log(jsonData);
} catch (error) {
    console.error('Error:', error.message);
}