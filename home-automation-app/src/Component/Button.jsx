import React from 'react'

const Button = ({name, onClick, color}) => {
  return (
    <button className={`btn btn-${color}`} onClick ={onClick}>
        {name}
    </button>
  )
}

export default Button
