/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('IObservable')
//@Require('Observable')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IObservable     = bugpack.require('IObservable');
    var Observable      = bugpack.require('Observable');
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

    /**
     * This tests...
     * 1) Instantiating a Observable class with no parameters
     */
    var observableInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObservable     = new Observable();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testObservable, Observable),
                'Assert that testObservable is an instance of Observable');
            test.assertTrue(Class.doesImplement(this.testObservable, IObservable),
                'Assert that testObservable implements the IObservable interface');
            test.assertTrue(this.testObservable.getChangeTypeObserverMap().isEmpty(),
                'Assert that the testObservable.changeTypeObserverMap is empty on instantiation');
        }
    };
    bugmeta.tag(observableInstantiationTest).with(
        test().name('Observable - instantiation test')
    );

    /**
     * This tests...
     * 1) the #addObserver method using string changeType and string objectPattern
     */
    var observableAddObserverTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObservable         = new Observable();
            this.testChangeType         = 'testChangeType';
            this.testObjectPattern      = 'testObjectPattern';
            this.testObserverFunction   = function() {};
            this.testObserverContext    = {};
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertFalse(this.testObservable.hasObserver(this.testChangeType, this.testObjectPattern, this.testObserverFunction, this.testObserverContext),
                'Assert that the testObservable does NOT have the observer before adding it');
            this.testObservable.addObserver(this.testChangeType, this.testObjectPattern, this.testObserverFunction, this.testObserverContext);
            test.assertTrue(this.testObservable.hasObserver(this.testChangeType, this.testObjectPattern, this.testObserverFunction, this.testObserverContext),
                'Assert that the testObservable has the observer after adding it');
            var observerList    = this.testObservable.getChangeTypeObserverMap().get(this.testChangeType);
            var observer        = observerList.getAt(0);
            test.assertEqual(observer.getObservationPathPattern(), this.testObjectPattern,
                'Assert that the observer has the correct objectPathPattern');
            test.assertEqual(observer.getObserverContext(), this.testObserverContext,
                'Assert tht the observer has the testObserverContext');
            test.assertEqual(observer.getObserverFunction(), this.testObserverFunction,
                'Assert that the observer has the testObserverFunction');
        }
    };
    bugmeta.tag(observableAddObserverTest).with(
        test().name('Observable - #addObserver test')
    );

    /**
     * This tests...
     * 1) the #addObserver method using string changeType and string objectPattern
     */
    var observableRemoveObserverTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObservable         = new Observable();
            this.testChangeType         = 'testChangeType';
            this.testObjectPattern      = 'testObjectPattern';
            this.testObserverFunction   = function() {};
            this.testObserverContext    = {};
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertFalse(this.testObservable.hasObserver(this.testChangeType, this.testObjectPattern, this.testObserverFunction, this.testObserverContext),
                'Assert that the testObservable does NOT have the observer before adding it');
            this.testObservable.addObserver(this.testChangeType, this.testObjectPattern, this.testObserverFunction, this.testObserverContext);
            test.assertTrue(this.testObservable.hasObserver(this.testChangeType, this.testObjectPattern, this.testObserverFunction, this.testObserverContext),
                'Assert that the testObservable has the observer after adding it');
            this.testObservable.removeObserver(this.testChangeType, this.testObjectPattern, this.testObserverFunction, this.testObserverContext);
            test.assertFalse(this.testObservable.hasObserver(this.testChangeType, this.testObjectPattern, this.testObserverFunction, this.testObserverContext),
                'Assert that the testObservable does NOT have the observer after removing it');
        }
    };
    bugmeta.tag(observableRemoveObserverTest).with(
        test().name('Observable - #removeObserver test')
    );
});
