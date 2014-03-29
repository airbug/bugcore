//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Observer')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('ObjectPathMatcher')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug         = bugpack.require('ArgumentBug');
var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var ObjectPathMatcher   = bugpack.require('ObjectPathMatcher');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var Observer = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPathPattern
     * @param {function(ObservableChange)} observerFunction
     * @param {Object=} observerContext
     */
    _constructor: function(objectPathPattern, observerFunction, observerContext) {

        this._super();

        if (!TypeUtil.isString(objectPathPattern)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "objectPathPattern", objectPathPattern, "parameter must be a string");
        }
        if (!TypeUtil.isFunction(observerFunction)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "observerFunction", observerFunction, "parameter must be a function");
        }

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.objectPathPattern  = objectPathPattern;

        /**
         * @private
         * @type {ObjectPathMatcher}
         */
        this.objectPathMatcher  = new ObjectPathMatcher(this.objectPathPattern);

        /**
         * @private
         * @type {Object}
         */
        this.observerContext    = observerContext;

        /**
         * @private
         * @type {function(ObservableChange)}
         */
        this.observerFunction   = observerFunction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ObjectPathMatcher}
     */
    getObjectPathMatcher: function() {
        return this.objectPathMatcher;
    },

    /**
     * @return {string}
     */
    getObjectPathPattern: function() {
        return this.objectPathPattern;
    },

    /**
     * @return {Object}
     */
    getObserverContext: function() {
        return this.observerContext;
    },

    /**
     * @return {function(ObservableChange)}
     */
    getObserverFunction: function() {
        return this.observerFunction;
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Observer)) {
            return (Obj.equals(value.getObserverFunction(), this.getObserverFunction()) &&
                Obj.equals(value.getObserverContext(), this.getObserverContext()) &&
                Obj.equals(value.getObjectPathPattern(), this.getObjectPathPattern()));
        }
        return false;
    },

    /**
     * @override
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[Observer]" +
                Obj.hashCode(this.getObserverFunction()) + "_" +
                Obj.hashCode(this.getObserverContext()) + "_" +
                Obj.hashCode(this.getObjectPathPattern()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} objectPath
     * @returns {boolean}
     */
    match: function(objectPath) {
        return this.objectPathMatcher.match(objectPath);
    },

    /**
     * @param {ObservableChange} change
     */
    observeChange: function(change) {
        this.getObserverFunction().call(this.getObserverContext(), change);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Observer', Observer);
