import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ListingDataContext } from "../context/ListingContext";

const ArtEditForm = () => {
  const { listingDetails, setListingDetails } = useContext(ListingDataContext);

  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const artTypes = [
    "Chittara art",
    "Madhubani painting",
    "Warli painting",
    "Digital Art",
    "Mixed Media",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageAsFile = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // must match backend

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/artist/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.url) {
        setListingDetails((prev) => ({
          ...prev,
          image: res.data.url,
        }));
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["title", "description", "typeOfArt", "image"];
    const missingFields = requiredFields.filter(
      (field) => !listingDetails?.[field]
    );

    if (missingFields.length > 0) {
      alert(`Please fill: ${missingFields.join(", ")}`);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing");
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/artist/update/${listingDetails._id}`,
        listingDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        navigate("/art-details");
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update art piece");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Art Piece</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={listingDetails.title || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={listingDetails.description || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md min-h-[100px]"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />

          <button
            type="button"
            onClick={handleImageAsFile}
            disabled={loading || !file}
            className="mt-3 px-4 py-1 border rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          {listingDetails.image && (
            <img
              src={listingDetails.image}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded"
            />
          )}
        </div>

        {/* ART TYPE */}
        <div>
          <label className="block text-sm font-medium mb-1">Type of Art</label>
          <select
            name="typeOfArt"
            value={listingDetails.typeOfArt || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select art type</option>
            {artTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={listingDetails.location || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* COUNTRY */}
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={listingDetails.country || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full py-2 bg-[#111827] text-white rounded-md"
        >
          Save Art Piece
        </button>
      </form>
    </div>
  );
};

export default ArtEditForm;
