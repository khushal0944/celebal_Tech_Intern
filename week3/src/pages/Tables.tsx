import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit2, Trash2, Download } from "lucide-react";
import { useData, User } from "../contexts/DataContext";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";

const Tables: React.FC = () => {
	const { users, addUser, updateUser, deleteUser } = useData();
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<keyof User>("name");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [formData, setFormData] = useState<{
		name: string;
		email: string;
		role: string;
		status: "active" | "inactive";
	}>({
		name: "",
		email: "",
		role: "",
		status: "active",
	});

	const itemsPerPage = 5;

	const filteredAndSortedUsers = useMemo(() => {
		let filtered = users.filter(
			(user) =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.role.toLowerCase().includes(searchTerm.toLowerCase())
		);

		filtered.sort((a, b) => {
			const aValue = a[sortField];
			const bValue = b[sortField];
			if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
			if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});

		return filtered;
	}, [users, searchTerm, sortField, sortDirection]);

	const paginatedUsers = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredAndSortedUsers.slice(
			startIndex,
			startIndex + itemsPerPage
		);
	}, [filteredAndSortedUsers, currentPage]);

	const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

	const handleSort = (field: keyof User) => {
		if (field === sortField) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const handleAddUser = () => {
		setEditingUser(null);
		setFormData({ name: "", email: "", role: "", status: "active" });
		setIsModalOpen(true);
	};

	const handleEditUser = (user: User) => {
		setEditingUser(user);
		setFormData({
			name: user.name,
			email: user.email,
			role: user.role,
			status: user.status as "active" | "inactive",
		});
		setIsModalOpen(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingUser) {
			updateUser(editingUser.id, formData);
		} else {
			addUser({
				...formData,
				createdAt: new Date().toISOString().split("T")[0],
			});
		}
		setIsModalOpen(false);
	};

	const exportToCSV = () => {
		const csv = [
			["Name", "Email", "Role", "Status", "Created At"],
			...filteredAndSortedUsers.map((user) => [
				user.name,
				user.email,
				user.role,
				user.status,
				user.createdAt,
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "users.csv";
		a.click();
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					User Management
				</h1>
				<div className="flex space-x-2">
					<button
						onClick={exportToCSV}
						className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
					>
						<Download className="h-4 w-4 mr-2" />
						Export CSV
					</button>
					<button
						onClick={handleAddUser}
						className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						<Plus className="h-4 w-4 mr-2" />
						Add User
					</button>
				</div>
			</div>

			<Card>
				<div className="p-6">
					<div className="mb-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200 dark:border-gray-700">
									{[
										{ key: "name", label: "Name" },
										{ key: "email", label: "Email" },
										{ key: "role", label: "Role" },
										{ key: "status", label: "Status" },
										{ key: "createdAt", label: "Created" },
									].map(({ key, label }) => (
										<th
											key={key}
											onClick={() =>
												handleSort(key as keyof User)
											}
											className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
										>
											{label}
											{sortField === key && (
												<span className="ml-1">
													{sortDirection === "asc"
														? "↑"
														: "↓"}
												</span>
											)}
										</th>
									))}
									<th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedUsers.map((user, index) => (
									<motion.tr
										key={user.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.05 }}
										className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<td className="py-3 px-4 text-gray-900 dark:text-white">
											{user.name}
										</td>
										<td className="py-3 px-4 text-gray-600 dark:text-gray-300">
											{user.email}
										</td>
										<td className="py-3 px-4 text-gray-600 dark:text-gray-300">
											{user.role}
										</td>
										<td className="py-3 px-4">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													user.status === "active"
														? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
														: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
												}`}
											>
												{user.status}
											</span>
										</td>
										<td className="py-3 px-4 text-gray-600 dark:text-gray-300">
											{user.createdAt}
										</td>
										<td className="py-3 px-4 text-right">
											<div className="flex justify-end space-x-2">
												<button
													onClick={() =>
														handleEditUser(user)
													}
													className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
												>
													<Edit2 className="h-4 w-4" />
												</button>
												<button
													onClick={() =>
														deleteUser(user.id)
													}
													className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex items-center justify-between mt-6">
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
							{Math.min(
								currentPage * itemsPerPage,
								filteredAndSortedUsers.length
							)}{" "}
							of {filteredAndSortedUsers.length} results
						</div>
						<div className="flex space-x-2">
							<button
								onClick={() =>
									setCurrentPage((prev) =>
										Math.max(prev - 1, 1)
									)
								}
								disabled={currentPage === 1}
								className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								Previous
							</button>
							{Array.from(
								{ length: totalPages },
								(_, i) => i + 1
							).map((page) => (
								<button
									key={page}
									onClick={() => setCurrentPage(page)}
									className={`px-3 py-1 border rounded-lg transition-colors ${
										currentPage === page
											? "bg-primary-600 text-white border-primary-600"
											: "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
									}`}
								>
									{page}
								</button>
							))}
							<button
								onClick={() =>
									setCurrentPage((prev) =>
										Math.min(prev + 1, totalPages)
									)
								}
								disabled={currentPage === totalPages}
								className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								Next
							</button>
						</div>
					</div>
				</div>
			</Card>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editingUser ? "Edit User" : "Add New User"}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Name
						</label>
						<input
							type="text"
							required
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Email
						</label>
						<input
							type="email"
							required
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Role
						</label>
						<select
							required
							value={formData.role}
							onChange={(e) =>
								setFormData({
									...formData,
									role: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="">Select role</option>
							<option value="Admin">Admin</option>
							<option value="User">User</option>
							<option value="Editor">Editor</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Status
						</label>
						<select
							value={formData.status}
							onChange={(e) =>
								setFormData({
									...formData,
									status: e.target.value as
										| "active"
										| "inactive",
								})
							}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>
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
							{editingUser ? "Update" : "Add"} User
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default Tables;
