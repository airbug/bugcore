/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Constructor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     */
    var Constructor = function() {

        /**
         * @private
         * @type {Class}
         */
        this._class = null;
    };


    //-------------------------------------------------------------------------------
    // Prototype
    //-------------------------------------------------------------------------------

    Constructor.prototype = {

        /**
         * @return {Class}
         */
        getClass: function() {
            return this._class;
        }
    };


    //-------------------------------------------------------------------------------
    // Static Private Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @type {Class}
     */
    Constructor._class = null;

    /**
     * @static
     * @private
     * @type {boolean}
     */
    Constructor.allocateOnly = false;


    //-------------------------------------------------------------------------------
    // Static Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {Class}
     */
    Constructor.getClass = function() {
        return this._class;
    };


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {*...}
     * @return {Constructor}
     */
    Constructor.alloc = function() {
        var constructor = this;
        function F(args) {
            return Function.prototype.apply.call(constructor, this, args);
        }
        F.prototype = constructor.prototype;
        Constructor.allocateOnly = true;
        var instance = new F(arguments);
        Constructor.allocateOnly = false;
        return instance;
    };

    /**
     * @static
     * @param {Array.<*>} args
     * @return {Constructor}
     */
    Constructor.allocWithArray = function(args) {
        var constructor = this;
        function F(args) {
            return Function.prototype.apply.call(constructor, this, args);
        }
        F.prototype = constructor.prototype;
        Constructor.allocateOnly = true;
        var instance = new F(args);
        Constructor.allocateOnly = false;
        return instance;
    };

    /**
     * @static
     * @param {*...}
     * @return {Constructor}
     */
    Constructor.newInstance = function() {
        var constructor = this;
        function F(args) {
            return Function.prototype.apply.call(constructor, this, args);
        }
        F.prototype = constructor.prototype;
        return new F(arguments);
    };

    /**
     * @static
     * @param {Array.<*>} args
     * @return {Constructor}
     */
    Constructor.newInstanceWithArray = function(args) {
        var constructor = this;
        function F(args) {
            return Function.prototype.apply.call(constructor, this, args);
        }
        F.prototype = constructor.prototype;
        return new F(args);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Constructor', Constructor);
});
