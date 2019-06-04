const { define, getMethods } = require('./tools');
const Root = require('./root');

class ExtMap extends Root {

    constructor(parent = null) {
        super(parent);
        define.prop(this, '_data', new Map(), 'cw');
    }

    *[Symbol.iterator]() {
        for (let item of this._data)
            yield item;
    }

    get size() {
        return this._data.size;
    }

}

for (let name of getMethods(Map, getMethods.METHODS))
    ExtMap.prototype[name] = function(...args) { return this._data[name](...args); };

module.exports = ExtMap;