/*
Has the same header burger + Biazza
Has the same compnent underneath with the name of the class

There is just a giant textbox
Instructor's view has an edit button and a preview button.
	Preview essentiallly opens up student's view of the syllabus
	Edit when clicked

Ok this page is shite.  Instructor's view will be the same as student's view except
there is an edit button
	Once instructor clicks edit two new buttons appear.
		Save and Cancel
	Save saves the current text and cancel reverts back to the old version
	After clicking one of these buttons, they disappear and edit is back.
	(Might be able to reuse the submit and back buttons for creating post)
*/

import React, {useState, useEffect} from "react"
import axios from "axios"
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    // Link,
    useParams,
    // useRouteMatch
} from "react-router-dom";

import "./styles/Syllabus.css"
import Hamburger from "./HamburgerMenu.js"
import {LoadingView} from "./loading_view"

const NavBarComponentPlaceHolder = () => {
    return (
        <div className="NavBarComponentPlaceHolder">
            <h2>Biazza</h2>
        </div>
    );
}

const CourseBarComponent = (courseName) => {
	let text = "Syllabus: "+courseName.courseName
	// console.log(text)
	return(
		<h2>{text}</h2>
	)
}

const Syllabus = () => {
	const courseId = useParams()
	const [data, setData] = useState({"courseId":-1,"courseName":null,"syllabus":null,"success":null})
	let dataArray = [data.courseId, data.courseName, data.syllabus, data.success]
	// console.log(data)
	// console.log(courseId)
	// console.log(parseInt(courseId.courseId))

	useEffect( ()=>{
			let fetch = async() => {
				let api = `http://127.0.0.1:5000/${parseInt(courseId.courseId)}/Syllabus`
				let result = await axios.get(api).then(result => {
					setData(result.data)
				})
			}
			fetch()
		},
	[])

	if (data.courseId == -1)
		return ( <LoadingView />)
	else if(data.success == false)
		return(<h1>"Error occurred reload the page"</h1>)
	else{
		return(
			<div id="syllabus-container">
				<header>
					<Hamburger />
					<NavBarComponentPlaceHolder />
				</header>
				<CourseBarComponent courseName={data.courseName}/>
			</div>
		);
	}
}

export default Syllabus