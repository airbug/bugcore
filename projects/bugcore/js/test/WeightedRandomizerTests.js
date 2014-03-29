//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('WeightedRandomizer')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var WeightedRandomizer  = bugpack.require('WeightedRandomizer');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 *
 */
var weightedRandomizerGetRandomTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedRandomizer = new WeightedRandomizer();
        this.value1 = "value1";
        this.weight1 =  1;
        this.value2 = "value2";
        this.weight2 = 3;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedRandomizer.addValue(this.value1, this.weight1);
        this.weightedRandomizer.addValue(this.value2, this.weight2);
        var value1Count = 0;
        var value2Count = 0;
        for (var i = 0; i < 10000; i++) {
            var random = this.weightedRandomizer.getRandom();
            if (random === this.value1) {
                value1Count++;
            } else if (random === this.value2) {
                value2Count++;
            }
        }

        var ratio = value2Count / value1Count;
        var roundedRatio = Math.round(ratio);

        test.assertEqual(roundedRatio, 3,
            "Assert getRandom respected the weights. Actual ratio:" + ratio);
    }
};
bugmeta.annotate(weightedRandomizerGetRandomTest).with(
    test().name("WeightedRandomizer get random test")
);