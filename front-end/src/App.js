import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/loggedInHomeView.css'
import './logged_in_home_view'
import {HomeView} from "./logged_in_home_view";
import {ListPostsView} from "./list_posts_view"
import {PostView} from "./view_post_view"
import {ReplyPostView} from "./reply_post_view"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import CreatePost from './CreatePost'
// <Route path="/:courseId/Forum/CreatePost" component={CreatePost} />
// <Route path="/CreatePost" component={CreatePost} />

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/LoggedInHome/" component={HomeView} />
                    <Route path="/:courseId/Forum/:postId/post/ReplyPost" component={ReplyPostView}/>
                    <Route path="/:courseId/Forum/:postId/post" component={PostView}/>
                    <Route path="/:courseId/Forum" component={ListPostsView} />
                    <Route path="/CreatePost" component={CreatePost} />
                </Switch>
            </div>
        </Router>
    );
}

// export default App;
export default App;
