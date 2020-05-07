import React, {useState} from 'react'
import './styles/RegisterView.css'
import {Link, Redirect} from "react-router-dom"
import {Header} from './home_view'
import axios from "axios";

const BACKEND_IP = process.env.NODE_ENV === "production"? "http://204.48.25.3:5000" :"http://127.0.0.1:5000";

const RegisterView = () => {
    return (
        <div className={'RegisterView'}>
            <div>
                <header>
                    <Link to="/home" id="logo">Biazza</Link>
                </header>
            </div>

            <div id="main">
                <div id="register">
                    <h2>SIGN UP</h2>
                    <SignUpForm/>
                </div>
            </div>

            <div>
                <footer>
                    <a href="https://github.com/nyu-software-engineering/spring-2020-basic-thunder">&copy; 2020 Biazza</a>
                </footer>
            </div>

        </div>
    )
};

const SignUpForm = (props) => {
    const [doneRegister,setDoneRegister] = useState(false);
    const [role,setRole] = useState('Student');
    const [registerErrMsg,setRegisterErrMsg] = useState(false);

    const handleClick = function(event) {
        event.preventDefault();
        const buttons = document.querySelectorAll('#buttons input');
        buttons.forEach((button) => {
            button.id = 'off'
        });
        event.target.id = 'on';
        setRole(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target);
        const email = e.target['email'].value;
        const pw = e.target['pass'].value;
        const firstname = e.target['firstname'].value;
        const lastname = e.target['lastname'].value;

        axios.post(`${BACKEND_IP}/register`,
            {
                email: email,
                firstname:firstname,
                lastname:lastname,
                password:pw,
                role:role,
            }
        ).then(res=>{
            // register success: store access token
            console.log("access-token:",res.data['access-token']);
            localStorage.setItem('access-token',res.data['access-token']);
            setDoneRegister(true);
        }).catch(err=>{
            // register failed
            localStorage.removeItem('access-token');
            setRegisterErrMsg(true);
            document.getElementById("pass").value = null;
        });
    };

    if (doneRegister){
        return <Redirect push to={`/LoggedInHome`} />;
    }
    return (
        <div>
            <ErrorMsg activate={registerErrMsg} />

            <form onSubmit={handleSubmit}>
                <div id="buttons">
                    <input id="on" type="button" value="Student" onClick={handleClick}/>
                    <input id="off" type="button" value="Instructor" onClick={handleClick}/>
                </div>

                <label>
                    <span>Email:</span>
                    <input type="email" name="email" id={"email"} required={true} className={"LoginRegisInputs"} />
                </label>

                <label>
                    <span>First Name:</span>
                    <input type="text" name="first_name" id={"firstname"} required={true} className={"LoginRegisInputs"}/>
                </label>

                <label>
                    <span>Last Name:</span>
                    <input type="text" name="last_name" id={"lastname"} required={true} className={"LoginRegisInputs"}/>
                </label>

                <label>
                    <span>Password:</span>
                    <input type="password" name="password" id={"pass"} required={true} minLength={3} className={"LoginRegisInputs"}/>
                </label>

                <input type="submit" value="Sign Up"/>

                <p>Already have an account?<br/>
                    <Link to="log-in" className={"LinkToLogin"}>
                        <span> Log In</span>
                    </Link>
                </p>
            </form>

        </div>
    )
};

const ErrorMsg = ({activate}) =>{
    if(activate){
        return (
            <div className={"RegisterErrMsgBlock"}>
                <h3>Register Failed</h3>
                This email has already been registered.
            </div>
        );
    }
    return null;
};


export {RegisterView}
