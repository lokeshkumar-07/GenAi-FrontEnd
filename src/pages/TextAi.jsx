import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { FaArrowUp } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import {ApiUrl} from '../config.js'
import { createQuery, getQueries } from '../features/querySlice.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../components/Loading.jsx';
import { GiArtificialHive } from 'react-icons/gi';



const TextAi = () => {
  const [count,setCount] = useState(0)
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state) => state.auth)
  const {queries} = useSelector((state) => state.query)


  console.log(queries)

  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false);
 

  const handleClick = async() => {
    setText("")
    setLoading(true)
    const data = {
      query: text
    }
    
    await dispatch(createQuery(data)).
    then((res) => {
      console.log(res)
      setLoading(false)
      if(res.type == "query/create/rejected"){
        setLoading(false)
        toast.error("Offinsive Query. Can't provide for safety reason!")
      }
    })
    .catch(err => console.log(err))
    setLoading(false)
    setCount(count+1)
  }

  const getAllQueries = async() => {
    await dispatch(getQueries())
  }

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const scrollRef = useRef()
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [count]);

  useEffect(() => {
    getAllQueries()
  },[count])

  return (
    <div>
      <div className='flex container h-screen justify-center mx-auto '>
        <div className='flex justify-between  w-[90%] lg:w-[60%] flex-col gap-2'>
          <div className='query_result h-[80vh] max-h-[80vh] overflow-y-auto scroll-smooth custom-scrollbar w-[80%] mx-auto mt-[28px]'>
          <div className="flex flex-col gap-8 ">
              {queries.length > 0 ? (queries.map((query,index) => (
                <div className="" key={index}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src={currentUser.avatar} className="h-[22px] w-[22px] rounded-full" />
                      <h1 className="font-semibold text-[16px]">You</h1>
                    </div>
                    <h1>{query.query}</h1>
                  </div>
                  

                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-[22px] mt-1 flex items-center gap-2"><GiArtificialHive  /> <span className="font-semibold text-[16px]">Ai</span></span>
                    <div dangerouslySetInnerHTML={{__html: query.result}}></div>
                  </div>  
                </div>
              ))) : (
                <div className="flex flex-col gap-4 justify-center mx-auto items-center mt-[250px]">
                  <GiArtificialHive className="w-[32px] h-[32px]" />

                  <h1 className="text-[22px] font-semibold">Hi {currentUser.name}, How can I help you?</h1>
                </div>
              )}
            </div>
                        
            <div ref={scrollRef}></div>
          </div>

          {loading && (<div className="w-[80%] flex justify-between mx-auto">
            <Loading className="w-[20px] h-[5px] " />
            <div></div>
          </div>)}

          <div className='query_type align-bottom mb-8 w-[80%] mx-auto '>
          <div className="border query-box border-gray-500 rounded-xl flex gap-2 p-2">
            <textarea
              value={text}
              onChange={handleChange}
              placeholder="Message ChatGPT...."
              className="w-full outline-none resize-none px-2 py-2"
              style={{ overflow: 'hidden' }}
            />
            <div
              onClick={handleClick}
              className={`${
                !text && 'pointer-events-none '
              } ${text ? 'bg-black' : 'bg-gray-300'} text-white hover:cursor-pointer rounded-md p-2`}
            >
              <FaArrowUp />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextAi
