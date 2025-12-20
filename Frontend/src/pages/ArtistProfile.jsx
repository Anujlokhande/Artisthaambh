import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ArtistProfile = () => {
  const location = useLocation();
  const { artist } = location.state || {};
  const navigate = useNavigate();
  const back = () => {
    navigate("/art-details");
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-col items-center max-w-sm w-full bg-white rounded-2xl p-6 shadow-lg relative">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-orange-400 rounded-t-2xl flex justify-end">
          <i
            className="ri-close-line text-2xl pr-2 pt-2"
            onClick={() => {
              back();
            }}
          ></i>
        </div>

        <div className="relative h-48 w-48 rounded-full bg-orange-400 p-1 mt-6">
          <img
            src={artist.profilePic}
            alt="Profile"
            className="h-full w-full object-cover rounded-full border-4 border-white"
          />
        </div>

        <div className="text-center mt-4 text-gray-800">
          <h2 className="text-xl font-semibold">
            {artist.fullname?.firstname + " " + artist.fullname.lastname}
          </h2>
          <p className="text-sm text-gray-600">{artist.typeOfArt}</p>
        </div>

        <div className="flex space-x-3 mt-4">
          <a className="flex justify-center items-center w-10 h-10 rounded-full bg-blue-600 text-white text-xl">
            <i className="ri-facebook-fill"></i>
          </a>
          <a className="flex justify-center items-center w-10 h-10 rounded-full bg-sky-500 text-white text-xl">
            <i className="ri-twitter-fill"></i>
          </a>
          <a className="flex justify-center items-center w-10 h-10 rounded-full bg-pink-500 text-white text-xl">
            <i className="ri-instagram-fill"></i>
          </a>
          <a className="flex justify-center items-center w-10 h-10 rounded-full bg-red-600 text-white text-xl">
            <i className="ri-youtube-fill"></i>
          </a>
        </div>

        <div className="mt-4 text-gray-700 text-lg font-medium flex space-x-2">
          <p>Contact:</p>
          <span className="text-gray-900 font-semibold">{artist.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
