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
import resolvedImg from "./img/resolved.png"
import unresolvedImg from "./img/unresolved.png"
import {LoadingView} from "./loading_view"
import './styles/ListPostView.css'
import Hamburger from './HamburgerMenu'
import SubNav from "./SubNav.js"

const BACKEND_IP = process.env.NODE_ENV === "production"? "http://204.48.25.3:5000" :"http://127.0.0.1:5000";

/* main */
const ListPostsView = ()=>{
    const {courseId} = useParams();
    const [data,setData] = useState({'CourseName':null, 'ListOfPosts':[]});
    useEffect(()=>{
        const fetchData = async () => {
            const api = `${BACKEND_IP}/${courseId}/Forum`; // testing api
            const accessToken = localStorage.getItem("access-token");
            const res = await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res=>{
                    setData(res.data);
                })
                .catch(err=>{
                    console.log(err);
                    window.location.href = '/LoggedInHome';
                });
        };
        fetchData();
    },[]);
    if (data['CourseName'] === null)
        return (
            <LoadingView />
        );
    // console.log(typeof(parseInt(courseId)))
    return (
        <div className="ForumView">
            <header className="biazza-header">
                <Hamburger />
                <NavBarComponentPlaceHolder />
            </header>
            <SubNav courseId={parseInt(courseId)} current={"forums"}/>
            <CourseBarComponent CourseName={data['CourseName']} />
            <div  className={"PostPreviewContainer"}>
                {
                    data['ListOfPosts'].length > 0 ?
                        data['ListOfPosts'].reverse().map(props=>(<PostPreview key={props.postid} postid={props.post_id}/>))
                        :"This forum has no post yet."
                }
            </div>
            <Link to={`/${courseId}/Forum/CreatePost`} className={"AddPostContainer"}>
                <button id={"AddPostBtn"}>Add Post</button>
            </Link>
        </div>
    );
};

const CourseBarComponent = ({CourseName})=>{
    return (
        <h2 className={"ForumHeader"}>Forum: {CourseName}</h2>
    );
};

const PostPreview = (props)=>{
    let { path, url } = useRouteMatch();
    const postid = props.postid;

    const {courseId} = useParams();
    const [data,setData] = useState({'preview':null,'replies':null,'resolved':null,'topic':null});
    useEffect(()=>{
        const fetchData = async () => {
            const api = `${BACKEND_IP}/${courseId}/Forum/${postid}/PostPreview`; // backend api
            const accessToken = localStorage.getItem("access-token");
            const res = await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res=>{
                    setData(res.data);
                })
                .catch(err=>{
                    console.log(err);
                    window.location.href = '/LoggedInHome';
                });
        };
        fetchData();
    },[]);
    if(data.resolved === null){
        return null;
    }
    return (
        <div>
            <div className={`PostPreviewDetail ${data.resolved}`}>
                <Link to={`${url}/${postid}/post`}>
                    <div className={"PostTopicHeader"}>
                        <div className={"PostTopic"}>{data.topic}</div> <div className={"ReplyInfo"}>[Replies: {data.replies}]</div>
                    </div>
                    <div className={"PostTopicContent"}>
                        <div className={"PostPreview"}>
                            {data.preview}
                        </div>
                        <div className={"PostStatusIconContainer"}>
                            {data.resolved? <img className={"PostStatusIcon"} src={resolvedImg}/>:<img className={"PostStatusIcon"} src={unresolvedImg}/>}
                        </div>
                    </div>
                </Link>
            </div>
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

export {ListPostsView,CourseBarComponent,NavBarComponentPlaceHolder};
