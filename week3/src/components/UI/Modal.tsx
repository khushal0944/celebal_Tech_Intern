import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={onClose}
							className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
						/>

						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									{title}
								</h3>
								<button
									onClick={onClose}
									className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
							{children}
						</motion.div>
					</div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
