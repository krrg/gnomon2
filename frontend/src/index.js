/* This is the entrypoint for the application */

import React from "react";
import ReactDOM from "react-dom";

import Routes from "./Routes";

document.body.innerHTML += '<div id="ReactAppEntry"></div>';

ReactDOM.render(
    <Routes />,
    document.getElementById('ReactAppEntry')
)