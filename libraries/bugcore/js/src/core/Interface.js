/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Interface')

//@Require('Implementable')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Implementable   = bugpack.require('Implementable');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     * @param {function(new:Implementable)} implementable
     * @param {string} name
     * @param {Interface=} superinterface
     */
    var Interface = function(implementable, name, superinterface) {

        /**
         * @private
         * @type {function(new:Implementable)}
         */
        this.implementable      = implementable;

        /**
         * @private
         * @type {string}
         */
        this.name               = name;

        /**
         * @private
         * @type {Interface}
         */
        this.superinterface     = superinterface;
    };


    //-------------------------------------------------------------------------------
    // Prototype
    //-------------------------------------------------------------------------------

    Interface.prototype = {

        /**
         * @return {function(new:Implementable)}
         */
        getImplementable: function() {
            return this.implementable;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },

        /**
         * @return {Interface}
         */
        getSuperinterface: function() {
            return this.superinterface;
        }
    };


    //-------------------------------------------------------------------------------
    // Public Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {Object.<string, function(..):*>} declaration
     * @return {function(new:Implementable)}
     */
    Interface.declare = function(declaration) {
        return Interface.extend(Implementable, declaration);
    };

    /**
     * @static
     * @param {function(new:Implementable)} implementable
     * @param {Object.<string, function(..):*>} declaration
     * @return {function(new:Implementable)}
     */
    Interface.extend = function(implementable, declaration) {
        var prototype       = new implementable();
        var interfaceName   = declaration["_name"] || "";
        delete declaration["_name"];
        for (var name in declaration) {
            if (Object.prototype.hasOwnProperty.call(declaration, name)) {
                if (TypeUtil.isFunction(declaration[name])) {
                    prototype[name] = declaration[name];
                } else {
                    throw new Error("Interface can only declare functions");
                }
            }
        }
        var newImplementable = function() {};
        newImplementable.prototype = prototype;
        newImplementable.constructor = newImplementable;
        Interface.static(newImplementable, Implementable);
        var newInterface = new Interface(newImplementable, interfaceName, implementable.getInterface());
        Object.defineProperty(newImplementable, "_interface", {
            value : newInterface,
            writable : false,
            enumerable : false,
            configurable : false
        });
        return newImplementable;
    };

    /**
     * @static
     * @param {function(new:Implementable)} implementable
     * @param {Object} declaration
     */
    Interface['static'] = function(implementable, declaration) {
        for (var name in declaration) {
            if (Object.prototype.hasOwnProperty.call(declaration, name)) {
                implementable[name] = declaration[name];
            }
        }
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Interface', Interface);
});
