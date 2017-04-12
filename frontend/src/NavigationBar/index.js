import React from "react";
import {NavLink} from "react-router-dom";

import "./NavigationBar.scss";

export default class NavigationBar extends React.Component {

    render() {
        return (
            <div className="NavigationBar">
                <h1>Navigatory Exploration Bar</h1>

                <div>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/timesheet">timesheet</NavLink>
                    <NavLink to="/approvals">Approvals</NavLink>
                    <NavLink to="/emails">Email</NavLink>
                </div>
            </div>
        )
    }

}