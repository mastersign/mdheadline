var XRegExp = require('xregexp');

var removeFormat = function (title) {
	if (!title) return '';
	title = title.replace(/(^|[^\*])\*{2}([^\*]+?)\*{2}([^\*])/g, '$1$2$3');
	title = title.replace(/(^|[^\*])\*{2}([^\*]+?)\*{2}$/g, '$1$2');
	title = title.replace(/(^|[^\*])\*([^\*]+?)\*([^\*])/g, '$1$2$3');
	title = title.replace(/(^|[^\*])\*([^\*]+?)\*$/g, '$1$2');
	title = title.replace(/(^|[^\w_])__([^_].+[^_]|[^_]{1,2})__([^\w_])/g, '$1$2$3');
	title = title.replace(/(^|[^\w_])__([^_].+[^_]|[^_]{1,2})__$/g, '$1$2');
	title = title.replace(/(^|[^\w_])_([^_].+[^_]|[^_]{1,2})_([^\w_])/g, '$1$2$3');
	title = title.replace(/(^|[^\w_])_([^_].+[^_]|[^_]{1,2})_$/g, '$1$2');
	title = title.replace(/`(.*?)`/g, '$1');
	title = title.replace(/\s*\{[^\}]*\}$/g, '');
	title = title.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1');
	title = title.replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1');
	title = title.replace(/\[([^\]]+)\]/g, '$1');
	title = title.replace(/<([^\s>]+)>/g, '$1');
	return title;
};
module.exports.removeFormat = removeFormat;

var getAttributes = function (title) {
	var attribPattern = /\s\{((?:[^\}]|\"[^\"]*\")*)\}\s*$/;
	var idPattern = /(?:^|\s)#([\w-\:\.]+)/;
	var classPattern = /(?:^|\s)\.(\w+)/g;
	var keyValPattern = /(?:^|\s)(\w+)=(?:\"([^\"]*)\"|(\w+))/g;
	var attribMatch = attribPattern.exec(title);
	var attribString, idMatch, classMatch, keyValMatch;
	var result = {};
	if (attribMatch) {
		attribString = attribMatch[1];
		idMatch = idPattern.exec(attribString);
		if (idMatch) {
			result.id = idMatch[1];
		}
		classMatch = classPattern.exec(attribString);
		while(classMatch) {
			if (!result.classes) { result.classes = []; }
			result.classes.push(classMatch[1]);
			classMatch = classPattern.exec(attribString);
		}
		keyValMatch = keyValPattern.exec(attribString);
		while(keyValMatch) {
			result[keyValMatch[1]] = keyValMatch[2] || keyValMatch[3];
			keyValMatch = keyValPattern.exec(attribString);
		}
	}
	return result;
};
module.exports.getAttributes = getAttributes;

var removeAttributes = function (title) {
	var attribPattern = /^(.*)\s\{((?:[^\}]|\"[^\"]*\")*)\}\s*$/;
	var attribMatch = attribPattern.exec(title);
	if (attribMatch) {
		return attribMatch[1];
	}
	return title;
};
module.exports.removeAttributes = removeAttributes;

/*
Remove all formatting, links, etc.
Remove all footnotes.
Remove all punctuation, except underscores, hyphens, and periods.
Replace all spaces and newlines with hyphens.
Convert all alphabetic characters to lowercase.
Remove everything up to the first letter (identifiers may not begin with a number or punctuation mark).
If nothing is left after this, use the identifier 'section'.
*/

var anchor = function (title, cache) {
	var id = getAttributes(title).id;
	if (id) return id;
	title = removeFormat(title);
	title = title.replace(XRegExp('^[^\\p{L}]+', 'g'), '');
	title = title.trim();
	title = title.replace(/\s/g, '-');
	title = title.replace(/^[-_]+/g, '');
	title = title.replace(XRegExp('[^\\p{L}\\d-_\\.]', 'g'), '');
	title = title.toLowerCase();
	if (title === '') {	title = 'section'; }
	return title;
};
module.exports.anchor = anchor;
