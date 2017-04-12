/* This is the entrypoint for the application */

import React from "react";
import ReactDOM from "react-dom";

import Root from "./Root";

document.body.innerHTML += '<div id="ReactAppEntry"></div>';

ReactDOM.render(
    <Root />,
    document.getElementById('ReactAppEntry')
)