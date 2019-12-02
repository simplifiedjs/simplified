'use strict';

const {assert} = require('chai'),
    _ = require('lodash'),
    schema = require('../../lib/collection/schema/mail');

describe('Mail Collection Model', function() {
    it('Should mail collection in the database.', async function() {
        let [err] = await createCollectionModel( 'Mail', schema );

        assert.isNull(err);
    });

    const mailModel = Collection.Mail;
    let mailId;

    it('Should create mail template in the database.', async function() {
        let [err, id] = await mailModel.set({
            name: 'Test Mail',
            from: 'Admin <admin@local.info>',
            subject: 'Test mail here',
            content: 'This is a test email.'
        });

        assert.isNull(err);
        assert.isTrue(_.isInteger(id));
        mailId = id;
    });

    it('Should get template data from the database.', async function() {
        let [err, mail] = await mailModel.get({ID: mailId});

        assert.isNull(err);
        assert.isTrue(_.isEqual(mail.ID, mailId));
    });

    it('Should send email notification', async function() {
        this.timeout(50000);
        let res = await mailModel.send({
            mailId: mailId,
            to: 'webdevenquiry@gmail.com'
        });

        assert.isTrue(!_.isError(res));
    });

    it('Should remove mail collection from the database.', async function() {
        let [err] = await dropCollectionModel( 'Mail' );

        assert.isNull(err);
    });
});