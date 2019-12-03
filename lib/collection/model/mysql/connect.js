'use strict';

/* global Simplified */

const mysql = require('mysql'),
    _ = require('lodash');

class Connect {
    constructor() {
        const database = Simplified.__database;

        this.config = _.extend({
            host: 'localhost',
            port: 3306,
            connectionLimit: 50,
            dateStrings: true,
            supportBigNumbers: true,
            multipleStatements: true,
            timezone: 'UTC'
        }, database );

        this.prefix = database.prefix;
        this.error = false;
        this.isMulti = false;
        this.attempt = 0;
        this.client = null;
    }

    getClient() {
        return mysql.createConnection(this.config);
    }

    async connect() {
        const client = this.getClient();

        await (() => {
            return new Promise( res => {
                client.connect( err => {
                    if (err) {
                        this.error = err;
                        this.client = null;

                        return res(true);
                    }

                    this.client = client;
                    res(true);
                });
            })
        })();
    }

    /**
     *
     * @param {string} sql
     * @param {object} options
     * @returns {Promise<any>}
     */
    query(sql, options) {
        if (!this.client) {
            this.client = this.getClient();
        }

        return new Promise(res => {
            this.client.query(sql, options, (err, results) => {
                if (err) {
                    // todo: log error?
                    err.errCode = 'systemError';

                    res([err]);
                }

                if (!this.isMulti) {
                    this.end();
                }

                res([null, results]);
            });
        });
    }

    end() {
        if (!this.client) {
            return;
        }

        this.client.end();
        this.attempt = 0;
        this.client = null;
        this.isMulti = false;
    }
}

module.exports = () => new Connect();