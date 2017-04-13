import * as express from "express";
import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";
import UserSettingsController from "../usersettings/UserSettingsController"
import IUserSettingsFormat from "../usersettings/IUserSettingsFormat";

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
            let email = req.query.email;
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email)
            {
                return res.send(`You are not logged in.`);
            }

            this.userSettings.getSettings(email).then((userSettingsString:string) =>{
                return res.send(`${userSettingsString}`);
            })
        })

        return router;
    }

}