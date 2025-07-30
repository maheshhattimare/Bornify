import { useState } from "react";

const LandingPage = () => {
  return (
    <div>
      <div className="bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-black min-h-screen transition-colors duration-300">
        {/* Navigation */}
        <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎂</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Bornify
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 hidden rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <span className="text-gray-600 dark:text-gray-300">
                    {/* {isDark ? "☀️" : "🌙"} */}
                  </span>
                </button>
                <a href="/signup">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white rounded-lg font-medium shadow-md">
                    Get Started
                  </button>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🎂</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white mb-6">
                Celebrate Every
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                  {" "}
                  Birthday
                </span>
                , Every Time 🎉
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Life is made of special moments. With Bornify, you’ll never
                forget to celebrate your loved ones — set reminders, get emails,
                and make every birthday unforgettable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/signup">
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white rounded-lg font-semibold shadow-md">
                    Start Tracking Birthdays
                  </button>
                </a>
                <button className="px-8 py-3 border hidden border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium">
                  Learn More
                </button>
              </div>
            </div>

            {/* Demo Video */}
            <div className="mt-10 aspect-video max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="Bornify Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                A Simple Way to Show You Care ❤️
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Bornify makes it effortless to remember and celebrate the people
                who matter most in your life.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Email Reminders
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Receive a friendly email reminder ahead of every special day
                  you choose.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Custom Timing
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Decide how far in advance you want to be reminded — your
                  schedule, your choice.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Private & Secure
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data stays with you — we only use it to send timely
                  reminders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Make Every Birthday Special?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              It only takes a minute to set up your first reminder.
            </p>
            <a href="/signup">
              <button className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium shadow-md">
                Get Started for Free
              </button>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-white/70 dark:bg-gray-800/70 border-t border-gray-200 dark:border-gray-700 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">🎂</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Bornify
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © 2025 Bornify. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default LandingPage;
