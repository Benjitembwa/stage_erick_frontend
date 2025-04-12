// src/pages/Students.js
import { useState, useEffect } from "react";
import {
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiX,
  FiSave,
  FiUser,
  FiMail,
  FiHash,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  createStudent,
  deleteStudent,
  fetchAllStudents,
  updateStudent,
} from "../api/apiService";

const Students = () => {
  // États pour la gestion des données
  const [students, setStudents] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les filtres
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // États pour les modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 2;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    postName: "",
    studentId: "",
    promotionId: "L1 LMD", // ou la 1ère valeur par défaut
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      postName: formData.postName,
      studentId: formData.studentId,
      promotion: formData.promotionId,
    };

    try {
      if (isEditModalOpen) {
        // Mise à jour
        await handleUpdate(currentStudent._id, studentPayload);
        console.log("Étudiant modifié avec succès");
      } else {
        // Ajout
        await createStudent(studentPayload);
        console.log("Étudiant ajouté avec succès");
      }

      closeModal();
      setLoading(true);
    } catch (error) {
      const message = error.response?.data?.error || "Erreur inconnue";
      alert(`Erreur : ${message}`);
    }
  };

  // Charger les données initiales
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await fetchAllStudents();
        setStudents(res.data);

        // Données mockées
        const mockPromotions = [
          { id: "1", name: "L1 LMD" },
          { id: "2", name: "L2 LMD" },
          { id: "3", name: "L3 LMD" },
          { id: "4", name: "M1" },
          { id: "5", name: "M2" },
        ];

        setPromotions(mockPromotions);
        setStudents(res.data);
        setFilteredStudents(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
        setLoading(false);
      }
    };

    loadStudents();
  }, [loading]);

  // Filtrer les étudiants
  useEffect(() => {
    let result = students;

    if (selectedPromotion) {
      console.log(selectedPromotion);
      result = result.filter(
        (student) => student.promotion === selectedPromotion
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (student) =>
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.postName.toLowerCase().includes(query) ||
          student.studentId.toLowerCase().includes(query)
      );
    }

    setFilteredStudents(result);
  }, [selectedPromotion, searchQuery, students]);

  // Gestion des modales
  const openAddModal = () => {
    setFormData({
      firstName: "",
      lastName: "",
      postName: "",
      studentId: "",
      promotionId: promotions[0]?.id || "",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      postName: student.postName,
      studentId: student.studentId,
      promotionId: student.promotionId,
    });
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentStudent(null);
  };

  // Supprimer un étudiant
  const handleDelete = async (studentId) => {
    try {
      await deleteStudent(studentId);
      setLoading(true);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert(
        err?.response?.data?.error || "Échec de la suppression de l'étudiant."
      );
    }
  };

  const handleUpdate = async () => {
    const studentPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      postName: formData.postName,
      studentId: formData.studentId,
      promotion: formData.promotionId,
    };
    try {
      await updateStudent(currentStudent._id, studentPayload);
      setLoading(true);
      closeModal(); // ferme la modale
    } catch (error) {
      const message = error.response?.data?.error || "Erreur inconnue";
      alert(`Erreur lors de l'edite : ${message}`);
    }
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Gestion des Étudiants
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

          <div className="relative w-full sm:w-48">
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
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 w-full md:w-auto"
        >
          <FiUserPlus className="mr-2" />
          Ajouter un étudiant
        </button>
      </div>
      {/* Tableau des étudiants */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>{" "}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Post-nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Prénom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Promotion
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.length > 0 ? (
                    currentStudents.map((student) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <FiUser className="text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {student.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {student.postName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {student.firstName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {student.promotion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(student)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        Aucun étudiant trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 shadow-md transform ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white scale-110 shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-500 hover:text-blue-700 dark:hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
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
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Prénom
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Nom
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="postName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Post-nom
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="text"
                            name="postName"
                            id="postName"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.postName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="studentId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Identifiant
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiHash className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="studentId"
                            id="studentId"
                            className="block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

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
                            <option key={promo.id} value={promo.name}>
                              {promo.name}
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
      ;
    </div>
  );
};

export default Students;
