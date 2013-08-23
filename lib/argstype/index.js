'use strict';

var types = {
	s: 'string',
	o: 'object',
	b: 'boolean',
	n: 'number',
	a: 'array',
	f: 'function'
};

var simpleTypes = ['s', 'o', 'b', 'n', 'f'];



function checkArguments( args, rules, errorConstructor ) {
	var required;
	var of;
	var keys;
	var i, node, queue = [];

	// throw exception if callback required
	if ( rules[rules.length - 1][0] === 'callback' && rules[rules.length - 1][1] && typeof args[rules.length - 1] !== types.f ) {
		throw errorConstructor( '`' + rules[rules.length - 1][0] + '` required' );
	}

	if ( !Array.isArray( rules ) ) { return errorConstructor( 'Inner error - bad type check rules: ' + JSON.stringify( rules ) );}

	for ( i = 0; i < rules.length; i += 1 ) {
		if ( !Array.isArray( rules[i] ) ) { return errorConstructor( 'Inner error - bad type check rules: ' + JSON.stringify( rules ) );}

		queue.push( {
			element: args[i],
			name: rules[i][0],
			required: rules[i][1],
			type: rules[i][2],
			of: rules[i][3]
		} );
	}

	while ( queue.length > 0 ) {
		node = queue.shift();

		if ( node.element === undefined ) {
			// check required
			if ( node.required ) {
				return (errorConstructor( '`' + node.name + '` required' ));
			}
		} else {
			// check types
			if ( types[node.type] === undefined ) {
				return errorConstructor( 'Inner error - bad type check rules: ' + JSON.stringify( rules ) );
			}

			if ( (
				simpleTypes.indexOf( node.type ) !== -1 && typeof node.element !== types[node.type] ) || (
				node.type === 'a' && !Array.isArray( node.element )
				) ) {
				return errorConstructor( '`' + node.name + '` must be a ' + types[node.type] );
			}

			// add new tasks
			if ( (node.type === 'o' || node.type === 'a') && node.of !== undefined ) {
				of = node.of;

				if ( typeof node.of === 'string' ) {
					of = ['*', true, node.of];
				}

				// if required - force queue push
				required = (node.element.length === 0) && (of[1] === true);

				// create rule for every sub-element
				if ( of[0] === '*' ) {
					keys = Object.keys( node.element );
					for ( i = 0; i < keys.length || required; i += 1 ) {
						queue.push( {
							element: (node.type === 'o') ? node.element[keys[i]] : node.element[i],
							name: (node.type === 'o') ? (node.name + '.' + keys[i]) : (node.name + '.' + i),
							required: of[1],
							type: of[2],
							of: of[3]
						} );
					}

				} else { // create rule for every sub-element by name/position
					for ( i = of.length - 1; i >= 0; i -= 1 ) {
						if ( !Array.isArray( of[i] ) ) { return errorConstructor( 'Inner error - bad type check rules, must be an array of arrays: ' + JSON.stringify( rules ) );}

						queue.push( {
							element: (node.type === 'o') ? node.element[ of[i][0] ] : node.element[ i ],
							name: (node.type === 'o') ? (node.name + '.' + of[i][0]) : (node.name + '.' + i),
							required: of[i][1],
							type: of[i][2],
							of: of[i][3]
						} );
					}
				}
			}
		}
	}

	return false;
}



function getChecker( err, rules ) {
	return function( args ) {
		return checkArguments( args, rules, err );
	};
}



module.exports = {
	getChecker: getChecker,
	check: checkArguments
};
