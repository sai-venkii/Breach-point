import React, { useState } from 'react';
import './Home.css';
import logo from '../assets/breakp.jpeg';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

export default function Home(props) {
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
            <span className="text-2xl font-orbitron whitespace-nowrap dark:text-hacker-green no-select">CTF</span>
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
          <p className='text-2xl text-hacker-green font-orbitron p-10 no-select'>Challenges</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between px-20 py-5 gap-8">
        {/* OSINT Challenges */}
        <div className="relative bg-black px-6 py-4 w-full max-w-xs">
          <div className="branch">
            <div className="branch-line"></div>
            <div className="branch-end"></div>
          </div>
          <p className="text-hacker-green text-2xl flex font-orbitron items-center no-select">
            OSINT
            <span style={{ cursor: 'pointer', marginLeft: '10px' }}>
              <AiOutlineDown />
            </span>
          </p>
          <div className="challenges-content mt-4">
            <ul className="list-disc pl-6">
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'OSINT Challenge 1', description: 'Description of OSINT Challenge 1', solves: 5 })}>Challenge 1</li>
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'OSINT Challenge 2', description: 'Description of OSINT Challenge 2', solves: 3 })}>Challenge 2</li>
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'OSINT Challenge 3', description: 'Description of OSINT Challenge 3', solves: 8 })}>Challenge 3</li>
            </ul>
          </div>
        </div>

        {/* Crypto Challenges */}
        <div className="relative bg-black px-6 py-4 w-full max-w-xs">
          <div className="branch">
            <div className="branch-line"></div>
            <div className="branch-end"></div>
          </div>
          <p className="text-hacker-green text-2xl flex font-orbitron items-center no-select">
            Crypto
            <span style={{ cursor: 'pointer', marginLeft: '10px' }}>
              <AiOutlineDown />
            </span>
          </p>
          <div className="challenges-content mt-4">
            <ul className="list-disc pl-6">
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'Crypto Challenge 1', description: 'Description of Crypto Challenge 1', solves: 10 })}>Challenge 1</li>
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'Crypto Challenge 2', description: 'Description of Crypto Challenge 2', solves: 2 })}>Challenge 2</li>
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'Crypto Challenge 3', description: 'Description of Crypto Challenge 3', solves: 7 })}>Challenge 3</li>
            </ul>
          </div>
        </div>

        {/* Forensics Challenges */}
        <div className="relative bg-black px-6 py-4 w-full max-w-xs">
          <div className="branch">
            <div className="branch-line"></div>
            <div className="branch-end"></div>
          </div>
          <p className="text-hacker-green text-2xl flex font-orbitron items-center no-select">
            Forensics
            <span style={{ cursor: 'pointer', marginLeft: '10px' }}>
              <AiOutlineDown />
            </span>
          </p>
          <div className="challenges-content mt-4">
            <ul className="list-disc pl-6">
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'Forensics Challenge 1', description: 'Description of Forensics Challenge 1', solves: 4 })}>Challenge 1</li>
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'Forensics Challenge 2', description: 'Description of Forensics Challenge 2', solves: 6 })}>Challenge 2</li>
              <li className='font-orbitron cursor-pointer' onClick={() => openChallengeDetails({ title: 'Forensics Challenge 3', description: 'Description of Forensics Challenge 3', solves: 9 })}>Challenge 3</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal for Challenge Details */}
      {selectedChallenge && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeChallengeDetails}></div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full z-10 modal-content">
            <h2 className="text-2xl font-bold mb-4 text-hacker-green font-orbitron no-select">{selectedChallenge.title}</h2>
            <p className="mb-4 font-orbitron text-hacker-green no-select">{selectedChallenge.description}</p>
            <p className="mb-4 font-orbitron text-hacker-green no-select">Number of Solves: {selectedChallenge.solves}</p>
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
