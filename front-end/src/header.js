import React from "react"
import './styles/Header.css'
import Hamburger from './HamburgerMenu'
import {Link} from "react-router-dom"

const Header = () =>{
    return (
        <div className="Header">
            <Hamburger />
            <div className="header">
                <br/>
                <Link to={'/'} > Biazza </Link>
            </div>
        </div>
    )
}

export {Header}
