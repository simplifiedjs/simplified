'use strict';

const _ = require('lodash');

module.exports = {
    async get({ID, event}) {
        let [err, mail] = await Collection.Mail.Model.getRow( false, ID ? {ID} : {event});

        if (err || !mail ) {
            return [err, mail];
        }

        mail = await Collection.Mail.trigger( 'get', mail );

        return [null, mail];
    },

    set({ID, name, event, from, subject, content}) {
        const model = Collection.Mail.Model;
        let mail = _.omitBy({ID, name, event, from, subject, content}, _.isUndefined);

        if (ID) {
            // Do an update
            return model.update(mail, {ID});
        }

        return model.insert(mail);
    },

    remove({ID}) {
        return Collection.Mail.Model.delete({ID});
    }
};