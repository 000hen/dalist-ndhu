import { NextRequest, NextResponse } from 'next/server';
import { getRequestData, fetchSchedule } from '~/app/process/ndhuFetcher';
import { decodePDF } from '~/app/process/decodePDF';

export async function POST(request: NextRequest) {
    try {
        const { username, password, combine = true } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: '學號和密碼不能為空' },
                { status: 400 }
            );
        }

        // 獲取登入所需的表單資料
        const requestData = await getRequestData();
        
        // 設置用戶名和密碼
        requestData.ctl00$MainContent$acc = username;
        requestData.ctl00$MainContent$pass = password;

        // 獲取課表 PDF 資料
        const pdfData = await fetchSchedule(requestData);

        // 解碼 PDF 資料
        const decodedSchedule = await decodePDF(pdfData, combine);

        return NextResponse.json({
            success: true,
            schedule: decodedSchedule
        });

    } catch (error) {
        console.error('Login error:', error);
        
        // 根據錯誤類型返回適當的錯誤訊息
        if (error instanceof Error) {
            if (error.message.includes('Invalid credentials')) {
                return NextResponse.json(
                    { error: '學號或密碼錯誤，請重新輸入' },
                    { status: 401 }
                );
            }
            if (error.message.includes('Failed to fetch schedule')) {
                return NextResponse.json(
                    { error: '課表服務暫時無法使用，請稍後再試' },
                    { status: 503 }
                );
            }
            if (error.message.includes('pdftotext process exited')) {
                return NextResponse.json(
                    { error: '課表解析失敗，請檢查學號密碼是否正確' },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: '登入失敗，請檢查學號和密碼' },
            { status: 401 }
        );
    }
}