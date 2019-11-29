'use strict';

const logModel = Collection.UserLog.Model;

logModel.subscribe( 'insert',
    /**
     * Returns the generated key during insertion.
     *
     * @param result
     * @param columns
     * @returns {*}
     */
    function(result, columns) {
        return columns.key;
    });