//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ProxyMethod')

//@Require('Class')
//@Require('Interface')
//@Require('IProxy')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Interface   = bugpack.require('Interface');
var IProxy      = bugpack.require('IProxy');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ProxyMethod = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(method, context) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.context = context;

        /**
         * @private
         * @type {function()}
         */
        this.method = method;
    },


    //-------------------------------------------------------------------------------
    // IProxy Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {string} functionName
     * @param {Array.<*>} args
     */
    proxy: function(functionName, args) {
        var target = this.method.call(this.context);
        if (target) {
            return target[functionName].apply(target, args);
        } else {
            throw new Error("Method did not return a value that could be proxied.");
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(ProxyMethod, IProxy);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ProxyMethod', ProxyMethod);
