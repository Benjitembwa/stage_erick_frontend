// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import {
  FiUsers,
  FiBook,
  FiLayers,
  FiAward,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchAllStats } from "../api/apiService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await fetchAllStats();
        console.log("Réponse brute de l'API:", res); // Ajoute ce log

        const data = res;

        setStats({
          totalStudents: data.totalStudents,
          totalCourses: data.totalCourses,
          totalTeachingUnits: data.totalTeachingUnits,
          passedStudents: data.passedStudents,
          failedStudents: data.failedStudents,
        });
        console.log(data.perPromotion);
        setBarChartData(data.promotionStats); // structure : [{ name: "L1 LMD", students: X, passed: Y }]
        setPieChartData([
          { name: "Validés l'année", value: data.passedStudents },
          { name: "Non validés l'année", value: data.failedStudents },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
      }
    };

    fetchStatistics();
  }, []);

  const COLORS = ["#0088FE", "#FF8042"];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Tableau de Bord
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Cartes de Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Étudiants</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.totalStudents}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <FiUsers className="text-blue-600 dark:text-blue-300 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Cours</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.totalCourses}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <FiBook className="text-green-600 dark:text-green-300 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">UE</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.totalTeachingUnits}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <FiLayers className="text-purple-600 dark:text-purple-300 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Validés l'année
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.passedStudents}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900">
                  <FiTrendingUp className="text-teal-600 dark:text-teal-300 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Non validés l'année
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.failedStudents}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                  <FiTrendingDown className="text-red-600 dark:text-red-300 text-xl" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Performance par Promotion
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="students"
                      fill="#8884d8"
                      name="Total Étudiants"
                    />
                    <Bar
                      dataKey="passed"
                      fill="#82ca9d"
                      name="Validés l'année"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Taux de Réussite
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
