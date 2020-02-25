#! /usr/bin/env node

const INDEX_TOOL = 1;
const INDEX_COMMAND = 2;

const fs = require('fs');
const Tools = require('../lib/Tools.js');
const ChapterActions = require('../lib/ChapterActions.js');
const BookActions = require('../lib/BookActions.js');
const ConfigActions = require('../lib/ConfigActions.js');

const tools = new Tools(fs);
const chapterActions = new ChapterActions(tools, fs);
const configActions = new ConfigActions();
const bookActions = new BookActions(tools);

const command = process.argv[INDEX_COMMAND];

// Make sure folders exists
tools.checkFolders();

switch(command) {
	case 'help':
		const commands = [
			'CHAPTER COMMANDS',
			'- wct chapter-create <chapter_title>',
			'- wct chapter-move <old_chapter_number> <new_chapter_number>',
			'- wct chapter-delete <chapter_number>',
			'- wct chapter-edit <chapter_number>',
			'- wct chapter-rename <chapter_number> <new_title>',
			'- wct chapter-list',
			'BOOK COMMANDS',
			'- wct book-compile',
			'CONFIG COMMANDS',
			'- wct config-list',
			'- wct config-set <property> <value>',
			'HELP COMMANDS',
			'- wct help',
		].join('\n');
		console.log(commands);
		break;

	case 'chapter-create':
	case 'cc':
		const chapterTitle = process.argv[3];
		chapterActions.createChapter(chapterTitle);
		break;
	case 'chapter-move':
	case 'cm':
		const from = parseInt(process.argv[3]);
		const to = parseInt(process.argv[4]);
		chapterActions.moveChapter(from, to);
		break;
	case 'chapter-delete':
	case 'cd':
		index = parseInt(process.argv[3]);
		chapterActions.deleteChapter(index);
		break;
	case 'chapter-edit':
	case 'ce':
		index = parseInt(process.argv[3]);
		chapterActions.openChapter(index);
		break;
	case 'chapter-list':
	case 'cl':
		chapterActions.listChapters();
		break;
	case 'chapter-rename':
	case 'cr':
		index = parseInt(process.argv[3]);
		newTitle = process.argv[4];
		chapterActions.renameChapter(index, newTitle);
		break;

	case 'book-compile':
	case 'bc':
		bookActions.compile();
		break;

	case 'config-list':
		configActions.list().forEach(item => console.log(item));
		break;
	case 'config-set':
		const key = process.argv[3];
		const value = process.argv[4];
		configActions.set(key, value);
		break;

	default:
		console.log('Invalid command');
		break;
}
