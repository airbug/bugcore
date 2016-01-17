/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Flows')

//@Require('Class')
//@Require('FlowBuilder')
//@Require('ForEachParallelBuilder')
//@Require('ForEachSeriesBuilder')
//@Require('ForInParallelBuilder')
//@Require('ForInSeriesBuilder')
//@Require('IfBuilder')
//@Require('IterableParallelBuilder')
//@Require('IterableSeriesBuilder')
//@Require('Obj')
//@Require('ParallelBuilder')
//@Require('SeriesBuilder')
//@Require('TaskBuilder')
//@Require('WhileParallelBuilder')
//@Require('WhileSeriesBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var FlowBuilder                 = bugpack.require('FlowBuilder');
    var ForEachParallelBuilder      = bugpack.require('ForEachParallelBuilder');
    var ForEachSeriesBuilder        = bugpack.require('ForEachSeriesBuilder');
    var ForInParallelBuilder        = bugpack.require('ForInParallelBuilder');
    var ForInSeriesBuilder          = bugpack.require('ForInSeriesBuilder');
    var IfBuilder                   = bugpack.require('IfBuilder');
    var IterableParallelBuilder     = bugpack.require('IterableParallelBuilder');
    var IterableSeriesBuilder       = bugpack.require('IterableSeriesBuilder');
    var Obj                         = bugpack.require('Obj');
    var ParallelBuilder             = bugpack.require('ParallelBuilder');
    var SeriesBuilder               = bugpack.require('SeriesBuilder');
    var TaskBuilder                 = bugpack.require('TaskBuilder');
    var WhileParallelBuilder        = bugpack.require('WhileParallelBuilder');
    var WhileSeriesBuilder          = bugpack.require('WhileSeriesBuilder');


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
     * @param {(Array.<*> | Object.<string, *> | IIterable.<*>)} data
     * @param {function(ForEachParallel, *...)} iteratorMethod
     * @return {ForEachParallelBuilder}
     */
    Flows.$forEachParallel = function(data, iteratorMethod) {
        return new ForEachParallelBuilder(data, iteratorMethod);
    };

    /**
     * @static
     * @param {(Array.<*> | Object.<string, *> | IIterable.<*>)} data
     * @param {function(ForEachSeries, *...)} iteratorMethod
     * @return {ForEachSeriesBuilder}
     */
    Flows.$forEachSeries = function(data, iteratorMethod) {
        return new ForEachSeriesBuilder(data, iteratorMethod);
    };

    /**
     * @static
     * @param {(Array.<*> | Object.<string, *> | IIterable.<*>)} data
     * @param {function(ForInParallel, *...)} iteratorMethod
     * @return {FlowBuilder}
     */
    Flows.$forInParallel = function(data, iteratorMethod) {
        return new ForInParallelBuilder(data, iteratorMethod);
    };

    /**
     * @static
     * @param {(Array.<*> | Object.<string, *> | IIterable.<*>)} data
     * @param {function(ForInSeries, *...)} iteratorMethod
     * @return {FlowBuilder}
     */
    Flows.$forInSeries = function(data, iteratorMethod) {
        return new ForInSeriesBuilder(data, iteratorMethod);
    };

    /**
     * @static
     * @param {function(Assertion, *...)} assertionMethod
     * @param {(FlowBuilder | function(Flow, *...))} assertPassFlowBuilder
     * @return {IfBuilder}
     */
    Flows.$if = function(assertionMethod, assertPassFlowBuilder) {
        return new IfBuilder(assertionMethod, assertPassFlowBuilder);
    };

    /**
     * @static
     * @param {(Array.<*> | Object.<string, *> | IIterable.<*>)} data
     * @param {function(IterableParallel, *...)} iteratorMethod
     * @return {IterableParallelBuilder}
     */
    Flows.$iterableParallel = function(data, iteratorMethod) {
        return new IterableParallelBuilder(data, iteratorMethod);
    };

    /**
     * @static
     * @param {(Array.<*> | Object.<string, *> | IIterable.<*>)} data
     * @param {function(IterableSeries, *...)} iteratorMethod
     * @return {IterableSeriesBuilder}
     */
    Flows.$iterableSeries = function(data, iteratorMethod) {
        return new IterableSeriesBuilder(data, iteratorMethod);
    };

    /**
     * @static
     * @param {Array.<(FlowBuilder | function(Flow, *...))>} flowBuilderArray
     * @return {ParallelBuilder}
     */
    Flows.$parallel = function(flowBuilderArray) {
        return new ParallelBuilder(flowBuilderArray);
    };

    /**
     * @static
     * @param {Array.<(FlowBuilder | function(Flow, *...))>} flowBuilderArray
     * @return {SeriesBuilder}
     */
    Flows.$series = function(flowBuilderArray) {
        return new SeriesBuilder(flowBuilderArray);
    };

    /**
     * @static
     * @param {function(Task, *...)} taskMethod
     * @param {Object=} taskContext
     * @return {TaskBuilder}
     */
    Flows.$task = function(taskMethod, taskContext) {
        return new TaskBuilder(taskMethod, taskContext);
    };

    /**
     * @static
     * @param {function(Assertion, *...)} assertionMethod
     * @param {(FlowBuilder | function(Flow, *...))} assertPassFlowBuilder
     * @return {WhileParallelBuilder}
     */
    Flows.$whileParallel = function(assertionMethod, assertPassFlowBuilder) {
        return new WhileParallelBuilder(assertionMethod, assertPassFlowBuilder);
    };

    /**
     * @static
     * @param {function(Assertion, *...)} assertionMethod
     * @param {(FlowBuilder | function(Flow, *...))} assertPassFlowBuilder
     * @return {WhileSeriesBuilder}
     */
    Flows.$whileSeries = function(assertionMethod, assertPassFlowBuilder) {
        return new WhileSeriesBuilder(assertionMethod, assertPassFlowBuilder);
    };


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Flows', Flows);
});
