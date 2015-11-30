/* globals require, describe, it */

var assert = require('assert');

var mdh = require('../src/index');

describe('MdHeadline', function () {

	describe('removeFormat()', function() {

		it('should remove * emphasis', function() {
			assert.equal(mdh.removeFormat(
				'*Abc* **abc** abc *abc*'),
				'Abc abc abc abc',
				'did not remove * emphasis');
		});
		it('should remove _ emphsis', function () {
			assert.equal(mdh.removeFormat(
				'__Abc___abc_ _abc_ abc'),
				'Abcabc abc abc',
				'did not remove _ emphasis');
		});
		it('should remove `code` format', function () {
			assert.equal(mdh.removeFormat(
				'`Abc` `abc` `abc`'),
				'Abc abc abc',
				'did not remove `code` format');
		});
		it('should remove headline attributes', function() {
			assert.equal(mdh.removeFormat(
				'ABC {#abc a=b}'),
				'ABC',
				'did not remove headline attributes');
		});
		it('should remove URL', function () {
			assert.equal(mdh.removeFormat(
				'ABC<> test<, <http://127.0.0.1/>, < >'),
				'ABC<> test<, http://127.0.0.1/, < >',
				'did not remove URL');
		});
		it('should remove URL link', function () {
			assert.equal(mdh.removeFormat(
				'ABC[](#test) test, [link](http://www....), [ok]()'),
				'ABC test, link, ok',
				'did not remove URL link');
		});
		it('should remove internal link', function () {
			assert.equal(mdh.removeFormat(
				'ABC[][TEST] test [], [link][head line], [Headline][]'),
				'ABC test [], link, Headline',
				'did not remove internal link');
		});
		it('should remove implicit internal link', function () {
			assert.equal(mdh.removeFormat(
				'ABC[] test [Headline], [OK]'),
				'ABC[] test Headline, OK',
				'did not remove implicit internal link');
		});

	});

	describe('getAttributes()', function () {

		it('should parse headline without attributes', function() {
			assert.deepEqual(mdh.getAttributes(
				'Headline'),
				{},
				'no attributes');
		});
		it ('should parse headline with empty attribute list', function () {
			assert.deepEqual(mdh.getAttributes(
				'Headline { }'),
				{},
				'empty attributes');
		});
		it('should parse id attribute', function () {
			assert.deepEqual(mdh.getAttributes(
				'Headline { #abc }'),
				{ id: 'abc' },
				'id only');
		});
		it('should parse class attributes', function () {
			assert.deepEqual(mdh.getAttributes(
				'Headline {.class1 .class2}'),
				{ classes: ['class1', 'class2'] },
				'classes');
		});
		it('should parse named attributes', function () {
			assert.deepEqual(mdh.getAttributes(
				'Headline {key1=value1 key2="value 2"}'),
				{ key1: 'value1', key2: 'value 2' },
				'key-value-pairs');
		});
		it('should parse a mix of id, classes, kvps', function () {
			assert.deepEqual(mdh.getAttributes(
				'Headline { key1=value1 .class1  #abc key2="value 2" .class2 }'),
				{ id: 'abc', classes: ['class1', 'class2'], key1: 'value1', key2: 'value 2' },
				'mix');
		});

	});

	describe('anchor()', function () {
		
		it('should remove leading non letters', function () {
			assert.equal(mdh.anchor(
				'  headline'),
				'headline',
				'leading whitespace');
			assert.equal(mdh.anchor(
				'123 headline'),
				'headline',
				'leading numbers');
			assert.equal(mdh.anchor(
				'(1.2): - headline'),
				'headline',
				'arbitrary non letters');
		});
		it('should clean characters', function () {
			assert.equal(mdh.anchor(
				'head-:line.|1|#+~*$§(23)@€.'),
				'head-line.123.',
				'remove punctuation');
			assert.equal(mdh.anchor(
				'head-line_äöüÄÖÜßÂÅî'),
				'head-line_äöüäöüßâåî',
				'keep foreign language letters');
			assert.equal(mdh.anchor(
				'head li\tne'),
				'head-li-ne',
				'white spaces');
			assert.equal(mdh.anchor(
				'The First HEADLINE'),
				'the-first-headline',
				'lowercase');
		});
		it('should deal with empty headlines', function () {
			assert.equal(mdh.anchor(
				''),
				'section',
				'empty string');
			assert.equal(mdh.anchor(
				' \t '),
				'section',
				'white spaces with nothing else');
			assert.equal(mdh.anchor(
				'123 + (20)'),
				'section',
				'special chars with white spaces');
		});
		it('should respect an id attribute', function () {
			assert.equal(mdh.anchor(
				'Headline {#abc} '),
				'abc',
				'id in headline attributes');
		});
		
	});

});