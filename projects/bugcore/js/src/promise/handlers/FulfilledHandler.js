//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('FulfilledHandler')

//@Require('Class')
//@Require('Handler')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Handler         = bugpack.require('Handler');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Handler}
 */
var FulfilledHandler = Class.extend(Handler, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<*>} args
     */
    handle: function(args) {
        if (TypeUtil.isFunction(this.getMethod())) {
            this.doHandleMethod(args);
        } else {
            this.getForwardPromise().resolvePromise(args);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('FulfilledHandler', FulfilledHandler);
