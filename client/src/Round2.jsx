import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "./assets/breachpoint.png";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import API_BASE_URL from "./config";

function Round2() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [inputFlag, setInputFlag] = useState("");
  const [correctFlags, setCorrectFlags] = useState([]);
  const [totalFlags, setTotalFlags] = useState(20);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isUserButtonDisabled,setIsUserButtonDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserSubmitting,setIsUserSubmitting] = useState(false);
  const [teamName, setTeamName] = useState("Your Team Name");
  // const [teamScore, setTeamScore] = useState(0);
  const [solvedChallenges, setSolvedChallenges] = useState(0);
  const [machineAssigned, setMachineAssigned] = useState("");
  const [machinePassword,setMachinePassword] = useState("")
  const [machineUsername,setMachineUsername] = useState("")
  const [showUsers,setShowUsers] = useState([])

  useEffect(()=>{
    const fetchUsers = async() =>{
      try{
        const response = await axios.get(`${API_BASE_URL}/api/round_2/cred`);
        setShowUsers(response.data.cred)
        console.log(setShowUsers)
        console.log(response.data.cred)
      }catch(err){
        console.log(err)
      }
    };
    fetchUsers();
  },[])
  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/round_2/score`);
        if (response.status === 200) {
          setTeamName(response.data.name);
          setSolvedChallenges(response.data.solved);
          setMachineAssigned(response.data.machine_assigned);
          setTotalFlags(response.data.total_flags);
        }
      } catch (err) {
        if (err.response && err.response.status === 403) {
          navigate("/login");
        } else {
          console.error("Error fetching team info", err);
        }
      }
    };

    fetchTeamInfo();
  }, [navigate]);

  useEffect(() => {
    if (alertMessage.length !== 0) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setAlertMessage("");
        setShowAlert(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleUserSubmit = async (e) =>{
    e.preventDefault();
    if(machineUsername.length === 0 || machinePassword.length === 0){
      setAlertMessage("Please enter all the details");
      setAlertType("error");
    }else{
      try {
        setIsUserSubmitting(true);
        setIsUserButtonDisabled(true);
        const response = await axios.post(
          `${API_BASE_URL}/api/round_2/cred`,
          {
            user :  machineUsername,
            password : machinePassword
          }
        );
        if (response.status === 200) {
          setAlertMessage(response.data.message);
          setAlertType("success");
          // Update team score and correct flags
          // setCorrectFlags([...correctFlags, inputFlag]);
          // setSolvedChallenges(response.data.solved);
        } else {
          setAlertMessage(response.data.message);
          setAlertType("error");
        }
      } catch (err) {
        setAlertMessage("Error submitting flag");
        setAlertType("error");
      } finally {
        setIsUserSubmitting(false);
        setTimeout(() => setIsUserButtonDisabled(false), 1500);
      }
    }
  }
  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    if (inputFlag.length === 0) {
      setAlertMessage("Please enter a flag");
      setAlertType("error");
    } else {
      try {
        setIsSubmitting(true);
        setIsButtonDisabled(true);

        const response = await axios.post(
          `${API_BASE_URL}/api/round_2/submit`,
          {
            flag: inputFlag,
          }
        );

        if (response.status === 200 && response.data.correct) {
          setAlertMessage(response.data.message);
          setAlertType("success");

          // Update team score and correct flags
          // setTeamScore(response.data.newTeamScore);
          setCorrectFlags([...correctFlags, inputFlag]);
          setSolvedChallenges(response.data.solved);
        } else {
          setAlertMessage(response.data.message);
          setAlertType("error");
        }
      } catch (err) {
        setAlertMessage("Error submitting flag");
        setAlertType("error");
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setIsButtonDisabled(false), 1500);
      }
    }
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
      <div className="pt-24 bg-black flex flex-col items-center">
        <div className="text-center mb-6">
          <motion.h2
            className="text-3xl text-hacker-green font-bold p-3 no-select"
            variants={spanVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Team: {teamName}
          </motion.h2>

          {/* <motion.h3
            className="text-xl text-hacker-green font-bold mb-2 no-select"
            variants={spanVariants} 
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Score: {teamScore}
          </motion.h3> */}

          {/* Display the machine assigned to the team */}
          <motion.h3
            className="text-xl text-hacker-green font-bold mb-2 no-select"
            variants={spanVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Machine Assigned: {machineAssigned}
          </motion.h3>
          <motion.h3
            className="text-xl text-hacker-green font-bold mb-2 no-select"
            variants={spanVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Users: {showUsers.join(", ")}
          </motion.h3>
          

          <motion.p
            className="text-xl text-hacker-green font-orbitron no-select"
            variants={spanVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Solved Challenges: {solvedChallenges}/{totalFlags}
          </motion.p>
        </div>

        {/* Flag Submission Section */}
        <div className="text-center">
          <motion.h2
            className="text-2xl text-hacker-green font-bold p-3 no-select"
            variants={spanVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Submit your flags
          </motion.h2>

          {/* Move the flag submission form here */}
          <form onSubmit={handleFlagSubmit} className="p-3">
            <motion.div
              className="flex flex-col justify-center items-center"
              variants={spanVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                type="text"
                className="p-2 text-black border-none focus:ring-hacker-green mb-4"
                placeholder="Enter flag"
                value={inputFlag}
                onChange={(e) => setInputFlag(e.target.value)}
              />
              <button
                type="submit"
                disabled={isButtonDisabled || isSubmitting}
                className={`ml-2 p-2 bg-hacker-green text-black font-bold ${
                  isSubmitting || isButtonDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? "Please wait..." : "Submit Flag"}
              </button>
            </motion.div>
          </form>
          <form onSubmit={handleUserSubmit} className="p-3">
            <motion.div
              className="flex "
              variants={spanVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                type="text"
                className="p-2 text-black border-none focus:ring-hacker-green mb-4"
                placeholder="Enter Username"
                value={machineUsername}
                onChange={(e) => setMachineUsername(e.target.value)}
              />
              <input
                type="text"
                className="p-2 ml-2 text-black border-none focus:ring-hacker-green mb-4"
                placeholder="Enter Password"
                value={machinePassword}
                onChange={(e) => setMachinePassword(e.target.value)}
              />
            </motion.div>
            <motion.div
              className="flex justify-center items-center"
              variants={spanVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                type="submit"
                disabled={isUserButtonDisabled || isUserSubmitting}
                className={`ml-2 p-2 h-10 bg-hacker-green text-black font-bold ${
                  isUserSubmitting || isUserButtonDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isUserSubmitting ? "Please wait..." : "Submit"}
              </button>
            </motion.div>
          </form>
        </div>
      </div>

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

export default Round2;
