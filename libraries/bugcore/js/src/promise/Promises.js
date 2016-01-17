/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Promises')

//@Require('Class')
//@Require('Deferred')
//@Require('IPromise')
//@Require('Obj')
//@Require('Promise')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Deferred    = bugpack.require('Deferred');
    var IPromise    = bugpack.require('IPromise');
    var Obj         = bugpack.require('Obj');
    var Promise     = bugpack.require('Promise');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Promises = Class.extend(Obj, {
        _name: "Promises"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {...(Array<*> | IIterable<*>)} iterable
     * @return {Promise}
     */
    Promises.all = function(iterable) {
        return Promise.all.apply(Promise, arguments);
    };

    /**
     * @static
     * @return {Deferred}
     */
    Promises.deferred = function() {
        return new Deferred();
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    Promises.isPromise = function(value) {
        if (Class.doesImplement(value, IPromise)) {
            return true;
        } else if (TypeUtil.isFunction(value) || TypeUtil.isObject(value)) {
             if (TypeUtil.isFunction(value.then)) {
                 return true;
             }
        }
        return false;
    };

    /**
     * @static
     * @param {function(function(...*), function(...*))=} promiseMethod
     * @return {Promise}
     */
    Promises.promise = function(promiseMethod) {
        return Promise.promise(promiseMethod);
    };

    /**
     * @static
     * @param {...(Object<*, *> | IMap<*, *>)} object
     * @return {Promise}
     */
    Promises.props = function(object) {
        return Promise.props.apply(Promise, arguments);
    };

    /**
     * @static
     * @param {...(Array<*> | IIterable<*>)} iterable
     * @return {Promise}
     */
    Promises.race = function(iterable) {
        return Promise.race.apply(Promise, arguments);
    };

    /**
     * @static
     * @param {...*} reason
     * @return {Promise}
     */
    Promises.reject = function(reason) {
        return Promise.reject.apply(Promise, arguments);
    };

    /**
     * @static
     * @param {...*} value
     * @returns {Promise}
     */
    Promises.resolve = function(value) {
        return Promise.resolve.apply(Promise, arguments);
    };

    /**
     * @static
     * @param {function(...*):*} promiseMethod
     * @returns {Promise}
     */
    Promises.try = function(promiseMethod) {
        return Promise.try(promiseMethod);
    };



    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Promises', Promises);
});

