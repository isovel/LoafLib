
/* ———————————————————— Copyright (c) 2021 toastythetoaster ————————————————————
 *
 * LoafLib
 *
 * ————————————————————————————————————————————————————————————————————————————— */
/* eslint-disable no-negated-condition, no-else-return, react/no-children-prop */

import { UPlugin } from '@classes';
import { React, ContextMenuActions, getModule } from '@webpack';

const contextMenuItems = getModule(m => m.MenuRadioItem && !m.default);
const { MenuGroup, MenuSeparator, MenuItem, MenuControlItem, MenuCheckboxItem } = contextMenuItems;

export default class LoafLib extends UPlugin {
  constructor() {
    super();
    if (window.LoafLib) Object.assign(window.LoafLib, this.constructor);
    else Object.defineProperty(window, 'LoafLib', {
      value: this.constructor
    });
  }

  public static createContextMenuGroup(children: any, options: any = {}): any | null {
    if (!contextMenuItems) return null;
    else return React.createElement(
      MenuGroup,
      {
        children,
        ...options
      }
    );
  }
  
  public static createContextMenuSeparator(options: any = {}): any | null {
    if (!contextMenuItems) return null;
    else return React.createElement(
      MenuSeparator,
      {
        ...options
      }
    );
  }

  public static createContextMenuItem(label: string, action: () => void, id: string, options: any = {}): any | null {
    if (!contextMenuItems) return null;
    else return React.createElement(
      MenuItem,
      {
        label,
        id,
        action: () => (!options.noClose && ContextMenuActions.closeContextMenu(), action()),
        ...options
      }
    );
  }

  public static createContextMenuSubMenu(label: string, children, id: string, options: any = {}): any | null {
    if (!contextMenuItems) return null;
    else return React.createElement(
      MenuItem,
      {
        label,
        children,
        id,
        ...options
      }
    );
  }

  public static createContextMenuControlItem(control: (...any) => any, id: string, options: any = {}): any | null {
    if (!contextMenuItems) return null;
    else return React.createElement(
      MenuControlItem,
      {
        id,
        control: () => control(),
        ...options
      }
    );
  }

  public static createContextMenuCheckboxItem(label: string, action: () => void, id: string, checked: boolean, options: any = {}): any | null {
    if (!contextMenuItems) return null;
    else return React.createElement(
      MenuCheckboxItem,
      {
        label,
        id,
        action: () => (!options.noClose && ContextMenuActions.closeContextMenu(), action()),
        checked,
        ...options
      }
    );
  }
}
