'use strict';

const _ = require('lodash'),
    nodeMailer = require('nodemailer');

class MailerEvent {
    constructor() {
        this.events = {};
        this.reset = this.reset.bind(this);
    }

    reset() {
        this.events = {
            welcome: {
                event: 'welcome',
                label: 'Welcome Notification',
                description: 'The mail template use to send welcome email to newly registered user.',
                defaults: {
                    subject: 'Welcome',
                    body: ``
                }
            },
            resetPassword: {
                event: 'resetPassword',
                label: 'Reset Password',
                description: 'The mail template used to send user a link to generate a new password.',
                defaults: {
                    subject: 'Reset Password',
                    body: ``
                }
            }
        };
    }

    /**
     *
     * @param event
     * @param label
     * @param description
     * @param callback
     */
    add({event, label, description, callback}) {
        this.events[event] = _.omitBy({event, label, description, callback}, _.isUndefined);
    }

    send({to, subject, body, header, attachments, type}) {
        let transport = nodeMailer.createTransport(Simplified.__mailer),
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
    }

    async call(event, to, tokens) {
        if (!this.events[event]) {
            return [errorCode('noMailEvent')];
        }

        let mailEvent = this.events[event],
            [err, mail] = await Collection.Mailer.get({event});

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

        let done = await this.send({to, subject, body, header}, type);

        if (_.isError(done)) {
            return [done];
        }

        return [null, true];
    }
}

module.exports = () => new MailerEvent();