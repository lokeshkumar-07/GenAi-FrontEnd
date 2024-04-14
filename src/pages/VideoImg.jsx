import React, { useEffect, useRef, useState } from "react"; 
import axios from "axios"; 
import {ApiUrl} from '../config.js'
import { FaArrowUp } from "react-icons/fa";
import { GiArtificialHive } from "react-icons/gi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch, useSelector } from "react-redux";
import { createProQuery, getProQueries } from "../features/visionProSlice.js";
import Loading from "../components/Loading.jsx";
import { TextField } from "@mui/material";

const App = () => {

  const dispatch = useDispatch()

  const {allqueries} = useSelector((state) => state.proQuery)
  const {currentUser} = useSelector((state) => state.auth)
  console.log(allqueries)
  const [data, setData] = useState(undefined);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState(0)

  const [fileUploadError, setFileUploadError] = useState(false);

  const [images, setImages] = useState([]);
  let imagesUrl = []

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Track progress if needed
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(storageRef)
                    .then((downloadURL) => {
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        );
    });
  };
  
  const productImageChange = (e) => {
    const files = Array.from(e.target.files)

    setImages([])

    files.forEach((file) => {
      const reader = new FileReader()

      reader.onload= () => {
        if (reader.readyState === 2){
          setImages((old) => [...old, reader.result])
        }
      }

      reader.readAsDataURL(file)
    })
  }

 const fetchDataFromGeminiProVisionAPI = async () => {
    try {
        if (!inputText) {
            alert("Please enter text!");
            return;
        }
        setLoading(true);

        const fileInputEl = document.querySelector("input[type=file]");
        const formData = new FormData();
        formData.append("inputText", inputText);

        const uploadedImageUrls = [];
        for (let i = 0; i < fileInputEl.files.length; i++) {
            const imageUrl = await handleFileUpload(fileInputEl.files[i]);
            uploadedImageUrls.push(imageUrl);
        }

        for (let i = 0; i < fileInputEl.files.length; i++) {
          formData.append('images', fileInputEl.files[i]);
        }

        formData.append('imagesUrl', uploadedImageUrls.join(',')); // Join URLs into a single string



        // const response = await axios.post(`${ApiUrl}/pro-vision/create`, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // });

        console.log(uploadedImageUrls)

        if(uploadedImageUrls.length === 0){
          setLoading(false)
          
          alert("Please select atleat one image!")
        }else{
          await dispatch(createProQuery(formData))
          setLoading(false)
          setCount(count+1)
          setInputText("")
        }

        
    } catch (error) {
        setLoading(false);
        console.error("fetchDataFromGeminiAPI error: ", error);
    }
  }

  const getAllProVisionQueries = async() => {
    await dispatch(getProQueries())
  }

  const scrollRef = useRef()
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [count]);

  useEffect(() => {
    getAllProVisionQueries()
  },[count])
 
  return (
    <div>
      <div className="flex container h-screen justify-center mx-auto">
        <div className="flex justify-between w-[90%] lg:w-[70%] flex-col gap-2">
          <div className="query_result flex flex-col  gap-2 h-[80vh] max-h-[80vh] overflow-y-auto scroll-smooth custom-scrollbar w-[80%] mt-[28px] mx-auto">
            <div className="flex flex-col gap-8 ">
              {allqueries.length > 0 ? (allqueries.map((query,index) => (
                <div className="" key={index}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src={currentUser.avatar} className="h-[22px] w-[22px] rounded-full" />
                      <h1 className="font-semibold text-[16px]">You</h1>
                    </div>
                    <h1>{query.text}</h1>
                  </div>
                  
                  <div className="flex  gap-2">
                    {query.images.map((imgUrl, index) => (
                      <img key={index} src={imgUrl} className="h-[100px] w-[100px]" />
                    ))}
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

          
          
          <div className="query_type  align-bottom flex  flex-col lg:flex-row  items-center justify-between gap-2 mb-8 w-[80%] mx-auto">
            
            <div className=" flex items-center justify-center">
              <input className="text-center flex justify-center items-center "
                type="file"
                name="productImages"
                accept='image/*'
                onChange={productImageChange}
                multiple
              />
            </div>
            <div className=" w-[70%] flex gap-2 p-2 ">
              <TextField multiline minRows={1} maxRows={5} value={inputText}  placeholder='Type Message Query....' onChange={(e) => setInputText(e.target.value)} className='w-full outline-none px-2 py-2 overflow-hidden' />
              <div onClick={() => fetchDataFromGeminiProVisionAPI() } className={`${!inputText && "pointer-events-none "}  ${ inputText ? "bg-black" : "bg-gray-300 "} text-white hover:cursor-pointer h-[40px] align-bottom  rounded-md p-2`}>
                <FaArrowUp />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}; 
    
    export default App;