/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Change')
//@Require('Class')
//@Require('Observation')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Change          = bugpack.require('Change');
    var Class           = bugpack.require('Class');
    var Observation     = bugpack.require('Observation');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var observationInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testChangeType         = 'testChangeType';
            this.testChange             = new Change(this.testChangeType);
            this.testObservationPath    = 'testObservationPath';
            this.testObservation        = new Observation(this.testChange, this.testObservationPath);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testObservation, Observation),
                'Assert instance of Observation');
            test.assertEqual(this.testObservation.getChange(), this.testChange,
                'Assert .change was set correctly');
            test.assertEqual(this.testObservation.getChangeType(), this.testChangeType,
                'Assert changeType is correctly proxied');
            test.assertEqual(this.testObservation.getObservationPath(), this.testObservationPath,
                'Assert .observationPath was set correctly');

        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(observationInstantiationTest).with(
        test().name('Observation - instantiation test')
    );
});
