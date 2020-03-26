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

/*
schema
{
        'CourseName': course name (string),
        'ListOfPosts': an array of the post previews object
            [
                {
                    'topic':  post topic (string) ,
                    'preview': string first 122 characters of meessage,
                    'resolved': whether the post contains an official answer from the professor or marked by professor (boolean),
                    'postid': the id of the post (int),
                    'replies': number of repplies int
                },
                Example:
                 {
                    'topic': 'How to plot all learning rates on one plot',
                    'preview': "I've been getting erros with my python imports using the prince cluster for over an hour now. And at this point I am",
                    'resolved': True,
                    'postid': 6,
                    'replies': 4
                },

            ],
    }

 */

/* main */
const ListPostsView = ()=>{
    const {courseId} = useParams();
    const [data,setData] = useState({'CourseName':null, 'ListOfPosts':[]});
    useEffect(()=>{
        const fetchData = async () => {
            const api = `http://127.0.0.1:5000/${courseId}/Forum`; // testing api
            const res = await axios.get(api).then(res=>{
                setData(res.data);
            });
        };
        fetchData();
    },[]);
    if (data['CourseName'] === null)
        return (
            <LoadingView />
        );
    return (
        <div>
            <header className="biazza-header">
                <Hamburger />
                <NavBarComponentPlaceHolder />
            </header>
            <CourseBarComponent CourseName={data['CourseName']} />
            <div  className={"PostPreviewContainer"}>
                {data['ListOfPosts'].map(props=>(<PostPreview key={props.postid} preview={props['preview']} replies={props.replies} resolved={props['resolved']} topic={props.topic} postid={props.postid}/>))}
            </div>
            <Link to={`/${courseId}/Forum/CreatePost`} className={"AddPostContainer"}>
                <button id={"AddPostBtn"}>Add Post</button>
            </Link>
        </div>
    );
};

const CourseBarComponent = ({CourseName})=>{
    return (
        <h2 className={"Forum"}>Forum: {CourseName}</h2>
    );
};

const PostPreview = (props)=>{
    let { path, url } = useRouteMatch();

    const preview = props['preview'];
    const replies = props.replies;
    const resolved = props['resolved'];
    const topic = props.topic;
    const postid = props.postid;
    /*
    need to add this property to link: component={post}
     */

    return (
        <div>
            <div className={`PostPreviewDetail ${resolved}`}>
                <Link to={`${url}/${postid}/post`}>
                    <div className={"PostTopicHeader"}>
                        <div className={"PostTopic"}>{topic}</div> <div className={"ReplyInfo"}>[Replies: {replies}]</div>
                    </div>
                    <div className={"PostTopicContent"}>
                        <div className={"PostPreview"}>
                            {preview}
                        </div>
                        <div className={"PostStatusIconContainer"}>
                            {resolved? <img className={"PostStatusIcon"} src={resolvedImg}/>:<img className={"PostStatusIcon"} src={unresolvedImg}/>}
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
    // return (
    //     <div className={"NavBarComponentPlaceHolder"}>
    //         <h2>Nav Bar Place Holder</h2>
    //     </div>
    // );
};

export {ListPostsView,CourseBarComponent};
