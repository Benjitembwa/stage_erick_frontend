import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiLayers,
  FiFileText,
  FiAward,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import TeachingUnits from "./pages/TeachingUnits";
import Grades from "./pages/Grades";
import Deliberation from "./pages/Deliberation";
import Login from "./pages/Login";
import useDarkMode from "./hooks/useDarkMode";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth > 768;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [darkMode, setDarkMode] = useDarkMode();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/" },
    { name: "Étudiants", icon: FiUsers, path: "/students" },
    { name: "Cours", icon: FiBook, path: "/courses" },
    { name: "Unités Enseignement", icon: FiLayers, path: "/teaching-units" },
    { name: "Notes", icon: FiFileText, path: "/grades" },
    { name: "Délibération", icon: FiAward, path: "/deliberation" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fonction pour gérer la connexion (à appeler depuis la page Login)
  const handleLogin = () => {
    setIsAuthenticated(true);
    return <Navigate to="/" />;
  };

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      <Router>
        <Routes>
          {/* Route spéciale pour le login (sans layout) */}
          <Route
            path="/login"
            element={
              <div className="w-full h-full">
                <Login onLogin={handleLogin} />
              </div>
            }
          />

          {/* Routes protégées */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <div className="flex w-full h-full">
                  {/* Sidebar */}
                  <Sidebar
                    navItems={navItems}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isMobile={isMobile}
                  />

                  {/* Contenu principal */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                      {isMobile && sidebarOpen && (
                        <div
                          className="fixed inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm z-20"
                          onClick={() => setSidebarOpen(false)}
                        />
                      )}

                      <AnimatePresence exitBeforeEnter>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/students" element={<Students />} />
                          <Route path="/courses" element={<Courses />} />
                          <Route
                            path="/teaching-units"
                            element={<TeachingUnits />}
                          />
                          <Route path="/grades" element={<Grades />} />
                          <Route
                            path="/deliberation"
                            element={<Deliberation />}
                          />
                          <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                      </AnimatePresence>
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
