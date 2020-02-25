#! /usr/bin/env node

"use strict";

const Conf = require('conf');

const keys = [
	'editor',
	'preview',
	'language',
];

module.exports = class ConfigActions {
	constructor() {
		this.config = new Conf({
			projectName: 'wct',
			defaults: {
				editor: 'BBEdit',
				preview: 'Marked',
				language: 'markdown',
			}
		});
	}

	get(key) {
		return this.config.get(key);
	}

	set(key, value) {
		if (keys.includes(key) === false) {
			throw 'Invalid key: ${key}';
		}

		// Protect empty value
		if (!value) {
			value = '';
		}

		this.config.set(key, value);
	}

	list() {
		const result = keys.map(key => {
			const value = this.get(key);
			return `${key}: ${value}`;
		});
		return result;
	}
}
