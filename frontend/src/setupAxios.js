import axios from "axios";

export function initAxiosFromLocalStorage() {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("axios: Authorization header set from localStorage");
  } else {
    delete axios.defaults.headers.common["Authorization"];
    console.log("axios: no token found; Authorization header removed");
  }
}

export function setAxiosToken(token) {
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("axios: token set and saved to localStorage");
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    console.log("axios: token removed");
  }
}