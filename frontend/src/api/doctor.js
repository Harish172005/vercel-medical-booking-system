import API from "../utils/axios";

// Existing exports
export const listDoctors = () => API.get("/doctors"); 
export const getDoctorAppointments = (doctorId) => API.get(`/appointments/doctor/${doctorId}`);
export const updateAvailability = (slots) => API.post("/doctor/availability", { slots });
export const getDoctorProfile = () => API.get("/doctor/profile");
export const updateDoctorProfile = (data) => API.post("/doctor/update-profile", data);

export const fetchSpecializations = () => API.get("/doctors/specializations");

export const fetchDoctorsBySpecialization = (specialization) =>
  API.get(`/doctors/specialization/${specialization}`);

// New export for Dashboard stats (optional)
export const getDoctorAppointmentsStats = (doctorId) =>
  API.get(`/appointments/doctor/${doctorId}/stats`);

export const getDoctorAppointmentsRecent = (doctorId) =>
  API.get(`/appointments/doctor/${doctorId}/recent`);





