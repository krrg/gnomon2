const Settings = {

    /* This will get passed directly to the Redis constructor */
    Redis: {
        port: 6379,
        host: '127.0.0.1'
    },
    Login: {
        
        /* Note:  These are not actually working anymore */
        client_id: '<Google Client ID>',
        client_secret: '<Google Client Secret>',
        auth_return_url: 'http://localhost:4000/api/login/return'
    },
    Email: {
        username: '<dev>@<example.com>',
        password: '<password>'
    }


}

export default Settings;
