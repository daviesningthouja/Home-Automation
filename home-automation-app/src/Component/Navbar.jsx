import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='nav'>
      <div className='nav-head'>
        <Link to ="/">
        <h1 className='head-txt'>
            Home Automation
        </h1>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
