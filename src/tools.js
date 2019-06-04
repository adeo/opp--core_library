const _ = require('lodash');

exports.define = {

    prop: function prop(context, field, value, mods) {

        function define(field, value, mods) {
            Object.defineProperty(context, field, {
                value: value,
                enumerable: mods && mods.includes('e'),
                configurable: mods && mods.includes('c'),
                writable: mods && mods.includes('w')
            });

            return define;
        }

        if (arguments.length > 1) {
            return define(field, value, mods);
        } else {
            return define;
        }
    },

    accessor: function accessor(context, field, getset, mods) {

        function define(field, getset, mods) {
            var desc = {
                enumerable: mods && mods.includes('e'),
                configurable: mods && mods.includes('c')
            };

            if (getset.get) {
                desc.get = getset.get;
            }
            if (getset.set) {
                desc.set = getset.set;
            }

            Object.defineProperty(context, field, desc);

            return define;
        }

        if (arguments.length > 1) {
            return define(field, getset, mods);
        } else {
            return define;
        }
    },

};

function getMethods(Class, flag = getMethods.ALL) {
    let methods,
        proto = typeof Class === 'function' ? Class.prototype : Object.getPrototypeOf(Class),
        names = [];
    while (proto && proto !== Object.prototype) {
        methods = Object.getOwnPropertyNames(proto);
        if (flag === 0) { /* Do nothing */
        }
        else if (flag === 1)
            methods = methods.filter(method => ('get' in Object.getOwnPropertyDescriptor(proto, method)) || ('set' in Object.getOwnPropertyDescriptor(proto, method)));
        else if (flag === 2)
            methods = methods.filter(method => !('get' in Object.getOwnPropertyDescriptor(proto, method)) && !('set' in Object.getOwnPropertyDescriptor(proto, method)));
        names.push(...methods);
        proto = Object.getPrototypeOf(proto);
    }
    return _.pull(names, 'constructor');
};
getMethods.ALL       = 0;
getMethods.ACCESSORS = 1;
getMethods.METHODS   = 2;

exports.getMethods = getMethods;
