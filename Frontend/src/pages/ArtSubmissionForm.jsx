import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArtSubmissionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    typeOfArt: "",
    location: "",
    country: "",
    price: "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.typeOfArt) newErrors.typeOfArt = "Type of art is required";
    if (!formData.image) newErrors.image = "Image upload is required";

    if (formData.price && isNaN(formData.price)) {
      newErrors.price = "Price must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    try {
      const responce = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/artist/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (responce.status === 200) {
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageAsFile = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!file) return;

    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/artist/upload`,
        data
      );

      if (res.data?.url) {
        setImageUrl(res.data.url);
        setFormData((prev) => ({ ...prev, image: res.data.url }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Art Submission Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md min-h-[100px]"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image *</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handleImageAsFile}
            disabled={uploading || !file}
            className="border border-gray-500 rounded px-3 py-1 mt-3"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Type of Art *
          </label>
          <select
            name="typeOfArt"
            value={formData.typeOfArt}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select art type</option>
            <option value="Chittara art">Chittara art</option>
            <option value="Warli painting">Warli painting</option>
            <option value="Madhubani painting">Madhubani painting</option>
            <option value="Digital Art">Digital Art</option>
            <option value="Mixed Media">Mixed Media</option>
            <option value="Other">Other</option>
          </select>
          {errors.typeOfArt && (
            <p className="text-red-500 text-sm">{errors.typeOfArt}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-semibold rounded-md text-white mt-4 ${
            loading
              ? "bg-green-600/70 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Artwork"}
        </button>
      </form>
    </div>
  );
};

export default ArtSubmissionForm;
