import electron from 'electron';

function openRepo() {
    electron.shell.openExternal('https://github.com/tzsk/hoichoi');
}

const menu = new electron.remote.Menu();
menu.append(new electron.remote.MenuItem({
    label: 'Help',
    submenu: [{
        label: 'Give a Star',
        click: openRepo,
    }, {
        label: 'Report an Issue',
        click: openRepo,
    }]
}));

export default menu;