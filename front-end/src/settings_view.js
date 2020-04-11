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
                <Section value={"username"}/>
                <Section value={"email"}/>
                <Section value={"password"}/>

            </div>

        </div>
    )
}

const Section = (props) => {
    const value = props.value
    return(
        <div className={"section"}>
            <p>{value}</p>

            <p>Current {value}: {data[value]}</p>
            <label>New {value}: </label>
            <input type="text"/>
            <br/>
            <button>Change {value}</button>

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