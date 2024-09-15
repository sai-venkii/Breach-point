import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatrixEffect from "./components/MatrixEffect";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const validatePassword = (password) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  specialChar: /[@$!%*?&]/.test(password)
});

const Login = () => {
  axios.defaults.withCredentials = true;
  const [isRegister, setIsRegister] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
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

  const toggleForm = () => setIsRegister(prevState => !prevState);

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordCriteria(validatePassword(newPassword));
    setPasswordError(""); // Clear error message if valid
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!teamName || !password || (isRegister && (!email || !confirmPassword))) {
      setAlertType("error");
      setAlertMessage("Please fill in all required fields.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setAlertType("error");
      setAlertMessage("Passwords do not match.");
      return;
    }

    if (!passwordCriteria.length || !passwordCriteria.uppercase || !passwordCriteria.lowercase || !passwordCriteria.number || !passwordCriteria.specialChar) {
      setPasswordError("Please meet all password criteria.");
      return;
    }

    const url = isRegister ? 'http://localhost:8082/auth/register' : 'http://localhost:8082/auth/login';
    const data = {
      teamName,
      password,
      ...(isRegister && { email, confirmPassword })
    };

    try {
      const response = await axios.post(url, data);
      if (response.status === 200 || response.status === 201) {
        setAlertType("success");
        if (isRegister) {
          setAlertMessage("Registration successful! Redirecting to Login...");
          setTimeout(() => {
            setIsRegister(false); // Switch to login form
          }, 2000); // Wait for the alert message to show
        } else {
          setAlertMessage("Login successful! Redirecting to home...");
          setTimeout(() => navigate('/home'), 2000);
        }
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

  const buttonContainerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.6 } },
    exit: { opacity: 0, height: 0 }
  };

  const confirmPasswordVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.8, delay: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5 } }
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
            key={isRegister ? "register" : "login"}
          >
            {isRegister ? "Register" : "Breach Point"}
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
                className="peer outline-none ring px-4 h-10 border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                Team Name
              </span>
            </motion.div>

            {isRegister && (
              <AnimatePresence>
                <motion.div
                  className="flex flex-col-reverse relative"
                  key="email"
                  variants={confirmPasswordVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <input
                    placeholder="Email"
                    className="peer outline-none ring px-4 h-10 border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                    Email
                  </span>
                </motion.div>
              </AnimatePresence>
            )}

            <motion.div
              className="flex flex-col-reverse relative"
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                placeholder="Password"
                className={`peer outline-none ring px-4 h-10 border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black ${passwordError ? 'border-red-500' : ''}`}
                type={passwordVisible ? "text" : "password"}
                value={password}
                onFocus={() => setShowPasswordCriteria(isRegister)}
                onBlur={() => setShowPasswordCriteria(false)}
                onChange={handlePasswordChange}
              />
              <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                Password
              </span>
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={() => setPasswordVisible(prev => !prev)}
              >
                {passwordVisible ? <FaEyeSlash size={20} color="gray" /> : <FaEye size={20} color="gray" />}
              </button>
            </motion.div>

            {showPasswordCriteria && isRegister && (
              <div className={`mt-2 text-sm ${!passwordCriteria.length || !passwordCriteria.uppercase || !passwordCriteria.lowercase || !passwordCriteria.number || !passwordCriteria.specialChar ? 'text-red-500' : 'text-gray-300'}`}>
                <ul>
                  <li className={passwordCriteria.length ? 'text-green-500' : 'text-red-500'}>At least 8 characters long</li>
                  <li className={passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}>Includes at least one uppercase letter</li>
                  <li className={passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}>Includes at least one lowercase letter</li>
                  <li className={passwordCriteria.number ? 'text-green-500' : 'text-red-500'}>Includes at least one number</li>
                  <li className={passwordCriteria.specialChar ? 'text-green-500' : 'text-red-500'}>Includes at least one special character (!@#$)</li>
                </ul>
              </div>
            )}

            {isRegister && (
              <AnimatePresence>
                <motion.div
                  className="flex flex-col-reverse relative"
                  key="confirmPassword"
                  variants={confirmPasswordVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <input
                    placeholder="Confirm Password"
                    className="peer outline-none ring px-4 h-10 border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                    Confirm Password
                  </span>
                </motion.div>
              </AnimatePresence>
            )}

            <motion.div
              variants={buttonContainerVariants}
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
                {isRegister ? "Register" : "Login"}
              </motion.button>
            </motion.div>

            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <span>
                {isRegister ? "Already have an account?" : "Do not have an account?"}
              </span>
              <motion.button
                type="button"
                onClick={toggleForm}
                className="ml-2 hover:underline font-semibold"
              >
                {isRegister ? "Login" : "Register"}
              </motion.button>
            </motion.div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
