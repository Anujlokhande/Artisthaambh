import React, { useEffect, useState, useContext } from "react";
import { X } from "lucide-react";
import { ListingDataContext } from "../context/ListingContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArtistDataContext } from "../context/AristContext";

const ArtListing = () => {
  const { listingDetails, setListingDetails } = useContext(ListingDataContext);
  const { user, setUser } = useContext(UserDataContext);
  const { artist, setArtist } = useContext(ArtistDataContext);
  const [authorized, setAuthorized] = useState(false);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function checkOwner() {
      const token = localStorage.getItem("token");

      if (!token || !artist) {
        setAuthorized(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/artist/artOwner/${
            listingDetails._id
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAuthorized(response.data.authorized);
      } catch (err) {
        if (err.response?.status === 403) {
          setAuthorized(false);
          return;
        } else {
          console.error(err); // real errors
        }
      }
    }

    async function checkSaved() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/is-saved/${
            listingDetails._id
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSaved(response.data.saved);
      } catch (error) {
        console.log(error);
      }
    }
    if (listingDetails?._id) {
      checkOwner();
      if (user) {
        checkSaved();
      }
    }
  }, [listingDetails]);

  // Fetch map URL from backend
  useEffect(() => {
    async function fetchMap() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/artist/map/${listingDetails?._id}`
        );
        if (response.status === 200) {
          setMapUrl(response.data.mapUrl);
        }
      } catch (error) {
        console.error("Failed fetching map", error);
      }
    }
    if (listingDetails?._id) {
      fetchMap();
    }
  }, [listingDetails]);

  async function submitHandler(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/create-comment/${
          listingDetails._id
        }`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setListingDetails(response.data);
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function saveListing() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/save-art/${listingDetails._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setUser(response.data);
        setSaved(!saved);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const delListing = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/artist/delete/${listingDetails._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[80%] w-full bg-gray-100 p-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full flex relative">
          <button
            className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
            onClick={() => navigate("/home")}
          >
            <X size={24} />
          </button>

          <div className="relative w-1/2">
            <img
              src={listingDetails.image || "/default-art.jpg"}
              alt="Artwork"
              className="w-full h-auto object-contain rounded-xl shadow-md" // Make the image responsive
              loading="lazy"
            />
          </div>

          <div className="w-1/2 pl-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {listingDetails.title || "Untitled"}
              </h2>
              <p className="mt-4 text-gray-600 text-md">
                {listingDetails.description || "No description available."}
              </p>
              <div className="mt-6 space-y-3 text-gray-700">
                <p className="font-medium">
                  Type:{" "}
                  <span className="text-gray-900">
                    {listingDetails.typeOfArt || "N/A"}
                  </span>
                </p>
                <p>
                  Price:{" "}
                  <span className="text-gray-900">
                    {listingDetails.price || "Unknown"}
                  </span>
                </p>
              </div>

              {user && (
                <div className="mt-6 space-x-4">
                  <button
                    onClick={() =>
                      navigate("/artist-details", {
                        state: { artist: listingDetails.owner },
                      })
                    }
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl hover:bg-indigo-700 transition"
                  >
                    Contact Artist
                  </button>
                  <button
                    onClick={saveListing}
                    className="bg-[#ad1229] text-white px-6 py-2.5 rounded-2xl hover:bg-[#E60023] transition"
                  >
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              )}

              {authorized && (
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => navigate("/art-edit")}
                    className="w-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={delListing}
                    className="w-1/2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition ml-4"
                  >
                    Delete
                  </button>
                </div>
              )}

              <div className="mt-4 overflow-y-auto max-h-40">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <div className="space-y-3">
                  {listingDetails.comments?.map((comment, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium">
                        {comment.owner.fullname?.firstname}
                      </p>
                      <p className="text-sm text-gray-600">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {user && (
              <div className="mt-8">
                <form className="mb-4" onSubmit={submitHandler}>
                  <div className="flex justify-center items-center">
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      type="text"
                      className="w-full border border-r-0 border-black rounded-l-2xl px-5 py-3 outline-0 placeholder:px-3"
                      placeholder="Add Comment"
                    />
                    <button className="px-5 py-2 border border-l-0 rounded-r-2xl">
                      <i className="ri-arrow-right-line text-2xl"></i>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center bg-gray-100 pb-4">
        <div className="bg-white p-4 rounded-2xl shadow-xl max-w-4xl w-full">
          <h3 className="text-xl font-semibold text-center text-indigo-700">
            Location Map
          </h3>
          {mapUrl ? (
            <img
              src={mapUrl}
              alt="Map location"
              className="mt-2 rounded-md shadow-md mx-auto"
            />
          ) : (
            <p className="text-gray-600 mt-2 text-center">Map not available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtListing;
