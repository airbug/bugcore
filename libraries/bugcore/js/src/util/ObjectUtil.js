/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObjectUtil')

//@Require('FunctionUtil')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var FunctionUtil    = bugpack.require('FunctionUtil');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     */
    var ObjectUtil = function() {};


    //-------------------------------------------------------------------------------
    // Static Private Variables
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @type {boolean}
     */
    ObjectUtil.isDontEnumSkipped = true;

    // test if properties that shadow DontEnum ones are enumerated
    for (var prop in { toString: true }) {
        ObjectUtil.isDontEnumSkipped = false;
    }

    /**
     * @static
     * @private
     * @type {Array}
     */
    ObjectUtil.dontEnumProperties = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {Object} into
     * @param {...Object} from
     * @return {Object}
     */
    ObjectUtil.assign = function(into, from) {
        var froms = Array.prototype.slice.call(arguments, 1);
        if (TypeUtil.isObjectLike(into)) {
            froms.forEach(function(from) {
                if (TypeUtil.isObjectLike(from)) {
                    ObjectUtil.forIn(from, function(prop, fromValue) {
                        ObjectUtil.setProperty(into, prop, fromValue);
                    });
                }
            });
            return into;
        }
        throw new Error("into parameter must be Object like");
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     * @param {{
     *      value: *,
     *      writable: boolean,
     *      enumerable: boolean,
     *      configurable: boolean
     * }} description
     */
    ObjectUtil.defineProperty = function(object, propertyName, description) {
        Object.defineProperty(object, propertyName, description);
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyQuery
     * @param {{
     *  own: boolean=
     * }=} options
     * @return {boolean}
     */
    ObjectUtil.deleteNestedProperty = function(object, propertyQuery, options) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new Error("'object' must be an Object");
        }
        if (!TypeUtil.isString(propertyQuery)) {
            throw new Error("'propertyQuery' must be a string");
        }
        var parts           = propertyQuery.split(".");
        var propertyValue   = object;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (TypeUtil.isObject(propertyValue)) {
                if (ObjectUtil.hasProperty(propertyValue, part, options)) {
                    if (i === size - 1) {
                        return ObjectUtil.deleteProperty(propertyValue, part, options);
                    }
                    propertyValue = propertyValue[part];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        return false;
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     * @param {{
     *  own: boolean=
     * }=} options
     * @return {boolean}
     */
    ObjectUtil.deleteProperty = function(object, propertyName, options) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new TypeError("parameter 'object' must be an object");
        }
        if (!TypeUtil.isString(propertyName)) {
            throw new TypeError("parameter 'propertyName' must be an string");
        }
        try {
            if (ObjectUtil.hasProperty(object, propertyName, options)) {
                delete object[propertyName];
                return true;
            }
        } catch(error) {
            //do nothing
        }
        return false;
    };

    /**
     * @static
     * @param {Object} object
     * @param {function(*, string):*} iteratee
     * @param {{
     *  context: Object=,
     *  in: boolean=,
     *  own: boolean=
     * }=} options
     * @return {Object}
     */
    ObjectUtil.for = function(object, iteratee, options) {
        return ObjectUtil.iterate(object, iteratee, options);
    };

    /**
     * @static
     * @param {Object} object
     * @param {function(*, string):*} iteratee
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @return {Object}
     */
    ObjectUtil.forEach = function(object, iteratee, options) {
        return ObjectUtil.for(object, iteratee, options);
    };

    /**
     * @static
     * @param {Object} object
     * @param {function(string, *):*} iteratee
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @return {Object}
     */
    ObjectUtil.forIn = function(object, iteratee, options) {
        return ObjectUtil.for(object, iteratee, ObjectUtil.options(options, {in: true}));
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyQuery
     * @param {{
     *  own: boolean=
     * }=} options
     * @return {boolean}
     */
    ObjectUtil.hasNestedProperty = function(object, propertyQuery, options) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new Error("'object' must be an Object");
        }
        if (!TypeUtil.isString(propertyQuery)) {
            throw new Error("'propertyQuery' must be a string");
        }
        var parts           = propertyQuery.split(".");
        var propertyValue   = object;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (TypeUtil.isObject(propertyValue)) {
                if (ObjectUtil.hasProperty(propertyValue, part, options)) {
                    propertyValue = propertyValue[part];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyQuery
     * @param {{
     *  own: boolean=
     * }=} options
     * @return {*}
     */
    ObjectUtil.getNestedProperty = function(object, propertyQuery, options) {

        // NOTE BRN: We're trying to dig down in to the property object. So if we have a property Object like this
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
            if (TypeUtil.isObject(propertyValue) && ObjectUtil.hasProperty(propertyValue, part, options)) {
                propertyValue = propertyValue[part];
            } else {
                return undefined;
            }
        }
        return propertyValue;
    };

    /**
     * @static
     * @param {Object} object
     * @param {{
     *  own: boolean=
     * }=} options
     * @return {Array.<string>}
     */
    ObjectUtil.getProperties = function(object, options) {
        var propertyArray = [];
        ObjectUtil.forIn(object, function(propertyName) {
            propertyArray.push(propertyName);
        }, null, options);
        return propertyArray;
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     * @param {{
     *  own: boolean=
     * }=} options
     * @return {*}
     */
    ObjectUtil.getProperty = function(object, propertyName, options) {
        if (ObjectUtil.hasProperty(object, propertyName, options)) {
            return object[propertyName];
        }
        return undefined;
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     * @param {{
     *  own: boolean=
     * }=} options
     */
    ObjectUtil.hasProperty = function(object, propertyName, options) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new TypeError("'object' must be an Object");
        }
        if (TypeUtil.isObject(options) && options.own) {
            return Object.prototype.hasOwnProperty.call(object, propertyName);
        }
        return (propertyName in object);
    };

    /**
     * @static
     * @param {Object} object
     * @return {boolean}
     */
    ObjectUtil.isEmpty = function(object) {
        return ObjectUtil.getProperties(object).length === 0;
    };

    /**
     * @static
     * @param {Object} object1
     * @param {Object} object2
     * @param {boolean=} deep
     * @return {boolean}
     */
    ObjectUtil.isEqual = function(object1, object2, deep) {
        //TODO BRN: Implement deep parameter

        if (!TypeUtil.isObject(object1)) {
            throw new TypeError( "'object1' must be an Object");
        }
        if (!TypeUtil.isObject(object2)) {
            throw new TypeError( "'object2' must be an Object");
        }
        if (object1 === object2) {
            return true;
        }
        var object1Properties = ObjectUtil.getProperties(object1);
        var object2Properties = ObjectUtil.getProperties(object2);

        if (object1Properties.length !== object2Properties.length) {
            return false;
        }
        for (var i = 0, size = object1Properties.length; i < size; i++) {
            if (object1Properties[i] !== object2Properties[i])  {
                return false;
            }
            if (object1[object1Properties[i]] !== object2[object2Properties[i]]) {
                return false;
            }
        }
        return true;
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
     * @param {function(*, string):*} iteratee
     * @param {{
     *  context: Object=,
     *  in: boolean=,
     *  own: boolean=
     * }=} options
     * @return {Object}
     */
    ObjectUtil.iterate = function(object, iteratee, options) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new TypeError("'object' must be Object like");
        }
        if (!iteratee || (iteratee && !iteratee.call)) {
            throw new Error('Iterator function is required');
        }

        options = ObjectUtil.options(options);
        var context = options.context;
        var _in = options.in;
        for (var propertyName in object) {
            if (ObjectUtil.hasProperty(object, propertyName, options)) {
                var args = _in ? [propertyName, object[propertyName]] : [object[propertyName], propertyName];
                var result = FunctionUtil.apply(iteratee, context, args.concat(object));
                if (result === false) {
                    break;
                }
            }
        }

        if (ObjectUtil.isDontEnumSkipped) {
            for (var i = 0, size = ObjectUtil.dontEnumProperties.length; i < size; i++) {
                var dontEnumPropertyName = ObjectUtil.dontEnumProperties[i];
                if (ObjectUtil.hasProperty(object, dontEnumPropertyName, options)) {
                    var args = _in ? [dontEnumPropertyName, object[dontEnumPropertyName]] : [object[dontEnumPropertyName], dontEnumPropertyName];
                    var result = FunctionUtil.call(iteratee, context, args.concat(object));
                    if (result === false) {
                        break;
                    }
                }
            }
        }
        return object;
    };

    /**
     * @static
     * @param {Object} into
     * @param {...Object} from
     * @return {Object}
     */
    ObjectUtil.merge = function(into, from) {
        var froms = Array.prototype.slice.call(arguments, 1);
        if (TypeUtil.isObjectLike(into)) {
            froms.forEach(function(from) {
                if (TypeUtil.isObjectLike(from)) {
                    ObjectUtil.forIn(from, function(prop, fromValue) {
                        var intoValue = into[prop];
                        if (TypeUtil.isObjectLike(fromValue) && TypeUtil.isObjectLike(intoValue)) {
                            ObjectUtil.merge(intoValue, fromValue);
                        } else {
                            ObjectUtil.setProperty(into, prop, fromValue);
                        }
                    });
                } else {
                    throw new Error("from parameter must be Object like");
                }
            });
            return into;
        }
        throw new Error("into parameter must be Object like");
    };

    /**
     * @static
     * @param {Object} object
     * @param {...(Array.<string> | string)} properties
     * @return {Object}
     */
    ObjectUtil.omit = function(object, properties) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new TypeError("parameter 'object' must be an Object");
        }

        var args = Array.prototype.slice.call(arguments, 1);
        var omitProperties = [];
        args.forEach(function(arg) {
            if (TypeUtil.isArray(arg)) {
                omitProperties = omitProperties.concat(arg);
            } else if (TypeUtil.isString(arg)) {
                omitProperties = omitProperties.concat([arg]);
            } else {
                throw new TypeError("parameter 'properties' must be an Array or a string");
            }
        });
        var omitted = {};
        ObjectUtil.forIn(object, function(property, value) {
            if (omitProperties.indexOf(property) === -1) {
                 omitted[property] = value;
            }
        });
        return omitted;
    };

    /**
     * @static
     * @param {Object} object
     * @param {...(Array.<string> | string)} properties
     * @return {Object}
     */
    ObjectUtil.pick = function(object, properties) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new TypeError("parameter 'object' must be an Object");
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var pickProperties = [];
        args.forEach(function(arg) {
            if (TypeUtil.isArray(arg)) {
                pickProperties = pickProperties.concat(arg);
            } else if (TypeUtil.isString(arg)) {
                pickProperties = pickProperties.concat([arg]);
            } else {
                throw new TypeError("parameter 'properties' must be an Array or a string");
            }
        });
        var picked = {};
        pickProperties.forEach(function(property) {
            if (ObjectUtil.hasProperty(object, property)) {
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
     * @return {boolean}
     */
    ObjectUtil.setNestedProperty = function(object, propertyQuery, value) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new TypeError("parameter 'object' must be an object");
        }
        if (!TypeUtil.isString(propertyQuery)) {
            throw new TypeError("parameter 'propertyQuery' must be an string");
        }
        var parts           = propertyQuery.split(".");
        var propertyValue   = object;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (i === size - 1) {
                return ObjectUtil.setProperty(propertyValue, part, value);
            } else {
                if (!TypeUtil.isObject(propertyValue[part])) {
                    ObjectUtil.setProperty(propertyValue, part, {});
                }
                propertyValue = propertyValue[part];
            }
        }
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     * @param {*} value
     * @return {boolean}
     */
    ObjectUtil.setProperty = function(object, propertyName, value) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new TypeError("parameter 'object' must be an object");
        }
        if (!TypeUtil.isString(propertyName)) {
            throw new TypeError("parameter 'propertyName' must be an string");
        }
        try {
            object[propertyName] = value;
            return true;
        } catch(error) {
            return false;
        }
    };

    /**
     * @static
     * @param {Object} object
     * @return {string}
     */
    ObjectUtil.toConstructorName = function(object) {
        if (!TypeUtil.isObjectLike(object)) {
            throw new TypeError("parameter 'object' must be an object");
        }
        return FunctionUtil.toName(object.constructor);
    };


    //-------------------------------------------------------------------------------
    // Static Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @param {Object=} options
     * @param {Object=} overrides
     * @returns {Object}
     */
    ObjectUtil.options = function(options, overrides) {
        options = options || {};
        for (var key in overrides) {
            options[key] = overrides[key];
        }
        return options;
    };



    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ObjectUtil', ObjectUtil);
});
