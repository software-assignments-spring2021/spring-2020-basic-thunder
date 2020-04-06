import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import banner from "./img/ys.jpg"
import {LoadingView} from "./loading_view"
import './styles/loggedInHomeView.css'

/*
Comment for future implement

Expected data:
    Course title
    Course id
 */


let rerenderTriggeer = null;
/* main */
const HomeView = ()=>{
    return (
        <div>
            <div id={"InsHomeView"} >
                <header className="biazza-header">
                    <NavBarComponentPlaceHolder />
                </header>
                <Banner />
                <CourseList />
            </div>
        </div>
    );
};


const Banner = ()=>{
    return (
        <div className={"Banner"}>
            <h1 id={"BannerText"}>Courses</h1>
            <img id={"BannerImg"} src={banner} />
        </div>
    )
};


const NavBarComponentPlaceHolder = () =>{
    return (
        <div className="biazza-header-title">
            <h2>Biazza</h2>
        </div>
    );
};


const AddCourse = ()=>{
    const [addCourse,setAddCourse] = useState(false);
    const [courseName,setCourseName] = useState(null);
    const year_options = [];
    const date_obj = new Date();
    const cur_year = date_obj.getFullYear();
    const cur_month = date_obj.getMonth();
    const selected_semester = cur_month <= 6? 'Spring '+cur_year: 'Fall '+cur_year;
    const semester = ['Spring','Fall'];
    for(let i = cur_year - 1; i < cur_year + 2; ++i ){
        year_options.push(...semester.map(e=>e+" "+i));
    }

    const handleClick = (e)=>{
        e.preventDefault();
        setAddCourse(!addCourse);
    };

    const handleAddNewCourse = (e)=> {
        e.preventDefault();
        const accessToken = localStorage.getItem("access-token");
        const api = "http://127.0.0.1:5000/create-courses"; // backend api
        const course_name = e.target['courseNameInput'].value;
        const term = e.target['SemesterOptionsContainer'].value;
        const new_course_data = {
            course_name: course_name,
            term:term,
        };
        axios.post(api, new_course_data,{headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then(res => {
                rerenderTriggeer(null);
                setAddCourse(false);
            })
            .catch(e=>{
                console.log(e);
                window.location.href = '/LoggedInHome';
            });
    };

    if (addCourse)
        return (
            <div>
                <form className={"AddNewCourseArea"} onSubmit={handleAddNewCourse}>
                    <label htmlFor="courseName" className={"GuideUserLine"}>Please enter your new course: </label>
                    <input type="text" placeholder="Course Name" id="courseNameInput" name="courseName" onChange={e=>setCourseName(e.target.value)} required={true}/>
                    <label htmlFor="courseName" className={"GuideUserLine"}>Semester: </label>
                    <select id="SemesterOptionsContainer" defaultValue={selected_semester}>
                        {year_options.map(e=>(<option className={"SemesterOption"} value={e}>{e}</option>))}
                    </select>
                    <div className={"submissionBtnContainer"}>
                        <button id={"submitNewCourse"} type="submit" value="Submit">Add Course</button>
                        <button id={"cancelNewClassBtn"} onClick={handleClick}>Cancel</button>
                    </div>
                </form>
            </div>
        );

    else{
        return (
            <div>
                <button id={"addNewClassBtn"} onClick={handleClick}>Create New Course</button>
            </div>)
    }

};

const Course = (props) =>{
    const courseTitle = props['title'];
    const courseId = props['courseId'];
    return (
        <Link className={"CourseDetail"} to={`/${courseId}/Forum`}> {courseTitle}</Link>
    )
};

const InstructorControls = ({isInstructor}) =>{
    if(isInstructor)
        return (
        <div>
            <AddCourse/>
        </div>
    );
    return null;
};

// main
const CourseList = () =>{
    const [awaitingData,setAwaitingData] = useState(true);
    const [coursesArr,setCoursesArr] = useState([]);
    const [isInstructor,setInstructor] = useState(false);
    const [rerender,setRerender] = useState(false);
    rerenderTriggeer = setRerender;
    useEffect(()=>{
        const fetchData = async () => {
            const api = "http://127.0.0.1:5000/my-courses"; // backend api
            const accessToken = localStorage.getItem("access-token");
            await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res=>{
                    console.log(res.data.courses);
                    setCoursesArr(res.data.courses);
                    setInstructor(res.data.role === 'Instructor');
                    setAwaitingData(false);
                })
                .catch(e=>{
                    console.log(e);
                });
        };
        fetchData();
    },[rerender]);
    if (awaitingData)
        return (
            <div className={"CourseList"}>
                <div id={"MyCourses"}>
                    <LoadingView/>
                </div>
            </div>
        );
    return (
      <div className={"CourseList"}>
          <div id={"MyCourses"}>
              {coursesArr.length>0?(coursesArr.map(e=>(
                  <Course key={e.course_id} title={e.course_name} courseId={e.course_id}/>
              ))):<h4 id={"noCourse"}>You are not affiliated to any course</h4>}
          </div>
          <InstructorControls isInstructor={isInstructor}/>
      </div>
    );
};

export {HomeView};
