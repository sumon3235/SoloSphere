import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_APIURL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const {  logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
        await  logOut();
          navigate("/login");
        }
        return Promise.reject(error)
      },
    );
  }, [logOut, navigate]);
  return axiosSecure
};

export default useAxiosSecure;
