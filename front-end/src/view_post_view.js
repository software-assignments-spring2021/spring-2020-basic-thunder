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
import {LoadingView} from "./loading_view"
import "./styles/ViewPostView.css"
import resolvedImg from "./img/resolved.png"
import unresolvedImg from "./img/unresolved.png"
import upward from "./img/Upward.png"
import editicon from "./img/editicon.png"
import deleteicon from "./img/deleteicon.png"
import Hamburger from "./HamburgerMenu";
import {CourseBarComponent, NavBarComponentPlaceHolder} from "./list_posts_view"

const BACKEND_IP = process.env.NODE_ENV === "production"? "http://204.48.25.3:5000" :"http://127.0.0.1:5000";

/* main */
const PostView = () =>{
    const {courseId,postId} = useParams();
    const [awaitingData,setAwaitingData] = useState(true);
    const [data,setData] = useState({'CourseName':null, 'ListOfPosts':[],'myId':null});
    const [instructorMode,setInstructorMode] = useState(false); // assuming we are the instructor

    useEffect(()=>{
        const fetchData = async () => {
            const accessToken = localStorage.getItem("access-token");
            const api = `${BACKEND_IP}/${courseId}/Forum/${postId}/post`; // testing api
            const res = await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res=>{
                    res.data['reply_details'].sort((a,b)=>b.upvote-a.upvote);
                    setData(res.data);
                    setAwaitingData(false);
                }).catch(err=>{
                    console.log(err);
                    window.location.href = '/LoggedInHome';
                });
        };
        fetchData();
    },[]);


    if (awaitingData)
        return (
            <LoadingView />
        );
    else if (data['resolved']) {
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
                    <div className={"OfficialAnswerContainer"}>
                        <div id={'OfficialAnswerHeader'} className={"AnswerHeader"}>the instructors' answer</div>
                        {data['reply_details']
                            .filter(e => e['is_official_ans'])
                            .map(e => <OfficialAnswer key={e['reply_id']} reply_id={e['reply_id']} />
                        )}
                    </div>
                    {data['reply_details'].filter(e => !e['is_official_ans']).length > 0? <div className={"AnswerHeader"} id={"StudentAnswerHeader"}>the students' answers (sorted by votes)</div>:<span></span>}
                    {data['reply_details']
                        .filter(e => !e['is_official_ans'])
                        .map(e => <StudentAnswer key={e['reply_id']} reply_id={e['reply_id']} />
                        )}
                    <AddReplyBtn />
                    <BackToForumBtn />
                </div>
            </div>
        );
    }

    else if (data['reply_details'].length>0){
        return (
            <div>
                <header className="biazza-header">
                    <Hamburger />
                    <NavBarComponentPlaceHolder />
                </header>
                <CourseBarComponent CourseName={data['CourseName']} />
                <div className={"PostDetailContainer"}>
                    <Question postid={data['postid']} topic={data['topic']} content={data['content']} time={data['time']} author={data['author']} resolved={data['resolved']}/>
                    <div className={"AnswerHeader"} id={"StudentAnswerHeader"}>the students' answers (sorted by votes)</div>
                    {data['reply_details']
                        .filter(e => !e['is_official_ans'])
                        .map(e => <StudentAnswer key={e['reply_id']} reply_id={e['reply_id']} />
                        )}
                    <AddReplyBtn />
                    <BackToForumBtn />
                </div>
            </div>
        );
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
                    <Question postid={data['postid']} topic={data['topic']} content={data['content']} time={data['time']} author={data['author']} resolved={data['resolved']}/>
                    This question has not been answered.
                    <AddReplyBtn />
                    <BackToForumBtn />
                </div>
            </div>
        );
    }
};


const StudentAnswer = ({reply_id})=>{
    const [upvote,setUpvote] = useState(0);
    const [hasVoted,setHasVoted] = useState(false);
    // const [isMyReply,setIsMyReply] = useState(false);
    // const [instructorMode,setInstructorMode] = useState(false);
    const [data,setData] = useState({});
    const [awaitingData,setAwaitingData] = useState(true);
    const {courseId,postId} = useParams();

    /*
    data has
    1. has_voted (bool) -
    2. upvote_count (Number)
    3. is_my_reply (bool)
    4. instructor_mode (bool) ?
    5. time (Number)
    6. content (String) -
    7. author
     */

    useEffect(()=>{
        const fetchData = async () => {
            const accessToken = localStorage.getItem("access-token");
            const api = `${BACKEND_IP}/${courseId}/course/${reply_id}/reply-detail`;
            await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res=>{
                    setData(res.data);
                    setUpvote(res.data['upvote_count']);
                    setHasVoted(res.data['has_voted']);
                    setAwaitingData(false);
                }).catch(err=>{
                    console.log(err);
                });
        };

        fetchData();
    },[upvote]);

    const upVoteHandler = (e)=>{
        e.preventDefault();
        const accessToken = localStorage.getItem("access-token");
        const api = `${BACKEND_IP}/${reply_id}/add-upvote`;
        axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then(res=>{
                setUpvote(res.data.upvote);
                setHasVoted(res.data.hasVoted);
            })
            .catch(err=>{
                console.log(err);
            });
    };

    const cancelUpVoteHandler = (e)=>{
        e.preventDefault();
        const accessToken = localStorage.getItem("access-token");
        const api = `${BACKEND_IP}/${reply_id}/cancel-upvote`;
        axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then(res=>{
                setUpvote(res.data.upvote);
                setHasVoted(res.data.hasVoted);
            })
            .catch(err=>{
                console.log(err);
            });
    };

    if(awaitingData) return null;

    else if (data['has_voted']){
        return (
            <div className={"StudentAnswerContainer"}>
                <div className={"content"}>{data['content']}</div>
                <div className={"FunctionContainer"}>
                    <div className={`UpVoteContainer NoVote`} onClick={cancelUpVoteHandler}>
                        <span className={`UpVoteImgContainer`}>
                            <img className={"UpVoteImg"} src={upward}/>
                        </span>
                            <span className={"UpVoteCount"}>
                            <span className={"UpvoteText"}>Upvote </span>
                                {upvote}
                        </span>
                    </div>
                    {/*<EditBtn is_my_reply={data['is_my_reply']} reply_id={reply_id} />*/}
                    <DeleteBtn reply_id={reply_id} instructorMode={data.instructor_mode} />

                </div>
                <BottomInfo time={data.time} author={data.author} />
            </div>
        )
    }
    return (
        <div className={"StudentAnswerContainer"}>
            <div className={"content"}>{data['content']}</div>

            <div className={"FunctionContainer"}>
                <div className={`UpVoteContainer`} onClick={upVoteHandler}>
                    <span className={`UpVoteImgContainer`}>
                        <img className={"UpVoteImg"} src={upward}/>
                    </span>
                    <span className={"UpVoteCount"}>
                        <span className={"UpvoteText"}>Upvote </span>
                        {upvote}
                    </span>
                </div>
                {/*<EditBtn is_my_reply={data['is_my_reply']} reply_id={reply_id} />*/}
                <DeleteBtn reply_id={reply_id} instructorMode={data.instructor_mode} />

            </div>
            <BottomInfo time={data.time} author={data.author} />
        </div>
    );
};

