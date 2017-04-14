import React from "react";
import axios from "axios";


export default class Login extends React.Component {

    renderWhenLoggedIn() {
        return (
            <div>
                <p>You are currently logged in.</p>

                <a href="/api/logout">Logout</a>

                <h2>User Settings</h2>
                <pre>{JSON.stringify(this.props.userSettings)}</pre>

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
        console.log(`I am the child rendering with ${JSON.stringify(this.props.userSettings)}`);

        return (
            <div className="gn-container">
                {this.props.userSettings.isLoggedIn ? this.renderWhenLoggedIn() : this.renderWhenLoggedOut() }
            </div>
        )


    }

}