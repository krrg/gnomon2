import React from "react";
import axios from "axios";


export default class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            userSettings: null
        }

        this.loadUserSettings();
    }

    loadUserSettings = () => {
        const promiseResponse = axios.get("/api/userSettings")

        promiseResponse.then((resp) => {
            this.setState({
                userSettings: resp.data
            })
        });

        promiseResponse.catch((errResp) => {
            this.setState({
                userSettings: null
            })
        });
    }

    renderEmailAddress() {

    }

    renderWhenLoggedIn() {
        return (
            <div>
                You are currently logged in.

                <a href="/api/logout">Logout</a>

                <h2>User Settings</h2>
                <pre>{JSON.stringify(this.state.userSettings)}</pre>

            </div>
            

        )
    }

    renderWhenLoggedOut() {
        return (
            <div>
                <h1>Login</h1>

                <div>
                    <h2>Login through SSO</h2>
                    <a href="/api/login">Google</a>
                </div>

                <div>
                    <h2>Login through Debug Backdoor</h2>
                    <p>Cross-site Request Forgers please use this</p>
                    <form ref='login-backdoor' method='get' action='/api/login'>
                        <input type='text' name='email' placeholder="email@example.com"/>
                        <button type='submit'>Backdoor Login</button>
                    </form>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="gn-container">
                {this.state.userSettings ? this.renderWhenLoggedIn() : this.renderWhenLoggedOut() }
            </div>
        )


    }

}