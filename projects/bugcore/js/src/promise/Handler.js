//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Handler')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var Handler = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {function(...):*} method
     * @param {Promise} forwardPromise
     */
    _constructor: function(method, forwardPromise) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(...[*]): *}
         */
        this.method             = method;

        /**
         * @private
         * @type {Promise}
         */
        this.forwardPromise     = forwardPromise;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(...):*}
     */
    getMethod: function() {
        return this.method;
    },

    /**
     * @return {Promise}
     */
    getForwardPromise: function() {
        return this.forwardPromise;
    },


    //-------------------------------------------------------------------------------
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {Array.<*>} args
     */
    handle: function(args) {

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} args
     */
    doHandleMethod: function(args) {
        try {
            var result = this.method.apply(null, args);
            if (!TypeUtil.isUndefined(result)) {
                this.forwardPromise.resolvePromise([result]);
            }
        } catch(e) {
            this.forwardPromise.rejectPromise([e]);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Handler', Handler);
