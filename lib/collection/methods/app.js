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
            model = Collection.AppSetting.Model;

        if (name) {
            // Get the setting's value.
            return model.getValue('value', {name});
        }

        let where = {};

        if (autoload) {
            where.autoload = true;
        }

        return model.get({where});
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
            let [err, exist] = await model.getValue('value', {name: setting.name});

            if (err) {
                return errors++;
            }

            if (!exist) {
                return inserts.push(setting);
            }

            // Update setting
            let [err2] = await model.update(setting, {name: setting.name});

            if (err2) {
                errors++;
            }
        });

        if (!inserts.length) {
            model.end();

            return [errors.length ? error : true];
        }

        let [err, done] = await model.insert(inserts);
        model.end();

        return [err, done];
    },

    async remove({name}) {
        let model = Collection.AppSetting.Model;

        await model.delete({name});

        if (model.lastError) {
            return [errorCode('systemError')];
        }

        return [null, true];
    }
};