import React from 'react'
import './styles/HomeView.css'
import {Link} from "react-router-dom"

const HomeView = function() {
    return (
        <div>
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
    )

}

const LoginBtn = function() {
    return (
        <Link to='/log-in'>
            <button>
                Log In
            </button>
        </Link>
    )
}

const RegisterBtn = function() {
    return (
        <Link to='/sign-up'>
            <button>
                Sign Up
            </button>
        </Link>
    )
}


export {HomeView}