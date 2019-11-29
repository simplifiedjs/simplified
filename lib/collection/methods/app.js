'use strict';

const _ = require('lodash');

module.exports = {
    get({name, autoload}) {
        let where = {};

        if (autoload) {
            where.autoload = true;
        }

        return Collection.AppSetting.Model.get({where: where});
    },

    async set({name, value}) {
        const model = Collection.AppSetting.Model;

        // Check for existing setting
        let setting = await model.getValue('value', {name});

        if (setting) {
            // Do an update
            return model.update({name, value}, {name});
        }

        // Insert new setting
        return model.insert({name, value});
    },

    async bulkSet({setting = {}}) {
        const model = Collection.AppSetting.Model;

        let names = _.keys(setting),
            newSettings = [];

        // Check if it exist
        for (let i = 0; i < names.length; i++ ) {
            let name = names[i],
                value = setting[name],
                oldValue = await model.getValue('value', {name});

            if (oldValue) {
                // Do an update
                await model.update({name, value}, {name});

                continue;
            }

            newSettings[name] = value;
        }

        if (newSettings.length) {
            await model.insert(newSettings);
        }

        return true;
    },

    remove({name}) {
        return Collection.AppSetting.Model.delete({name});
    }
};