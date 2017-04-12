import React from "react";
import {NavLink} from "react-router-dom";

import "./NavigationBar.scss";

export default class NavigationBar extends React.Component {

    render() {
        return (
            <div className="NavigationBar">
                <ul>
                    <li><NavLink to="/login">Login</NavLink></li>
                    <li><NavLink to="/timesheet">Timesheet</NavLink></li>
                    <li><NavLink to="/approvals">Approvals</NavLink></li>
                    <li><NavLink to="/emails">Email</NavLink></li>
                </ul>
            </div>
        )
    }

}