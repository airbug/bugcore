/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Graph')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Graph           = bugpack.require('Graph');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestAnnotation  = bugpack.require('bugunit.TestAnnotation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestAnnotation.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a new Graph
     */
    var graphInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testGraph = new Graph();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testGraph, Graph),
                "Assert Graph instance extends Graph class");
        }
    };

    /**
     * This tests
     * 1) Add value to Graph
     * 2) Remove value from Graph
     */
    var graphAddValueRemoveValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testGraph  = new Graph();
            this.testValue  = "testValue";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testGraph.addNodeForValue(this.testValue);
            test.assertTrue(this.testGraph.containsNodeForValue(this.testValue),
                "Assert testGraph contains node for value");
            this.testGraph.removeNodeForValue(this.testValue);
            test.assertFalse(this.testGraph.containsNodeForValue(this.testValue),
                "Assert testGraph does not contain node for value");
        }
    };

    /**
     * This tests
     * 1) Add edge to Graph from value to value
     */
    var graphAddEdgeFromValueToValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testGraph      = new Graph();
            this.testValue1     = "testValue1";
            this.testValue2     = "testValue2";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testGraph.addNodeForValue(this.testValue1);
            this.testGraph.addNodeForValue(this.testValue2);
            test.assertFalse(this.testGraph.containsEdgeFromValueToValue(this.testValue1, this.testValue2),
                "Assert Graph does not start with edge from value 1 to value 2");
            test.assertFalse(this.testGraph.containsEdgesFrom(this.testGraph.getNode(this.testValue1)),
                "Assert Graph does not contain edges from value 1");
            test.assertFalse(this.testGraph.containsEdgesFrom(this.testGraph.getNode(this.testValue2)),
                "Assert Graph does not contain edges from value 2");
            test.assertFalse(this.testGraph.containsEdgesTo(this.testGraph.getNode(this.testValue1)),
                "Assert Graph does not contain edges to value 1");
            test.assertFalse(this.testGraph.containsEdgesTo(this.testGraph.getNode(this.testValue2)),
                "Assert Graph does not contain edges to value 2");
            this.testGraph.addEdgeFromValueToValue(this.testValue1, this.testValue2);
            test.assertTrue(this.testGraph.containsEdgeFromValueToValue(this.testValue1, this.testValue2),
                "Assert Graph now contains edge from value 1 to value 2");
            test.assertFalse(this.testGraph.containsEdgeFromValueToValue(this.testValue2, this.testValue1),
                "Assert Graph does not contain edge from value 2 to value 1");
            test.assertTrue(this.testGraph.containsEdgesFrom(this.testGraph.getNode(this.testValue1)),
                "Assert Graph contains edges from value 1");
            test.assertFalse(this.testGraph.containsEdgesFrom(this.testGraph.getNode(this.testValue2)),
                "Assert Graph does not contain edges from value 2");
            test.assertFalse(this.testGraph.containsEdgesTo(this.testGraph.getNode(this.testValue1)),
                "Assert Graph does not contain edges to value 1");
            test.assertTrue(this.testGraph.containsEdgesTo(this.testGraph.getNode(this.testValue2)),
                "Assert Graph contains edges to value 2");
        }
    };

    /**
     * This tests
     * 1) Remove edge to Graph from value to value
     */
    var graphRemoveEdgeFromValueToValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testGraph      = new Graph();
            this.testValue1     = "testValue1";
            this.testValue2     = "testValue2";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testGraph.addNodeForValue(this.testValue1);
            this.testGraph.addNodeForValue(this.testValue2);
            this.testGraph.addEdgeFromValueToValue(this.testValue1, this.testValue2);
            test.assertTrue(this.testGraph.containsEdgeFromValueToValue(this.testValue1, this.testValue2),
                "Assert Graph now contains edge from value 1 to value 2");
            test.assertFalse(this.testGraph.containsEdgeFromValueToValue(this.testValue2, this.testValue1),
                "Assert Graph does not contain edge from value 2 to value 1");
            test.assertTrue(this.testGraph.containsEdgesFrom(this.testGraph.getNode(this.testValue1)),
                "Assert Graph contains edges from value 1");
            test.assertFalse(this.testGraph.containsEdgesFrom(this.testGraph.getNode(this.testValue2)),
                "Assert Graph does not contain edges from value 2");
            test.assertFalse(this.testGraph.containsEdgesTo(this.testGraph.getNode(this.testValue1)),
                "Assert Graph does not contain edges to value 1");
            test.assertTrue(this.testGraph.containsEdgesTo(this.testGraph.getNode(this.testValue2)),
                "Assert Graph contains edges to value 2");
            this.testGraph.removeEdgeFromValueToValue(this.testValue1, this.testValue2);
            test.assertFalse(this.testGraph.containsEdgeFromValueToValue(this.testValue1, this.testValue2),
                "Assert Graph does not contain edge from value 1 to value 2");
            test.assertFalse(this.testGraph.containsEdgeFromValueToValue(this.testValue2, this.testValue1),
                "Assert Graph does not contain edge from value 2 to value 1");
            test.assertFalse(this.testGraph.containsEdgesFrom(this.testGraph.getNode(this.testValue1)),
                "Assert Graph does not contain edges from value 1");
            test.assertFalse(this.testGraph.containsEdgesFrom(this.testGraph.getNode(this.testValue2)),
                "Assert Graph does not contain edges from value 2");
            test.assertFalse(this.testGraph.containsEdgesTo(this.testGraph.getNode(this.testValue1)),
                "Assert Graph does not contain edges to value 1");
            test.assertFalse(this.testGraph.containsEdgesTo(this.testGraph.getNode(this.testValue2)),
                "Assert Graph does not contain edges to value 2");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(graphInstantiationTest).with(
        test().name("Graph - instantiation test")
    );
    bugmeta.annotate(graphAddValueRemoveValueTest).with(
        test().name("Graph - add value and remove value for test")
    );
    bugmeta.annotate(graphAddEdgeFromValueToValueTest).with(
        test().name("Graph - add edge from value to value")
    );
    bugmeta.annotate(graphRemoveEdgeFromValueToValueTest).with(
        test().name("Graph - remove edge from value to value")
    );
});
