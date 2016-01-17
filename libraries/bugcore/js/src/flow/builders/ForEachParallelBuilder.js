/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForEachParallelBuilder')

//@Require('Class')
//@Require('ForEachParallel')
//@Require('IterableFlowBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ForEachParallel         = bugpack.require('ForEachParallel');
    var IterableFlowBuilder     = bugpack.require('IterableFlowBuilder');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlowBuilder}
     */
    var ForEachParallelBuilder = Class.extend(IterableFlowBuilder, {

        _name: "ForEachParallelBuilder",


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            return new ForEachParallel(this.getData(), this.getIteratorMethod());
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForEachParallelBuilder', ForEachParallelBuilder);
});
