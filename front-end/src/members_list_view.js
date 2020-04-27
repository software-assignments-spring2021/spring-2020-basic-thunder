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
import SubNav from "./SubNav.js"
import {LoadingView} from "./loading_view";

const MembersListView = () => {
    const {courseId} = useParams()

    const [currEmail, setCurrEmail] = useState('')
    const [courseName, setCourseName] = useState('')
    const [mode, setMode] = useState('instructor')
    const [data, setData] = useState({'courseId': -1, 'courseName': null, 'instructors': null, 'students': null})
    const api = `http://127.0.0.1:5000/${courseId}/members-list`

    // fetch data from backend
    // set 'data' variable to the hard-coded JSON object
    useEffect(()=>{
        const fetchData = async () => {
            const accessToken = localStorage.getItem("access-token");
            axios.get(api, {headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res => {
                    setCourseName(res.data.courseName)
                    setMode(res.data.isInstructor ?  'instructor' : 'student')
                    setCurrEmail(res.data.currEmail)
                    setData(res.data)
                })
                .catch(err => {
                    console.log(err)
                    window.location.href = '/LoggedInHome'
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
            <SubNav courseId={data.courseId} />
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
                                email={props.email} isCurr={props.email===currEmail} />)) : ''}
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

        const accessToken = localStorage.getItem("access-token")

        axios.post(api,{
            deleteName: name,
            deleteEmail: email
        }, {headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then(res => {
            if (res.data.deletedUser) {
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
        })
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

    if (props.mode === 'instructor' && !props.isCurr) {
        return (
            <div className={"member"} id={props.email}>
                <div id="deleteBtn"><button onClick={handleDelete}>Delete</button></div>
                <p id="name"> {props.name} </p>
                <p id="email"> {props.email} </p>
            </div>
        )
    } else {
        return (
            <div className={"member"} id={props.email}>
                <p id="name"> {props.name} </p>
                <p id="email"> {props.email} </p>
            </div>
        )
    }
}

// modal dialog for adding a member
const AddModal = (props) => {
    const {courseId} = useParams()
    const api = `http://127.0.0.1:5000/${courseId}/members-list`
    // const [data,setData] = useState({course_name:null,username:null})

    // which radio button is selected
    const [selected, setSelected] = useState('Student')
    // whether modal to add a member should be visible
    const [visible, setVisible] = useState(true)

    const handleClick = (e) => {
        e.preventDefault()
        setVisible(false)
        window.location.reload()
    }

    const handleChange = (e) => {
        setSelected(e.currentTarget.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const role = selected  // student or instructor
        const email = e.target['email'].value
        const firstname = e.target['firstname'].value
        const lastname = e.target['lastname'].value

        const accessToken = localStorage.getItem("access-token")

        axios.post(api,{
            addRole: role,
            addEmail: email,
            addFirstName: firstname,
            addLastName: lastname
        }, {headers: {"Authorization" : `Bearer ${accessToken}`}
        }).then(res => {
            console.log(res)
            console.log(res.status)

            if (res.data.newUser) {
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
        })

        e.target.parentNode.style.display = 'none'
        setSelected('Student')
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
                    <input type="email" required name="email" />
                </label>

                <label>
                    <span>First name:</span>
                    <input type="text" required name="firstname" />
                </label>

                <label>
                    <span>Last name:</span>
                    <input type="text" required name="lastname" />
                </label>

                <label>
                    <span>Type:</span><br/>

                    <input type="radio" id="radio-1" value="Student" checked={selected === 'Student'} onChange={handleChange}/>
                    <label id="label-1" htmlFor="student">Student</label><br/>

                    <input type="radio" id="radio-2" value="Instructor" checked={selected === 'Instructor'} onChange={handleChange}/>
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

