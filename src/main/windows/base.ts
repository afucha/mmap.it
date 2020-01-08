import { BrowserWindow, globalShortcut, screen } from 'electron';
import EventEmitter from 'events';
import * as path from 'path';
import * as url from 'url';

import { Accessor } from '../app/accessor';

export enum WindowType {
    BASE = 'base',
    EDITOR = 'editor',
    SEARCH = 'search'
}

export enum WindowLifecycle {
    NONE = 0,
    LOADING = 1,
    READY = 2,
    QUITTED = 3
}

class BaseWindow extends EventEmitter {
    // properties
    _accessor: Accessor | undefined;
    id: number | null;
    browserWindow: BrowserWindow | null;
    lifecycle: WindowLifecycle;
    type: WindowType;

    constructor(accessor: Accessor | undefined) {
        super();

        this._accessor = accessor;
        this.id = null;
        this.browserWindow = null;
        this.lifecycle = WindowLifecycle.NONE;
        this.type = WindowType.BASE;
    }

    registerShortcut(key: string) {
        const shortcut = globalShortcut.register(key, () => {
            if (this.browserWindow) {
                if (this.browserWindow.isVisible()) {
                    this.browserWindow.hide();
                } else {
                    this.browserWindow.setVisibleOnAllWorkspaces(true); // put the window on all screens
                    this.browserWindow.show(); // focus the window up front on the active screen
                    this.browserWindow.setVisibleOnAllWorkspaces(false); // disable all screen behavior
                }
            }
        });
    }

    reload() {
        if (this.browserWindow) this.browserWindow.reload();
    }

    destroy() {
        this.lifecycle = WindowLifecycle.QUITTED;
        super.emit('window-closed');

        super.removeAllListeners();
        if (this.browserWindow) {
            this.browserWindow.destroy();
            this.browserWindow = null;
        }
        this.id = null;
    }

    // --- private ------------------------------

    _buildUrlString() {
        let winUrl: string;
        if (process.env.NODE_ENV === 'development') {
            winUrl = 'http://localhost:2003';
        } else {
            winUrl = url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file',
                slashes: true
            });
        }

        winUrl += '?type=' + this.type;

        return winUrl;
    }
}

export { BaseWindow };
