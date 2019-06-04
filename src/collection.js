const ExtMap = require('./extMap');
const { define } = require('./tools');

const index     = Symbol('index');
const _indexer  = Symbol('_indexer');
const _makeKey  = Symbol('_makeKey');

module.exports = class List extends ExtMap {

    constructor(data, parent = null) {
        super(parent);
        define.prop(this, '_set', new Set(), 'cw');
        if (Array.isArray(data))
            this.set(...data);
        else if (data && 'toJSON' in data)
            this.set(...data.toJSON());
    }

    static get index() {
        return index;
    }
    
    reinitialize(data) {
        this.clear();
        this.set(...data);
    }

    *[Symbol.iterator]() {
        for (let item of this._set)
            yield item;
    }

    get size() {
        return this._set.size;
    }

    get _key() {
        return ['id'];
    }

    set(...args) {
        var result = [];
        for (let item of args) {
            for (let key of this[_indexer](item)) {
                if (super.has(key))
                    throw new Error(`Item [${this.constructor.name}] with key [${key}] already exists!`);
                super.set(key, item);
            }
            this._set.add(item);
            this._onItemSet(item);
            result.push(item);
        }
        return result.length === 1 ? result[0] : result;
    }

    get(...args) {
        let item, result;
        if (!Array.isArray(this._key[0]))
            return super.get(this[_indexer](args)[0]);
        result = [];
        for (let key of this[_indexer](args)) {
            item = super.get(key);
            if (item && !~result.indexOf(item))
                result.push(item);
        }
        return result.length ? (result.length > 1 ? result : result[0]) : false;
    }
    
    has(...args) {
        let item;
        if (!Array.isArray(this._key[0]))
            return super.has(this[_indexer](args)[0]);
        for (let key of this[_indexer](args)) {
            item = super.has(key);
            if (item)
                return true;
        }
        return false;
    }

    delete(...args) {
        let result, isIndexed, i, reIndex = [],
            items = this.get(...args);
        if (!Array.isArray(this._key[0])) {
            this._set.delete(items);
            result = super.delete(this[_indexer](args)[0]);
            i = 0;
            for (var item of this) {
                if (!(index in item))
                    break;
                item[index] = i++;
                reIndex.push(item.toJSON ? item.toJSON() : item);
            }
            if (reIndex.length)
                this.reinitialize(reIndex);
            return result;
        }
        if (!items)
            return false;
        items     = Array.isArray(items) ? items : [items];
        for (var item of items) {
            isIndexed = index in item;
            this._set.delete(item);
            for (let key of this[_indexer](item))
                super.delete(key);
        }
        if (isIndexed) {
            i    = 0;
            item = null;
            for (var item of this) {
                item[index] = i++;
                reIndex.push(item.toJSON ? item.toJSON() : item);
            }
            this.reinitialize(reIndex);
        }
        return true;
    }

    clear() {
        this._set.clear();
        super.clear();
    }

    getBy(criteria, all = false) {
        let res;
        if (Object.keys(criteria).length <= 0)
            return false;
        res = [];
        for1:for (let item of this) {
            for2:for (let field in criteria)
                if (item[field] != criteria[field])
                    continue for1;
            if (!all)
                return item;
            res.push(item);
        }
        if (res.length)
            return res;
        return false;
    }

    toJSON() {
        var result = [];
        for (var item of this)
            result.push(item.toJSON ? item.toJSON() : item);
        return result;
    }

    toArray() {
        var result = [];
        for (var item of this)
            result.push(item);
        return result;
    }

    [_indexer](item, result = [], key = this._key) {
        if (Array.isArray(key[0])) {
            for (let field of key)
                this[_indexer](item, result, field);
        }
        else {
            for (var k of key)
                if (k === index && !(index in item))
                    item[index] = this.size;
            result.push(this[_makeKey](key, Array.isArray(item) ? item : key.map(k => item[k])));
        }
        return result;
    }

    [_makeKey](key, val) {
        return key.map(k => String(k)).join('.')+'|'+val.join('.');
    }

    _onItemSet(item) {
    }

}
