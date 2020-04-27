import React from "react"
import "./styles/SubNav.css"

const SubNav = (props) => {
	// console.log("Logging props in subnav:", props)
	let syllabusLink = `/${props.courseId}/Syllabus`
	let scheduleLink = `/${props.courseId}/Schedule`
	let forumLink = `/${props.courseId}/Forum`
	let coursesLink = '/LoggedInHome'
	let membersLink = `/${props.courseId}/members-list`

    return(
        <div className="sub-nav-container">
            <div className="subnav-link-container">
                <p className="subnav-link-text">Syllabus</p>
                <a className="subnav-link" href={syllabusLink}>
                    <span className="subnav-link-span"></span>
                </a>
            </div>

            <div className="subnav-link-container">
                <p className="subnav-link-text">Schedule</p>
                <a className="subnav-link" href={scheduleLink}>
                    <span className="subnav-link-span"></span>
                </a>
            </div>

            <div className="subnav-link-container">
                <p className="subnav-link-text">Forum</p>
                <a className="subnav-link" href={forumLink}>
                    <span className="subnav-link-span"></span>
                </a>
            </div>

            <div className="subnav-link-container">
                <p className="subnav-link-text">Members</p>
                <a className="subnav-link" href={membersLink}>
                    <span className="subnav-link-span"></span>
                </a>
            </div>
        </div>
    )
}

export default SubNav