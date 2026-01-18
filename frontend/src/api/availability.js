import API from "../utils/axios";

export const fetchSpecializations = () => API.get("doctors/specializations");


export const fetchDoctorAvailability = (doctorId) =>
  API.get(`/availability/${doctorId}`);
