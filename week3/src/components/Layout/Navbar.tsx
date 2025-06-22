import React from "react";
import { Bell, Menu, Moon, Sun, User } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Home, Table, Calendar, Kanban, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
	onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
	const { theme, toggleTheme } = useTheme();

	const navigation = [
		{ name: "Dashboard", href: "/dashboard", icon: Home },
		{ name: "Tables", href: "/tables", icon: Table },
		{ name: "Calendar", href: "/calendar", icon: Calendar },
		{ name: "Kanban", href: "/kanban", icon: Kanban },
		{ name: "Settings", href: "/settings", icon: Settings },
	];

	return (
		<header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
			<div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center">
					<button
						onClick={onMenuClick}
						className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<Menu className="h-5 w-5" />
					</button>
					<Link to={"/dashboard"} className="ml-2 text-xl font-semibold text-gray-900 dark:text-white lg:ml-0">
						Dashboard
					</Link>
				</div>

				<nav className="lg:flex gap-4 hidden">
					{navigation.map((item) => {
						const Icon = item.icon;

						return (
							<Link
								key={item.name}
								to={item.href}
								className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
							>
								<Icon className="mr-2 h-5 w-5" />
								{item.name}
							</Link>
						);
					})}
				</nav>

				<div className="flex items-center space-x-4">
					<button
						onClick={toggleTheme}
						className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
					>
						{theme === "light" ? (
							<Moon className="h-5 w-5" />
						) : (
							<Sun className="h-5 w-5" />
						)}
					</button>

					<button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors">
						<Bell className="h-5 w-5" />
					</button>

					<div className="relative">
						<button className="flex items-center space-x-2 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors">
							<User className="h-5 w-5" />
							<span className="hidden sm:block text-sm font-medium">
								Admin
							</span>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
