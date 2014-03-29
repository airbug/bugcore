//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('tests')

//@Export('TypeValueSetsHelper')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Helper
//-------------------------------------------------------------------------------

var TypeValueSetsHelper = {

    getTypeValueSets: function() {
        var typeValueSets = {
            array: [
                {name: "array literal", value: []},
                {name: "Array object", value: new Array()}
            ],
            boolean: [
                {name: "boolean literal false", value: false},
                {name: "boolean literal true", value: true},
                {name: "Boolean object false", value: new Boolean(false)},
                {name: "Boolean object true", value: new Boolean(true)}
            ],
            date: [
                {name: "Date object", value: new Date(Date.now())}
            ],
            function: [
                {name: "function literal", value: function() {}},
                {name: "Function object", value: new Function()}
            ],
            null: [
                {name: "null", value: null}
            ],
            number: [
                {name: "number literal 0", value: 0},
                {name: "number literal", value: 123},
                {name: "negative number literal", value: -123},
                {name: "decimal number literal", value: 123.456},
                {name: "negative decmial number literal", value: -123.456},
                {name: "Number object 0", value: new Number(0)},
                {name: "Number object", value: new Number(123)},
                {name: "negative Number object", value: new Number(-123)},
                {name: "decimal Number object", value: new Number(123.456)},
                {name: "negative decimal Number object", value: new Number(-123.456)},
                {name: "positive infinity", value: Infinity},
                {name: "negative infinity", value: -Infinity},
                {name: "positive infinity property", value: Number.POSITIVE_INFINITY},
                {name: "negative infinity property", value: Number.NEGATIVE_INFINITY}
            ],
            object:[
                {name: "object literal", value: {}},
                {name: "Object object", value: new Object()}
            ],
            string: [
                {name: "empty string literal", value: ""},
                {name: "string literal", value: "abc123"},
                {name: "numeric string literal", value: "123"},
                {name: "empty String object", value: new String("")},
                {name: "String object", value: new String("abc123")},
                {name: "numeric String object", value: new String("123")}
            ],
            undefined: [
                {name: "undefined", value: undefined}
            ]
        };
        return typeValueSets;
    }
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

bugpack.export('tests.TypeValueSetsHelper', TypeValueSetsHelper);
