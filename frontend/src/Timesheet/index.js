import React from "react";
import axios from "axios";

export default class Timesheet extends React.Component {

    constructor() {
        super();


    }

    renderWorkerIds = () => {
        const jobIds = this.props.userSettings.jobs || [];

        if (jobIds.length > 0) {
            console.log("Here i am");
            console.log(jobIds);
            return this.props.userSettings["jobs"].map((jobid) => {
                return (<p key={jobid}>JOB: {jobid} </p>);
            });
        } else {
            return (<p>You have no jobs</p>);
        }

    }

    handleCreateNewJob = () => {
        console.log("Creating new job");
        axios.post("/api/jobs").then((resp) => {
            console.log("here it is");
            this.props.userSettings.requestReload();
        })

    }

    render() {
        return (
            <div className="gn-container">
                <h1>Your Timesheet</h1>

                <div>
                    <h2>Worker IDs</h2>
                    {this.renderWorkerIds()}

                    <button onClick={this.handleCreateNewJob}>Create new Job</button>

                </div>


            </div>
        )
    }

}