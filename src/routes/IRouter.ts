import * as express from "express";

interface IRouter {

    routes(): express.Router;

}

export default IRouter;