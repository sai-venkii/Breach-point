import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './Home'
import Login from './Login'
import Round2 from './Round2';
import LoginR2 from './LoginR2';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/round2' element={<Round2/>}/>
        <Route path='/round2/login' element={<LoginR2/>}/>
      </Routes>
    </Router>
  )
}

export default App
