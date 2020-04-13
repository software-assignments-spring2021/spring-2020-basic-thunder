import React, {useState, useEffect} from "react"
import axios from "axios"
import {
    useParams,
} from "react-router-dom";

import "./styles/Schedule.css"
import Hamburger from "./HamburgerMenu.js"
import {LoadingView} from "./loading_view"

/*
Notes about the schedule page:
I need an outside Calendary component that is made up of date components.
Each date component has 4 fields: date, topic of the day, lecture notes, assignment details
Need to know if im using links or files, and figure out how to set a name for this hyperlinks and such
Implement the course header, and the await stuff.

I think I need to create a table and append rows

Table is done and ready to go. Last thing for me to do is put in the instructor mode editing
sike can't use a table I have to use a form with text areas.
Use a div with some id or class to act as my table.
Then let each form be a row with one input text and 3 text fields

have to adjust width, heights, paddings and margins for all the boxes
make it only editable if it's a professor(ALSO need to add an edit button to the right of each row)
18px font size isn't too shabby
Need edit and delete button. save and cancel button after clicking the edit button
save and cancel functionality
I might have to use plain old javascript for the adding new row functionality.
*/

const NavBarComponentPlaceHolder = () => {
    return (
        <div className="biazza-header-title">
            <h2>Biazza</h2>
        </div>
    );
}

const CourseBarComponent = (props) => {
	let text = "Schedule: "+props.courseName;

	return(
		<h2>{text}</h2>
	)
}

const Calendar = (props) => {
	let dates = [] 

	for(const[index, value] of props.scheduleArray.entries()){
		console.log(index, value)
		dates.push(<DateDetails details={value} isInstructor={props.isInstructor} key={value[0]}/>)
	}

	// console.log(dates)
	// console.log(dates.length)
	if(props.isInstructor === true){
		return(
			<section id="section-content">
				<h4>Calendar</h4>
				<div id="calendar-table">
					{dates}
					<AddBtn isInstructor={props.isInstructor} />
				</div>
			</section>
		)
	}
	else{
		return(
			<section id="section-content">
				<h4>Calendar</h4>
				<div id="calendar-table">
					{dates}
				</div>
			</section>
		)
	}
}

const DateDetails = (props) => {
	// Note: If I provide a value without an onChange, it renders a read-only copy
	// could be useful for student view? Also there is just a readOnly attribute
	let date = props.details[0]
	let topic = props.details[1]
	let notes = props.details[2]
	let assignment = props.details[3]

	console.log("Date details:",props.isInstructor)

	if(props.isInstructor === true){
		return(
			<form className="row">
				<input type="text" disabled className="dateField"defaultValue={date} />
				<textarea disabled className="topicField" defaultValue={topic}></textarea>
				<textarea disabled className="notesField" defaultValue={notes}></textarea>
				<textarea disabled className="asgnField" defaultValue={assignment}></textarea>
				<div className="detail-buttons-container">
					<EditBtn />
					<DelBtn />
				</div>
			</form>
		)
	}
	else{
		return(
			<form className="row">
				<input type="text" disabled className="dateField"defaultValue={date} />
				<textarea disabled className="topicField" defaultValue={topic}></textarea>
				<textarea disabled className="notesField" defaultValue={notes}></textarea>
				<textarea disabled className="asgnField" defaultValue={assignment}></textarea>
			</form>
		)
	}
}

const EditBtn = () => {
	let action = (evt) => {
		evt.preventDefault()
		let rowElement = evt.target.parentElement.parentElement
		console.dir(rowElement)
		console.dir(rowElement.children[0])

		for(let i = 0; i <= 4; i++){
			rowElement.children[i].disabled = false
		}

		let btnContainer = evt.target.parentElement
		while(btnContainer.hasChildNodes()){
			btnContainer.removeChild(btnContainer.firstChild)
		}

		let saveBtn = document.createElement("button")
		saveBtn.innerHTML = "Save"
		saveBtn.classList.add("save-date-details")
		let cancBtn = document.createElement("button")
		cancBtn.innerHTML = "Cancel"
		cancBtn.classList.add("cancel-date-details")

		btnContainer.appendChild(saveBtn)
		btnContainer.appendChild(cancBtn)

		alert("Finished editing field")
	}

	return(
		<button className="edit-date-details" onClick={action}>Edit</button>
	)
}

const DelBtn = () => {
	let action = (evt) => {
		alert("Deleted the field")
	}

	return(
		<button className="delete-date-details" onClick={action}>Delete</button>
	)
}

const AddBtn = (isInstructor) => {
	/*
	New row is successfully added. Have to create save and cancel buttons to POST/delete the row
	Also need edit and delete to PUT/DELETE
	*/
	let addRow = (evt) => {
		evt.target.style.display = "none"
		let formEle = document.createElement("form")
		formEle.classList.add("row")
		let dateEle = document.createElement("input")
		dateEle.type = "text"
		dateEle.classList.add("dateField")
		let topicEle = document.createElement("textarea")
		topicEle.classList.add("topicField")
		let notesEle = document.createElement("textarea")
		notesEle.classList.add("notesField")
		let asgnEle = document.createElement("textarea")
		asgnEle.classList.add("asgnField")

		let saveBtn = document.createElement("button")
		saveBtn.innerHTML = "Save"
		saveBtn.classList.add("save-date-details")
		let cancBtn = document.createElement("button")
		cancBtn.innerHTML = "Cancel"
		cancBtn.classList.add("cancel-date-details")

		saveBtn.addEventListener("click", (evt)=>{
			// evt.preventDefault()
			alert("Saved")
		})
		cancBtn.addEventListener("click", (evt)=>{
			alert("Cancelled")
		})

		let testDiv = document.createElement("div")
		testDiv.appendChild(saveBtn)
		testDiv.appendChild(cancBtn)
		testDiv.classList.add("detail-buttons-container")

		formEle.appendChild(dateEle)
		formEle.appendChild(topicEle)
		formEle.append(notesEle)
		formEle.appendChild(asgnEle)
		formEle.appendChild(testDiv)

		document.querySelector("#calendar-table").appendChild(formEle)
	}
	return(
		<div>
			<button onClick={addRow} id="add-day-btn">Add Details</button>
		</div>
	)
}

const SaveBtn = () => {

}

const CancelBtn = () => {

}

const Schedule = () => {
	let courseId = useParams()
	const [data, setData] = useState({"courseId":-1,"courseName":null,"schedule":null,"success":null})
	const [instructorMode, setInstructorMode] = useState(true)

	useEffect( ()=>{
			let fetch = async() => {
				let api = `http://127.0.0.1:5000/${parseInt(courseId.courseId)}/Schedule`
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
		// console.log(data)
		return(
			<div id="schedule-container">
				<header className="biazza-header">
					<Hamburger />
					<NavBarComponentPlaceHolder />
				</header>
				<CourseBarComponent courseName={data.courseName}/>
				<Calendar scheduleArray={data.schedule} isInstructor={instructorMode}/>
			</div>
		)
	}
}

export default Schedule