
/* ———————————————————— Copyright (c) 2021 toastythetoaster ————————————————————
 *
 * LoafLib
 *
 * ————————————————————————————————————————————————————————————————————————————— */
/* eslint-disable no-negated-condition, no-else-return, no-useless-return, react/no-children-prop */

import { UPlugin } from '@classes';
import { React, ContextMenuActions, getModule, getByDisplayName, getByProps } from '@webpack';

const contextMenuItems = getModule(m => m.MenuRadioItem && !m.default);
const Toast = getModule(m => m.createToast && m.default?.displayName === 'Toast');
const ToastStore = getModule(m => m.showToast && !m.default);
const { MenuGroup, MenuSeparator, MenuItem, MenuControlItem, MenuCheckboxItem } = contextMenuItems;
const { createToast, ToastType } = Toast;
const { showToast, popToast, useToastStore } = ToastStore;

export default class LoafLib extends UPlugin {
  constructor() {
    super();
    if (window.LoafLib) Object.assign(window.LoafLib, this.constructor);
    else Object.defineProperty(window, 'LoafLib', {
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
    pop(id?: string): void {
      if (!Toast || !ToastStore) return;
      else useToastStore.setState((e => {
        const toastQueue = e.queuedToasts;
        console.log(toastQueue);
        return toastQueue.length ? {
          currentToast: toastQueue[0],
          queuedToasts: toastQueue.slice(1)
        } : {
          currentToast: null,
          queuedToasts: []
        };
      }));
    }
  }
}
