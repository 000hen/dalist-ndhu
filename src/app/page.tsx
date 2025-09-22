'use client';

import { useState } from 'react';
import LoginForm from './components/LoginForm';
import ScheduleDisplay from './components/ScheduleDisplay';
import { FormatedPDFDecoded } from './struct/PDFDecoded';

export default function Home() {
    const [schedule, setSchedule] = useState<FormatedPDFDecoded | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = async (username: string, password: string, combine: boolean) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, combine }),
            });

            const data = await response.json();

            if (response.ok) {
                setSchedule(data.schedule);
                setIsLoggedIn(true);
            } else {
                setError(data.error || '登入失敗');
            }
        } catch (err) {
            setError('網路錯誤，請稍後再試');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setSchedule(null);
        setIsLoggedIn(false);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    東華大學課表查詢系統
                </h1>

                {!isLoggedIn ? (
                    <LoginForm 
                        onLogin={handleLogin} 
                        isLoading={isLoading} 
                        error={error} 
                    />
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <button
                                onClick={handleLogout}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                登出
                            </button>
                        </div>
                        
                        <ScheduleDisplay 
                            schedule={schedule || []} 
                            isLoading={isLoading} 
                        />
                    </>
                )}
            </div>
        </div>
    );
}
