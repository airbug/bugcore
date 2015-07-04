/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IterableParallelBuilder')

//@Require('Class')
//@Require('IterableFlowBuilder')
//@Require('IterableParallel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var IterableFlowBuilder     = bugpack.require('IterableFlowBuilder');
    var IterableParallel        = bugpack.require('IterableParallel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlowBuilder}
     */
    var IterableParallelBuilder = Class.extend(IterableFlowBuilder, {

        _name: "IterableParallelBuilder",


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            return new IterableParallel(this.getData(), this.getIteratorMethod());
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('IterableParallelBuilder', IterableParallelBuilder);
});
