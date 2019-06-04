const { assert } = require('chai');
const library    = require('./../');

describe('library', function () {

    it('test', () => {
        let list;

        class List extends library.List {

            get _filename() {
                return __filename;
            }

            get _item() {
                return Item;
            }

        }

        class Item extends library.Item {

            initialize(...args) {
                this.id   = Item.Int;
                this.test = Item.Int;
                super.initialize(...args);
            }

        }

        list = new List();
        list.set({ id: 1, test: 1 }, { id: 2, test: 2 });
        assert(list.get(1).test === 1);
        assert(list.get(2).test === 2);
    });

});