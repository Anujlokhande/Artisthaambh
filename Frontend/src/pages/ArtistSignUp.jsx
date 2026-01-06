import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArtistDataContext } from "../context/AristContext";
import axios from "axios";

const ArtistSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setArtist } = useContext(ArtistDataContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!number) {
      newErrors.number = "Phone number is required";
    } else if (!/^\d{10}$/.test(number)) {
      newErrors.number = "Enter a valid 10 digit number";
    }

    if (!city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submitHandler(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const newArtist = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      city,
      phone: number,
    };

    try {
      const responce = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/artist/register`,
        newArtist
      );

      if (responce.status === 201) {
        const data = responce.data;
        setArtist(data.artist);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (err) {
      setErrors({ api: "Registration failed. Try again." });
    } finally {
      setLoading(false);
    }

    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setNumber("");
    setCity("");
  }

  return (
    <div className="min-h-screen w-screen bg-[url(https://images.unsplash.com/photo-1631446415295-6fb14a3e9c4c?q=80&w=2071&auto=format&fit=crop)] bg-cover bg-center flex justify-center items-center px-4">
      <div className="backdrop-blur-xl w-[90%] sm:w-[80%] md:w-2/3 lg:w-1/2 h-auto sm:h-[85%] flex flex-col items-center justify-evenly rounded-2xl py-8">
        <h1 className="text-3xl sm:text-4xl font-semibold">SIGN UP</h1>

        <div className="w-full sm:w-2/3">
          <form
            onSubmit={submitHandler}
            className="w-full flex flex-col items-start"
          >
            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Enter Your Name
            </h3>

            <div className="w-full flex flex-col sm:flex-row gap-4 justify-between">
              <div className="w-full sm:w-1/2">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First Name"
                  className="rounded-md border-none h-8 bg-white placeholder:text-base py-2 px-4 w-full mb-1"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mb-2">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-1/2">
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Last Name"
                  className="rounded-md border-none h-8 bg-white placeholder:text-base py-2 px-4 w-full mb-1"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mb-2">{errors.lastName}</p>
                )}
              </div>
            </div>

            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Enter Your Email
            </h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className="rounded-md border-none h-8 bg-white placeholder:text-base py-2 px-4 w-full mb-1"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mb-2">{errors.email}</p>
            )}

            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Create Your Password
            </h3>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="rounded-md border-none h-8 bg-white placeholder:text-base py-2 px-4 w-full mb-1"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mb-2">{errors.password}</p>
            )}

            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Enter Number
            </h3>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              type="text"
              placeholder="Number"
              className="rounded-md border-none h-8 bg-white placeholder:text-base py-2 px-4 w-full mb-1"
            />
            {errors.number && (
              <p className="text-red-400 text-sm mb-2">{errors.number}</p>
            )}

            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Enter Your City
            </h3>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              placeholder="City"
              className="rounded-md border-none h-8 bg-white placeholder:text-base py-2 px-4 w-full mb-1"
            />
            {errors.city && (
              <p className="text-red-400 text-sm mb-2">{errors.city}</p>
            )}

            {errors.api && (
              <p className="text-red-400 text-sm mb-3 w-full text-center">
                {errors.api}
              </p>
            )}

            <button
              disabled={loading}
              className={`w-full mt-2 border-2 border-[#8E7B61] rounded-md text-white flex justify-center items-center py-1.5 px-5 mb-5 ${
                loading ? "bg-[#A27B4E]/70 cursor-not-allowed" : "bg-[#A27B4E]"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <Link
              to="/login"
              className={`w-full border-2 border-black rounded-md text-white py-1.5 px-5 flex justify-center items-center ${
                loading ? "bg-black/70 pointer-events-none" : "bg-black"
              }`}
            >
              Log In As User
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistSignUp;
