import React from 'react';

export default function Home(props) {
  return (
    <>
      <nav className="bg-black dark:bg-black fixed w-full z-20 top-0 start-0 border-b border-hacker-green dark:border-hacker-green">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-orbitron whitespace-nowrap dark:text-hacker-green">CTF</span>
          </a>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-hacker-green md:p-0 md:dark:hover:text-hacker-green dark:text-hacker-green dark:hover:bg-gray-700 dark:hover:text-hacker-green md:dark:hover:bg-transparent dark:border-gray-700 font-orbitron" aria-current="page">Home</a>
              </li>
              <li>
                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-hacker-green md:p-0 md:dark:hover:text-hacker-green dark:text-hacker-green dark:hover:bg-gray-700 dark:hover:text-hacker-green md:dark:hover:bg-transparent dark:border-gray-700 font-orbitron">Leaderboard</a>
              </li>
              <li>
                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-hacker-green md:p-0 md:dark:hover:text-hacker-green dark:text-hacker-green dark:hover:bg-gray-700 dark:hover:text-hacker-green md:dark:hover:bg-transparent dark:border-gray-700 font-orbitron">Sign Out</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="pt-16 bg-black"> {/* Ensure space for fixed navbar */}
        <div className="text-center py-5">
          <p className='text-2xl text-hacker-green font-orbitron p-3'>{props.teamName}</p>
          <p className='text-2xl text-hacker-green font-orbitron'>{props.teamScore}</p>
        </div>
        <div className='bg-black'>
          <p className='text-2xl text-hacker-green font-orbitron px-10'>Challenges</p>
        </div>
      </div>
    </>
  );
}

