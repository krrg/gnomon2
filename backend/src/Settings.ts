const Settings = {

    /* This will get passed directly to the Redis constructor */
    Redis: {
        port: 6379,
        host: '127.0.0.1'
    },
    Login: {
        client_id: '119242185034-3o7n83u0gvu16qejgprbbbftj07ua1qr.apps.googleusercontent.com',
        client_secret: 'r0WCcPt27vW3oIR-TVSOB1eV',
        auth_return_url: 'http://localhost:4000/api/login/return'
    },
    Email: {
        username: 'gnomondev@gmail.com',
        password: 'bzvGuZ9!eLLt%omxFvUKmxYjLZp$$4Bz'
    }


}

export default Settings;
