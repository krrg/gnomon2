const Settings = {
    
    /* This will get passed directly to the Redis constructor */
    Redis: {
        port: 6379,
        host: '127.0.0.1'
    },
    Login: {
        client_id: '119242185034-3o7n83u0gvu16qejgprbbbftj07ua1qr.apps.googleusercontent.com',
        client_secret: '1JyvaqOKI8Mhw9eaZSB1_s90',
        auth_return_url: 'http://localhost:3000/api/login/return'
    },
    Email: {
        username: 'gnomondev@gmail.com',
        password: '8W0aew4IIWo2'
    }
}

export default Settings;