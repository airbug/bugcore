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

//hash codes and equality checks are equal therefore the two instances are considered the same key even though
//they are separate instances in memory
myMap.getCount();       // 1
myMap.get(instance1)    // "value2"
myMap.get(instance2)    // "value2"
```

## Download

The source is available for download from
[GitHub](https://github.com/airbug/bugcore)
Alternatively, you can install using Node Package Manager [npm](https://www.npmjs.org/package/bugcore)

    npm install bugcore


## In the Browser

Usage:

```html
<script type="text/javascript" src="bugcore.js"></script>
<script type="text/javascript">

    var map = new bugcore.Map();

</script>
```


## Documentation

### Class System

* [`Base`](#Base)
* [`Class`](#Class)
* [`Interface`](#Interface)
* [`Obj`](#Obj)

### Interfaces

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

Core static class used to build other classes.

### Class.extend

__Method__

```javascript
/**
 * @static
 * @param {function(new:Base)} _class
 * @param {Object} declaration
 * @return {function(new:Base)}
 */
Class.extend = function(_class, declaration) {
```

__Parameters__

* `_class` {function(new:Base)} - The class to extend.
* `declaration` {Object} - An object that declares the methods of the new class.


__Returns__

* {function(new:Base)} - The newly created class.


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

* {number} - The unique internal id for this instance. Unique only to this JS runtime.


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

* `deep` {boolean=} - Whether or not to perform a deep clone. Optional - default: false


__Returns__

* {*} - A clone of the instance.


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

* `value` {*} - The value to compare to for equality.


__Returns__

* {boolean} - Whether or not the instance is equal to the value parameter.


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

* {number} - The hash code of this instance.


__Examples__

Get hash code of instance
```js
var obj         = new Obj();
var hashCode    = obj.hashCode();
```
