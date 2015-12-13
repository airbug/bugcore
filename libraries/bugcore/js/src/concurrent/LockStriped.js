/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('LockStriped')

//@Require('Class')
//@Require('Lock')
//@Require('Obj')
//@Require('Striped')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Lock        = bugpack.require('Lock');
    var Obj         = bugpack.require('Obj');
    var Striped     = bugpack.require('Striped');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var LockStriped = Class.extend(Obj, {

        _name: 'LockStriped',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {number} maxNumberStripes
         */
        _constructor: function(maxNumberStripes) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {number}
             */
            this.lastIndex          = -1;

            /**
             * @private
             * @type {number}
             */
            this.maxNumberStripes   = maxNumberStripes;

            /**
             * @private
             * @type {Map.<string, *>}
             */
            this.striped            = new Striped();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} key
         * @return {Lock}
         */
        getForKey: function(key) {
            if (!this.striped.containsKey(key)) {
                return this.generateLockForKey(key);
            } else {
                return this.striped.getForKey(key);
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {*} key
         * @return {Lock}
         */
        generateLockForKey: function(key) {
            this.lastIndex++;
            if (this.lastIndex >= this.maxNumberStripes) {
                this.lastIndex = 0;
            }
            var lock = this.striped.getAt(this.lastIndex);
            if (!lock) {
                lock = new Lock();
                this.striped.add(lock);
            }
            this.striped.addKeyToIndex(key, this.lastIndex);
            return lock;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('LockStriped', LockStriped);
});
