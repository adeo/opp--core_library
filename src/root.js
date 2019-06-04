const { define } = require('./tools');

module.exports = class Root {

    constructor(parent = null) {
        define.prop(this, '_parent', parent, 'c');
    }

    get _root() {
        let parent = this._parent;
        if (!parent)
            return this;
        while(parent._parent)
            parent = parent._parent;
        return parent;
    }

    get isRoot() {
        return this._root === this;
    }

}