// eslint-disable-next-line no-unused-vars
import React from 'react'
import axios from "axios";

const API_URL = "http://192.168.32.132:8080/api/auth";

// Login user
export const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  export const fetchESPTemperature = async () => {
    try {
      const response = await fetch("http://192.168.29.25:8080/api/relays/temperature"); // Replace with your ESP's actual IP
      const data = await response.json();
      return data.temperature || null; // Ensure we return a valid temperature or null
    } catch (error) {
      console.error("Error fetching ESP temperature:", error);
      return null;
    }
  };
  
  
  
  
