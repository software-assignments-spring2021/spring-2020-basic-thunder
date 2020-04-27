import React, {useState, useEffect} from "react"
import axios from "axios"
import {
    useParams,
} from "react-router-dom";

import "./styles/Schedule.css"
import Hamburger from "./HamburgerMenu.js"
import SubNav from "./SubNav.js"
import {LoadingView} from "./loading_view"


const NavBarComponentPlaceHolder = () => {
    return (
        <div className="biazza-header-title">
            <h2>Biazza</h2>
        </div>
    )
}

const CourseBarComponent = (props) => {
	let text = "Schedule: "+props.courseName

	return(
		<h2>{text}</h2>
	)
}

//
// After editing, the detail-buttons-container don't show up
// After saving, they don't show up either
// Delete doesn't remove element from the page
const AddBtn = (props) => {

	let addRow = (evt) => {
		evt.target.classList.add("hiding")

		let formEle = document.createElement("form")
		formEle.classList.add("row")

		let dateEle = document.createElement("input")
		dateEle.type = "text"
		dateEle.classList.add("dateField");
		dateEle.placeholder = "MM\/DD\/YYYY"

		let topicEle = document.createElement("textarea")
		topicEle.classList.add("topicField")
		topicEle.placeholder = "The topic for the class"

		let notesEle = document.createElement("textarea")
		notesEle.classList.add("notesField")
		notesEle.placeholder = "The notes for the class"

		let asgnEle = document.createElement("textarea")
		asgnEle.classList.add("asgnField")
		asgnEle.placeholder = "Assignments for the"

		let saveBtn = document.createElement("button")
		// saveBtn.id = "post-save-btn"
		saveBtn.innerHTML = "Save"
		saveBtn.classList.add("save-date-details")

		let cancBtn = document.createElement("button")
		// cancBtn.id = "post-canc-btn"
		cancBtn.innerHTML = "Cancel"
		cancBtn.classList.add("cancel-date-details")

		let editBtn = document.createElement("button")
		editBtn.innerHTML = "Edit"
		editBtn.classList.add("edit-date-details")
		editBtn.classList.add("hiding")

		let deleBtn = document.createElement("button")
		deleBtn.innerHTML = "Delete"
		deleBtn.classList.add("delete-date-details")
		deleBtn.classList.add("hiding")

		let allBtnContainers = document.getElementsByClassName("detail-buttons-container")
		for(let k = 0; k < allBtnContainers.length; k++){
			allBtnContainers[k].classList.add("hiding")
		}

		let testDiv = document.createElement("div")
		testDiv.appendChild(saveBtn)
		testDiv.appendChild(cancBtn)
		testDiv.appendChild(editBtn)
		testDiv.appendChild(deleBtn)
		testDiv.classList.add("detail-buttons-container")

		formEle.appendChild(dateEle)
		formEle.appendChild(topicEle)
		formEle.append(notesEle)
		formEle.appendChild(asgnEle)
		formEle.appendChild(testDiv)

		document.querySelector("#calendar-table").insertBefore(formEle, document.querySelector("#calendar-table").lastChild)

		saveBtn.onclick = (evt) => {
			console.log(evt)
			evt.preventDefault();
			let d = dateEle.value.split("/");

			d[0] = parseInt(d[0]);
			d[1] = parseInt(d[1]);
			d[2] = parseInt(d[2]);

			if(d[0] > 12 || d[0] < 1){
				alert("Not a valid month")
			}
			else if(d[1] > 31 || d[1] < 1){
				alert("Not a valid day")
			}
			else if(d[3] < 2000){
				alert("Not a valid year")
			}
			else{
				let dateValue = new Date(dateEle.value);
				( async() => {
					let postDateRoute = `http://127.0.0.1:5000/${props.courseId}/Schedule/${props.scheduleId}`
					let accessToken = localStorage.getItem("access-token")

					let res = await axios.post(postDateRoute,{date: dateValue,topic: topicEle.value,notes: notesEle.value,assignment: asgnEle.value}, {headers: {"Authorization" : `Bearer ${accessToken}`}}).then(result => {
						document.querySelector("#add-day-btn").classList.remove("hiding")
						for(let i = 0; i <= 4; i++){
							formEle.children[i].disabled = true
							// formEle.children[i].value = formEle.children[i].defaultValue
						}
						dateEle.defaultValue = dateValue.toLocaleDateString()
						topicEle.defaultValue = topicEle.value
						notesEle.defaultValue = notesEle.value
						asgnEle.defaultValue = asgnEle.value

						dateEle.value = dateValue.toLocaleDateString()
						topicEle.value = topicEle.value
						notesEle.value = notesEle.value
						asgnEle.value = asgnEle.value

						for(let k = 0; k < allBtnContainers.length; k++){
							allBtnContainers[k].classList.remove("hiding")
						}

						let btnContainer = evt.target.parentElement
						for(let b = 0; b < btnContainer.children.length; b++){
							if(btnContainer.children[b].classList.contains("hiding"))
								btnContainer.children[b].classList.remove("hiding")
							else
								btnContainer.children[b].classList.add("hiding")
						}
						//Changing the onclick's for POST to PUT and Cancel functionality doesn't delete 
						saveBtn.onclick = (evt) => {
							evt.preventDefault()

							let form = evt.target.parentElement.parentElement
							let date = form.children[0].value
							let topic = form.children[1].value
							let notes = form.children[2].value
							let assignment = form.children[3].value

							let d = date.split("\/")
							d[0] = parseInt(d[0]);
							d[1] = parseInt(d[1]);
							d[2] = parseInt(d[2]);

							if(d[0] > 12 || d[0] < 1){
								alert("Not a valid month")
							}
							else if(d[1] > 31 || d[1] < 1){
								alert("Not a valid day")
							}
							else{
								let dateValue = new Date(date);
								( async() => {
									let putDateRoute = `http://127.0.0.1:5000/${props.courseId}/Schedule/${props.scheduleId}`
									let accessToken = localStorage.getItem("access-token")

									let res = await axios.put(putDateRoute,{date: dateValue,topic: topic,notes: notes,assignment: assignment}, {headers: {"Authorization" : `Bearer ${accessToken}`}}).then(result => {
										console.log(result)
										document.querySelector("#add-day-btn").classList.remove("hiding")
										for(let i = 0; i <= 4; i++){
											form.children[i].disabled = true
											form.children[i].value = form.children[i].defaultValue
										}

										let btnContainer = evt.target.parentElement
										for(let b = 0; b < btnContainer.children.length; b++){
											if(btnContainer.children[b].classList.contains("hiding"))
												btnContainer.children[b].classList.remove("hiding")
											else
												btnContainer.children[b].classList.add("hiding")
										}
										let allBtnContainers = document.getElementsByClassName("detail-buttons-container")
										for(let k = 0; k < allBtnContainers.length; k++){
											allBtnContainers[k].classList.remove("hiding")
										}
									})
								}) ();
							}
						}
						cancBtn.onclick = (evt) =>{
							evt.preventDefault()

							let allBtnContainers = document.getElementsByClassName("detail-buttons-container")
							for(let k = 0; k < allBtnContainers.length; k++){
								allBtnContainers[k].classList.remove("hiding")
							}

							let rowElement = evt.target.parentElement.parentElement
							for(let i = 0; i <= 4; i++){
								rowElement.children[i].disabled = true
								rowElement.children[i].value = rowElement.children[i].defaultValue
							}
							let btnContainer = evt.target.parentElement
							for(let b = 0; b < btnContainer.children.length; b++){
								if(btnContainer.children[b].classList.contains("hiding"))
									btnContainer.children[b].classList.remove("hiding")
								else
									btnContainer.children[b].classList.add("hiding")
							}
							document.querySelector("#add-day-btn").classList.remove("hiding")
						}
						editBtn.onclick = (evt) => {
							evt.preventDefault()

							let rowElement = evt.target.parentElement.parentElement

							for(let i = 0; i <= 4; i++){
								rowElement.children[i].disabled = false
							}

							let btnContainer = evt.target.parentElement
							let allBtnContainers = document.getElementsByClassName("detail-buttons-container")

							for(let k = 0; k < allBtnContainers.length; k++){
								if(allBtnContainers[k] !== btnContainer)
									allBtnContainers[k].classList.add("hiding")
							}

							for(let b = 0; b < btnContainer.children.length; b++){
								if(btnContainer.children[b].classList.contains("hiding"))
									btnContainer.children[b].classList.remove("hiding")
								else
									btnContainer.children[b].classList.add("hiding")
							}
							document.querySelector("#add-day-btn").classList.remove("hiding")
						}
						deleBtn.onclick = (evt) => {
							evt.preventDefault()

							let focusEle = evt.target
							let date = focusEle.parentElement.parentElement.firstChild
							let accessToken = localStorage.getItem("access-token");
							let deleteRoute = `http://127.0.0.1:5000/${props.courseId}/Schedule/${props.scheduleId}/Delete/${new Date(date.value)}`

							axios.delete(deleteRoute, {headers: {"Authorization" : `Bearer ${accessToken}`}}).then(res =>{
								console.log(res)
								let row = focusEle.parentElement.parentElement
								while(row.hasChildNodes() )
									row.removeChild(row.firstChild)

								row.parentElement.removeChild(row)
							})
							.catch(err =>{
								console.log(err)
							})
						}

					})
				}) ();//end of post call
			}
		} //end of the post save event listener
		cancBtn.onclick = (evt) => {
			evt.preventDefault()

			while(formEle.hasChildNodes() ){
				formEle.removeChild(formEle.firstChild)
			}
			formEle.parentNode.removeChild(formEle)
			for(let k = 0; k < allBtnContainers.length; k++){
				allBtnContainers[k].classList.remove("hiding")
			}
			document.querySelector("#add-day-btn").classList.remove("hiding")

		}

	}
	return(
		<div>
			<button onClick={addRow} id="add-day-btn">Add Details</button>
		</div>
	)
}

