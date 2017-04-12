import * as express from "express";
import IRouter from "./IRouter";
import UserSettingsController from "../UserSettings/UserSettingsController"
import IGossip from "../gossip/IGossip";

export default class LoginRouter implements IRouter {

    private gossipImpl: IGossip;
    private userSettings: UserSettingsController;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
        this.userSettings = new UserSettingsController(this.gossipImpl);
    }


    routes(): express.Router {

        const router = express.Router()

        router.get('/login', (req, res) => {
            if (req.query.email === undefined) {
                return res.send(`I am logging you in through Gmail`)
            } else {
                const email = req.query.email;

                if(email === undefined)
                {
                    return res.send(`The email parameter is missing`);
                }

                /* Dump a completely insecure garbage cookie over */
                res.cookie("sessionEmail", email);

                this.userSettings.getSettings(email).then((userSettings) =>{
                    //todo: do we want to do anything with the settings object?
                })

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