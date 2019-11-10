import { BrowserWindow } from 'electron';
import events from 'events';
import * as path from 'path';
import * as url from 'url';

import accessor from '../app/accessor';

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

    bringToFront() {
        const { browserWindow: win } = this;
        if (win && win.isMinimized()) win.restore();
        if (win && !win.isVisible()) win.show();
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

export default BaseWindow;
