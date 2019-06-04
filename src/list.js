const path = require('path');
const Collection = require('./collection');
const { define } = require('./tools');
const Item = require('./item');

module.exports = class List extends Collection {

    constructor(...args) {
        super(...args);
        define.prop(this, 'params', new Map(), 'w');
        define.prop(this, 'table', path.basename(this._filename, '.js'), '');
    }

    get _item() {
        return Item;
    }

    get _clearOnSet() {
        return false;
    }

    get _filename() {
        throw new Error('filename must be override!');
    }

    _cast(item) {
        return item;
    }

    set(...args) {
        this._clearOnSet && this.clear();
        return super.set(...args.map(item => { item = this._cast(item); return new this._item(item, this); }));
    }

    format() {
        var result = [];
        for (var item of this)
            result.push(item.format());
        return result;
    }

};