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
