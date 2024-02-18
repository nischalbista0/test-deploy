import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const PasswordFieldWithLabel = ({ label, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [, setError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError("");
    }

    onChange(e);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="password" className="font-semibold">
        {label}
      </label>

      <div className="p-4 bg-white flex items-center gap-2 border transition-all duration-200 ease-linear hover:border-purple-lighter focus:border-purple-lighter">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder={placeholder}
          value={value}
          onChange={handlePasswordChange}
          className="flex-1 outline-none rounded-[3px] text-[14px] font-semibold placeholder:text-gray-600  dark:text-white"
        />

        <div onClick={handleTogglePassword} className="cursor-pointer">
          {showPassword ? (
            <AiFillEye className="text-2xl text-dark-slate dark:text-white" />
          ) : (
            <AiFillEyeInvisible className="text-2xl text-dark-slate dark:text-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordFieldWithLabel;
