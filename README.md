# bugcore

bugcore is a JavaScript library that provides a foundational architecture for
object oriented JS. It is designed to work both within node js as well as
directly in the browser.

bugcore provides a basic class model based on John Resig's [simple JavaScript
inheritance](http://ejohn.org/blog/simple-javascript-inheritance/). In addition
the library provides many basic data models and utility classes for common
object oriented patterns.


## Quick Examples

Creation of a new class
```javascript
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
    var SomeClass = Class.extend(Obj, {

        _constructor: function(a, b) {

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
    myMap.put("key1", "value1")'
    myMap.put("key2", "value2")'
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

The library is extremely robust and makes up the foundation of our architecture
for [airbug](http://airbug.com) so check out the docs for an overview of the
full power of what the code has to offer. If the library is missing something
you need, please let us know!


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

* `_class` {function(new:Base)} - The class to extend
* `declaration` {Object} - An object that declares the methods of the new class


__Returns__

* {function(new:Base)} - the newly created class


__Examples__

```js
    var BaseBall = Class.extend(Ball, {

        _constructor: function(diameter) {
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

### Obj#_constructor

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

### Obj#getInternalId

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

* {number} - the unique internal id for this instance. Unique only to this JS runtime.


__Examples__

```js
    var myObj       = new Obj();
    var internalId  = myObj.getInternalId();
```
