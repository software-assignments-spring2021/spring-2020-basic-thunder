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

/* main */
const ReplyPostView = () =>{
    const {courseId,postId} = useParams();
    const [awaitingData,setAwaitingData] = useState(true);
    const [myId,setMyId] = useState(201); // current user's id (mock data)
    const [data,setData] = useState({'CourseName':null, 'ListOfPosts':[]});
    const [instructorMode,setInstructorMode] = useState(false); // assuming we are not the instructor
    const [goToPost,setGoToPost] = useState(false);
    const api = `http://127.0.0.1:5000/${courseId}/Forum/${postId}/post/ReplyPost`; // testing api
    const postUrl = `http://locohost:3000/${courseId}/Forum/${postId}/post`; // temp url
    const [postAsOptions,setPostAsOptions] = useState([]);
    const [authorName,setAuthorName] = useState(null);



    useEffect(()=>{
        const fetchData = async () => {
            const res = await axios.get(api).then(res=>{
                setData(res.data);
                setAuthorName("Jiaqi"); // mock data
                //setPostAsOptions
                setPostAsOptions(["Jiaqi","Anonymous To Classmates","Anonymous To Everyone"]); // mock data
                setAwaitingData(false);

            });
        };
        fetchData();
    },[]);


    const handleReplyPost = (e)=>{
        e.preventDefault();
        console.log(e.target['ReplyTextArea'].value);
        axios.post(api,{'reply':e.target['ReplyTextArea'].value}).then(res=>{
            setGoToPost(true);
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
            <div className={"PostDetailContainer"}>
                <Question postid={data['postid']} topic={data['topic']} content={data['content']} time={data['time']}
                          author={data['author']} resolved={data['resolved']}/>
                <form onSubmit={handleReplyPost}>
                    <textarea id={"ReplyTextArea"} />
                    <div className={"PostAsContainer"}>
                        <label className={"ShowMyNameLabel"}>Show my name as:</label>
                        <select id="ShowMyNameSelector" defaultValue={authorName}>
                            {postAsOptions.map(e=>(<option className={"ShowMyNameOption"} value={e}>{e}</option>))}
                        </select>
                    </div>
                    <div className={"PostReplyBtnContainer"} >
                        <PostReplyBtn type={"submit"}/>
                    </div>
                </form>
                <BackToPostBtn />
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
