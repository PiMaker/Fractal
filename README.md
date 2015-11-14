# Fractal
The Fractal Music Streaming Platform is a web-based music player, leveraging modern web-technologies like HTML5 audio elements and JS-based canvas drawing.<br />
It features easy audio playback, the revolutionary QuickPlay drag-and-drop, live playlist editor and is fully responsive, aka mobile compatible.

# Installation, Setup and Dependencies
Fractal was designed to be easy, so the installation is just that as well.

### Dependencies
* A PHP-enabled webserver
* A way to clone git repos
* Music

### Installation
Clone the repository be typing in the following command in a shell (linux) or in a git-enabled cmd (windows) at the root (or any subfolder) of your webserver:
`git clone https://github.com/PiMaker/Fractal.git`

### Setup
Open the `config.php` file in a text editor of your choice and change the values to your likings. Documentation on the different settings is provided in the file itself.<br />
You may now want to put your music in the `music` folder. Another option is to create a symlink to the location of a music library somewhere else. To do this, the Linux commands executed from the root of Fractal would be:

```
rm -rf music
ln -s /full/path/to/your/music/library music
```

and on Windows:

```
rmdir /S /Q music
mklink /J music C:\path\to\your\music\library
```

And that is it! You can now access your Fractal application through any webbrowser!

# License
This project is distributed under the GPLv3 license. Usages of this project and/or parts of it have to attribute the original author (namely *PiMaker*).
Exceptions:
* Example music by Kevin MacLeod (incompetech.com)
