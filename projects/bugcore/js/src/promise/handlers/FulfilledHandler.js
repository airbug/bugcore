//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('FulfilledHandler')

//@Require('Class')
//@Require('Handler')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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

        _name: "FulfilledHandler",


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
});
