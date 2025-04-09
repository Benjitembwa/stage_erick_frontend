// src/pages/Courses.js
import { useState, useEffect } from "react";
import {
  FiBook,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiX,
  FiSave,
  FiHash,
  FiCreditCard,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Courses = () => {
  // États pour la gestion des données
  const [courses, setCourses] = useState([]);
  const [teachingUnits, setTeachingUnits] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les filtres
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // États pour les modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  // États pour le formulaire
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    credits: 3,
    teachingUnitId: "",
    promotionId: "",
    semester: "1",
  });

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simuler un appel API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Données mockées
        const mockPromotions = [
          { id: "1", name: "Promotion 2020" },
          { id: "2", name: "Promotion 2021" },
          { id: "3", name: "Promotion 2022" },
          { id: "4", name: "Promotion 2023" },
        ];

        const mockTeachingUnits = [
          {
            id: "1",
            name: "Physique Fondamentale",
            promotionId: "1",
            semester: "1",
            credits: 12,
          },
          {
            id: "2",
            name: "Mathématiques Appliquées",
            promotionId: "1",
            semester: "1",
            credits: 10,
          },
          {
            id: "3",
            name: "Physique Quantique",
            promotionId: "1",
            semester: "2",
            credits: 14,
          },
          // Ajouter plus d'UE...
        ];

        const mockCourses = [
          {
            id: "1",
            name: "Mécanique Classique",
            courseId: "PHY101",
            credits: 4,
            teachingUnitId: "1",
            promotionId: "1",
            semester: "1",
          },
          {
            id: "2",
            name: "Électromagnétisme",
            courseId: "PHY102",
            credits: 4,
            teachingUnitId: "1",
            promotionId: "1",
            semester: "1",
          },
          {
            id: "3",
            name: "Algèbre Linéaire",
            courseId: "MATH101",
            credits: 5,
            teachingUnitId: "2",
            promotionId: "1",
            semester: "1",
          },
          // Ajouter plus de cours...
        ];

        setPromotions(mockPromotions);
        setTeachingUnits(mockTeachingUnits);
        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les cours
  useEffect(() => {
    let result = courses;

    if (selectedPromotion) {
      result = result.filter(
        (course) => course.promotionId === selectedPromotion
      );
    }

    if (selectedSemester) {
      result = result.filter((course) => course.semester === selectedSemester);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.courseId.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(result);
  }, [selectedPromotion, selectedSemester, searchQuery, courses]);

  // Obtenir les UE filtrées pour le formulaire
  const getFilteredTeachingUnits = () => {
    if (!formData.promotionId || !formData.semester) return teachingUnits;
    return teachingUnits.filter(
      (unit) =>
        unit.promotionId === formData.promotionId &&
        unit.semester === formData.semester
    );
  };

  // Gestion des modales
  const openAddModal = () => {
    setFormData({
      name: "",
      courseId: "",
      credits: 3,
      teachingUnitId: "",
      promotionId: promotions[0]?.id || "",
      semester: "1",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      name: course.name,
      courseId: course.courseId,
      credits: course.credits,
      teachingUnitId: course.teachingUnitId,
      promotionId: course.promotionId,
      semester: course.semester,
    });
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentCourse(null);
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isAddModalOpen) {
      // Ajouter un nouveau cours
      const newCourse = {
        id: Date.now().toString(),
        ...formData,
        credits: parseInt(formData.credits),
      };

      setCourses((prev) => [...prev, newCourse]);
    } else {
      // Mettre à jour un cours existant
      setCourses((prev) =>
        prev.map((course) =>
          course.id === currentCourse.id
            ? { ...course, ...formData, credits: parseInt(formData.credits) }
            : course
        )
      );
    }

    closeModal();
  };

  // Supprimer un cours
  const handleDelete = (courseId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Gestion des Cours
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
              placeholder="Rechercher un cours..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPromotion}
                onChange={(e) => setSelectedPromotion(e.target.value)}
              >
                <option value="">Toutes promotions</option>
                {promotions.map((promo) => (
                  <option key={promo.id} value={promo.id}>
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
                <option value="1">Semestre 1</option>
                <option value="2">Semestre 2</option>
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
          Ajouter un cours
        </button>
      </div>

      {/* Tableau des cours */}
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
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nom du cours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    UE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Crédits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Promotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Semestre
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const teachingUnit = teachingUnits.find(
                      (u) => u.id === course.teachingUnitId
                    );
                    const promotion = promotions.find(
                      (p) => p.id === course.promotionId
                    );

                    return (
                      <motion.tr
                        key={course.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {course.courseId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {course.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {teachingUnit?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {course.credits} Crédits
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {promotion?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          S{course.semester}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(course)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(course.id)}
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
                      Aucun cours trouvé
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
            {/* Fond semi-transparent avec animation séparée */}
            <motion.div
              key="course-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-500 dark:bg-gray-900"
              onClick={closeModal}
            />

            {/* Contenu de la modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                key="course-modal-content"
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
                      {isAddModalOpen ? "Ajouter un cours" : "Modifier cours"}
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
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Nom du cours
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="courseId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Code du cours
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiHash className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="courseId"
                            id="courseId"
                            className="block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.courseId}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="credits"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Crédits
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCreditCard className="text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="credits"
                            id="credits"
                            min="1"
                            max="10"
                            className="block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.credits}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
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
                            <option key={promo.id} value={promo.id}>
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
                          <option value="1">Semestre 1</option>
                          <option value="2">Semestre 2</option>
                        </select>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="teachingUnitId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Unité d'Enseignement
                        </label>
                        <select
                          name="teachingUnitId"
                          id="teachingUnitId"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          value={formData.teachingUnitId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Sélectionner une UE</option>
                          {getFilteredTeachingUnits().map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name} (S{unit.semester} - {unit.credits}{" "}
                              crédits)
                            </option>
                          ))}
                        </select>
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

export default Courses;
