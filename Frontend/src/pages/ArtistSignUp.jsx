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
  const navigate = useNavigate();

  const { artist, setArtist } = useContext(ArtistDataContext);

  async function submitHandler(e) {
    e.preventDefault();

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
      // console.log(responce);

      if (responce.status == 201) {
        const data = responce.data;

        setArtist(data.artist);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }

    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setNumber("");
    setCity("");
  }
  return (
    <div className="h-screen w-screen bg-[url(https://images.unsplash.com/photo-1631446415295-6fb14a3e9c4c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D)] bg-cover bg-center flex justify-center items-center ">
      <div className="backdrop-blur-xl  w-1/2 h-[85%] flex flex-col items-center justify-evenly border-none rounded-2xl">
        {/*bg-[#604E2F]*/}
        <h1 className="text-4xl font-semibold">LOG IN</h1>
        <div className="w-2/3">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="w-full flex flex-col items-start"
          >
            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Enter Your Name
            </h3>
            <div className="w-full flex gap-4 justify-between">
              <input
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                type="text"
                placeholder="First Name"
                className="rounded-md border-none h-8 bg-white  placeholder:text-base py-2 px-4 w-1/2 mb-3"
                required
              />
              <input
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                type="text"
                placeholder="Last Name"
                className="rounded-md border-none h-8 bg-white  placeholder:text-base py-2 px-4 w-1/2 mb-3"
                required
              />
            </div>
            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Enter Your Email
            </h3>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              placeholder="Email"
              className="rounded-md border-none h-8 bg-white  placeholder:text-base py-2 px-4 w-full mb-3"
              required
            />
            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Create Your Password
            </h3>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password"
              className="rounded-md border-none h-8 bg-white  placeholder:text-base py-2 px-4 w-full mb-5 "
              required
            />

            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Enter Number
            </h3>
            <input
              value={number}
              onChange={(e) =>
                setNumber(e.target.value ? Number(e.target.value) : "")
              }
              type="number"
              placeholder="Number"
              className="rounded-md border-none h-8 bg-white  placeholder:text-base py-2 px-4 w-full mb-3"
              required
            />

            <h3 className="text-xl text-[#D4B894] font-medium mb-2">
              Enter Your City
            </h3>
            <input
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              type="text"
              placeholder="City"
              className="rounded-md border-none h-8 bg-white  placeholder:text-base py-2 px-4 w-full mb-3"
              required
            />

            <button className="w-full border-2 border-[#8E7B61] rounded-md text-white  flex justify-center items-center bg-[#A27B4E] py-1.5 px-5 mb-5">
              Sign Up
            </button>
            <Link
              to={"/login"}
              className="w-full border-2 border-black rounded-md text-white bg-black py-1.5 px-5 flex justify-center items-center"
            >
              Register As Artist
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistSignUp;
