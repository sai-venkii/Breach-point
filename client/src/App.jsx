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
        <Route path='/login' element={<LoginR2/>}/>
        <Route path='/' element={<Round2/>}/>
      </Routes>
    </Router>
  )
}

export default App
