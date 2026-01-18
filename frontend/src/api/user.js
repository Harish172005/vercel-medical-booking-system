// src/api/user.js
import API from "../utils/axios";


export const getUserProfile = () => API.get("/user/get-profile"); // GET /api/user/profile
export const updateUserProfile = (data) => API.put("/user/profile", data); // PUT /api/user/profile
export const getUserAppointments = (patientId) => API.get(`appointments/patient/${patientId}`); // GET protected, returns user's appts
export const bookAppointment = (payload) => API.post("/appointments/bookAppointment", payload); // POST
