/*
This is the view for creating a post as displayed in this page:
https://github.com/nyu-software-engineering/spring-2020-basic-thunder/blob/master/ux-design/Wireframe-Forum%20Page_%20Create%20Post.png

There is the Biazza placement holder that Jiaqi already made so I can just reuse that
The hamburger menu in the same bar as Biazza which is just styling

For the rest of the page, I can just reuse a lot of the code for the Question function
in view_post_view.js

Then for the two buttons "submit" and "back", I can resue the PostReplyBtn and
BackToPostBtn code with minor modifications.

I might need to do some fake api call that will simulate adding a post to
the class's forum.
*/

import React, {useEffect, useState} from "react"
import "./styles/CreatePost.css"
import Hamburger from "./HamburgerMenu"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch, Redirect
} from "react-router-dom";
import axios from "axios";
import {LoadingView} from "./loading_view";
import {CourseBarComponent} from "./list_posts_view"
import {Header} from './header'

const BACKEND_IP = process.env.NODE_ENV === "production"? "http://204.48.25.3:5000" :"http://127.0.0.1:5000";


const NavBarComponentPlaceHolder = () => {
    return (
        <div className="biazza-header-title">
            <h2>Biazza</h2>
        </div>
    );
};

const CreatePost = () => {
	const postAs = ["Anonymous to Classmates", "Anonymous to Everyone"];
    const {courseId} = useParams();
    const api = `${BACKEND_IP}/${courseId}/Forum/CreatePost`; // backend api
	const [postId,setPostId] = useState(null);
	const [data,setData] = useState({course_name:null,username:null});


    useEffect(()=>{
        const fetchData = async () => {
            const accessToken = localStorage.getItem("access-token");
            const res = await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res=>{
                    setData(res.data);
                })
                .catch(err=>{
                    console.log(err);
                    window.location.reload(false);
                });
        };
        fetchData();
    },[]);



    const handleCreatePost = (e)=>{
        e.preventDefault();
        const title = e.target['inpt-question-title'].value;
        const content = e.target['inpt-question-content'].value;
		const postAs = e.target['show-my-name-selector'].value;
        const accessToken = localStorage.getItem("access-token");

        axios.post(api,
			{
				'title':title,
				'content': content,
                'post_as': postAs,
			},{headers: {"Authorization" : `Bearer ${accessToken}`}})
			.then(res=>{
				console.log('response data:',res.data);
        		setPostId(res.data['postid']);
        	})
			.catch(err=>{
				console.log(err);
				window.location.reload(false);
			});
    };

    if(data['course_name']===null) return <LoadingView />;

    else if(postId !== null) return <Redirect push to={`/${courseId}/Forum/${postId}/post`} />;

	return(
		<div id="create-post-container">
			<header className="biazza-header">
				<Header/>
			</header>
			<CourseBarComponent CourseName={data['course_name']} />
			<form onSubmit={handleCreatePost}>
				<section className="question-container">
					<input id="inpt-question-title" type="text" placeholder="Question Title" required={true}/>
					<textarea id="inpt-question-content" placeholder="Question Body" required={true}/>
				</section>
				<div className="post-as-container">
					<label className="show-my-name-label">Show my name as: </label>
					<select id="show-my-name-selector">
						<option>{data['username']}</option>
						<option>{postAs[0]}</option>
						<option>{postAs[1]}</option>
					</select>
				</div>
				<div id="submit-cancel-container">
					<Link to={`/${courseId}/forum`}>
						<button id="cancel-post-btn">Cancel</button>
					</Link>
					<button id="submit-post-btn">Submit</button>
				</div>
			</form>
		</div>
	);
};

export default CreatePost;
