/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject        = buildbug.buildProject;
var buildProperties     = buildbug.buildProperties;
var buildScript         = buildbug.buildScript;
var buildTarget         = buildbug.buildTarget;
var enableModule        = buildbug.enableModule;
var parallel            = buildbug.parallel;
var series              = buildbug.series;
var targetTask          = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var aws                 = enableModule("aws");
var bugpack             = enableModule('bugpack');
var bugunit             = enableModule('bugunit');
var core                = enableModule('core');
var lintbug             = enableModule("lintbug");
var nodejs              = enableModule('nodejs');
var uglifyjs            = enableModule("uglifyjs");


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var name                = "bugcore";
var version             = "0.2.18";
var dependencies        = {
    bugpack: "0.2.0"
};


//-------------------------------------------------------------------------------
// BuildProperties
//-------------------------------------------------------------------------------

buildProperties({
    name: name,
    version: version
});

buildProperties({
    node: {
        packageJson: {
            name: "{{name}}",
            version: "{{version}}",
            description: "bugcore is a JavaScript library that provides a foundational architecture for object oriented JS",
            main: "./scripts/bugcore-node.js",
            dependencies: dependencies,
            author: "Brian Neisler <brian@airbug.com>",
            repository: {
                type: "git",
                url: "https://github.com/airbug/bugcore.git"
            },
            bugs: {
                url: "https://github.com/airbug/bugcore/issues"
            },
            licenses: [
                {
                    type : "MIT",
                    url : "https://raw.githubusercontent.com/airbug/bugcore/master/LICENSE"
                }
            ]
        },
        sourcePaths: [
            "./libraries/bugcore/js/src"
        ],
        scriptPaths: [
            "./projects/bugcore-node/js/scripts"
        ],
        readmePath: "./README.md",
        unitTest: {
            packageJson: {
                name: "{{name}}-test",
                version: "{{version}}",
                main: "./scripts/bugcore-node.js",
                dependencies: dependencies,
                private: true,
                scripts: {
                    test: "node ./test/scripts/bugunit-run.js"
                }
            },
            sourcePaths: [
                "../buganno/libraries/buganno/js/src",
                "../bugdouble/libraries/bugdouble/js/src",
                "../bugfs/libraries/bugfs/js/src",
                "../bugmeta/libraries/bugmeta/js/src",
                "../bugunit/libraries/bugunit/js/src",
                "../bugyarn/libraries/bugyarn/js/src"
            ],
            scriptPaths: [
                "../buganno/libraries/buganno/js/scripts",
                "../bugunit/libraries/bugunit/js/scripts"
            ],
            testPaths: [
                "./libraries/bugcore/js/test"
            ]
        }
    },
    web: {
        buildPath: buildProject.getProperty("buildPath") + "/web",
        name: name,
        version: version,
        sourcePaths: [
            "./libraries/bugcore/js/src"
        ],
        outputFile: "{{distPath}}/{{web.name}}-{{web.version}}.js",
        outputMinFile: "{{distPath}}/{{web.name}}-{{web.version}}.min.js"
    },
    lint: {
        targetPaths: [
            "."
        ],
        ignorePatterns: [
            ".*\\.buildbug$",
            ".*\\.bugunit$",
            ".*\\.git$",
            ".*node_modules$"
        ]
    }
});


//-------------------------------------------------------------------------------
// BuildTargets
//-------------------------------------------------------------------------------

// Clean BuildTarget
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);


// Local BuildTarget
//-------------------------------------------------------------------------------

buildTarget('local').buildFlow(
    series([
        targetTask('clean'),
        targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("lint.targetPaths"),
                ignores: buildProject.getProperty("lint.ignorePatterns"),
                lintTasks: [
                    "cleanupExtraSpacingAtEndOfLines",
                    "ensureNewLineEnding",
                    "indentEqualSignsForPreClassVars",
                    "orderBugpackRequires",
                    "orderRequireAnnotations",
                    "updateCopyright"
                ]
            }
        }),
        parallel([
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("node.packageJson"),
                        packagePaths: {
                            ".": [buildProject.getProperty("node.readmePath")],
                            "./lib": buildProject.getProperty("node.sourcePaths"),
                            "./scripts": buildProject.getProperty("node.scriptPaths"),
                            "./test": buildProject.getProperty("node.unitTest.testPaths"),
                            "./test/lib": buildProject.getProperty("node.unitTest.sourcePaths"),
                            "./test/scripts": buildProject.getProperty("node.unitTest.scriptPaths")
                        }
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{node.packageJson.name}}",
                        packageVersion: "{{node.packageJson.version}}"
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                            //checkCoverage: true
                        });
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{local-bucket}}"
                    }
                })
            ]),
            series([
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("web.sourcePaths"),
                        intoPath: "{{web.buildPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        name: "{{web.name}}",
                        sourceRoot: "{{web.buildPath}}"
                    }
                }),
                targetTask("concat", {
                    init: function(task, buildProject, properties) {
                        var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("web.name"));
                        var sources         = [];
                        var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                        registryEntries.forEach(function(bugPackRegistryEntry) {
                            sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                        });
                        task.updateProperties({
                            sources: sources.concat("./projects/bugcore-web/js/scripts/bugcore-web.js")
                        });
                    },
                    properties: {
                        outputFile: "{{web.outputFile}}"
                    }
                }),
                parallel([
                    targetTask("s3PutFile", {
                        properties: {
                            file:  "{{web.outputFile}}",
                            options: {
                                acl: 'public-read',
                                gzip: true
                            },
                            bucket: "{{local-bucket}}"
                        }
                    }),
                    series([
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{web.outputFile}}"],
                                outputFile: "{{web.outputMinFile}}"
                            }
                        }),
                        targetTask("s3PutFile", {
                            properties: {
                                file:  "{{web.outputMinFile}}",
                                options: {
                                    acl: 'public-read',
                                    gzip: true
                                },
                                bucket: "{{local-bucket}}"
                            }
                        })
                    ])
                ])
            ])
        ])
    ])
).makeDefault();


