ArgsType
===

Deep function arguments type check

Usage
Пример
```js
var argstype = require('argstype');



// define function, making module-specific errors
// определение функции, создающей экземпляры ошибок текущего модуля 
var errorProvider = function( text ){
    return ( new Error( 'Module name: ' + text ) );
};



// supported types:
// поддерживаемые типы в правилах:
//  'b' - boolean
//  'n' - number
//  's' - string
//  'f' - function
//  'o' - object
//  'a' - array

// define rule
// пример правила
var rules = [
    // rule pattern:
    // name, required, type, child type (child type may be a string, rule, array of rules)
    // name is used to access to object property and generate error messages
    // правило состоит из 4 частей:
    // имя, обязательность, тип, тип дочерних элементов (может быть строкой, правилом или массивом правил)
    // имя используется для доступа к параметру и генерации ошибок
    ['options', true, 'o', [
        ['provider', true, 'o', [
            // array of rules; rules are applied by name (to object) or by position (to array)
            // это массив правил; правила применяются по имени (в объекте) или по позиции (в массиве) 
            ['find', true, 'f'],
            ['insert', true, 'f'],
            ['modify', true, 'f'],
            ['delete', true, 'f']
        ]],
        ['views', true, 'o', [
            // rule with name '*' means that this rule should be applied to every element of object/array
            // правило с именем '*' означает, что правило должно быть применено ко всем элементам массива/объекта
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
    // if last rule has name 'callback' AND
    // if it is required AND
    // if it's type is a function AND
    // if there's no callback in arguments THAN
    // module throws an exception
    // если имя последнего правила 'callback' И
    // если аргумент является обязательным И
    // если он должен быть фукцией
    // если в аргументах вызова функции его нет, ТО
    // модуль выкидывает исключение 
    ['callback', true, 'f']
];



// make a specialized checker
// можно получить функцию проверки аргументов, к которой прикреплены провайдер ошибок и правила 
var checker = argstype.getChecker( errorProvider, rules );



// define function, which arguments should be checked
// определим функцию для которой надо провести проверку аргументов
var myFunction = function( options, callback ){
    var error;
    
    // use predefined checker
    // здесь производится проверка посредством ранее созданной функции проверки
    error = checker( arguments );
    
    // or checking in place
    // но можно воспользоваться и длинным путем
    error = argstype.check( arguments, rules, errorProvider );
    
    if( error ){
        callback( error );
        return;
    }

    // superstar code
    // тело супер-функции
    
    callback( null, true );
};



// valid arguments example
// пример валидных входных аргументов
var validOptions = {
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
                //optional
                // необязательное поле
                template: 'test.tpl',
                config: {},
                view: {}
            },
            vids: {
                //optional
                // необязательное поле
                a: [ 'foo', 'bar' ]
            }
        }
    },
    templatePath: '/dev/random/',
    templateTimeout: '100'
};
var validCallback = function(error, result){};



// run your function
// запуск функции с валидными аргументами
myFunction( validOptions, validCallback );
```
