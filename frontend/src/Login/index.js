import React from "react";

export default class Login extends React.Component {

    render() {
        return (
            <div>
                <h1>Login</h1>

                <div>
                    <h2>Login through SSO</h2>
                    <a href="#">Google</a>
                </div>

                <div>
                    <h2>Login through Debug Backdoor</h2>
                    <a href="#">Debug Backdoor</a>
                </div>
            </div>
        )
    }

}