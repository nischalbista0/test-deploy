import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { currentUserAtom } from "../../pages/MainPage";

const EditProfile = () => {
  const [user, setUser] = useAtom(currentUserAtom);
  const [fullname, setFullname] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullname(user?.data[0].fullname);
      setBio(user?.data[0].bio || "");
      setEmail(user?.data[0].email);
      setPhoneNumber(user?.data[0].phoneNumber || "");
      setInitialValues({
        fullname: user?.data[0].fullname,
        age: user?.data[0].age,
        bio: user?.data[0].bio || "",
        email: user?.data[0].email,
        phoneNumber: user?.data[0].phoneNumber || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:3001/users/edit-profile`,
        {
          fullname,
          age,
          bio,
          email,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = response.data;
      setUser(updatedUser);
      setSuccess(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleReset = () => {
    setFullname(initialValues.fullname);
    setBio(initialValues.bio);
    setEmail(initialValues.email);
    setPhoneNumber(initialValues.phoneNumber);
    setError("");
  };

  return (
    <form
      onSubmit={handleProfileUpdate}
      className="my-6 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-6 md-2:grid-cols-1 lg:grid-cols-2"
    >
      {error && (
        <div className="text-pale-red md:col-span-2 md-2:col-span-1 lg:col-span-2">
          {error}
        </div>
      )}

      {success && ( // Show success message when success is true
        <div className="text-pale-green md:col-span-2 md-2:col-span-1 lg:col-span-2">
          Profile updated successfully!
        </div>
      )}

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="fullname" className="font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white    border border-black  placeholder:text-gray-600 text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="age" className="font-medium">
          Age
        </label>
        <input
          type="text"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white border border-black  placeholder:text-gray-600 text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2 md-2:col-span-1 lg:col-span-2">
        <label htmlFor="bio" className="font-medium">
          Bio
        </label>
        <input
          type="text"
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white    border border-black  placeholder:text-gray-600 text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white    border border-black  placeholder:text-gray-600 text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="phoneNumber" className="font-medium">
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white    border border-black  placeholder:text-gray-600 text-sm sm:text-base"
        />
      </div>

      <div className="flex items-center justify-between md:col-span-2 md-2:col-span-1 lg:col-span-2">
        <button
          type="reset"
          className="w-fit mt-4 bg-dark-slate text-white font-semibold text-sm px-4 py-2 rounded-[2px] sm:text-base md:mt-8"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          type="submit"
          className="w-fit mt-4 bg-black text-white text-sm px-4 py-2 rounded-[2px] sm:text-base md:mt-8"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
