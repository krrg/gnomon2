import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";


export default class SubscribeRouter implements IRouter {

    private gossipImpl: IGossip;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
    }

    routes(): express.Router {

        let router = express.Router();

        router.get("/subscribe", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }

            //Luke: Does this mean, get all a users subscriptions? Dont know if we need this

            return res.send(`Your email is ${email}`);
        })

        router.post("/subscribe", (req, res) => {
          
          //Luke: From what I remember this function should do the following:
                //requires a user to be logged in (email in cookie)
                //requires a the worker id/sender id
                    //if they dont have any worker id, fail
                    //if the sender id doesnt exist, fail
                //do gossipImpl.subscribeToSender(senderID=workerID, callback=some function to return what data is returned))
                //update res.cookie("userData", data);

            return res.send("Not implemented yet.");
        });

        return router;

    }

}
