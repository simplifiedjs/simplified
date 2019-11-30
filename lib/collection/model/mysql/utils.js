'use strict';

const _ = require('lodash');

module.exports = {prepareColumns, filterColumns, formatColumnsForQuery, whereClause, columnStructure};

async function prepareColumns(columns, schema, errors) {
    if (_.isArray(columns)) {
        await awaitAll( _.keys(columns), async key => {
            columns[key] = await prepareColumns(columns[key], schema, errors);
        });

        return columns;
    }

    let _columns = {};

    await awaitAll( _.keys(columns), async name => {
        let value = columns[name];

        const def = schema[name];

        if (!def) {
            // Undefined column, bail!
            return;
        }

        if (!value && def.required && def.defaultValue) {
            value = def.defaultValue;

            if ('function' === typeof def.defaultValue) {
                value = await def.defaultValue.call(null, columns);
            }
        }

        if (def.validate) {
            value = await def.validate.call(null, value, columns);

            if (_.isError(value)) {
                errors[name] = value;

                return;
            }
        }

        if (value && 'Object' === def.type) {
            value = serialize(value);
        }

        _columns[name] = value;

    } );

    return _columns;
}

function columnStructure(schema) {
    let columns = [],
        indexes = [];

    _.forEach( schema, (def, name) => {
        let column = [`\`${name}\``],
            isDate = false;

        switch(def.type) {
            case 'Id' :
                column.push(`BIGINT(20) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT`);
                indexes.push(name);
                break;

            case 'String' :
                let strLength = def.length || 255;  // Set maximum length if not specified.
                column.push(`VARCHAR(${strLength})`);
                break;

            case 'ForeignId' :
                column.push('BIGINT(20)');
                break;

            case 'Enum' :
                let enums = '"' + def.enum.join('", "') + '"';
                column.push(`ENUM (${enums})`);
                break;

            case 'Int' :
                let intLength = def.length || 11;

                column.push(`INT(${intLength})`);
                break;

            case 'Object' :
            case 'Array' :
                column.push('LONGTEXT');
                break;

            case 'Boolean' :
                column.push('INT(1)');
                break;

            case 'DateTime' :
            case 'Timestamp' :
                isDate = true;
                column.push(def.type.toUpperCase());
                break;
        }

        if (def.required) {
            column.push('NOT NULL');
        }

        if (def.unique) {
            column.push('UNIQUE');
        }

        if (def.primary) {
            column.push('PRIMARY KEY');
        }

        if (isDate) {
            if (def.defaultValue) {
                column.push(`DEFAULT CURRENT_TIMESTAMP`);
            }

            if (def.update) {
                column.push('ON UPDATE CURRENT_TIMESTAMP');
            }
        }

        if (def.index) {
            indexes.push(name);
        }

        columns.push(column.join(' '));
    });

    return {columns, indexes};
}

function filterColumns(columns, schema) {
    _.forEach( columns, (value, key) => {
        let def = schema[key];

        if ('Object' === def.type) {
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

    return queryColumns;
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

    return {where: _where.join(' AND '), format: _format};
}