'use strict';

const mysql = require('mysql'),
    _ = require('lodash');

class Connection {
    constructor() {
        const {host, port, database, user, pass, prefix} = Collection.__config;

        this.config = _.extend({
            host: 'localhost',
            port: 3306,
            connectionLimit: 50,
            dateStrings: true,
            supportBigNumbers: true,
            multipleStatements: true,
            timezone: 'UTC'
        }, {host, port, user, pass, database} );

        this.prefix = prefix;
        this.error = false;
        this.isMulti = false;
        this.attempt = 0;
        this.mysql = mysql.createConnection(this.config);
        this.client = null;
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
            this.client = this.mysql;
        }

        return new Promise(res => {
            this.client.query(sql, options, (err, results) => {
                if (err) {
                    this.err = err;

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

        this.client.end( () => {
            this.attempt = 0;
            this.client = null;
            this.isMulti = false;
        });
    }
}

class MySQL {
    constructor(name, schema = {}, options = {}) {
        this.__origName = name;
        this.__schema = schema;
        this.__options = options;
        this.db = new Connection();
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
     * Creates or update table structure.
     */
    up() {
        // Check if table exist, if it does, get the table structure
    }

    /**
     * Drops database table.
     */
    down() {
        return this.db.query('DROP ??', [this.getName()]);
    }

    /**
     * Inserts data into the database.
     *
     * @async
     * @param {object|array} columns
     * @returns {*}
     */
    insert(columns) {
        columns = prepareColumns(columns, this.__schema);

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

        return this.__query(sql, format).then(r => this.handleSubscribers(r, 'insert'));
    }

    update(columns = {}, where = {}) {
        let sql = 'UPDATE ?? SET ?',
            table = this.getName(),
            format = [table];

        columns = prepareColumns(columns, table);
        format.push(columns);

        if (where) {
            let clause = whereClause(where, table);

            sql += ` WHERE ${clause.where}`;
            format = format.concat(clause.format);
        }

        return this.__query(sql, format).then( r => this.handleSubscribers(r, 'update') );
    }

    delete(where = {}) {
        let sql = 'DELETE FROM ??',
            table = this.getName(),
            format = [table];

        if (where) {
            let clause = whereClause(where, table);

            sql += ` WHERE ${clause.where}`;
            format = format.concat(clause.format);
        }

        return this.__query(sql, format).then( r => this.handleSubscribers(r, 'delete') );
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

    async handleSubscribers(results, action) {
        if (!results) {
            return results;
        }

        if (_.isArray(results)) {
            for( let i = 0; i < results.length; i++) {
                results[i] = await this.__subscribers(action, results[i]);
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

function handleResponse([err, results], inst) {
    inst.lastError = null;

    if (err) {
        inst.lastError = err.sqlMessage;
    }

    return results;
}

function prepareColumns(columns, schema) {
    if (_.isArray(columns)) {
        return columns.map( c => prepareColumns(c, schema) );
    }

    let _columns = {};

    _.forEach( columns, (value, name) => {
        const def = schema[name];

        if (!def) {
            // Undefined column, bail!
            return;
        }

        if (!value && def.required && def.defaultValue) {
            value = def.defaultValue;

            if ('function' === typeof def.defaultValue) {
                value = def.defaultValue.call(null);
            }
        }

        if (def.validate) {
            value = def.validate(value);
        }

        if ('Any' === def.type) {
            value = serialize(value);
        }

        _columns[name] = value;
    });

    return _columns;
}

function filterColumns(columns, schema) {
    _.forEach( columns, (value, key) => {
        let def = schema[key];

        if ('Any' === def.type) {
            columns[key] = unserialize(value);
        }
    });

    return columns;
}

function formatColumnsForQuery(queryColumns, table) {
    if (!queryColumns) {
        // Assume all columns
        return `${table}.*`;
    }
}

function whereClause(where, table) {
    let $and = [],
        $or = [],
        _format = [],
        operators = {
            $greaterThan: '> ?',
            $greaterThanEqual: '>= ?',
            $lessThan: '< ?',
            $lessThanEqual: '<= ?',
            $not: '!= ?',
            $in: 'IN (?)',
            $notIn: 'NOT IN (?)',
            $like: 'LIKE ?',
            $notLike: 'NOT LIKE ?',
            $between: 'BETWEEN ? AND ?',
            $notBetween: 'NOT BETWEEN ? AND ?',
            $exist: 'IS NOT NULL',
            $isNull: 'IS NULL'
        };

    const mapCondition = (column, con, value, arr) => {
        let currentOperator = operators[con] || '= ?';

        // Replace asterisk with %
        if ('$like' === con && '$notlike' === con) {
            value = value.replace(/\*/g, '%');
        }

        if ('$fn' === con) {
            arr.push(`${column}(${value})`);
        } else {
            arr.push(`${table}.${column} ${currentOperator}`);
        }

        if ('$between' === con) {
            _format = _format.concat(value);

            return;
        }

        _format.push(value);
    };

    const mapWhere = (key, value, arr) => {
        if (!_.isObject(value)) {
            return mapCondition(key, false, value, arr);
        }

        _.forEach( value, (v, k) => mapCondition(key, k, v, arr));
    };

    _.keys(where).map( key => {
        let value = where[key];

        switch(key) {
            default :
                mapWhere(key, value, $and);

                break;

            case '$and' :
                _.forEach( value, (v, k) => mapWhere(k, v, $and));

                break;

            case '$or' :
                _.forEach( value, (v, k) => mapWhere(k, v, $or));

                break;
        }
    });

    let _where = [];

    if ($and.length) {
        _where.push(`(${$and.join(' AND ')})`);
    }

    if ($or.length) {
        _where.push(`(${$or.join(' OR ')})`);
    }

    console.log($or);

    return {where: _where.join(' AND '), format: _format};
}

module.exports = (name, schema) => new MySQL(name, schema);