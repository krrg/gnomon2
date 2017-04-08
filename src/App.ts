import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.app.use(cookieParser());
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

        router.get('/login', (req, res) => {
            if (req.query.email === undefined) {
                return res.send(`I am logging you in through Gmail`)
            } else {
                const email = req.query.email;

                /* Dump a completely insecure garbage cookie over */
                res.cookie("sessionEmail", email);

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

        router.get("/clockEvents", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }

            // Otherwise send back the list of events.
            return res.send(`Your email is ${email}`);
        })

        router.post("/clock", (req, res) => {
            // Create a new clock event with the logged in user.
            // Their ID will be in a cookie. They optionally specify the worker id and optionally the timestamp.
            // Timestamp defaults to current time (Date.now())
            // Worker ID defaults to their ID
            return res.send("Not implemented yet.");
        });
        
        this.app.use('/api', router);

    }

}

export default new App().app;