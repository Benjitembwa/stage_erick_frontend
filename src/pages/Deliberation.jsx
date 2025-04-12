// src/pages/Deliberation.js
import { useState, useEffect } from "react";
import {
  FiAward,
  FiChevronDown,
  FiDownload,
  FiPrinter,
  FiFileText,
  FiCheck,
  FiX,
  FiBarChart2,
  FiUser,
  FiBook,
  FiLayers,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BulletinPDF from "../components/BulletinPDF";
import {
  fetchAllCourses,
  fetchAllGrades,
  fetchAllStudents,
  fetchTeachingUnits,
} from "../api/apiService";

// Constantes pour les promotions et semestres
const PROMOTIONS = ["L1 LMD", "L2 LMD", "L3 LMD", "M1", "M2"];
const SEMESTERS = ["S1", "S2"];

const Deliberation = () => {
  // États pour la gestion des données
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachingUnits, setTeachingUnits] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les filtres
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("");

  // États pour les résultats
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentBulletin, setCurrentBulletin] = useState(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const coursesRes = await fetchAllCourses();
        console.log(coursesRes.data);
        const unitsRes = await fetchTeachingUnits();
        console.log(unitsRes.data);
        const studentsRes = await fetchAllStudents();
        console.log(studentsRes.data);
        const gradesRes = await fetchAllGrades();
        console.log(gradesRes.data);

        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setTeachingUnits(unitsRes.data);
        setGrades(gradesRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculer les résultats lorsque les données ou les filtres changent
  useEffect(() => {
    if (!selectedPromotion) return;

    const calculateResults = () => {
      const promotionStudents = students.filter(
        (s) => s.promotion === selectedPromotion
      );

      const resultsData = promotionStudents.map((student) => {
        // Filtrer les notes selon le semestre sélectionné
        let studentGrades = grades.filter(
          (g) =>
            g.student._id === student._id && g.promotion === selectedPromotion
        );

        if (selectedSemester !== "all") {
          studentGrades = studentGrades.filter(
            (g) => g.semester === selectedSemester
          );
        }

        // Grouper par UE et calculer les moyennes
        const ueResults = teachingUnits
          .filter(
            (ue) =>
              ue.promotion === selectedPromotion &&
              (selectedSemester === "all" || ue.semester === selectedSemester)
          )
          .map((ue) => {
            const ueCourses = courses.filter(
              (c) => c.teachingUnit._id === ue._id
            );

            const ueGrades = studentGrades
              .filter((g) => ueCourses.some((c) => c._id === g.course.id))
              .map((g) => {
                const course = courses.find((c) => c._id === g.course.id);
                return { ...g, credits: course?.credits || 0 };
              });

            // Calculer la moyenne de l'UE
            let ueAverage = 0;
            let totalCredits = 0;
            let allCoursesValid = true;

            ueGrades.forEach((grade) => {
              ueAverage += grade.grade * grade.credits;
              totalCredits += grade.credits;
              if (grade.grade < 10) allCoursesValid = false;
            });

            ueAverage = totalCredits > 0 ? ueAverage / totalCredits : 0;

            const hasGrades = ueGrades.length > 0;

            return {
              ueId: ue._id,
              ueName: ue.name,
              unitId: ue.unitId,
              semester: ue.semester,
              credits: ueCourses.reduce((sum, c) => sum + c.credits, 0),
              average: ueAverage,
              isValid: hasGrades && (ueAverage >= 10 || allCoursesValid), // ← correction ici
              courses: ueCourses.map((course) => {
                const grade = studentGrades.find(
                  (g) => g.course.id === course._id
                );
                return {
                  courseId: course._id,
                  courseName: course.name,
                  courseCode: course.courseCode,
                  grade: grade?.grade || 0,
                  credits: course.credits,
                  isValid: (grade?.grade || 0) >= 10,
                };
              }),
            };
          });

        // Calculer les totaux
        const validatedCredits = ueResults
          .filter((ue) => ue.isValid)
          .reduce((sum, ue) => sum + ue.credits, 0);

        const totalPossibleCredits = ueResults.reduce(
          (sum, ue) => sum + ue.credits,
          0
        );

        // Calculer la moyenne générale
        let generalAverage = 0;
        let totalWeight = 0;

        ueResults.forEach((ue) => {
          generalAverage += ue.average * ue.credits;
          totalWeight += ue.credits;
        });

        generalAverage = totalWeight > 0 ? generalAverage / totalWeight : 0;

        // Décision finale
        let decision = "NV"; // Non Validé par défaut
        if (selectedSemester === "all") {
          // Décision annuelle (75% des crédits)
          const totalAnnualCredits = teachingUnits
            .filter((ue) => ue.promotion === selectedPromotion)
            .reduce((sum, ue) => {
              const ueCourses = courses.filter(
                (c) => c.teachingUnit._id === ue._id
              );
              return sum + ueCourses.reduce((sum, c) => sum + c.credits, 0);
            }, 0);

          decision = validatedCredits >= totalAnnualCredits * 0.75 ? "V" : "NV";
        } else {
          // Décision semestrielle
          decision = validatedCredits === totalPossibleCredits ? "V" : "NV";
        }

        return {
          studentId: student._id,
          studentName: `${student.lastName} ${student.firstName}`,
          studentPostName: student.postName || "",
          studentIdNumber: student.studentId,
          promotion: selectedPromotion,
          semester: selectedSemester,
          ueResults,
          validatedCredits,
          totalPossibleCredits,
          generalAverage,
          decision,
        };
      });

      // Calculer les statistiques
      const totalStudents = resultsData.length;
      const passedStudents = resultsData.filter(
        (r) => r.decision === "V"
      ).length;
      const failedStudents = totalStudents - passedStudents;

      setStats({
        totalStudents,
        passedStudents,
        failedStudents,
        passRate:
          totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0,
      });

      setResults(resultsData);

      // Si un étudiant est sélectionné, mettre à jour son bulletin
      if (selectedStudent) {
        const bulletin = resultsData.find(
          (r) => r.studentId === selectedStudent
        );
        setCurrentBulletin(bulletin);
      }
    };

    calculateResults();
  }, [
    selectedPromotion,
    selectedSemester,
    selectedStudent,
    students,
    courses,
    teachingUnits,
    grades,
  ]);

  // Gérer la sélection d'un étudiant pour voir son bulletin
  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    const bulletin = results.find((r) => r.studentId === studentId);
    setCurrentBulletin(bulletin);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Délibération
      </h1>

      {/* Contrôles de filtrage */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              className="appearance-none pl-3 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPromotion}
              onChange={(e) => {
                setSelectedPromotion(e.target.value);
                setSelectedStudent("");
                setCurrentBulletin(null);
              }}
            >
              <option value="">Sélectionner une promotion</option>
              {PROMOTIONS.map((promo) => (
                <option key={promo} value={promo}>
                  {promo}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>

          <div className="relative w-full sm:w-48">
            <select
              className="appearance-none pl-3 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setSelectedStudent("");
                setCurrentBulletin(null);
              }}
              disabled={!selectedPromotion}
            >
              <option value="all">Tous semestres</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : selectedPromotion ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Statistiques */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiBarChart2 className="mr-2" /> Statistiques
              </h2>

              {stats && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      Total étudiants:
                    </span>
                    <span className="font-medium">{stats.totalStudents}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      Réussite:
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {stats.passedStudents} ({stats.passRate.toFixed(1)}%)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      Échec:
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {stats.failedStudents}
                    </span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {selectedSemester === "all"
                        ? "Résultats annuels"
                        : selectedSemester}
                    </h3>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${stats.passRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Liste des étudiants */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-6 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <FiUser className="mr-2" /> Étudiants
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result) => (
                  <motion.div
                    key={result.studentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedStudent === result.studentId
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : ""
                    }`}
                    onClick={() => handleStudentSelect(result.studentId)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{result.studentName}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          result.decision === "V"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {result.decision === "V" ? "Validé" : "Non validé"}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        Crédits: {result.validatedCredits}/
                        {result.totalPossibleCredits}
                      </span>
                      <span>Moy: {result.generalAverage.toFixed(2)}/20</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bulletin détaillé */}
          <div className="lg:col-span-2">
            {currentBulletin ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Bulletin{" "}
                        {selectedSemester === "all"
                          ? "Annuel"
                          : selectedSemester}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {currentBulletin.studentName}{" "}
                        {currentBulletin.studentPostName &&
                          currentBulletin.studentPostName}{" "}
                        - {currentBulletin.promotion}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Matricule: {currentBulletin.studentIdNumber}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <PDFDownloadLink
                        document={<BulletinPDF data={currentBulletin} />}
                        fileName={`bulletin_${currentBulletin.studentName}_${
                          selectedSemester === "all"
                            ? "annuel"
                            : selectedSemester.toLowerCase()
                        }.pdf`}
                      >
                        {({ loading }) => (
                          <button
                            className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                            disabled={loading}
                          >
                            <FiDownload className="mr-2" />
                            {loading ? "Génération..." : "PDF"}
                          </button>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </div>

                  {/* Résumé */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Moyenne Générale
                      </p>
                      <p className="text-2xl font-bold">
                        {currentBulletin.generalAverage.toFixed(2)}/20
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Crédits Validés
                      </p>
                      <p className="text-2xl font-bold">
                        {currentBulletin.validatedCredits}/
                        {currentBulletin.totalPossibleCredits}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Décision
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          currentBulletin.decision === "V"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {currentBulletin.decision === "V"
                          ? "Validé"
                          : "Non validé"}
                      </p>
                    </div>
                  </div>

                  {/* Détails par UE */}
                  <div className="space-y-6">
                    {currentBulletin.ueResults.map((ue) => (
                      <div
                        key={ue.ueId}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div
                          className={`flex justify-between items-center p-4 ${
                            ue.isValid
                              ? "bg-green-50 dark:bg-green-900/30"
                              : "bg-red-50 dark:bg-red-900/30"
                          }`}
                        >
                          <div>
                            <h3 className="font-medium">
                              {ue.ueName} ({ue.unitId})
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {ue.semester} - {ue.credits} crédits
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                ue.isValid
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {ue.average.toFixed(2)}/20
                            </p>
                            <p className="text-xs">
                              {ue.isValid ? "Validée" : "Non validée"}
                            </p>
                          </div>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {ue.courses.map((course) => (
                            <div
                              key={course.courseId}
                              className="grid grid-cols-12 p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <div className="col-span-6">
                                <p className="text-sm">{course.courseName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {course.courseCode}
                                </p>
                              </div>
                              <div className="col-span-3 text-right">
                                <p className="text-sm">
                                  {course.credits} crédits
                                </p>
                              </div>
                              <div className="col-span-3 text-right">
                                <p
                                  className={`text-sm font-medium ${
                                    course.isValid
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {course.grade}/20
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Décision finale */}
                  {selectedSemester === "all" && (
                    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-2">Décision finale</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {currentBulletin.decision === "V" ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            <FiCheck className="inline mr-1" />
                            L'étudiant passe en année supérieure (a validé au
                            moins 75% des crédits).
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            <FiX className="inline mr-1" />
                            L'étudiant ne valide pas son année (doit reprendre).
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                <FiFileText className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Aucun étudiant sélectionné
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Sélectionnez un étudiant dans la liste pour afficher son
                  bulletin
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <FiAward className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Aucune promotion sélectionnée
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Sélectionnez une promotion pour commencer la délibération
          </p>
        </div>
      )}
    </div>
  );
};

export default Deliberation;
