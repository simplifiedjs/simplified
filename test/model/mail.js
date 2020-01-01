'use strict';

/* global Simplified */

const {assert} = require('chai'),
    _ = require('lodash'),
    schema = require('../../lib/collection/mail/schema');

describe('Mail Collection Model', function() {
    it('Should create mail collection in the database.', async function() {
        let [err] = await createCollectionModel( 'Mailer', schema );

        assert.isNull(err);
    });

    const mailModel = Simplified.Collection.Mailer;
    let mailId;

    it('Should create mail template in the database.', async function() {
        let [err, id] = await mailModel.setTemplate({
            name: 'Test Mail',
            from: 'Admin <admin@local.info>',
            subject: 'Test mail here',
            content: 'This is a test email.',
            event: 'test-mail'
        });

        assert.isNull(err);
        assert.isTrue(_.isInteger(id));
        mailId = id;
    });

    it('Should get a single template from the database.', async function() {
        let [err, mail] = await mailModel.getTemplate({ID: mailId});

        assert.isNull(err);
        assert.isTrue(_.isEqual(mail.ID, mailId));
    });

    it('Should get a list of templates from the database.', async function() {
        let [err, templates] = await mailModel.templates();

        assert.isNull(err);
        assert.isArray(templates);
    });

    /**

    it('Should send email notification', async function() {
        this.timeout(50000);
        let res = await mailModel.send({
            mailId: mailId,
            to: 'webdevenquiry@gmail.com'
        });

        assert.isTrue(!_.isError(res));
    });
     **/

    it('Should remove mail collection from the database.', async function() {
        let [err] = await dropCollectionModel( 'Mailer' );

        assert.isNull(err);
    });
});