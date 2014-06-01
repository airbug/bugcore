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

Latest Version `0.2.8`

NOTE: This documentation is still being written. If you click on a link and it
doesn't go anywhere, it's likely because that portion of the docs hasn't been
written yet. If there are parts of the docs you'd like us to focus on, feel
free to ask!


## Quick Examples

Creation of a new class
```javascript
var Class   = bugcore.Class;
var Obj     = bugcore.Obj;

var SomeClassConstructor = Class.extend(Obj, {});
```

Creation of a new class with an internal _constructor method
```javascript
var SomeClassConstructor = Class.extend(Obj, {
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
var SomeClassConstructor = Class.extend(Obj, {

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


## Dependencies

bugcore is dependent upon the [bugpack](https://github.com/airbug/bugpack) framework


## Download Source

The source is available for download from [GitHub](https://github.com/airbug/bugcore)

From the web, you can download the packaged scripts here

    https://s3.amazonaws.com/public-airbug/bugcore-0.2.8.js
    https://s3.amazonaws.com/public-airbug/bugcore-0.2.8.min.js


## Install

For node js, you can install using Node Package Manager [npm](https://www.npmjs.org/package/bugcore)

    npm install bugcore

For the web, simply include these scripts in your application

```html
<script type="text/javascript" src="https://s3.amazonaws.com/public-airbug/bugpack-0.1.12.min.js"></script>
<script type="text/javascript" src="https://s3.amazonaws.com/public-airbug/bugcore-0.2.8.min.js"></script>
```


## Usage

In node js:

npm will install the bugpack dependency

```javascript
var bugcore = require('bugcore');

var map     = new bugcore.Map();
```

In the browser:

```html
<script type="text/javascript" src="https://s3.amazonaws.com/public-airbug/bugpack-0.1.12.js"></script>
<script type="text/javascript" src="https://s3.amazonaws.com/public-airbug/bugcore-0.2.8.js"></script>
<script type="text/javascript">

    var map = new bugcore.Map();

</script>
```


## Documentation

### Core System

* [`Class`](#Class)
* [`Constructor`](#Constructor)
* [`Implementable`](#Implementable)
* [`Interface`](#Interface)
* [`Obj`](#Obj)

### Core Interfaces

* [`IClone`](#IClone)
* [`IEquals`](#IEquals)
* [`IHashCode`](#IHashCode)

### Throwables

* [`Bug`](#Bug)
* [`Exception`](#Exception)
* [`Throwable`](#Throwable)

### Data Classes

* [`Collection`](#Collection)
* [`HashStore`](#HashStore)
* [`HashTable`](#HashTable)
* [`List`](#List)
* [`Map`](#Map)
* [`Pair`](#Pair)
* [`Queue`](#Queue)
* [`Set`](#Set)
* [`Stack`](#Stack)
* [`Striped`](#Striped)

### Data Interfaces

* [`IArrayable`](#IArrayable)
* [`ICollection`](#ICollection)
* [`IIterable`](#IIterable)
* [`IIterator`](#IIterator)
* [`IList`](#IList)
* [`IMap`](#IMap)
* [`IObjectable`](#IObjectable)
* [`ISet`](#ISet)

### Event System

* [`Event`](#Event)
* [`EventDispatcher`](#EventDispatcher)
* [`EventPropagator`](#EventPropagator)
* [`EventReceiver`](#EventReceiver)

### Event Interfaces

* [`IEventDispatcher`](#IEventDispatcher)
* [`IEventPropagator`](#IEventPropagator)
* [`IEventReceiver`](#IEventReceiver)

### Concurrent Classes

* [`Lock`](#Lock)
* [`Semaphore`](#Semaphore)

### Proxy Classes

* [`Proxy`](#Proxy)
* [`ProxyMethod`](#ProxyMethod)
* [`ProxyObject`](#ProxyObject)
* [`ProxyProperty`](#ProxyProperty)

### Proxy Interfaces

* [`IProxy`](#IProxy)

### Utils

* [`ArgUtil`](#ArgUtil)
* [`ArrayUtil`](#ArrayUtil)
* [`DateUtil`](#DateUtil)
* [`HashUtil`](#HashUtil)
* [`IdGenerator`](#IdGenerator)
* [`MathUtil`](#MathUtil)
* [`StringUtil`](#StringUtil)
* [`TypeUtil`](#TypeUtil)


<br /><a name="Class" />
## Class

Core class used to build other classes.


__Class__

```javascript
/**
 * @constructor
 * @param {function(new:Constructor)} constructor
 * @param {Array.<Interface>} interfaces
 * @param {string} name
 * @param {Class} superclass
 */
