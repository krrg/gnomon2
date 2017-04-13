const Settings = {
    
    /* This will get passed directly to the Redis constructor */
    Redis: {
        port: 6379,
        host: '127.0.0.1'
    },
    Login: {
        client_id: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
        client_secret: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
        auth_return_url: 'XXXXXXXXXXXXXXXXXXXXXXXXX'
    },
    Email: {
        username: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXXXXXXXXXXXXXX'
    }

}

export default Settings;