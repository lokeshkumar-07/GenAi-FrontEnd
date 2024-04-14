import { TextField } from '@mui/material'
import { Formik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup'
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import {app} from '../firebase'
import { useDispatch } from 'react-redux';
import { login, register, signInWithGoogle } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const registerValues = {
    email: "",
    password: "",
    name: ""
}

const signInValues = {
    email: "",
    password: ""
}

const registerSchema = yup.object().shape({
    name: yup.string().required('Required'),
    email: yup.string().email("Invalid Email").required("Required"),
    password: yup.string().required('Required')
})

const signInSchema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Required"),
    password: yup.string().required('Required')
})

const SignIn = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [pageType, setPageType] = useState('login')

  const isRegister = pageType === "register"
  const isLogin = pageType === "login"
  
  const registerMethod = async (values, onSubmitProps) => {
    console.log("Register")
    
    const data = {
        'name': values.name,
        'email': values.email,
        'password': values.password
    }

    await dispatch(register(data))
    .then((res) => {
      if(res.type == "auth/register/fulfilled"){
        toast.success('Registration SuccessFully')
        navigate('/')
      }
      else{ toast.error(res.payload) }
      
    })
    .catch((err) => console.log(err))
  }  

  const loginMethod = (values, onSubmitProps) => {
    

    const data = {
        'email': values.email,
        'password': values.password
    }
    
    
    dispatch(login(data))
    .then((res) => {
      console.log(res)
      if(res.type === "auth/login/fulfilled"){
        
        toast.success('Login SuccessFully')
        navigate('/')
      }
      else{ toast.error(res.payload) }
      
    })
    .catch((err) => console.log(err))
  }  


  const handleFormSubmit = (values, onSubmitProps) => {
    if(isRegister) {
        registerMethod(values, onSubmitProps)
    }else{
        loginMethod(values, onSubmitProps)
    }
  }

  const handleGoogleSignIn = async() => {
    try{
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth, provider);
        console.log(result.user)
        if(result.user){
            const data = {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.profileUrl
            }

            dispatch(signInWithGoogle(data))
            .then((res) => {
                console.log(res)
                navigate('/')
            })
            .catch((err) => console.log(err))
        }

        
    }catch(err){
        console.log(err)
    }

  }

  return (
    <div className=''>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col w-[70%] md:w-[25%] mt-4 gap-2 mt-[100px]'>
            <h1 className='text-[28px] text-gray-800 font-semibold text-center'>Create an account</h1>
            <Formik
                initialValues={isLogin ? signInValues : registerValues}
                validationSchema={isLogin ? signInSchema : registerSchema}
                onSubmit={handleFormSubmit}
            >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form className='' onSubmit={handleSubmit}>
                    <div className='flex w-full flex-col gap-4'>
                        {isRegister && (
                            
                            <div className=''>
                                <TextField
                                    fullWidth
                                    label='Name'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="name"
                                    error={
                                    Boolean(touched.name) && Boolean(errors.name)
                                    }
                                    helperText={touched.name && errors.name}
                                />
                            </div>
                        )}

                        <div>
                            <TextField
                                fullWidth
                                label="Email address"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="email"
                                error={Boolean(touched.email) && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                        </div>
                        

                        <div>
                            <TextField
                                fullWidth
                                label="Password"
                                type='password'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="password"
                                error={Boolean(touched.password) && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />
                        </div>

                        <button className='bg-red-500 rounded-md text-[20px] text-white w-full py-3'>Login</button>
                    </div>
                </form>
            )}
            </Formik>

            <h1 className='text-center hover:cursor-pointer hover:text-blue-500 text-[18px]' onClick={ () => setPageType(isLogin ? "register" : "login") }>
                { isLogin ? "Create an New Account" :"Already have an Account?" }
            </h1>

            <div className='flex'>
                <div className='border-t border-gray-500 border-t-1/2 w-[45%] my-auto'></div>
                
                    <span className='flex items-center mx-3'>OR</span>
               
                <div className='border-t border-gray-500 border-t-1/2 w-[45%] my-auto'></div>           
            </div>

            <button onClick={() => handleGoogleSignIn()} className='flex hover:bg-stone-300 items-center gap-4 text-[18px] border border-gray-400 rounded-md px-6 py-4'>
                <span className='text-[22px]'><FcGoogle /></span>
                <span>Continue with Google</span>
            </button>
        </div>
        
      </div>
      
    </div>
  )
}

export default SignIn
