import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from "lucide-react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isToday,
    addMonths,
    subMonths,
} from "date-fns";
import { useData, CalendarEvent } from "../contexts/DataContext";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";

const Calendar: React.FC = () => {
    const { events, addEvent, updateEvent, deleteEvent } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        startTime: string;
        endTime: string;
        type: "event" | "meeting" | "task";
        description: string;
    }>({
        title: "",
        startTime: "",
        endTime: "",
        type: "event",
        description: "",
    });

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getEventsForDate = (date: Date) => {
        return events.filter((event) => isSameDay(event.date, date));
    };

    const handleAddEvent = (date?: Date) => {
        setEditingEvent(null);
        setSelectedDate(date || new Date());
        setFormData({
            title: "",
            startTime: "",
            endTime: "",
            type: "event",
            description: "",
        });
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event);
        setSelectedDate(event.date);
        setFormData({
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            type: event.type,
            description: event.description || "",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        const eventData = {
            ...formData,
            date: selectedDate,
        };

        if (editingEvent) {
            updateEvent(editingEvent.id, eventData);
        } else {
            addEvent(eventData);
        }
        setIsModalOpen(false);
    };

    const getEventTypeColor = (type: CalendarEvent["type"]) => {
        switch (type) {
            case "meeting":
                return "bg-blue-500";
            case "task":
                return "bg-green-500";
            case "event":
                return "bg-purple-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Calendar
                </h1>
                <button
                    onClick={() => handleAddEvent()}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                </button>
            </div>
            <Card>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {format(currentDate, "MMMM yyyy")}
                        </h2>
                        <button
                            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {monthDays.map((day) => {
                            const dayEvents = getEventsForDate(day);
                            const isCurrentDay = isToday(day);

                            return (
                                <motion.div
                                    key={day.toISOString()}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleAddEvent(day)}
                                    className={`p-2 min-h-[80px] border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-colors ${
                                        isCurrentDay
                                            ? "bg-primary-50 dark:bg-primary-900 border-primary-200 dark:border-primary-700"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <div
                                        className={`text-sm font-medium mb-1 ${
                                            isCurrentDay
                                                ? "text-primary-600 dark:text-primary-400"
                                                : "text-gray-900 dark:text-white"
                                        }`}
                                    >
                                        {format(day, "d")}
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.slice(0, 2).map((event) => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditEvent(event);
                                                }}
                                                className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(
                                                    event.type
                                                )}`}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </Card>
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Upcoming Events
                    </h3>
                    <div className="space-y-3">
                        {events.slice(0, 5).map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${getEventTypeColor(
                                            event.type
                                        )}`}
                                    ></div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {event.title}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {format(event.date, "MMM d")} •{" "}
                                            {event.startTime} - {event.endTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditEvent(event)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEvent ? "Edit Event" : "Add New Event"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Time
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.startTime}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        startTime: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Time
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.endTime}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        endTime: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    type: e.target.value as CalendarEvent["type"],
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="event">Event</option>
                            <option value="meeting">Meeting</option>
                            <option value="task">Task</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            {editingEvent ? "Update" : "Add"} Event
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Calendar;
