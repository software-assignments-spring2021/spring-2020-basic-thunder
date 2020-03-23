import React, {useState} from 'react'
import './styles/RegisterView.css'
import {Link} from "react-router-dom"
import {Header} from './home_view'

const RegisterView = function() {
    return (
        <div className={'RegisterView'}>
            <div id="header">
                <Header/>
            </div>

            <div id="main">
                <div id="register">
                    <h2>SIGN UP</h2>
                    <SignUpForm/>
                </div>
            </div>

        </div>
    )
}

function SignUpForm(props) {

    const state = {
        role: 'Student'
    }

    const handleClick = function(event) {
        event.preventDefault()
        const buttons = document.querySelectorAll('#buttons input')
        buttons.forEach((button) => {
            button.id = 'off'
        })
        event.target.id = 'on'
        state.role = event.target.value
    }

    const handleSubmit = function(event) {
        // validation
        /*
        event.preventDefault()
        const form = event.target
        const firstName = form.querySelector('[name=first_name]')
        if (!firstName.value) {
            const message = document.createElement('p')
            message.textContent = 'Name required.'
            firstName.parentNode.append(message)
        }*/
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div id="buttons">
                <input id="on" type="button" value="Student" onClick={handleClick}/>
                <input id="off" type="button" value="Instructor" onClick={handleClick}/>
                </div>

                <label>
                    <span>First Name:</span>
                    <input type="text" name="first_name"/>
                </label>

                <label>
                    <span>Last Name:</span>
                    <input type="text" name="last_name" />
                </label>

                <label>
                    <span>Email:</span>
                    <input type="text" name="email" />
                </label>

                <label>
                    <span>Password:</span>
                    <input type="text" name="password" />
                </label>

                <input type="submit" value="Sign Up"/>

                <p>Already have an account?<br/>
                    <Link to="log-in">
                        <span> Log In</span>
                    </Link>
                </p>
            </form>

        </div>
    )
}

export {RegisterView}