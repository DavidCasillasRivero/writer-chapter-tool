"use strict";

const fs = require('fs');

const SRC_FOLDER = 'src';
const BASE_FOLDER = '.';
const IMAGES_FOLDER = 'images';
const BUILD_FOLDER = 'build';
const FILE_EXTENSION = 'md';

module.exports = class Tools {

    constructor(fs) {
        this.fs = fs;
        this.SRC_FOLDER = 'src';
		this.BASE_FOLDER = '.';
		this.IMAGES_FOLDER = 'images';
		this.BUILD_FOLDER = 'build';
		this.FILE_EXTENSION = 'md';
		this.BUILD_FILE = 'build.' + this.FILE_EXTENSION;
    }

	/**
	* Calling this mothod ensures that the work folder has the required folder structure.
	*/
    checkFolders() {
        const existsSrc = this.fs
            .readdirSync(BASE_FOLDER, { withFileTypes: true })
            .some(item => item.isDirectory() === true && item.name === SRC_FOLDER);
        if (existsSrc === false) {
            this.fs.mkdirSync(this.buildPath([SRC_FOLDER]));
        }

        const existsImages = this.fs
            .readdirSync(this.buildPath([SRC_FOLDER]), { withFileTypes: true })
            .some(item => item.isDirectory() && item.name === IMAGES_FOLDER);
        if (existsImages === false) {
            this.fs.mkdirSync(this.buildPath([SRC_FOLDER, IMAGES_FOLDER]));
        }
    }

	/**
	* Calling this method ensures thar the build folder exists
	*/
	checkBuildFolder() {
		this.fs.mkdirSync(this.buildPath([BUILD_FOLDER]), {recursive: true});
	}

    /**
    * List of all chapter file names
    */
    getChapterFiles() {
        const files = this.fs
            .readdirSync(this.buildPath([SRC_FOLDER]), { withFileTypes: true })
            .filter(item => item.isFile() && item.name.split('.').pop() === FILE_EXTENSION);
        return files;
    }

    /**
    * List of all chapter file relative paths
    */
    getChapterFilePaths() {
        const files = this.getChapterFiles()
            .map(item => this.buildChapterFilePath(item.name));
        return files;
    }

    /**
    * The chapter relative path for a given chapter number
    */
    getChapterFilePath(chapterNumber) {
        const file = this.getChapterFiles()
            .find(item => item.name.substring(0,2) === this.padChapter(chapterNumber));
        const result = file ? this.buildChapterFilePath(file.name) : null;
        return result;
    }

    /**
    * Relative path of the images folders
    */
    getImagesFolders() {
        const folders = this.fs
            .readdirSync(this.buildPath([SRC_FOLDER, IMAGES_FOLDER]), { withFileTypes: true })
            .filter(item => item.isDirectory());
        return folders;
    }

    /**
    * List of all file names in the images folder for a given chapter number
    */
    getChapterImagesFiles(chapterNumber) {
        const folderName = this.buildChapterImagesPath(chapterNumber);
        return this.fs.readdirSync(folderName, { withFileTypes: true })
            .filter(item => item.isFile() === true);
    }

    /**
    * Total number of chapters in the book
    */
    chaptersCount() {
        const imagesFolders = this.getImagesFolders().length;
        return imagesFolders || 0;
    }

    /**
    * Convert an integer into a two digit string with 0 padding
    */
    padChapter(chapterNumber) {
        return parseInt(chapterNumber) <= 9 ? `0${chapterNumber}` : chapterNumber.toString();
    }

    /**
    * Builds a relative path prepending all given path segments with the base path of the project
    */
    buildPath(parts) {
        const x = [
            BASE_FOLDER,
            ...parts,
        ];
        return x.join('/');
    }

    /**
    * Builds the file name for a chapter given its number and a title
    */
    buildChapterFileName(chapterIndex, title) {
        return this.padChapter(chapterIndex) + '-' + title + '.' + FILE_EXTENSION;
    }

    /**
    * Builds the file path for a chapter given its file name
    */
    buildChapterFilePath(fileName) {
        return this.buildPath([SRC_FOLDER, fileName]);
    }

    /**
    * Builds the file path for a chapter given its chapter number
    */
    buildChapterFilePathWithIndex(chapterIndex, title) {
        return this.buildChapterFilePath(this.buildChapterFileName(chapterIndex, title));
    }

    /**
    * Builds the images path for a chapter given its number
    */
    buildChapterImagesPath(chapterIndex) {
        return this.buildPath([SRC_FOLDER, IMAGES_FOLDER, this.padChapter(chapterIndex)]);
    }

    /**
    * Builds a chapter file name by changing the chapter number of an existing file name
    */
    changeChapterFileIndex(fileName, newIndex) {
        return this.padChapter(newIndex) + fileName.substring(2);
    }
}
