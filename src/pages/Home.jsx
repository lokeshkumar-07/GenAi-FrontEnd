import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [result , setResult] = useState("")
  const {currentUser} = useSelector((state) => state.auth)

  const handleClick = async() => {
    const data = {
        query: query
    }
    await axios({
        url: `http://localhost:3001/api/gemini/create`,
        method : 'POST',
        data: data
    })   
    .then((res) => {
        setResult(res.data)
        console.log(res.data)
    })
    .catch(err => console.log(err))
    
  }
    
  return (
    <div className=''>
      <div className='h-screen  flex justify-center items-center'>
        <div className='content flex flex-col gap-2'>
          <h1 className='text-gray-700 text-[24px] text-center font-semibold'>Hello, {currentUser.name} Welcome to Program</h1>

          <div className='flex flex-col items-center mt-[40px] gap-2 sm:flex-row'>
            <div onClick={() => navigate('/text') } className='border hover:cursor-pointer border-gray-400 rounded-md p-10 w-fit flex justify-center items-center'>
              <h1 className='text-red-400 font-semibold text-[20px]'>Text Generator</h1>
            </div>

            <div onClick={() => navigate('/media') } className='border hover:cursor-pointer border-gray-400 rounded-md p-10 w-fit justify-center items-center'>
              <h1 className='text-red-400 font-semibold text-[20px]'>Image Analysie</h1>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Home
