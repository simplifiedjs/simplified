'use strict';

/* global Simplified */

const _ = require('lodash'),
    Collection = Simplified.Collection;

module.exports = {
    send(args) {
        return Collection.Mailer.Event.send(args);
    },

    templates() {
        return Collection.Mailer.Model.get({});
    },

    async getTemplate({ID, event}) {
        let [err, mail] = await Collection.Mailer.Model.getRow( false, ID ? {ID} : {event});

        if (err || !mail ) {
            return [err, mail];
        }

        mail = await Collection.Mailer.trigger( 'get', mail );

        return [null, mail];
    },

    setTemplate({ID, name, event, from, subject, content}) {
        const model = Collection.Mailer.Model;
        let mail = _.omitBy({ID, name, event, from, subject, content}, _.isUndefined);

        if (ID) {
            // Do an update
            return model.update(mail, {ID});
        }

        return model.insert(mail);
    },

    removeTemplate({ID}) {
        return Collection.Mailer.Model.delete({ID});
    }
};