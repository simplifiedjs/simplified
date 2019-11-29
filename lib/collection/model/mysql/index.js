'use strict';

// Load table methods
require('./table');

const Connect = require('./connect'),
    {handleResponse, prepareColumns, filterColumns, formatColumnsForQuery, whereClause} = require('./utils'),
    _ = require('lodash');

class MySQL {
    constructor(name, schema = {}) {
        this.__origName = name;
        this.__schema = schema;
        this.db = Connect();
        this.subscribers = {};
        this.cached = {};
        this.lastError = null;

        this.subscribe = this.subscribe.bind(this);
    }

    getName() {
        return DB.__config.prefix + this.__origName.toLowerCase();
    }

    getSchema() {
        return this.__schema;
    }

    getLastError() {
        return this.lastError;
    }

    subscribe( action, callback ) {
        let subscribers = this.subscribers[action] || [];
        subscribers.push(callback);

        this.subscribers[action] = subscribers;
    }

    async __subscribers( action, data ) {
        let subscribers = this.subscribers[action];

        if (!subscribers) {
            return;
        }

        for (let i = 0; i < subscribers.length; i++) {
            data = await subscribers[i].call(null, data);
        }

        return data;
    }

    __query(sql, format) {
        return this.db.query(sql, format).then(r => handleResponse(r, this));
    }

    /**
     * Inserts data into the database.
     *
     * @async
     * @param {object|array} columns
     * @returns {*}
     */
    async insert(columns) {
        let errors = [];

        columns = await prepareColumns(columns, this.__schema, errors);

        if (errors.length) {
            // Log errors?
            this.lastError = errors;
            return Promise.resolve( () => null );
        }

        let isMany = _.isArray(columns),
            sql = 'INSERT INTO ?? SET ?',
            format = [this.getName(), columns];

        if (isMany) {
            const first = _.first(columns),
                columnKeys = _.keys(first),
                columnValues = columns.map(_.values);

            sql = 'INSERT INTO ?? (??) VALUES ?';
            format = [this.getName(), columnKeys, columnValues];
        }

        return this.__query(sql, format)
            .then( r => this.handleInsert(r, isMany, columns))
            .then(r => this.handleSubscribers(r, 'insert', columns));
    }

    handleInsert(results, isMany, columns) {
        let insertId = this.db.client.insertId;

        if (insertId) {
            // Get column name
            let column = _.findKey(this.__schema, {type: 'Id'});

            if (isMany) {
                let ids = [];

                columns.map( () => {
                    ids.push(insertId);

                    insertId -= 1;
                });

                insertId = ids;
            }

            return insertId;
        }

        return results;
    }

    async update(columns = {}, where = {}) {
        let sql = 'UPDATE ?? SET ?',
            table = this.getName(),
            format = [table],
            errors = [];

        columns = await prepareColumns(columns, table, errors);

        if (errors.length) {
            this.lastError = errors;

            return Promise.resolve( () => null );
        }

        format.push(columns);

        if (where) {
            let clause = whereClause(where, table);

            sql += ` WHERE ${clause.where}`;
            format = format.concat(clause.format);
        }

        return this.__query(sql, format)
            .then( r => this.handleSubscribers(r, 'update', {columns, where}) );
    }

    async delete(where = {}) {
        let sql = 'DELETE FROM ??',
            table = this.getName(),
            format = [table];

        // Get old data
        const oldData = await this.get({where});

        if (where) {
            let clause = whereClause(where, table);

            sql += ` WHERE ${clause.where}`;
            format = format.concat(clause.format);
        }

        return this.__query(sql, format).then( r => this.handleSubscribers(r, 'delete', oldData) );
    }

    /**
     *
     * @param {object} condition
     */
    get(condition = {}) {
        // Check from cached
        const cachedKey = serialize(condition);

        if (this.cached[cachedKey]) {
            return Promise.resolve( () => this.__handleGet(this.cached[cachedKey], cachedKey) );
        }

        let table = this.getName(),
            columns = formatColumnsForQuery(condition.columns, table),
            sql = `SELECT ${columns} FROM ??`,
            format = [table];

        if (condition.where) {
            let where = whereClause(condition.where, table);

            sql += ` WHERE ${where.where}`;
            format = format.concat(where.format);
        }

        if (condition.orderBy) {
            let order = condition.order || 'DESC';
            sql += ` ORDER BY ${condition.orderBy} ${order}`;
        }

        return this.__query(sql, format)
            .then( r => this.filterColumns(r, cachedKey))
            .then( r => this.handleSubscribers(r, 'get') );
    }

    filterColumns(results, cachedKey) {
        if (results && results.length) {
            results = results.map( r => filterColumns(r, this.__schema));
        }

        this.cached[cachedKey] = results;

        return results;
    }

    async handleSubscribers(results, action, columns) {
        if (!results) {
            return results;
        }

        if (_.isArray(results)) {
            for( let i = 0; i < results.length; i++) {
                results[i] = await this.__subscribers(action, results[i], columns, this);
            }

            return results;
        }

        return this.subscribe(action, results);
    }

    getRow(columns, where = {}) {
        return this.get({columns, where})
            .then( results => {
                if (results && results.length) {
                    results = _.first(results);
                }

                return results;
            });
    }

    getValue(column, where = {}) {
        return this.getRow(column, where)
            .then( result => {
                if (result) {
                    result = result[column];
                }

                return result;
            })
    }
}

module.exports = (name, schema, options) => new MySQL(name, schema, options);