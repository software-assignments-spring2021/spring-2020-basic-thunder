/*
TODO:
Write 2 objects and the Hamburger-Menu.css file
The two objects should be logged in view and the course specific view.
*/
import React from "react"
import { slide as Menu } from "react-burger-menu"
import "./HamburgerMenu.css"

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
	        <a id="home" className="menu-item" href="#">Home</a>
	        <a id="about" className="menu-item" href="#">About</a>
	        <a id="contact" className="menu-item" href="#">Contact</a>
      	</Menu>
	);
}

// <a onClick={ this.showSettings } className="menu-item--small" href="#">Settings</a>

export default Hamburger;