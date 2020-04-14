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

    const [data, setData] = useState({'email': null})
    const api = 'http://127.0.0.1:5000/settings'

    // fetch data from backend
    useEffect(()=>{
        const fetchData = async () => {
            axios.get(api)
                .then(res => {
                    setData(res.data)
                })
                .catch(err => {
                    console.log(err)
                    window.location.reload(false)
                })
        };
        fetchData();
    },[]);

    return (
        <div className={"SettingsView"}>

            <header className="biazza-header">
                <Hamburger />
                <NavBarComponentPlaceHolder />
            </header>

            <div className={"main"}>

                <h1>Settings</h1>
                <Email email={data['email']}/>
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

    // let email = props.email

    const [email, setEmail] = useState(props.email)
    // if the email has been modified
    const [modified, setModified] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        const api = 'http://127.0.0.1:5000/settings'
        const newEmail = e.target['email'].value
        setEmail(newEmail)
        setModified(true)

        axios.post(api,{
            newEmail: newEmail
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        e.target['email'].value = ''

    }

    return (
        <div className="section">
            <div className={"left"}>
                <p>Email</p>
            </div>

            <div className={"right"}>

                <form onSubmit={handleSubmit}>
                    <p id="email">Current email: {modified ? email: props.email}</p>
                    <label>New email: </label>
                    <input type="text" name="email"/>
                    <br/>

                    <input type="submit" value="Change Email" />

                </form>
            </div>
        </div>
    )
}

const Password = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault()
        const api = 'http://127.0.0.1:5000/settings'
        const currPw = e.target['currPw'].value
        const newPw = e.target['newPw'].value

        axios.post(api,{
            currPw: currPw,
            newPw: newPw
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        e.target['currPw'].value = ''
        e.target['newPw'].value = ''
    }

    return (
        <div className="section">
            <div className={"left"}>
                <p>Password</p>
            </div>

            <div className={"right"}>
                <form onSubmit={handleSubmit}>
                    <label>Current password: </label>
                    <input type="password" name="currPw"/>
                    <br/>

                    <label>New password: </label>
                    <input type="password" name="newPw"/>
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