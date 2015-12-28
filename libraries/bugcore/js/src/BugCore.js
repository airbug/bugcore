/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('BugCore')

//@Require('ArgUtil')
//@Require('ArrayUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Collection')
//@Require('Collections')
//@Require('Config')
//@Require('Constructor')
//@Require('DateUtil')
//@Require('Deferred')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('EventPropagator')
//@Require('EventReceiver')
//@Require('Exception')
//@Require('Flows')
//@Require('Func')
//@Require('Handler')
//@Require('HashStore')
//@Require('HashTable')
//@Require('HashUtil')
//@Require('IArrayable')
//@Require('IClone')
//@Require('ICollection')
//@Require('IEquals')
//@Require('IHashCode')
//@Require('IIterable')
//@Require('IIterator')
//@Require('IList')
//@Require('IMap')
//@Require('IObjectable')
//@Require('IProxy')
//@Require('ISet')
//@Require('IdGenerator')
//@Require('Implementable')
//@Require('Interface')
//@Require('List')
//@Require('Lock')
//@Require('Map')
//@Require('MathUtil')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('Pair')
//@Require('Promise')
//@Require('Promises')
//@Require('Proxy')
//@Require('ProxyMethod')
//@Require('ProxyObject')
//@Require('ProxyProperty')
//@Require('Queue')
//@Require('RandomUtil')
//@Require('RateLimiter')
//@Require('Resolver')
//@Require('Semaphore')
//@Require('Set')
//@Require('Stack')
//@Require('Stream')
//@Require('StringUtil')
//@Require('Striped')
//@Require('Suppliers')
//@Require('Throwable')
//@Require('Throwables')
//@Require('Tracer')
//@Require('TypeUtil')
//@Require('ValidationMachine')
//@Require('Validator')
//@Require('ValidatorGroup')
//@Require('ValidatorProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var ArrayUtil           = bugpack.require('ArrayUtil');
    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Collection          = bugpack.require('Collection');
    var Collections         = bugpack.require('Collections');
    var Config              = bugpack.require('Config');
    var Constructor         = bugpack.require('Constructor');
    var DateUtil            = bugpack.require('DateUtil');
    var Deferred            = bugpack.require('Deferred');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var EventPropagator     = bugpack.require('EventPropagator');
    var EventReceiver       = bugpack.require('EventReceiver');
    var Exception           = bugpack.require('Exception');
    var Flows               = bugpack.require('Flows');
    var Func                = bugpack.require('Func');
    var Handler             = bugpack.require('Handler');
    var HashStore           = bugpack.require('HashStore');
    var HashTable           = bugpack.require('HashTable');
    var HashUtil            = bugpack.require('HashUtil');
    var IArrayable          = bugpack.require('IArrayable');
    var IClone              = bugpack.require('IClone');
    var ICollection         = bugpack.require('ICollection');
    var IEquals             = bugpack.require('IEquals');
    var IHashCode           = bugpack.require('IHashCode');
    var IIterable           = bugpack.require('IIterable');
    var IIterator           = bugpack.require('IIterator');
    var IList               = bugpack.require('IList');
    var IMap                = bugpack.require('IMap');
    var IObjectable         = bugpack.require('IObjectable');
    var IProxy              = bugpack.require('IProxy');
    var ISet                = bugpack.require('ISet');
    var IdGenerator         = bugpack.require('IdGenerator');
    var Implementable       = bugpack.require('Implementable');
    var Interface           = bugpack.require('Interface');
    var List                = bugpack.require('List');
    var Lock                = bugpack.require('Lock');
    var Map                 = bugpack.require('Map');
    var MathUtil            = bugpack.require('MathUtil');
    var Obj                 = bugpack.require('Obj');
    var ObjectUtil          = bugpack.require('ObjectUtil');
    var Pair                = bugpack.require('Pair');
    var Promise             = bugpack.require('Promise');
    var Promises            = bugpack.require('Promises');
    var Proxy               = bugpack.require('Proxy');
    var ProxyMethod         = bugpack.require('ProxyMethod');
    var ProxyObject         = bugpack.require('ProxyObject');
    var ProxyProperty       = bugpack.require('ProxyProperty');
    var Queue               = bugpack.require('Queue');
    var RandomUtil          = bugpack.require('RandomUtil');
    var RateLimiter         = bugpack.require('RateLimiter');
    var Resolver            = bugpack.require('Resolver');
    var Semaphore           = bugpack.require('Semaphore');
    var Set                 = bugpack.require('Set');
    var Stack               = bugpack.require('Stack');
    var Stream              = bugpack.require('Stream');
    var StringUtil          = bugpack.require('StringUtil');
    var Striped             = bugpack.require('Striped');
    var Suppliers           = bugpack.require('Suppliers');
    var Throwable           = bugpack.require('Throwable');
    var Throwables          = bugpack.require('Throwables');
    var Tracer              = bugpack.require('Tracer');
    var TypeUtil            = bugpack.require('TypeUtil');
    var ValidationMachine   = bugpack.require('ValidationMachine');
    var Validator           = bugpack.require('Validator');
    var ValidatorGroup      = bugpack.require('ValidatorGroup');
    var ValidatorProcessor  = bugpack.require('ValidatorProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var BugCore = Class.extend(Obj, {

        _name: "BugCore",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Public Properties
            //-------------------------------------------------------------------------------

            /**
             * @type {function(new:ArgUtil)}
             */
            this.ArgUtil            = ArgUtil;

            /**
             * @type {function(new:ArrayUtil)}
             */
            this.ArrayUtil          = ArrayUtil;

            /**
             * @type {function(new:Bug)}
             */
            this.Bug                = Bug;

            /**
             * @type {function(new:Class)}
             */
            this.Class              = Class;

            /**
             * @type {function(new:Collection)}
             */
            this.Collection         = Collection;

            /**
             * @type {function(new:Collections)}
             */
            this.Collections        = Collections;

            /**
             * @type {function(new:Config)}
             */
            this.Config             = Config;

            /**
             * @type {function(new:Constructor)}
             */
            this.Constructor        = Constructor;

            /**
             * @type {function(new:DateUtil)}
             */
            this.DateUtil           = DateUtil;

            /**
             * @type {function(new:Deferred)}
             */
            this.Deferred           = Deferred;

            /**
             * @type {function(new:Event)}
             */
            this.Event              = Event;

            /**
             * @type {function(new:EventDispatcher)}
             */
            this.EventDispatcher    = EventDispatcher;

            /**
             * @type {function(new:EventPropagator)}
             */
            this.EventPropagator    = EventPropagator;

            /**
             * @type {function(new:EventReceiver)}
             */
            this.EventReceiver      = EventReceiver;

            /**
             * @type {function(new:Exception)}
             */
            this.Exception          = Exception;

            /**
             * @type {function(new:Flows)}
             */
            this.Flows              = Flows;

            /**
             * @type {function(new:Func)}
             */
            this.Func               = Func;

            /**
             * @type {function(new:Handler)}
             */
            this.Handler            = Handler;

            /**
             * @type {function(new:HashStore)}
             */
            this.HashStore          = HashStore;

            /**
             * @type {function(new:HashTable)}
             */
            this.HashTable          = HashTable;

            /**
             * @type {function(new:HashUtil)}
             */
            this.HashUtil           = HashUtil;

            /**
             * @type {function(new:IArrayable)}
             */
            this.IArrayable         = IArrayable;

            /**
             * @type {function(new:IClone)}
             */
            this.IClone             = IClone;

            /**
             * @type {function(new:IdGenerator)}
             */
            this.IdGenerator        = IdGenerator;

            /**
             * @type {function(new:ICollection)}
             */
            this.ICollection        = ICollection;

            /**
             * @type {function(new:IEquals)}
             */
            this.IEquals            = IEquals;

            /**
             * @type {function(new:IHashCode)}
             */
            this.IHashCode          = IHashCode;

            /**
             * @type {function(new:IIterable)}
             */
            this.IIterable          = IIterable;

            /**
             * @type {function(new:IIterator)}
             */
            this.IIterator          = IIterator;

            /**
             * @type {function(new:IList)}
             */
            this.IList              = IList;

            /**
             * @type {function(new:IMap)}
             */
            this.IMap               = IMap;

            /**
             * @type {function(new:Implementable)}
             */
            this.Implementable      = Implementable;

            /**
             * @type {function(new:Interface)}
             */
            this.Interface          = Interface;

            /**
             * @type {function(new:IObjectable)}
             */
            this.IObjectable        = IObjectable;

            /**
             * @type {function(new:IProxy)}
             */
            this.IProxy             = IProxy;

            /**
             * @type {function(new:ISet)}
             */
            this.ISet               = ISet;

            /**
             * @type {function(new:List)}
             */
            this.List               = List;

            /**
             * @type {function(new:Lock)}
             */
            this.Lock               = Lock;

            /**
             * @type {function(new:Map)}
             */
            this.Map                = Map;

            /**
             * @type {function(new:MathUtil)}
             */
            this.MathUtil           = MathUtil;

            /**
             * @type {function(new:Obj)}
             */
            this.Obj                = Obj;

            /**
             * @type {function(new:ObjectUtil)}
             */
            this.ObjectUtil         = ObjectUtil;

            /**
             * @type {function(new:Pair)}
             */
            this.Pair               = Pair;

            /**
             * @type {function(new:Promise)}
             */
            this.Promise            = Promise;

            /**
             * @type {function(new:Promises)}
             */
            this.Promises           = Promises;

            /**
             * @type {function(new:Proxy)}
             */
            this.Proxy              = Proxy;

            /**
             * @type {function(new:ProxyMethod)}
             */
            this.ProxyMethod        = ProxyMethod;

            /**
             * @type {function(new:ProxyObject)}
             */
            this.ProxyObject        = ProxyObject;

            /**
             * @type {function(new:ProxyProperty)}
             */
            this.ProxyProperty      = ProxyProperty;

            /**
             * @type {function(new:Queue)}
             */
            this.Queue              = Queue;

            /**
             * @type {function(new:RandomUtil)}
             */
            this.RandomUtil         = RandomUtil;

            /**
             * @type {function(new:RateLimiter)}
             */
            this.RateLimiter        = RateLimiter;

            /**
             * @type {function(new:Resolver)}
             */
            this.Resolver           = Resolver;

            /**
             * @type {function(new:Semaphore)}
             */
            this.Semaphore          = Semaphore;

            /**
             * @type {function(new:Set)}
             */
            this.Set                = Set;

            /**
             * @type {function(new:Stack)}
             */
            this.Stack              = Stack;

            /**
             * @type {function(new:Stream)}
             */
            this.Stream             = Stream;

            /**
             * @type {function(new:StringUtil)}
             */
            this.StringUtil         = StringUtil;

            /**
             * @type {function(new:Striped)}
             */
            this.Striped            = Striped;

            /**
             * @type {function(new:Suppliers)}
             */
            this.Suppliers          = Suppliers;

            /**
             * @type {function(new:Throwable)}
             */
            this.Throwable          = Throwable;

            /**
             * @type {function(new:Throwables)}
             */
            this.Throwables         = Throwables;

            /**
             * @type {function(new:Tracer)}
             */
            this.Tracer             = Tracer;

            /**
             * @type {function(new:TypeUtil)}
             */
            this.TypeUtil           = TypeUtil;

            /**
             * @type {function(new:ValidationMachine)}
             */
            this.ValidationMachine  = ValidationMachine;

            /**
             * @type {function(new:Validator)}
             */
            this.Validator          = Validator;

            /**
             * @type {function(new:ValidatorGroup)}
             */
            this.ValidatorGroup     = ValidatorGroup;

            /**
             * @type {function(new:ValidatorProcessor)}
             */
            this.ValidatorProcessor = ValidatorProcessor;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {(ICollection.<C> | Array.<C>)=} items
         * @return {Collection.<C>}
         * @template C
         */
        collection: function(items) {
            return new Collection(items);
        },

        /**
         * @param {(ICollection.<C> | Array.<C>)=} items
         * @return {List.<C>}
         * @template C
         */
        list: function(items) {
            return new List(items);
        },

        /**
         * @param {Map.<K, V>=} map
         * @return {Map.<K, V>}
         * @template K, V
         */
        map: function(map) {
            return new Map(map);
        },

        /**
         * @param {(Collection.<*> | Array.<*>)} items
         * @return {Queue.<C>}
         * @template C
         */
        queue: function(items) {
            return new Queue(items);
        },

        /**
         * @param {(ICollection.<C> | Array.<C>)=} items
         * @return {Set.<C>}
         * @template C
         */
        set: function(items) {
            return new Set(items);
        },

        /**
         * @param {(ICollection.<C> | Array.<C>)=} items
         * @return {Stack.<C>}
         * @template C
         */
        stack: function(items) {
            return new Stack(items);
        }
    });


    //-------------------------------------------------------------------------------
    // Private Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @type {BugCore}
     */
    BugCore.instance = null;


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {BugCore}
     */
    BugCore.getInstance = function() {
        if (BugCore.instance === null) {
            BugCore.instance = new BugCore();
        }
        return BugCore.instance;
    };


    //-------------------------------------------------------------------------------
    // Static Proxy
    //-------------------------------------------------------------------------------

    Proxy.proxy(BugCore, Proxy.method(BugCore.getInstance), [
        "collection",
        "list",
        "map",
        "queue",
        "set",
        "stack"
    ]);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('BugCore', BugCore);
});
