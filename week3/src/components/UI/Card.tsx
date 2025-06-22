import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
	return (
		<motion.div
			whileHover={hover ? { y: -2 } : undefined}
			className={clsx(
				"bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
				hover && "transition-shadow hover:shadow-md",
				className
			)}
		>
			{children}
		</motion.div>
	);
};

export default Card;
