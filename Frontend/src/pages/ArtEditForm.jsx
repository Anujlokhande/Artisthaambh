import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ListingDataContext } from "../context/ListingContext";

const ArtEditForm = () => {
  const { listingDetails, setListingDetails } = useContext(ListingDataContext);

  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

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
    setListingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!listingDetails?.title?.trim()) newErrors.title = "Title is required";
    if (!listingDetails?.description?.trim())
      newErrors.description = "Description is required";
    if (!listingDetails?.typeOfArt)
      newErrors.typeOfArt = "Type of art is required";
    if (!listingDetails?.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageAsFile = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/artist/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data?.url) {
        setListingDetails((prev) => ({
          ...prev,
          image: res.data.url,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/artist/update/${listingDetails._id}`,
        listingDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        navigate("/art-details");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Art Piece</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={listingDetails.title || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={listingDetails.description || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md min-h-[100px]"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

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
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
          {listingDetails.image && (
            <img
              src={listingDetails.image}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type of Art</label>
          <select
            name="typeOfArt"
            value={listingDetails.typeOfArt || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select art type</option>
            {artTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.typeOfArt && (
            <p className="text-red-500 text-sm">{errors.typeOfArt}</p>
          )}
        </div>

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

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-2 text-white rounded-md ${
            saving ? "bg-[#111827]/70 cursor-not-allowed" : "bg-[#111827]"
          }`}
        >
          {saving ? "Saving..." : "Save Art Piece"}
        </button>
      </form>
    </div>
  );
};

export default ArtEditForm;