// Prod BuildTarget
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
    series([
        targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("lint.targetPaths"),
                ignores: buildProject.getProperty("lint.ignorePatterns"),
                lintTasks: [
                    "cleanupExtraSpacingAtEndOfLines",
                    "ensureNewLineEnding",
                    "indentEqualSignsForPreClassVars",
                    "orderBugpackRequires",
                    "orderRequireAnnotations",
                    "updateCopyright"
                ]
            }
        }),
        targetTask('clean'),
        parallel([

            //Create test node bugcore package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("node.unitTest.packageJson"),
                        packagePaths: {
                            "./lib": buildProject.getProperty("node.sourcePaths"),
                            "./scripts": buildProject.getProperty("node.scriptPaths"),
                            "./test": buildProject.getProperty("node.unitTest.testPaths"),
                            "./test/lib": buildProject.getProperty("node.unitTest.sourcePaths"),
                            "./test/scripts": buildProject.getProperty("node.unitTest.scriptPaths")
                        }
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("node.unitTest.packageJson.name"),
                            buildProject.getProperty("node.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{node.unitTest.packageJson.name}}",
                        packageVersion: "{{node.unitTest.packageJson.version}}"
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("node.unitTest.packageJson.name"),
                            buildProject.getProperty("node.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath(),
                            checkCoverage: true
                        });
                    }
                })
            ]),

            // Create production node bugcore package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("node.packageJson"),
                        packagePaths: {
                            ".": [buildProject.getProperty("node.readmePath")],
                            "./lib": buildProject.getProperty("node.sourcePaths"),
                            "./scripts": buildProject.getProperty("node.scriptPaths")
                        }
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{node.packageJson.name}}",
                        packageVersion: "{{node.packageJson.version}}"
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{public-bucket}}"
                    }
                }),
                targetTask('npmConfigSet', {
                    properties: {
                        config: buildProject.getProperty("npmConfig")
                    }
                }),
                targetTask('npmAddUser'),
                targetTask('publishNodePackage', {
                    properties: {
                        packageName: "{{node.packageJson.name}}",
                        packageVersion: "{{node.packageJson.version}}"
                    }
                })
            ]),


            series([
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("web.sourcePaths"),
                        intoPath: "{{web.buildPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        name: "{{web.name}}",
                        sourceRoot: "{{web.buildPath}}"
                    }
                }),
                targetTask("concat", {
                    init: function(task, buildProject, properties) {
                        var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("web.name"));
                        var sources         = [];
                        var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                        registryEntries.forEach(function(bugPackRegistryEntry) {
                            sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                        });
                        task.updateProperties({
                            sources: sources.concat("./projects/bugcore-web/js/scripts/bugcore-web.js")
                        });
                    },
                    properties: {
                        outputFile: "{{web.outputFile}}"
                    }
                }),
                parallel([
                    targetTask("s3PutFile", {
                        properties: {
                            file:  "{{web.outputFile}}",
                            options: {
                                acl: 'public-read',
                                gzip: true,
                                cacheControl: "max-age=31536000, public"
                            },
                            bucket: "{{public-bucket}}"
                        }
                    }),
                    series([
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{web.outputFile}}"],
                                outputFile: "{{web.outputMinFile}}"
                            }
                        }),
                        targetTask("s3PutFile", {
                            properties: {
                                file:  "{{web.outputMinFile}}",
                                options: {
                                    acl: 'public-read',
                                    gzip: true,
                                    cacheControl: "max-age=31536000, public"
                                },
                                bucket: "{{public-bucket}}"
                            }
                        })
                    ])
                ])
            ])
        ])
    ])
);


//-------------------------------------------------------------------------------
// Build Scripts
//-------------------------------------------------------------------------------

buildScript({
    dependencies: [
        "bugcore",
        "bugflow",
        "bugfs"
    ],
    script: "./lintbug.js"
});
