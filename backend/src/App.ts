import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IGossip from "./gossip/IGossip";
import RedisGossip from "./gossip/RedisGossip";

import Clock from "./routes/Clock";
import Login from "./routes/Login";
import Email from "./routes/Email";
import UserSettings from "./routes/UserSettings";
import Job from "./routes/Job";
import UserSubscription from "./routes/UserSubscription";

class App {

    public app: express.Application;

    private gossipImpl: IGossip;

    constructor() {
        this.app = express();
        this.gossipImpl = new RedisGossip();

        this.middleware();
        this.initRoutes();

    }

    private middleware(): void {
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private initRoutes(): void {

        let router = express.Router();

        router.get('/', (req, res) => {
            return res.send("Here is the API!");
        });

        router.use(new Clock(this.gossipImpl).routes());
        router.use(new Login().routes());
        router.use(new Email(this.gossipImpl).routes());
        router.use(new UserSettings(this.gossipImpl).routes());
        router.use(new Job(this.gossipImpl).routes());
        router.use(new UserSubscription(this.gossipImpl).routes());

        this.app.use('/api', router);

    }

}

export default new App().app;