import React from 'react';

const CustomInput = ({ title , type = "text" ,placeholder , value , handleChange }) => {
    return (
        <div class="form-group">
              <label htmlFor="inputEmail">{ title }</label>
              <input 
              autoComplete="off" 
              type={type} 
              className="form-control" 
              placeholder={placeholder}
              value={value} 
              onChange={handleChange}
               />
        </div>
    );
};
export default CustomInput;