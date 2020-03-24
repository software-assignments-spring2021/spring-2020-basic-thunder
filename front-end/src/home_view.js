import React from 'react'
import './styles/HomeView.css'
import {Link} from "react-router-dom"

const NotLoggedInHomeView = () => {
    return (
        <div className="HomeView">
            <div id="header">
                <Header/>
            </div>

            <div id="main">
                <h1>Welcome to Biazza!</h1>
                <p>Forums, schedules, and syllabuses for college courses</p>
                <LoginBtn/>
                <RegisterBtn/>

                <ul>
                    <li>Create and join classes</li>
                    <li>Upload and access schedules and syllabuses</li>
                    <li>Post questions for instructors and classmates</li>
                    <li>Reply to classmates' posts</li>
                    <li>Rank answers based on helpfulness</li>
                </ul>

                <div>
                    <img src="../images/placeholder.jpg" alt="placeholder"/>
                </div>

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