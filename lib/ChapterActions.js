#! /usr/bin/env node

"use strict";

var exec = require('child_process').exec;
var ConfigActions = require('./ConfigActions.js');

module.exports = class ChapterActions {

    constructor(tools, fs) {
        this.tools = tools;
        this.fs = fs;
    }

    /**
    * Creates a new chapter.
    */
    createChapter(title) {
    	// New chapter will be always the last chapter
        const chapterIndex = this.tools.chaptersCount();

        // create markdown file
        const filePath = this.tools.buildChapterFilePathWithIndex(chapterIndex, title);
        // The file will have the title of the chapter as a Markdown level 2 header
        const content = `## ${title}`;
        this.fs.writeFileSync(filePath, content);

        // create images folder
        const folderName = this.tools.buildChapterImagesPath(chapterIndex);
        this.fs.mkdirSync(folderName);
    }

    /**
    * Moves a chapter to a new position renumbering the rest chapters
    */
    moveChapter(from, to) {
        const files = this.tools.getChapterFiles();

        const start = Math.min(from, to);
        const end = Math.max(from, to);
        const factor = from < to ? -1 : 1;

        // Rename files
        for (let i = start; i <= end; i++) {
            // Old file path
            const filePath = this.tools.buildChapterFilePath(files[i].name);
            // New file path
            const newIndex = i === from ? to : i + factor;
            let newPath = this.tools.buildChapterFilePath(this.tools.changeChapterFileIndex(files[i].name, newIndex));

            this.fs.renameSync(filePath, newPath);
        }

        // Rename image folders

        // Avoid overwriting a folder
        this.fs.renameSync(this.tools.buildChapterImagesPath(from), this.tools.buildChapterImagesPath(from) + 'x');

        if (from < to) {
            for (let i = start; i <= end; i++) {
                if (i === from) {
                    continue;
                }
                this.fs.renameSync(this.tools.buildChapterImagesPath(i), this.tools.buildChapterImagesPath(i - 1));
            }
        } else {
            for (let i = end; i >= start; i--) {
                if (i === from) {
                    continue;
                }
                this.fs.renameSync(this.tools.buildChapterImagesPath(i), this.tools.buildChapterImagesPath(i + 1));
            }
        }

        this.fs.renameSync(this.tools.buildChapterImagesPath(from) + 'x', this.tools.buildChapterImagesPath(to));
    }

    /**
    * Deletes a chapter and renumbers the rest chapters.
    */
    deleteChapter(index) {
        const lastIndex = this.tools.chaptersCount() - 1;

        // Move chapter to delete to last position to reindex remaining chapters
        if (index !== lastIndex) {
            this.moveChapter(index, lastIndex);
        }

        // Delete file
        const files = this.tools.getChapterFiles();
        const fileName = files[lastIndex].name;
        this.fs.unlinkSync(this.tools.buildChapterFilePath(files[lastIndex].name));

        // Delete folder contents
        const imageFiles = this.tools.getChapterImagesFiles(lastIndex);
        const folderName = this.tools.buildChapterImagesPath(lastIndex) + '/';
        imageFiles.forEach(file => {
            this.fs.unlinkSync(folderName + file.name);
        });
        this.fs.rmdirSync(folderName);
    }

    /**
    * List all chapters
    */
    listChapters() {
        const files = this.tools.getChapterFiles();
        files.forEach(function(file) {
            // Remove file extension from chapter title
            const chapterTitle = file.name.substr(0, file.name.length - 3);
            console.log(chapterTitle);
        });
    }

    /**
    * Rename chapter
    */
    renameChapter(index, newTitle) {
        const oldFilePath = this.tools.getChapterFilePath(index);
        const newFilePath = this.tools.buildChapterFilePathWithIndex(index, newTitle);

        this.fs.renameSync(oldFilePath, newFilePath);
    }

    /**
    * Opens a chapter to be edited using BBedit and previews in Marked
    */
    openChapter(index) {
    	const configActions = new ConfigActions();
        const chapters = this.tools.getChapterFiles();
        const file = `src/${chapters[index].name}`;

        const editor = configActions.get('editor');
        exec(`open -a ${editor} ${file}`);

        const preview = configActions.get('preview');
        if (preview) {
	        exec(`open -a ${preview} ${file}`);
        }
    }
}
