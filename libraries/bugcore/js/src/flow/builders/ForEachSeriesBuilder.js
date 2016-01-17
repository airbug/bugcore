/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForEachSeriesBuilder')

//@Require('Class')
//@Require('ForEachSeries')
//@Require('IterableFlowBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ForEachSeries           = bugpack.require('ForEachSeries');
    var IterableFlowBuilder     = bugpack.require('IterableFlowBuilder');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlowBuilder}
     */
    var ForEachSeriesBuilder = Class.extend(IterableFlowBuilder, {

        _name: "ForEachSeriesBuilder",


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            return new ForEachSeries(this.getData(), this.getIteratorMethod());
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForEachSeriesBuilder', ForEachSeriesBuilder);
});
