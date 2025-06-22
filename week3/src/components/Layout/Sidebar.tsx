import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	Home,
	Table,
	Calendar,
	Kanban,
	Settings,
	X,
	BarChart3,
} from "lucide-react";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: Home },
	{ name: "Tables", href: "/tables", icon: Table },
	{ name: "Calendar", href: "/calendar", icon: Calendar },
	{ name: "Kanban", href: "/kanban", icon: Kanban },
	{ name: "Settings", href: "/settings", icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
	const location = useLocation();

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
					/>
				)}
			</AnimatePresence>

			<motion.div
				initial={{ x: -280 }}
				animate={{ x: isOpen ? 0 : -280 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl lg:translate-x-0 lg:absolute lg:inset-0"
			>
				<div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center space-x-2">
						<BarChart3 className="h-8 w-8 text-primary-600" />
						<span className="text-xl font-bold text-gray-900 dark:text-white">
							AdminHub
						</span>
					</div>
					<button
						onClick={onClose}
						className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<nav className="px-4 py-6 space-y-2">
					{navigation.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.href;

						return (
							<Link
								key={item.name}
								to={item.href}
								onClick={onClose}
								className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
									isActive
										? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
										: "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
								}`}
							>
								<Icon className="mr-3 h-5 w-5" />
								{item.name}
							</Link>
						);
					})}
				</nav>
			</motion.div>
		</>
	);
};

export default Sidebar;
