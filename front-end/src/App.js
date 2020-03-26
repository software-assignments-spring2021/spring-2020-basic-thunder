import React from 'react';
import logo from './logo.svg';
import './styles/App.css';
import './logged_in_home_view'
import {HomeView} from "./logged_in_home_view";
import {ListPostsView} from "./list_posts_view"
import {PostView} from "./view_post_view"
import {ReplyPostView} from "./reply_post_view"
import {NotLoggedInHomeView} from './home_view'
import {LoginView} from './login_view'
import {RegisterView} from './register_view'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Syllabus from "./Syllabus"
import CreatePost from './CreatePost'

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path={"/home"} component={NotLoggedInHomeView} />
                    <Route path="/sign-up" component={RegisterView} />
                    <Route path="/log-in" component={LoginView} />
                    <Route path="/LoggedInHome/" component={HomeView} />
                    <Route path="/:courseId/Forum/CreatePost" component={CreatePost} />
                    <Route path="/:courseId/Forum/:postId/post/ReplyPost" component={ReplyPostView}/>
                    <Route path="/:courseId/Forum/:postId/post" component={PostView}/>
                    <Route path="/:courseId/Forum" component={ListPostsView} />
                    <Route path="/:courseId/Syllabus" component={Syllabus} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
