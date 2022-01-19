
/* ——————— Copyright (c) 2021-2022 toastythetoaster. All rights reserved. ———————
 *
 * LoafLib
 *
 * —————————————————————————————————————————————————————————————————————————————— */
/* eslint-disable no-negated-condition, no-else-return, no-useless-return, react/no-children-prop */

import { UPlugin } from '@classes';
import { React, ContextMenuActions, getModule } from '@webpack';

const contextMenuItems = getModule(m => m.MenuRadioItem && !m.default);
const Toast = getModule(m => m.createToast && m.default?.displayName === 'Toast');
const ToastStore = getModule(m => m.showToast && !m.default);
const { MenuGroup, MenuSeparator, MenuItem, MenuControlItem, MenuCheckboxItem } = contextMenuItems;
const { createToast, ToastType } = Toast;
const { showToast, useToastStore } = ToastStore;

const propsIncludeKeyword = (o, k) => Object.keys(o).some(e => e.includes(k.toLowerCase()) || e.includes(k.charAt(0).toUpperCase().concat(k.slice(1).toLowerCase())));

export default class LoafLib extends UPlugin {
  constructor() {
    super();
    if (global.LoafLib) Object.assign(global.LoafLib, this.constructor);
    else Object.defineProperty(global, 'LoafLib', {
      value: this.constructor
    });
  }

  public static ContextMenus = {
    createContextMenuGroup(children: any, options: any = {}): any | null {
      if (!contextMenuItems) return null;
      else return React.createElement(
        MenuGroup,
        {
          children,
          ...options
        }
      );
    },
    createContextMenuSeparator(options: any = {}): any | null {
      if (!contextMenuItems) return null;
      else return React.createElement(
        MenuSeparator,
        {
          ...options
        }
      );
    },
    createContextMenuItem(label: string, action: () => void, id: string, options: any = {}): any | null {
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
    },
    createContextMenuSubMenu(label: string, children, id: string, options: any = {}): any | null {
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
    },
    createContextMenuControlItem(control: (...any) => any, id: string, options: any = {}): any | null {
      if (!contextMenuItems) return null;
      else return React.createElement(
        MenuControlItem,
        {
          id,
          control: () => control(),
          ...options
        }
      );
    },
    createContextMenuCheckboxItem(label: string, action: () => void, id: string, checked: boolean, options: any = {}): any | null {
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

  public static Toasts = {
    show(content: string, type: 0 | 1 | 2 = 0): string | null {
      if (!Toast || !ToastStore) return null;
      else {
        const toast = createToast(content, type);
        showToast(toast);
        return toast.id;
      }
    },
    info(content: string): string | null {
      return this.show(content, ToastType.MESSAGE);
    },
    success(content: string): string | null {
      return this.show(content, ToastType.SUCCESS);
    },
    error(content: string): string | null {
      return this.show(content, ToastType.FAILURE);
    },
    pop(id?: string): void {
      if (!Toast || !ToastStore) return;
      else useToastStore.setState(((e: any): any => {
        const t: any[] = e.queuedToasts;
        const a = t.filter((_, i) => i !== t.findIndex(t => t.id === id));
        t === a && Astra.warn(`Toast with id '${id}' not found!`);
        return t.length ? id ? {
          currentToast: a[0],
          queuedToasts: a
        } : {
          currentToast: t[0],
          queuedToasts: t.slice(1)
        } : {
          currentToast: null,
          queuedToasts: []
        };
      }));
    }
  }

  public static Webpack = {
    getByKeyword(keyword: string, shouldCheckDefaults = false): any {
      return getModule(m => propsIncludeKeyword(m, keyword) || (shouldCheckDefaults && m.default && propsIncludeKeyword(m.default, keyword)));
    },
    getAllByKeyword(keyword: string, shouldCheckDefaults = false): any {
      return getModule(m => propsIncludeKeyword(m, keyword) || (shouldCheckDefaults && m.default && propsIncludeKeyword(m.default, keyword)), { all: true });
    }
  }
}
