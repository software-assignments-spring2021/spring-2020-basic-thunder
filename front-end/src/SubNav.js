import React from "react"
import "./styles/SubNav.css"

const SubNav = (props) => {
	let syllabusLink = `/${props.courseId}/Syllabus`
	let scheduleLink = `/${props.courseId}/Schedule`
	let forumLink = `/${props.courseId}/Forum`
	let coursesLink = '/LoggedInHome'
	let membersLink = `/${props.courseId}/members-list`
    console.log(props.current)

    let hover = (evt) => {
        let section = evt.target
        if(!section.hasAttribute("data-current")){
            // console.log(section)
            section.style.borderBottomColor = "rgba(72,61,139,1)";
            section.style.borderBottomStyle = "solid";
            section.styleborderBottomWidth = "3px";
            section.style.cursor = "pointer";
        }
        // console.log(props.current === "section")
        // alert("hello");
    }
    let leaveHover = (evt) => {
        let section = evt.target
        if(!section.hasAttribute("data-current")){
            // console.log(section)
            // section.style.borderBottomColor = "rgba(72,61,139,1)";
            section.style.borderBottomStyle = "none";
            // section.styleborderBottomWidth = "3px";
            // section.style.cursor = "pointer";
        }
    }
    let test = (evt) => {
        alert("hello");
    }
    if(props.current === "syllabus"){
        return(
            <div className="sub-nav-container">
                <div className="subnav-link-container">
                    <p className="subnav-link-text">Syllabus</p>
                    <a className="subnav-link" href={syllabusLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} data-current="y" className="subnav-link-span current"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Schedule</p>
                    <a className="subnav-link" href={scheduleLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Forum</p>
                    <a className="subnav-link" href={forumLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Members</p>
                    <a className="subnav-link" href={membersLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>
            </div>
        )
    }
    else if(props.current === "schedule"){
        return(
            <div className="sub-nav-container">
                <div className="subnav-link-container">
                    <p className="subnav-link-text">Syllabus</p>
                    <a className="subnav-link" href={syllabusLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Schedule</p>
                    <a className="subnav-link" href={scheduleLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} data-current="y" className="subnav-link-span current"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Forum</p>
                    <a className="subnav-link" href={forumLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Members</p>
                    <a className="subnav-link" href={membersLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>
            </div>
        )
    }
    else if(props.current === "members"){
        return(
            <div className="sub-nav-container">
                <div className="subnav-link-container">
                    <p className="subnav-link-text">Syllabus</p>
                    <a className="subnav-link" href={syllabusLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Schedule</p>
                    <a className="subnav-link" href={scheduleLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Forum</p>
                    <a className="subnav-link" href={forumLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Members</p>
                    <a className="subnav-link" href={membersLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} data-current="y" className="subnav-link-span current"></span>
                    </a>
                </div>
            </div>
        )
    }
    else if(props.current === "forums"){
        return(
            <div className="sub-nav-container">
                <div className="subnav-link-container">
                    <p className="subnav-link-text">Syllabus</p>
                    <a className="subnav-link" href={syllabusLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Schedule</p>
                    <a className="subnav-link" href={scheduleLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Forum</p>
                    <a className="subnav-link" href={forumLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} data-current="y" className="subnav-link-span current"></span>
                    </a>
                </div>

                <div className="subnav-link-container">
                    <p className="subnav-link-text">Members</p>
                    <a className="subnav-link" href={membersLink}>
                        <span onMouseOver={hover} onMouseOut={leaveHover} className="subnav-link-span"></span>
                    </a>
                </div>
            </div>
        )
    }
    else{
        return(
            "Error"
        )
    }
}

export default SubNav