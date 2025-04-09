// src/components/Header.js
import { FiSun, FiMoon, FiUser, FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";
import mobile from "../assets/mobile.png";
import desktop from "../assets/desktop.png";

const Header = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          >
            <FiMenu className="text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center">
            <div className="block md:hidden">
              <img src={mobile} alt="logo" className="h-8 w-auto mr-2" />
            </div>
            <div className="hidden md:block">
              <img src={mobile} alt="logo" className="h-8 w-auto mr-2" />
            </div>

            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              LMD Physics
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <FiUser className="text-white" />
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium hidden md:inline">
              Admin
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
