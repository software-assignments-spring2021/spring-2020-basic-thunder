import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import './styles/LoginView.css'
import {Link, Redirect} from "react-router-dom"
import {Header} from './home_view'


const LoginView = () => {
    return (
        <div className={'LoginView'}>

            <div id="header">
                <Header/>
            </div>

            <div id="main">
                <div id="login">
                    <h2>LOGIN</h2>
                    <LoginForm/>
                </div>
            </div>
        </div>
    )
}

const LoginForm = (props) => {
    let authenticated = true;
    let api = 'http://127.0.0.1:5000/'

    const handleSubmit = (e) => {
        e.preventDefault()
        postData()

        if (authenticated) {
            e.preventDefault()
            window.location.href = '/LoggedInHome'
        }
    }

    const postData = async() => {
        await axios.post(api, 'data').then(res => {
            console.log(res)
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Email:</span>
                    <input type="text" name="email" />
                </label>

                <label>
                    <span>Password:</span>
                    <input type="text" name="password" />
                </label>

                <input type="submit" value="Log In"/>

                <p>Don't have an account? <br/>
                    <Link to="sign-up">
                        <span>Sign Up</span>
                    </Link>
                </p>

            </form>
        </div>
    )
}

export {LoginView}