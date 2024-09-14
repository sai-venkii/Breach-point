import React, { useEffect,useState } from 'react';
import './Home.css';
import logo from '../assets/breakp.jpeg';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { motion } from "framer-motion";
import axios from 'axios';

export default function Home(props) {
  axios.defaults.withCredentials = true
  const [data,setData] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/challenges', {
          withCredentials:true
        });
        console.log('Data:', response.data);
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
const [selectedChallenge, setSelectedChallenge] = useState(null);

  const openChallengeDetails = (challenge) => {
    setSelectedChallenge(challenge);
  };
  const closeChallengeDetails = () => {
    setSelectedChallenge(null);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } },
    exit: { opacity: 0, y: 20 },
  };

  const spanVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } },
    exit: { opacity: 0, y: 20 },
  };

  const challengeVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5,delay: 0.5 , ease: "easeOut" } },
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
            href="/"
            className="block px-3 mt-2 font-bold text-xl text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-hacker-green md:p-0 md:dark:hover:text-hacker-green dark:text-hacker-green dark:hover:bg-gray-700 dark:hover:text-hacker-green md:dark:hover:bg-transparent dark:border-gray-700 font-orbitron no-select"
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
          >
            Sign Out
          </motion.a>
        </div>
      </motion.nav>

      {/* Team Info Section */}
      <div className="pt-16 bg-black">
        <div className="text-center py-5">
          <motion.p
            className="text-2xl text-hacker-green font-bold font-orbitron p-3 no-select"
          >
            {props.teamName}
          </motion.p>
          <motion.p
            className="text-2xl text-hacker-green font-orbitron no-select"
          >
            {props.teamScore}
          </motion.p>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="bg-black">
        <motion.p
          className="text-2xl text-bold font-bold text-hacker-green font-orbitron p-10 no-select"
          variants={spanVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          Challenges
        </motion.p>
      </div>

      <div className="px-20 py-5">
        <ul className="list-disc pl-6">
          {/* OSINT Challenges */}
          <motion.li
            className="text-hacker-green text-2xl font-orbitron no-select"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
          >
            OSINT
            <ul className="mt-4">
              {data &&
                data.map(
                  (item) =>
                    item.category === "OSINT" && (
                      <motion.li
                        key={item.id}
                        className="font-orbitron cursor-pointer"
                        onClick={() =>
                          openChallengeDetails({
                            name: item.name,
                            category: item.category,
                            points: item.points,
                          })
                        }
                        whileHover={{ scale: 1.05, color: "#00FF00" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.name}
                      </motion.li>
                    )
                )}
            </ul>
          </motion.li>

          {/* Crypto Challenges */}
          <motion.li
            className="text-hacker-green text-2xl font-orbitron no-select"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
          >
            Crypto
            <ul className="mt-4">
              {data &&
                data.map(
                  (item) =>
                    item.category === "Crypto" && (
                      <motion.li
                        key={item.id}
                        className="font-orbitron cursor-pointer"
                        onClick={() =>
                          openChallengeDetails({
                            name: item.name,
                            category: item.category,
                            points: item.points,
                          })
                        }
                        whileHover={{ scale: 1.05, color: "#00FF00" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.name}
                      </motion.li>
                    )
                )}
            </ul>
          </motion.li>

          {/* Forensics Challenges */}
          <motion.li
            className="text-hacker-green text-2xl font-orbitron no-select"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
          >
            Forensics
            <ul className="mt-4">
              {data &&
                data.map(
                  (item) =>
                    item.category === "Forensics" && (
                      <motion.li
                        key={item.id}
                        className="font-orbitron cursor-pointer"
                        onClick={() =>
                          openChallengeDetails({
                            name: item.name,
                            category: item.category,
                            points: item.points,
                          })
                        }
                        whileHover={{ scale: 1.05, color: "#00FF00" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.name}
                      </motion.li>
                    )
                )}
            </ul>
          </motion.li>
        </ul>
      </div>

      {/* Modal for Challenge Details */}
      {selectedChallenge && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeChallengeDetails}
          ></div>
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full z-10 modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-hacker-green font-orbitron no-select">
              {selectedChallenge.name}
            </h2>
            <p className="mb-4 font-orbitron text-hacker-green no-select">
              {selectedChallenge.category}
            </p>
            <p className="mb-4 font-orbitron text-hacker-green no-select">
              Number of Solves: {selectedChallenge.points}
            </p>
            <input
              type="text"
              placeholder="Enter flag here..."
              className="border rounded px-3 py-2 w-full mb-4 no-select"
            />
            <button
              onClick={closeChallengeDetails}
              className="bg-hacker-green text-white px-4 py-2 rounded hover:bg-green-600 font-orbitron no-select"
              whileHover={{ scale: 1.1 }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
