
export const mysqlProvider = [{
    provide: 'MYSQL_CONNECTION',
    useFactory: async () => {
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'admin',
            password: 'admin123',
            database: 'mld-db'

        });
        return connection;
    }
}]