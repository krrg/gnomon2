import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";


export default class JobRouter implements IRouter {

    private gossipImpl: IGossip;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
    }

    routes(): express.Router {

        let router = express.Router();

        router.get("/job", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }

            //Luke: Does this mean, get all a jobs? Dont know if we need this

            return res.send(`Your email is ${email}`);
        })

        router.post("/job", (req, res) => {
          
          //Luke: From what I remember this function should do the following:
                //requires a user to be logged in (email in cookie)
                //data = gossipImpl.filterMessages(email)
                //newJobID = random string
                //data.jobs.add(newJobID)
                //gossipImpl.sendMessage( new Message (senderID =email, text=data)
            //Luke: will this work? This will result in many userData entries. I guess we just filter on the newest?

            return res.send("Not implemented yet.");
        });

        return router;

    }

}
