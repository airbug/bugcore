/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Flows')

//@Require('Class')
//@Require('FlowBuilder')
//@Require('ForEachParallel')
//@Require('ForEachSeries')
//@Require('ForInParallel')
//@Require('ForInSeries')
//@Require('If')
//@Require('IfBuilder')
//@Require('IterableParallel')
//@Require('IterableSeries')
//@Require('Obj')
//@Require('Parallel')
//@Require('Series')
//@Require('Task')
//@Require('WhileParallel')
//@Require('WhileSeries')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var FlowBuilder         = bugpack.require('FlowBuilder');
    var ForEachParallel     = bugpack.require('ForEachParallel');
    var ForEachSeries       = bugpack.require('ForEachSeries');
    var ForInParallel       = bugpack.require('ForInParallel');
    var ForInSeries         = bugpack.require('ForInSeries');
    var If                  = bugpack.require('If');
    var IfBuilder           = bugpack.require('IfBuilder');
    var IterableParallel    = bugpack.require('IterableParallel');
    var IterableSeries      = bugpack.require('IterableSeries');
    var Obj                 = bugpack.require('Obj');
    var Parallel            = bugpack.require('Parallel');
    var Series              = bugpack.require('Series');
    var Task                = bugpack.require('Task');
    var WhileParallel       = bugpack.require('WhileParallel');
    var WhileSeries         = bugpack.require('WhileSeries');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Flows = Class.extend(Obj, {
        _name: "Flows"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {Array.<*>} data
     * @param {function(Flow, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    Flows.$forEachParallel = function(data, iteratorMethod) {
        return new FlowBuilder(ForEachParallel, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Array.<*>} data
     * @param {function(Flow, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    Flows.$forEachSeries  = function(data, iteratorMethod) {
        return new FlowBuilder(ForEachSeries, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Object} data
     * @param {function(Flow, *, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    Flows.$forInParallel  = function(data, iteratorMethod) {
        return new FlowBuilder(ForInParallel, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Object} data
     * @param {function(Flow, *, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    Flows.$forInSeries    = function(data, iteratorMethod) {
        return new FlowBuilder(ForInSeries, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {function()} ifMethod
     * @param {Flow} ifFlow
     * @return {IfBuilder}
     */
    Flows.$if = function(ifMethod, ifFlow) {
        return new IfBuilder(If, [ifMethod, ifFlow]);
    };

    /**
     * @static
     * @param {Array<*>} data
     * @param {function(Flow, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    Flows.$iterableParallel = function(data, iteratorMethod) {
        return new FlowBuilder(IterableParallel, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Array<*>} data
     * @param {function(Flow, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    Flows.$iterableSeries = function(data, iteratorMethod) {
        return new FlowBuilder(IterableSeries, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Array.<Flow>} flowArray
     * @return {FlowBuilder}
     */
    Flows.$parallel = function(flowArray) {
        return new FlowBuilder(Parallel, [flowArray]);
    };

    /**
     * @static
     * @param {Array.<Flow>} flowArray
     * @return {FlowBuilder}
     */
    Flows.$series = function(flowArray) {
        return new FlowBuilder(Series, [flowArray]);
    };

    /**
     * @static
     * @param {function(Flow)} taskMethod
     * @return {FlowBuilder}
     */
    Flows.$task = function(taskMethod) {
        return new FlowBuilder(Task, [taskMethod]);
    };

    /**
     * @static
     * @param {function(Flow)} whileMethod
     * @param {Flow} whileFlow
     * @return {FlowBuilder}
     */
    Flows.$whileParallel    = function(whileMethod, whileFlow) {
        return new FlowBuilder(WhileParallel, [whileMethod, whileFlow]);
    };

    /**
     * @static
     * @param {function(Flow)} whileMethod
     * @param {Flow} whileFlow
     * @return {FlowBuilder}
     */
    Flows.$whileSeries    = function(whileMethod, whileFlow) {
        return new FlowBuilder(WhileSeries, [whileMethod, whileFlow]);
    };


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Flows', Flows);
});
