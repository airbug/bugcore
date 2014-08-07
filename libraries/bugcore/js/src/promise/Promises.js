/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Promises')

//@Require('Class')
//@Require('Deferred')
//@Require('Obj')
//@Require('Promise')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Deferred        = bugpack.require('Deferred');
    var Obj             = bugpack.require('Obj');
    var Promise         = bugpack.require('Promise');


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
    Promises.deferred = function(items) {
        return new Deferred(items);
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
