import React, { useEffect, useState } from 'react';
import './Home.css';
import logo from '../assets/breachpoint.png';
import { motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function Home(props) {
  axios.defaults.withCredentials = true;
  const [data, setData] = useState(null);
  const [team, setTeam] = useState(null);
  const [isCompleted, setCompleted] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [hint, setHint] = useState(null); // New state for hint
  const [showHintPrompt, setShowHintPrompt] = useState(false); // State for hint confirmation prompt

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      // Fetch challenges
      await axios.get('http://localhost:8082/api/challenges', { withCredentials: true })
        .then(response => {
          setData(response.data);
          console.log(response.data)
        })
        .catch(err => {
          if (err.response && err.response.status === 403) {
            // Redirect on 403 error without logging to the console
            navigate('/login');
          }
          // Optionally handle other errors silently if needed
        });
    
      // Fetch team score
      await axios.get('http://localhost:8082/api/team/score', { withCredentials: true })
        .then(response => {
          setTeam(response.data);
        })
        .catch(err => {
          if (err.response && err.response.status === 403) {
            // Redirect on 403 error without logging to the console
            // navigate('/login');
          }
          // Optionally handle other errors silently if needed
        });
    };    
    fetchData();
  }, []);

  const openChallengeDetails = async (challenge) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/challenges/${challenge.id}`, {
        withCredentials: true,
      });
  
      const fullChallenge = response.data;

      setSelectedChallenge({
        id: fullChallenge.id,
        name: fullChallenge.name,
        category: fullChallenge.category,
        points: fullChallenge.points,
        description: fullChallenge.description,
      });

    } catch (error) {
      console.error('Error fetching challenge details:', error);
    }
  };

  const closeChallengeDetails = () => {
    setSelectedChallenge(null);
    setCompleted(false);
    setHint(null); // Reset the hint when the modal is closed
    setShowHintPrompt(false); // Reset the prompt state when modal is closed
  };

  const fetchHint = async (challengeId) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/challenges/hint/${challengeId}`, { withCredentials: true });
      console.log(response.data);
      return response.data; // Assuming the API returns the hint text in a "hint" field
    } catch (error) {
      console.error('Error fetching hint:', error);
      return null;
    }
  };

  const promptForHint = async () => {
    setShowHintPrompt(true);
  };

  const handleHintDecision = async (useHint) => {
    if (useHint) {
      const fetchedHint = await fetchHint(selectedChallenge.id);
      if (fetchedHint) {
        setHint(fetchedHint);
      } else {
        setHint("Hint could not be fetched.");
      }
    }
    setShowHintPrompt(false); // Close the prompt regardless of the user's decision
  };

  const solveChallenge = async () => {
    const flag = document.getElementById('flag_input').value;
    const message = document.getElementById('message');
  
    if (flag.length !== 0) {
      try {
        const response = await axios.post(`http://localhost:8082/api/team/submit/${selectedChallenge.id}`, {
          flag: flag
        });
  
        if (response.data.message === "Already Solved!!") {
          message.innerHTML = "This challenge has already been solved!";
        } else if (response.data.status === "Solved") {
          message.innerHTML = "Correct flag! Challenge solved.";
          setCompleted(true);
          setTeam(prevTeam => ({
            ...prevTeam,
            score: response.data.score
          }));
        } else if (response.data.message === "Incorrect Flag") {
          message.innerHTML = "Incorrect flag, please try again.";
        } else if (response.data.message === "Incorrect challenge ID") {
          message.innerHTML = "Invalid challenge. Please try again.";
        }
      } catch (error) {
        console.error("Error submitting flag:", error);
        message.innerHTML = "There was an error submitting the flag. Please try again.";
      }
    } else {
      message.innerHTML = "The Flag should not be empty";
    }
  };

  const categories = data ? [...new Set(data.map(item => item.category))] : [];

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
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.7, ease: "easeOut" } },
  };

  const modalVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 1., ease: "easeOut" } },
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

      {/* Challenges Section */}
      <div className="bg-black">
        <motion.p
          className="text-2xl text-bold font-bold text-hacker-green font-orbitron p-10 no-select"
          variants={spanVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          CHALLENGES
        </motion.p>
      </div>

      <div className="challenge-list-container px-5 ml-6">
        {categories.map((category) => (
          <motion.div
            key={category}
            className="mb-10"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-hacker-green uppercase mb-5 border-b-2 border-hacker-green pb-3">
              {category}
            </h2>
            <motion.div 
              className="ml-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
            >
              {data
                .filter((item) => item.category === category)
                .map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-gray-900 border-2 border-transparent hover:border-hacker-green p-6 rounded-lg text-center transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-md hover:shadow-lg"
                    onClick={() =>
                      openChallengeDetails({
                        id: item.id,
                        name: item.name,
                        category: item.category,
                        points: item.points,
                        description: item.description,
                      })
                    }
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-xl cursor-pointer font-bold text-hacker-green mb-3">
                      {item.name}
                    </h3>
                    <p className="text-sm cursor-pointer text-gray-400">{item.points} points</p>
                    <p className="text-sm cursor-pointer text-gray-400">{item.flag}</p>
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
        ))}
      </div>


      {selectedChallenge && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal content */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Modal title, description, etc. */}
            <h2 className="text-2xl font-bold mb-4 text-hacker-green font-orbitron no-select">
              {selectedChallenge.name}
            </h2>
            <p className="mb-4 font-orbitron text-hacker-green no-select">
              {selectedChallenge.description}
            </p>
            <p className="mb-4 font-orbitron text-hacker-green no-select">
              Points: {selectedChallenge.points}
            </p>

            {/* Hint Section */}
            {hint && <p className="mb-4 text-yellow-500 font-orbitron">Hint: {hint.hints}</p>}
            {!hint && (
              <motion.button
                onClick={promptForHint}
                className="bg-hacker-green text-white px-4 py-2 rounded font-orbitron no-select"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Use Hint
              </motion.button>
            )}

            {/* Result message */}
            <span id="message" className="text-red-500 font-orbitron"></span>

            <input
              id="flag_input"
              type="text"
              placeholder="Enter flag here..."
              className="border focus:border-none rounded px-3 focus:ring-hacker-green py-2 w-full mb-4 no-select"
            />
            
            <motion.button
              onClick={solveChallenge}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-hacker-green text-white px-4 py-2 rounded font-orbitron no-select mr-4"
            >
              Submit
            </motion.button>

            <motion.button
              onClick={closeChallengeDetails}
              className="bg-hacker-green text-white px-4 py-2 rounded font-orbitron no-select"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Hint Prompt Modal */}
      {showHintPrompt && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <p className="mb-4 text-yellow-500 font-orbitron">
              Are you sure you want to use a hint? It may affect your final score.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => handleHintDecision(true)}
                className="bg-hacker-green text-white px-4 py-2 rounded font-orbitron no-select mr-4"
              >
                Yes, use hint
              </button>
              <button
                onClick={() => handleHintDecision(false)}
                className="bg-red-500 text-white px-4 py-2 rounded font-orbitron no-select"
              >
                No, cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