const DateDetails = (props) => {
	let date = props.details.date
	let parsedD = new Date(date)
	parsedD = parsedD.toLocaleDateString()

	let topic = props.details.topic
	let notes = props.details.notes
	let assignment = props.details.assignment

	if(props.isInstructor === true){
		return(
			<form className="row">
				<input type="text" disabled className="dateField" defaultValue={parsedD} />
				<textarea disabled className="topicField" defaultValue={topic}></textarea>
				<textarea disabled className="notesField" defaultValue={notes}></textarea>
				<textarea disabled className="asgnField" defaultValue={assignment}></textarea>
				<div className="detail-buttons-container">
					<SaveBtn isInstructor={props.isInstructor} courseId={props.courseId} scheduleId={props.scheduleId}/>
					<CancelBtn isInstructor={props.isInstructor} courseId={props.courseId} scheduleId={props.scheduleId}/>
					<EditBtn isInstructor={props.isInstructor} courseId={props.courseId} scheduleId={props.scheduleId}/>
					<DelBtn isInstructor={props.isInstructor} courseId={props.courseId} scheduleId={props.scheduleId}/>
				</div>
			</form>
		)
	}
	else{
		return(
			<form className="row">
				<input type="text" disabled className="dateField" defaultValue={date} />
				<textarea disabled className="topicField" defaultValue={topic}></textarea>
				<textarea disabled className="notesField" defaultValue={notes}></textarea>
				<textarea disabled className="asgnField" defaultValue={assignment}></textarea>
			</form>
		)
	}
};


