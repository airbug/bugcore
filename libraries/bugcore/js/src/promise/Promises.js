/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
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
     * @param {function(...):*} promiseMethod
     * @return {Promise}
     */
    Promises.promise = function(promiseMethod) {
        var promise = new Promise();
        promise.resolvePromise([]);
        return promise.then(promiseMethod);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Promises', Promises);
});
