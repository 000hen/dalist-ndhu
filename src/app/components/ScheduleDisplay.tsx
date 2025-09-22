import { FormatedPDFDecoded } from '../struct/PDFDecoded';
import QRCodeGenerator from './QRCodeGenerator';
import { convertToSchedules } from '../utils/convertToSchedules';
import { formatSchedulesToCreate } from '../utils/formatSchedule';

interface ScheduleDisplayProps {
    schedule: FormatedPDFDecoded;
    isLoading?: boolean;
}

const WEEKDAYS = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

export default function ScheduleDisplay({ schedule, isLoading }: ScheduleDisplayProps) {
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto mt-8 p-6">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">正在解析課表資料...</p>
                </div>
            </div>
        );
    }

    if (!schedule || schedule.length === 0) {
        return (
            <div className="max-w-6xl mx-auto mt-8 p-6">
                <div className="text-center text-gray-500">
                    尚無課表資料
                </div>
            </div>
        );
    }

    const formatTime = (hour: number, minute: number) => {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    // 生成 QR Code 用的 URI
    const generateQRCodeURI = () => {
        try {
            console.log('原始課表數據:', schedule);
            const schedules = convertToSchedules(schedule);
            console.log('轉換後的 Schedule 物件:', schedules);
            
            if (schedules.length === 0) {
                console.warn('沒有有效的課程記錄');
                return '';
            }
            
            const uri = formatSchedulesToCreate(schedules);
            console.log('生成的 URI:', uri);
            return uri;
        } catch (error) {
            console.error('生成 QR Code URI 失敗:', error);
            console.error('錯誤詳細資訊:', {
                message: error instanceof Error ? error.message : '未知錯誤',
                stack: error instanceof Error ? error.stack : '',
                scheduleData: schedule
            });
            return '';
        }
    };

    const qrCodeURI = generateQRCodeURI();

    return (
        <div className="max-w-6xl mx-auto mt-8 p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                我的課表
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {schedule.map((daySchedule, dayIndex) => (
                    <div key={dayIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-600 text-white p-3">
                            <h3 className="font-semibold text-center">
                                {WEEKDAYS[dayIndex] || `第${dayIndex + 1}天`}
                            </h3>
                        </div>
                        
                        <div className="p-4">
                            {daySchedule.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">無課程</p>
                            ) : (
                                <div className="space-y-3">
                                    {daySchedule.map((record, recordIndex) => (
                                        <div 
                                            key={recordIndex}
                                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="font-medium text-gray-800 mb-1">
                                                {record.name || '未命名課程'}
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 mb-2">
                                                {formatTime(record.startTime.hour, record.startTime.minute)} - {formatTime(record.endTime.hour, record.endTime.minute)}
                                            </div>
                                            
                                            {record.class && (
                                                <div className="text-sm text-blue-600">
                                                    📍 {record.class}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* QR Code 生成器 */}
            {qrCodeURI ? (
                <QRCodeGenerator 
                    value={qrCodeURI}
                    title="匯出課表到日行者"
                    size={500}
                />
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <div className="flex items-center">
                        <span className="text-yellow-600 mr-2">⚠️</span>
                        <div>
                            <h4 className="font-medium text-yellow-800">QR Code 生成失敗</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                無法生成課表的 QR Code。請檢查瀏覽器開發者工具的控制台查看詳細錯誤資訊。
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}