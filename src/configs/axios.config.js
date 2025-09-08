import axios from "axios";
// export const baseURL = "https://intelligent-amazement-production.up.railway.app/";

// export const baseURL = "http://192.168.0.196:8002/";
export const baseURL = "https://products-s9xv.onrender.com/";

// axios instance for json data adkjsa
const custAxios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// Basic check if a string looks like a JWT token (has the format xxx.yyy.zzz)..
const isValidJWT = (token) => {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3;
};

// attaching token to axios without strict format validation
export const attachToken = () => {
  const user = JSON.parse(localStorage?.getItem("user"));
  const isTeamMember = user?.isTeamMember;
  const token = isTeamMember
    ? localStorage.getItem("ownerToken")
    : localStorage.getItem("token");

  if (token) {
    // Attach token with Bearer prefix for proper authorization format
    const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    custAxios.defaults.headers.common["Authorization"] = bearerToken;

    // Log token format for debugging, but don't enforce it
    if (!isValidJWT(token)) {
      console.log(
        "Note: Token is not in standard JWT format, but using it anyway"
      );
    }
  } else {
    console.log("No token available to attach");
  }
};

// attaching token to form axios without strict format validation
export const attachTokenWithFormAxios = () => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  if (token) {
    const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    formAxios.defaults.headers.common["Authorization"] = bearerToken;
  }
};

// axios instance for formdata
export const formAxios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

export default custAxios;
