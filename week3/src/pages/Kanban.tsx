import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Edit2, Trash2, Clock, User } from "lucide-react";
import { useData, KanbanTask } from "../contexts/DataContext";
import Modal from "../components/UI/Modal";

const Kanban: React.FC = () => {
	const { tasks, addTask, updateTask, deleteTask, moveTask } = useData();
	const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
	const [formData, setFormData] = useState<{
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		assignee: string;
		dueDate: string;
		status: KanbanTask["status"];
	}>({
		title: "",
		description: "",
		priority: "medium",
		assignee: "",
		dueDate: "",
		status: "todo",
	});

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const columns = [
		{ id: "todo", title: "To Do", color: "bg-gray-100 dark:bg-gray-700" },
		{
			id: "in-progress",
			title: "In Progress",
			color: "bg-blue-100 dark:bg-blue-900",
		},
		{
			id: "review",
			title: "Review",
			color: "bg-orange-100 dark:bg-orange-900",
		},
		{ id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900" },
	];

	const handleDragStart = (event: DragStartEvent) => {
		const task = tasks.find((t) => t.id === event.active.id);
		setActiveTask(task || null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveTask(null);

		if (!over) return;

		const taskId = active.id as string;
		const newStatus = over.id as KanbanTask["status"];

		if (columns.find((col) => col.id === newStatus)) {
			moveTask(taskId, newStatus);
		}
	};

	const handleAddTask = (status: KanbanTask["status"]) => {
		setEditingTask(null);
		setFormData({
			title: "",
			description: "",
			priority: "medium",
			assignee: "",
			dueDate: "",
			status, // set the status here
		});
		setIsModalOpen(true);
	};

	const handleEditTask = (task: KanbanTask) => {
		setEditingTask(task);
		setFormData({
			title: task.title,
			description: task.description,
			priority: task.priority,
			assignee: task.assignee,
			dueDate: task.dueDate || "",
			status: task.status, // make sure to include status here as well
		});
		setIsModalOpen(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const taskData = {
			...formData,
			dueDate: formData.dueDate || undefined,
		};

		if (editingTask) {
			updateTask(editingTask.id, taskData);
		} else {
			addTask(taskData); // use status from formData
		}
		setIsModalOpen(false);
	};

	const getPriorityColor = (priority: KanbanTask["priority"]) => {
		switch (priority) {
			case "high":
				return "bg-red-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Kanban Board
				</h1>
				<button
					onClick={() => handleAddTask("todo")}
					className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Task
				</button>
			</div>

			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{columns.map((column) => (
						<KanbanColumn
							key={column.id}
							column={column}
							tasks={tasks.filter(
								(task) => task.status === column.id
							)}
							onEditTask={handleEditTask}
							onDeleteTask={deleteTask}
							onAddTask={() =>
								handleAddTask(column.id as KanbanTask["status"])
							}
							getPriorityColor={getPriorityColor}
						/>
					))}
				</div>

				<DragOverlay>
					{activeTask ? (
						<TaskCard
							task={activeTask}
							onEdit={() => {}}
							onDelete={() => {}}
							getPriorityColor={getPriorityColor}
							isDragging
						/>
					) : null}
				</DragOverlay>
			</DndContext>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editingTask ? "Edit Task" : "Add New Task"}
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
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Priority
							</label>
							<select
								value={formData.priority}
								onChange={(e) =>
									setFormData({
										...formData,
										priority: e.target
											.value as KanbanTask["priority"],
									})
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Due Date
							</label>
							<input
								type="date"
								value={formData.dueDate}
								onChange={(e) =>
									setFormData({
										...formData,
										dueDate: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Assignee
						</label>
						<input
							type="text"
							value={formData.assignee}
							onChange={(e) =>
								setFormData({
									...formData,
									assignee: e.target.value,
								})
							}
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
							{editingTask ? "Update" : "Add"} Task
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

interface KanbanColumnProps {
	column: { id: string; title: string; color: string };
	tasks: KanbanTask[];
	onEditTask: (task: KanbanTask) => void;
	onDeleteTask: (id: string) => void;
	onAddTask: () => void;
	getPriorityColor: (priority: KanbanTask["priority"]) => string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
	column,
	tasks,
	onEditTask,
	onDeleteTask,
	onAddTask,
	getPriorityColor,
}) => {
	const { setNodeRef } = useSortable({
		id: column.id,
	});

	return (
		<div ref={setNodeRef} className="flex flex-col">
			<div className={`p-4 rounded-t-lg ${column.color}`}>
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-gray-900 dark:text-white">
						{column.title}
					</h3>
					<span className="text-sm text-gray-600 dark:text-gray-400">
						{tasks.length}
					</span>
				</div>
			</div>

			<div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-b-lg p-4 min-h-[400px]">
				<SortableContext
					items={tasks.map((task) => task.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-3">
						{tasks.map((task) => (
							<TaskCard
								key={task.id}
								task={task}
								onEdit={() => onEditTask(task)}
								onDelete={() => onDeleteTask(task.id)}
								getPriorityColor={getPriorityColor}
							/>
						))}
					</div>
				</SortableContext>

				<button
					onClick={onAddTask}
					className="w-full mt-3 p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
				>
					<Plus className="h-4 w-4 mx-auto" />
				</button>
			</div>
		</div>
	);
};

interface TaskCardProps {
	task: KanbanTask;
	onEdit: () => void;
	onDelete: () => void;
	getPriorityColor: (priority: KanbanTask["priority"]) => string;
	isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
	task,
	onEdit,
	onDelete,
	getPriorityColor,
	isDragging = false,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			whileHover={{ scale: 1.02 }}
			className={`bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing ${
				isDragging ? "opacity-50" : ""
			}`}
		>
			<div className="flex items-start justify-between mb-2">
				<div
					className={`w-3 h-3 rounded-full ${getPriorityColor(
						task.priority
					)}`}
				></div>
				<div className="flex space-x-1">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onEdit();
						}}
						className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
					>
						<Edit2 className="h-3 w-3" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
					>
						<Trash2 className="h-3 w-3" />
					</button>
				</div>
			</div>

			<h4 className="font-medium text-gray-900 dark:text-white mb-2">
				{task.title}
			</h4>
			<p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
				{task.description}
			</p>

			<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
				<div className="flex items-center">
					<User className="h-3 w-3 mr-1" />
					{task.assignee}
				</div>
				{task.dueDate && (
					<div className="flex items-center">
						<Clock className="h-3 w-3 mr-1" />
						{task.dueDate}
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default Kanban;
