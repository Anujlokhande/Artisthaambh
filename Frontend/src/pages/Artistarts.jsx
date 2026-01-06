import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArtistDataContext } from "../context/AristContext";
import NavBar from "./NavBar";
import axios from "axios";
import { ListingDataContext } from "../context/ListingContext";

const Artistarts = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { artist } = useContext(ArtistDataContext);
  const { setListingDetails } = useContext(ListingDataContext);
  const navigate = useNavigate();

  const getDetail = async (id) => {
    try {
      const responce = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/artist/show/${id}`
      );
      if (responce.status === 200) {
        setListingDetails(responce.data);
        navigate("/art-details");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredArts =
    artist?.arts?.filter((item) =>
      selectedCategory ? item.typeOfArt === selectedCategory : true
    ) || [];

  return (
    <div>
      <div className="h-[10vh] w-full flex items-center justify-between px-6">
        <NavBar
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </div>

      {filteredArts.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh] text-gray-500 text-lg">
          You haven’t uploaded any artworks yet
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-4 gap-4 p-4 space-y-4">
          {filteredArts.map((item) => (
            <img
              onClick={() => getDetail(item._id)}
              key={item._id}
              src={item.image}
              className="w-full object-cover rounded-lg break-inside-avoid hover:cursor-pointer"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Artistarts;
