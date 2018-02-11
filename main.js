const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let addWin;

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({ width: 800, height: 600, title: 'Todo app' });

	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Open the DevTools.
	win.webContents.openDevTools();

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});

	const mainMenu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(mainMenu);
}
function addWindow() {
	// Create the browser window.
	addWin = new BrowserWindow({ width: 300, height: 200, title: 'Add shoping cart' });

	// and load the index.html of the app.
	addWin.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	addWin.on('close', () => {
		addWin = null;
	});
}

ipcMain.on('item:add', (event, item) => {
	win.webContents.send('item:add', item);
	addWin.close();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

const template = [{
	label: 'Todo app',
	submenu: [
		{ role: 'about' },
		{ role: 'quit' }
	]
}, {
	label: 'File',
	submenu: [{
		label: 'Add item',
		click() {
			addWindow();
		}
	}, {
		label: 'Clear items',
		click() {
			win.webContents.send('item:clear');
		}
	}]
}, {
	label: 'View',
	submenu: [
		{ role: 'reload' },
		{ role: 'forcereload' },
		{ role: 'toggledevtools' },
		{ type: 'separator' },
		{ role: 'resetzoom' },
		{ role: 'zoomin' },
		{ role: 'zoomout' },
		{ type: 'separator' },
		{ role: 'togglefullscreen' }
	]
}];

if (process.platform === 'darwin') {
	template.unshift({});
}