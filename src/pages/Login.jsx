import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaUniversity,
} from "react-icons/fa";
import { IoMdHelpCircle } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Validation logic here
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <FaUniversity className="text-2xl text-blue-600" />
            <h1 className="text-xl font-bold">Gestion LMD</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <MdLightMode className="text-yellow-300" />
            ) : (
              <MdDarkMode />
            )}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2">Connexion</h2>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Accédez à votre espace administrateur
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email ou Matricule
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 pl-10 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="exemple@univ.edu"
                  required
                />
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3 pl-10 pr-10 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="••••••••"
                  required
                />
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3.5 text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                "Se connecter"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-700"
            >
              <IoMdHelpCircle className="mr-1" />
              Besoin d'aide ? Contactez le support
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
