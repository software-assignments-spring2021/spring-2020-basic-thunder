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
import {MembersListView} from './members_list_view'
import {useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import {AuthRequiredFilter} from "./AuthRequiredFilter";
import Syllabus from "./Syllabus";
import CreatePost from './CreatePost';
import {SettingsView} from "./settings_view";

function App() {

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/LoggedInHome" />
                    </Route>
                    <Route path={"/home"} component={NotLoggedInHomeView} />
                    <Route path="/sign-up" component={RegisterView} />
                    <Route path="/log-in" component={LoginView} />

                    <AuthRequiredFilter>
                        <Route path="/LoggedInHome" component={HomeView} />
                        <Route path="/:courseId/Forum/CreatePost" component={CreatePost} />
                        <Route path="/:courseId/Forum/:postId/post/ReplyPost" component={ReplyPostView}/>
                        <Route path="/:courseId/Forum/:postId/post" component={PostView}/>
                        <Route path="/:courseId/Forum" component={ListPostsView} />
                        <Route path="/:courseId/Syllabus" component={Syllabus} />
                        <Route path={"/:courseId/members-list"} component={MembersListView} />
                        <Route path={"/settings"} component={SettingsView} />
                    </AuthRequiredFilter>

                </Switch>
            </div>
        </Router>
    );
}

export default App;
