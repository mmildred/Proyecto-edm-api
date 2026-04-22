export const pgProvider = [{
    provide: 'PG_CONNECTION',
    useFactory: async () => {
        const { Client } = require('pg');
        const client = new Client({
            host: 'localhost', 
            port: 5432,
            user: 'postgres', 
            password: 'admin123', 
            database: 'mld-db' 
        });

        await client.connect();

        return client;
    }
}];