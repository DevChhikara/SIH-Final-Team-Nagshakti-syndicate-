import React, { FC } from 'react'
import './Login.css'

import user_icon from '../assets/images/person.png'
import email_icon from '../assets/images/email.png'
import password_icon from '../assets/images/password.png'
import { Link } from 'react-router-dom'

const Login = () => { // eslint-disable-line
  return (
    <div className='box'>
        <h2 className='header'>Team Syndicate</h2>
        <div className='container'>
            <div className='header'>
                <div className='text'>Login</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <img src={email_icon} alt=''></img>
                    <input type='email' placeholder='E-mail'></input>
                </div>
                <div className='input'>
                    <img src={password_icon} alt=''></img>
                    <input type='password' placeholder='Password'></input>
                </div>
            </div>
            <div className='submit-container'>
                <Link to='/'><div className='submit'>SignUp</div></Link>
                <div className='submit'>Login</div>
            </div>
        </div>
    </div>
  )
}

export default Login