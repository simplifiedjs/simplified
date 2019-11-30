'use strict';

const mysql = require('mysql'),
    _ = require('lodash');

class Connect {
    constructor() {
        const {prefix} = Collection.__config;

        this.config = _.extend({
            host: 'localhost',
            port: 3306,
            connectionLimit: 50,
            dateStrings: true,
            supportBigNumbers: true,
            multipleStatements: true,
            timezone: 'UTC'
        }, Collection.__config );

        this.prefix = prefix;
        this.error = false;
        this.isMulti = false;
        this.attempt = 0;
        this.client = null;
    }

    getClient() {
        return mysql.createConnection(this.config);
    }

    async connect() {
        const client = mysql.createConnection(this.config);

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

    query(sql, options) {
        if (!this.client) {
            this.client = this.getClient();
        }

        return new Promise(res => {
            this.client.query(sql, options, (err, results) => {
                if (err) {
                    this.err = err;

                    // todo: log error?

                    res([setError(err.sqlMessage || err.message, 'systemError')]);
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