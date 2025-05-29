import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useHistory } from "react-router";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils"

export const CurrentAuthUserContext = createContext();
export const SetCurrentAuthUserContext = createContext();

export const useCurrentAuthUser = () => useContext(CurrentAuthUserContext);
export const useSetCurrentAuthUser = () => useContext(SetCurrentAuthUserContext);

export const CurrentAuthUserProvider = ({ children }) => {
  const [currentAuthUser, setCurrentAuthUser] = useState(null);
  const history = useHistory();

  const handleMount = async () => {
    try {
      const { data } = await axios.get("dj-rest-auth/user/");
      setCurrentAuthUser(data);
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
          } catch (err) {
            setCurrentAuthUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
            removeTokenTimestamp();
            return config;
          }
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

     axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401 && shouldRefreshToken()) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
            return axios(err.config);
          } catch (err) {
                setCurrentAuthUser((prevCurrentUser) => {
                if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
            removeTokenTimestamp();
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      }
    );
  }, [history]);

  return (
    <CurrentAuthUserContext.Provider value={currentAuthUser}>
      <SetCurrentAuthUserContext.Provider value={setCurrentAuthUser}>
        {children}
      </SetCurrentAuthUserContext.Provider>
    </CurrentAuthUserContext.Provider>
  );
};