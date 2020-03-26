/*
TODO:
Write 2 objects and the Hamburger-Menu.css file
The two objects should be logged in view and the course specific view.
*/
import React from "react"
import { slide as Menu } from "react-burger-menu"
import "./styles/HamburgerMenu.css"

import {
    useParams
} from "react-router-dom";


const Hamburger = () => {
	const {courseId} = useParams()
	let syllabusLink = `/${courseId}/Syllabus`
	let forumLink = `/${courseId}/Forum`
	// console.log(syllabusLink)
	return(
		<Menu>
	        <a id="syllabus" className="menu-item" href={syllabusLink}>Syllabus</a>
	        <a id="schedule" className="menu-item" href="#">Schedule</a>
	        <a id="members" className="menu-item" href="#">Members</a>
	        <a id="forum" className="menu-item" href={forumLink}>Forum</a>
	        <a id="courses" className="menu-item" href="#">Courses</a>
	        <a id="settings" className="menu-item" href="#">Settings</a>
	        <a id="logout" className="menu-item" href="/home">Log Out</a>
      	</Menu>
	);
}

// <a onClick={ this.showSettings } className="menu-item--small" href="#">Settings</a>

export default Hamburger;