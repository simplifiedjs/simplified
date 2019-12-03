'use strict';

/* global Simplified, errorCode */

const _ = require('lodash'),
    Collection = Simplified.Collection;

module.exports = {
    /**
     * Get the application's setting value or a list of settings.
     *
     * @async
     *
     * @param {object} args
     * @returns {Array<*>}
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

        let [err, settings] = await model.get({where});

        if (settings) {
            settings = await Collection.AppSetting.trigger( 'get', settings );
        }

        return [err, settings];
    },

    /**
     * @async
     *
     * @param {array<object>} settings
     * @param {string} name
     * @param {*} value
     * @param {boolean} autoload
     * @returns {Array<*>}
     */
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

            return [errors.length ? error : errorCode('insertError')];
        }

        let [err, done] = await model.insert(inserts);
        model.end();

        return [err, done];
    },

    /**
     *
     * @async
     *
     * @param {string|array<string>} name
     * @returns {Array<Error, *>}
     */
    remove({name}) {
        if (_.isArray(name)) {
            return Collection.AppSetting.Model.delete({name: {$in: name}});
        }

        return Collection.AppSetting.Model.delete({name});
    }
};