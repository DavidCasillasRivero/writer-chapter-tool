"use strict";

const fs = require('fs');
const Tools = require('../lib/Tools.js');

const ChapterActions = require('./ChapterActions.js');

let fsMock = null;
let toolsMock = null;
let sut = null;

beforeEach(() => {
    fsMock = fs;
    toolsMock = new Tools(fsMock);
    sut = null;
});

describe('createChapter', () => {

	test('creates file and images folder with valid number and title', () => {
		toolsMock.chaptersCount = jest.fn(() => 1);
		fsMock.writeFileSync = jest.fn(() => null);
		fsMock.mkdirSync = jest.fn(() => null);
        sut = new ChapterActions(toolsMock, fsMock);

		const result = sut.createChapter('Dummy');
		expect(fsMock.writeFileSync).toHaveBeenCalledWith('./src/01-Dummy.md', '## Dummy');
		expect(fsMock.mkdirSync).toHaveBeenCalledWith('./src/images/01');
	})

})

describe('moveChapter()', () => {

	test('moves chapter to higher position', () => {
		toolsMock.getChapterFiles = jest.fn(() => [
			createFile('00-Chapter0.md', true),
			createFile('01-Chapter1.md', true),
			createFile('02-Chapter2.md', true),
			createFile('03-Chapter3.md', true),
			createFile('04-Chapter4.md', true),
		]);
		fsMock.renameSync = jest.fn();
        sut = new ChapterActions(toolsMock, fsMock);

		sut.moveChapter(1, 3);
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(1, './src/01-Chapter1.md', './src/03-Chapter1.md');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(2, './src/02-Chapter2.md', './src/01-Chapter2.md');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(3, './src/03-Chapter3.md', './src/02-Chapter3.md');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(4, './src/images/01', './src/images/01x');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(5, './src/images/02', './src/images/01');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(6, './src/images/03', './src/images/02');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(7, './src/images/01x', './src/images/03');
	})

	test('moves chapter to a lower position', () => {
		toolsMock.getChapterFiles = jest.fn(() => [
			createFile('00-Chapter0.md', true),
			createFile('01-Chapter1.md', true),
			createFile('02-Chapter2.md', true),
			createFile('03-Chapter3.md', true),
			createFile('04-Chapter4.md', true),
		]);
		fsMock.renameSync = jest.fn();
        sut = new ChapterActions(toolsMock, fsMock);

		sut.moveChapter(3, 1);
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(1, './src/01-Chapter1.md', './src/02-Chapter1.md');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(2, './src/02-Chapter2.md', './src/03-Chapter2.md');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(3, './src/03-Chapter3.md', './src/01-Chapter3.md');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(4, './src/images/03', './src/images/03x');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(5, './src/images/02', './src/images/03');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(6, './src/images/01', './src/images/02');
		expect(fsMock.renameSync).toHaveBeenNthCalledWith(7, './src/images/03x', './src/images/01');
	})
})

describe('deleteChapter()', () => {

    test('deletes a chapter in the middle position', () => {
        toolsMock.chaptersCount = jest.fn(() => 5);
        // This is the call after the move has been made
		toolsMock.getChapterFiles = jest.fn(() => [
			createFile('00-Chapter0.md', true),
			createFile('01-Chapter1.md', true),
			createFile('02-Chapter2.md', true),
			createFile('03-Chapter3.md', true),
			createFile('04-Chapter4.md', true),
		]);
		toolsMock.getChapterImagesFiles = jest.fn(() => [
			createFile('image1.jpg', true),
			createFile('image2.jpg', true),
		]);
		fsMock.unlinkSync = jest.fn();
		fsMock.rmdirSync = jest.fn();
        sut = new ChapterActions(toolsMock, fsMock);
        sut.moveChapter = jest.fn(() => {});

        sut.deleteChapter(3);
        expect(sut.moveChapter).toHaveBeenCalledWith(3, 4);
        expect(fsMock.unlinkSync).toHaveBeenNthCalledWith(1, './src/04-Chapter4.md');
        expect(fsMock.unlinkSync).toHaveBeenNthCalledWith(2, './src/images/04/image1.jpg');
        expect(fsMock.unlinkSync).toHaveBeenNthCalledWith(3, './src/images/04/image2.jpg');
        expect(fsMock.rmdirSync).toHaveBeenCalledWith('./src/images/04/');
    });
});

describe('listChapters()', () => {
    test('List 3 chapters', () => {
		toolsMock.getChapterFiles = jest.fn(() => [
			createFile('00-Chapter0.md', true),
			createFile('01-Chapter1.md', true),
			createFile('02-Chapter2.md', true),
        ]);
        global.console = {
            log: jest.fn(),
        }

        sut = new ChapterActions(toolsMock, fsMock);
        sut.listChapters();
        expect(global.console.log).toHaveBeenNthCalledWith(1, '00-Chapter0');
        expect(global.console.log).toHaveBeenNthCalledWith(2, '01-Chapter1');
        expect(global.console.log).toHaveBeenNthCalledWith(3, '02-Chapter2');
    });
});

describe('renameChapter()', () => {
    test('change chapter name', () => {
        toolsMock.getChapterFiles = jest.fn(() => [
			createFile('00-Chapter0.md', true),
			createFile('01-Chapter1.md', true),
			createFile('02-Chapter2.md', true),
        ]);
        fsMock.renameSync = jest.fn();

        sut = new ChapterActions(toolsMock, fsMock);
        sut.renameChapter(1, 'Modified');
        expect(fsMock.renameSync).toHaveBeenCalledWith('./src/01-Chapter1.md', './src/01-Modified.md');

    });
});

function createFile(name, isFile) {
	return {
		name: name,
		isFile: isFile,
		isDirectory: !isFile,
	}
}
