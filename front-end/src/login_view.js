import React from 'react'
import './styles/LoginView.css'
import {Link} from "react-router-dom"


const LoginView = function() {
    return (
        <div className={'LoginView'}>


            <h1>Log In</h1>
            <div id="login">
                <LoginForm/>
            </div>
        </div>
    )
}

const LoginForm = function() {
    return (
        <div class="container">
            <form>

                <label>Email:
                    <input type="text" placeholder="Email Address" name="email" />
                </label>

                <label>Password:
                    <input type="text" placeholder="Password" name="password" />
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