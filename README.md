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
    _constructor: function() {}
});
```

The library is extremely robust and makes up the foundation of our architecture
for [airbug](http://airbug.com) so check out the docs for an overview of the
full power of what the code has to offer. If the library is missing something
you need, please let us know!


## Download

The source is available for download from
[GitHub](https://github.com/airbug/bugcore)
Alternatively, you can install using Node Package Manager (`npm`):

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

### Class system

* [`Class`](#Class)
* [`Obj`](#Obj)

### Data Models

* [`Collection`](#Collection)
* [`List`](#List)
* [`Map`](#Map)
* [`Set`](#Set)


<a name="Class" />

## Class

Core static class used to build other classes.

### Class.extend

__Method__

 * @static
 * @param {new:Base} _class
 * @param {Object} declaration
 * @return {new:Base}


__Parameters__

* `_class` {new:Base} - The class to extend
* `declaration` {Object} - An object that declares the methods of the new class


__Returns__

* {new:Base} - the newly created class


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
