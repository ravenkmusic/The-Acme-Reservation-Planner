const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservations_db');
const uuid = require('uuid');

const createTables = async()=> {
    let SQL = `
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurants;
        DROP TABLE IF EXIST reservations;

        CREATE TABLE customers(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE reservations(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
            customer_id UUID REFERENCES customer(id) NOT NULL
        );
    `;
    await client.query(SQL);
}

module.exports = {
    client,
    createTables
};