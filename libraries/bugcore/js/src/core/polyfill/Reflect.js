/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Reflect')

//@Require('Object')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Object          = bugpack.require('Object');


    //-------------------------------------------------------------------------------
    // Polyfill
    //-------------------------------------------------------------------------------

    Reflect = typeof(Reflect) == 'undefined' ? function() {} : Reflect;


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {function(...):*} target
     * @param {Object} receiver
     * @param {Array.<*>} args
     * @return {*}
     */
    Reflect.apply = function(target, receiver, args) {
        return Function.prototype.apply.call(target, this, args);
    };

    /**
     * @static
     * @param {function(...):*} target
     * @param {Array.<*>} args
     * @return {*}
     */
    Reflect.construct = function(target, args) {
        function F(args) {
            return Function.prototype.apply.call(target, this, args);
        }
        F.prototype = target.prototype;
        return new F(arguments);
    };

    /**
     * @static
     * @param {Object} target
     * @param {string} name
     * @param {{}} desc
     * @return {boolean}
     */
    Reflect.defineProperty = function(target, name, desc) {
        try {
            Object.defineProperty(target, name, desc);
            Object.getNotifier(target).notify({
                name: name,
                object: target,
                type: "reconfigure"
            });
            return true;
        } catch (error) {
            return false;
        }
    };

    /**
     * @static
     * @param {Object} target
     * @param {string} name
     * @return {boolean}
     */
    Reflect.deleteProperty = function(target, name) {
        try {
            if (Reflect.has(target, name)) {
                var oldValue = target[name];
                delete target[name];
                Object.getNotifier(target).notify({
                    name: name,
                    object: target,
                    oldValue: oldValue,
                    type: "delete"
                });
                return true;
            }
        } catch(error) {
           //do nothing
        }
        return false;
    };

    /**
     * @static
     * @param {Object} target
     * @return {Iterator}
     */
    Reflect.enumerate = function(target) {
        //TODO BRN: Return an iterator of the target object that iterates the properties
    };

    /**
     * DOES include inherited properties
     * @static
     * @param {Object} target
     * @param name
     * @param receiver
     * @return {*}
     */
    Reflect.get = function(target, name, receiver) {

        //TODO BRN: What to do with receiver?

        return target[name];
    };

    /**
     * @static
     * @param {Object} target
     * @param {string} name
     * @return {Object}
     */
    Reflect.getOwnPropertyDescriptor = function(target, name) {
        return Object.getOwnPropertyDescriptor(target, name);
    };

    /**
     * @static
     * @param {Object} target
     * @return {Object}
     */
    Reflect.getPrototypeOf = function(target) {
        return Object.getPrototypeOf(target);
    };

    /**
     * DOES include inherited properties
     * @static
     * @param {Object} target
     * @param {string} name
     * @return {boolean}
     */
    Reflect.has = function(target, name) {
        return (name in target);
    };

    /**
     * @static
     * @param {Object} target
     * @return {boolean}
     */
    Reflect.isExtensible = function(target) {
        return Object.isExtensible(target);
    };

    /**
     * Does not include inherited properties
     * @static
     * @param {Object} target
     * @return {Array}
     */
    Reflect.ownKeys = function(target) {
        return Object.keys(target);
    };

    /**
     * @static
     * @param {Object} target
     * @return {boolean}
     */
    Reflect.preventExtensions = function(target) {
        try {
            Object.preventExtensions(target);
            Object.getNotifier(target).notify({
                object: target,
                type: "preventExtensions"
            });
            return true;
        } catch(error) {
            return false;
        }
    };

    /**
     * @static
     * @param {Object} target
     * @param {string} name
     * @param {*} value
     * @param {*} receiver
     * @return {boolean}
     */
    Reflect.set = function(target, name, value, receiver) {
        try {
            var oldValue = target[name];
            var changeType = "add";
            if (Reflect.has(target, name)) {
                changeType = "update";
            }
            target[name] = value;
            Object.getNotifier(target).notify({
                name: name,
                object: target,
                oldValue: oldValue,
                type: changeType
            });
            return true;
        } catch(error) {
            return false;
        }
    };

    /**
     * @static
     * @param {Object} target
     * @param {Object} newProto
     * @return {boolean}
     */
    Reflect.setPrototypeOf = function(target, newProto) {
        try {
            target.__proto__ = newProto;
            Object.getNotifier(target).notify({
                object: target,
                type: "setPrototype"
            });
            return true;
        } catch (error) {
            return false;
        }
    };



    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Reflect', Reflect);
});
