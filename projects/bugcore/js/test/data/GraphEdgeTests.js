//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('GraphEdge')
//@Require('GraphNode')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var GraphEdge       = bugpack.require('GraphEdge');
var GraphNode       = bugpack.require('GraphNode');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


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
 * 1) Instantiation of a new GraphEdge is successful
 */
var graphEdgeInstantiationWithGoodArgumentsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFromNode = new GraphNode("fromValue");
        this.testToNode = new GraphNode("toValue");
        this.testGraphEdge = new GraphEdge(this.testFromNode, this.testToNode);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testGraphEdge.getFromNode(), this.testFromNode,
            "Assert fromNode was set correct during instantiation");
        test.assertEqual(this.testGraphEdge.getToNode(), this.testToNode,
            "Assert toNode was set correct during instantiation");
    }
};
bugmeta.annotate(graphEdgeInstantiationWithGoodArgumentsTest).with(
    test().name("GraphEdge instantiation test")
);


/**
 * This tests
 * 1) That GraphEdges with the same fromNode and the same toNode are equal
 * 2) That GraphEdges with the same fromNode but different toNodes are not equal
 * 3) That GraphEdges with different fromNodes but the same toNode are not equal
 * 4) That GraphEdges with different fromNodes and different toNodes are not equal
 */
var graphEdgeEqualityTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFromNode1 = new GraphNode("fromNode1");
        this.testFromNode2 = new GraphNode("fromNode2");
        this.testToNode1 = new GraphNode("toNode1");
        this.testToNode2 = new GraphNode("toNode2");

        this.equalGraphEdge1 = new GraphEdge(this.testFromNode1, this.testToNode1);
        this.equalGraphEdge2 = new GraphEdge(this.testFromNode1, this.testToNode1);

        this.notEqualGraphEdge1 = new GraphEdge(this.testFromNode1, this.testToNode1);
        this.notEqualGraphEdge2 = new GraphEdge(this.testFromNode1, this.testToNode2);
        this.notEqualGraphEdge3 = new GraphEdge(this.testFromNode2, this.testToNode1);
        this.notEqualGraphEdge4 = new GraphEdge(this.testFromNode2, this.testToNode2);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.equalGraphEdge1, this.equalGraphEdge2,
            "Assert GraphEdges with the same fromNode and the same toNode are equal");
        test.assertNotEqual(this.notEqualGraphEdge1, this.notEqualGraphEdge2,
            "Assert GraphEdges with the same fromNode but different toNodes are not equal");
        test.assertNotEqual(this.notEqualGraphEdge1, this.notEqualGraphEdge3,
            "Assert GraphEdges with different fromNodes but the same toNode are not equal");
        test.assertNotEqual(this.notEqualGraphEdge1, this.notEqualGraphEdge4,
            "Assert GraphEdges with different fromNodes and different toNodes are not equal");
    }
};
bugmeta.annotate(graphEdgeEqualityTest).with(
    test().name("GraphEdge equality test")
);


/**
 * This tests
 * 1) That GraphNodes with the same function and context have the same hash code
 */
var graphNodeHashCodeEqualityTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFromNode = new GraphNode("fromNode");
        this.testToNode = new GraphNode("toNode");

        this.graphEdge1 = new GraphEdge(this.testFromNode, this.testToNode);
        this.graphEdge2 = new GraphEdge(this.testFromNode, this.testToNode);
    },

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.graphEdge1.hashCode(), this.graphEdge2.hashCode(),
            "Assert GraphNodes with the same value have equal hash codes");
    }
};
bugmeta.annotate(graphNodeHashCodeEqualityTest).with(
    test().name("GraphEdge hash code equality test")
);
