const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL);

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchAllStudents = async () => {
  try {
    const response = await axiosInstance.get("/students");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants :", error);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await axiosInstance.post("/students", studentData);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout d'un étudiant :",
      error.response?.data || error
    );
    throw error;
  }
};

export const deleteStudent = async (studentId) => {
  const res = await axiosInstance.delete(`/students/${studentId}`);
  return res.data;
};

export const updateStudent = (id, studentData) => {
  return axiosInstance.put(`/students/${id}`, studentData);
};

export const addTeachingUnit = async (data) => {
  try {
    const response = await axiosInstance.post("/teachingUnits", data);
    return response.data;
  } catch (error) {
    // On relance l'erreur pour la gérer dans le composant
    throw error.response?.data || { error: "Erreur inconnue" };
  }
};

export const fetchTeachingUnits = async () => {
  try {
    const response = await axiosInstance.get("/teachingUnits");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des UE :", error);
    throw error;
  }
};

export const deleteTeachingUnits = async (teachingUnitsId) => {
  const res = await axiosInstance.delete(`/teachingUnits/${teachingUnitsId}`);
  console.log(res);
  return res.data;
};

export const updateTeachingUnits = (id, teachingUnitsData) => {
  return axiosInstance.put(`/teachingUnits/${id}`, teachingUnitsData);
};
export const fetchAllCourses = async () => {
  try {
    const response = await axiosInstance.get("/courses");
    return response.data; // Contient success, count, data
  } catch (error) {
    console.error("Erreur lors du chargement des cours:", error);
    throw error;
  }
};

export const addCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post("/courses", courseData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du cours:", error);
    throw error.response?.data || { error: "Erreur inconnue" };
  }
};

export const deleteCourse = async (courseId) => {
  const res = await axiosInstance.delete(`/courses/${courseId}`);
  console.log(res);
  return res.data;
};

export const updateCourse = (id, courseData) => {
  return axiosInstance.put(`/courses/${id}`, courseData);
};

export const fetchCoursesByTeachingUnit = async (teachingUnitId) => {
  try {
    const response = await axiosInstance.get(
      `/teaching-unit/${teachingUnitId}`
    );
    return response.data; // Contient success, count, data
  } catch (error) {
    console.error("Erreur lors du chargement des cours:", error);
    throw error;
  }
};

export const fetchAllGrades = async () => {
  try {
    const response = await axiosInstance.get("/grades");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error);
    throw error;
  }
};

export const createGrade = async (gradeData) => {
  try {
    const response = await axiosInstance.post("/grades", gradeData);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création de la note :",
      error.response?.data || error
    );
    throw error;
  }
};

export const deleteGrade = async (gradeId) => {
  const res = await axiosInstance.delete(`/grades/${gradeId}`);
  console.log(res);
  return res.data;
};

export const updateGrade = (id, gradeData) => {
  return axiosInstance.put(`/grades/${id}`, gradeData);
};

export const fetchAllStats = async () => {
  try {
    const response = await axiosInstance.get("/stats");
    return response.data; // Contient success, count, data
  } catch (error) {
    console.error("Erreur lors du chargement des cours:", error);
    throw error;
  }
};
