import React from "react"
import { slide as Menu } from "react-burger-menu"
import "./styles/HamburgerMenu.css"

const Hamburger = () => {
	
	const coursesLink = '/LoggedInHome'
	const settingsLink = '/settings'

    const LogOut = (e)=>{
        localStorage.removeItem('access-token');
    };


    return(
		<Menu>
		 <a id="settings" className="menu-item" href={coursesLink}>Courses</a>
	        <a id="settings" className="menu-item" href={settingsLink}>Settings</a>
	        <a id="logout" className="menu-item" onClick={LogOut} href="/home">Log Out</a>
      	</Menu>
	);
}

export default Hamburger;