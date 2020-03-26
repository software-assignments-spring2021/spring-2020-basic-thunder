import React, {useState, useEffect} from "react"
import axios from "axios"
import {
    useParams,
} from "react-router-dom";

import "./styles/Syllabus.css"
import Hamburger from "./HamburgerMenu.js"
import {LoadingView} from "./loading_view"

const NavBarComponentPlaceHolder = () => {
    return (
        <div className="biazza-header-title">
            <h2>Biazza</h2>
        </div>
    );
}

const CourseBarComponent = (courseName) => {
	let text = "Syllabus: "+courseName.courseName;
	// console.log(text)
	return(
		<h2>{text}</h2>
	)
}

const SyllabusContent = (defaultVal, syllabusText) => {
	console.log(syllabusText)
	let text = syllabusText.syllabusText
	let dV = defaultVal.defaultVal
	return(
		<textarea id="syllabus-text-area" defaultValue={dV} readOnly>{text}</textarea>
	)
}

const EditBtn = (instructorMode) => {
	console.log(instructorMode)
	if(instructorMode.instructorMode === true){
		let showSubmitCancel = () =>{
			let edit = document.querySelector("#edit-btn")
			edit.classList.add("student")
			let sub = document.querySelector("#submit-btn")
			let can = document.querySelector("#cancel-btn")
			sub.classList.remove("student")
			can.classList.remove("student")
			document.querySelector("textarea").removeAttribute("readonly")
		}
		return(
			<button id="edit-btn" onClick={showSubmitCancel}>Edit</button>
		)
	}
	else{
		return(
			<button className="student" id="edit-btn">Edit</button>
		)
	}
}

const SaveBtn = (courseId) => {
	let postSyllabus = async () => {
		let text = document.querySelector('textarea')
		// console.log(text)
		let apiSyllabusRoute = `http://127.0.0.1:5000/${parseInt(courseId.courseId)}/Syllabus`
		let result = await axios.post(apiSyllabusRoute, text.value).then(result => {
			console.log("success")
			console.log(result)
			let attr = document.createAttribute("readonly")
			text.setAttributeNode(attr)
			document.querySelector("#submit-btn").classList.add("student")
			document.querySelector("#cancel-btn").classList.add("student")
			document.querySelector("#edit-btn").classList.remove("student")
			// text.defaultValue = result.data.syllabus
			text.value = result.data.syllabus
			// setData(result.data)
		})
	}
	return(
		<button className="student" id="submit-btn" onClick={postSyllabus}>Submit</button>
	)
}

const CancelBtn = (courseId) =>{

	let cancel = async () => {
		let apiSyllabusRoute = `http://127.0.0.1:5000/${parseInt(courseId.courseId)}/Syllabus`
		let result = await axios.get(apiSyllabusRoute).then(result => {
			let attr = document.createAttribute("readonly")
			let txtArea = document.querySelector('textarea')
			txtArea.setAttributeNode(attr)
			txtArea.value = result.data.syllabus
			document.querySelector("#submit-btn").classList.add("student")
			document.querySelector("#cancel-btn").classList.add("student")
			document.querySelector("#edit-btn").classList.remove("student")
		})
	}

	return(
		<button className="student" id="cancel-btn" onClick={cancel}>Cancel</button>
	)
}

const Syllabus = () => {
	const courseId = useParams()
	const [data, setData] = useState({"courseId":-1,"courseName":null,"syllabus":null,"success":null})
	let dataArray = [data.courseId, data.courseName, data.syllabus, data.success]
	const [instructorMode, setInstructorMode] = useState(true)
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
				<header class="biazza-header">
					<Hamburger />
					<NavBarComponentPlaceHolder />
				</header>
				<CourseBarComponent courseName={data.courseName}/>
				<section id="sylllabus-content">
					<SyllabusContent defaultVal={data.syllabus} syllabusText={data.syllabus} />
				</section>
				<div>
					<EditBtn instructorMode={instructorMode}/>
					<CancelBtn courseId={data.courseId}/>
					<SaveBtn courseId={data.courseId}/>
				</div>
			</div>
		);
	}
}

export default Syllabus