#! /usr/bin/env node

"use strict";

var exec = require('child_process').exec;
var ConfigActions = require('./ConfigActions.js');

module.exports = class BookActions {

    constructor(tools) {
        this.tools = tools;
    }

    /**
    * Compiles the book and opens in preview
    */
    compile() {
        const buildFile = this.tools.buildPath([this.tools.BUILD_FOLDER, this.tools.BUILD_FILE]);

		// Make sure build folder exists
		this.tools.checkBuildFolder();
		// Concat all source md files adding newlines between files
		const ext = this.tools.FILE_EXTENSION;
		const srcPath = this.tools.buildPath([this.tools.SRC_FOLDER, `*.${ext}`]);
		exec(`awk 1 ${srcPath} > ${buildFile}`);
		// Copy images to dist folder
		const srcImagesPath = this.tools.buildPath([this.tools.SRC_FOLDER, this.tools.IMAGES_FOLDER]);
		const buildImagesPath = this.tools.buildPath([this.tools.BUILD_FOLDER, this.tools.IMAGES_FOLDER]);
		exec(`cp -r ${srcImagesPath}/ ${buildImagesPath}/`);
		// Preview result
		const configActions = new ConfigActions();
        const preview = configActions.get('preview');
        if (preview) {
	        exec(`open -a ${preview} ${buildFile}`);
        }
    }
}
