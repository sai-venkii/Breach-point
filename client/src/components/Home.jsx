import React, { useEffect,useState } from 'react';
import './Home.css';
import logo from '../assets/breakp.jpeg';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import axios from 'axios';

export default function Home(props) {
  const [OSINTO,setOSINTOpen] = useState(true)
  const [FO,setFOpen] = useState(true)
  const [CO,setCOOpen] = useState(true)

  const toggleOSINTChallenges = () =>{
    setOSINTOpen(!OSINTO)
  }
  const toggleCRYPTOChallenges = () =>{
    setCOOpen(!CO)
  }
  const toggleFORENSICSChallenges = () =>{
    setFOpen(!FO)
  }
  const [data,setData] = useState(null)
  useEffect(() => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtIjoidGVzdDIiLCJlbWFpbCI6IjIycGMwNEBwc2d0ZWNoLmFjLmluIiwiaWF0IjoxNzI2MjAxMzM1LCJleHAiOjE3MjYyMTkzMzV9.CjsQfm31EV1V59cE6AGWjcysrcVZhbjLF5asmK3WDf8';

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/challenges', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
  return (
    <>
      <nav className="bg-black dark:bg-black fixed w-full z-20 top-0 start-0 border-b border-hacker-green dark:border-hacker-green">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-1">
            <img src={logo} alt="Logo" className="h-8" />
            <span className="text-2xl px-1 font-orbitron whitespace-nowrap dark:text-hacker-green no-select">Breach Point</span>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-hacker-green md:p-0 md:dark:hover:text-hacker-green dark:text-hacker-green dark:hover:bg-gray-700 dark:hover:text-hacker-green md:dark:hover:bg-transparent dark:border-gray-700 font-orbitron no-select" aria-current="page">Home</a>
              </li>
              <li>
                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-hacker-green md:p-0 md:dark:hover:text-hacker-green dark:text-hacker-green dark:hover:bg-gray-700 dark:hover:text-hacker-green md:dark:hover:bg-transparent dark:border-gray-700 font-orbitron no-select">Sign Out</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="pt-16 bg-black"> {/* Ensure space for fixed navbar */}
        <div className="text-center py-5">
          <p className='text-2xl text-hacker-green font-orbitron p-3 no-select'>{props.teamName}</p>
          <p className='text-2xl text-hacker-green font-orbitron no-select'>{props.teamScore}</p>
        </div>
        <div className='bg-black'>
          <p className='text-2xl text-bold text-hacker-green font-orbitron p-10 no-select'>Challenges</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between px-20 py-5 gap-8">
        {/* OSINT Challenges */}
        <div className="relative bg-black px-6 py-4 w-full max-w-xs">
          <p className="text-hacker-green text-2xl flex font-orbitron items-center no-select">
            OSINT
            <span onClick={toggleOSINTChallenges}style={{ cursor: 'pointer', marginLeft: '10px' }}>
              {OSINTO ?  <AiOutlineDown /> : <AiOutlineUp/>}
            </span>
          </p>
           {OSINTO &&  <div className="challenges-content mt-4">
            <ul className="list-disc pl-6">
            {data && data.map((item,index)=>(item.category=="OSINT" && 
              <li key={item.id} className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ name : item.name,category : item.category ,points: item.points})}>{item.name}</li>
          ))}
            </ul>
          </div> }
        </div>

        {/* Crypto Challenges */}
        <div className="relative bg-black px-6 py-4 w-full max-w-xs">
          <p className="text-hacker-green text-2xl flex font-orbitron items-center no-select">
            Crypto
            <span onClick={toggleCRYPTOChallenges} style={{ cursor: 'pointer', marginLeft: '10px' }}>
              {CO ? <AiOutlineDown /> : <AiOutlineUp/>}
            </span>
          </p>
          {CO && <div className="challenges-content mt-4">
            <ul className="list-disc pl-6">
            {data && data.map((item,index)=>(item.category=="Crypto"&&
              <li key={item.id} className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ name : item.name,category : item.category ,points: item.points})}>{item.name}</li>
          ))}
            </ul>
          </div>}
        </div>

        {/* Forensics Challenges */}
        <div className="relative bg-black px-6 py-4 w-full max-w-xs">
          <p className="text-hacker-green text-2xl flex font-orbitron items-center no-select">
            Forensics
            <span onClick={toggleFORENSICSChallenges} style={{ cursor: 'pointer', marginLeft: '10px' }}>
              {FO ? <AiOutlineDown /> : <AiOutlineUp/>}
            </span>
          </p>
          {FO && <div className="challenges-content mt-4">
            <ul className="list-disc pl-6">
          {data && data.map((item,index)=>(item.category=="Forensics" && 
              <li key={item.id} className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ name : item.name,category : item.category ,points: item.points})}>{item.name}</li>
          ))}
           </ul>
          </div>}
        </div>
      </div>

      {/* Modal for Challenge Details */}
      {selectedChallenge && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeChallengeDetails}></div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full z-10 modal-content">
            <h2 className="text-2xl font-bold mb-4 text-hacker-green font-orbitron no-select">{selectedChallenge.name}</h2>
            <p className="mb-4 font-orbitron text-hacker-green no-select">{selectedChallenge.category}</p>
            <p className="mb-4 font-orbitron text-hacker-green no-select">Number of Solves: {selectedChallenge.points}</p>
            <input
              type="text"
              placeholder="Enter flag here..."
              className="border rounded px-3 py-2 w-full mb-4 no-select"
            />
            <button
              onClick={closeChallengeDetails}
              className="bg-hacker-green text-white px-4 py-2 rounded hover:bg-green-600 font-orbitron no-select"
            >
              Close
            </button>
          </div>
        </div>  
      )}
    </>
  );
}
