/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForInSeriesBuilder')

//@Require('Class')
//@Require('ForInSeries')
//@Require('IterableFlowBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ForInSeries             = bugpack.require('ForInSeries');
    var IterableFlowBuilder     = bugpack.require('IterableFlowBuilder');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlowBuilder}
     */
    var ForInSeriesBuilder = Class.extend(IterableFlowBuilder, {

        _name: "ForInSeriesBuilder",


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            return new ForInSeries(this.getData(), this.getIteratorMethod());
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForInSeriesBuilder', ForInSeriesBuilder);
});
