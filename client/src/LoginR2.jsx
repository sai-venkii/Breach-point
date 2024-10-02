import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatrixEffect from "./components/MatrixEffect";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import API_BASE_URL from "./config";

const LoginR2 = () => {
  axios.defaults.withCredentials = true;
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!teamName || !password) {
      setAlertType("error");
      setAlertMessage("Please fill in all required fields.");
      return;
    }

    const url = `${API_BASE_URL}/api/round_2/auth/login`;
    const data = {
      teamName,
      password,
    };

    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        setAlertType("success");
        setAlertMessage("Login successful! Redirecting to home...");
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || "An error occurred. Please try again.";
      setAlertType("error");
      setAlertMessage(message);
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
    exit: { opacity: 0, y: 20 }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
    exit: { opacity: 0, x: 20 }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <div className="relative h-screen w-screen bg-black font-orbitron">
      <MatrixEffect />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black p-9 rounded-2xl text-white w-full max-w-md h-auto transition-all duration-700">

          {/* Alert Display */}
          <div className="absolute top-4 w-full max-w-md px-4">
            <AnimatePresence>
              {alertMessage && (
                <motion.div
                  className={`flex items-center p-4 text-sm border rounded-lg ${
                    alertType === "success"
                      ? "text-green-800 border-green-300 bg-green-50"
                      : "text-red-800 border-red-300 bg-red-50"
                  }`}
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 1 } }}
                >
                  <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                  </svg>
                  <span className="sr-only">{alertType === "success" ? "Success" : "Error"}</span>
                  <div>
                    <span className="font-medium"></span> {alertMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.h2
            className="text-3xl font-bold mb-6 text-center"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Breach Point
          </motion.h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div
              className="flex flex-col-reverse relative"
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                placeholder="Team Name"
                className="peer outline-none ring border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                Team Name
              </span>
            </motion.div>

            <motion.div
              className="flex flex-col-reverse relative"
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                placeholder="Password"
                className={`peer outline-none ring border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black`}
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                Password
              </span>
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={() => setPasswordVisible(prev => !prev)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </motion.div>

            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-16"
            >
              <motion.button
                type="submit"
                className="w-full py-2 px-4 bg-hacker-green rounded-md text-white font-semibold"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileTap={{ scale: 0.9 }}
              >
                Login
              </motion.button>
            </motion.div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginR2;
