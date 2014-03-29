//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Collection')
//@Require('Map')
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
var Collection      = bugpack.require('Collection');
var Map             = bugpack.require('Map');
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
 *
 */
var mapSimplePutContainsValueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.map.put('key1', this.value1);
        this.map.put('key2', this.value2);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.map.containsValue(this.value1), true,
            "Assert containsValue returns true for value1.");
        test.assertEqual(this.map.containsValue(this.value2), true,
            "Assert containsValue returns true for value2.");
        test.assertEqual(this.map.containsValue(this.value3), false,
            "Assert containsValue returns false for value that hasn't been added to the map.");
    }
};
bugmeta.annotate(mapSimplePutContainsValueTest).with(
    test().name("Map - simple put/containsValue test")
);


/**
 *
 */
var mapSimplePutGetTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.key1 = "key1";
        this.value1 = "value1";
        this.map.put(this.key1, this.value1);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.map.get(this.key1), this.value1,
            "Assert value mapped to key is correct.");
    }
};
bugmeta.annotate(mapSimplePutGetTest).with(
    test().name("Map - simple put/get test")
);


/**
 * This tests..
 * 1) That the getKeyCollection method successfully returns a Collection
 * 2) That the getKeyCollection method of an empty Map returns an empty Collection
 */
var mapGetKeyCollectionOnEmptyMapTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.emptyKeyCollection = this.map.getKeyCollection();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.emptyKeyCollection, Collection),
            "Assert getKeyCollection returned a Collection when called on an empty Map");
        test.assertEqual(this.emptyKeyCollection.getCount(), 0,
            "Assert key Collection count is 0");
    }
};
bugmeta.annotate(mapGetKeyCollectionOnEmptyMapTest).with(
    test().name("Map - getKeyCollection called on an empty Map test")
);


/**
 * This tests..
 * 1) That the getKeyCollection method successfully returns a Collection
 * 2) That the getKeyCollection method of an empty Map returns a map with all of the Map's keys
 */
var mapGetKeyCollectionTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function()  {
        this.map = new Map();
        this.key1 = "key1";
        this.key2 = "key2";
        this.key3 = "key3";
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.map.put(this.key1, this.value1);
        this.map.put(this.key2, this.value2);
        this.map.put(this.key3, this.value3);
        this.keyCollection = this.map.getKeyCollection();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.keyCollection, Collection),
            "Assert getKeyCollection returned a Collection");
        test.assertEqual(this.keyCollection.getCount(), 3,
            "Assert key Collection count is 3");
        test.assertEqual(this.keyCollection.contains(this.key1), true,
            "Assert key Collection contains key1");
        test.assertEqual(this.keyCollection.contains(this.key2), true,
            "Assert key Collection contains key2");
        test.assertEqual(this.keyCollection.contains(this.key3), true,
            "Assert key Collection contains key3");
    }
};
bugmeta.annotate(mapGetKeyCollectionTest).with(
    test().name("Map - getKeyCollection test")
);


/**
 *
 */
var mapDataTypeKeyTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.keys = [
            {},
            [],
            'key',
            123,
            true
        ];
        this.values = [
            'value1',
            'value2',
            'value3',
            'value4',
            'value5'
        ];
        this.map = new Map();

        for (var i = 0, size = this.keys.length; i < size; i++) {
            var key = this.keys[i];
            var value = this.values[i];
            this.map.put(key, value);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.map.containsKey(this.keys[0]),
            "Assert plain javascript object can be used as a key.");
        test.assertTrue(this.map.containsKey(this.keys[1]),
            "Assert plain javascript array can be used as a key.");
        test.assertTrue(this.map.containsKey(this.keys[2]),
            "Assert plain javascript string can be used as a key.");
        test.assertTrue(this.map.containsKey(this.keys[3]),
            "Assert plain javascript number can be used as a key.");
        test.assertTrue(this.map.containsKey(this.keys[4]),
            "Assert plain javascript boolean can be used as a key.");
        test.assertFalse(this.map.containsKey({}),
            "Assert that different plain javascript objects are treated as different keys.");
        test.assertFalse(this.map.containsKey([]),
            "Assert that different plain javascript arrays are treated as different keys.");
    }
};
bugmeta.annotate(mapDataTypeKeyTest).with(
    test().name("Map - data type key test")
);


/**
 * This tests..
 * 1) That keys that are the names of native js functions are not present in the map when the map is empty
 */
var mapGetNativeJavascriptObjectNamesOfEmptyMapTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.keys = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.keys.forEach(function(key) {
            test.assertEqual(_this.map.get(key), undefined,
                "Assert value mapped to native key '" + key + "' is undefined.");
        })
    }
};
bugmeta.annotate(mapGetNativeJavascriptObjectNamesOfEmptyMapTest).with(
    test().name("Map - get() native javascript object names on empty map test")
);


/**
 *
 */
var mapNativeJavascriptObjectNamesPutGetTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.keys = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ];
        this.values = [
            "value1",
            "value2",
            "value3",
            "value4",
            "value5",
            "value6",
            "value7"
        ];
        for (var i = 0, size = this.keys.length; i < size; i++) {
            this.map.put(this.keys[i], this.values[i]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        for (var i = 0, size = this.keys.length; i < size; i++) {
            test.assertEqual(this.map.get(this.keys[i]), this.values[i],
                "Assert that key '" + this.keys[i] + "' correctly mapped to value '" + this.values[i] + "'");
        }
    }
};
bugmeta.annotate(mapNativeJavascriptObjectNamesPutGetTest).with(
    test().name("Map - native javascript object names put/get test")
);


/**
 *
 */
var mapForEachTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.map = new Map();
        this.keys = [
            'key1',
            'key2'
        ];
        this.values = [
            "value1",
            "value2"
        ];
        for (var i = 0, size = this.keys.length; i < size; i++) {
            this.map.put(this.keys[i], this.values[i]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var i = -1;
        this.map.forEach(function(value, key) {
            i++;
            test.assertEqual(key, _this.keys[i],
                "Assert key is correct in forEach iteration");
            test.assertEqual(value, _this.values[i],
                "Assert value is correct in forEach iteration");
        });
    }
};
bugmeta.annotate(mapForEachTest).with(
    test().name("Map - forEach test")
);

//TODO BRN: Add a remove test

