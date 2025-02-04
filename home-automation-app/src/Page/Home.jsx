// eslint-disable-next-line no-unused-vars
import React from 'react'

import { useState, useEffect } from 'react'

import '../App.css'
import Navbar from '../Component/Navbar'
import Button from '../Component/Button'
import Weather from '../Component/Weather'
const Home = () => {
    const [temperature, setTemperature] = useState(null);
    const [location, setLocation] = useState("home"); // Default location: "home"
    const [buttonState, setButtonState] = useState({
      Door: 0,
      AC: 0,
      Fan: 0,
      Light:0,
      LED:0,
    });
  
  {/*
    const handleButtonClick = async (name) => {
      const newState = buttonState[name] === 0 ? 1: 0;
      setButtonState((prevState) => ({
        ...prevState,
        [name]: newState,
      }));
      //await fetch("http://10.10.1.75:8080/api/buttons/update",{
        await fetch("http://192.168.137.1:8080/api/buttons/update",{
          //await fetch("http://192.168.29.25:8080/api/buttons/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, state: newState }),
          }); 
        };
        
        
        */}
        
    //{ /*
    // Fetch initial states from the server
    useEffect(() => {
      const fetchInitialStates = async () => {
        try {
          // const response = await fetch("http://10.10.1.75:8080/api/relays");
          const response = await fetch("http://192.168.32.132:8080/api/relays");
          const data = await response.json();
          const stateMap = {};
          data.forEach((relay) => {
            stateMap[relay.name] = relay.state;
          });
          setButtonState(stateMap);
        } catch (error) {
          console.error("Error fetching initial relay states:", error);
        }
      };
  
      const fetchTemperature = async () => {
        try {
          const response = await fetch("http://192.168.32.132:8080/api/relays/temperature");
          const data = await response.json();
          setTemperature(data.temperature); // Set the temperature value
          console.log({temperature})
        } catch (error) {
          console.error("Error fetching temperature:", error);
        }
      };
      
      fetchInitialStates();
      fetchTemperature();
  
      const interval = setInterval(() => {
        fetchInitialStates();
        fetchTemperature();
      }, 5000); // Poll every 5 seconds
  
      return () => clearInterval(interval); 
    }, []);
    
    const handleButtonClick = async (name) => {
      const newState = buttonState[name] === 0 ? 1 : 0;
      setButtonState((prevState) => ({
        ...prevState,
        [name]: newState,
      }));
      
      try {
        await fetch("http://192.168.32.132:8080/api/relays/updates", {
          // await fetch("http://192.168.29.25:8080/api/relays", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([{ 
              name, 
              state: newState,
              manualControl: 1,
  
            }]),
          });
        } catch (error) {
          console.error("Error updating relay state:", error);
        }
      };
      
     // */}
      return (
        <div className='home'>
        
        <Navbar/>
        <div className='main'>
          <div className='box-1'>
            <div className='btn-side'>
              {Object.keys(buttonState).map((buttonName)=> (              
                <Button
                  key={buttonName}
                  name={buttonName}
                  onClick={() =>handleButtonClick(buttonName)}
                  color={buttonState[buttonName] === 0 ? 'red' : 'green'}
                />
              ))}
            </div>
          </div>
          <div className='box-2'>
          <Weather location={location}/>
          {/* <h2>Temperature: {temperature !== null ? `${temperature}°C` : "Loading..."}</h2>
          <h3>AC Status: {buttonState.AC === 1 ? "ON" : "OFF"}</h3> */}
          </div>
        </div>
      </div>
    )
  }

export default Home
