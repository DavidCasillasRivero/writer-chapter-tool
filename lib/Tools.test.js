"use strict";

const fs = require('fs');
const Tools = require('./Tools.js');

let fsMock = null;
let sut = null;

beforeEach(() => {
    fsMock = fs;
    sut = null;
});

describe('checkFolders', () => {

	test('does nothing if folders are ok', () => {
		fsMock = {
			readdirSync: jest.fn()
				.mockReturnValueOnce([
					{ isDirectory: () => true, isFile: () => false, name: 'src' },
				])
				.mockReturnValueOnce([
					{ isDirectory: () => true, isFile: () => false, name: 'images' },
				]),
			mkdirSync: jest.fn(),
		};

        sut = new Tools(fsMock);
		const result = sut.checkFolders();
		expect(fsMock.readdirSync).toHaveBeenNthCalledWith(1, '.', { withFileTypes: true });
		expect(fsMock.readdirSync).toHaveBeenNthCalledWith(2, './src', { withFileTypes: true });
		expect(fsMock.mkdirSync).not.toHaveBeenCalled();
	})


	test('creates images folder if missing', () => {
		fsMock = {
			readdirSync: jest.fn()
				.mockReturnValueOnce([
					{ isDirectory: () => true, isFile: () => false, name: 'src' },
				])
				.mockReturnValueOnce([
				]),
			mkdirSync: jest.fn(),
		};

        sut = new Tools(fsMock);
		const result = sut.checkFolders();
		expect(fsMock.readdirSync).toHaveBeenNthCalledWith(1, '.', { withFileTypes: true });
		expect(fsMock.readdirSync).toHaveBeenNthCalledWith(2, './src', { withFileTypes: true });
		expect(fsMock.mkdirSync).toHaveBeenCalledWith('./src/images');
	})

	test('creates src and images folder if missing', () => {
		fsMock = {
			readdirSync: jest.fn()
				.mockReturnValueOnce([
				])
				.mockReturnValueOnce([
				]),
			mkdirSync: jest.fn(),
		};

        sut = new Tools(fsMock);
		const result = sut.checkFolders();
		expect(fsMock.readdirSync).toHaveBeenNthCalledWith(1, '.', { withFileTypes: true });
		expect(fsMock.readdirSync).toHaveBeenNthCalledWith(2, './src', { withFileTypes: true });
		expect(fsMock.mkdirSync).toHaveBeenNthCalledWith(1, './src');
		expect(fsMock.mkdirSync).toHaveBeenNthCalledWith(2, './src/images');
	})
})

describe('getChapterFiles()', () => {

	test('calls fs with valid params and returns empty if empty folder', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getChapterFiles();
		expect(fsMock.readdirSync).toHaveBeenCalledWith('./src', { withFileTypes: true });
		expect(result).toStrictEqual([]);
	})

	test('filters out folders and non markdown files', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [
					{ isDirectory: () => true, isFile: () => false, name: 'folder' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.md' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.txt' },
				];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getChapterFiles();
		expect(result).toHaveLength(1);
	})
})

describe('getChapterFilePaths()', () => {

	test('gets valid path and filters out folders and non markdown files', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [
					{ isDirectory: () => true, isFile: () => false, name: 'folder' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.md' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.txt' },
				];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getChapterFilePaths();
		expect(result).toStrictEqual([
			'./src/dummy.md',
		]);
	})
})

describe('getChapterFilePath()', () => {

	test('gets the valid chapter path', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [
					{ isDirectory: () => true, isFile: () => false, name: 'folder' },
					{ isDirectory: () => false, isFile: () => true, name: '01-dummy.md' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.txt' },
				];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getChapterFilePath(1);
		expect(result).toBe('./src/01-dummy.md');
	})

	test('returns null if no chapter matches', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [
					{ isDirectory: () => true, isFile: () => false, name: 'folder' },
					{ isDirectory: () => false, isFile: () => true, name: '01-dummy.md' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.txt' },
				];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getChapterFilePath(0);
		expect(result).toBe(null);
	})
})

