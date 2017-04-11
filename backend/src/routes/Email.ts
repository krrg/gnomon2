import {Router} from "express";

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";

export default class Email implements IRouter {

    private gossipImpl: IGossip;

    constructor(gossip: IGossip) {
        this.gossipImpl = gossip;
    }

    routes(): Router {
        const router = Router();

        router.post("/subscriptions/:email", (req, res) => {

            // Do it!  Also, not sure of encoding on email.

        })

        router.get("/subscriptions", (req, res) => {

            // List everything that I am subscribed to.

        })

        return router;
    }


}