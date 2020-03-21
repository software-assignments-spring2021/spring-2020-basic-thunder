import React, {useState} from 'react'
import './styles/RegisterView.css'
import {Link} from "react-router-dom"

const RegisterView = function() {
    return (
        <div>
            <h1>Sign Up</h1>

            <div id="register">
                <SignUpForm/>
            </div>

        </div>
    )
}

function SignUpForm(props) {

    const [role, setRole] = useState('student')

    const handleClick = function(event) {
        event.preventDefault()
        const buttons = document.querySelectorAll('#buttons input')
        buttons.forEach((button) => {
            button.id = 'off'
        })
        event.target.id = 'on'
    }

    return (
        <div className="container">

        <form>
            <div id="buttons">
            <input id="on" type="button" value="Student" onClick={handleClick}/>
            <input id="off" type="button" value="Instructor" onClick={handleClick}/>
            </div>

            <label>First Name:
            <input type="text" placeholder="First Name" name="first_name" />
            </label>

            <label>Last Name:
            <input type="text" placeholder="Last Name" name="last_name" />
            </label>

            <label>Email:
            <input type="text" placeholder="Email Address" name="email" />
            </label>

            <label>Password:
            <input type="text" placeholder="Password" name="password" />
            </label>

            <input type="submit" value="Sign Up" />

            <p>Already have an account?
                <Link to="log-in">
                    <span> Log In</span>
                </Link>
            </p>
        </form>
        </div>
    )
}

export {RegisterView}