const DeleteBtn = ({reply_id,instructorMode}) =>{
    const {courseId,postId} = useParams();
    const [deleted,setRerender] = useState(false);
    const sendDeleteReplyRequest = (_)=>{
        const api = `${BACKEND_IP}/${courseId}/Forum/${postId}/post/${reply_id}/DeleteReply`; // testing api
        const accessToken = localStorage.getItem("access-token");

        //debug
        const res = axios.delete(api,{headers: {"Authorization" : `Bearer ${accessToken}`}}).then(res=>{
            window.location.reload(false);
        });
    };

    if(instructorMode)
        return(
            <div className={"ReplyFunctionContainer DeleteContainer"} onClick={sendDeleteReplyRequest}>
                <span>
                    <img src={deleteicon} className={"DeleteImg"} />
                </span>
                <span className={"EditTextContainer DeleteText"}>Delete</span>
            </div>
        );
    return null;
};

const EditBtn = ({is_my_reply,reply_id})=>{
    let { _, url } = useRouteMatch();
    if (is_my_reply)
        /*{<Link to={`${url}/${reply_id}/EditReply`} className={"ReplyFunctionContainer"}>}*/
        return(
            <Link to={`${url}/ReplyPost`} className={"ReplyFunctionContainer"}>
                <span>
                    <img src={editicon} className={"EditImg"} />
                </span>
                <span className={"EditTextContainer"}>Edit</span>
            </Link>
        );
    return null;
};

const OfficialAnswer = ({reply_id})=>{
    const {courseId,postId} = useParams();
    const [data,setData] = useState({});
    const [awaitingData,setAwaitingData] = useState(true);
    /*
    data has
    1. has_voted (bool) -
    2. upvote_count (Number)
    3. is_my_reply (bool)
    4. instructor_mode (bool) ?
    5. time (Number)
    6. content (String) -
    7. author
     */
    useEffect(()=>{
        const fetchData = async () => {
            const accessToken = localStorage.getItem("access-token");
            const api = `${BACKEND_IP}/${courseId}/course/${reply_id}/reply-detail`;
            await axios.get(api,{headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then(res=>{
                    setData(res.data);
                    setAwaitingData(false);
                }).catch(err=>{
                    console.log(err);
                });
        };

        fetchData();
    },[]);
    if(awaitingData) return null;
    return (
        <div>
            <div className={"content"}>{data.content}</div>
            <BottomInfo time={data.time} author={data.author} />
        </div>
    );
};

const Question = (props) =>{
    const topic = props['topic'];
    const content = props['content'];
    const time = props['time'];
    const author = props['author'];
    const resolved = props['resolved']?"problemSolved":"problemNotSolved";
    const postId = props['postid'];

    return (
        <div className={"QuestionContainer"}>
            <div className={`QuestionHeader`}>
                Question @{postId}
            </div>
            <div id={`QuestionTopic`} className={resolved}>{topic}</div>
            <div className={"content"}>{content}</div>
            <BottomInfo time={time} author={author} />
        </div>
    )
};

const BottomInfo = ({time,author})=>{
    const date = new Date(time).toDateString();
    return(
        <div className={"BottomInfo"}>
            <span className={"author"}>
                <span className={"AuthorLabel"}> Author: </span>{author}
            </span>
            <span className={"date"}>
                {date}
            </span>
        </div>
    );
};

const AddReplyBtn = ()=>{
    let { _, url } = useRouteMatch();

    return(
        <Link className={"AddReplyBtn"} to={`${url}/ReplyPost`} >Reply</Link>
  );
};

const BackToForumBtn = ()=>{
    const {courseId,postId} = useParams();
    return (
        <div className={"BackBtnContainer"}>
            <Link to={`/${courseId}/Forum`}>
                <div className={"BackToForumBtn"}>
                        Back
                </div>
            </Link>
        </div>
    );
};

export {PostView,Question}
