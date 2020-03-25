/*
TODO:
Write 2 objects and the Hamburger-Menu.css file
The two objects should be logged in view and the course specific view.
*/
import React from "react"
import { slide as Menu } from "react-burger-menu"
import "./styles/HamburgerMenu.css"

// class Example extends React.Component {
//   showSettings (event) {
//     event.preventDefault();
//     .
//     .
//     .
//   }

const Hamburger = () => {
	return(
		<Menu>
	        <a id="syllabus" className="menu-item" href="#">Syllabus</a>
	        <a id="schedule" className="menu-item" href="#">Schedule</a>
	        <a id="members" className="menu-item" href="#">Members</a>
	        <a id="forum" className="menu-item" href="#">Forum</a>
	        <a id="courses" className="menu-item" href="#">Courses</a>
	        <a id="settings" className="menu-item" href="#">Settings</a>
	        <a id="logout" className="menu-item" href="#">Log Out</a>
      	</Menu>
	);
}

// <a onClick={ this.showSettings } className="menu-item--small" href="#">Settings</a>

export default Hamburger;