import React, { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import MatrixEffect from "./components/MatrixEffect";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";

const Login = () => {
  axios.defaults.withCredentials = true
  const [isRegister, setIsRegister] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate()
  const toggleForm = () => {
    setIsRegister((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = 'http://localhost:8082/auth/login';

    const data = {
      teamName,
      password,
      ...(isRegister && { confirmPassword })
    };

    try {
      const response = await axios.post(url, data);
      if (response.status == 200){
        navigate('/')
      }
    } catch (error) {
      console.error('Error:', error);
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
    visible: { opacity: 1, height: "auto", transition: { duration: 0.8, delay: 0.3, ease: easeInOut } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative h-screen w-screen bg-black font-orbitron">
      <MatrixEffect />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black p-9 rounded-2xl text-white w-full max-w-md h-auto transition-all duration-700">
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
              className="flex flex-col-reverse"
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                placeholder="Team Name"
                className="peer outline-none ring px-4 h-10 border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 text-s shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                Team Name
              </span>
            </motion.div>
            
            <AnimatePresence>
              {isRegister && (
                <motion.div
                  className="flex flex-col-reverse"
                  key="confirmPassword"
                  variants={confirmPasswordVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <input
                    placeholder="Email"
                    className="peer outline-none ring px-4 h-10 border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 text-s shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black"
                    type="text"
                  />
                  <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                    Email
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="flex flex-col-reverse"
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                placeholder="Password"
                className="peer outline-none ring px-4 h-10 border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 text-s shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                Password
              </span>
            </motion.div>

            <AnimatePresence>
              {isRegister && (
                <motion.div
                  className="flex flex-col-reverse"
                  key="confirmPassword"
                  variants={confirmPasswordVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <input
                    placeholder="Confirm Password"
                    className="peer outline-none ring px-4 h-10 border-0 font-inter rounded-lg ring-gray-200 text-black duration-500 focus:ring-2 focus:border-gray-100 relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 text-s shadow-xl shadow-gray-400/10 focus:shadow-none focus:rounded-md focus:ring-hacker-green placeholder:text-black"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span className="duration-500 opacity-0 peer-focus:opacity-100 text-hacker-green text-xs -translate-y-12 peer-focus:-translate-y-1">
                    Confirm Password
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

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
                whileTap={{scale: 0.9}}
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
              <span className="">
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
