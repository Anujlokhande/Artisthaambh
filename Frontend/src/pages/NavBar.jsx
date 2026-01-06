import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { ArtistDataContext } from "../context/AristContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const navbarVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", duration: 0.5 },
  },
};

const menuVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const categories = [
  "Chittara art",
  "Madhubani painting",
  "Warli painting",
  "Digital Art",
  "Mixed Media",
];

const MenuItem = ({ icon, label, onClick, color = "gray-600" }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center w-full px-4 py-2 gap-2 hover:bg-gray-100"
    onClick={() => {
      onClick();
    }}
  >
    <i className={`${icon} text-${color}`} />
    <span>{label}</span>
  </motion.button>
);

const CategoryButton = ({ category, onClick, isActive }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#E60023] text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {category}
  </motion.button>
);

const NavBar = ({ setSelectedCategory, selectedCategory }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const { artist, setArtist } = useContext(ArtistDataContext);

  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      const token = localStorage.getItem("token");
      if (!token) return;

      const endpoint = `${import.meta.env.VITE_BASE_URL}/${
        artist ? "artist" : "user"
      }/logout`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        artist ? setArtist(null) : setUser(null);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between px-3 py-3 md:px-6 shadow-md bg-[#F4F4F2] relative w-full"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-[#E60023] font-bold cursor-pointer"
          onClick={() => {
            setSelectedCategory("");
            navigate("/home");
          }}
        >
          <span className="text-xl md:text-3xl">artistambh</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-3 px-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <CategoryButton
              key={category}
              category={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#E60023]"
            onClick={() => {
              setSelectedCategory("");
              navigate("/home");
            }}
          >
            <i className="ri-home-line text-xl" />
            <span>Home</span>
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`border rounded-full px-3 py-2 flex items-center gap-2 cursor-pointer ${
              artist ? "bg-[#E60023] text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <i className={artist ? "ri-palette-line" : "ri-user-fill"} />
            <span className="text-sm font-medium">
              {artist ? "Artist" : "User"}
            </span>
            <motion.i
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ri-arrow-down-s-line"
            />
          </motion.div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-48 py-2 z-50"
              >
                <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
                  <p className="font-medium text-gray-800">
                    {artist ? "Artist Account" : "User Account"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {artist ? artist.email : user?.email}
                  </p>
                </div>

                {artist && (
                  <>
                    <MenuItem
                      icon="ri-add-box-line"
                      label="Create Artwork"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/art-submission");
                      }}
                    />
                    <MenuItem
                      icon="ri-gallery-line"
                      label="My Artworks"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/artist-art");
                      }}
                    />
                  </>
                )}

                {user && (
                  <MenuItem
                    icon="ri-bookmark-line"
                    label="Saved Artworks"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/saved");
                    }}
                  />
                )}

                <MenuItem
                  icon="ri-information-line"
                  label="About Us"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/about");
                  }}
                />
                <MenuItem
                  icon="ri-customer-service-line"
                  label="Help Centre"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/help");
                  }}
                />

                <hr className="my-2" />

                <MenuItem
                  icon="ri-logout-box-line"
                  label="Log out"
                  onClick={handleLogout}
                  color="red-600"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <div className="md:hidden flex gap-3 px-4 py-2 overflow-x-auto bg-[#F4F4F2] scrollbar-hide">
        {categories.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isActive={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>
    </>
  );
};

export default NavBar;
