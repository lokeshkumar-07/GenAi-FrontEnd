import { useState } from 'react'
import "./App.css"


function App() {
  const [count, setCount] = useState(0)

  const {currentUser} = useSelector((state) => state.auth)

  const UserRoute = ({element}) => {
    if(currentUser){
      return element
    }else{
      return <Navigate to="/signin" />
    }
  }

  const AlreadyLogin = ({element}) => {
    if(currentUser){
      return <Navigate to='/' />
    }else{
      return element
    }
  }
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserRoute element={<Home />} />} />
          <Route path='/text' element={<UserRoute element={<TextAi /> } />} />
          <Route path='/media' element={<UserRoute element={<VideoImg />} />} />
          <Route path='/signin' element={<AlreadyLogin element={<SignIn />} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import TextAi from './pages/TextAi'
import VideoImg from './pages/VideoImg'
import SignIn from './pages/SignIn'
import { useSelector } from 'react-redux'

export default App
