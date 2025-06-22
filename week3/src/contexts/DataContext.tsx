import React, { createContext, useContext, useState } from "react";

export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	status: "active" | "inactive";
	createdAt: string;
}

export interface CalendarEvent {
	id: string;
	title: string;
	date: Date;
	startTime: string;
	endTime: string;
	type: "meeting" | "task" | "event";
	description?: string;
}

export interface KanbanTask {
	id: string;
	title: string;
	description: string;
	status: "todo" | "in-progress" | "review" | "done";
	priority: "low" | "medium" | "high";
	assignee: string;
	dueDate?: string;
}

interface DataContextType {
	users: User[];
	events: CalendarEvent[];
	tasks: KanbanTask[];
	addUser: (user: Omit<User, "id">) => void;
	updateUser: (id: string, user: Partial<User>) => void;
	deleteUser: (id: string) => void;
	addEvent: (event: Omit<CalendarEvent, "id">) => void;
	updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
	deleteEvent: (id: string) => void;
	addTask: (task: Omit<KanbanTask, "id">) => void;
	updateTask: (id: string, task: Partial<KanbanTask>) => void;
	deleteTask: (id: string) => void;
	moveTask: (id: string, newStatus: KanbanTask["status"]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
	const context = useContext(DataContext);
	if (context === undefined) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [users, setUsers] = useState<User[]>([
		{
			id: "1",
			name: "John Doe",
			email: "john@example.com",
			role: "Admin",
			status: "active",
			createdAt: "2024-01-15",
		},
		{
			id: "2",
			name: "Jane Smith",
			email: "jane@example.com",
			role: "User",
			status: "active",
			createdAt: "2024-01-20",
		},
		{
			id: "3",
			name: "Bob Johnson",
			email: "bob@example.com",
			role: "Editor",
			status: "inactive",
			createdAt: "2024-02-01",
		},
		{
			id: "4",
			name: "Alice Williams",
			email: "alice@example.com",
			role: "User",
			status: "active",
			createdAt: "2024-02-10",
		},
	]);

	const [events, setEvents] = useState<CalendarEvent[]>([
		{
			id: "1",
			title: "Team Meeting",
			date: new Date(2024, 11, 25),
			startTime: "09:00",
			endTime: "10:00",
			type: "meeting",
		},
		{
			id: "2",
			title: "Product Launch",
			date: new Date(2024, 11, 28),
			startTime: "14:00",
			endTime: "16:00",
			type: "event",
		},
		{
			id: "3",
			title: "Code Review",
			date: new Date(2024, 11, 30),
			startTime: "11:00",
			endTime: "12:00",
			type: "task",
		},
	]);

	const [tasks, setTasks] = useState<KanbanTask[]>([
		{
			id: "1",
			title: "Design System Update",
			description: "Update the design system components",
			status: "todo",
			priority: "high",
			assignee: "John Doe",
		},
		{
			id: "2",
			title: "API Integration",
			description: "Integrate payment API",
			status: "in-progress",
			priority: "medium",
			assignee: "Jane Smith",
		},
		{
			id: "3",
			title: "User Testing",
			description: "Conduct user testing sessions",
			status: "review",
			priority: "low",
			assignee: "Bob Johnson",
		},
		{
			id: "4",
			title: "Documentation",
			description: "Update project documentation",
			status: "done",
			priority: "medium",
			assignee: "Alice Williams",
		},
	]);

	const addUser = (user: Omit<User, "id">) => {
		const newUser = { ...user, id: Date.now().toString() };
		setUsers((prev) => [...prev, newUser]);
	};

	const updateUser = (id: string, updatedUser: Partial<User>) => {
		setUsers((prev) =>
			prev.map((user) =>
				user.id === id ? { ...user, ...updatedUser } : user
			)
		);
	};

	const deleteUser = (id: string) => {
		setUsers((prev) => prev.filter((user) => user.id !== id));
	};

	const addEvent = (event: Omit<CalendarEvent, "id">) => {
		const newEvent = { ...event, id: Date.now().toString() };
		setEvents((prev) => [...prev, newEvent]);
	};

	const updateEvent = (id: string, updatedEvent: Partial<CalendarEvent>) => {
		setEvents((prev) =>
			prev.map((event) =>
				event.id === id ? { ...event, ...updatedEvent } : event
			)
		);
	};

	const deleteEvent = (id: string) => {
		setEvents((prev) => prev.filter((event) => event.id !== id));
	};

	const addTask = (task: Omit<KanbanTask, "id">) => {
		const newTask = { ...task, id: Date.now().toString() };
		setTasks((prev) => [...prev, newTask]);
	};

	const updateTask = (id: string, updatedTask: Partial<KanbanTask>) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === id ? { ...task, ...updatedTask } : task
			)
		);
	};

	const deleteTask = (id: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
	};

	const moveTask = (id: string, newStatus: KanbanTask["status"]) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === id ? { ...task, status: newStatus } : task
			)
		);
	};

	return (
		<DataContext.Provider
			value={{
				users,
				events,
				tasks,
				addUser,
				updateUser,
				deleteUser,
				addEvent,
				updateEvent,
				deleteEvent,
				addTask,
				updateTask,
				deleteTask,
				moveTask,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};
