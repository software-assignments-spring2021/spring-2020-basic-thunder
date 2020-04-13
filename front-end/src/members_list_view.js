import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styles/MembersListView.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import Hamburger from './HamburgerMenu.js'
import {LoadingView} from "./loading_view";

/*
const data = {
    'courseName': 'CS480 Computer Vision',
    'instructors': [
        {'name': 'A. B.',
        'email': 'ab123@nyu.edu'},
        {'name': 'D. E.',
        'email': 'de111@nyu.edu'}
    ],
    'students': [
        {'name': 'S. J.',
        'email': 'sj13@nyu.edu'},
        {'name': 'J. L.',
        'email': 'jl321@nyu.edu'},
        {'name': 'C. M.',
        'email': 'cm222@nyu.edu'}
    ]
}
 */

const MembersListView = () => {
    const {courseId} = useParams()
    const courseName = 'Computer Vision'
    const mode = 'instructor'
    // const mode = 'student'

    const [data, setData] = useState({'courseId': -1, 'courseName': null, 'instructors': null, 'students': null})
    const api = `http://127.0.0.1:5000/${courseId}/members-list`

    // fetch data from backend
    // set 'data' variable to the hard-coded JSON object
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


    // const [mode, setMode] = useState('instructor')
    // const [data, setData] = useState({'courseId': -1, 'courseName': null, 'members': null})

    const [add, setAdd] = useState(false)
    const [del, setDel] = useState(false)

    const handleAdd = (e) => {
        e.preventDefault()
        setAdd(true)
        const modal = document.getElementById('add')
        if (modal) {
            modal.style.display = 'block'
        }
    }

    const handleDelete = (e) => {
        e.preventDefault()
        setDel(true)
    }

    return (
        <div className={'MembersListView'}>

            <header className="biazza-header">
                <Hamburger/>
                <NavBarComponentPlaceHolder/>
            </header>
            <CourseBarComponent CourseName={courseName}/>

            <div className={"main"}>
                {mode === 'instructor' ? <div id="addBtn">
                    <button onClick={handleAdd}>Add New Member</button>
                </div> : ''}
                {add ? <AddModal/> : ''}

                <h3>Instructors</h3>
                <div className={"members"} id="instructors">
                    {data['instructors'] ? data['instructors'].map(props => (
                        <Member mode={mode} role={'instructor'} key={props.email} name={props.name}
                                email={props.email}/>)) : ''}
                </div>

                <h3>Students</h3>
                <div className={"members"} id="students">
                    {data['students'] ? data['students'].map(props => (
                        <Member mode={mode} role={'student'} key={props.email} name={props.name}
                                email={props.email}/>)) : ''}
                </div>

            </div>

        </div>
    )
}

const Member = (props) => {
    const {courseId} = useParams()
    const api = `http://127.0.0.1:5000/${courseId}/members-list`

    const name = props.name
    const email = props.email

    // add backend & database code later
    const handleYes = (e) => {
        e.preventDefault()
        const popup = e.currentTarget.parentNode
        const main = document.querySelector('.main')
        main.removeChild(popup)

        axios.post(api,{
            deleteName: name,
            deleteEmail: email
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        // remove deleted user card from page
        const card = document.getElementById(email)
        card.style.display = 'none'

    }

    const handleNo = (e) => {
        e.preventDefault()
        const popup = e.currentTarget.parentNode
        const main = document.querySelector('.main')
        main.removeChild(popup)
    }

    const handleDelete = (e) => {
        e.preventDefault()

        const div = document.createElement('div')
        div.id = 'delete'

        const btn = document.createElement('button')
        btn.id = 'closeDelete'
        btn.innerText = 'Close'
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            div.style.display = 'none'
        })
        div.appendChild(btn)

        const p = document.createElement('p')
        p.innerText = 'You are going to remove ' + props.name + ' from the course. \nAre your sure?'
        div.appendChild(p)

        const yes = document.createElement('button')
        yes.classList.add('btn')
        yes.innerText = 'Yes'
        yes.addEventListener('click', handleYes)
        div.appendChild(yes)

        const no = document.createElement('button')
        no.innerText = 'No'
        no.classList.add('btn')
        no.addEventListener('click', handleNo)
        div.appendChild(no)

        document.querySelector('.main').prepend(div)
    }

    if (props.mode === 'instructor') {
        return (
            <div className={"member"} id={props.email}>
                <div id="deleteBtn"><button onClick={handleDelete}>Delete</button></div>
                <p id="name"> {props.name} </p>
                <p id="email"> {props.email} </p>
            </div>
        )
    } else if (props.mode === 'student') {
        return (
            <div className={"member"} id={props.email}>
                <p id="name"> {props.name} </p>
                <p id="email"> {props.email} </p>
            </div>
        )
    } else {
        return null
    }
}

// modal dialog for adding a member
const AddModal = (props) => {
    const {courseId} = useParams()
    const api = `http://127.0.0.1:5000/${courseId}/members-list`
    // const [data,setData] = useState({course_name:null,username:null})

    // which radio button is selected
    const [selected, setSelected] = useState('student')
    // whether modal to add a member should be visible
    const [visible, setVisible] = useState(true)

    const handleClick = (e) => {
        e.preventDefault()
        setVisible(false)
        window.location.reload()
    }

    const handleChange = (e) => {
        e.preventDefault()
        setSelected(e.currentTarget.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const role = selected  // student or instructor
        const email = e.target['email'].value

        axios.post(api,{
            addRole: role,
            addEmail: email,
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        e.target.parentNode.style.display = 'none'
        setSelected('student')
        e.target['email'].value = ''
    }

    return (
        visible ?
        <div id="add">
            <button id="closeAdd" onClick={handleClick}>Close</button>
            <h2>Add New Member</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Email:</span>
                    <input type="text" name="email" />
                </label>

                <label>
                    <span>Type:</span><br/>

                    <input type="radio" id="radio-1" value="student" checked={selected === 'student'} onChange={handleChange}/>
                    <label id="label-1" htmlFor="student">Student</label><br/>

                    <input type="radio" id="radio-2" value="instructor" checked={selected === 'instructor'} onChange={handleChange}/>
                    <label id="label-2" htmlFor="instructor">Instructor</label><br/>

                </label>

                <input type="submit" value="Send" />

            </form>
        </div>
            : ''
    )
}

// modal dialog for deleting a member
const DeleteModal = (props) => {
    return (
        <div id="delete">
            <p>You are going to remove {props.name}</p>
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

const CourseBarComponent = ({CourseName})=>{
    return (
        <h2 className={"bar"}>Members List: {CourseName}</h2>
    )
}

export {MembersListView}
