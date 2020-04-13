import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styles/SettingsView.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import Hamburger from './HamburgerMenu.js'

const data = {
    'username': 'user001',
    'email': 'user001@nyu.edu',
    'password': 'pw001'
}

const SettingsView = () => {

    return (
        <div className={"SettingsView"}>

            <header className="biazza-header">
                <Hamburger />
                <NavBarComponentPlaceHolder />
            </header>

            <div className={"main"}>

                <h1>Settings</h1>
                <Email email="user001@nyu.edu"/>
                <Password/>

            </div>

        </div>
    )
}

// to be implemented if there's time

const Name = (props) => {
    const first = props.first
    const last = props.last

    return (
        <div className="section" id="nameDiv">
            <div className={"left"}>
                <p>Name</p>
            </div>

            <div className={"right"}>

                <form>
                    <p>First name: {first}</p>
                    <label>Edit: </label>
                    <input type="text"/>
                    <br/>

                    <p>Last name: {last}</p>
                    <label>New new name: </label>
                    <input type="text"/>
                    <br/>

                    <input type="submit" value="Change Email" />

                </form>
            </div>
        </div>
    )
}

const Email = (props) => {

    let email = props.email

    const handleSubmit = (e) => {
        e.preventDefault()
    }


    return (
        <div className="section">
            <div className={"left"}>
                <p>Email</p>
            </div>

            <div className={"right"}>

                <form onSubmit={handleSubmit}>
                    <p id="email">Current email: {email}</p>
                    <label>New email: </label>
                    <input type="text"/>
                    <br/>

                    <input type="submit" value="Change Email" />

                </form>
            </div>
        </div>
    )
}

const Password = (props) => {

    return (
        <div className="section">
            <div className={"left"}>
                <p>Password</p>
            </div>

            <div className={"right"}>
                <form>
                    <label>Current password: </label>
                    <input type="text"/>
                    <br/>

                    <label>New password: </label>
                    <input type="text"/>
                    <br/>

                    <input type="submit" value="Change Password" />
                </form>

            </div>
        </div>
    )
}


const Section = (props) => {
    const value = props.value
    return(
        <div className={"section"}>

            <div className={"left"}>
            <p>{value.charAt(0).toUpperCase() + value.slice(1)}</p>
            </div>

            <div className={"right"}>
            <p>Current {value}: {data[value]}</p>
            <label>New {value}: </label>
            <input type="text"/>
            <br/>
            <button>Change {value}</button>
            </div>

        </div>
    )
}


const NavBarComponentPlaceHolder = () =>{
    return (
        <div className="biazza-header-title">
            <h2>Biazza</h2>
        </div>
    )
}

export {SettingsView}