var Class = function(constructor, interfaces, name, superclass) {
```
[View code](https://github.com/airbug/bugcore/blob/v0.2.8/projects/bugcore/js/src/core/Class.js)


__Constructor Summary__

Access | Signature
--- | ---
constructor | <code>[Class](#Class_constructor)({[Constructor](#Constructor)} constructor, {[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[Interface](#Interface)&gt;} interfaces, {string} name, {[Class](#Class)} superclass)</code>


__Getters and Setters Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[getConstructor](#Class_getConstructor)()</code> | <code>{function(new:[Constructor](#Constructor))}</code>
public | <code>[getInterfaces](#Class_getInterfaces)()</code> | <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[Interface](#Interface)&gt;}</code>
public | <code>[getName](#Class_getName)()</code> | <code>{string}</code>
public | <code>[getSuperclass](#Class_getSuperclass)()</code> | <code>{[Class](#Class)}</code>


__Method Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[newInstance](#Class_newInstance)()</code> | <code>{[Constructor](#Constructor)}</code>


__Static Method Summary__

Access | Signature | Return Type
--- | --- | ---
static public | <code>[declare](#Class-declare)({[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).&lt;string, *&gt;} declaration)</code> | <code>{function(new:[Constructor](#Constructor))}</code>
static public | <code>[doesExtend](#Class-doesExtend)({*} value, {function(new:[Constructor](#Constructor))} constructor)</code> | <code>{boolean}</code>
static public | <code>[doesImplement](#Class-doesImplement)({*} value, {function(new:[Implementable](#Implementable))} implementable)</code> | <code>{boolean}</code>
static public | <code>[extend](#Class-extend)({function(new:[Constructor](#Constructor))} constructor, {[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).&lt;string, *&gt;} declaration)</code> | <code>{function(new:[Constructor](#Constructor))}</code>
static public | <code>[implement](#Class-implement)({function(new:[Constructor](#Constructor))} constructor, {function(new:[Implementable](#Implementable))} implementable)</code> | None


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class_constructor" />
### Class(constructor, interfaces, name, superclass)


__Method__

```javascript
/**
 * @constructor
 * @param {function(new:Constructor)} constructor
 * @param {Array.<Interface>} interfaces
 * @param {string} name
 * @param {Class} superclass
 */
var Class = function(constructor, interfaces, name, superclass) {
```


__Parameters__

Name | Type | Description
--- | --- | ---
`constructor` | <code>{function(new:[Constructor](#Constructor)}</code> | The Constructor of this class.
`interfaces` | <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).<[Interface](#Interface)>}</code> | Any Interfaces that this Class implements.
`name` | <code>{string}</code> | The name of this Class.
`superclass` | <code>{[Class](#Class)}</code> | The superclass of this Class.


__Examples__

```js
var myClass = new Class(constructor, interfaces, name, superclass);
```

<br />
------------------------------------------------------------------------------------
<br />

<a name="Class_getConstructor" />
### Class#getConstructor()

Get the Class's Constructor function


__Method__

```javascript
/**
 * @return {function(new:Constructor)}
 */
getConstructor: function() {
```

__Parameters__

* None


__Returns__

* <code>{function(new:[Constructor](#Constructor))}</code> - The Class's Constructor function.


__Examples__

```javascript
/** @type {function(new:MyClassConstructor)} */
var MyClassConstructor  = Class.extend(Obj, {});

/** @type {Class} */
var MyClass             = MyClassConstructor.getClass();

console.log(MyClassConstructor === MyClass.getConstructor());   // true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class_getInterfaces" />
### Class#getInterfaces()

Get the Class's implemented Interfaces


__Method__

```javascript
/**
 * @return {Array.<Interface>}
 */
getInterfaces: function() {
```

__Parameters__

* None


__Returns__

* <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[Interface](#Interface)&gt;}</code> - The Class's implemented Interfaces.


__Examples__

```javascript
var MyInterface         = Interface.declare({
    myMethod: function() {}
});
var MyClassConstructor  = Class.extend(Obj, {
    myMethod: function() {}
});

Class.implement(MyClassConstructor, MyInterface);

var MyClass = MyClassConstructor.getClass();
MyClass.getInterfaces();                            // [ MyInterface ]
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class_getName" />
### Class#getName()

Get the Class's name (if one was supplied)


__Method__

```javascript
/**
 * @return {string}
 */
getName: function() {
```

__Parameters__

* None


__Returns__

* <code>{string}</code> - The Class's name.


__Examples__

```javascript
var MyClassConstructor  = Class.extend(Obj, {
    _name: "MyClass"
});

var MyClass = MyClassConstructor.getClass();
MyClass.getName();                         // "MyClass"
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class_getSuperclass" />
### Class#getSuperclass()

Get the Class's superclass (if there is one)


__Method__

```javascript
/**
 * @return {Class}
 */
getSuperclass: function() {
```

__Parameters__

* None


__Returns__

* <code>{[Class](#Class)}</code> - The Class's superclass.


__Examples__

Extended Class
```javascript
var MyClassConstructor  = Class.extend(Obj, {});

var MyClass = MyClassConstructor.getClass();
console.log(MyClass.getSuperclass() === Obj.getClass());    // true
```

Declared Class
```javascript
var MyBaseClassConstructor  = Class.declare({});

var MyBaseClass = MyBaseClassConstructor.getClass();
MyBaseClass.getSuperclass();                                // null
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class_newInstance" />
### Class#newInstance()

This method returns a new instance of this Class.


__Method__

```javascript
/**
 * @param {Array.<*>=} args
 * @return {Constructor}
 */
newInstance: function(args) {
```

__Parameters__

Name | Type | Description
--- | --- | ---
`args` | <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;*&gt;}</code> | An array of args to apply to the constructor.


__Returns__

* <code>{[Constructor](#Constructor)}</code> - The new instance


__Examples__

```javascript
var BaseBall        = Class.extend(Ball, {});
var BaseBallClass   = BaseBall.getClass();
var myBaseBall      = BaseBallClass.newInstance(["arg1", "arg2"]);
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class-declare" />
### Class.declare(declaration)

This method is used to declare a low level base class in the bugcore system. Most of the
time you should not use this method to declare new classes unless you are sure of what
you are doing. Instead use the [Class.extend](#Class-extend) method and extend Obj. By
using this method, it will exclude many of the base methods that the rest of the bugcore
system depends upon, including hashCode, equals, _internalId, and clone


__Method__

```javascript
/**
 * @static
 * @param {Object.<string, *>} declaration
 * @return {function(new:Constructor)}
 */
Class.declare = function(declaration) {
```

__Parameters__

Name | Type | Description
--- | --- | ---
`declaration` | <code>{[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).&lt;string, *&gt;}</cod> | An object that declares the methods of the new class.


__Returns__

* <code>{function(new:[Constructor](#Constructor))}</code> - The newly created class's constructor.


__Examples__

```javascript
var LowestLevelObject = Class.declare({
    _constructor: function() {
        // No need to call this._super, this is the lowest level.
    }
});
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class-doesExtend" />
### Class.doesExtend(value, constructor)

This method is used to determine if a value extends a particular Constructor's Class. Instances of Classes are
considered to extend their own Class.


__Method__

```javascript
/**
 * @static
 * @param {*} value
 * @param {function(new:Constructor)} constructor
 * @return {boolean}
 */
Class.doesExtend = function(value, constructor) {
```

__Parameters__

Name | Type | Description
--- | --- | ---
`value` | <code>{*}</code> | The value to determine if it extends the given Constructor's Class
`constructor` | <code>{function(new:[Constructor](#Constructor))}</code> | The Constructor used to check if the value extends it's Class


__Returns__

* <code>{boolean}</code> - Whether or not the value extends the given Constructor's Class


__Examples__

```javascript
var BaseBall = Class.extend(Ball, {});
var myBaseBall = new BaseBall();

Class.doesExtend(myBaseBall, Ball);         //true
Class.doesExtend(myBaseBall, BaseBall);     //true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class-doesImplement" />
### Class.doesImplement(value, implementable)

This method is used to determine if a value implements a particular Implementable's Interface.


__Method__

```javascript
/**
 * @static
 * @param {*} value
 * @param {function(new:Implementable)} implementable
 * @return {boolean}
 */
Class.doesImplement = function(value, implementable) {
```

__Parameters__

Name | Type | Description
--- | --- | ---
`value` | <code>{*}</code> | The value to determine if it implements the given Implementable's Interface
`constructor` | <code>{function(new:[Constructor](#Constructor))}</code> | The Constructor used to check if the value extends it's Class


__Returns__

* <code>{boolean}</code> - Whether or not the value implements the given Implementable's Interface


__Examples__

```javascript
var IBall   = Interface.declare({});
var Ball    = Class.declare({});
Class.implement(Ball, IBall);

var myBall  = new Ball();

Class.doesImplement(myBall, IBall);         //true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class-extend" />
### Class.extend(constructor, declaration)

This method is used to extend another Class. It accepts the Class's Constructor as a parameter
and the declaration for the new Class.


__Notes__

* The declaration can include methods and default properties for the new Class.
* If you're creating a low level Class, it is best practice to extend [Obj](#Obj)


__Method__

```javascript
/**
 * @static
 * @param {function(new:Constructor)} constructor
 * @param {Object.<string, *>} declaration
 * @return {function(new:Constructor)}
 */
Class.extend = function(constructor, declaration) {
```

__Parameters__

Name | Type | Description
--- | --- | ---
`constructor` | <code>{function(new:[Constructor](#Constructor))}</code> | The constructor of the class to extend.
`declaration` | <code>{[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).&lt;string, *&gt;}</code> | An object that declares the methods of the new class.


__Returns__

* <code>{function(new:[Constructor](#Constructor))}</code> - The newly created class's constructor.


__Examples__

```javascript
var BaseBall = Class.extend(Ball, {

    _constructor: function(diameter) {
        this._super(); // Call super constructor
        this.diameter = diameter;
    }

    throwBall: function() {

    }
});
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Class-implement" />
### Class.implement(constructor, implementable)

This method marks a Class as implementing an Interface. When calling this method it will add the
Implementable's Interface to the Class's list of Interfaces. It will also validate that the
given Class actually implements all of the methods of the Interface. If the Class does not
this method will throw an Error.


__Method__

```javascript
/**
 * @static
 * @param {function(new:Constructor)} constructor
 * @param {function(new:Implementable)} implementable
 */
Class.implement = function(constructor, implementable) {
```

__Parameters__

Name | Type | Description
--- | --- | ---
`constructor` | <code>{function(new:[Constructor](#Constructor))}</code> | The Constructor of the Class to implement the Interface.
`implementable` | <code>{function(new:[Implementable](#Implementable))}</code> | The Implementable of the Interface to implement.


__Returns__

* None


__Examples__

Implement an Interface
```javascript
var IBall   = Interface.declare({
    throwBall: function() {}
});

var Ball    = Class.declare({
    throwBall: function() {
        // Implementation of method
    }
});

Class.implement(Ball, IBall);
```


<br /><a name="Constructor" />
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

Access | Signature | Return Type
--- | --- | ---
public | <code>[getClass](#Constructor_getClass)()</code> | <code>{[Class](#Class)}</code>


__Static Getters and Setters Summary__

Access | Signature | Return Type
--- | --- | ---
static public | <code>[getClass](#Constructor-getClass)()</code> | <code>{[Class](#Class)}</code>


<br />
------------------------------------------------------------------------------------
<br />

<a name="Constructor_getClass" />
### Constructor#getClass()

Get the [Class](#Class) for this instance.


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

* <code>{[Class](#Class)}</code> - The Class of this instance.


__Examples__

```js
//TODO BRN: Provide example of Class usage
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Constructor-getClass" />
### Constructor.getClass()

Get the [Class](#Class) for this Constructor.


__Method__

```javascript
/**
 * @static
 * @return {Class}
 */
Constructor.getClass = function() {
```


__Parameters__

* None


__Returns__

* <code>{[Class](#Class)}</code> - The Class of this Constructor.


__Examples__

```js
//TODO BRN: Provide example of Class usage
```


<br /><a name="Implementable" />
## Implementable

Represents the base function of all interfaces declared in the BugCore system
using [Interface.declare](#Interface-declare)


__Class__

```javascript
/**
 * @constructor
 */
var Implementable = function() {};
```


__Static Getters and Setters Summary__

Access | Signature | Return Type
--- | --- | ---
static public | <code>[getInterface](#Implementable-getInterface)()</code> | <code>{[Interface](#Interface)}</code>


<br />
------------------------------------------------------------------------------------
<br />

<a name="Implementable-getInterface" />
### Implementable.getInterface()

Get the [Interface](#Interface) for this Implementable.


__Method__

```javascript
/**
 * @static
 * @return {Interface}
 */
Implementable.getInterface = function() {
```


__Parameters__

* None


__Returns__

* <code>{[Interface](#Interface)}</code> - The Interface of this Implementable.


__Examples__

```js
var MyImplementable = Interface.declare({
    interfaceMethod: function() {

    }
});
var MyInterface = MyImplementable.getInterface();
```


<br /><a name="Interface" />
## Interface

Core class used to build interfaces.


__Class__

```javascript
/**
 * @constructor
 * @param {function(new:Implementable)} implementable
 * @param {string} name
 * @param {Interface} superinterface
 */
var Interface = function(implementable, name, superinterface) {
```

__Constructor Summary__

Access | Signature
--- | --- | ---
constructor | <code>[Interface](#Interface_constructor)({function(new:[Implementable](#Implementable))} implementable, {string} name, {[Interface](#Interface)} superinterface)</code>


__Getters and Setters Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[getImplementable](#Interface_getImplementable)()</code> | <code>{function(new:[Implementable](#Implementable))}</code>
public | <code>[getName](#Interface_getName)()</code> | <code>{string}</code>
public | <code>[getSuperinterface](#Interface_getSuperinterface)()</code> | <code>{[Interface](#Interface)}</code>


__Static Method Summary__

Access | Signature | Return Type
--- | --- | ---
static public | <code>[declare](#Interface-declare)({[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).&lt;string, *&gt;} declaration)</code> | <code>{function(new:[Implementable](#Implementable))}</code>
static public | <code>[extend](#Implementable-extend)({function(new:[Implementable](#Implementable))} implementable, {[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).&lt;string, *&gt;} declaration)</code> | <code>function(new:[Implementable](#Implementable))</code>


<br />
------------------------------------------------------------------------------------
<br />

<a name="Interface_constructor" />
### Interface(implementable, name, superinterface)

Constructor for a new Interface. This should not be used directly. Instead, use the
[Interface.declare](#Interface-declare) method to create a new Interface.


__Method__

```javascript
/**
 * @constructor
 * @param {function(new:Implementable)} implementable
 * @param {string} name
 * @param {Interface} superinterface
 */
var Interface = function(implementable, name, superinterface) {
```


__Parameters__

Name | Type | Description
--- | --- | ---
`implementable` | <code>{function(new:[Implementable](#Implementable)}</code> | The Implementable of this Interface.
`name` | <code>{string}</code> | The name of this Interface.
`superinterface` | <code>{[Interface](#Interface)}</code> | The superinterface of this Interface (optional).


__Examples__

```js
var myInterface = new Interface(implementable, name, superinterface);
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Interface_getImplementable" />
### Interface#getImplementable()

Get the Interface's Implementable function.


__Method__

```javascript
/**
 * @return {function(new:Implementable)}
 */
getImplementable: function() {
```

__Parameters__

* None


__Returns__

* <code>{function(new:[Implementable](#Implementable))}</code> - The Interface's Implementable function.


__Examples__

```javascript
/** @type {function(new:MyInterfaceImplementable)} */
var MyInterfaceImplementable  = Interface.declare({});

/** @type {Interface} */
var MyInterface            = MyInterfaceImplementable.getInterface();

console.log(MyInterfaceImplementable === MyInterface.getImplementable());   // true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Interface_getName" />
### Interface#getName()

Get the Interface's name (if one was supplied)


__Method__

```javascript
/**
 * @return {string}
 */
getName: function() {
```

__Parameters__

* None


__Returns__

* <code>{string}</code> - The Interface's name.


__Examples__

```javascript
var MyInterfaceImplementable  = Interface.declare({
    _name: "MyInterface"
});

var MyInterface = MyInterfaceImplementable.getInterface();
MyInterface.getName();                         // "MyInterface"
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Interface_getSuperinterface" />
### Interface#getSuperinterface()

Get the Interface's superinterface (if there is one)


__Method__

```javascript
/**
 * @return {Interface}
 */
getSuperinterface: function() {
```

__Parameters__

* None


__Returns__

* <code>{[Interface](#Interface)}</code> - The Interface's superinterface.


__Examples__

Extended Interface
```javascript
var MyInterfaceImplementable  = Interface.extend(SomeInterfaceImplementable, {});

var MyInterface = MyInterfaceImplementable.getInterface();
console.log(MyInterface.getSuperinterface() === SomeInterfaceImplementable.getInterface());    // true
```

Declared Interface
```javascript
var MyBaseInterfaceImplementable  = Interface.declare({});

var MyBaseInterface = MyBaseInterfaceImplementable.getInterface();
MyBaseInterface.getSuperinterface();                                // null
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Interface-declare" />
### Interface.declare(declaration)

This method is used to declare a low level base Interface in the bugcore system. Unlike Class.declare
this method should be freely used to declare basic interfaces that extend no other Interface.


__Method__

```javascript
/**
 * @static
 * @param {Object.<string, function(...):*>} declaration
 * @return {function(new:Implementable)}
 */
Interface.declare = function(declaration) {
```

__Parameters__

Name | Type | Description
--- | --- | ---
`declaration` | <code>{[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).&lt;string, function(...):*&gt;}</code> | An object that declares the methods of the new Interface.


__Returns__

* <code>{function(new:[Implementable](#Implementable))}</code> - The newly created Interface's Implementable.


__Examples__

```javascript
var MyImplementable = Interface.declare({
    foo: function() {},
    bar: function() {}
});
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Interface-extend" />
### Interface.extend(implementable, declaration)

This method is used to extend and existing interface.


__Method__

```javascript
/**
 * @static
 * @param {function(new:Implementable)} implementable
 * @param {Object.<string, function(..):*>} declaration
 * @return {function(new:Implementable)}
 */
Interface.extend = function(implementable, declaration) {
```

__Parameters__


Name | Type | Description
--- | --- | ---
`implementable` | <code>{function(new:[Implementable](#Implementable))}</code> | The Implementable of the Interface to extend.
`declaration` | <code>{[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).&lt;string, function(...):*&gt;}</code> | An object that declares the methods of the new Interface.


__Returns__

* <code>{function(new:[Implementable](#Implementable))}</code> - The newly created Interface's Implementable.


__Examples__

```javascript
var IBall = Interface.declare({
    throwBall: function() {

    }
});
var IBaseBall = Class.extend(IBall, {
    hitBall: function() {

    }
});
```


<br /><a name="Obj" />
## Obj

The root class of all other classes in the bugcore library. Provides basic functionality such as hash code support,
equality checks and clone support.


__Class__

```javascript
/**
 * @class
 * @extends {Constructor}
 * @implements {IClone}
 * @implements {IEquals}
 * @implements {IHashCode}
 */
var Obj = Class.declare(/** @lends {Obj.prototype} */{
```

__Extends__

* [`Constructor`](#Constructor)


__Interfaces__

* [`IClone`](#IClone)
* [`IEquals`](#IEquals)
* [`IHashCode`](#IHashCode)


__Constructor Summary__

Access | Signature
--- | ---
constructor | <code>[_constructor](#Obj__constructor)()</code>


__Getters and Setters Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[getInternalId](#Obj_getInternalId)()<code> | <code>{number}</code>


__Method Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[clone](#Obj_clone)({boolean} deep)</code>  | <code>{\*}</code>
public | <code>[equals](#Obj_equals)({\*} value)</code> | <code>{boolean}</code>
public | <code>[hashCode](#Obj_hashCode)() | <code>{number}</code>


__Static Method Summary__

Access | Signature | Return Type
--- | --- | ---
static public | <code>[clone](#Obj-clone)({A} value, {boolean} deep)</code> | <code>{A}</code>
static public | <code>[equals](#Obj-equals)({\*} value1, {\*} value2)</code> | <code>{boolean}</code>
static public | <code>[hashCode](#Obj-hashCode)({\*} value)</code> | <code>{number}</code>


<br />
------------------------------------------------------------------------------------
<br />

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


<br />
------------------------------------------------------------------------------------
<br />

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

* <code>{number}</code> - The unique internal id for this instance. Unique only to this JS runtime.


__Examples__

```js
var myObj       = new Obj();
var internalId  = myObj.getInternalId();
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Obj_clone" />
### Obj#clone(deep)

By default the clone method will use the instance's Class to instantiate a new instance.
It will also iterate through the instance's properties and attempt to clone all properties
that are not functions. If a deep clone is being performed, then the clone method will
attempt to create a deep copy of each property. If a shallow clone is being performed
then a reference to the property value will be set on the new instance.


__Notes__

* _internalId is not cloned for deep or shallow clones. Therefore the clone instance
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

Name | Type | Description
--- | --- | ---
`deep` | <code>{boolean=}</code> | Whether or not to perform a deep clone. Optional - default: false


__Returns__

* <code>{\*}</code> - A clone of the instance.


__Examples__

```js
var myObj               = new Obj();
var shallowCloneObj     = myObj.clone();     //shallow clone
var deepCloneObj        = myObj.clone(true); //deep clone
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Obj_equals" />
### Obj#equals(value)

By default, the equality check will compare this instances _internalId to the value parameter.


__Notes__

* If two instances are equal, they should return the same hash code.


__Method__

```javascript
/**
 * @param {*} value
 * @return {boolean}
 */
equals: function(value) {
```


__Parameters__

Name | Type | Description
--- | --- | ---
`value` | <code>{\*}</code> | The value to compare to for equality.


__Returns__

* <code>{boolean}</code> - Whether or not the instance is equal to the value parameter.


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


<br />
------------------------------------------------------------------------------------
<br />

<a name="Obj_hashCode" />
### Obj#hashCode()

Returns the objects hashCode. The generation of the hashCode is only run once and
then cached.


__Notes__

* If two instances are equal, they should return the same hash code.
* Equal hash codes is not a guarantee of equality.
* A hash code should not change for an instance over the lifespan of the instance.
* Generation of hash codes should be done only using immutable values.



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

* <code>{number}</code> - The hash code of this instance.


__Examples__

Get hash code of instance
```js
var obj         = new Obj();
var hashCode    = obj.hashCode();
```


<br />
------------------------------------------------------------------------------------
<br />

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

__Notes__

* If the value implements IClone, the clone() method will be used to clone the value.
* Cloning an object literal will create a new object literal and set references to all
iterable property values of the original object.
* Cloning a Date will create a new Date instance with the same time.
* Cloning an Array will create a new Array with the same values in the same order.


__Parameters__

Name | Type | Description
--- | --- | ---
`value` | <code>{A}</code> | The value to clone.
`deep` | <code>{boolean=}</code> | Whether or not to perform a deep clone. Optional - default: false


__Returns__

* <code>{A}</code> - A clone of the value.


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


<br />
------------------------------------------------------------------------------------
<br />

<a name="Obj-equals" />
### Obj.equals(value1, value2)

Checks value1 and value2 for equality.

If value1 implements IEquals, the value1.equals() method will be used to perform
the equality check. Otherwise === is used to compare the two values.


__Notes__

* Two Date instances of the same time are considered equal


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

Name | Type | Description
--- | --- | ---
`value1` | <code>{\*}</code> | The value to compare value2 to for equality.
`value2` | <code>{\*}</code> | The value to compare value1 to for equality.


__Returns__

* <code>{boolean}</code> - Whether or not the two values are equal.


__Examples__

Two different instances are not equal
```js
var obj1   = new Obj();
var obj2   = new Obj();
Obj.equals(obj1, obj2);         //false
```

An instance is equal to itself
```js
var obj1   = new Obj();
Obj.equals(obj1, obj1);         //true
```

Strings of the same value are equal
```js
var string1 = "mystring";
var string2 = "mystring";
Obj.equals(string1, string2)    //true
```

Undefined and null are not equal
```js
var undefinedValue  = undefined;
var nullValue       = null;
Obj.equals(undefinedValue, nullValue) //false
```

Two Dates of the same time are equal
```js
var time    = Date.now();
var date1   = new Date(time);
var date2   = new Date(time);
Obj.equals(date1, date2)        //true
```


<br />
------------------------------------------------------------------------------------
<br />

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

Name | Type | Description
--- | --- | ---
`value` | <code>{\*}</code> | The value to generate a hash code for..


__Returns__

* <code>{number}</code> - The hash code of the value.


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


<br /><a name="IClone" />
## IClone

The base interface for cloning. If your Class can be cloned, you should implement this interface.


__Interface__

```javascript
/**
 * @interface
 */
var IClone = Interface.declare({
```

__Method Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[clone](#IClone_clone)({boolean=} deep)</code>  | <code>{\*}</code>


<br />
------------------------------------------------------------------------------------
<br />

<a name="IClone_clone" />
### IClone#clone(deep)

This method returns a clone of the instance that implements this interface.
Implementations should respect the deep clone flag.


__Notes__

* Implementations should respect the deep flag.
* Immutable values need not be cloned on a deep clone.


__Method__

```javascript
/**
 * @param {boolean=} deep
 * @return {*}
 */
clone: function(deep) {}
```


__Parameters__

Name | Type | Description
--- | --- | ---
`deep` | <code>{boolean=}</code> | Whether or not to perform a deep clone. Optional - default: false


__Returns__

* <code>{\*}</code> - A clone of the instance.


<br /><a name="IEquals" />
## IEquals

The base interface for equality checks. If your Class can be compared for equality against
another, you should implement this interface.


__Notes__
* This interfaces must be implemented along with the the IHashCode interface if you want your
Class to work properly with the bugcore data classes.
* If two instances are equal, they should return the same hash code.


__Interface__

```javascript
/**
 * @interface
 */
var IEquals = Interface.declare({
```

__Method Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[equals](#IEquals_equals)({\*} value)</code>  | <code>{boolean}</code>


<br />
------------------------------------------------------------------------------------
<br />

<a name="IEquals_equals" />
### IEquals#equals(value)

This method returns true if the instance that implements this interface is equal to the given value.
Returns false if the given value does not equal the instance.

__Notes__

* Implementations should handle any value passed in as a parameter.


__Method__

```javascript
/**
 * @param {*} value
 * @return {boolean}
 */
equals: function(value) {}
```


__Parameters__

Name | Type | Description
--- | --- | ---
`value` | <code>{\*}</code> | The value to compare the instance against for equality.


__Returns__

* <code>{boolean}</code> - Returns true if the instance is equal to the given value. False if not.


<br /><a name="IHashCode" />
## IHashCode

The base interface for generating a hash code for an instance. Used in tandem with the IEquals interface
for storing values in [HashStore](#HashStore) and [HashTable](#HashTable).


__Notes__
* This interfaces must be implemented along with the the IEquals interface if you want your
Class to work properly with the bugcore data classes.
* If two instances are equal, they should return the same hash code.
* If two instances are not they can still return the same hash code. However, this should be avoided
to a degree as it will hurt the performance of HashTable and HashStore
* Equal hash codes does not guarantee equality.


__Interface__

```javascript
/**
 * @interface
 */
var IHashCode = Interface.declare({
```

__Method Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[hashCode](#IHashCode_hashCode)()</code>  | <code>{number}</code>


<br />
------------------------------------------------------------------------------------
<br />

<a name="IHashCode_hashCode" />
### IHashCode#hashCode()

This method returns a hash code for the current instance.


__Notes__

* Implementations should try to generate a relatively unique hash code for the given instance.
* If two instances are equal, they should return the same hash code.


__Method__

```javascript
/**
 * @return {number}
 */
hashCode: function() {}
```


__Parameters__

* None

__Returns__

* <code>{number}</code> - The hash code for the instance.


<br /><a name="Throwable" />
## Throwable

The root throwable class of the bugcore system. Has support for more complex stack
traces including cause chains.


__Class__

```javascript
/**
 * @class
 * @extends {Obj}
 * @implements {IObjectable}
 */
var Throwable = Class.extend(Obj, {
```

__Extends__

* [`Obj`](#Obj)


__Interfaces__

* [`IObjectable`](#IObjectable)


__Constructor Summary__

Access | Signature
--- | ---
public | <code>[_constructor](#Throwable__constructor)({string} type, {*=} data, {string=} message, {[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;([Throwable](#Throwable) &#124; [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))&gt;=} causes)</code>


__Getters and Setters Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[getCauses](#Throwable_getCauses)()</code> | <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;([Throwable](#Throwable) &#124; [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))&gt;}</code>
public | <code>[getData](#Throwable_getData)() | <code>{*}</code>
public | <code>[setData](#Throwable_setData)({*} data)</code> | None
public | <code>[getMessage](#Throwable_getMessage)()</code> | <code>{string}</code>
public | <code>[setMessage](#Throwable_setMessage)({string} message)</code> | None
public | <code>[getStack](#Throwable_getStack)()</code> | <code>{string}</code>
public | <code>[getType](#Throwable_getType)()</code> | <code>{string}</code>


__Method Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[addCause](#Throwable_addCause)({([Throwable](#Throwable) &#124; [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))} cause)</code> | <code>{*}</code>
public | <code>[toObject](#Throwable_toObject)()</code> | <code>{causes: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;([Throwable](#Throwable) &#124; [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))&gt;, data: *, message: string, type: string}</code>


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable__constructor" />

### Throwable#_constructor(type, data, message, causes)


__Method__

```javascript
/**
 * @constructs
 * @param {string} type
 * @param {*=} data
 * @param {string=} message
 * @param {Array.<(Throwable | Error)>=} causes
 */
_constructor: function(type, data, message, causes) {
```


__Parameters__

Name | Type | Description
--- | --- | ---
`type` | <code>{string}</code> | The type of throwable.
`data` | <code>{*=}</code> | Any extra data to pass along with this throwable.
`message` | <code>{string=}</code> | A message to add to this throwable. (optional - default: "")
`causes` | <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;([Throwable](#Throwable) &#124; [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))&gt;=}</code> | An array of other throwables or js errors that caused this throwable. (optional - default: [])


__Examples__

Simple throwable
```js
var myThrowable = new Throwable("MyThrowable", {}, "Something bad happened");
throw myThrowable;
```

Throwable with cause
```js
try {
    somethingWillGoWrong();
} catch (error) {
    var myThrowable     = new Throwable("SomethingWentWrong", {}, "Something went wrong in the somethingWillGoWrong function", [error]);
    throw throwable;
}
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable_getCauses" />

### Throwable#getCauses()

Get the causes of the Throwable.


__Method__

```javascript
/**
 * @return {Array.<(Throwable | Error)>}
 */
getCauses: function() {
```

__Parameters__

* None


__Returns__

* <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;([Throwable](#Throwable) &#124; [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))&gt;}</code> - An array of other Throwables or JS Errors that caused this Throwable.


__Examples__

```js
try {
    somethingWillGoWrong();
} catch (error) {
    var myThrowable     = new Throwable("SomethingWentWrong", {}, "Something went wrong in the somethingWillGoWrong function", [error]);
    var causes          = myThrowable.getCauses();  // [error]
}
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable_getData" />

### Throwable#getData()

Get the data of the Throwable.


__Method__

```javascript
/**
 * @return {*}
 */
getData: function() {
```

__Parameters__

* None


__Returns__

* <code>{*}</code> - An array of other Throwables or JS Errors that caused this Throwable.


__Examples__

```js
var data            = "some data";
var myThrowable     = new Throwable("ThrowableType", data, "some message");

myThrowable.getData() === data;     //true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable_setData" />

### Throwable#setData(data)

Set the data of the Throwable.


__Method__

```javascript
/**
 * @param {*} data
 */
setData: function(data) {
```

__Parameters__

Name | Type | Description
--- | --- | ---
`data` | <code>{*}</code> | The data to set on the Throwable.


__Returns__

* None


__Examples__

```js
var data            = "some data";
var myThrowable     = new Throwable("ThrowableType");
myThrowable.setData(data);

myThrowable.getData() === data;     //true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable_getMessage" />

### Throwable#getMessage()

Get the message of the Throwable.


__Method__

```javascript
/**
 * @return {string}
 */
getMessage: function() {
```

__Parameters__

* None


__Returns__

* <code>{string}</code> - The message included with the Throwable.


__Examples__

```js
var message         = "some message";
var myThrowable     = new Throwable("ThrowableType", null, message);

myThrowable.getMessage() === message;     //true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable_setMessage" />

### Throwable#setMessage(message)

Set the message of the Throwable.


__Method__

```javascript
/**
 * @param {string} message
 */
setMessage: function(message) {
```


__Parameters__

Name | Type | Description
--- | --- | ---
`message` | <code>{string}</code> | The message to set on the Throwable.


__Returns__

* None


__Examples__

```js
var message         = "some message";
var myThrowable     = new Throwable("ThrowableType");
myThrowable.setMessage(message);

myThrowable.getMessage() === message;     //true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable_getStack" />

### Throwable#getStack()

Get the stack trace of the Throwable.


__Method__

```javascript
/**
 * @return {string}
 */
getStack: function() {
```

__Parameters__

* None


__Returns__

* <code>{string}</code> - The stack trace of the Throwable.


__Examples__

```js
//TODO
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable_getType" />

### Throwable#getType()

Get the type of the Throwable.


__Method__

```javascript
/**
 * @return {string}
 */
getType: function() {
```

__Parameters__

* None


__Returns__

* <code>{string}</code> - The type of the Throwable.


__Examples__

```js
var myThrowable     = new Throwable("ThrowableType");

myThrowable.getType() === "ThrowableType";     //true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Throwable_addCause" />
### Throwable#addCause(cause)

Add a cause to the Throwables list of causes.


__Notes__

* All causes will be included in the stack of the throwable.


__Method__

```javascript
/**
 * @param {(Throwable | Error)} cause
 */
addCause: function(cause) {
```


__Parameters__

Name | Type | Description
--- | --- | ---
`cause` | <code>{([Throwable](#Throwable) &#124; [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))}</code> | The cause to add to the Throwable's array of causes.


__Returns__

* None


__Examples__

Add multiple causes to a single throwable
```js
var myThrowable = new Throwable("MultipleCauses", {}, "Several things went wrong");

//We want this to complete the looping even if a throwable occurs.
for (var i = 0; i < 10; i++) {
    try {
        somethingMightGoWrong();
    } catch (error) {
        myThrowable.addCause(error);
    }
}
```


<br /><a name="Collection" />
## Collection

The root class of several of the data objects. A collection represents a group of items.

__Notes__

* A Collection instance on its own allows for duplicate elements.
* Order is not maintained in a Collection. Therefore iteration my not be in the order
items were added to a collection.


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

Access | Signature
--- | ---
public | <code>[_constructor](#Collection__constructor)({([ICollection](#ICollection).&lt;I&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;I&gt;)} items)</code>


__Getters and Setters Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[getHashStore](#Collection_getHashStore)()</code> | <code>{[HashStore](#HashStore)}</code>


__Method Summary__

Access | Signature | Return Type
--- | --- | ---
public | <code>[add](#Collection_add)({I} item)</code> | <code>{boolean}</code>
public | <code>[addAll](#Collection_addAll)({([ICollection](#ICollection).&lt;I&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;I&gt;)} items)</code> | None
public | <code>[clear](#Collection_clear)()</code> | None
public | <code>[contains](#Collection_contains)({*} value)</code> | <code>{boolean}</code>
public | <code>[containsAll](#Collection_containsAll)({([ICollection](#ICollection).&lt;\*&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;\*&gt;)} values)</code> | <code>{boolean}</code>
public | <code>[containsEqual](#Collection_containsEqual)({([ICollection](#ICollection).&lt;\*&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;\*&gt;)} values)</code> | <code>{boolean}</code>
public | <code>[forEach](#Collection_forEach)({function(I)} func)</code> | None
public | <code>[getCount](#Collection_getCount)()</code> | <code>{number}</code>
public | <code>[getValueArray](#Collection_getValueArray)()</code> | <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;I&gt;}</code>
public | <code>[getValueCount](#Collection_getValueCount)({*} value)</code> | <code>{number}</code>
public | <code>[isEmpty](#Collection_isEmpty)()</code> | <code>{boolean}</code>
public | <code>[iterator](#Collection_iterator)()</code> | <code>{[IIterator](#IIterator)}</code>
public | <code>[map](#Collection_map)({function} fn, {[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)} context)</code> | <code>{[ICollection](#ICollection)}</code>
public | <code>[remove](#Collection_remove)({*} value)</code> | <code>{boolean}</code>
public | <code>[removeAll](#Collection_removeAll)({([ICollection](#ICollection).&lt;\*&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;\*&gt;)} values)</code> | None
public | <code>[retainAll](#Collection_retainAll)({([ICollection](#ICollection).&lt;\*&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;\*&gt;)} values)</code> | None
public | <code>[toArray](#Collection_toArray)()</code> | <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;I&gt;}</code>


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection__constructor" />
### Collection#_constructor(items)


__Method__

```javascript
/**
 * @constructs
 * @param {(ICollection.<I> | Array.<I>)=} items
 */
_constructor: function(items) {
```


__Parameters__

Name | Type | Description
--- | --- | ----
`items` | <code>{([ICollection](#ICollection).&lt;I&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;I&gt;)=}</code> | Starting items to add to the Collection (Optional)


__Returns__

* None


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


Other Collection parameter
```js
var itemsCollection     = new Collection([
    "item1",
    "item2"
]);
var myCollection        = new Collection(itemsCollection);
```


<br />
------------------------------------------------------------------------------------
<br />

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

* <code>{[HashStore](HashStore)}</code> - The underlying HashStore that supports this Collection


__Examples__

```js
var myCollection    = new Collection();
var hashStore       = myCollection.getHashStore();
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_add" />
### Collection#add(item)

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

Name | Type | Description
--- | --- | ----
`item` | <code>{I}</code> | The item to add to the collection


__Returns__

* <code>{boolean}</code> - Whether or not the item was added to the collection.


__Examples__

```js
var myCollection        = new Collection();
var myItem              = "myItem";
var result              = myCollection.add(myItem); // true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_addAll" />
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

Name | Type | Description
--- | --- | ----
`items` | <code>{([ICollection](#ICollection).&lt;I&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;I&gt;)}</code> | The items to add to the collection. Can either be an Array or another Collection.


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


<br />
------------------------------------------------------------------------------------
<br />

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


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_contains" />
### Collection#contains(value)

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

Name | Type | Description
--- | --- | ----
`value` | <code>{*}</code> | The value that we're checking if the collection contains.


__Returns__

* <code>{boolean}</code> - True if the value is contained by the Collection. False if not.


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


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_containsAll" />
### Collection#containsAll(values):boolean

Checks the Collection to see if it contains all of the values in the given argument.
If ALL of the values are contained by the collection, this method will return true.
Otherwise, false.


__Notes__

* Multiple elements are ignored in this function.
e.g. Collection[0,1] containsAll Collection[0,1,1,1] is true
If you want to check for exact equality, use the equals function.
* Empty collections are always contained by another collection
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

Name | Type | Description
--- | --- | ----
`values` | <code>{([ICollection](#ICollection).&lt;\*&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;\*&gt;)}</code> | The values that we're checking to see if the collection contains all of them.


__Returns__

* <code>{boolean}</code> - True if the Collection contains all the given values. False if not.


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


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_containsEqual" />
### Collection#containsEqual(values):boolean

Checks the Collection to see if it contains exactly the values in the given argument.
If the collection contains the exact same values as the collection given in the parameter,
this method will return true. Otherwise, false.


__Method__

```javascript
/**
 * @param {(ICollection.<*> | Array.<*>)} values
 * @return {boolean}
 */
containsEqual: function(values) {
```


__Parameters__

Name | Type | Description
--- | --- | ----
`values` | <code>{([ICollection](#ICollection).&lt;\*&gt; &#124; [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;\*&gt;)}</code> | The values that we're checking to see if the collection contains exactly.


__Returns__

* <code>{boolean}</code> - True if the Collection contains exactly the same values as the given values.


__Examples__

Values not contained at all
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.containsEqual(["item3"]);                        // false
```

Partial values contained are not a match.
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.containsEqual(["item2", "item3"]);               // false
```

Values contained but not an exact match
```js
var myCollection    = new Collection([
    "item1",
    "item2",
    "item3"
]);
myCollection.containsEqual(["item2", "item3"]);               // false
```

Exact match is true
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.containsEqual(["item1", "item2"]);               // true
```

Exact match out of order is true
```js
var myCollection    = new Collection([
    "item2",
    "item1"
]);
myCollection.containsEqual(["item1", "item2"]);               // true
```

Multiple elements are considered
```js
var myCollection    = new Collection([
    "item1",
    "item2",
    "item2"
]);
myCollection.containsEqual(["item1", "item2"]);               // false
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_forEach" />
### Collection#forEach(func)

forEach executes the provided function once for each element of the Collection.


__Notes__

* Order is not maintained in a Collection. Therefore the order of iteration in items in a
Collection is unpredictable.
* If a value is modified in one iteration and then visited at a later time, its value in
the loop is its value at that later time. A value that is deleted before it has been visited
will not be visited later. Values added to the Collection over which iteration is occurring
may either be visited or omitted from iteration. In general it is best not to add, modify or
remove values from the Collection during iteration, other than the value currently being
visited. There is no guarantee whether or not an added value will be visited, whether a
modified value (other than the current one) will be visited before or after it is modified,
or whether a deleted value will be visited before it is deleted.


__Method__

```javascript
/**
 * @param {function(I)} func
 */
forEach: function(func) {
```


__Parameters__

Name | Type | Description
--- | --- | ----
`func` | <code>{function(I)}</code> | The function to execute for each item


__Returns__

* None


__Examples__

Execute for each item
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
myCollection.forEach(function(item) {
    console.log(item);  // item1 on first pass, item2 on second
});
```

Partial values contained are not a match.
```js
var myCollection    = new Collection([]);

myCollection.forEach(function(item) {
    console.log(item);  // never executed
});
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_getCount" />
### Collection#getCount():number

Returns the number of items in the collection.


__Method__

```javascript
/**
 * @return {number}
 */
getCount: function() {
```


__Parameters__

* None


__Returns__

* <code>{number}</code> - The number of items in the Collection.


__Examples__

Empty Collection
```js
var myCollection    = new Collection([]);

myCollection.getCount();   //0
```

Starts with 2 items
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);

myCollection.getCount()    //2
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_getValueArray" />
### Collection#getValueArray()

Returns an Array of the Collection's values.

__Notes__

* Order of items in the Array is unpredictable.
* This method generates a new Array each time.
* Manipulating the Array will not affect the Collection.
* Manipulating the Collection will not affect the returned Array after it has
been generated.

__Method__

```javascript
/**
 * @return {Array.<I>}
 */
getValueArray: function() {
```


__Parameters__

* None


__Returns__

* <code>{[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;I&gt;}</code> - An Array of the Collection's values.


__Examples__

Empty Collection
```js
var myCollection    = new Collection([]);

myCollection.getValueArray();   // []
```

Starts with 2 items (order of items shown in examples is not indicative of real world results)
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);

myCollection.getValueArray()                // ["item1", "item2"]
```

Manipulation of Collection after array is returned.
(order of items shown in examples is not indicative of real world results)
```js
var myCollection    = new Collection([
    "item1",
    "item2"
]);
var myValueArray    = myCollection.getValueArray();

myCollection.add("item3")                   // ["item1", "item2"]

console.log(myCollection.getValueArray())   // ["item1", "item2", "item3"]
console.log(myValueArray)                   // ["item1", "item2"]
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_getValueCount" />
### Collection#getValueCount(value)

Returns an the number or items in the Collection that are equal to the given value.


__Method__

```javascript
/**
 * @param {*} value
 * @return {number}
 */
getValueCount: function(value) {
```


__Parameters__

* None


__Returns__

* <code>{number}</code> - The number of items in the Collection that are equal to the given value.


__Examples__

```js
var myCollection    = new Collection([
    "a",
    "a",
    "b"
]);

myCollection.getValueCount("a");    // 2
myCollection.getValueCount("b");    // 1
myCollection.getValueCount("c");    // 0
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_isEmpty" />
### Collection#isEmpty()

Returns true if the Collection is empty.


__Method__

```javascript
/**
 * @return {boolean}
 */
isEmpty: function() {
```


__Parameters__

* None


__Returns__

* <code>{true}</code> - True if the Collection is empty.


__Examples__

Empty Collection
```js
var myCollection    = new Collection([]);

myCollection.isEmpty();     // true
```

Not empty Collection
```js
var myCollection    = new Collection([
    "a"
]);

myCollection.isEmpty();     // false
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Collection_iterator" />
### Collection#iterator()

This method generates an iterator for this Collection.


__Notes__

* Because of the way javascript works and the current lack of Iterator support across browsers. Iterators
create a snap shot of the values in the Collection before starting the iteration process. If a value is modified
in one iteration and then visited at a later time, its value in the loop is its value when the iteration was
started.
* A value that is deleted before it has been visited WILL be visited later.
* Values added to the Collection over which iteration is occurring will be omitted from iteration.
* Iteration order of a Collection is not guaranteed.

__Method__

```javascript
/**
 * @return {IIterator}
 */
iterator: function() {
```


__Parameters__

* None


__Returns__

* <code>{[IIterator](#IIterator)}</code> - The generated IIterator instance.


__Examples__

Iterate Collection
```js
var myCollection    = new Collection([
    "a",
    "b",
    "c"
]);

var iterator = myCollection.iterator();
while (iterator.hasNext()) {
    var value = iterator.next();
}
```

Iterate past end of Collection
```js
var myCollection    = new Collection([
    "a",
    "b",
    "c"
]);

var iterator = myCollection.iterator();
iterator.next();    // "a"
iterator.next();    // "b"
iterator.next();    // "c"
iterator.next();    // throws and Exception of type "NoSuchElement"
```


<br /><a name="Event" />
## Event

The root event class for all other events in the bugcore system.


__Notes__

* Events can be listened for by type and queried on by the data they contain
* Events bubble by default


__Class__

```javascript
/**
 * @class
 * @extends {Obj}
 */
var Event = Class.extend(Obj, /** @lends {Event.prototype} */{
```


__Extends__
* [`Obj`](#Obj)


__Constructor Summary__

* [`public _constructor(string type, * data)`](#Event__constructor)


__Getters and Setters Summary__

* [`public getBubbles() :boolean`](#Event_getBubbles)
* [`public setBubbles(boolean bubbles)`](#Event_setBubbles)
* [`public getCurrentTarget() :*`](#Event_getCurrentTarget)
* [`public setCurrentTarget(* currentTarget)`](#Event_setCurrentTarget)
* [`public getData() :*`](#Event_getData)
* [`public getTarget(): *`](#Event_getTarget)
* [`public setTarget(* target)`](#Event_setTarget)
* [`public getType() :string`](#Event_getType)


__Method Summary__

* [`public isPropagationStopped() :boolean`](#Event_isPropagationStopped)
* [`public stopPropagation()`](#Event_stopPropagation)


<br />
------------------------------------------------------------------------------------
<br />

<a name="Event__constructor" />
### Event#_constructor(type, data)


__Method__

```javascript
/**
 * @constructs
 * @param {string} type
 * @param {*=} data
 */
_constructor: function(type, data) {
```


__Parameters__

* `type {string}` - The type of this event
* `data {*=}` - Any data to pass along with this Event (Optional)


__Examples__

Simple instantiation
```js
var myEvent = new Event("MyEvent");
```

Dispatching an event
```js
var myDispatcher = new EventDispatcher();

myDispatcher.dispatchEvent(new Event("MyEvent", {my: "data"}));
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Event_getBubbles" />
### Event#getBubbles()

Whether or not this Event bubbles


__Notes__

* Events bubble by default. So this will return true unless otherwise set.


__Method__

```javascript
/**
 * @return {boolean}
 */
getBubbles: function() {
```


__Parameters__

* None


__Returns__

* `{boolean}` - Whether or not this event bubbles


__Examples__

```js
var myEvent    = new Event();
myEvent.getBubbles();       // true
```


<br />
------------------------------------------------------------------------------------
<br />

<a name="Event_isPropagationStopped" />
### Event#isPropagationStopped():boolean

Returns whether or not propagation of this event has stopped.


__Notes__

* Event propagation is not stopped by default.
* To stop propagation simply call [`stopPropagation()`]("#Event_stopPorpagation"]


__Method__

```javascript
/**
 * @return {boolean}
 */
isPropagationStopped: function() {
```


__Parameters__

* None


__Returns__

* `{boolean}` - Whether or not propagation of this event has stopped.


__Examples__

```js
var myEvent     = new Event();
myEvent.isPropagationStopped();           // false;
myEvent.stopPropagation();
myEvent.isPropagationStopped();           // true;
```


<br /><a name="TypeUtil" />
## TypeUtil

Utility class for determining the data type of values.


__Class__

```javascript
/**
 * @constructor
 */
var TypeUtil = function() {
```


__Static Method Summary__

* [`static isArray(* value) :boolean`](#TypeUtil-isArray)
* [`static isBoolean(* value) :boolean`](#TypeUtil-isBoolean)
* [`static isDate(* value) :boolean`](#TypeUtil-isDate)
* [`static isFunction(* value) :boolean`](#TypeUtil-isFunction)
* [`static isNull(* value) :boolean`](#TypeUtil-isNull)
* [`static isNumber(* value) :boolean`](#TypeUtil-isNumber)
* [`static isObject(* value) :boolean`](#TypeUtil-isObject)
* [`static isString(* value) :boolean`](#TypeUtil-isString)
* [`static isUndefined(* value) :boolean`](#TypeUtil-isUndefined)
* [`static toType(* value) :string`](#TypeUtil-toType)


<br />
------------------------------------------------------------------------------------
<br />

<a name="TypeUtil-isArray" />
### TypeUtil.isArray(value):boolean

Determines if the given value is an array.


__Method__

```javascript
/**
 * @static
 * @param {*} value
 * @return {boolean}
 */
TypeUtil.isArray = function(value) {
```


__Parameters__

* `value {*}` - The value to check for the type of array


__Returns__

* `{boolean}` - Whether or not the value is an array.


__Examples__

Array literal is an array
```js
var myArray = [];
TypeUtil.isArray(myArray);      //true
```

Instance of Array is an array
```js
var myArray = new Array();
TypeUtil.isArray(myArray);      //true
```

Instance of Collection is NOT an array
```js
var myCollection = new Collection();
TypeUtil.isArray(myCollection); //false
```

number is NOT an array
```js
var myNumber = 123;
TypeUtil.isArray(myNumber);     //false
```


<br />
------------------------------------------------------------------------------------
<br />
