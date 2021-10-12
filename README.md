# writer-chapter-tool

Command line utility to manage a lightweight markup writing (markdown for example) split in chapter files.

## Prerrequisites

This is a Node.js tool, so you need to have installed it in your system. [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Geting started


### Installing

Install this package globally to have access to the command line cli.

```shell
$ npm install -g @david.casillas/writer-chapter-tool
```

### Configuring

By default the tool is configured to work with markdown files, this affects the file extension and the format of the headings inserted in every new chapter file created. There is a config option to change the syntax used, but by now only markdown is supported.

```shell
$ wct config-set language markdown
```

There are 2 options to control the editor used to open chapter files and the preview tool. Set then to your favourite apps using:

```shell
$ wct config-set editor BBEdit
$ wct config-set editor Markdown
```

To check the current available options:

```shell
$ wct config-list
```

All options are global and will affect all your projects. There is still no local per project settings.

## How to use

After installation create a folder to start your project. The folder will start empty.

```shell
$ mkdir mybook
$ cd mybook
```

### Creating chapters

Start your book creating your first chapter. Since there was nothing created before this will create folders `src` and `src/images` in your project folder.

```shell
$ wct chapter-create 'Starting here'
````

Now a markdown file for the content of the chapter and a folder `src/images/00` to hold the images will be created. Let's see the contents of the project `src`  folder right know:

```shell
$ ls -la src

.
|- 00-Starting here.md
|- images
|---- 00

```

The markdown file contains the header of the chapter:

```shell
$ cat src/00-Starting here.md

## Starting here
```

Let's create another chapter.

```shell
$ wct chapter-create 'Other chapter'
````

This will add another chapter, increasing the chapter number. The first chapter is chapter 0.

```shell
$ ls -la src

.
|- 00-Starting here.md
|- 01-Other chapter.md
|- images
|---- 00
|---- 01
```

### Managing chapters

We can see a list of chapters with the `list` command.

```shell
$ wct chapter-list

00-Starting here
01-Other chapter
```

Let's rename a chapter and change its position in the book.

```shell
$ wct chapter-rename 1 'Now I'm the first chapter'
$ wct chapter-move 1 0
$ wct chapter-list

00-Now I'm the first chapter
01-Starting here
```

Now what was chapter number 1 is now in the 0 position and has been renamed.

We can delete a chapter, ¡be sure to be using version control, since this can not be undone!

```shell
$ wct chapter-delete 0
$ wct chapter-list

00-Starting here
```

As you can see deleting a chapter reindexes the rest of chapters so they range from 0 to the last chapter.

### Adding content to chapters

Finally to start writing on a chapter:

```shell
$ wct chapter-edit 0
```

By default the `edit` command opens the markdown file in BBEdit editor to edit it and in Marked to have a live preview of the content. Check the config section to change the applications used to edit and preview.

In case you need to add images to your document copy the image file in the apropiate folder under `src/images` matching the chapter number. Then in your document reference the image. Here is an example using markdown syntax.

```markdown
[images/00/my-image.jpg]()
```

### Generate a PDF

When you need to review your work and generate a PDF version of the work.

```shell
$ wct book-compile
```
The command merges the contents of the `src` folder into a single markdown file and copies it to the `build` folder. The `images` folder is copied as is from `src` to `build` so all images keep working with no modification. The command also opens the result in the application configured to preview the content.

## API

This is a full list of all API commands available:

- `wct chapter-create <chapter_title>`
- `wct chapter-move <old_chapter_number> <new_chapter_number>`
- `wct chapter-delete <chapter_number>`
- `wct chapter-edit <chapter_number>`
- `wct chapter-rename <chapter_number> <new_title>`
- `wct chapter-list`
- `wct book-compile`
- `wct config-list`
- `wct config-set <property> <value>`

### API shortcuts

Commands have a shortcut build from the first letter of every command name part. For example the command `wct chapter-list` can be written as `wct cl`.

Config commands do not have a shortcut.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

