'use strict';

/* global Simplified */

const Connect = require('./connect'),
    _ = require('lodash'),
    {columnStructure} = require('./utils');

define( 'createCollectionModel',
    /**
     * Creates new database table.
     *
     * @async
     *
     * @param {string} name
     * @param {object} schema
     * @param {object} options
     * @returns {Promise<*[]>}
     */
    async function(name, schema = {}, options = {}) {
        const conn = Connect();

        let {columns, indexes} = columnStructure(schema),
            _options = [],
            table = Simplified.__database.prefix + name.toLowerCase();

        if (indexes.length) {
            columns.push('Index (`' + indexes.join('`,`') + '`)');
        }

        if (!_.isEmpty(options)) {
            _.keys(options).map( key => {
                let val = options[key];
                _options.push(`${key}=${val}`);
            });
        }

        let sql = `CREATE TABLE IF NOT EXISTS ?? (` + columns.join(',') + `)${_options.join(' ')}`,
            format = [table];

        return conn.query(sql, format);
    });

define( 'alterCollectionModel',
    /**
     * Update model's table structure.
     *
     * @param name
     * @param newColumns
     * @param updateColumns
     * @param dropColumns
     * @returns {Promise<*[]>}
     */
    async function(name, newColumns = {}, updateColumns = {}, dropColumns = []) {
        let conn = Connect(),
            table = Simplified.__database.prefix + name.toLowerCase(),
            sql = [],
            format = [table],
            errors = [],
            newIndexes = [],
            delIndexes = [];

        // Ready connection for multiple queries
        conn.multi();

        // Get previous indexes
        let [, indexes] = await conn.query('SHOW INDEXES FROM ??', [table] ),
            indexKeys = [];

        if (indexes.length) {
            indexes.map( index => indexKeys.push(index.Key_name));
        }

        // Format new columns
        if (!_.isEmpty(newColumns)) {
            newColumns = columnStructure(newColumns);

            sql.push('ADD ' + newColumns.columns.join(', ADD ') );

            newIndexes = _.union(newIndexes, newColumns.indexes);
        }

        // Format updated columns
        if (!_.isEmpty(updateColumns)) {
            _.forEach( updateColumns, (def, name) => {
                let structure = columnStructure(_.zipObject([name], [def]));

                sql.push(`CHANGE COLUMN ?? ${structure.columns.join('')}`);
                format.push(name);

                if (_.findIndex(indexKeys, name) >= 0) {
                    if (!structure.indexes.length) {
                        delIndexes.push(name);
                    }
                } else if (structure.indexes.length) {
                    newIndexes.push(name);
                }
            });
        }

        // Format drop columns
        if (dropColumns.length) {
            dropColumns.map( drop => {
                sql.push(`DROP COLUMN ??`);
                format.push(drop);

                if (_.findIndex(indexKeys, drop) >= 0) {
                    delIndexes.push(drop);
                }
            });
        }

        let [err] = await conn.query(`ALTER TABLE ?? ` + sql.join(', '), format);

        if (err) {
            conn.end();

            return [err];
        }

        if (newIndexes.length) {
            // Add indexes
            await newIndexes.map( async index => {
                let [err] = await conn.query('CREATE INDEX ?? ON ??', [index, table]);

                if (err) {
                    errors.push(err);
                }
            });
        }

        if (delIndexes.length) {
            await delIndexes.map( async index => {
                let [err] = await conn.query('DROP INDEX ?? ON ??', [index, table]);

                if (err) {
                    errors.push(err);
                }
            })
        }

        conn.end();

        return [errors, !errors.length];
    });

define( 'dropCollectionModel',
    /**
     * Remove collection model.
     *
     * @param {string} name
     */
    function(name) {
        let conn = Connect(),
            table = Simplified.__database.prefix + name.toLowerCase();

        return conn.query('DROP TABLE ??', [table]);
    });

define( 'cloneCollectionModel',
    /**
     * Copy model data and store it to a new one.
     *
     * @param modelName
     * @param cloneName
     */
    function(modelName, cloneName) {
        let conn = Connect(),
            prefix = Simplified.__database.prefix,
            table1 = prefix + modelName.toLowerCase(),
            table2 = prefix + cloneName.toLowerCase();

        return conn.query('CREATE TABLE IF NOT EXISTS ?? LIKE ??', [table1, table2]);
    });