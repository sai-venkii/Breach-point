import React, { useEffect, useState } from "react";
import "./Home.css";
import logo from "./assets/breachpoint.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

export default function Home(props) {
  axios.defaults.withCredentials = true;
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState(null);
  const [team, setTeam] = useState(null);
  const [currentHintId, setCurrentHintId] = useState(null);
  const [pointsReduce, setPointsReduce] = useState(0);
  const [usedHints, setUsedHints] = useState(() => {
    const storedHints = localStorage.getItem('usedHints');
    return storedHints ? JSON.parse(storedHints) : [];
  });
  const [isCompleted, setCompleted] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [hints, setHints] = useState(() => {
    const storedHints = localStorage.getItem('hints');
    return storedHints ? JSON.parse(storedHints) : []; // Make sure this returns an array
  });
  const [showHintPrompt, setShowHintPrompt] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem('usedHints', JSON.stringify(usedHints));
    console.log("Local Item Updated")
  }, [usedHints]); 
  useEffect(() => {
    localStorage.setItem('hints', JSON.stringify(hints));
    console.log("hints Updated");
  }, [hints]);   
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setSelectedChallenge(null); // Close the modal
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleEsc);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [setSelectedChallenge]);
  useEffect(()=>{
    console.log(hints)
  },[hints])
  useEffect(()=>{
    console.log(selectedChallenge)
  },[selectedChallenge])
  useEffect(() => {
    if (alertMessage.length != 0) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setAlertMessage("");
        setShowAlert(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const Challengeresponse = await axios.get(
          `${API_BASE_URL}/api/challenges`,
          { withCredentials: true }
        );
        setData(Challengeresponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
      }

      try {
        const Teamresponse = await axios.get(`${API_BASE_URL}/api/team/score`, {
          withCredentials: true,
        });
        setTeam(Teamresponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  const openChallengeDetails = async (challenge) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/challenges/${challenge.id}`,
        {
          withCredentials: true,
        }
      );
      const fullChallenge = response.data;
      console.log(fullChallenge)
      setSelectedChallenge({
        id: fullChallenge.id,
        name: fullChallenge.name,
        category: fullChallenge.category,
        points: fullChallenge.points,
        description: fullChallenge.description,
        hintCount: fullChallenge.hintCount,
        files: fullChallenge.files,
        pointsReduce : fullChallenge['points reduction'],
        solves : fullChallenge.solves
      });
      console.log(selectedChallenge)
    } catch (error) {
      console.error("Error fetching challenge details:", error);
    }
  };

  const closeChallengeDetails = () => {
    setSelectedChallenge(null);
    setCompleted(false);
    setShowHintPrompt(false);
  };

  const fetchHint = async (challengeId, hintId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/challenges/${challengeId}/hint/${hintId}`,
        { withCredentials: true }
      );
      return {challengeId,hint:response.data.hint};
    } catch (error) {
      console.error("Error fetching hint:", error);
      return null;
    }
  };

  const fetchPoint = async (challengeId, hintId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/challenges/${challengeId}/hint/${hintId}`,
        { withCredentials: true }
      );
      return response.data.pointReduce;
    } catch (error) {
      console.error("Error fetching hint:", error);
      return null;
    }
  };

  const promptForHint = async (hintId) => {
    // const hintData = await fetchPoint(selectedChallenge.id, hintId);
    if (hintId) {
      setCurrentHintId(hintId);
      // setPointsReduce(hintData);
      setShowHintPrompt(true);

      // Mark this hint as used
      // setUsedHints((prevUsedHints) => new Set(prevUsedHints).add(hintId));
      // setUsedHints((prevUsedHints) => [...prevUsedHints,{challengeId:selectedChallenge.id, hintId}]);
    }
  };

  const handleHintDecision = async (useHint, hintId) => {
    if (useHint) {
      const fetchedHint = await fetchHint(selectedChallenge.id, hintId);
      // selectedChallenge
      setHints((prevHints) => [...prevHints,fetchedHint]);
      setUsedHints((prevUsedHints) => [...prevUsedHints,{challengeId:selectedChallenge.id, hintId}]);
    }
    setShowHintPrompt(false);
  };

  const solveChallenge = async () => {
    const flag = document.getElementById("flag_input").value;
    const message = document.getElementById("message");

    if (flag.length !== 0) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/team/submit/${selectedChallenge.id}`,
          {
            flag: flag,
          }
        );

        if (response.data.message === "Already Solved!!") {
          message.innerHTML = "This challenge has already been solved!";
          message.className = "text-green-500 mb-2 font-orbitron";
        } else if (response.data.status === "Solved") {
          message.innerHTML = "Correct flag! Challenge solved.";
          message.className = "text-green-500 mb-2 font-orbitron";
          setCompleted(true);
          setTeam((prevTeam) => ({
            ...prevTeam,
            score: response.data.score,
          }));
        } else if (response.data.message === "Incorrect Flag") {
          message.innerHTML = "Incorrect flag, please try again.";
          message.className = "text-red-500 mb-2 font-orbitron";
        } else if (response.data.message === "Incorrect challenge ID") {
          message.innerHTML = "Invalid challenge. Please try again.";
          message.className = "text-red-500 mb-2 font-orbitron";
        }
      } catch (error) {
        console.error("Error submitting flag:", error);
        message.innerHTML =
          "There was an error submitting the flag. Please try again.";
        message.className = "text-red-500 mb-2 font-orbitron";
      }
    } else {
      message.innerHTML = "The Flag should not be empty";
      message.className = "text-red-500 mb-2 font-orbitron";
    }
  };

  const categories = data
    ? [...new Set(data.map((item) => item.category))]
    : [];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: 20 },
  };

  const spanVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: 20 },
  };

  const challengeVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.2, ease: "easeOut" },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.2, ease: "easeOut" },
    },
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
            onClick={async () => {
              try{
                const logout = await axios.get(`${API_BASE_URL}/auth/logout`);
                if(logout.status == 200){
                  navigate('/login')
                }
              }catch(err){
                console.error(err);
              }
            }}
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
                    key={item}
                    className={`bg-gray-900 border-2 border-transparent p-6 rounded-lg text-center transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-md hover:shadow-lg ${
                      item.points > 250
                        ? "hover:border-red-600"
                        : item.points > 100 && item.points <= 250
                        ? "hover:border-orange-400"
                        : item.points <= 100
                        ? "hover:border-hacker-green"
                        : "border-transparent"
                    }`}
                    onClick={async () => {
                      // try{
                      try {
                        const response = await axios.get(
                          `${API_BASE_URL}/api/team/solved`
                        );
                        if (response.data.solved.includes(item.id)) {
                          setAlertMessage("Challenge Already Solved");
                          setAlertType("error");
                        } else {
                          openChallengeDetails({
                            id: item.id,
                            name: item.name,
                            category: item.category,
                            points: item.points,
                            description: item.description,
                            hintCount: item.hintCount,
                          });
                        }
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    <h3 className="text-xl cursor-pointer font-bold text-hacker-green mb-3">
                      {item.name}
                    </h3>
                    <p className="text-sm cursor-pointer text-gray-400">
                      {item.points} points
                    </p>
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
          <motion.div
            className="bg-gray-900 bg-opacity-75 absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
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
            <p className="mb-4 font-orbitron break-words text-hacker-green no-select">
              {selectedChallenge.description}
            </p>
            <p className="mb-4 font-orbitron text-hacker-green no-select">
              Points: {selectedChallenge.points}
            </p>

              {/* Hints section */}
              {selectedChallenge.hintCount > 0 &&
                <div className="mt-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  Hints ({hints.filter(elt=>elt.challengeId==selectedChallenge.id).length}/{selectedChallenge.hintCount} used)
                </h3>

                {hints.filter(elt=>elt.challengeId==selectedChallenge.id).map((hint, index) => (
                  
                   <p key={`hint-${hint}`}  className="hint-text font-orbitron text-orange-500 mb-2">
                    Hint {index+1}: {hint.hint || "Hint not used yet."}
                  </p>
                ))}
              </div>
              }

            {showHintPrompt && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-gray-900 bg-opacity-75 absolute inset-0"
                  onClick={() => setShowHintPrompt(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></motion.div>

                <motion.div
                  className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full z-10"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                <p className="mb-4 text-yellow-500 font-orbitron">
                    Are you sure you want to use a hint? {selectedChallenge.pointsReduce[currentHintId-1]
                    } points
                    will be reduced.
                </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleHintDecision(true, currentHintId)} // Pass the current hint ID
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

            <div className="mt-4">
              <p id="message"></p>
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
                className="bg-hacker-green text-white px-4 py-2 rounded font-orbitron font-bold no-select mr-4"
              >
                Submit
              </motion.button>

              <motion.button
                onClick={closeChallengeDetails}
                className="bg-hacker-green text-white px-4 py-2 rounded font-orbitron font-bold no-select"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Close
              </motion.button>
              {selectedChallenge.files.length != 0 && <motion.a
                className="bg-blue-500 ml-3 text-white px-5 py-[10px] rounded font-orbitron font-bold no-select"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={(e)=>{
                  window.open(selectedChallenge.files,'_blank','noopener,noreferrer')
                }}
              >
                File
              </motion.a>
              }
              {hints.filter(elt=>elt.challengeId==selectedChallenge.id).length<selectedChallenge.hintCount &&
                 (
                  <div>
                    {[...Array(selectedChallenge.hintCount)].map((_, index) => {
                      const hintId = index+1;
                      return (
                        !usedHints.find(elt => elt.hintId === hintId && elt.challengeId === selectedChallenge.id) && ( // Only render if this hint hasn't been used
                          <motion.button
                            key={`hint-${hintId}-${selectedChallenge.id}`} 
                            onClick={() => {promptForHint(hintId);}}
                            className="bg-yellow-500 mt-3 mr-3 text-white px-4 py-2 rounded font-orbitron font-bold no-select"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            Use Hint {hintId}
                          </motion.button>
                        )
                      );
                    })}
                  </div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {showAlert && (
        <AnimatePresence>
          <div className="fixed top-0 left-0 right-0 flex justify-center z-50">
            <motion.div
              className={`flex items-center p-4 text-sm border rounded-lg mt-4 ${
                alertType === "success"
                  ? "text-green-800 border-green-300 bg-green-50"
                  : "text-red-800 border-red-300 bg-red-50"
              }`}
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1 } }}
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">
                {alertType === "success" ? "Success" : "Error"}
              </span>
              <div>
                <span className="font-medium"></span> {alertMessage}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
}
