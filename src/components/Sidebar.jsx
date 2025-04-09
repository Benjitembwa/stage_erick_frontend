// src/components/Sidebar.js
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = ({ navItems, sidebarOpen, setSidebarOpen, isMobile }) => {
  const sidebarVariants = {
    open: {
      width: 240,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      width: isMobile ? 0 : 72,
      x: isMobile ? -240 : 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <>
      <motion.aside
        initial={sidebarOpen ? "open" : "closed"}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`flex flex-col h-full bg-white dark:bg-gray-800 shadow-md fixed md:relative z-30`}
      >
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-6 flex items-center justify-between">
            {sidebarOpen ? (
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Menu
              </h2>
            ) : (
              <div className="w-8 h-8 mx-auto bg-blue-500 rounded-lg"></div>
            )}

            {!isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 dark:text-gray-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 dark:text-gray-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>

          <nav className="px-2">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <item.icon className="text-xl min-w-[24px]" />
                <motion.span
                  variants={itemVariants}
                  className="ml-3 font-medium whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
