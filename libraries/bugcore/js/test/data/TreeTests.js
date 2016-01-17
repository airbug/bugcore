/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Tree')
//@Require('TreeNode')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Tree        = bugpack.require('Tree');
    var TreeNode    = bugpack.require('TreeNode');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var test        = TestTag.test;


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
            this.rootTreeNode = new TreeNode("rootNode");
            this.tree = new Tree(this.rootTreeNode);
            this.child1ofRootNode = new TreeNode("child1ofRootNode");
            this.child2ofRootNode =  new TreeNode("child2ofRootNode");
            this.child1ofChild1ofRootNode = new TreeNode("child1ofChild1ofRootNode");
            this.child2ofChild1ofRootNode = new TreeNode("child2ofChild1ofRootNode");
            this.child3ofChild1ofRootNode = new TreeNode("child3ofChild1ofRootNode");
            this.child1ofChild2ofChild1ofRootNode = new TreeNode("child1ofChild2ofChild1ofRootNode");

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
    bugmeta.tag(treeWalkOrderTest).with(
        test().name("Tree walk order test")
    );
});
