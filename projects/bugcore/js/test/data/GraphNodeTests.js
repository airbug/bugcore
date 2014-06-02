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
//@Require('GraphNode')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var GraphNode       = bugpack.require('GraphNode');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag  = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a new GraphNode
     */
    var graphNodeInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testValue = "some value";
            this.testGraphNode = new GraphNode(this.testValue);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testGraphNode, GraphNode),
                "Assert GraphNode instance extends GraphNode ");
            test.assertEqual(this.testGraphNode.getValue(), this.testValue,
                "Assert value was set correctly during instantiation");
        }
    };
    bugmeta.tag(graphNodeInstantiationTest).with(
        test().name("GraphNode instantiation test")
    );


    /**
     * This tests
     * 1) That GraphNodes with the same value are equal
     * 2) That GraphNodes with different values are not equal
     */
    var graphNodeEqualityTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testValue1 = "value1";
            this.testValue2 = "value2";
            this.equalGraphNode1 = new GraphNode(this.testValue1);
            this.equalGraphNode2 = new GraphNode(this.testValue1);
            this.notEqualGraphNode1 = new GraphNode(this.testValue1);
            this.notEqualGraphNode2 = new GraphNode(this.testValue2);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.equalGraphNode1, this.equalGraphNode2,
                "Assert GraphNodes with the same value are equal");
            test.assertNotEqual(this.notEqualGraphNode1, this.notEqualGraphNode2,
                "Assert GraphNodes with different values are not equal.");
        }
    };
    bugmeta.tag(graphNodeEqualityTest).with(
        test().name("GraphNode equality test")
    );


    /**
     * This tests
     * 1) That GraphNodes with the same function and context have the same hash code
     */
    var graphNodeHashCodeEqualityTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testValue = "value";
            this.graphNode1 = new GraphNode(this.testValue);
            this.graphNode2 = new GraphNode(this.testValue);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.graphNode1.hashCode(), this.graphNode2.hashCode(),
                "Assert GraphNodes with the same value have equal hash codes");
        }
    };
    bugmeta.tag(graphNodeHashCodeEqualityTest).with(
        test().name("GraphNode hash code equality test")
    );
});
