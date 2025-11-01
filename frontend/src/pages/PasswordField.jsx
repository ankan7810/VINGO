import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const PasswordField = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState("");
  const borderColor = "#ddd";

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pwd = "";

    do {
      const length = Math.floor(Math.random() * 6) + 8;
      pwd = "";
      for (let i = 0; i < length; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (!passwordRegex.test(pwd));

    setSuggestedPassword(pwd);
    return pwd;
  };

  const handleUseSuggested = () => {
    if (suggestedPassword) {
      onChange({ target: { value: suggestedPassword } });
    }
  };

  return (
    <div className="relative w-full focus:outline-none ">
      <input
        type={showPassword ? "text" : "password"}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none"
        style={{ border: `2px solid ${borderColor}` }}
        placeholder="Enter your Password"
        value={value}
        onChange={onChange}
      />

      {/* Toggle show/hide */}
      <button
        type="button"
        className="absolute right-3 top-3 text-sm text-gray-500 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
      </button>

      {/* Suggest password section */}
      <div className="mt-2">
        <button
          type="button"
          className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer bg-[#ff4d2d] text-white hover:bg-[#e64323]"
          onClick={generatePassword}
        >
          Generate Strong Password
        </button>

        {suggestedPassword && (
          <div className="mt-1 text-gray-600 text-sm">
            Password:{" "}
            <span className="font-mono">{suggestedPassword}</span>{" "}
            <button
              type="button"
              className="text-green-500 underline ml-2 cursor-pointer"
              onClick={handleUseSuggested}
            >
              Click to use
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordField;
