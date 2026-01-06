import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { ArtistDataContext } from "../context/AristContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Animation variants
const navbarVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", duration: 0.5 } },
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
    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
    onClick={onClick}
  >
    <i className={`${icon} text-${color}`} />
    <span>{label}</span>
  </motion.button>
);

const CategoryButton = ({ category, onClick }) => (
  <motion.button
    whileHover={{ scale: 1 }}
    whileTap={{ scale: 0.95 }}
    className="text-gray-700 hover:text-[#E60023] font-medium px-4 py-2
             cursor-pointer transition-colors duration-200"
    onClick={onClick}
  >
    {category}
  </motion.button>
);

const NavBar = ({ setSelectedCategory }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const { artist, setArtist } = useContext(ArtistDataContext);

  const handleLogout = async () => {
    try {
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
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.nav
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between p-4 shadow-md bg-[#F4F4F2] relative w-full"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-bold text-[#E60023] flex items-center cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <span className="ml-4 text-3xl">artistambh</span>
      </motion.div>

      {/* Categories - Only for users */}
      <AnimatePresence>
        <div className="flex items-center gap-4 overflow-x-auto px-4 scrollbar-hide">
          {categories.map((category) => (
            <CategoryButton
              key={category}
              category={category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Navigation Menu */}
      <div className="flex items-center gap-4 relative">
        {/* Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-700 flex items-center gap-2 hover:text-[#E60023]
                   transition-colors duration-200"
          onClick={() => {
            setSelectedCategory(null);
            navigate("/home");
          }}
        >
          <i className="ri-home-line text-2xl" />
          <span>Home</span>
        </motion.button>

        {/* User/Artist Profile Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`border rounded-full p-2 flex items-center gap-2 cursor-pointer
                    transition-colors duration-200 ${
                      artist
                        ? "bg-[#E60023] text-white hover:bg-[#cc0000]"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`${artist ? "ri-palette-line" : "ri-user-fill"}`} />
          <span className="text-sm font-medium">
            {artist ? "Artist" : "User"}
          </span>
          <motion.i
            animate={{ rotate: menuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ri-arrow-down-s-line"
          />
        </motion.div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-48 py-2 z-50"
            >
              {/* Profile Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <p className="font-medium text-gray-800">
                  {artist ? "Artist Account" : "User Account"}
                </p>
                <p className="text-sm text-gray-500">
                  {artist ? artist.email : user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <motion.div
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {artist && (
                  <>
                    <MenuItem
                      icon="ri-add-box-line"
                      label="Create Artwork"
                      onClick={() => navigate("/art-submission")}
                      color="[#E60023]"
                    />
                    <MenuItem
                      icon="ri-gallery-line"
                      label="My Artworks"
                      onClick={() => navigate("/artist-art")}
                      color="[#E60023]"
                    />
                  </>
                )}

                {user && (
                  <MenuItem
                    icon="ri-bookmark-line"
                    label="Saved Artworks"
                    onClick={() => navigate("/saved")}
                    color="[#E60023]"
                  />
                )}

                <MenuItem
                  icon="ri-information-line"
                  label="About Us"
                  onClick={() => navigate("/about")}
                />
                <MenuItem
                  icon="ri-customer-service-line"
                  label="Help Centre"
                  onClick={() => navigate("/help")}
                />

                <hr className="my-2" />

                <MenuItem
                  icon="ri-logout-box-line"
                  label="Log out"
                  onClick={handleLogout}
                  color="red-600"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavBar;
