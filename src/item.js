const Root = require('./root');
const moment = require('moment');
const { define } = require('./tools');
const _ = require('lodash');

const Moment = moment().constructor;
const Types  = {};

[
    'Int',
    'String',
    'SafeString',
    'Float',
    'Bool',
    'Date',
    'NativeDate',
    'Object',
    'Array',
    'Json',
    'File',
    'Map',
    'Set',
].forEach(type => Types[type] = Symbol(type));

const _types    = Symbol('_types');
const _args     = Symbol('_args');
const _validate = Symbol('_validate');
const _define   = Symbol('_define');

class Item extends Root {

    constructor(data, parent = null, ...args) {
        super(parent);
        define.prop(this)
        ('_parent', parent, 'c')
        (_args, args)
        (_types, {}, 'w');
        Item[_define](this, data);
    }
    
    static [_validate](template, object, data, prop) {
        switch (template[prop]) {
            case Item.Int:
                object[prop] = parseInt(data[prop], 10) || 0;
                break;
            case Item.Float:
                object[prop] = parseFloat(data[prop]) || 0;
                break;
            case Item.String:
                object[prop] = String(data[prop]);
                break;
            case Item.Bool:
                object[prop] = Boolean(data[prop]);
                break;
            case Item.NativeDate:
                object[prop] = moment(data[prop]).toDate();
                break;
            case Item.Date:
                object[prop] = moment(data[prop]);
                break;
            case Item.Object:
                object[prop] = _.isObject(data[prop]) ? data[prop] : {};
                break;
            case Item.Array:
                object[prop] = Array.isArray(data[prop]) ? data[prop] : [];
                break;
            case Item.Json:
                try {
                    object[prop] = JSON.parse(data[prop]);
                } catch(e) {
                    object[prop] = null;
                }
                break;
            case Item.SafeString:
            case Item.File:
                object[prop] = data[prop] ? String(data[prop]) : '';
                break;
            case Item.Map:
                object[prop] = new Map(Array.isArray(data[prop]) ? data[prop] : []);
                break;
            case Item.Set:
                object[prop] = new Set(Array.isArray(data[prop]) ? data[prop] : []);
                break;
            default:
                if (object[prop] instanceof Function)
                    object[prop] = new object[prop](data[prop], object, ...object[_args]);
                else
                    object[prop] = data[prop];
                break;
        }
    }

    static [_define](object, data) {
        data = object.modifyData(data || {});
        object.initialize(data, ...object[_args]);
        for (let prop in object) {
            if (!object.hasOwnProperty(prop))
                continue;
            object[_types][prop] = object[prop];
            this[_validate](object, object, data, prop);
        }
        object.default(data, ...object[_args]);
        return object;
    }

    static default(object, data, field, value) {
        !(field in data) && (object[field] = value);
    }

    initialize(data, ...args) {
    }

    reinitialize(data) {
        data = this.modifyData(data || {});
        for (let prop in data) {
            if (!this.hasOwnProperty(prop))
                continue;
            if (typeof this[prop] === 'object' && this[prop] !== null && 'reinitialize' in this[prop])
                this[prop].reinitialize(data[prop]);
            else
                Item[_validate](this[_types], this, data, prop);
        }
        return this;
    }

    modifyData(data) {
        return data;
    }

    default(data, ...args) {
    }

    toJSON(...args) {
        var value, isObject, result = {};
        for (var field in this) {
            if (!this.hasOwnProperty(field))
                continue;
            value       = this[field];
            isObject    = typeof value === 'object';
            if (value == null)
                result[field] = value;
            else if (isObject && value instanceof Map)
                result[field] = [...value];
            else if (isObject && value instanceof Set)
                result[field] = [...value];
            else if (isObject && value instanceof Moment)
                result[field] = value.unix();
            else if (isObject && _.isFunction(value.toJSON))
                result[field] = value.toJSON(...args);
            else
                result[field] = value;
        }
        return result;
    }

    format() {
        var value, isObject, result = {};
        for (var field in this) {
            if (!this.hasOwnProperty(field))
                continue;
            if (_.startsWith(field, '_'))
                continue;
            value       = this[field];
            isObject    = typeof value === 'object';
            if (value == null)
                result[field] = value;
            else if (isObject && value instanceof Map)
                result[field] = [...value];
            else if (isObject && value instanceof Set)
                result[field] = [...value];
            else if (isObject && value instanceof Date)
                result[field] = +value;
            else if (isObject && value instanceof Moment)
                result[field] = value.unix();
            else if (isObject && _.isFunction(value.format))
                result[field] = value.format();
            else
                result[field] = value;
        }
        return result;
    }

}

Item.Int = Types.Int;
Item.String = Types.String;
Item.SafeString = Types.SafeString;
Item.Float = Types.Float;
Item.Bool = Types.Bool;
Item.Date = Types.Date;
Item.NativeDate = Types.NativeDate;
Item.Object = Types.Object;
Item.Array = Types.Array;
Item.Json = Types.Json;
Item.File = Types.File;
Item.Map = Types.Map;
Item.Set = Types.Set;

module.exports = Item;

