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
        this.cached = {};

        this.clearCached = this.clearCached.bind(this);
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

    clearCached([err, results]) {
        if (err) {
            return [err];
        }

        this.cached = {};

        return [err, results];
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

        columns = await prepareColumns(columns, this.__schema, errors, true);

        if (errors.length) {
            return Promise.resolve( [_.first(errors)] );
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

        return this.db.query(sql, format).then(r => this.handleInsert(r, columns)).then(this.clearCached);
    }

    handleInsert([err, results], columns) {
        if (err) {
            return [err];
        }

        if (!results.insertId) {
            // Find primary column
            let primary = _.findKey( this.__schema, {primary: true});

            if (primary && columns[primary]) {
                return [null, columns[primary]];
            }

            return [null, !!results.affectedRows];
        }

        let insertId = results.insertId,
            isMany = _.isArray(columns);

        // todo: handle multiple insertion

        return [null, insertId];
    }

    async update(columns = {}, where = {}) {
        let sql = 'UPDATE ?? SET ?',
            table = this.getName(),
            format = [table],
            errors = [];

        columns = await prepareColumns(columns, this.__schema, errors);

        if (errors.length) {
            return Promise.resolve( [_.first(errors)] );
        }

        format.push(columns);

        if (where) {
            let clause = whereClause(where, table);

            sql += ` WHERE ${clause.where}`;
            format = format.concat(clause.format);
        }

        return this.db.query(sql, format).then(this.clearCached);
    }

    async delete(where = {}) {
        let sql = 'DELETE FROM ??',
            table = this.getName(),
            format = [table];

        if (where) {
            let clause = whereClause(where, table);

            sql += ` WHERE ${clause.where}`;
            format = format.concat(clause.format);
        }

        return this.db.query(sql, format).then(this.clearCached);
    }

    get(condition) {
        condition = condition || {};

        // Check from cached
        const cachedKey = serialize(condition);

        if (this.cached[cachedKey]) {
            return Promise.resolve(this.cached[cachedKey]);
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

        return this.db.query(sql, format).then(r => this.filterColumns(r, cachedKey));
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

                return [null, _.first(results)];
            });
    }

    getValue(column, where = {}) {
        return this.getRow(column, where)
            .then( ([err, result]) => {
                if (result) {
                    result = result[column];
                }

                return [err, result];
            })
    }
}

module.exports = (name, schema, options) => new MySQL(name, schema, options);