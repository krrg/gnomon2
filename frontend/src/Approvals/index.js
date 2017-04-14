import React from "react";
import axios from "axios";

import ClockEventsTable from "../Timesheet/ClockEventsTable";

export default class Approvals extends React.Component {

    constructor() {
        super();

        this.state = {
            timestamps: {},
            approvedMessageIds: {}
        }
    }


    renderClockEventRow() {

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

            resp.data.forEach((stamp) => {
                this.reloadApprovalFor(stamp.message_id);
            })
        })

        timestampsPromise.catch((resp) => {
            const currentState = this.state;
            currentState.timestamps[workerId] = [];
            this.setState(currentState);
        })
    }

    reloadApprovalFor = (messageId) => {
        axios.get(`/api/timestamps/${messageId}/isSigned`)
            .then((resp) => {
                const currentState = this.state;
                currentState.approvedMessageIds[messageId] = resp.data.signed;
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

    isApproved = (messageId) => {
        return this.state.approvedMessageIds[messageId];
    }

    approveTimestamp = (messageId, workerId) => {
        return axios.post(`/api/timestamps/${messageId}/sign`, {
            "senderId": workerId
        })
        .then((stamp) => {
            this.reloadApprovalFor(messageId); // We can't rely on the error codes coming back
        })
    }

    customRenderTimestampRow = (workerId, clockIn, clockOut) => {
        console.log(this.state);

        const clockInDate = clockIn ? new Date(clockIn.timestamp).toTimeString() : null;
        const clockOutDate = clockOut ? new Date(clockOut.timestamp).toTimeString() : null;
        
        const approved = clockIn && clockOut && this.isApproved(clockIn.message_id) && this.isApproved(clockOut.message_id);
        
        const handleRowApproval = () => {
            this.approveTimestamp(clockIn.message_id, workerId);
            this.approveTimestamp(clockOut.message_id, workerId);
        }

        const renderApprovalData = () => {
            if (approved) {
                return (<i>Approved</i>);
            } else {
                return (<span><b>Needs Approval</b>&nbsp;<button onClick={handleRowApproval}>Approve</button></span>)
            }
        }

        /* Or default to a minimal output */
        return (
            <tr key={`${clockIn.message_id}`}>
                <td>{clockInDate}</td>
                <td>{clockOutDate}</td>
                <td>{clockOut ? renderApprovalData(): <i>Pending worker clock out</i>}</td>
            </tr>
        );
    }
        
    renderSubscriptions = (subscriptionIds) => {
        return subscriptionIds.map((sid) => {
            return (
                <div key={sid}>
                    <h3>Subscription ID: {sid}</h3>
                    {/*{JSON.stringify(this.state.timestamps[sid])}*/}
                    <ClockEventsTable 
                        jobid={sid} 
                        timestamps={this.state.timestamps[sid]}
                        renderClockEventRow={this.customRenderTimestampRow}
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