import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {

        let router = express.Router();

        router.get('/', (req, res, next) => {
            res.send({
                "hello": "world"
            })

        });
        
        this.app.use('/', router);

    }

}

export default new App().app;