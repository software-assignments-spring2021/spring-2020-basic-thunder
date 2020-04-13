import React, {useEffect, useState} from 'react';
import {useParams,Redirect} from "react-router";
import axios from "axios";
import {LoadingView} from "./loading_view";
import {Question} from "./view_post_view"
import "./styles/ReplyPostView.css"
import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
    Link,
//     useParams,
//     useRouteMatch,
//     Redirect
} from "react-router-dom";
import Hamburger from "./HamburgerMenu";
import {CourseBarComponent, NavBarComponentPlaceHolder} from "./list_posts_view";

/* main */
const ReplyPostView = () =>{
    const {courseId,postId} = useParams();
    const [awaitingData,setAwaitingData] = useState(true);
    const [data,setData] = useState({'CourseName':null, 'ListOfPosts':[]});
    const [goToPost,setGoToPost] = useState(false);
    const api = `http://127.0.0.1:5000/${courseId}/Forum/${postId}/post/ReplyPost`; // testing api
    const postUrl = `http://locohost:3000/${courseId}/Forum/${postId}/post`; // temp url
    const postAsOptions = ["Anonymous to Classmates","Anonymous to Everyone"];
    const [authorName,setAuthorName] = useState(null);



    useEffect(()=>{
        const fetchData = async () => {
            const accessToken = localStorage.getItem("access-token");
            const res = await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res=>{
                    setData(res.data);
                    setAuthorName(res.data['author_name']); // mock data
                    setAwaitingData(false);
                })
                .catch(err=>{
                    console.log(err);
                    window.location.href = '/LoggedInHome';
                });
        };
        fetchData();
    },[]);


    const handleReplyPost = (e)=>{
        e.preventDefault();
        console.log(e.target['ReplyTextArea'].value);
        const accessToken = localStorage.getItem("access-token");
        axios.post(api,{
            'reply':e.target['ReplyTextArea'].value,
            'post_as':e.target['ShowMyNameSelector'].value
        },{headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then(res=>{
                setGoToPost(true);
            })
            .catch(e=>{
                console.log(e);
                window.location.href = '/LoggedInHome';
            });
    };

    if (awaitingData)
        return (
            <LoadingView />
        );
    else if(goToPost){
        return <Redirect push to={`/${courseId}/Forum/${postId}/post`} />
    }
    else{
        return (
            <div>
                <header className="biazza-header">
                    <Hamburger />
                    <NavBarComponentPlaceHolder />
                </header>
                <CourseBarComponent CourseName={data['CourseName']} />
                <div className={"PostDetailContainer"}>
                    <Question postid={data['postid']} topic={data['topic']} content={data['content']} time={data['time']}
                              author={data['author']} resolved={data['resolved']}/>
                    <form onSubmit={handleReplyPost}>
                        <textarea id={"ReplyTextArea"} required={true} placeholder={"Answer Body"}/>
                        <div className={"PostAsContainer"}>
                            <label className={"ShowMyNameLabel"}>Show my name as:</label>
                            <select id="ShowMyNameSelector" defaultValue={authorName}>
                                <option className={"ShowMyNameOption"} value={authorName}>{authorName}</option>
                                {!data['is_instructor']? postAsOptions.map(e=>(<option className={"ShowMyNameOption"} value={e}>{e}</option>)):null}
                            </select>
                            {data['is_instructor']?<p>Instructor cannot reply anonymously.</p>:null}
                        </div>
                        <div className={"PostReplyBtnContainer"} >
                            <PostReplyBtn type={"submit"}/>
                        </div>
                    </form>
                    <BackToPostBtn />
                </div>
            </div>
        );
    }
};

const PostReplyBtn = ()=>{
  return(
      <button className={"PostReplyBtn"}>
        Submit
      </button>
  )
};

const BackToPostBtn = ()=>{
    const {courseId,postId} = useParams();
    return (
        <div className={"BackBtnContainer"}>
            <Link to={`/${courseId}/Forum/${postId}/post`}>
                <div className={"BackToForumBtn"}>
                    Back
                </div>
            </Link>
        </div>
    );
};

export {ReplyPostView};
