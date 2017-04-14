import React from "react";
import axios from "axios";

export default class Emails extends React.Component {

    constructor() {
        super();

        this.state = {
            subscriptions: []
        }

        axios.get(`/api/subscriptions`)
            .then((sub) => {
                this.state.subscriptions = sub;
            })
    }

    render() {
        return (
            <div className="gn-container">
                <h1>Email Notifications</h1>
                <p>This node is configured to send emails for: </p>
                {JSON.stringify(this.state.subscriptions)}
            </div>
        )
    }

}