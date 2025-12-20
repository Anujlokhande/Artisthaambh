import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { ArtistDataContext } from "../context/AristContext";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { user, setUser } = useContext(UserDataContext);
  const { artist, setArtist } = useContext(ArtistDataContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function checkLogin() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/artist/loggedIn`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;

          if (data.role === "user") {
            setUser(data.user);
            setArtist(null);
          } else if (data.role === "artist") {
            setArtist(data.artist);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth failed:", err.response?.status);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }

    if (!user && !artist) {
      checkLogin();
    }
  }, [token, user, artist, navigate, setUser, setArtist]);

  return <>{children}</>;
};

export default UserProtectWrapper;
