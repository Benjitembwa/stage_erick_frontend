// src/pages/Grades.js
import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiX,
  FiSave,
  FiUser,
  FiBook,
  FiAward,
  FiFilter,
  FiPlus,
  FiCheck,
  FiX as FiTimes,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  createGrade,
  deleteGrade,
  fetchAllCourses,
  fetchAllGrades,
  fetchAllStudents,
  updateGrade,
} from "../api/apiService";

const Grades = () => {
  // États pour la gestion des données
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les filtres
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // États pour les modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState(null);

  // États pour le formulaire
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    grade: "",
    promotionId: "",
    semester: "",
  });

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockPromotions = [
          { id: "1", name: "L1 LMD" },
          { id: "2", name: "L2 LMD" },
          { id: "3", name: "L3 LMD" },
          { id: "4", name: "M1" },
          { id: "5", name: "M2" },
        ];
        const data = await fetchAllCourses();
        const result = await fetchAllStudents();
        const result2 = await fetchAllGrades();
        console.log(result2.data);

        setPromotions(mockPromotions);
        setStudents(result.data);
        setCourses(data.data);
        setGrades(result2.data);
        setFilteredGrades(result2.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [loading]);

  // Obtenir les cours filtrés pour le formulaire
  const getFilteredCourses = () => {
    if (!formData.promotionId || !formData.semester) return courses;
    return courses.filter(
      (course) =>
        course.promotion === formData.promotionId &&
        course.semester === formData.semester
    );
  };

  // Obtenir les étudiants filtrés pour le formulaire
  const getFilteredStudents = () => {
    if (!formData.promotionId) return students;
    return students.filter(
      (student) => student.promotion === formData.promotionId
    );
  };

  // Filtrer les notes
  useEffect(() => {
    let result = grades;

    if (selectedPromotion) {
      result = result.filter((grade) => grade.promotion === selectedPromotion);
    }

    if (selectedSemester) {
      result = result.filter((grade) => grade.semester === selectedSemester);
    }

    if (selectedCourse) {
      result = result.filter((grade) => grade.course._id === selectedCourse);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((grade) => {
        const student = students.find(
          (s) => s.studentId === grade.student.studentId
        );
        const studentName = student
          ? `${student.lastName} ${student.firstName}`.toLowerCase()
          : "";
        return studentName.includes(query);
      });
    }

    setFilteredGrades(result);
  }, [
    selectedPromotion,
    selectedSemester,
    selectedCourse,
    searchQuery,
    grades,
    students,
  ]);

  // Gestion des modales
  const openAddModal = () => {
    setFormData({
      studentId: "",
      courseId: "",
      grade: "",
      promotionId: promotions[0]?.id || "",
      semester: "S1",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (grade) => {
    setCurrentGrade(grade);
    setFormData({
      studentId: grade.studentId,
      courseId: grade.courseId,
      grade: grade.grade.toString(),
      promotionId: grade.promotionId,
      semester: grade.semester,
    });
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentGrade(null);
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Construction de l'objet à envoyer
      const gradeToSend = {
        student: formData.studentId,
        course: formData.courseId,
        grade: parseFloat(formData.grade),
        promotion: formData.promotionId,
        semester: formData.semester,
      };

      if (isEditModalOpen) {
        // Mise à jour
        await handleUpdateGrade(currentGrade._id, gradeToSend);
        console.log("Étudiant modifié avec succès");
      } else {
        // Ajout
        await createGrade(gradeToSend);
        console.log("Étudiant ajouté avec succès");
      }

      closeModal();
      setLoading(true);
    } catch (error) {
      const message =
        error.response?.data?.error || "Erreur lors de l'ajout de la note.";
      console.log(message);
    }
  };

  // Supprimer une note
  const handleDelete = async (gradeId) => {
    try {
      await deleteGrade(gradeId);
      setLoading(true);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert(
        err?.response?.data?.error || "Échec de la suppression de l'étudiant."
      );
    }
  };

  const handleUpdateGrade = async () => {
    try {
      const payload = {
        promotionId: formData.promotionId,
        semester: formData.semester,
        courseId: formData.courseId,
        studentId: formData.studentId,
        grade: formData.grade,
      };
      await updateGrade(currentGrade._id, payload);
      console.log("Note mise à jour avec succès !");
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note :", error);
      alert(error.response?.data?.error || "Une erreur est survenue.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Gestion des Notes
      </h1>

      {/* Contrôles de filtrage */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPromotion}
                onChange={(e) => setSelectedPromotion(e.target.value)}
              >
                <option value="">Toutes promotions</option>
                {promotions.map((promo) => (
                  <option key={promo.id} value={promo.name}>
                    {promo.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="">Tous semestres</option>
                <option value="S1">Semestre 1</option>
                <option value="S2">Semestre 2</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={!selectedPromotion || !selectedSemester}
              >
                <option value="">Tous cours</option>
                {courses
                  .filter(
                    (c) =>
                      c.promotion === selectedPromotion &&
                      c.semester === selectedSemester
                  )
                  .map((course) => (
                    <option key={course.id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 w-full md:w-auto"
        >
          <FiPlus className="mr-2" />
          Ajouter une note
        </button>
      </div>

      {/* Tableau des notes */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Promotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Semestre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((grade) => {
                    const isPassing = grade.grade >= 10;

                    return (
                      <motion.tr
                        key={grade.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <FiUser className="text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">
                                {grade.student.lastName}{" "}
                                {grade.student.firstName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {grade.course.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {grade.promotion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {grade.semester}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                          {grade.grade}/20
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isPassing
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {isPassing ? (
                              <FiCheck className="mr-1" />
                            ) : (
                              <FiTimes className="mr-1" />
                            )}
                            {isPassing ? "Validé" : "Échoué"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(grade)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(grade._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Aucune note trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale d'ajout/modification */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <>
            {/* Fond semi-transparent - animation séparée */}
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-500 dark:bg-gray-900"
              onClick={closeModal}
            />

            {/* Contenu de la modal - animation séparée */}
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                key="modal-content"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      {isAddModalOpen
                        ? "Ajouter un étudiant"
                        : "Modifier étudiant"}
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label
                          htmlFor="promotionId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Promotion
                        </label>
                        <select
                          name="promotionId"
                          id="promotionId"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          value={formData.promotionId}
                          onChange={handleInputChange}
                          required
                        >
                          {promotions.map((promo) => (
                            <option key={promo.id} value={promo.value}>
                              {promo.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="semester"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Semestre
                        </label>
                        <select
                          name="semester"
                          id="semester"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          value={formData.semester}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="S1">Semestre 1</option>
                          <option value="S2">Semestre 2</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="courseId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Cours
                        </label>
                        <select
                          name="courseId"
                          id="courseId"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          value={formData.courseId}
                          onChange={handleInputChange}
                          required
                          disabled={!formData.promotionId || !formData.semester}
                        >
                          <option value="">Sélectionner un cours</option>
                          {getFilteredCourses().map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="studentId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Étudiant
                        </label>
                        <select
                          name="studentId"
                          id="studentId"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          value={formData.studentId}
                          onChange={handleInputChange}
                          required
                          disabled={!formData.promotionId}
                        >
                          <option value="">Sélectionner un étudiant</option>
                          {getFilteredStudents().map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.lastName} {student.firstName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="grade"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Note (sur 20)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="number"
                            name="grade"
                            id="grade"
                            min="0"
                            max="20"
                            step="0.1"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.grade}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                      >
                        <FiSave className="mr-2" />
                        {isAddModalOpen ? "Ajouter" : "Enregistrer"}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Grades;
