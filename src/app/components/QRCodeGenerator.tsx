'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import QRCodeUsageInfo from './QRCodeUsageInfo';

interface QRCodeGeneratorProps {
    value: string;
    title?: string;
    size?: number;
}

export default function QRCodeGenerator({ value, title = "QR Code", size = 256 }: QRCodeGeneratorProps) {
    const [isVisible, setIsVisible] = useState(false);

    const downloadQRCode = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        // 創建 canvas 來轉換 SVG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);

            // 下載 PNG
            canvas.toBlob((blob) => {
                if (blob) {
                    const link = document.createElement('a');
                    link.download = 'schedule-qrcode.png';
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    URL.revokeObjectURL(link.href);
                }
            });
            
            URL.revokeObjectURL(url);
        };

        img.src = url;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);
            alert('鏈接已複製到剪貼板！');
        } catch (err) {
            console.error('複製失敗:', err);
            alert('複製失敗，請手動複製鏈接');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {isVisible ? '隱藏' : '生成'} QR Code
                </button>
            </div>

            {isVisible && (
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                            <QRCode
                                id="qr-code-svg"
                                value={value}
                                size={size}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 ${size} ${size}`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={downloadQRCode}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                            📥 下載 QR Code
                        </button>
                        
                        <button
                            onClick={copyToClipboard}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                        >
                            📋 複製鏈接
                        </button>
                    </div>

                    <div className="mt-4 p-3 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-700 font-medium mb-2">應用程式鏈接：</p>
                        <p className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded border">
                            {value}
                        </p>
                    </div>

                    <div className="text-xs text-gray-500 text-center">
                        掃描此 QR Code 或使用鏈接在支援的應用程式中匯入課表
                    </div>

                    {/* 使用說明 */}
                    <QRCodeUsageInfo />
                </div>
            )}
        </div>
    );
}
