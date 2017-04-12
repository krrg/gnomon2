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
                    <form>
                        <input type='text' name='email' placeholder="email@example.com"/>
                        <button type='submit'>Backdoor Login</button>
                    </form>
                </div>
            </div>
        )
    }

}