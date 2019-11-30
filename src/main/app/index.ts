import { app, BrowserWindow, globalShortcut } from 'electron';

import { EditorWindow } from '../windows/editor';
import { SearchWindow } from '../windows/search';
import { Accessor } from './accessor';

class App {
    // properties
    _accessor: Accessor | undefined;
    _args: object | undefined;

    editorWindow: EditorWindow | null;
    searchWindow: SearchWindow | null;

    constructor(accessor: Accessor | undefined, args: object | undefined) {
        this._accessor = accessor;
        this._args = args || { _: [] };

        this.editorWindow = null;
        this.searchWindow = null;
    }

    init() {
        if (process.platform === 'darwin') {
            app.commandLine.appendSwitch('enable-experimental-web-platform-features', 'true');
        }

        app.on('ready', this.ready);

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // macOS only
            // on os x it's common to re-create a window in the app
            // when the dock icon is clicked and there are no other
            // windows open
            /*/
            if (this._windowManager.windowCount === 0) {
                this.ready()
            }
             */

            this.ready();
        });

        /*
        app.on('browser-window-blur', () => {
            if (this.editorWindow) {
                console.log('registering shortcut');
                this.editorWindow.registerShortcut('CommandOrControl+Option+C')
            }
        });
         */

        // createTray()
    }

    ready = () => {
        // Create windows
        this.editorWindow = this._createEditorWindow();
        this.editorWindow.registerShortcut('CommandOrControl+Option+C');

        this.searchWindow = this._createSearchWindow();
        this.searchWindow.registerShortcut('CommandOrControl+Option+Space');
    };

    // --- private --------------------------------

    /*
     * Creates a new editor window
     */
    _createEditorWindow() {
        const editor: EditorWindow = new EditorWindow(this._accessor);
        editor.createWindow();
        return editor;
    }

    _createSearchWindow() {
        const search: SearchWindow = new SearchWindow(this._accessor);
        search.createWindow();
        return search;
    }
}

export default App;
