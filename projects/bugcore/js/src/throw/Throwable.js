//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Throwable')

//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')
//@Require('StackTraceUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IObjectable     = bugpack.require('IObjectable');
var Obj             = bugpack.require('Obj');
var StackTraceUtil  = bugpack.require('StackTraceUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Throwable = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {string} type
     * @param {*=} data
     * @param {string=} message
     * @param {Array.<Throwable>=} causes
     * @private
     */
    _constructor: function(type, data, message, causes) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<Throwable>}
         */
        this.causes             = causes ? causes : [];

        /**
         * @private
         * @type {*}
         */
        this.data               = data;

        /**
         * @private
         * @type {string}
         */
        this.message            = message;

        /**
         * @private
         * @type {string}
         */
        this.primaryStack       = undefined;

        /**
         * @private
         * @type {string}
         */
        this.stack              = undefined;

        /**
         * @private
         * @type {string}
         */
        this.type               = type;

        this.buildStackTrace();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array.<Throwable>}
     */
    getCauses: function() {
        return this.causes;
    },

    /**
     * @return {*}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @param {*} data
     */
    setData: function(data) {
        this.data = data;
    },

    /**
     * @return {string}
     */
    getMessage: function() {
        return this.message;
    },

    /**
     * @param {string} message
     */
    setMessage: function(message) {
        this.message = message;
    },

    /**
     * @return {string}
     */
    getStack: function() {
        return this.stack;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return {
            causes: this.getCauses(),
            data: this.getData(),
            message: this.getMessage(),
            type: this.getType()
        }
    },

    toString: function() {
        return "{" +
            "causes:"   + this.getCauses().join(",\n") + "," +
            "data:"     + this.getData() + "\n" +
            "message:"  + this.getMessage() + "\n" +
            "type:"     + this.getType() + "\n" +
            "}";
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Throwable} cause
     */
    addCause: function(cause) {
        this.causes.push(cause);
        this.buildStackTrace();
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    buildStackTrace: function() {
        var _this = this;
        if (!this.primaryStack) {
            this.primaryStack = this.generateStackTrace();
        }
        var stack = this.primaryStack + "\n";
        stack += "\n";
        if (this.causes.length > 0) {
            stack += this.type + " was caused by " + this.causes.length + " exceptions:\n";
            var count = 0;
            this.causes.forEach(function(cause) {
                count++;
                stack += _this.type + " cause " + count + ":\n";
                stack += cause.message + "\n";
                stack += cause.stack;
            });
        }
        this.stack = stack;
    },

    /**
     * @protected
     * @returns {string}
     */
    generateStackTrace: function() {
        return this.message + "\n" + StackTraceUtil.generateStackTrace();
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Throwable, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Throwable', Throwable);
