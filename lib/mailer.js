'use strict';

/* global nodeMailer, errorCode */

const nodemailer = require('nodemailer'),
    _ = require('lodash');

define( 'nodeMailer', {} );
define( '__events', {
    newUser: {
        id: 'new-user',
        label: 'Welcome Notification',
        description: 'The mail template use to send welcome email to newly registered user.',
        defaults: {
            subject: 'Welcome',
            body: ``
        }
    },
    resetPassword: {
        id: 'reset-password',
        label: 'Reset Password',
        description: 'The mail template used to send user a link to generate a new password.',
        defaults: {
            subject: 'Reset Password',
            body: ``
        }
    }
}, nodeMailer );

define( 'transport',
    function() {
        return nodemailer.createTransport(nodeMailer.__config);
    }, nodeMailer );

define( 'send',
    function({to, subject, body, header, attachments}, type) {
        let transport = nodeMailer.transport(),
            mail = {to, subject};

        type = type || 'text';

        mail[type] = body;
        mail.from = header.from;

        if (header.cc) {
            mail.cc = header.cc;
        }

        if (header.bc) {
            mail.bc = header.bc;
        }

        if (attachments) {
            mail.attachments = attachments;
        }

        return transport.sendMail(mail);
    }, nodeMailer );

define( 'addEvent',
    /**
     * Adds an mail event handler that will be available in the system.
     *
     * @param {string} eventName
     * @param {string} label
     * @param {string} description
     * @param {function} callback
     */
    function({eventName, label, description, callback}) {
        if (nodeMailer.__events[eventName] || !callback) {
            // Don't allow override
        }

        nodeMailer.__events[event] = {id, label, description, callback};
    }, nodeMailer );

define( 'trigger',
    /**
     *
     * @param {string} event
     * @param {string} to
     * @param {object} tokens
     * @returns {Promise<*[]>}
     */
    async function(event, to, tokens = {}) {
        if (!nodeMailer.__events[event]) {
            return [errorCode('noMailEvent')];
        }

        let mailEvent = nodeMailer.__events[event],
            [err, mail] = await Collection.Mail.get({event});

        if (err) {
            return [err];
        }

        mail = mail || {
            from: '', // todo: set default mail from
            subject: mailEvent.defaults.subject,
            content: mailEvent.defaults.content
        };

        let {from, subject, body, type} = mail;
        type = type || 'html';

        body = _.memoize(content => {
            if (tokens && !_.isEmpty(tokens)) {
                // Replace tokens with actual token value
                _.forEach( tokens, (value, name) => {
                    let regex = new RegExp(`\{${name}\}`, 'g');

                    content = content.replace(regex, value);
                });
            }

            return content;
        })(body);

        let header = {from};

        let done = await nodeMailer.send({to, subject, body, header}, type);

        if (_.isError(done)) {
            return [done];
        }

        return [null, true];
    }, nodeMailer );

module.exports = config => define( '__config', config, nodeMailer );