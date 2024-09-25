import React from 'react'
import { useEffect, useState } from "react";
import "./Home.css";
import logo from "./assets/breachpoint.png";
import { motion } from "framer-motion";
import axios from "axios";

function Round2() {
    axios.defaults.withCredentials = true;
    const [data, setData] = useState(null);
    const [team, setTeam] = useState(null);
    const [inputFlag, setInputFlag] = useState("");
    const [correctFlags, setCorrectFlags] = useState([]);
    const [totalFlags] = useState(20); 
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const Challengeresponse = await axios.get(
            "http://localhost:8082/api/challenges",
            { withCredentials: true }
          );
          console.log("Data:", Challengeresponse.data);
          setData(Challengeresponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
  
        try {
          const Teamresponse = await axios.get(
            "http://localhost:8082/api/team/score",
            { withCredentials: true }
          );
          console.log("Data:", Teamresponse.data);
          setTeam(Teamresponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);

    const handleFlagSubmit = (e) => {
        e.preventDefault();

        const correctFlagList = ["flag1", "flag2", "flag3", /* and so on until 20 flags */];

        if (correctFlagList.includes(inputFlag) && !correctFlags.includes(inputFlag)) {
            setCorrectFlags((prevFlags) => [...prevFlags, inputFlag]);
        }
        
        setInputFlag("");
    };

    const navVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: "easeInOut" },
        },
        exit: { opacity: 0, y: 20 },
      };
    
      const spanVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: "easeInOut" },
        },
        exit: { opacity: 0, y: 20 },
      };
    
      return (
        <>
          {/* Nav Bar */}
          <motion.nav
            className="bg-black dark:bg-black fixed w-full z-20 top-0 left-0 border-b-2 drop-shadow-md border-hacker-green dark:border-hacker-green"
            style={{ boxShadow: "0 1px 10px 1px #00FF00" }}
            variants={navVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
              {/* Left section: Logo and Title */}
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8" />
                <motion.span
                  className="text-2xl font-bold ml-2 px-1 font-orbitron whitespace-nowrap dark:text-hacker-green no-select"
                  variants={spanVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  Breach Point
                </motion.span>
              </div>
    
              {/* Right section: Sign Out */}
              <motion.a
                href="/login"
                className="block px-3 mt-2 font-bold text-xl text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-hacker-green md:p-0 md:dark:hover:text-hacker-green dark:text-hacker-green dark:hover:bg-gray-700 dark:hover:text-hacker-green md:dark:hover:bg-transparent dark:border-gray-700 font-orbitron no-select"
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              >
                Sign Out
              </motion.a>
            </div>
          </motion.nav>
    
          {/* Team Info Section */}
          {team && (
            <div className="pt-16 bg-black mt-2">
              <div className="text-center py-5">
                <motion.p
                  className="text-3xl text-hacker-green font-bold p-3 no-select"
                  variants={spanVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {team.name}
                </motion.p>
                <motion.p
                  className="text-2xl text-hacker-green font-orbitron no-select"
                  variants={spanVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  Score : {team.score}
                </motion.p>
              </div>
            </div>
          )}
                      {/* Flag Submission Section */}
                      <div className="pt-16 bg-black text-center">
                <motion.h2
                    className="text-2xl text-hacker-green font-bold p-3 no-select"
                    variants={spanVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    Submit your flags
                </motion.h2>

                <form onSubmit={handleFlagSubmit} className="p-3">
                    <motion.input
                        type="text"
                        variants={spanVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="p-2 text-black border-none focus:ring-hacker-green"
                        placeholder="Enter flag"
                        value={inputFlag}
                        onChange={(e) => setInputFlag(e.target.value)}
                    />
                    <motion.button
                        type="submit"
                        variants={spanVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="ml-2 p-2 bg-hacker-green text-black font-bold"
                    >
                        Submit Flag
                    </motion.button>
                </form>

                <motion.p
                    className="text-xl text-hacker-green font-orbitron no-select"
                    variants={spanVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    Progress: {correctFlags.length}/{totalFlags}
                </motion.p>
            </div>
    </>
)}

export default Round2;