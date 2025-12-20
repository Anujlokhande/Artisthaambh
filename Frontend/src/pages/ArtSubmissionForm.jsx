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
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.title || !formData.description || !formData.typeOfArt) {
      alert("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token Is Not Present");
      return;
    }

    // console.log(formData);

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

      if (responce.status == 200) {
        const data = responce.data;
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageAsFile = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/artist/upload`,
      data
    );

    setLoading(false);
    if (res.data?.url) {
      setImageUrl(res.data.url);
      setFormData((prev) => ({
        ...prev,
        image: res.data.url, // VERY IMPORTANT
      }));
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Art Submission Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter artwork title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your artwork"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image URL *
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
            }}
            placeholder="Enter Image"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="border border-gray-500 rounded w-30 px-3 py-1 mt-3"
            type="button"
            onClick={handleImageAsFile}
            disabled={loading || !file}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label
            htmlFor="typeOfArt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type of Art *
          </label>
          <select
            id="typeOfArt"
            name="typeOfArt"
            value={formData.typeOfArt}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select art type</option>
            <option value="Chittara art">Chittara art</option>
            <option value="Warli painting">Warli painting</option>
            <option value="Madhubani painting">Madhubani painting</option>
            <option value="Digital Art">Digital Art</option>
            <option value="Mixed Media">Mixed Media</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex  justify-center items-center gap-2">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter artwork location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
        >
          Submit Artwork
        </button>
      </form>
    </div>
  );
};

export default ArtSubmissionForm;
