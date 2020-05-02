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

const BACKEND_IP = process.env.NODE_ENV === "production"? "http://204.48.25.3:5000" :"http://127.0.0.1:5000";

const data = {
    'username': 'user001',
    'email': 'user001@nyu.edu',
    'password': 'pw001'
}

const SettingsView = () => {
    const [data, setData] = useState({'email': '', 'firstname': '', 'lastname': ''})
    const api = `${BACKEND_IP}/settings`

    const accessToken = localStorage.getItem("access-token")

    // fetch data from backend
    useEffect(()=>{
        const fetchData = async () => {
            axios.get(api, {headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res => {
                    setData(res.data)
                })
                .catch(err => {
                    console.log(err)
                    window.location.href = '/home'
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
                <Name first={data['firstname']} last={data['lastname']}/>
                <Password/>

            </div>

        </div>
    )
}


const Name = (props) => {
    const [first, setFirst] = useState(props.first)
    const [last, setLast] = useState(props.last)
    // if first name and last name modified
    const [modified, setModified] = useState(false)

    const [res, setRes] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const api = `${BACKEND_IP}/settings`
        const newFirst = e.target['firstname'].value
        const newLast = e.target['lastname'].value
        setFirst(newFirst)
        setLast(newLast)
        setModified(true)

        const accessToken = localStorage.getItem("access-token")

        axios.post(api,{
            newFirst: newFirst,
            newLast: newLast
        }, {headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then(res => {
                setRes('success')
                setMessage(res.data.message)
            }).catch(err => {
                setRes('failure')
                setMessage('name update failure')

        })

        e.target['firstname'].value = ''
        e.target['lastname'].value = ''
    }

    return (
        <div className="section" id="nameDiv">
            <div className={"left"}>
                <p>Name</p>
            </div>

            <div className={"right"}>

                <form onSubmit={handleSubmit}>
                    <p>Current name: {res === 'success' ? first + ' ' + last : props.first + ' ' + props.last}</p>

                    <label>New first name: </label>
                    <input type="text" name="firstname" required/>
                    <br/>

                    <label>New last name: </label>
                    <input type="text" name="lastname" required/>
                    <br/>

                    <p className="message" id={res}>{message}</p>

                    <input type="submit" value="Change Name" />

                </form>
            </div>
        </div>
    )
}

const Email = (props) => {

    const [email, setEmail] = useState(props.email)
    // if the email has been modified
    const [modified, setModified] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        const api = `${BACKEND_IP}/settings`
        const newEmail = e.target['email'].value
        setEmail(newEmail)
        setModified(true)

        const accessToken = localStorage.getItem("access-token")

        axios.post(api,{
            newEmail: newEmail
        }, {headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then(res => {
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
                    <input type="email" name="email" required/>
                    <br/>

                    <input type="submit" value="Change Email" />

                </form>
            </div>
        </div>
    )
}

const Password = (props) => {
    const [res, setRes] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const api = `${BACKEND_IP}/settings`
        const currPw = e.target['currPw'].value
        const newPw = e.target['newPw'].value

        const accessToken = localStorage.getItem("access-token")

        axios.post(api,{
            currPw: currPw,
            newPw: newPw
        }, {headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then(res => {
                if (res.data.err_message) {
                    setRes('failure')
                    setMessage(res.data.err_message)
                } else {
                    setRes('success')
                    setMessage('password update success')
                }

        }).catch(err => {
                console.log(err)
                setRes('failure')
        })

        e.target['currPw'].value = ''
        e.target['newPw'].value = ''
    }

    return (
        <div className="section" id="pwDiv">
            <div className={"left"}>
                <p>Password</p>
            </div>

            <div className={"right"}>
                <form onSubmit={handleSubmit}>
                    <label>Current password: </label>
                    <input type="password" required minLength={3} name="currPw"/>
                    <br/>

                    <label>New password: </label>
                    <input type="password" required minLength={3} name="newPw"/>
                    <br/>

                    <p className="message" id={res}>{message}</p>

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
