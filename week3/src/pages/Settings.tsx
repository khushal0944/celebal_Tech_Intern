import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import Card from "../components/UI/Card";

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Theme Preferences
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Dark Mode
                                </label>
                                <button
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        theme === "dark"
                                            ? "bg-primary-600"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            theme === "dark"
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Account Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Admin User"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    defaultValue="admin@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Role
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    <option>Super Admin</option>
                                    <option>Admin</option>
                                    <option>User</option>
                                </select>
                            </div>
                            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    label: "Email Notifications",
                                    description:
                                        "Receive email notifications for important updates",
                                },
                                {
                                    label: "Push Notifications",
                                    description:
                                        "Receive push notifications in your browser",
                                },
                                {
                                    label: "SMS Notifications",
                                    description:
                                        "Receive SMS notifications for urgent matters",
                                },
                                {
                                    label: "Calendar Reminders",
                                    description:
                                        "Get reminders for upcoming events",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {item.label}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {item.description}
                                        </p>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            System Information
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Version
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    1.0.0
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Last Updated
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    Dec 20, 2024
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Build
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    #1234
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Environment
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    Production
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
