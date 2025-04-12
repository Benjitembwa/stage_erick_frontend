// src/pages/TeachingUnits.js
import { useState, useEffect } from "react";
import {
  FiLayers,
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
import { addTeachingUnit, fetchTeachingUnits } from "../api/apiService";

const TeachingUnits = () => {
  // États pour la gestion des données
  const [teachingUnits, setTeachingUnits] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les filtres
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // États pour les modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(null);

  // États pour le formulaire
  const [formData, setFormData] = useState({
    name: "",
    unitId: "",
    promotionId: "",
    semester: "S1",
  });

  // Charger les données initiales
  useEffect(() => {
    const getUnits = async () => {
      try {
        const mockPromotions = [
          { id: "1", name: "L1 LMD" },
          { id: "2", name: "L2 LMD" },
          { id: "3", name: "L3 LMD" },
          { id: "4", name: "M1" },
          { id: "5", name: "M2" },
        ];
        setPromotions(mockPromotions);

        const result = await fetchTeachingUnits();

        setTeachingUnits(result.data);
        console.log(result.data);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    getUnits();
  }, [loading]);

  // Filtrer les UE
  useEffect(() => {
    let result = teachingUnits;
    if (selectedPromotion) {
      result = result.filter((unit) => unit.promotion === selectedPromotion);
    }

    if (selectedSemester) {
      result = result.filter((unit) => unit.semester === selectedSemester);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (unit) =>
          unit.name.toLowerCase().includes(query) ||
          unit.unitId.toLowerCase().includes(query)
      );
    }

    setFilteredUnits(result);
  }, [selectedPromotion, selectedSemester, searchQuery, teachingUnits]);

  // Gestion des modales
  const openAddModal = () => {
    setFormData({
      name: "",
      unitId: "",
      promotionId: promotions[0]?.id || "",
      semester: "S1",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (unit) => {
    setCurrentUnit(unit);
    setFormData({
      name: unit.name,
      unitId: unit.unitId,
      promotionId: unit.promotionId,
      semester: unit.semester,
    });
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentUnit(null);
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        unitId: formData.unitId.toUpperCase(), // uppercase pour respecter le schéma
        promotion: formData.promotionId,
        semester: formData.semester,
      };

      const response = await addTeachingUnit(payload);
      console.log("UE ajoutée :", response.data);

      // Notification ou feedback visuel
      console.log("UE ajoutée avec succès !");
      setLoading(true);

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        unitId: "",
        promotionId: promotions[0]?.name || "",
        semester: "S1",
      });

      // Fermer la modale si besoin
      closeModal();

      // Optionnel : recharger les données des UE dans ton tableau
    } catch (error) {
      console.error("Erreur d'ajout :", error);
      const errorMessage = Array.isArray(error.error)
        ? error.error.join("\n")
        : error.error;
      console.log(errorMessage || "Une erreur est survenue");
    }
  };

  // Supprimer une UE
  const handleDelete = (unitId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette UE ?")) {
      // Vérifier s'il y a des cours associés

      setTeachingUnits((prev) => prev.filter((unit) => unit.id !== unitId));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Unités d'Enseignement
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
              placeholder="Rechercher une UE..."
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
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 w-full md:w-auto"
        >
          <FiPlus className="mr-2" />
          Ajouter une UE
        </button>
      </div>

      {/* Tableau des UE */}
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
                    Code UE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nom de l'UE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Crédits
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => {
                    return (
                      <motion.tr
                        key={unit.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {unit.unitId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                          {unit.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              unit.totalCredits > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {unit.totalCredits} Crédits
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {unit.courses.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {unit.courses.slice(0, 3).map((course) => (
                                <span
                                  key={course.id}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                                >
                                  {course.name}
                                </span>
                              ))}
                              {unit.courses > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                                  +{unit.courses.length - 3} autres
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              Aucun cours
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {unit.promotion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {unit.semester}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(unit)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(unit.id)}
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
                      Aucune UE trouvée
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
              key="ue-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-500 dark:bg-gray-900"
              onClick={closeModal}
            />

            {/* Contenu de la modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                key="ue-modal-content"
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
                      {isAddModalOpen ? "Ajouter une UE" : "Modifier UE"}
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
                          Nom de l'UE
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

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="unitId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Code UE
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiHash className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="unitId"
                            id="unitId"
                            className="block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={formData.unitId}
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
                            <option key={promo.id} value={promo.name}>
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

export default TeachingUnits;