const SaveBtn = (props) => {
	let actionSave = (evt) =>{
		evt.preventDefault()

		let form = evt.target.parentElement.parentElement
		let date = form.children[0].value
		let topic = form.children[1].value
		let notes = form.children[2].value
		let assignment = form.children[3].value

		let d = date.split("\/")
		d[0] = parseInt(d[0]);
		d[1] = parseInt(d[1]);
		d[2] = parseInt(d[2]);

		if(d[0] > 12 || d[0] < 1){
			alert("Not a valid month")
		}
		else if(d[1] > 31 || d[1] < 1){
			alert("Not a valid day")
		}
		else{
			let focusEle = evt.target
			let dateValue = new Date(date);
			( async() => {
				let putDateRoute = `http://127.0.0.1:5000/${props.courseId}/Schedule/${props.scheduleId}`
				let accessToken = localStorage.getItem("access-token")

				let res = await axios.put(putDateRoute,{date: dateValue,topic: topic,notes: notes,assignment: assignment}, {headers: {"Authorization" : `Bearer ${accessToken}`}}).then(result => {
					console.log(result)
					document.querySelector("#add-day-btn").classList.remove("hiding")
					console.dir(form)
					for(let i = 0; i <= 4; i++){
						form.children[i].disabled = true
						form.children[i].value = form.children[i].defaultValue
					}

					// console.log(focusEle)
					let btnContainer = focusEle.parentElement
					console.dir(focusEle)
					for(let b = 0; b < btnContainer.children.length; b++){
						if(btnContainer.children[b].classList.contains("hiding"))
							btnContainer.children[b].classList.remove("hiding")
						else
							btnContainer.children[b].classList.add("hiding")
					}
					let allBtnContainers = document.getElementsByClassName("detail-buttons-container")

					for(let k = 0; k < allBtnContainers.length; k++){
						if(allBtnContainers[k] !== btnContainer)
							allBtnContainers[k].classList.remove("hiding")
					}
				})
			}) ();
		}
	}

	return(
		<button className="save-date-details hiding" onClick={actionSave}>Save</button>
	)
}

