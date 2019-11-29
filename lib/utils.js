'use strict';

const Utils = exports,
    _ = require('lodash'),
    crypto = require('crypto'),
    encoding = 'aes-256-cbc',
    typeType = 'base64';

Utils.define = function(name, value, object = global) {
    if (object.hasOwnProperty(name)) {
        // Throw error
        return false;
    }

    Object.defineProperty( object, name, {
        value: value,
        writable: false
    });

    return true;
};
Utils.define( 'define', Utils.define );

define( 'setError',
    function(message, errCode) {
        let err = new Error();
        err.message = message;
        err.errCode = errCode;

        return err;
    });

define( 'isEmail',
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
    function (bytes, length, format) {
        bytes = bytes || 16;
        length = length || 64;
        format = format || typeType;

        return crypto.randomBytes(bytes)
            .toString(format)
            .slice( 0, length );
    });

define( 'generateHashKey',
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
                    return res(setError(null, 'systemError'));
                }

                key = [iv.toString(typeType), key.toString(typeType), SECRET_KEY];

                res(key.join(';)'));
            });

            cipher.write(uniqKey);
            cipher.end();
        });
    });

define( 'decryptHashKey',
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
                    return res(setError(null, 'systemError'));
                }

                match = match.toString();

                res(match);
            });
            decipher.write(encrypt);
            decipher.end();
        });
    });