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

import React from "react"
import "./styles/CreatePost.css"
import Hamburger from "./HamburgerMenu"

const NavBarComponentPlaceHolder = () => {
    return (
        <div className="NavBarComponentPlaceHolder">
            <h2>Biazza</h2>
        </div>
    );
}

const QuestionTitle = () => {
	return (
		<input id="inpt-question-title" type="text" placeholder="Question Title?"/>
	);
}

const QuestionContent = () => {
	return(
		<input id="inpt-question-content" type="text" placeholder="Body text"/>
	);
}

const CreatePost = () => {
	const postAs = ["Mock User", "Anonymous to Classmates", "Anonymous to Everyone"];

	return(
		<div id="create-post-container">
			<header>
				<Hamburger />
				<NavBarComponentPlaceHolder />
			</header>
			<section className="question-container">
				<input id="inpt-question-title" type="text" placeholder="Question Title?"/>
				<textarea id="inpt-question-content" placeholder="Body text"/>
			</section>
            <div className="post-as-container">
                <label className="show-my-name-label">Show my name as:</label>
                <select id="show-my-name-selector">
                    <option>{postAs[0]}</option>
                    <option>{postAs[1]}</option>
                    <option>{postAs[2]}</option>
                </select>
            </div>
            <div id="submit-cancel-container">
            	<button id="cancel-post-btn">Cancel</button>
            	<button id="submit-post-btn">Submit</button>
            </div>
		</div>
	);
}

export default CreatePost;