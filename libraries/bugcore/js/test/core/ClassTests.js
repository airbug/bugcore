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
//@Require('Constructor')
//@Require('IHashCode')
//@Require('Interface')
//@Require('Obj')
//@Require('TypeUtil')
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
    var Constructor     = bugpack.require('Constructor');
    var IClone          = bugpack.require('IClone');
    var IEquals         = bugpack.require('IEquals');
    var IHashCode       = bugpack.require('IHashCode');
    var Interface       = bugpack.require('Interface');
    var Obj             = bugpack.require('Obj');
    var TypeUtil        = bugpack.require('TypeUtil');
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

    var classAllocTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testArgument1 = 'value1';
            this.testArgument2 = 'value2';
            this.testInitNotCalled = true;
            this.NewConstructor = Class.extend(Obj, {
                _constructor: function(arg1, arg2) {
                    test.assertEqual(arg1, _this.testArgument1,
                        'Assert arg1 is equal to testArgument1');
                    test.assertEqual(arg2, _this.testArgument2,
                        'Assert arg2 is equal to testArgument2');
                },
                init: function() {
                    _this.testInitNotCalled = false;
                },
                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            });
            this.instance = this.NewConstructor.getClass().alloc(this.testArgument1, this.testArgument2);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction1),
                'Assert function added to class is present in class instance');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction2),
                'Assert second function added to class is present in class instance');
            test.assertTrue(Class.doesExtend(this.instance, Obj),
                'Assert instance of new class extends base level Object class');
            test.assertTrue(Class.doesExtend(this.instance, this.NewConstructor),
                'Assert instance of new class extends NewConstructor');
            test.assertTrue(this.testInitNotCalled,
                'Assert #init has not been called');
        }
    };

    var classAllocWithArrayTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testArgument1 = 'value1';
            this.testArgument2 = 'value2';
            this.testInitNotCalled = true;
            this.NewConstructor = Class.extend(Obj, {
                _constructor: function(arg1, arg2) {
                    test.assertEqual(arg1, _this.testArgument1,
                        'Assert arg1 is equal to testArgument1');
                    test.assertEqual(arg2, _this.testArgument2,
                        'Assert arg2 is equal to testArgument2');
                },
                init: function() {
                    _this.testInitNotCalled = false;
                },
                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            });
            this.instance = this.NewConstructor.getClass().allocWithArray([this.testArgument1, this.testArgument2]);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction1),
                'Assert function added to class is present in class instance');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction2),
                'Assert second function added to class is present in class instance');
            test.assertTrue(Class.doesExtend(this.instance, Obj),
                'Assert instance of new class extends base level Object class');
            test.assertTrue(Class.doesExtend(this.instance, this.NewConstructor),
                'Assert instance of new class extends NewConstructor');
            test.assertTrue(this.testInitNotCalled,
                'Assert #init has not been called');
        }
    };

    var classAllocInitTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testArgument1 = 'value1';
            this.testArgument2 = 'value2';
            this.testInitCalled = false;
            this.NewConstructor = Class.extend(Obj, {
                _constructor: function() {
                    this._super();
                },
                init: function(arg1, arg2) {
                    var returned = this._super();
                    _this.testInitCalled = true;
                    test.assertEqual(returned, this,
                        'Assert that init method returned "this"');
                    test.assertEqual(arg1, _this.testArgument1,
                        'Assert arg1 is equal to testArgument1');
                    test.assertEqual(arg2, _this.testArgument2,
                        'Assert arg2 is equal to testArgument2');
                    return this;
                },
                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            });
            this.instance = this.NewConstructor.getClass().alloc().init(this.testArgument1, this.testArgument2);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction1),
                'Assert function added to class is present in class instance');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction2),
                'Assert second function added to class is present in class instance');
            test.assertTrue(Class.doesExtend(this.instance, Obj),
                'Assert instance of new class extends base level Object class');
            test.assertTrue(Class.doesExtend(this.instance, this.NewConstructor),
                'Assert instance of new class extends NewConstructor');
            test.assertTrue(this.testInitCalled,
                'Assert #init has been called');
        }
    };

    var classNewInstanceTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testArgument1 = 'value1';
            this.testArgument2 = 'value2';
            this.testInitCalled = false;
            this.NewConstructor = Class.extend(Obj, {
                _constructor: function(arg1, arg2) {
                    test.assertEqual(arg1, _this.testArgument1,
                        'Assert arg1 is equal to testArgument1 in _constructor');
                    test.assertEqual(arg2, _this.testArgument2,
                        'Assert arg2 is equal to testArgument2 in _constructor');
                },
                init: function(arg1, arg2) {
                    _this.testInitCalled = true;
                    test.assertEqual(arg1, _this.testArgument1,
                        'Assert arg1 is equal to testArgument1 in #init');
                    test.assertEqual(arg2, _this.testArgument2,
                        'Assert arg2 is equal to testArgument2 in #init');
                },
                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            });
            this.instance = this.NewConstructor.getClass().newInstance(this.testArgument1, this.testArgument2);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction1),
                'Assert function added to class is present in class instance');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction2),
                'Assert second function added to class is present in class instance');
            test.assertTrue(Class.doesExtend(this.instance, Obj),
                'Assert instance of new class extends base level Object class');
            test.assertTrue(Class.doesExtend(this.instance, this.NewConstructor),
                'Assert instance of new class extends NewConstructor');
            test.assertTrue(this.testInitCalled,
                'Assert #init has been called');
        }
    };

    var classNewInstanceWithArrayTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testArgument1 = 'value1';
            this.testArgument2 = 'value2';
            this.testInitCalled = false;
            this.NewConstructor = Class.extend(Obj, {
                _constructor: function(arg1, arg2) {
                    test.assertEqual(arg1, _this.testArgument1,
                        'Assert arg1 is equal to testArgument1 in _constructor');
                    test.assertEqual(arg2, _this.testArgument2,
                        'Assert arg2 is equal to testArgument2 in _constructor');
                },
                init: function(arg1, arg2) {
                    _this.testInitCalled = true;
                    test.assertEqual(arg1, _this.testArgument1,
                        'Assert arg1 is equal to testArgument1 in #init');
                    test.assertEqual(arg2, _this.testArgument2,
                        'Assert arg2 is equal to testArgument2 in #init');
                },
                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            });
            this.instance = this.NewConstructor.getClass().newInstanceWithArray([this.testArgument1, this.testArgument2]);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction1),
                'Assert function added to class is present in class instance');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction2),
                'Assert second function added to class is present in class instance');
            test.assertTrue(Class.doesExtend(this.instance, Obj),
                'Assert instance of new class extends base level Object class');
            test.assertTrue(Class.doesExtend(this.instance, this.NewConstructor),
                'Assert instance of new class extends NewConstructor');
            test.assertTrue(this.testInitCalled,
                'Assert #init has been called');
        }
    };

    /**
     *
     */
    var classAdaptTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.AdapteeClass = function() {};
            this.AdapteeClass.prototype = {
                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            };
            this.ChildClass = Class.adapt(this.AdapteeClass, {
                someTestFunction1: function() {

                },
                someTestFunction3: function() {

                }
            });
            this.instanceChildClass = new this.ChildClass();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertFalse(TypeUtil.isFunction(this.AdapteeClass.prototype._constructor),
                'Assert _constructor has not been added to the AdapteeClass');
            test.assertFalse(TypeUtil.isFunction(this.AdapteeClass.prototype.getClass),
                'Assert getClass has not been added to the AdapteeClass');
            test.assertFalse(TypeUtil.isFunction(this.AdapteeClass.getClass),
                'Assert getClass has not been added statically the AdapteeClass');

            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction1),
                'Assert override function added to child class is function and is present in child class prototype');
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction2),
                'Assert function of parent class is function and is present in child class prototype');
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction3),
                'Assert function added to child class is function and is present in child class prototype');
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype._constructor),
                'Assert _constructor function has been added to child class, is a function, and is present in child class prototype');
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.getClass),
                'Assert getClass added to child class is function and is present in child class prototype');

            test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction1),
                'Assert override function added to child class is present in child class instance');
            test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction2),
                'Assert function of parent class is present in child class instance');
            test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction3),
                'Assert function added to child class is present in child class instance');
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype._constructor),
                'Assert _constructor function is present on child instance');
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.getClass),
                'Assert getClass function is present on child instance');

            test.assertTrue(Class.doesExtend(this.instanceChildClass, this.AdapteeClass),
                'Assert child class extends parent AdapteeClass');
            test.assertTrue(Class.doesExtend(this.instanceChildClass, this.ChildClass),
                'Assert child class extends itself');


            //NOTE BRN: This is not possible. Can't inject Constructor.prototype in to the prototype chain.
            /*test.assertTrue(Class.doesExtend(this.instanceChildClass, Constructor),
                'Assert child class extends base level Constructor class');*/
        }
    };

    /**
     *
     */
    var classDeclareTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.NewClass = Class.declare({
                _name: 'NewClass',

                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            });
            this.instance = new this.NewClass();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.NewClass.prototype.someTestFunction1),
                'Assert function added to class is function and is present in class prototype');
            test.assertTrue(TypeUtil.isFunction(this.NewClass.prototype.someTestFunction2),
                'Assert second function added to class is function and is present in class prototype');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction1),
                'Assert function added to class is present in class instance');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction2),
                'Assert second function added to class is present in class instance');
            test.assertTrue(Class.doesExtend(this.instance, Constructor),
                'Assert instance of new class extends base level Constructor function');
            test.assertTrue(Class.doesExtend(this.instance, this.NewClass),
                'Assert instance of new class extends itself');

            var classFromConstructor = this.NewClass.getClass();
            test.assertTrue(Class.doesExtend(classFromConstructor, Class),
                'Assert getClass returns instance of Class');
            if (Class.doesExtend(classFromConstructor, Class)) {
                test.assertEqual(classFromConstructor.getSuperclass(), null,
                    'Assert #getSuperclass returns null');
                test.assertEqual(classFromConstructor.getConstructor(), this.NewClass,
                    'Assert #getConstructor returns NewClass');
                test.assertEqual(classFromConstructor.getName(), 'NewClass',
                    'Assert #getName returns the name of the class');
            }

            var classFromInstance = this.instance.getClass();
            test.assertTrue(Class.doesExtend(classFromInstance, Class),
                'Assert getClass returns instance of Class');
            if (Class.doesExtend(classFromInstance, Class)) {
                test.assertEqual(classFromInstance.getSuperclass(), null,
                    'Assert #getSuperclass returns null');
                test.assertEqual(classFromInstance.getConstructor(), this.NewClass,
                    'Assert #getConstructor returns NewClass');
                test.assertEqual(classFromInstance.getName(), 'NewClass',
                    'Assert #getName returns the name of the class');
            }
        }
    };

    /**
     *
     */
    var classExtendObjTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.NewClass = Class.extend(Obj, {
                _name: 'NewClass',

                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            });
            this.instance = new this.NewClass();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.NewClass.prototype.someTestFunction1),
                'Assert function added to class is function and is present in class prototype');
            test.assertTrue(TypeUtil.isFunction(this.NewClass.prototype.someTestFunction2),
                'Assert second function added to class is function and is present in class prototype');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction1),
                'Assert function added to class is present in class instance');
            test.assertTrue(TypeUtil.isFunction(this.instance.someTestFunction2),
                'Assert second function added to class is present in class instance');
            test.assertTrue(Class.doesExtend(this.instance, Constructor),
                'Assert instance of new class extends base level Constructor function');
            test.assertTrue(Class.doesExtend(this.instance, Obj),
                'Assert instance of new class extends base level Obj class');
            test.assertTrue(Class.doesExtend(this.instance, this.NewClass),
                'Assert instance of new class extends itself');
            test.assertTrue(Class.doesImplement(this.instance, IHashCode),
                'Assert instance of new class implements IHashCode');
            test.assertTrue(Class.doesImplement(this.instance, IEquals),
                'Assert instance of new class implements IEquals');
            test.assertTrue(Class.doesImplement(this.instance, IClone),
                'Assert instance of new class implements IClone');

            var classFromConstructor = this.NewClass.getClass();
            test.assertTrue(Class.doesExtend(classFromConstructor, Class),
                'Assert getClass returns instance of Class');
            if (Class.doesExtend(classFromConstructor, Class)) {
                test.assertEqual(classFromConstructor.getSuperclass(), Obj.getClass(),
                    'Assert getSuperclass returns Obj.getClass()');
                test.assertEqual(classFromConstructor.getConstructor(), this.NewClass,
                    'Assert #getConstructor returns NewClass');
                test.assertEqual(classFromConstructor.getName(), 'NewClass',
                    'Assert #getName returns the name of the class');
            }

            var classFromInstance = this.instance.getClass();
            test.assertTrue(Class.doesExtend(classFromInstance, Class),
                'Assert getClass returns instance of Class');
            if (Class.doesExtend(classFromInstance, Class)) {
                test.assertEqual(classFromInstance.getSuperclass(), Obj.getClass(),
                    'Assert #getSuperclass returns Obj.getClass()');
                test.assertEqual(classFromInstance.getConstructor(), this.NewClass,
                    'Assert #getConstructor returns NewClass');
                test.assertEqual(classFromInstance.getName(), 'NewClass',
                    'Assert #getName returns the name of the class');
            }
        }
    };

    /**
     *
     */
    var classExtendTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.ParentClass = Class.declare( {
                someTestFunction1: function() {

                },
                someTestFunction2: function() {

                }
            });
            this.ChildClass = Class.extend(this.ParentClass, {
                someTestFunction1: function() {

                },
                someTestFunction3: function() {

                }
            });
            this.instanceChildClass = new this.ChildClass();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction1),
                'Assert override function added to child class is function and is present in child class prototype');
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction2),
                'Assert function of parent class is function and is present in child class prototype');
            test.assertTrue(TypeUtil.isFunction(this.ChildClass.prototype.someTestFunction3),
                'Assert function added to child class is function and is present in child class prototype');
            test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction1),
                'Assert override function added to child class is present in child class instance');
            test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction2),
                'Assert function of parent class is present in child class instance');
            test.assertTrue(TypeUtil.isFunction(this.instanceChildClass.someTestFunction3),
                'Assert function added to child class is present in child class instance');

            test.assertTrue(Class.doesExtend(this.instanceChildClass, Constructor),
                'Assert child class extends base level Constructor function');
            test.assertTrue(Class.doesExtend(this.instanceChildClass, this.ParentClass),
                'Assert child class extends parent class');
            test.assertTrue(Class.doesExtend(this.instanceChildClass, this.ChildClass),
                'Assert child class extends itself');
        }
    };

    /**
     *
     */
    var classImplementTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.TestImplementable = Interface.declare({
                someInterfaceFunction: function() {

                }
            });
            this.TestConstructor = Class.extend(Obj, {
                someInterfaceFunction: function() {

                },
                someFunction: function() {

                }
            });
            Class.implement(this.TestConstructor, this.TestImplementable);
            this.instance = new this.TestConstructor();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.TestConstructor.prototype.someFunction),
                'Assert function added to class is function and is present in class prototype');
            test.assertTrue(TypeUtil.isFunction(this.TestConstructor.prototype.someInterfaceFunction),
                'Assert interface function added to class is function and is present in class prototype');
            test.assertEqual(this.TestConstructor.getClass().getInterfaces().length, 4,
                'Assert we have 3 interfaces listed on TestConstructor\'s class (IHashCode, IEquals, IClone and TestImplementable)');
            test.assertEqual(this.TestConstructor.getClass().getInterfaces()[3], this.TestImplementable.getInterface(),
                'Assert test interface is listed in TestConstructor\'s class\'s interfaces');
            test.assertTrue(TypeUtil.isFunction(this.instance.someFunction),
                'Assert function added to class is present in class instance');
            test.assertTrue(TypeUtil.isFunction(this.instance.someInterfaceFunction),
                'Assert interface function added to class is present in class instance');
            test.assertEqual(this.instance.getClass().getInterfaces().length, 4,
                'Assert we have 2 interfaces listed in instance of TestConstructor through getClass()');
            test.assertEqual(this.instance.getClass().getInterfaces()[3], this.TestImplementable.getInterface(),
                'Assert TestImplementable\'s interface is listed in interfaces on instance of TestConstructor through getClass()');
            test.assertTrue(Class.doesImplement(this.instance, this.TestImplementable),
                'Assert Class.doesImplement returns true for instance implementing TestImplementable');
        }
    };

    /**
     *
     */
    var classNonImplementErrorTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.TestImplementable = Interface.declare({
                someInterfaceFunction: function() {

                }
            });
            this.TestConstructor = Class.extend(Obj, {
                someFunction: function() {

                }
            });
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertThrows(function() {
                Class.implement(_this.TestConstructor, _this.TestImplementable);
            }, 'Assert implementing an interfaces that a Class does not implement throws an error');
        }
    };

    /**
     *
     */
    var classImplementTwiceErrorTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.TestImplementable = Interface.declare({
                someInterfaceFunction: function() {

                }
            });
            this.TestConstructor = Class.extend(Obj, {
                someFunction: function() {

                },
                someInterfaceFunction: function() {

                }
            });
            Class.implement(this.TestConstructor, this.TestImplementable);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertThrows(function() {
                Class.implement(_this.TestConstructor, _this.TestImplementable);
            }, 'Assert implementing an interface twice throws an error');
        }
    };

    /**
     *
     */
    var classImplementExtendedInterfaceNoErrorTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.TestImplementable = Interface.declare({
                someInterfaceFunction: function() {

                }
            });
            this.TestSubImplementable = Interface.extend(this.TestImplementable, {
                someOtherInterfaceFunction: function() {

                }
            });
            this.TestConstructor = Class.extend(Obj, {
                someFunction: function() {

                },
                someInterfaceFunction: function() {

                },
                someOtherInterfaceFunction: function() {

                }
            });
            Class.implement(this.TestConstructor, this.TestImplementable);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertNotThrows(function() {
                Class.implement(_this.TestConstructor, _this.TestSubImplementable);
            }, 'Assert implementing a sub interface of an already implemented interface does not throw an error');
        }
    };

    /**
     *
     */
    var classDoesImplementTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.TestImplementable = Interface.declare({
                someInterfaceFunction: function() {

                }
            });
            this.TestConstructor = Class.extend(Obj, {
                someInterfaceFunction: function() {

                },
                someFunction: function() {

                }
            });
            Class.implement(this.TestConstructor, this.TestImplementable);
            this.instance = new this.TestConstructor();
            this.valuesThatDoNotImplement = [
                {},
                [],
                function() {},
                'some string',
                12345,
                null,
                undefined,
                0
            ];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(Class.doesImplement(this.instance, this.TestImplementable), true,
                'Assert that and instance of our test class does implement the test interface');
            var _this = this;
            this.valuesThatDoNotImplement.forEach(function(value) {
                test.assertEqual(Class.doesImplement(value, _this.TestImplementable), false,
                    'Assert that the value "' + value + '" does not implement the test interface');
            });
        }
    };

    /**
     *
     */
    var classDoesImplementExtendedInterfaceTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.TestImplementable = Interface.declare({
                someInterfaceFunction: function() {

                }
            });
            this.TestSubImplementable = Interface.extend(this.TestImplementable, {
                someOtherInterfaceFunction: function() {

                }
            });
            this.TestConstructor = Class.extend(Obj, {
                someInterfaceFunction: function() {

                },
                someOtherInterfaceFunction: function() {

                },
                someFunction: function() {

                }
            });
            Class.implement(this.TestConstructor, this.TestSubImplementable);
            this.instance = new this.TestConstructor();
            this.valuesThatDoNotImplement = [
                {},
                [],
                function() {},
                'some string',
                12345,
                null,
                undefined,
                0
            ];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(Class.doesImplement(this.instance, this.TestImplementable), true,
                'Assert that and instance of our TestConstructor does implement the TestImplementable');
            test.assertEqual(Class.doesImplement(this.instance, this.TestSubImplementable), true,
                'Assert that and instance of our TestConstructor does implement the TestSubImplementable');
            var _this = this;
            this.valuesThatDoNotImplement.forEach(function(value) {
                test.assertEqual(Class.doesImplement(value, _this.TestImplementable), false,
                    'Assert that the value "' + value + '" does not implement the test interface');
            });
        }
    };

    /**
     *
     */
    var classConstructorTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.constructorCalled = false;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.TestConstructor = Class.extend(Obj, {
                _constructor: function() {
                    _this.constructorCalled = true;
                    test.assertEqual(this.getClass().getConstructor(), _this.TestConstructor,
                        'Assert that the class is available during construction');
                }
            });
            this.instance = new this.TestConstructor();
            test.assertEqual(this.constructorCalled, true,
                'Assert that the constructor was called during instantiation');
        }
    };

    var classIsConstructorTest = {
        setup: function() {
            this.TestConstructor = Class.extend(Obj, {});
            this.TestNonConstructor = function() {};
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(Class.isConstructor(this.TestConstructor), true,
                'Assert that Class.isConstructor returns true for the Constructor function');
            test.assertEqual(Class.isConstructor(this.TestNonConstructor), false,
                'Assert that Class.isConstructor returns false for the regular function');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(classAllocTest).with(
        test().name('Class - #alloc test')
    );
    bugmeta.tag(classAllocWithArrayTest).with(
        test().name('Class - #allocWithArray test')
    );
    bugmeta.tag(classAllocInitTest).with(
        test().name('Class - #alloc and #init test')
    );
    bugmeta.tag(classNewInstanceTest).with(
        test().name('Class - #newInstance test')
    );
    bugmeta.tag(classNewInstanceWithArrayTest).with(
        test().name('Class - #newInstanceWithArray test')
    );
    bugmeta.tag(classAdaptTest).with(
        test().name('Class - #adapt test')
    );
    bugmeta.tag(classDeclareTest).with(
        test().name('Class - #declare test')
    );
    bugmeta.tag(classExtendObjTest).with(
        test().name('Class - #extend Obj test')
    );
    bugmeta.tag(classExtendTest).with(
        test().name('Class - #extend test')
    );
    bugmeta.tag(classImplementTest).with(
        test().name('Class - #implement test')
    );
    bugmeta.tag(classNonImplementErrorTest).with(
        test().name('Class - non implement Error test')
    );
    bugmeta.tag(classImplementTwiceErrorTest).with(
        test().name('Class - implement twice Error test')
    );
    bugmeta.tag(classImplementExtendedInterfaceNoErrorTest).with(
        test().name('Class - implement extended interface of already implemented interfaces does not error test')
    );
    bugmeta.tag(classDoesImplementTest).with(
        test().name('Class - #doesImplement test')
    );
    bugmeta.tag(classDoesImplementExtendedInterfaceTest).with(
        test().name('Class - #doesImplement extended Interface test')
    );
    bugmeta.tag(classConstructorTest).with(
        test().name('Class - #_constructor test')
    );
    bugmeta.tag(classIsConstructorTest).with(
        test().name('Class - #isConstructor test')
    );
});
