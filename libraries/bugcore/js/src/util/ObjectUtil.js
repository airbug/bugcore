/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
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

require('bugpack').context('*', function(bugpack) {

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
    ObjectUtil.isDontEnumSkipped = (function() {
        var obj = { toString: false };
        for (var prop in obj) {
            return obj[prop];
        }
        return true;
    })();

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
     * @param {string} propertyName
     */
    ObjectUtil.deleteProperty = function(object, propertyName) {
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('parameter "object" must be an object');
        }
        if (!(TypeUtil.isString(propertyName) || TypeUtil.isNumber(propertyName))) {
            throw new TypeError('parameter "propertyName" must be an string');
        }
        try {
            if (ObjectUtil.hasProperty(object, propertyName)) {
                delete object[propertyName];
                return true;
            }
        } catch(error) {
            return false;
        }
        return false;
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyQuery
     * @return {boolean}
     */
    ObjectUtil.hasNestedProperty = function(object, propertyQuery) {
        if (!TypeUtil.isObject(object)) {
            throw new Error('"object" must be an Object');
        }
        if (!TypeUtil.isString(propertyQuery)) {
            throw new Error('"propertyQuery" must be a string');
        }
        var parts           = propertyQuery.split('.');
        var propertyValue   = object;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (TypeUtil.isObject(propertyValue)) {
                if (ObjectUtil.hasProperty(propertyValue, part)) {
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
     * @return {boolean}
     */
    ObjectUtil.hasOwnNestedProperty = function(object, propertyQuery) {
        if (!TypeUtil.isObject(object)) {
            throw new Error('"object" must be an Object');
        }
        if (!TypeUtil.isString(propertyQuery)) {
            throw new Error('"propertyQuery" must be a string');
        }
        var parts           = propertyQuery.split('.');
        var propertyValue   = object;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (TypeUtil.isObject(propertyValue)) {
                if (ObjectUtil.hasOwnProperty(propertyValue, part)) {
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
     * @return {*}
     */
    ObjectUtil.getNestedProperty = function(object, propertyQuery) {

        // NOTE BRN: We're trying to dig down in to the property object. So if we have a property Object like this
        // {
        //     name: {
        //         subName: 'someValue'
        //     }
        // }
        // and we request a property named 'name.subName', then 'someValue' should be returned. If we request the property
        // 'name' then the object {subName: 'someValue'} will be returned.

        var parts           = propertyQuery.split('.');
        var propertyValue   = object;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (TypeUtil.isObject(propertyValue) && ObjectUtil.hasProperty(propertyValue, part)) {
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
     * @param {string} propertyQuery
     * @return {*}
     */
    ObjectUtil.getOwnNestedProperty = function(object, propertyQuery) {

        // NOTE BRN: We're trying to dig down in to the property object. So if we have a property Object like this
        // {
        //     name: {
        //         subName: 'someValue'
        //     }
        // }
        // and we request a property named 'name.subName', then 'someValue' should be returned. If we request the property
        // 'name' then the object {subName: 'someValue'} will be returned.

        var parts           = propertyQuery.split('.');
        var propertyValue   = object;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (TypeUtil.isObject(propertyValue) && ObjectUtil.hasOwnProperty(propertyValue, part)) {
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
    ObjectUtil.forIn = function(object, func, context) {
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('"object" must be an Object');
        }
        if (!func || (func && !func.call)) {
            throw new Error('Iterator function is required');
        }

        for (var propertyName in object) {
            Function.prototype.call.call(func, context || func, propertyName, object[propertyName]);
        }

        if (ObjectUtil.isDontEnumSkipped) {
            for (var i = 0, size = ObjectUtil.dontEnumProperties.length; i < size; i++) {
                var dontEnumPropertyName = ObjectUtil.dontEnumProperties[i];
                if (ObjectUtil.hasProperty(object, dontEnumPropertyName)) {
                    Function.prototype.call.call(func, context || func, dontEnumPropertyName, object[dontEnumPropertyName]);
                }
            }
        }
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
     * @param {function(string|number, *)} func
     * @param {Object=} context
     */
    ObjectUtil.forInOwn = function(object, func, context) {
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('"object" must be an Object');
        }
        if (!func || (func && !func.call)) {
            throw new Error('Iterator function is required');
        }

        for (var propertyName in object) {
            if (ObjectUtil.hasOwnProperty(object, propertyName)) {
                Function.prototype.call.call(func, context || func, propertyName, object[propertyName]);
            }
        }

        if (ObjectUtil.isDontEnumSkipped) {
            for (var i = 0, size = ObjectUtil.dontEnumProperties.length; i < size; i++) {
                var dontEnumPropertyName = ObjectUtil.dontEnumProperties[i];
                if (ObjectUtil.hasOwnProperty(object, dontEnumPropertyName)) {
                    Function.prototype.call.call(func, context || func, dontEnumPropertyName, object[dontEnumPropertyName]);
                }
            }
        }
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     * @return {*}
     */
    ObjectUtil.getOwnProperty = function(object, propertyName) {
        if (ObjectUtil.hasOwnProperty(object, propertyName)) {
            return object[propertyName];
        }
        return undefined;
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     * @return {*}
     */
    ObjectUtil.getProperty = function(object, propertyName) {
        return object[propertyName];
    };

    /**
     * @static
     * @param {Object} object
     * @return {Array.<string>}
     */
    ObjectUtil.getOwnProperties = function(object) {
        var propertyArray = [];
        ObjectUtil.forInOwn(object, function(propertyName) {
            propertyArray.push(propertyName);
        });
        return propertyArray;
    };

    /**
     * @static
     * @param {Object} object
     * @return {Array.<string>}
     */
    ObjectUtil.getProperties = function(object) {
        var propertyArray = [];
        ObjectUtil.forIn(object, function(propertyName) {
            propertyArray.push(propertyName);
        });
        return propertyArray;
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     */
    ObjectUtil.hasOwnProperty = function(object, propertyName) {
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('"object" must be an Object');
        }
        return Object.prototype.hasOwnProperty.call(object, propertyName);
    };

    /**
     * @static
     * @param {Object} object
     * @param {string} propertyName
     */
    ObjectUtil.hasProperty = function(object, propertyName) {
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('"object" must be an Object');
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
    ObjectUtil.isEqual = function(object1, object2) {
        //TODO BRN: Implement deep parameter

        if (!TypeUtil.isObject(object1)) {
            throw new TypeError( '"object1" must be an Object');
        }
        if (!TypeUtil.isObject(object2)) {
            throw new TypeError( '"object2" must be an Object');
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
     * @static
     * @param {Object} from
     * @param {Object} into
     * @return {Object}
     */
    ObjectUtil.merge = function(from, into) {
        if (TypeUtil.isObject(from) && TypeUtil.isObject(into)) {
            ObjectUtil.forIn(from, function(prop, value) {
                ObjectUtil.setProperty(into, prop, value);
            });
            return into;
        } else {
            throw new Error('both from and into parameters must be Objects');
        }
    };

    /**
     * @static
     * @param {Object} object
     * @param {Array.<string>} properties
     * @return {Object}
     */
    ObjectUtil.pick = function(object, properties) {
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('parameter "object" must be an Object');
        }
        if (!TypeUtil.isArray(properties)) {
            throw new TypeError('parameter "properties" must be an Array');
        }
        var picked = {};
        properties.forEach(function(property) {
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
     */
    ObjectUtil.setNestedProperty = function(object, propertyQuery, value) {
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('parameter "object" must be an object');
        }
        if (!TypeUtil.isString(propertyQuery)) {
            throw new TypeError('parameter "propertyQuery" must be an string');
        }
        var parts           = propertyQuery.split('.');
        var propertyValue   = object;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (i === size - 1) {
                ObjectUtil.setProperty(propertyValue, part, value);
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
     */
    ObjectUtil.setProperty = function(object, propertyName, value) {
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('parameter "object" must be an object');
        }
        if (!(TypeUtil.isString(propertyName) || TypeUtil.isNumber(propertyName))) {
            throw new TypeError('parameter "propertyName" must be an string');
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
        if (!TypeUtil.isObject(object)) {
            throw new TypeError('parameter "object" must be an object');
        }
        return FunctionUtil.toName(object.constructor);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ObjectUtil', ObjectUtil);
});
