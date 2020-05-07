import React from 'react'
import './styles/HomeView.css'
import {Link} from "react-router-dom"

/*
 * Home view for users not logged in
 */

const NotLoggedInHomeView = () => {
    return (
        <div className="HomeView">
            <div>
                <header>
                    <Link to="/home" id="logo">Biazza</Link>
                    <Link to="/log-in" id="signin">Log in</Link>
                </header>
            </div>

            <div id="main">
                <div className="hero-image">
                    <div className="hero-text">
                        <h1>Learning made easier.</h1>
                        <p>Forums, schedules, and syllabuses for college courses</p>

                        <LoginBtn/>
                        <RegisterBtn/>

                    </div>

                </div>

            </div>

            <div>
                <footer>
                    <a href="./img/wwh.jpg">&copy; 2020 Biazza</a>
                </footer>
            </div>

        </div>
    )
}

const Header = () => {
    return (
        <Link to='/home'>
            Biazza
        </Link>
    )
}

const LoginBtn = () => {
    return (
        <Link to='/log-in'>
            <button id="button1">
                Log In
            </button>
        </Link>
    )
}

const RegisterBtn = () => {
    return (
        <Link to='/sign-up'>
            <button id="button2">
                Sign Up
            </button>
        </Link>
    )
}

export {Header}
export {NotLoggedInHomeView}
