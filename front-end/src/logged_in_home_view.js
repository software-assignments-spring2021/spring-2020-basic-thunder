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

/*
Comment for future implement

Expected data:
    Course title
    Course id
 */


const useForceUpdate = () => useState()[1];
let rerender_courselist = null;

/* main */
const HomeView = ()=>{
    return (
        <div>
            <div id={"InsHomeView"} >
                <NavBarComponentPlaceHolder />
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
        <div className={"NavBarComponentPlaceHolder"}>
            <h2>Nav Bar Component Place Holder</h2>
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
        const dataUrl = "https://jsonplaceholder.typicode.com/users"; // fake api
        const dataToBeSend = {
            name: courseName,
        };
        setAddCourse(false);

        axios.post(dataUrl, {
            name: courseName,
            // NewCourseName: courseName,
            // UserId: 1,  // fake id
        }).then(res => {
            console.log("response received");
            console.log(res);
            rerender_courselist(null);
        })
    };

    if (addCourse)
        return (
            <div>
                <form className={"AddNewCourseArea"} onSubmit={handleAddNewCourse}>
                    <label htmlFor="courseName" className={"GuideUserLine"}>Please enter your new course: </label>
                    <input type="text" placeholder="Course Name" id="courseNameInput" name="courseName" onChange={e=>setCourseName(e.target.value)}/>
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

const CourseList = () =>{
    const [awaitingData,setAwaitingData] = useState(true);
    const [data,setData] = useState([]);
    const [isInstructor,setInstructor] = useState(false);
    const [_,updatefunc] = useState(null);
    rerender_courselist = updatefunc;

    useEffect(()=>{
        const fetchData = async () => {
            const dataUrl = "https://jsonplaceholder.typicode.com/todos"; // fake api
            const res = await axios.get(dataUrl).then(res=>{
                setData(res.data.slice(0,10));
                setAwaitingData(false);
            });
        };
        fetchData();
    },[]);
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
              {data.length>0?(data.map(e=>(
                  <Course key={e.id} title={e.title} courseId={e.id}/>
              ))):<h4 id={"noCourse"}>You are not affiliated to any course</h4>}
          </div>
          <InstructorControls isInstructor={isInstructor}/>
      </div>
    );
};

export {HomeView};
