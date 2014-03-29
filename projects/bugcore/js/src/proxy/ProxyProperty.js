//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ProxyProperty')

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

var ProxyProperty = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(instance, propertyName) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.instance = instance;

        /**
         * @private
         * @type {string}
         */
        this.propertyName = propertyName;
    },


    //-------------------------------------------------------------------------------
    // IProxy Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {string} functionName
     * @param {Array.<*>} args
     */
    proxy: function(functionName, args) {
        var target = this.instance[this.propertyName];
        if (target) {
            return target[functionName].apply(target, args);
        } else {
            throw new Error("Could not find property '" + this.propertyName + "' on instance");
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(ProxyProperty, IProxy);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ProxyProperty', ProxyProperty);