const CancelBtn = (props) => {
	let actionCancel = (evt) =>{
		evt.preventDefault()

		let allBtnContainers = document.getElementsByClassName("detail-buttons-container")
		for(let k = 0; k < allBtnContainers.length; k++){
			allBtnContainers[k].classList.remove("hiding")
		}

		let rowElement = evt.target.parentElement.parentElement
		for(let i = 0; i <= 4; i++){
			rowElement.children[i].disabled = true
			rowElement.children[i].value = rowElement.children[i].defaultValue
		}
		document.querySelector("#add-day-btn").classList.remove("hiding")

		let btnContainer = evt.target.parentElement
		for(let b = 0; b < btnContainer.children.length; b++){
			if(btnContainer.children[b].classList.contains("hiding"))
				btnContainer.children[b].classList.remove("hiding")
			else
				btnContainer.children[b].classList.add("hiding")
		}
	}

	return(
		<button className="cancel-date-details hiding" onClick={actionCancel}>Cancel</button>
	)
}

const EditBtn = (props) => {
	let actionEdit = (evt) => {
		evt.preventDefault()

		let rowElement = evt.target.parentElement.parentElement

		for(let i = 0; i <= 4; i++){
			rowElement.children[i].disabled = false
		}

		let btnContainer = evt.target.parentElement
		let allBtnContainers = document.getElementsByClassName("detail-buttons-container")

		for(let k = 0; k < allBtnContainers.length; k++){
			if(allBtnContainers[k] !== btnContainer)
				allBtnContainers[k].classList.add("hiding")
		}

		for(let b = 0; b < btnContainer.children.length; b++){
			if(btnContainer.children[b].classList.contains("hiding"))
				btnContainer.children[b].classList.remove("hiding")
			else
				btnContainer.children[b].classList.add("hiding")
		}

	}

	return(
		<button className="edit-date-details" onClick={actionEdit}>Edit</button>
	)
}

