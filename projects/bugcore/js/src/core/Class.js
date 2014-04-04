/**
 * This work is based on...
 * Simple JavaScript Inheritance (http://ejohn.org/blog/simple-javascript-inheritance/)
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Class')

//@Require('Constructor')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Constructor     = bugpack.require('Constructor');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Constructor
//-------------------------------------------------------------------------------

/**
 * @constructor
 */
var Class = function() {};


//-------------------------------------------------------------------------------
// Private Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {boolean}
 */
Class.extending = false;


//-------------------------------------------------------------------------------
// Public Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {function(new:?)} adapteeConstructor
 * @param {Object} declaration
 */
Class.adapt = function(adapteeConstructor, declaration) {
    var originalConstructorPrototype    = Constructor.prototype;
    Constructor.prototype               = adapteeConstructor.prototype;
    var prototype                       = new Constructor();
    Constructor.prototype               = originalConstructorPrototype;
    var newConstructor = function() {};
    for (var name in originalConstructorPrototype) {
        prototype[name] = originalConstructorPrototype[name];
    }
    prototype._constructor = function() {
        adapteeConstructor.apply(this, arguments);
    };
    Class.static(newConstructor, Constructor);
    newConstructor.prototype        = prototype;
    newConstructor.constructor      = newConstructor;
    newConstructor._interfaces      = [];
    return Class.extend(newConstructor, declaration);
};

/**
 * @static
 * @param {Object} declaration
 * @return {function(new:Constructor)}
 */
Class.declare = function(declaration) {
    return Class.extend(Constructor, declaration);
};

/**
 * @static
 * @param {function(new:Constructor)} constructor
 * @param {Object} declaration
 * @return {function(new:Constructor)}
 */
Class.extend = function(constructor, declaration) {
    var _super          = constructor.prototype;
    Class.extending     = true;
    var prototype       = new constructor();
    Class.extending     = false;
    for (var name in declaration) {
        prototype[name] = TypeUtil.isFunction(prototype[name]) ?
            (function(name, fn) {
                return function() {
                    var oldSuper    = this._super;
                    this._super     = _super[name];
                    var returnValue = fn.apply(this, arguments);
                    this._super     = oldSuper;
                    return returnValue;
                };
            })(name, declaration[name]):
            declaration[name];
    }
    var newConstructor = function() {
        if (!Class.extending && this._constructor) {
            this._class = newConstructor;
            this._constructor.apply(this, arguments);
        }
    };
    newConstructor.prototype        = prototype;
    newConstructor.constructor      = newConstructor;
    Class.static(newConstructor, Constructor);
    newConstructor._interfaces      = [];
    newConstructor._superclass      = constructor;
    constructor.getInterfaces().forEach(function(_interface) {
        newConstructor._interfaces.push(_interface);
    });
    newConstructor.newInstance = (function() {
        function F(args) {
            return newConstructor.apply(this, args);
        }
        F.prototype = newConstructor.prototype;

        return function(args) {
            return new F(args);
        }
    })();
    return newConstructor;
};

/**
 * @static
 * @param {function(new:Constructor)} constructor
 * @param {function(new:Interface)} _interface
 */
Class.implement = function(constructor, _interface) {
    constructor.getInterfaces().forEach(function(implementedInterface) {
        if (implementedInterface === _interface) {
            throw new Error("Interface '" + implementedInterface.getBugPackKey() + "' has already been implemented by this class");
        }
    });
    for (var methodName in _interface.prototype) {
        if (!TypeUtil.isFunction(constructor.prototype[methodName])) {
            throw new Error("Class '" + constructor.getBugPackKey() + "' does not implement interface method '" + methodName + "'");
        }
    }
    constructor._interfaces.push(_interface);
};

/**
 * @static
 * @param {*} value
 * @param {function(new:Constructor)} constructor
 * @return {boolean}
 */
Class.doesExtend = function(value, constructor) {
    return value instanceof constructor;
};

/**
 * @static
 * @param {*} value
 * @param {function(new:Interface)} _interface
 * @return {boolean}
 */
Class.doesImplement = function(value, _interface) {
    if (TypeUtil.isObject(value) && TypeUtil.isFunction(value.getClass)) {
        for (var i = 0, size = value.getClass().getInterfaces().length; i < size; i++) {
            var implementedInterface = value.getClass().getInterfaces()[i];
            var implementedInterfaceInstance = new implementedInterface();
            if (implementedInterfaceInstance instanceof _interface) {
                return true;
            }
        }
    }
    return false;
};

/**
 * @static
 * @param {function(new:Constructor)} constructor
 * @param {Object} declaration
 */
Class.static = function(constructor, declaration) {
    for (var name in declaration) {
        constructor[name] = declaration[name];
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Class', Class);
