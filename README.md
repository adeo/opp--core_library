# @core/library
A class representing a collection object. Able to self-initialize
cast data to specified types, as well as erase the composition
from other classes.

#### Why:
Helps to create convenient data structures without crutches and bicycles.

#### What:
Look up on description, and this is one of dependenies for [@core/core](https://github.com/adeo/opp--core_core) module.

```javascript
import { Item } from '@core/library';

class Volume extends Item {

  initialize(data, ...args) {
    this.sound = Example.Float;
    this.music = Example.Float;
    super.initialize(data, ...args);
  }

  default(data, ...args) {
     Volume.default(this, data, 'sound', 100);
     Volume.default(this, data, 'music', 100);
     super.default(data, ...args);
  }

}

class Game extends Item {
    
  initialize(data, ...args) {
    this.volume = Volume;
    this.health = Example.Int;
    this.items  = Example.Set;
    super.initialize(data, ...args);
  }
  
}

const game = new Game({
  volume: {
     sound: 51.3,
     music: 43.1,
  },
  health: 99,
  items: [1, 2, 3, 4]
});
```

```javascript
import { List } from '@core/library';

class Cats extends List {

  get _key() {
     return ['name'];
  }

}

const cats = new Cats([{ name: 'jim' }]);
cats.set({ name: 'tom' }, { name: 'tim' });
console.log(cats.get('tom')); // { name: 'tom' }
console.log(cats.size) // 3
```

## Maintainers
Leonid Levkin < Leonid.Levkin@leroymerlin.ru >