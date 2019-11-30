'use strict';

/* global Collection, errorCode */

const _ = require('lodash');

module.exports = {
    /**
     * Get the application's setting value or a list of settings.
     *
     * @param {object} args
     * @returns {Promise<*[]>}
     */
    async get(args) {
        args = args || {};

        const {name, autoload} = args,
            model = Collection.AppSetting.Model,
            error = errorCode('systemError');

        if (name) {
            // Get the setting's value.
            let value = await model.getValue('value', {name});

            return [model.lastError ? error : null, value];
        }

        let where = {};

        if (autoload) {
            where.autoload = true;
        }

        let setting = await model.get({where});

        return [model.lastError ? error : null, setting];
    },

    async set({settings, name, value, autoload}) {
        const model = Collection.AppSetting.Model;

        // Ready for multi request
        model.multi();

        if (!settings && _.isEmpty(settings)) {
            settings = [{name, value, autoload}];
        }

        let inserts = [],
            errors = 0,
            error = errorCode('systemError');

        await awaitAll(settings, async setting => {
            let exist = await model.getValue('value', {name: setting.name});

            if (model.lastError) {
                return errors++;
            }

            if (!exist) {
                return inserts.push(setting);
            }

            // Update setting
            await model.update(setting, {name: setting.name});

            if (model.lastError) {
                errors++;
            }
        });

        if (!inserts.length) {
            model.end();

            return [errors.length ? error : true];
        }

        await model.insert(inserts);
        model.end();

        return [model.lastError || errors ? error : null, true];
    },

    remove({name}) {
        return Collection.AppSetting.Model.delete({name});
    }
};