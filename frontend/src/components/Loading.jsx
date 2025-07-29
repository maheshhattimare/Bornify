import React from "react";
import {Gift, Cake, PartyPopper, Heart} from "lucide-react";

const Loading = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 z-50 transition-colors duration-300">
            {/* Floating Birthday Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-16 text-pink-200 dark:text-pink-800 opacity-40 animate-bounce">
                    <Gift className="w-6 h-6"/>
                </div>
                <div className="absolute top-32 right-20 text-purple-200 dark:text-purple-800 opacity-40 animate-pulse">
                    <Cake className="w-5 h-5"/>
                </div>
                <div className="absolute bottom-32 left-24 text-indigo-200 dark:text-indigo-800 opacity-40 animate-bounce delay-300">
                    <PartyPopper className="w-7 h-7"/>
                </div>
                <div className="absolute bottom-24 right-16 text-pink-200 dark:text-pink-800 opacity-40 animate-pulse delay-700">
                    <Heart className="w-4 h-4"/>
                </div>
                <div className="absolute top-1/3 left-8 text-purple-200 dark:text-purple-800 opacity-30 animate-bounce delay-1000">
                    <Gift className="w-4 h-4"/>
                </div>
                <div className="absolute bottom-1/3 right-8 text-indigo-200 dark:text-indigo-800 opacity-30 animate-pulse delay-500">
                    <Cake className="w-6 h-6"/>
                </div>
            </div>

            {/* Main Loading Content */}
            <div className="relative flex flex-col items-center space-y-6 animate-fadeIn">
                {/* Birthday Cake Icon */}
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                        <span className="text-white text-3xl filter drop-shadow-sm">
                            🎂
                        </span>
                    </div>

                    {/* Spinning Border */}
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 border-r-purple-400 border-b-indigo-400 rounded-full animate-spin"></div>
                </div>

                {/* Multi-layered Spinner */}
                <div className="relative">
                    {/* Outer Ring */}
                    <div className="w-16 h-16 border-3 border-gradient-to-r border-pink-200 dark:border-pink-800 border-t-pink-500 dark:border-t-pink-400 rounded-full animate-spin"></div>

                    {/* Inner Ring */}
                    <div className="absolute inset-2 w-12 h-12 border-3 border-purple-200 dark:border-purple-800 border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin animate-reverse"></div>

                    {/* Center Dot */}
                    <div className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
                </div>

                {/* App Name with Animation */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                        Bornify
                    </h1>
                    <div className="flex items-center justify-center space-x-1">
                        <span className="text-2xl animate-bounce">🎉</span>
                        <span className="text-lg animate-bounce delay-200">🎂</span>
                        <span className="text-xl animate-bounce delay-400">🎁</span>
                    </div>
                </div>

                {/* Loading Text with Dots Animation */}
                <div className="text-center space-y-3">
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Preparing your birthdays
                        <span className="inline-flex space-x-1 ml-1">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-200">.</span>
                            <span className="animate-bounce delay-400">.</span>
                        </span>
                    </p>

                    {/* Progress Dots */}
                    <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-600"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-800"></div>
                    </div>
                </div>

                {/* Subtle Tagline */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                    Never miss a special moment again ✨
                </p>
            </div>

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900"></div>
            </div>
        </div>
    );
};

export default Loading;
