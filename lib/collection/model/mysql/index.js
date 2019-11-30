'use strict';

// Load table methods
require('./table');

const Connect = require('./connect'),
    {prepareColumns, filterColumns, formatColumnsForQuery, whereClause} = require('./utils'),
    _ = require('lodash');

class MySQL {
    constructor(name, schema = {}) {
        this.__origName = name;
        this.__schema = schema;
        this.db = Connect();
        this.subscribers = {};
        this.cached = {};

        this.subscribe = this.subscribe.bind(this);
    }

    getName() {
        return this.db.prefix + this.__origName.toLowerCase();
    }

    getSchema() {
        return this.__schema;
    }

    multi() {
        this.db.isMulti = true;
    }

    single() {
        this.db.isMulti = false;
    }

    end() {
        this.db.end();
    }

    subscribe( action, callback ) {
        let subscribers = this.subscribers[action] || [];
        subscribers.push(callback);

        this.subscribers[action] = subscribers;
    }

    async __subscribers( action, [err, data], args ) {
        if (err) {
            return [err];
        }

        let subscribers = this.subscribers[action];

        if (!subscribers) {
            return [err, data];
        }

        await awaitAll(subscribers, async cb => {
            data = await cb.call(null, data, args);
        });

        return [err, data];
    }

    __query(sql, format, action, args) {
        let query = this.db.query(sql, format);

        if ('insert' === action) {
            query.then( r => this.handleInsert(r, args));
        }

        if ('get' === action) {
            query.then( r => this.filterColumns(r, args));
            args = null;
        }

        query.then( r => this.__subscribers( action, r, args) );

        return query;
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

        return this.__query(sql, format, 'insert', columns);
    }

    handleInsert([err, results],columns) {
        if (err) {
            return [err];
        }

        if (!_.isObject(results) || !results.insertId) {
            return results;
        }

        let insertId = results.insertId,
            isMany = _.isArray(columns);

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

        return [err, results];
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

        return this.__query(sql, format, 'update', {columns, where});
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

        return this.__query(sql, format, 'delete', oldData);
    }

    /**
     *
     * @param {object} condition
     */
    get(condition) {
        condition = condition || {};

        // Check from cached
        const cachedKey = serialize(condition);

        if (this.cached[cachedKey]) {
            return Promise.resolve(this.__subscribers('get', this.cached[cachedKey]));
        }

        let table = this.getName(),
            columns = formatColumnsForQuery(condition.columns, table),
            sql = `SELECT ${columns} FROM ??`,
            format = [table];

        if (condition.where && !_.isEmpty(condition.where)) {
            let where = whereClause(condition.where, table);

            sql += ` WHERE ${where.where}`;
            format = format.concat(where.format);
        }

        if (condition.orderBy) {
            let order = condition.order || 'DESC';
            sql += ` ORDER BY ${condition.orderBy} ${order}`;
        }

        return this.__query(sql, format, 'get', cachedKey);
    }

    filterColumns([err, results], cachedKey) {
        if (results && results.length) {
           results = results.map( r => filterColumns(r, this.__schema));

           this.cached[cachedKey] = [err, results];
        }

        return [err, results];
    }

    getRow(columns, where = {}) {
        return this.get({columns, where})
            .then( ([err, results]) => {
                if (err) {
                    return [err];
                }

                return _.first(results);
            });
    }

    getValue(column, where = {}) {
        return this.getRow(column, where)
            .then( (err, result) => {
                if (result) {
                    result = result[column];
                }

                return [err, result];
            })
    }
}

module.exports = (name, schema, options) => new MySQL(name, schema, options);