const DelBtn = (props) => {
	let actionDelete = (evt) => {
		evt.preventDefault()

		let deleteDate = async() =>{
			let focusEle = evt.target
			let date = evt.target.parentElement.parentElement.firstChild
			let accessToken = localStorage.getItem("access-token");
			let deleteRoute = `http://127.0.0.1:5000/${props.courseId}/Schedule/${props.scheduleId}/Delete/${new Date(date.value)}`

			await axios.delete(deleteRoute, {headers: {"Authorization" : `Bearer ${accessToken}`}}).then(res =>{
				console.log(res)
				let row = focusEle.parentElement.parentElement
				while(row.hasChildNodes() )
					row.removeChild(row.firstChild)

				row.parentElement.removeChild(row)
			})
			.catch(err =>{
				console.log(err)
			})


		}
		deleteDate()
	}

	return(
		<button className="delete-date-details" onClick={actionDelete}>Delete</button>
	)
}

const Calendar = (props) => {
	const [awaitingData,setAwaitingData] = useState(true);
	const [dates, setDates] = useState([]);

	let courseId = useParams()
	let scheduleId = props.scheduleId

	useEffect( ()=> {
			let fetchDates = async() => {
				let accessToken = localStorage.getItem("access-token");
				let api = `http://127.0.0.1:5000/${parseInt(courseId.courseId)}/Schedule/${scheduleId}`
				await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}}).then(res => {
						setDates(res.data.arr)
						setAwaitingData(false)
					})
					.catch(err=>{
						// you are not allowed to view this page
	                    window.location.href = '/LoggedInHome';
	                    console.log(err)
					});
			}
			fetchDates()
		},
	[])

	if(awaitingData){
		return (<LoadingView />)
	}
	else{
		let t = []

		for(let i = 0; i < dates.length; i++){
			t.push(<DateDetails details={dates[i]} key={dates[i].date} isInstructor={props.isInstructor} scheduleId={props.scheduleId} courseId={parseInt(courseId.courseId)}/>)
		}

		if(props.isInstructor === true){
			console.log(t)
			return(
				<section id="section-content">
					<h4>Calendar</h4>
					<div id="calendar-table">
						{t}
						<AddBtn courseId={parseInt(courseId.courseId)} scheduleId={scheduleId} isInstructor={props.isInstructor}/>
					</div>
				</section>
			)
		}
		else{
			return(
				<section id="section-content">
					<h4>Calendar</h4>
					<div id="calendar-table">
						{t}
					</div>
				</section>
			)
		}
	}
}

const Schedule = () => {
	let courseId = useParams()
	const [awaitingData, setAwaitingData] = useState(true)
	const [data, setData] = useState({"scheduleId":-1,"courseId":-1,"courseName":null})
	const [instructorMode, setInstructorMode] = useState(false)

	useEffect( ()=>{
			let fetch = async() => {
				const accessToken = localStorage.getItem("access-token");
				let api = `http://127.0.0.1:5000/${parseInt(courseId.courseId)}/Schedule`
				axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
					.then(res => {
						// console.log("Received data:", res.data)
						let tempObj = {scheduleId:res.data.scheduleId, courseId:res.data.courseId, courseName:res.data.courseName}
						setInstructorMode(res.data.isInstructor)
						setData(tempObj);
					})
					.catch(err=>{
						// you are not allowed to view this page
                        window.location.href = '/LoggedInHome';
                        console.log(err)
					});
			}
			fetch()
		},
	[])
	if (data.courseId == -1)
		return ( <LoadingView />)
	else{
		console.log(data)
		return(
			<div id="schedule-container">
				<header className="biazza-header">
					<Hamburger />
					<NavBarComponentPlaceHolder />
				</header>
				<SubNav courseId={data.courseId} />
				<CourseBarComponent courseName={data.courseName}/>
				<Calendar scheduleId={data.scheduleId} isInstructor={instructorMode}/>
			</div>
		)
	}
}

export default Schedule