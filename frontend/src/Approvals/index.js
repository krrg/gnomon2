import React from "react";
import axios from "axios";

export default class Approvals extends React.Component {

    constructor() {
        super();

        this.state = {
            timestamps: {}
        }
    }

    componentDidMount() {
        this.getSubscriptions().forEach(this.reloadTimestampsFor)
    }

    reloadTimestampsFor = (workerId) => {
        const timestampsPromise = axios.get(`/api/timestamps/${workerId}`)

        timestampsPromise.then((resp) => {
            const currentState = this.state;
            currentState.timestamps[workerId] = resp.data;
            this.setState(currentState);
        })

        timestampsPromise.catch((resp) => {
            const currentState = this.state;
            currentState.timestamps[workerId] = [];
            this.setState(currentState);
        })
    }

    getSubscriptions = () => {
        return this.props.userSettings.isLoggedIn ? this.props.userSettings.subscriptions : [];
    }

    handleNewSubscription = (e) => {
        e.preventDefault();
        if (! this.refs.workerId.value) {
            return;
        }

        axios.post('/api/userSubscriptions', {
            subscriptionId: this.refs.workerId.value
        }).then((resp) => {
            this.props.userSettings.requestReload();
        });
    }

    renderSubscriptions = (subscriptionIds) => {
        return subscriptionIds.map((sid) => {
            return (
                <div key={sid}>
                    <h3>Subscription ID: {sid}</h3>
                    {/*{JSON.stringify(this.state.timestamps[sid])}*/}
                    <ClockEventsTable 
                        jobid={jobid} 
                        timestamps={this.state.timestamps[jobid]}
                    />
                </div>
            )
        })
    }

    render() {
        console.log(this.props.userSettings);

        return (
            <div className="gn-container">
                <h1>Timesheet Approvals</h1>
                <p>You are currently subscribed to {this.getSubscriptions().length} workers.</p>
                <p>Your signing ID is: <b>{this.props.userSettings.signing_id}</b></p>
                <form>
                    <input ref='workerId' placeholder='Sender id' />
                    <button onClick={this.handleNewSubscription}>Subscribe to Worker</button>
                </form>
                <hr />

                {this.renderSubscriptions(this.getSubscriptions())}
            </div>
        )
    }

}