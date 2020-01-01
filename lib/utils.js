'use strict';

const Utils = exports,
    _ = require('lodash'),
    crypto = require('crypto'),
    encoding = 'aes-256-cbc',
    typeType = 'base64';

Utils.define = define;

/**
 * Helper function which sets a unique callable function.
 */
function define(name, value, object = global) {
    if (_.isObject(name)) {
        return _.forEach( name, (v, n) => {
            define( n, v, object );
        });
    }

    if (object.hasOwnProperty(name)) {
        // Throw error
        return false;
    }

    Object.defineProperty( object, name, {
        value: value,
        writable: false
    });

    return true;
}

define( 'define', define );

define( 'setError',
    /**
     *
     * @param {string|null} message
     * @param {string} errCode
     * @returns {Error}
     */
    function(message, errCode) {
        let err = new Error();
        err.message = message;
        err.errCode = errCode;

        return err;
    });

define( 'errorCode',
    function(errCode) {
        return setError(null, errCode);
    });

define( 'isEmail',
    /**
     * Check if the given is of valid email address.
     *
     * @param {string} email
     * @returns {*|boolean}
     */
    function(email) {
        let atPos = email.indexOf('@'),
            dotPos = email.indexOf('.');

        return atPos && dotPos && dotPos > (atPos+2);
    });

define( 'serialize',
    /**
     * Serialize an object
     *
     * @param {*} string
     */
    function(string) {
        if (_.isObject(string)) {
            return JSON.stringify(string);
        }

        return string;
    });

define( 'unserialize',
    /**
     *
     * @param {*} string
     */
    function(string) {
        if (!string) {
            return string;
        }

        try {
            return JSON.parse(string);
        } catch(e) {
            return string;
        }
    });

define( 'randomSalt',
    /**
     *
     * @param {int} bytes
     * @param {int} length
     * @param {string} format
     * @returns {*}
     */
    function (bytes, length, format) {
        bytes = bytes || 16;
        length = length || 64;
        format = format || typeType;

        return crypto.randomBytes(bytes)
            .toString(format)
            .slice( 0, length );
    });

define( 'generateHashKey',
    /**
     *
     * @async
     * @param {string} uniqKey
     * @returns {Promise<Array<Error, *>>}
     */
    function(uniqKey) {
        if (!uniqKey) {
            // Generate random key
            uniqKey = randomSalt();
        }

        const SECRET_KEY = randomSalt(64, 32, 'hex').toString();

        return new Promise(res => {
            let iv = crypto.randomBytes(16),
                secretKey = Buffer.from(SECRET_KEY),
                cipher = crypto.createCipheriv( encoding, secretKey, iv );

            cipher.on('readable', () => {
                let key = cipher.read();

                if ( ! key ) {
                    // todo: Log error
                    return res([setError(null, 'systemError')]);
                }

                key = [iv.toString(typeType), key.toString(typeType), SECRET_KEY];

                res([null, key.join(';)')]);
            });

            cipher.write(uniqKey);
            cipher.end();
        });
    });

define( 'decryptHashKey',
    /**
     *
     * @param {string} hash
     * @returns {Promise<Array<Error, *>>}
     */
    function(hash) {
        return new Promise( res => {
            let _hash = hash.split(';)'),
                secretKey = Buffer.from( _hash[2] ),
                iv, encrypt;

            iv = Buffer.from(_hash[0], type);
            encrypt = Buffer.from(_hash[1], type);

            let decipher = crypto.createDecipheriv( encoding, secretKey, iv );

            decipher.on('readable', () => {
                let match = decipher.read();

                if(!match) {
                    // todo: Log error
                    return res([setError(null, 'systemError')]);
                }

                match = match.toString();

                res([null, match]);
            });
            decipher.write(encrypt);
            decipher.end();
        });
    });

define('generateCachedKey',

    function(context) {
        return function(arg) {
            let data = arg;

            switch(context) {
                case 'keys' :
                    data = _.keys(data);
                    break;

                case 'values' :
                    data = _.values(data);
                    break;

            }

            if ('function' === typeof context) {
                data = context.apply(null, arguments);
            }

            return JSON.stringify(data);
        };
    });

define( 'awaitAll',
    /**
     *
     * @param {array} list
     * @param {function} callback
     * @returns {*}
     */
    function(list, callback) {
        return list.reduce( (promise, f) => promise.then( () => callback.call(null, f)), Promise.resolve());
    });