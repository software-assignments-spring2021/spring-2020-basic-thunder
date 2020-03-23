import React from 'react'
import './styles/LoginView.css'
import {Link} from "react-router-dom"
import {Header} from './home_view'


const LoginView = function() {
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

const LoginForm = function() {
    return (
        <div>
            <form>
                <label>
                    <span>Email:</span>
                    <input type="text" name="email" />
                </label>

                <label>
                    <span>Password:</span>
                    <input type="text" name="password" />
                </label>

                <input type="submit" value="Log In" />

                <p>Don't have an account?
                    <Link to="sign-up">
                        <span>Sign Up</span>
                    </Link>
                </p>

            </form>
        </div>
    )
}

export {LoginView}