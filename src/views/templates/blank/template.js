const remote = require('electron').remote
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const { ipcRenderer } = require('electron');

const chapterList = ['Chapterﬂ1'];
const currentActiveChapter = 0;
let chapterNameCount = 1;

$(document).ready(function () {
    updateChapters();
    setActiveChapter(currentActiveChapter);
});

function updateChapters() {

    if (!chapterList.length) {
        addChapter();
    }

    $('#chapters').empty();
    chapterList.forEach(chapter => {
        const chapterName = chapter.replace(/ﬂ/g, ' ');
        $('#chapters').append(`<span id="${chapter}" class="item chapter_navigation">${chapterName}</span>`)
    });

    setActiveChapter(currentActiveChapter);
}

function setActiveChapter(currentActiveChapter) {
    const chapter = chapterList[currentActiveChapter];
    $(`#${chapter}`).addClass('active');
}

function addChapter() {
    const chapterCount = chapterList.length;
    chapterList[chapterCount] = `Chapterﬂ${chapterNameCount+1}`;
    chapterNameCount++;
    updateChapters();
}

$('#addChapter').click(() => {
    addChapter();
})

let currentSelectedChapterForContextAction = null;
let rightClickPosition = null;
const chapterMenu = new Menu()
const renameChapterMenuItem = new MenuItem({
    label: 'Rename Chapter',
    click: (e) => {
        const currentChapter = currentSelectedChapterForContextAction.replace(/ﬂ/g, ' ');
        let child = new remote.BrowserWindow({
            parent: remote.getCurrentWindow(),
            modal: true,
            width: 360,
            height: 135,
            frame: false,
            show: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            }
        })
        child.loadURL('file://' + __dirname + '/../../system/chapterRename.html')
        child.once('show', function () {
            child.webContents.send('currentChapterName', currentChapter);
        });
        child.once('ready-to-show', () => {
            child.show()
        });
        ipcRenderer.on('renamedChapter', (event, message) => {
            const newChapterName = message;
            const index = chapterList.findIndex(chapter => chapter === currentSelectedChapterForContextAction);
            const newChapterId = newChapterName.replace(/ /g, 'ﬂ');
            chapterList[index] = newChapterId;
            currentSelectedChapterForContextAction = null;
            updateChapters();
        });
    }
});

const deleteChapterMenuItem = new MenuItem({
    label: 'Delete Chapter',
    click: (e) => {
        const index = chapterList.findIndex(chapter => chapter === currentSelectedChapterForContextAction);
        chapterList.splice(index, 1);
        updateChapters();
    }
});

chapterMenu.append(renameChapterMenuItem);
chapterMenu.append(deleteChapterMenuItem);

$(document).on('contextmenu', '.chapter_navigation', (e) => {
    e.preventDefault();
    currentSelectedChapterForContextAction = e.target.id;
    rightClickPosition = { x: e.x, y: e.y };
    chapterMenu.popup(remote.getCurrentWindow());
});
