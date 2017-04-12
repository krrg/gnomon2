import * as express from "express";
import IRouter from "./IRouter";

export default class LoginRouter implements IRouter {

    routes(): express.Router {
        const router = express.Router()

        router.get('/login', (req, res) => {
            if (req.query.email === undefined) {
                return res.send(`I am logging you in through Gmail`)
            } else {
                const email = req.query.email;

                /* Dump a completely insecure garbage cookie over */
                res.cookie("sessionEmail", email);

                //todo: attempt to get back data from database and put it in a cookie
                //data = gossipImpl.filterMessages(email)
                //if (data == null){
                    //newSenderID = hash(email) or random string
                    //defaultDatabaseEntry = Json.stringify({senderID = newSenderID, jobs=[], subscriptions=[]})
                    //gossipImpl.sendMessage( new Message (senderID =email, text=defaultDatabaseEntry)
                    //data = gossipImpl.filterMessages(email)
                //}
                //res.cookie("userData", data);
                return res.send(`Okay, I will blindly login as ${email}`)
            }

        });

        router.get('/login/return', (req, res) => {
            // Handle Google coming back to us with stuff.
        })

        router.get('/logout', (req, res) => {
            res.clearCookie("sessionEmail");
            return res.send("Logged out.");
        })

        return router;
    }

}