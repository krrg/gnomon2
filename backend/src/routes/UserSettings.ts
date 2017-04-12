import * as express from "express";
import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";
import UserSettingsController from "../UserSettings/UserSettingsController"
import IUserSettingsFormat from "../UserSettings/IUserSettingsFormat";

export default class UserSettingsRouter implements IRouter {

    private gossipImpl: IGossip;
    private userSettings: UserSettingsController;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
        this.userSettings = new UserSettingsController(this.gossipImpl);
    }


    routes(): express.Router {

        const router = express.Router()

         router.get("/userSettings", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }
            if(email === undefined)
            {
                return res.send(`You are not logged in.`);
            }

            this.userSettings.getSettings(email).then((userSettingsString) =>{
                return res.send(`${userSettingsString}`);
            })
        })

        return router;
    }

}