import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArtistDataContext } from "../context/AristContext";
import axios from "axios";

const ArtistLogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { setArtist } = useContext(ArtistDataContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submitHandler(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const responce = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/artist/login`,
        { email, password }
      );

      if (responce.status === 200) {
        const data = responce.data;
        setArtist(data.artist);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (err) {
      setErrors({ api: "Invalid email or password" });
    }

    setPassword("");
    setEmail("");
  }

  return (
    <div className="min-h-screen w-screen bg-[url(https://images.unsplash.com/photo-1631446415295-6fb14a3e9c4c?q=80&w=2071&auto=format&fit=crop)] bg-cover bg-center flex justify-center items-center px-4">
      <div className="backdrop-blur-xl w-[90%] sm:w-[80%] md:w-1/2 lg:w-1/3 h-auto sm:h-2/3 flex flex-col items-center justify-evenly rounded-2xl py-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center">
          LOG IN AS ARTIST
        </h1>

        <div className="w-full sm:w-2/3">
          <form
            onSubmit={submitHandler}
            className="w-full flex flex-col items-start"
          >
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

            {errors.api && (
              <p className="text-red-400 text-sm mb-3 w-full text-center">
                {errors.api}
              </p>
            )}

            <button className="w-full border-2 border-[#8E7B61] rounded-md text-white flex justify-center items-center bg-[#A27B4E] py-1.5 px-5 mb-5">
              Log In
            </button>

            <Link
              to="/login"
              className="w-full border-2 border-black rounded-md text-white bg-black py-1.5 px-5 flex justify-center items-center"
            >
              Log In As User
            </Link>
          </form>

          <p className="mt-3 text-center">
            Don't Have An Account{" "}
            <Link to="/signup" className="underline">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistLogIn;
