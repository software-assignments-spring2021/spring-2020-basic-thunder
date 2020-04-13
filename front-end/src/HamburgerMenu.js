import React from "react"
import { slide as Menu } from "react-burger-menu"
import "./styles/HamburgerMenu.css"

import {
    useParams
} from "react-router-dom";


const Hamburger = () => {
	const {courseId} = useParams()
	let syllabusLink = `/${courseId}/Syllabus`
	let scheduleLink = `/${courseId}/Schedule`
	let forumLink = `/${courseId}/Forum`
	let coursLink =  `/LoggedInHome`

    const LogOut = (e)=>{
        localStorage.removeItem('access-token');
    };


    return(
		<Menu>
	        <a id="syllabus" className="menu-item" href={syllabusLink}>Syllabus</a>
	        <a id="schedule" className="menu-item" href={scheduleLink}>Schedule</a>
	        <a id="members" className="menu-item" href="#">Members</a>
	        <a id="forum" className="menu-item" href={forumLink}>Forum</a>
	        <a id="courses" className="menu-item" href={coursLink}>Courses</a>
	        <a id="settings" className="menu-item" href="#">Settings</a>
	        <a id="logout" className="menu-item" onClick={LogOut} href="/home">Log Out</a>
      	</Menu>
	);
}

export default Hamburger;