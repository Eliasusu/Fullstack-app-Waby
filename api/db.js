import mysql from 'mysql';
import { promisify } from 'util';
import { waby_db } from './config.js';

export const pool = mysql.createPool(waby_db);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection was closed.')
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connections.')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('Database connection was refused.')
        }   

    }

    if(connection) connection.release();
    console.log('Db is connected')
    return;
});


// Promisify Pool Querys
pool.query = promisify(pool.query);