describe('getImagesFolders()', () => {

	test('calls fs with valid params and returns empty if empty folder', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getImagesFolders();
		expect(fsMock.readdirSync).toHaveBeenCalledWith('./src/images', { withFileTypes: true });
		expect(result).toStrictEqual([]);
	})

	test('filters out files', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [
					{ isDirectory: () => true, isFile: () => false, name: 'folder' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.md' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.txt' },
				];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getImagesFolders();
		expect(result).toHaveLength(1);
	})
})

describe('getChapterImagesFiles()', () => {

	test('calls fs with valid params and returns empty if empty folder', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getChapterImagesFiles(1);
		expect(fsMock.readdirSync).toHaveBeenCalledWith('./src/images/01', { withFileTypes: true });
		expect(result).toStrictEqual([]);
	})

	test('filters out files', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [
					{ isDirectory: () => true, isFile: () => false, name: 'folder' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.md' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.txt' },
				];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.getChapterImagesFiles(1);
		expect(result).toHaveLength(2);
	})
})

describe('chaptersCount()', () => {


	test('returns 0 if empty folder', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.chaptersCount();
		expect(result).toBe(0);
	})

	test('filters out folders and non markdown files', () => {
		fsMock = {
			readdirSync: jest.fn(() => {
				return [
					{ isDirectory: () => true, isFile: () => false, name: 'folder' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.md' },
					{ isDirectory: () => false, isFile: () => true, name: 'dummy.txt' },
				];
			})
		};

        sut = new Tools(fsMock);
		const result = sut.chaptersCount();
		expect(result).toBe(1);
	})
})

describe('buildPath()', () => {

	test('builds a path with one component', () => {
        sut = new Tools(fsMock);
		const result = sut.buildPath(['src']);
		expect(result).toBe('./src');
	})

	test('builds a path with many components', () => {
        sut = new Tools(fsMock);
		const result = sut.buildPath(['src', 'images', '00', 'dummy.png']);
		expect(result).toBe('./src/images/00/dummy.png');
	})
})

describe('padChapter()', () => {

	test('one digit number is padded as 0X', () => {
        sut = new Tools(fsMock);
		const result = sut.padChapter(9);
		expect(result).toBe('09');
	})

	test('two digit number remains equal', () => {
        sut = new Tools(fsMock);
		const result = sut.padChapter(99);
		expect(result).toBe('99');
	})
})

describe('buildChapterFileName()', () => {

	test('buids a file name with a chapter number and a title', () => {
        sut = new Tools(fsMock);
		const result = sut.buildChapterFileName(0, 'This is the title.');
		expect(result).toBe('00-This is the title..md');
	})
})

describe('buildChapterFilePath()', () => {

	test('buids a file path with a file name', () => {
        sut = new Tools(fsMock);
		const result = sut.buildChapterFilePath('00-This is the title.md');
		expect(result).toBe('./src/00-This is the title.md');
	})
})

describe('buildChapterFilePathWithIndex()', () => {

	test('buids a file path with a chapter number and a title', () => {
        sut = new Tools(fsMock);
		const result = sut.buildChapterFilePathWithIndex(99, 'This is the title');
		expect(result).toBe('./src/99-This is the title.md');
	})
})

describe('buildChapterImagesPath()', () => {
	test('buids a images folder path for a chapter', () => {
        sut = new Tools(fsMock);
		const result = sut.buildChapterImagesPath(0);
		expect(result).toBe('./src/images/00');
	})
})

describe('changeChapterFileIndex()', () => {

	test('builds a chapter file name susbtituting the chapter number', () => {
        sut = new Tools(fsMock);
		const result = sut.changeChapterFileIndex('00-This is the title.md', 1);
		expect(result).toBe('01-This is the title.md')
	})
})
