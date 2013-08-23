ArgsType
===

Deep function arguments type check

Usage:
```
var argstype = require('argstype');

// define function, making specific errors 
var errorProvider = function( text ){
    return ( new Error( 'Module name: ' + text ) );
};

// supported types:
//  'b' - boolean
//  'n' - number
//  's' - string
//  'f' - function
//  'o' - object
//  'a' - array

// define rule
var rules = [
    // rule pattern:
    // name, required, type, child type (child type may be a string, rule, array of rules)
    ['options', true, 'o', [
        ['provider', true, 'o', [
            // array of rules means apply rules by name (to object) or by position (to array)
            ['find', true, 'f'],
            ['insert', true, 'f'],
            ['modify', true, 'f'],
            ['delete', true, 'f']
        ]],
        ['views', true, 'o', [
            // rule with name '*' means apply rule to every element of object/array
            '*', false, 'o', [
                ['view', true, 'o', [
                    ['name', true, 's'],
                    ['template', false, 's'],
                    ['config', true, 'o'],
                    ['view', true, 'o']
                ]],
                ['vids', true, 'o', [
                    '*', false, 'a', [
                        ['flexo', true, 's'],
                        ['field', true, 's']
                    ]
                ]]
            ]
        ]],
        ['templatePath', true, 's'],
        ['templateTimeout', false, 'n']
    ]],
    // if last argument is 'callback' and
    // if it is required and
    // if there's no callback in arguments - module throws exception
    ['callback', true, 'f']
];

// bind errorProvider and rules to a 
var checker = argstype.getChecker( errorProvider, rules );

// define function, which arguments should be checked
var myFunction = function( options, callback ){
    var error;
    error = checker( arguments ); // use predefined checker
    error = argstype.check( arguments, rules, errorProvider ); // or checking in place
    
    if( error ){
        callback( error );
        return;
    }

    // my superstar code
    
    callback( null, true );
};

var validArguments = [
    // options
    {
        provider: {
            find: function(){},
            insert: function(){},
            modify: function(){},
            delete: function(){}
        },
        views: {
            test: { // optional
                view: {
                    name: 'test',
                    template: 'test.tpl', // optional
                    config: {},
                    view: {}
                },
                vids: {
                    a: [ 'foo', 'bar' ] // optional
                }
            }
        },
        templatePath: '/dev/random/',
        templateTimeout: '100'
    },
    
    // callback
    function(error, result){}
];

// run your function
myFunction.apply( null, validArguments );
```
