/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForInParallelBuilder')

//@Require('Class')
//@Require('ForInParallel')
//@Require('IterableFlowBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ForInParallel           = bugpack.require('ForInParallel');
    var IterableFlowBuilder     = bugpack.require('IterableFlowBuilder');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlowBuilder}
     */
    var ForInParallelBuilder = Class.extend(IterableFlowBuilder, {

        _name: "ForInParallelBuilder",


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            return new ForInParallel(this.getData(), this.getIteratorMethod());
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForInParallelBuilder', ForInParallelBuilder);
});
