'use client';

import { useState } from 'react';

interface LoginFormProps {
    onLogin: (username: string, password: string, combine: boolean) => Promise<void>;
    isLoading: boolean;
    error?: string;
}

export default function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [combine, setCombine] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            return;
        }
        await onLogin(username, password, combine);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                東華大學課表登入
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        學號
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="請輸入學號"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        密碼
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="請輸入密碼"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        課表顯示模式
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="combine-true"
                                name="combine"
                                checked={combine}
                                onChange={() => setCombine(true)}
                                className="mr-2"
                                disabled={isLoading}
                            />
                            <label htmlFor="combine-true" className="text-sm text-gray-700 cursor-pointer">
                                <strong>合併模式</strong> - 相同課程合併顯示時間範圍
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="combine-false"
                                name="combine"
                                checked={!combine}
                                onChange={() => setCombine(false)}
                                className="mr-2"
                                disabled={isLoading}
                            />
                            <label htmlFor="combine-false" className="text-sm text-gray-700 cursor-pointer">
                                <strong>分割模式</strong> - 每個時段獨立顯示課程
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !username.trim() || !password.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? "登入中..." : "登入"}
                </button>
            </form>
        </div>
    );
}