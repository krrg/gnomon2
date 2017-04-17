import React from "react";
import axios from "axios";

export default class Emails extends React.Component {

    constructor() {
        super();

        this.state = {
            subscriptions: []
        }

    }

    componentDidMount() {
        axios.get(`/api/subscriptions`)
            .then((resp) => {
                this.setState({
                    subscriptions: resp.data
                })
            })
    }

    handleNewSubscription = () => {
        axios.post(`/api/subscriptions`, {
            'senderId': this.refs.senderId.value,
            'workerId': this.refs.workerId.value
        })
    }

    renderSubscriptionForm = () => {
        return (
            <div>
                <form>
                    <input type='text' ref='senderId' placeholder='senderId' />
                    <input type='text' ref='workerId' placeholder='workerId' />
                    <button onClick={this.handleNewSubscription}>Send me email updates!</button>
                </form>
            </div>
        )
    }

    renderSubscriptionList = () => {
        return this.state.subscriptions.map((subscription) => {
            return (
                <div>
                    Worker ID: {subscription.workerId}
                    &nbsp;
                    Sender ID: {subscription.senderId}
                </div>
            )
        })
    }

    render() {
        return (
            <div className="gn-container">
                <h1>Email Notifications</h1>
                <p>This node is configured to send emails for: </p>
                {this.renderSubscriptionForm()}
                <hr />
                {this.renderSubscriptionList()}

            </div>
        )
    }

}