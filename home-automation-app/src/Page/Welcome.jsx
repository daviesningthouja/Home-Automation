// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useLayoutEffect, useRef, useState} from 'react';
import gsap from "gsap"
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios'
import { login } from '../utility/ApiCall';
const Welcome = () => {
    const comp = useRef(null)
    const navigate = useNavigate(); 

    
    const [value, setValue] = useState({
      username: "",
      password: "",
    });
    //pass toggle
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false); // State for Remember Me checkbox
    //const navigate = useNavigate(); //Initialize useNavigate hook
  
    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };
  
    const validateForm = () => {
      let errors = {};
      if (!value.username) errors.username = "Enrollment ID is required";
      if (!value.password) errors.password = "Password is required";
      return errors;
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
    const handleRememberMeChange = () => {
      setRememberMe((prevState) => !prevState);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      try{
        const data = await login(value.username, value.password);
        
        if(data.token){
          if(rememberMe){
            localStorage.setItem("token", data.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          }else{
            sessionStorage.setItem('sessiontoken',data.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          }
          navigate('/home')
        }

      } catch(err){
        setErrors(err);
      }
    }
    
    useLayoutEffect(() => {
      let ctx  = gsap.context (() => {
        const t1 = gsap.timeline()
          t1.from('#intro-slider',{
            xPercent: '-100',
            duration: 1.3,
            delay: 0.3,
            
          }).from(["#title-1","#title-2","#title-3"],{
            opacity: 0,
            y: "+=30",
            stagger: 0.5,
          }).to(["#title-1","#title-2","#title-3"],{
            opacity:0,
            y: "-=30",
            delay: 1.3,
            stagger: 0.5,
          }).to('#intro-slider',{
            xPercent:"-100",
            duration: 1.3
          }).from('#welcome',{
            opacity:0,
            duration: 0.5,
          })
      }, comp)
  
  
      return () => ctx.revert()
    },[] )
    
    return (
  
      <div className='container' ref={comp}>
        <div 
          id='intro-slider'
          className='slider montserrat-front'>
          <h1 className=' intro-txt' id='title-1'>Smart</h1>
          <h1 className='' id='title-2'>Home</h1>
          <h1 className='' id='title-3'>Automation</h1>
        </div> 
        {/* centered-section  */}
      <div className=' body'>
        {/* <h1 id='welcome' className='welcome-text'>
          Login <br/> 
            <a href="http://localhost:5173/home">
              Home
            </a>
        </h1> */}
      <div className="wrapper"
       id='welcome'
       >
        <form onSubmit={handleSubmit}>
        <h2>User Login</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="username"
              name="username"
              value={value.username}
              onChange={handleChange}
              required
            />
            <FaUserCircle className="icons" />
            {errors.enrollmentId && (
              <p className="error">{errors.enrollmentId}</p>
            )}
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
              value={value.password}
              onChange={handleChange}
              required
            />
            <div type="button" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <FaUnlock className="icons" />
              ) : (
                <FaLock className="icons" />
              )}
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="remember-forget">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              Remenber me
            </label>
            <Link to="#"> Forget password?</Link>
          </div>

          <button type="submit">Login</button>


          {/* <div className="register-link">
            <p>
              Don&apos;t have an account?{" "}
              <Link to="/user/registration">Register</Link>
            </p>
          </div> */}
        </form>
      </div>
      </div>
      </div>
    )
  }
  
 
export default Welcome;