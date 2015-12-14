/* globals require, describe, it */

var assert = require('assert');

var mdh = require('../src/index');

describe('MdHeadline', function () {

	describe('removeFormat()', function() {
		
		var check = function (input, expected, comment) {
			assert.equal(mdh.removeFormat(input), expected, comment);
		};

		it('should remove * emphasis', function() {
			check('ab', 'ab', '1'); //  (00)
			check('*ab', '*ab', '2'); // (00)
			check('a*b', 'a*b', '3'); //  (00)
			check('ab*', 'ab*', '4'); // (00)
			check('**ab', '**ab', '5'); //  (00)
			check('*a*b', 'ab', '6'); // (10)
			check('*ab*', 'ab', '7'); //  (11)
			check('a**b', 'a**b', '8'); // (00)
			check('a*b*', 'ab', '9'); //  (01)
			check('ab**', 'ab**', '10'); // (00)
			check('***ab', '***ab', '11'); //  (00)
			check('**a*b', '**a*b', '12'); // (00)
			check('**ab*', '**ab*', '13'); //  (00)
			check('*a**b', '*a**b', '14'); // (00)
			check('*a*b*', 'ab*', '15'); //  (10)
			check('*ab**', '*ab**', '16'); // (00)
			check('a***b', 'a***b', '17'); //  (00)
			check('a**b*', 'a**b*', '18'); // (00)
			check('a*b**', 'a*b**', '19'); //  (00)
			check('ab***', 'ab***', '20'); // (00)
			check('h*e*a**d**l*i*n*e*', 'headline'); // (01020101)
		});
		it('should remove _ emphasis', function () {
			check('ab', 'ab'); // 00
			check('_ab', '_ab'); // 00
			check('a_b', 'a_b'); // 00
			check('ab_', 'ab_'); // 00
			check('__ab', '__ab'); // 00
			check('_a_b', '_a_b'); // 00
			check('_ab_', 'ab'); // 11
			check('a__b', 'a__b'); // 00
			check('a_b_', 'a_b_'); // 00
			check('ab__', 'ab__'); // 00
			check('___ab', '___ab'); // 00
			check('__a_b', '__a_b'); // 00
			check('__ab_', '__ab_'); // 00
			check('_a__b', '_a__b'); // 00
			check('_a_b_', 'a_b'); // 11
			check('_ab__', '_ab__'); // 00
			check('a___b', 'a___b'); // 00
			check('a__b_', 'a__b_'); // 01
			check('a_b__', 'a_b__'); // 00
			check('ab___', 'ab___'); // 00
			check('_h_e_a__d__l_i_n_e_', 'h_e_a__d__l_i_n_e'); // (00000000)
		});
		it('should remove `code` format', function () {
			check(
				'`Abc` `abc` `abc`',
				'Abc abc abc',
				'did not remove `code` format');
		});
		it('should remove headline attributes', function() {
			check(
				'ABC {#abc a=b}',
				'ABC',
				'did not remove headline attributes');
		});
		it('should remove URL', function () {
			check(
				'ABC<> test<, <http://127.0.0.1/>, < >',
				'ABC<> test<, http://127.0.0.1/, < >',
				'did not remove URL');
		});
		it('should remove URL link', function () {
			check(
				'ABC[](#test) test, [link](http://www....), [ok]()',
				'ABC test, link, ok',
				'did not remove URL link');
		});
		it('should remove internal link', function () {
			check(
				'ABC[][TEST] test [], [link][head line], [Headline][]',
				'ABC test [], link, Headline',
				'did not remove internal link');
		});
		it('should remove implicit internal link', function () {
			check(
				'ABC[] test [Headline], [OK]',
				'ABC[] test Headline, OK',
				'did not remove implicit internal link');
		});

	});
	
	describe('removeAttributes()', function () {
		
		var check = function (input, expected, comment) {
			assert.equal(mdh.removeAttributes(input), expected, comment);
		};
		
		it('should not change a headline without attributes', function () {
			check(
				'ABC `test` <http://127.0.0.1/>',
				'ABC `test` <http://127.0.0.1/>',
				'do not change');
			check(
				'ABC {1, 2} test',
				'ABC {1, 2} test',
				'do not change included curly braces');
		})
		it('should remove an empty attribute list', function () {
			check(
				'Headline {}',
				'Headline',
				'did not remove empty attribute list');
			check(
				'Headline {   }',
				'Headline',
				'did not remove empty attrbibute list with whitespace');
		});
		it('should remove attribute list', function () {
			check(
				'ABC `test` <http://127.0.0.1/> {#c1 .info k=v} ',
				'ABC `test` <http://127.0.0.1/>',
				'did not remove attribute list');
		});
	});

	describe('getAttributes()', function () {
		
		var check = function (input, expected, comment) {
			assert.deepEqual(mdh.getAttributes(input), expected, comment);
		};

		it('should parse headline without attributes', function () {
			check(
				'Headline',
				{},
				'no attributes');
		});
		it ('should parse headline with empty attribute list', function () {
			check(
				'Headline { }',
				{},
				'empty attributes');
		});
		it('should parse id attribute', function () {
			check(
				'Headline { #abc }',
				{ id: 'abc' },
				'id only');
		});
		it('should parse class attributes', function () {
			check(
				'Headline {.class1 .class2}',
				{ classes: ['class1', 'class2'] },
				'classes');
		});
		it('should parse named attributes', function () {
			check(
				'Headline {key1=value1 key2="value 2"}',
				{ key1: 'value1', key2: 'value 2' },
				'key-value-pairs');
		});
		it('should parse a mix of id, classes, kvps', function () {
			check(
				'Headline { key1=value1 .class1  #abc key2="value 2" .class2 }',
				{ id: 'abc', classes: ['class1', 'class2'], key1: 'value1', key2: 'value 2' },
				'mix');
		});

	});

	describe('anchor()', function () {
		
		var check = function (input, expected, comment) {
			assert.equal(mdh.anchor(input), expected, comment);
		};
		
		it('should remove leading non letters', function () {
			check(
				'  headline',
				'headline',
				'leading whitespace');
			check(
				'123 headline',
				'headline',
				'leading numbers');
			check(
				'(1.2): - headline',
				'headline',
				'arbitrary non letters');
		});
		it('should clean characters', function () {
			check(
				'head-:line.|1|#+~*$§(23)@€.',
				'head-line.123.',
				'remove punctuation');
			check(
				'head-line_äöüÄÖÜßÂÅî',
				'head-line_äöüäöüßâåî',
				'keep foreign language letters');
			check(
				'head li\tne',
				'head-li-ne',
				'white spaces');
			check(
				'The First HEADLINE',
				'the-first-headline',
				'lowercase');
		});
		it('should respect lodashes', function () {
			check('ab', 'ab', '1'); // 00
			check('_ab', 'ab', '2'); // 00
			check('a_b', 'a_b', '3'); // 00
			check('ab_', 'ab_', '4'); // 00
			check('__ab', 'ab', '5'); // 00
			check('_a_b', 'a_b', '6'); // 00
			check('_ab_', 'ab', '7'); // 11
			check('a__b', 'a__b', '8'); // 00
			check('a_b_', 'a_b_', '9'); // 00
			check('ab__', 'ab__', '10'); // 00
			check('___ab', 'ab', '11'); // 00
			check('__a_b', 'a_b', '12'); // 00
			check('__ab_', 'ab_', '13'); // 00
			check('_a__b', 'a__b', '14'); // 00
			check('_a_b_', 'a_b', '15'); // 11
			check('_ab__', 'ab__', '16'); // 00
			check('a___b', 'a___b', '17'); // 00
			check('a__b_', 'a__b_', '18'); // 01
			check('a_b__', 'a_b__', '19'); // 00
			check('ab___', 'ab___', '20'); // 00
			check('_h_e_a__d__l_i_n_e_', 'h_e_a__d__l_i_n_e');
		});
		it('should respect dashes', function () {
			check(
				'a-b-c-d-e-f-g-h',
				'a-b-c-d-e-f-g-h');
		});
		it('should remove leading dashes', function () {
			check(
				'-a-b-c_',
				'a-b-c_');
		});
		it('should remove leading lodashes', function () {
			check(
				'_a-b-c-',
				'a-b-c-');
		});
		it('should deal with empty headlines', function () {
			check(
				'',
				'section',
				'empty string');
			check(
				' \t ',
				'section',
				'white spaces with nothing else');
			check(
				'123 + (20)',
				'section',
				'special chars with white spaces');
		});
		it('should respect an id attribute', function () {
			check(
				'Headline {#abc} ',
				'abc');
		});
		
	});

});