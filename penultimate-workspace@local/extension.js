import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class PenultimateWorkspaceExtension extends Extension {
  enable() {
    this._settings = this.getSettings(); // usa settings-schema de metadata.json
    Main.wm.addKeybinding(
      'shortcut',
      this._settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.ALL,
      () => this._goPenultimate()
    );
  }

  disable() {
    Main.wm.removeKeybinding('shortcut');
    this._settings = null;
  }

  _goPenultimate() {
    const wm = global.workspace_manager;
    const n = wm.get_n_workspaces();
    if (n < 2) return;

    for (let i = n - 2; i >= 0; i--) {
      const ws = wm.get_workspace_by_index(i);
      const wins = ws.list_windows().filter(w =>
        w.get_window_type && w.get_window_type() === Meta.WindowType.NORMAL &&
        !w.is_on_all_workspaces()
      );
      if (wins.length > 0 || i === 0) {
        ws.activate(global.get_current_time());
        return;
      }
    }
  }
}
