import axios from "axios";
import React, { useState } from "react";
import PasswordFieldWithLabel from "./PasswordFieldWithLabel";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await axios.put(
        `http://localhost:3001/users/change-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccessMessage("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMessage("");
  };

  return (
    <form onSubmit={handlePasswordChange} className="my-6 flex flex-col gap-4">
      {error && <div className="text-pale-red">{error}</div>}
      {successMessage && (
        <div className="text-pale-green">{successMessage}</div>
      )}

      {/* Current Password */}
      <PasswordFieldWithLabel
        label="Current Password"
        placeholder="Enter your current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      {/* New Password */}
      <PasswordFieldWithLabel
        label="New Password"
        placeholder="Enter your new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {/* Confirm New Password */}
      <PasswordFieldWithLabel
        label="Confirm New Password"
        placeholder="Confirm your new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div className="flex items-center justify-between md:col-span-2 md-2:col-span-1 lg:col-span-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-fit mt-4 bg-dark-slate text-white font-semibold text-sm px-4 py-2 rounded-[2px] sm:text-base md:mt-8"
        >
          Reset
        </button>

        <button
          type="submit"
          className="w-fit mt-4 bg-black text-white font-semibold text-sm px-4 py-2 rounded-[2px] sm:text-base md:mt-8"
        >
          Change Password
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
