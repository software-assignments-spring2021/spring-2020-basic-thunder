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


/* main */
const PostView = () =>{
    const {courseId,postId} = useParams();
    const [awaitingData,setAwaitingData] = useState(true);
    const [myId,setMyId] = useState(100); // current user's id (mock data)
    const [data,setData] = useState({'CourseName':null, 'ListOfPosts':[]});
    const [instructorMode,setInstructorMode] = useState(false); // assuming we are the instructor

    useEffect(()=>{
        const fetchData = async () => {
            const api = `http://127.0.0.1:5000/${courseId}/Forum/${postId}/post`; // testing api
            const res = await axios.get(api).then(res=>{
                setData(res.data);
                setAwaitingData(false);
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
            <div className={"PostDetailContainer"}>
                <Question postid={data['postid']} topic={data['topic']} content={data['content']} time={data['time']}
                          author={data['author']} resolved={data['resolved']}/>
                {data['reply_details']
                    .filter(e => e['is_official_ans'])
                    .map(e => <OfficialAnswer author={e["author"]} time={e['time']} content={e['content']} />
                )}
                {data['reply_details'].length > 1? <div className={"AnswerHeader"} id={"StudentAnswerHeader"}>the students' answers (sorted by votes)</div>:<span></span>}
                {data['reply_details']
                    .filter(e => !e['is_official_ans'])
                    .map(e => <StudentAnswer authorId={e['authorId']} myId={myId} instructorMode={instructorMode} has_voted={e['has_voted']} reply_id={e['reply_id']} author={e["author"]} time={e['time']} content={e['content']} up_vote={e['up_vote']} down_vote={e['down_vote']} />
                    )}
                <AddReplyBtn />
                <BackToForumBtn />
            </div>
        );
    }

    else if (data['reply_details'].length>0){
        return (
            <div className={"PostDetailContainer"}>
                <Question postid={data['postid']} topic={data['topic']} content={data['content']} time={data['time']} author={data['author']} resolved={data['resolved']}/>
                <div className={"AnswerHeader"} id={"StudentAnswerHeader"}>the students' answers (sorted by votes)</div>
                {data['reply_details']
                    .filter(e => !e['is_official_ans'])
                    .map(e => <StudentAnswer authorId={e['authorId']} myId={myId} instructorMode={instructorMode} has_voted={e['has_voted']} reply_id={e['reply_id']} author={e["author"]} time={e['time']} content={e['content']} up_vote={e['up_vote']} />
                    )}
                <AddReplyBtn />
                <BackToForumBtn />
            </div>
        );
    }

    else{
        return (
            <div className={"PostDetailContainer"}>
                <Question postid={data['postid']} topic={data['topic']} content={data['content']} time={data['time']} author={data['author']} resolved={data['resolved']}/>
                This question has not been answered.
                <AddReplyBtn />
                <BackToForumBtn />
            </div>
        );
    }
};


const StudentAnswer = ({myId,authorId,instructorMode,reply_id,author,time,content,up_vote,has_voted})=>{
    const [upvote,setUpvote] = useState(up_vote);
    const [hasVoted,setHasVoted] = useState(has_voted);

    const upVoteHandler = (e)=>{
        e.preventDefault();
        setUpvote(upvote+1);
        setHasVoted(!hasVoted);
        // send add vote request to backend
    };

    const cancelUpVoteHandler = (e)=>{
        e.preventDefault();
        setUpvote(upvote-1);
        setHasVoted(!hasVoted);
        // send decrease vote request to backend
    };


    if (hasVoted){
        return (
            <div className={"StudentAnswerContainer"}>
                <div className={"content"}>{content}</div>
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
                    <EditBtn reply_id={reply_id} myId={myId} authorId={authorId} />
                    <DeleteBtn reply_id={reply_id} instructorMode={instructorMode} />

                </div>
                <BottomInfo time={time} author={author} />
            </div>
        )
    }
    return (
        <div className={"StudentAnswerContainer"}>
            <div className={"content"}>{content}</div>

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
                <EditBtn reply_id={reply_id} myId={myId} authorId={authorId} />
                <DeleteBtn reply_id={reply_id} instructorMode={instructorMode} />

            </div>
            <BottomInfo time={time} author={author} />
        </div>
    );
};

const DeleteBtn = ({reply_id,instructorMode}) =>{
    const {courseId,postId} = useParams();
    const [deleted,setRerender] = useState(false);
    const sendDeleteReplyRequest = (_)=>{
        const api = `http://127.0.0.1:5000/${courseId}/Forum/${postId}/post/${reply_id}/DeleteReply`; // testing api
        const res = axios.delete(api).then(res=>{
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

const EditBtn = ({myId,authorId,reply_id})=>{
    let { _, url } = useRouteMatch();
    if (myId === authorId)
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

const OfficialAnswer = ({author,time,content})=>{
    return (
        <div className={"OfficialAnswerContainer"}>
            <div id={'OfficialAnswerHeader'} className={"AnswerHeader"}>the instructors' answer</div>
            <div className={"content"}>{content}</div>
            <BottomInfo time={time} author={author} />
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
    const {courseId} = useParams();
    return (
        <div className={"BackBtnContainer"}>
            <Link to={`${courseId}/Forum`}>
                <div className={"BackToForumBtn"}>
                        Back
                </div>
            </Link>
        </div>
    )
};

export {PostView,Question,BackToForumBtn}
