export default function QRCodeUsageInfo() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-800 mb-2">📱 如何使用課表 QR Code？</h4>
            <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>掃描 QR Code</strong>：使用支援的課表應用程式掃描</li>
                <li>• <strong>複製鏈接</strong>：在 日行者 中開啟</li>
                <li>• <strong>下載圖片</strong>：保存 QR Code 圖片以供日後使用</li>
                <li>• <strong>分享課表</strong>：輕鬆與朋友或同學分享您的課表</li>
            </ul>
            <p className="text-xs text-blue-600 mt-2">
                💡 此 QR Code 包含完整的課表資訊，包括課程名稱、時間和地點
            </p>
        </div>
    );
}