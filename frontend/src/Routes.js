import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import NavigationBar from "./NavigationBar";

import Approvals from "./Approvals";
import Emails from "./Emails";
import Login from "./Login";
import Timesheet from "./Timesheet";
import lodash from "lodash";
import axios from "axios";

import "./index.scss";

export default class Root extends React.Component {

    constructor() {
        super()
        this.state = {
            userSettings: {}
        }
        this.loadUserSettings();    
    }

    loadUserSettings = () => {
        const promiseResponse = axios.get("/api/userSettings")

        promiseResponse.then((resp) => {
            console.log(resp.data);
            this.setState({
                userSettings: resp.data
            })
        });

        promiseResponse.catch((errResp) => {
            this.setState({
                userSettings: {}
            })
        });
    }

    augmentedUserSettings = () => {
        const loggedIn = Object.keys(this.state.userSettings).length > 0;
        const self = this; /* `this` could get really vague through here */
        
        const copiedSettings = _.cloneDeep(this.state.userSettings);
        const augmentedSettings = _.extend(copiedSettings, {

            isLoggedIn: loggedIn,

            requestReload: () => {
                self.loadUserSettings();
            },

            getEmail: () => {
                return "unsure@example.net";
            }

        });

        return augmentedSettings;        
    }

    render() {
        const userSettings = this.augmentedUserSettings();

        console.log("rendering: " + userSettings);

        const loginComponent = () => { return <Login userSettings={userSettings} /> }
        const timesheetComponent = () => { return <Timesheet userSettings={userSettings} /> }
        const approvalsComponent = () => { return <Approvals userSettings={userSettings} /> }
        const emailsComponent = () => { return <Emails userSettings={userSettings} /> }

        return (
            <div>
                <Router>
                    <div>
                        <NavigationBar />
                        <Switch>
                            <Route exact path="/" component={loginComponent} />
                            <Route path="/login" component={loginComponent} />
                            <Route path="/timesheet" component={timesheetComponent} />
                            <Route path="/approvals" component={approvalsComponent} />
                            <Route path="/emails" component={emailsComponent} />
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }

}