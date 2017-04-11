import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IGossip from "./gossip/IGossip";
import RedisGossip from "./gossip/RedisGossip";

import Clock from "./routes/Clock";
import Login from "./routes/Login";
import Email from "./routes/Email";

class App {

    public app: express.Application;

    private gossipImpl: IGossip;

    constructor() {
        this.app = express();
        this.middleware();
        this.initRoutes();

        this.gossipImpl = new RedisGossip();
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

        router.use(new Clock().routes());
        router.use(new Login().routes());
        router.use(new Email(this.gossipImpl).routes());

        this.app.use('/api', router);

    }

}

export default new App().app;