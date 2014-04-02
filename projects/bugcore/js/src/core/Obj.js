//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Obj')

//@Require('Class')
//@Require('HashUtil')
//@Require('IClone')
//@Require('IdGenerator')
//@Require('IEquals')
//@Require('IHashCode')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var HashUtil        = bugpack.require('HashUtil');
var IClone          = bugpack.require('IClone');
var IdGenerator     = bugpack.require('IdGenerator');
var IEquals         = bugpack.require('IEquals');
var IHashCode       = bugpack.require('IHashCode');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @implements {IClone}
 * @implements {IEquals}
 * @implements {IHashCode}
 */
var Obj = Class.declare({

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {?number}
         */
        this._hashCode      = undefined;

        // NOTE BRN: This value is set during the call to IdGenerator.injectId(). We just put this here for clarity's sake.

        /**
         * @private
         * @type {?number}
         */
        this._internalId    = undefined;

        IdGenerator.ensureId(this);
        Object.defineProperty(this, "_hashCode", {
            value : undefined,
            writable : true,
            enumerable : false,
            configurable : false
        });
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getInternalId: function() {
        return this._internalId;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {*}
     */
    clone: function(deep) {
        var classObject = this.getClass();
        var cloneObject = new classObject();
        Obj.forIn(this, function(key, value) {
            if (!TypeUtil.isFunction(value)) {
                if (deep) {
                    cloneObject[key] = Obj.clone(value, deep);
                } else {
                    cloneObject[key] = value;
                }
            }
        });
        return cloneObject;
    },


    //-------------------------------------------------------------------------------
    // IEquals Implementation
    //-------------------------------------------------------------------------------

    /**
     * If two Objs are equal then they MUST return the same hashCode. Otherwise the world will end!
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (value !== null && value !== undefined) {
            return (value._internalId === this._internalId);
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // IHashCode Implementation
    //-------------------------------------------------------------------------------

    /**
     * Equal hash codes do not necessarily guarantee equality.
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = HashUtil.hash(this);
        }
        return this._hashCode;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Obj, IClone);
Class.implement(Obj, IEquals);
Class.implement(Obj, IHashCode);


//-------------------------------------------------------------------------------
// Static Private Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {boolean}
 */
Obj.isDontEnumSkipped = true;

// test if properties that shadow DontEnum ones are enumerated
for (var prop in { toString: true }) {
    Obj.isDontEnumSkipped = false;
}

/**
 * @static
 * @private
 * @type {Array}
 */
Obj.dontEnumProperties = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'
];

/**
 * @static
 * @private
 * @type {function()}
 */
Obj.hasOwnProperty = Object.prototype.hasOwnProperty;


//-------------------------------------------------------------------------------
// Static Public Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {A} value
 * @param {boolean} deep
 * @return {A}
 * @template A
 */
Obj.clone = function(value, deep) {
    var clone = null;
    if (TypeUtil.isObject(value)) {
        if (Class.doesImplement(value, IClone)) {
            clone = value.clone(deep);
        } else {
            clone = {};
            Obj.forIn(value, function(propertyName, propertyValue) {
                if (deep) {
                    clone[propertyName] = Obj.clone(propertyValue, deep);
                } else {
                    clone[propertyName] = propertyValue;
                }
            });
        }
    } else if (TypeUtil.isArray(value)) {
        clone = [];
        for (var i = 0, size = value.length; i < size; i++) {
            var arrayValue = value[i];
            if (deep) {
                clone.push(Obj.clone(arrayValue, deep));
            } else {
                clone.push(arrayValue);
            }
        }
    } else {
        //TODO BRN: Any basic types that need to be cloned?
        clone = value;
    }
    return clone;
};

/**
 * @static
 * @param {*} value1
 * @param {*} value2
 * @return {boolean}
 */
Obj.equals = function(value1, value2) {
    if (Class.doesImplement(value1, IEquals)) {
        return value1.equals(value2);
    }
    var type1 = TypeUtil.toType(value1);
    var type2 = TypeUtil.toType(value2);
    if (type1 === type2) {
        switch (type1) {
            case "boolean":
                value1 = value1.valueOf();
                value2 = value2.valueOf();
                break;
            case "date":
                value1 = value1.getTime();
                value2 = value2.getTime();
                break;
            case "number":
                value1 = value1 - 0;
                value2 = value2 - 0;
                break;
            case "string":
                value1 = value1 + "";
                value2 = value2 + "";
                break;
        }
    }
    return value1 === value2;
};

/**
 * @static
 * @param {Object} object
 * @param {string} propertyQuery
 * @return {*}
 */
Obj.findProperty = function(object, propertyQuery) {

    //NOTE BRN: We're trying to dig down in to the property object. So if we have a property Object like this
    // {
    //     name: {
    //         subName: "someValue"
    //     }
    // }
    // and we request a property named "name.subName", then "someValue" should be returned. If we request the property
    // "name" then the object {subName: "someValue"} will be returned.

    var parts           = propertyQuery.split(".");
    var propertyValue   = object;
    for (var i = 0, size = parts.length; i < size; i++) {
        var part = parts[i];
        if (TypeUtil.isObject(propertyValue)) {
            propertyValue = propertyValue[part];
        } else {
            return undefined;
        }
    }
    return propertyValue;
};

/**
 * @license MIT License
 * This work is based on the code found here
 * https://github.com/kangax/protolicious/blob/master/experimental/object.for_in.js#L18
 *
 * NOTE BRN: If a property is modified in one iteration and then visited at a later time, its value in the loop is
 * its value at that later time. A property that is deleted before it has been visited will not be visited later.
 * Properties added to the object over which iteration is occurring may either be visited or omitted from iteration.
 * In general it is best not to add, modify or remove properties from the object during iteration, other than the
 * property currently being visited. There is no guarantee whether or not an added property will be visited, whether
 * a modified property (other than the current one) will be visited before or after it is modified, or whether a
 * deleted property will be visited before it is deleted.
 *
 * @static
 * @param {Object} object
 * @param {function(string, *)} func
 * @param {Object=} context
 */
Obj.forIn = function(object, func, context) {
    if (!func || (func && !func.call)) {
        throw new TypeError('Iterator function is required');
    }

    for (var propertyName in object) {
        if (Obj.hasProperty(object, propertyName)) {
            func.call(context || func, propertyName, object[propertyName]);
        }
    }

    if (Obj.isDontEnumSkipped) {
        for (var i = 0, size = Obj.dontEnumProperties.length; i < size; i++) {
            var dontEnumPropertyName = Obj.dontEnumProperties[i];
            if (Obj.hasProperty(object, dontEnumPropertyName)) {
                func.call(context || func, dontEnumPropertyName, object[dontEnumPropertyName]);
            }
        }
    }
};

/**
 * @static
 * @param {Object} object
 * @param {string} propertyName
 */
Obj.getProperty = function(object, propertyName) {
    if (Obj.hasProperty(object, propertyName)) {
        return object[propertyName];
    }
    return undefined;
};

/**
 * @static
 * @param {*} value
 * @return {number}
 */
Obj.hashCode = function(value) {
    if (Class.doesImplement(value, IHashCode)) {
        return value.hashCode();
    } else {
        return HashUtil.hash(value);
    }
};

/**
 * @static
 * @param {Object} object
 * @param {string} propertyName
 */
Obj.hasProperty = function(object, propertyName) {
    return Obj.hasOwnProperty.call(object, propertyName)
};

/**
 * @static
 * @param {Object} object
 * @returns {Array.<string>}
 */
Obj.getProperties = function(object) {
    var propertyArray = [];
    Obj.forIn(object, function(propertyName) {
        propertyArray.push(propertyName);
    });
    return propertyArray;
};

/**
 * @static
 * @param {*} value
 * @return {Iterator}
 */
Obj.iterator = function(value) {
    //TODO BRN: return the correct iterator for the given value. If not an iterable type, then throw an error
};

//TODO BRN: Think through this function a bit. Should the from object be cloned?
/**
 * @static
 * @param {*} from
 * @param {*} into
 * @return {*} into
 */
Obj.merge = function(from, into) {
    if (TypeUtil.isObject(from) && TypeUtil.isObject(into)) {
        Obj.forIn(from, function(prop, value) {
            into[prop] = from[prop];
        });
        return into;
    } else {
        throw new Error("both from and into parameters must be objects");
    }
};

/**
 * @static
 * @param {Object} object
 * @param {Array.<string>} properties
 * @return {Object}
 */
Obj.pick = function(object, properties) {
    if (!TypeUtil.isObject(object)) {
        throw new Error("parameter 'object' must be an object");
    }
    if (!TypeUtil.isArray(properties)) {
        throw new Error("parameter 'properties' must be an array");
    }
    var picked = {};
    properties.forEach(function(property) {
        if (Obj.hasProperty(object, property)) {
            picked[property] = object[property];
        }
    });
    return picked;
};

/**
 * @static
 * @param {Object} object
 * @param {string} propertyQuery
 * @param {*} value
 */
Obj.setProperty = function(object, propertyQuery, value) {
    if (!TypeUtil.isObject(object)) {
        throw new Error("parameter 'object' must be an object");
    }
    if (!TypeUtil.isString(propertyQuery)) {
        throw new Error("parameter 'propertyQuery' must be an string");
    }
    var parts           = propertyQuery.split(".");
    var propertyValue   = object;
    for (var i = 0, size = parts.length; i < size; i++) {
        var part = parts[i];
        if (i === size - 1) {
            propertyValue[part] = value;
        } else {
            if (!TypeUtil.isObject(propertyValue)) {
                propertyValue[part] = {};
            }
            propertyValue = propertyValue[part];
        }
    }
}


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Obj', Obj);
