/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Suppliers')

//@Require('ArraySupplier')
//@Require('Class')
//@Require('IterableSupplier')
//@Require('MethodSupplier')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArraySupplier       = bugpack.require('ArraySupplier');
    var Class               = bugpack.require('Class');
    var IterableSupplier    = bugpack.require('IterableSupplier');
    var MethodSupplier      = bugpack.require('MethodSupplier');
    var Obj                 = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Suppliers = Class.extend(Obj, {
        _name: "Suppliers"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<I>} array
     * @return {ArraySupplier.<I>}
     * @template I
     */
    Suppliers.array = function(array) {
        return new ArraySupplier(array);
    };

    /**
     * @param {IIterable.<I>} iterable
     * @return {IterableSupplier.<I>}
     * @template I
     */
    Suppliers.iterable = function(iterable) {
        return new IterableSupplier(iterable);
    };

    /**
     * @param {function(Supplier)} method
     * @return {MethodSupplier}
     * @template I
     */
    Suppliers.method = function(method) {
        return new MethodSupplier(method);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Suppliers', Suppliers);
});
