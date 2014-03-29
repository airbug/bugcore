//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Tree')
//@Require('TreeNode')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Tree            = bugpack.require('Tree');
var TreeNode        = bugpack.require('TreeNode');
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
 * 1) Walking a tree
 * 2) That the nodes are walked in the correct top down depth first order.
 */
var treeWalkOrderTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.tree = new Tree();
        this.rootTreeNode = new TreeNode("rootNode");
        this.child1ofRootNode = new TreeNode("child1ofRootNode");
        this.child2ofRootNode =  new TreeNode("child2ofRootNode");
        this.child1ofChild1ofRootNode = new TreeNode("child1ofChild1ofRootNode");
        this.child2ofChild1ofRootNode = new TreeNode("child2ofChild1ofRootNode");
        this.child3ofChild1ofRootNode = new TreeNode("child3ofChild1ofRootNode");
        this.child1ofChild2ofChild1ofRootNode = new TreeNode("child1ofChild2ofChild1ofRootNode");

        this.tree.setRootNode(this.rootTreeNode);
        this.rootTreeNode.addChildNode(this.child1ofRootNode);
        this.rootTreeNode.addChildNode(this.child2ofRootNode);
        this.child1ofRootNode.addChildNode(this.child1ofChild1ofRootNode);
        this.child1ofRootNode.addChildNode(this.child2ofChild1ofRootNode);
        this.child1ofRootNode.addChildNode(this.child3ofChild1ofRootNode);
        this.child2ofChild1ofRootNode.addChildNode(this.child1ofChild2ofChild1ofRootNode);

        this.expectedWalkOrder = [
            "rootNode",
            "child1ofRootNode",
            "child1ofChild1ofRootNode",
            "child2ofChild1ofRootNode",
            "child1ofChild2ofChild1ofRootNode",
            "child3ofChild1ofRootNode",
            "child2ofRootNode"
        ];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var actualWalkOrder = [];
        this.tree.walk(function(value) {
            actualWalkOrder.push(value);
        });

        test.assertEqual(actualWalkOrder.length, this.expectedWalkOrder.length,
            "Assert the walk took the correct number of steps");
        for (var i = 0, size = actualWalkOrder.length; i < size; i++) {
            test.assertEqual(actualWalkOrder[i], this.expectedWalkOrder[i],
                "Assert Tree walk step '" + this.expectedWalkOrder[i] + "' was performed in the correct order");
        }
    }
};
bugmeta.annotate(treeWalkOrderTest).with(
    test().name("Tree walk order test")
);
