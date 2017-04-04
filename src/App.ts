import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {

        let router = express.Router();

        router.get('/', (req, res, next) => {
            res.send({
                "hello": "world"
            })

        });
        
        this.express.use('/', router);

    }

}

export default new App().express;