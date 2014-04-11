# bugcore

bugcore is a JavaScript library that provides a foundational architecture for
object oriented JS. It is designed to work both within node js as well as
directly in the browser.

bugcore provides a basic class model based on John Resig's [simple JavaScript
inheritance](http://ejohn.org/blog/simple-javascript-inheritance/). In addition
the library provides many basic data models and utility classes for common
object oriented patterns.

The library is extremely robust and makes up the foundation of our architecture
for [airbug](http://airbug.com) so check out the docs for an overview of the
full power of what the code has to offer. If the library is missing something
you need, please let us know!

Latest Version `0.1.9`


## Quick Examples

Creation of a new class
```javascript
var Class   = bugcore.Class;
var Obj     = bugcore.Obj;

var SomeClass = Class.extend(Obj, {});
```

Creation of a new class with a constructor
```javascript
var SomeClass = Class.extend(Obj, {
    _constructor: function() {
        this._super(); // Call super constructor
    }
});
```

Creation of a new class with overridden equals and hashCode methods
```javascript
/**
 * @class
 * @extends {Obj}
 */
var SomeClass = Class.extend(Obj, {

    /**
     * @constructs
     * @param {number} a
     * @param {number} b
     */
    _constructor: function(a, b) {

        this._super(); // Call super constructor

        /**
         * @private
         * @type {number}
         */
        this.a = a;

        /**
         * @private
         * @type {string}
         */
        this.b = b
    },

    /**
     * @override
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, SomeClass)) {
            return (Obj.equals(value.a, this.a) && Obj.equals(value.b, this.b));
        }
        return false;
    },

    /**
     * @override
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[SomeClass]" +
                Obj.hashCode(this.a) + Obj.hashCode(this.b));
        }
        return this._hashCode;
    },
});
```

Use of a Map
```javascript
var myMap = new bugcore.Map();
myMap.put("key1", "value1");
myMap.put("key2", "value2");
myMap.get("key1");      // "value1"
myMap.get("key2");      // "value2"
```

Use of a Map with instances as keys
```javascript
var myMap       = new bugcore.Map();

// SomeClass is from the above example that uses overridden equals and hashCode methods
var instance1   = new SomeClass(123, "abc");
var instance2   = new SomeClass(123, "abc");
myMap.put(instance1, "value");
myMap.put(instance2, "value2");

//hash codes and equality checks are equal therefore the two instances are considered
//the same key even though they are separate instances in memory
myMap.getCount();       // 1
myMap.get(instance1)    // "value2"
myMap.get(instance2)    // "value2"
```

## Download

The source is available for download from [GitHub](https://github.com/airbug/bugcore)

For node js, you can install using Node Package Manager [npm](https://www.npmjs.org/package/bugcore)

    npm install bugcore

For the web, you can access the scripts here

    https://s3.amazonaws.com/public-airbug/bugcore-0.1.9.js
    https://s3.amazonaws.com/public-airbug/bugcore-0.1.9.min.js


## Usage

In node js:

```javascript
var bugcore = require('bugcore');

var map     = new bugcore.Map();
```

In the browser:

```html
<script type="text/javascript" src="https://s3.amazonaws.com/public-airbug/bugcore-0.1.9.js"></script>
<script type="text/javascript">

    var map = new bugcore.Map();

</script>
```


## Documentation

### Core System

* [`Class`](#Class)
* [`Constructor`](#Constructor)
* [`Interface`](#Interface)
* [`Obj`](#Obj)

### Core Interfaces

* [`IClone`](#IClone)
* [`IEquals`](#IEquals)
* [`IHashCode`](#IHashCode)

### Data Models

* [`Collection`](#Collection)
* [`List`](#List)
* [`Map`](#Map)
* [`Pair`](#Pair)
* [`Queue`](#Queue)
* [`Set`](#Set)
* [`Stack`](#Stack)


<a name="Class" />
## Class

Core class used to build other classes.

__Class__

```javascript
/**
 * @constructor
 */
var Class = function() {
```


__Getters and Setters Summary__

* [`public getInterfaces() :Array.<Interface>`](#Class_getInterfaces)
* [`public getSuperClass() :Class`](#Class_getSuperClass)


__Static Method Summary__

* [`static declare(Object declaration) :function(new:Constructor)`](#Class-declare)
* [`static extend(function(new:Constructor) constructor, Object declaration) :function(new:Constructor)`](#Class-extend)


<a name="Class-declare" />
### Class.declare

This method is used to declare a low level base class in the bugcore system. Most of the
time you should not use this method to declare new classes unless you are sure of what
you are doing. Instead use the [Class.extend](#Class-extend) method and extend Obj. By
using this method, it will exclude many of the base methods that the rest of the bugcore
system depends upon, including hashCode, equals, _internalId, and clone

__Method__

```javascript
/**
 * @static
 * @param {Object} declaration
 * @return {function(new:Constructor)}
 */
Class.declare = function(declaration) {
```

__Parameters__

* `declaration {Object}` - An object that declares the methods of the new class.


__Returns__

* `{function(new:Constructor)}` - The newly created class's constructor.


__Examples__

```js
var LowestLevelObject = Class.declare({
    _constructor: function() {
        // No need to call this._super, this is the lowest level.
    }
});
```

<a name="Class-extend" />
### Class.extend

__Method__

```javascript
/**
 * @static
 * @param {function(new:Constructor)} constructor
 * @param {Object} declaration
 * @return {function(new:Constructor)}
 */
Class.extend = function(constructor, declaration) {
```

__Parameters__

* `constructor {function(new:Constructor)}` - The constructor of the class to extend.
* `declaration {Object}` - An object that declares the methods of the new class.


__Returns__

* `{function(new:Constructor)}` - The newly created class's constructor.


__Examples__

```js
var BaseBall = Class.extend(Ball, {

    _constructor: function(diameter) {
        this._super(); // Call super constructor
        this.diameter = diameter;
    }

    throwBall: function() {

    }
});
```


<a name="Constructor" />
## Constructor

Represents the base instantiable constructor function of all classes declared in the
BugCore system using [Class.declare](#Class-declare)

__Class__

```javascript
/**
 * @constructor
 */
var Constructor = function() {
```


__Getters and Setters Summary__

* [`public getClass() :Class`](#Constructor_getClass)


<a name="Constructor_getClass" />
### Constructor#getClass

Get the Class for this instance.

__Method__

```javascript
/**
 * @return {Class}
 */
getClass: function() {
```

__Parameters__

* None


__Returns__

* `{Class}` - The Class of this instance.


__Examples__

```js
//TODO BRN: Provide example of Class usage
```


<a name="Obj" />
## Obj

The root class of all other classes in the bugcore library. Provides basic functionality such as hash code support,
equality checks and clone support.

__Class__

```javascript
/**
 * @class
 * @implements {IClone}
 * @implements {IEquals}
 * @implements {IHashCode}
 */
var Obj = Class.declare({
```

__Interfaces__

* [`IClone`](#IClone)
* [`IEquals`](#IEquals)
* [`IHashCode`](#IHashCode)


__Constructor Summary__

* [`public _constructor()`](#Obj__constructor)


__Getters and Setters Summary__

* [`public getClass()           :Class`](#Obj_equals)
* [`public getInternalId()      :number`](#Obj_getInternalId)


__Method Summary__

* [`public clone(boolean deep)  :*`](#Obj_clone)
* [`public equals(* value)      :boolean`](#Obj_equals)
* [`public hashCode()           :number`](#Obj_hashCode)


__Static Method Summary__

* [`static clone(A value, boolean deep)     :A`](#Obj-clone)
* [`static equals(* value1, * value2)       :boolean`](#Obj-equals)
* [`static hashCode(* value)                :number`](#Obj-hashCode)


<a name="Obj__constructor" />

### Obj#_constructor()

__Method__

```javascript
/**
 * @constructs
 */
_constructor: function() {
```

__Parameters__

* None


__Examples__

```js
var myObj = new Obj();
```

<a name="Obj_getInternalId" />

### Obj#getInternalId()

__Method__

```javascript
/**
 * @return {number}
 */
getInternalId: function() {
```

__Parameters__

* None


__Returns__

* `{number}` - The unique internal id for this instance. Unique only to this JS runtime.


__Examples__

```js
var myObj       = new Obj();
var internalId  = myObj.getInternalId();
```

<a name="Obj_clone" />
### Obj#clone(deep)

By default the clone method will use the instance's Class to instantiate a new instance.
It will also iterate through the instance's properties and attempt to clone all properties
that are not functions. If a deep clone is being performed, then the clone method will
attempt to create a deep copy of each property. If a shallow clone is being performed
then a reference to the property value will be set on the new instance.

NOTE: _internalId is not cloned for deep or shallow clones. Therefore the clone instance
is unique from that of the original.

__Method__

```javascript
/**
 * @param {boolean=} deep
 * @return {*}
 */
clone: function(deep) {
```

__Parameters__

* `deep {boolean=}` - Whether or not to perform a deep clone. Optional - default: false


__Returns__

* `{*}` - A clone of the instance.


__Examples__

```js
var myObj               = new Obj();
var shallowCloneObj     = myObj.clone();     //shallow clone
var deepCloneObj        = myObj.clone(true); //deep clone
```


<a name="Obj_equals" />
### Obj#equals(value)

By default, the equality check will compare this instances _internalId to the value parameter.

__Method__

```javascript
/**
 * @param {*} value
 * @return {boolean}
 */
equals: function(value) {
```

__Parameters__

* `value {*}` - The value to compare to for equality.


__Returns__

* `{boolean}` - Whether or not the instance is equal to the value parameter.


__Examples__

Two different instances are not equal
```js
var obj1   = new Obj();
var obj2   = new Obj();
obj1.equals(obj2);      //false
```

An instance is equal to itself
```js
var obj1   = new Obj();
obj1.equals(obj1);      //true
```

Clones are not equal unless the 'equals' method is overridden
```js
var obj         = new Obj();
var objClone    = obj.clone();
obj.equals(objClone);      //false
```

```js
var obj         = new Obj();
var objClone    = obj.clone(true);
obj.equals(objClone);      //false
```


<a name="Obj_hashCode" />
### Obj#hashCode()

NOTE: If two instances are equal, they should return the same hash code.
NOTE: Equal hash codes is not a guarantee of equality.

__Method__

```javascript
/**
 * @return {number}
 */
hashCode: function() {
```

__Parameters__

* None


__Returns__

* `{number}` - The hash code of this instance.


__Examples__

Get hash code of instance
```js
var obj         = new Obj();
var hashCode    = obj.hashCode();
```


<a name="Obj-clone" />
### Obj.clone(value, deep)

Clones the value parameter.

If the value implements IClone the clone() method will be called to perform a clone of
the value. If the value is a basic value such as a number or string it will simply be
passed through.

__Method__

```javascript
/**
 * @static
 * @param {A} value
 * @param {boolean=} deep
 * @return {A}
 * @template A
 */
Obj.clone = function(value, deep) {
```

__Parameters__

* `value {A}` - The value to clone.
* `deep {boolean=}` - Whether or not to perform a deep clone. Optional - default: false


__Returns__

* `{A}` - A clone of the value.


__Examples__

```js
var myObj               = new Obj();
var shallowCloneObj     = Obj.clone(myObj);         //shallow clone
```

```js
var myObj               = new Obj();
var deepCloneObj        = Obj.clone(myObj, true);   //deep clone
```

```js
var myString            = "abc123";
var cloneString         = Obj.clone(myString);      //"abc123"
```


<a name="Obj-equals" />
### Obj.equals(value1, value2)

Checks value1 and value2 for equality.

If value1 implements IEquals, the value1.equals() method will be used to perform
the equality check. Otherwise === is used to compare the two values.

__Method__

```javascript
/**
 * @static
 * @param {*} value1
 * @param {*} value2
 * @return {boolean}
 */
Obj.equals = function(value1, value2) {
```

__Parameters__

* `value1 {*}` - The value to compare value2 to for equality.
* `value2 {*}` - The value to compare value1 to for equality.


__Returns__

* `{boolean}` - Whether or not the two values are equal.


__Examples__

Two different instances are not equal
```js
var obj1   = new Obj();
var obj2   = new Obj();
Obj.equals(obj1, obj2);      //false
```

An instance is equal to itself
```js
var obj1   = new Obj();
Obj.equals(obj1, obj1);      //true
```

Strings of the same value are equal
```js
var string1 = "mystring";
var string2 = "mystring";
Obj.equals(string1, string2) //true
```

Undefined and null are not equal
```js
var undefinedValue  = undefined;
var nullValue       = null;
Obj.equals(undefinedValue, nullValue) //false
```


<a name="Obj-hashCode" />
### Obj.hashCode(value)

Returns the hashCode of the value. If the value implements IHashCode, then the
value.hashCode() method will be used to generate the hash code.

__Method__

```javascript
/**
 * @static
 * @param {*} value
 * @return {number}
 */
Obj.hashCode = function(value) {
```

__Parameters__

* `value {*}` - The value to generate a hash code for..


__Returns__

* `{number}` - The hash code of the value.


__Examples__

Get hash code of an instance.
```js
var myObj       = new Obj();
var hashCode    = Obj.hashCode(myObj);
```

Get hash code of a string.
```js
var myString    = "abc123";
var hashCode    = Obj.hashCode(myString);
```


<a name="Collection" />
## Collection

The root class of several of the data objects. A collection represents a group of items.
A Collection instance on its own allows for duplicate elements.

__Class__

```javascript
/**
 * @class
 * @extends {Obj}
 * @implements {IArrayable}
 * @implements {ICollection.<I>}
 * @implements {IIterable}
 * @template I
 */
var Collection = Class.extend(Obj, /** @lends {Collection.prototype} */{
```

__Extends__
* [`Obj`](#Obj)


__Interfaces__

* [`IArrayable`](#IArrayable)
* [`ICollection`](#ICollection)
* [`IIterable`](#IIterable)


__Constructor Summary__

* [`public _constructor(items)`](#Collection__constructor)


__Getters and Setters Summary__

* [`public getHashStore()       :HashStore`](#Collection_getHashStore)


__Method Summary__

* [`public add(I item):boolean`](#Collection_add)
* [`public addAll((ICollection.<I> | Array.<I>) items)`](#Collection_addAll)
* [`public clear()`](#Collection_clear)
* [`public contains(* value):boolean`](#Collection_contains)
* [`public containsAll((ICollection.<*> | Array.<*>) values):boolean`](#Collection_containsAll)
* [`public containsEqual((ICollection.<*> | Array.<*>) values):boolean`](#Collection_containsAll)
* [`public forEach(function(I) func)`](#Collection_forEach)
* [`public getCount():number`](#Collection_getCount)
* [`public getValueArray():Array.<I>`](#Collection_getValueArray)
* [`public getValueCount(* value):number`](#Collection_getValueCount)
* [`public isEmpty():boolean`](#Collection_isEmpty)
* [`public iterator():IIterator`](#Collection_iterator)
* [`public remove(* value):boolean`](#Collection_remove)
* [`public removeAll((ICollection.<*> | Array.<*>) values)`](#Collection_removeAll)
* [`public retainAll((ICollection.<*> | Array.<*>) values)`](#Collection_retainAll)
* [`public toArray():Array.<I>`](#Collection_retainAll)


<a name="Collection__constructor" />

### Obj#_constructor(items)

__Method__

```javascript
/**
 * @constructs
 * @param {(ICollection.<I>; | Array.<I>)=} items
 */
_constructor: function(items) {
```

__Parameters__

* `items {(ICollection.<I> | Array.<I>)=}` - Starting items to add to the Collection (Optional)


__Examples__

No parameters
```js
var myCollection = new Collection();
```

Array parameter
```js
var items          = [
    "item1",
    "item2"
];
var myCollection    = new Collection(values);
```


Array parameter
```js
var itemsCollection     = new Collection([
    "item1",
    "item2"
]);
var myCollection        = new Collection(itemsCollection);
```

<a name="Collection_getHashStore" />

### Collection#getHashStore()

__Method__

```javascript
/**
 * @return {HashStore}
 */
getHashStore: function() {
```

__Parameters__

* None


__Returns__

* `{HashStore}` - The underlying HashStore that supports this Collection


__Examples__

```js
var myCollection    = new Collection();
var hashStore       = myCollection.getHashStore();
```

<a name="Collection_add" />
### Collection#add(item):boolean

Adds an item to the collection

__Method__

```javascript
/**
 * @param {I} item
 * @return {boolean}
 */
add: function(item) {
```

__Parameters__

* `item {I}` - The item to add to the collection


__Returns__

* `{boolean}` - Whether or not the item was added to the collection.


__Examples__

```js
var myCollection        = new Collection();
var myItem              = "myItem";
var result              = myCollection.add(myItem); // true
```


<a name="Obj_addAll" />
### Collection#addAll(items)

Adds an Array or Collection of items to the Collection

__Method__

```javascript
/**
 * @param {(ICollection.<I> | Array.<I>)} items
 */
addAll: function(items) {
```

__Parameters__

* `items {(ICollection.<I> | Array.<I>)}` - The items to add to the collection. Can either be an Array or another Collection.


__Returns__

* None


__Examples__

Add an array of items.
```js
var myCollection    = new Collection();
var myItems         = [
    "item1",
    "item2"
];
myCollection.addAll(myItems);
```

Add a Collection of items.
```js
var myCollection    = new Collection();
var itemsCollection = new Collection([
    "item1",
    "item2"
]);
myCollection.addAll(itemsCollection);
```


<a name="Collection_clear" />
### Collection#clear()

Removes all of the items from this collection.

__Method__

```javascript
/**
 *
 */
clear: function() {
```

__Parameters__

* None


__Returns__

* None


__Examples__

Empty the Collection
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.getCount();    // 2

myCollection.clear();
myCollection.getCount();    // 0
```

<a name="Collection_contains" />
### Collection#contains(value):boolean

Checks the Collection to see if it contains a value.

__Method__

```javascript
 /**
 * @param {*} value
 * @return {boolean}
 */
contains: function(value) {
```

__Parameters__

* `value {*}` - The value that we're checking if the collection contains.


__Returns__

* `{boolean}`


__Examples__

Value not contained
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.contains("item3");    // false
```

Value contained
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.contains("item2");    // true
```

<a name="Collection_containsAll" />
### Collection#containsAll(values):boolean

Checks the Collection to see if it contains all of the values in the given argument.
If ALL of the values are contained by the collection, this method will return true.
Otherwise, false.

NOTE  Multiple elements are ignored in this function.
e.g. Collection[0,1] containsAll Collection[0,1,1,1] is true
If you want to check for exact equality, use the equals function.

NOTE Empty collections are always contained by another collection
e.g. Collection[0,1] containsAll Collection[] is true

__Method__

```javascript
/**
 * @param {(ICollection.<*> | Array.<*>)} values
 * @return {boolean}
 */
containsAll: function(values) {
```

__Parameters__

* `values {(ICollection.<*> | Array.<*>)} ` - The values that we're checking to see if the collection contains all of them.


__Returns__

* `{boolean}`


__Examples__

Values not contained
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.containsAll(["item3"]);                        // false
```

Partial values contained are not a match.
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.containsAll(["item2", "item3"]);               // false
```

Values contained
```js
var myCollection    = new Collection([
    "item1",
    "item2",
    "item3"
]);
myCollection.containsAll(["item2", "item3"]);               // true
```

Exact match is true
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.containsAll(["item1", "item2"]);               // true
```

Multiple elements are ignored. Match is true.
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.containsAll(["item1", "item2", "item2"]);      // true
```

Empty collections are contained by any collection
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.containsAll([]);                               // true
```
