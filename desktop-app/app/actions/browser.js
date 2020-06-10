// @flow
import type {Dispatch, BrowserStateType} from '../reducers/types';
import pubsub from 'pubsub.js';
import {
  SCROLL_DOWN,
  SCROLL_UP,
  NAVIGATION_BACK,
  NAVIGATION_FORWARD,
  NAVIGATION_RELOAD,
  SCREENSHOT_ALL_DEVICES,
  FLIP_ORIENTATION_ALL_DEVICES,
  ENABLE_INSPECTOR_ALL_DEVICES,
  RELOAD_CSS,
  DELETE_STORAGE,
} from '../constants/pubsubEvents';
import {FLEXIGRID_LAYOUT} from '../constants/previewerLayouts';
import {FILTER_FIELDS} from '../reducers/browser';

export const NEW_ADDRESS = 'NEW_ADDRESS';
export const NEW_HOMEPAGE = 'NEW_HOMEPAGE';
export const NEW_ZOOM_LEVEL = 'NEW_ZOOM_LEVEL';
export const NEW_SCROLL_POSITION = 'NEW_SCROLL_POSITION';
export const NEW_NAVIGATOR_STATUS = 'NEW_NAVIGATOR_STATUS';
export const NEW_DRAWER_CONTENT = 'NEW_DRAWER_CONTENT';
export const NEW_PREVIEWER_CONFIG = 'NEW_PREVIEWER_CONFIG';
export const NEW_ACTIVE_DEVICES = 'NEW_ACTIVE_DEVICES';
export const NEW_CUSTOM_DEVICE = 'NEW_CUSTOM_DEVICE';
export const DELETE_CUSTOM_DEVICE = 'DELETE_CUSTOM_DEVICE';
export const NEW_FILTERS = 'NEW_FILTERS';
export const NEW_USER_PREFERENCES = 'NEW_USER_PREFERENCES';
export const TMP_SCREENSHOT_CONFIG = 'TMP_SCREENSHOT_CONFIG';

export function newAddress(address) {
  return {
    type: NEW_ADDRESS,
    address,
  };
}

export function newHomepage(homepage) {
  return {
    type: NEW_HOMEPAGE,
    homepage,
  };
}

export function newUserPreferences(userPreferences) {
  return {
    type: NEW_USER_PREFERENCES,
    userPreferences,
  };
}

export function newZoomLevel(zoomLevel) {
  return {
    type: NEW_ZOOM_LEVEL,
    zoomLevel,
  };
}

export function newTmpScreenshotConfig(tmpScreenshotConfig) {
  return {
    type: TMP_SCREENSHOT_CONFIG,
    tmpScreenshotConfig,
  };
}

export function newScrollPosition(scrollPosition) {
  return {
    type: NEW_SCROLL_POSITION,
    scrollPosition,
  };
}

export function newNavigatorStatus(navigatorStatus) {
  return {
    type: NEW_NAVIGATOR_STATUS,
    navigatorStatus,
  };
}

export function newDrawerContent(drawer) {
  return {
    type: NEW_DRAWER_CONTENT,
    drawer,
  };
}

export function newPreviewerConfig(previewer) {
  return {
    type: NEW_PREVIEWER_CONFIG,
    previewer,
  };
}

export function newActiveDevices(devices) {
  return {
    type: NEW_ACTIVE_DEVICES,
    devices,
  };
}

export function newCustomDevice(device) {
  return {
    type: NEW_CUSTOM_DEVICE,
    device,
  };
}

export function deleteCustomDevice(device) {
  return {
    type: DELETE_CUSTOM_DEVICE,
    device,
  };
}

export function newFilters(filters) {
  return {
    type: NEW_FILTERS,
    filters,
  };
}

export function onAddressChange(newURL, force) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {address},
    } = getState();

    if (newURL === address) {
      if (force) {
        pubsub.publish(NAVIGATION_RELOAD);
      }
      return;
    }

    const isHashDiff = isHashOnlyChange(newURL, address);

    if (isHashDiff) {
      return;
    }

    dispatch(newAddress(newURL));
  };
}

function isHashOnlyChange(newURL, oldURL) {
  if (!newURL || !oldURL) {
    return false;
  }
  let diff = newURL.replace(oldURL, '').trim();
  if (diff.startsWith('/')) {
    diff = diff.substring(1);
  }

  return diff.startsWith('#');
}

export function onZoomChange(newLevel) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {zoomLevel, tmpScreenshotConfig},
    } = getState();

    if (newLevel === zoomLevel) {
      return;
    }

    dispatch(newZoomLevel(newLevel));
    dispatch(
      newTmpScreenshotConfig({
        ...tmpScreenshotConfig,
        zoomLevel: newLevel,
      })
    );
  };
}

export function onScrollChange({x: newX, y: newY}) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {
        scrollPosition: {x, y},
      },
    } = getState();

    if (newX === x && newY === y) {
      return;
    }

    dispatch(newScrollPosition({x: newX, y: newY}));
  };
}

export function updateNavigatorStatus({
  backEnabled: newBackEnabled,
  forwardEnabled: newForwardEnabled,
}) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {
        navigatorStatus: {backEnabled, forwardEnabled},
      },
    } = getState();

    if (
      newBackEnabled === backEnabled &&
      newForwardEnabled === forwardEnabled
    ) {
      return;
    }

    dispatch(
      newNavigatorStatus({
        backEnabled: newBackEnabled,
        forwardEnabled: newForwardEnabled,
      })
    );
  };
}

export function openDrawerAndSetContent(_newDrawerContent) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {
        drawer: {drawerContent, open},
      },
    } = getState();

    if (_newDrawerContent === drawerContent && open) {
      return;
    }

    dispatch(
      newDrawerContent({
        content: _newDrawerContent,
        open: true,
      })
    );
  };
}

export function changeDrawerOpenState(newOpenState) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {drawer},
    } = getState();

    if (newOpenState === drawer.open) {
      return;
    }

    dispatch(
      newDrawerContent({
        ...drawer,
        open: newOpenState,
      })
    );
  };
}

export function setPreviewLayout(newLayout) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {previewer, tmpScreenshotConfig},
    } = getState();

    if (previewer.layout === newLayout) {
      return;
    }

    dispatch(
      newPreviewerConfig({
        ...previewer,
        layout: newLayout,
      })
    );
    dispatch(
      newTmpScreenshotConfig({
        ...tmpScreenshotConfig,
        previewer: {
          layout: newLayout
        },
      })
    );
  };
}

export function setActiveDevices(newDevices) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {devices},
    } = getState();

    if (false) {
      //TODO verify the devices list and return if the order of the devices didn;t change;
      return;
    }

    dispatch(newActiveDevices(newDevices));
  };
}

export function addCustomDevice(newDevice) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {devices},
    } = getState();

    dispatch(newCustomDevice(newDevice));

    if (newDevice.added) {
      dispatch(newActiveDevices([...devices, newDevice]));
    }
  };
}

export function deleteDevice(device) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    dispatch(deleteCustomDevice(device));
  };
}

export function toggleFilter(filterField, value) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {filters, tmpScreenshotConfig},
    } = getState();
    if (!filters[filterField]) {
      filters[filterField] = [];
    }
    const index = filters[filterField].indexOf(value);
    if (index === -1) {
      filters[filterField].push(value);
    } else {
      filters[filterField].splice(index, 1);
    }
    dispatch(newFilters(filters));
    dispatch(
      newTmpScreenshotConfig({
        ...tmpScreenshotConfig,
        filters: filters,
      })
    );
  };
}

export function goToHomepage() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {homepage, address},
    } = getState();

    if (homepage === address) {
      return;
    }

    dispatch(newAddress(homepage));
  };
}

export function setCurrentAddressAsHomepage() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {homepage, address},
    } = getState();

    if (homepage === address) {
      return;
    }

    dispatch(newHomepage(address));
  };
}

export function onUserPreferencesChange(userPreferences) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    dispatch(newUserPreferences(userPreferences));
  };
}

export function triggerScrollDown() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(SCROLL_DOWN);
  };
}

export function postScreenshotAllDevices() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {zoomLevel, previewer, filters, tmpScreenshotConfig},
    } = getState();

    if (
      JSON.stringify(filters) != JSON.stringify(tmpScreenshotConfig.filters) ||
      zoomLevel != tmpScreenshotConfig.zoomLevel ||
      JSON.stringify(previewer) != JSON.stringify(tmpScreenshotConfig.previewer)
    ) {
      dispatch(newFilters(tmpScreenshotConfig.filters));
      dispatch(newZoomLevel(tmpScreenshotConfig.zoomLevel));
      dispatch(newPreviewerConfig(tmpScreenshotConfig.previewer));
    }
  };
}

export function preScreenshotAllDevices() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {zoomLevel, previewer, filters, tmpScreenshotConfig},
    } = getState();

    // only apply for first device
    if (Object.keys(tmpScreenshotConfig).length == 0) {
      dispatch(newTmpScreenshotConfig({zoomLevel, previewer, filters}));
    }

    if (
      filters[FILTER_FIELDS.OS].length != 0 ||
      filters[FILTER_FIELDS.DEVICE_TYPE].length != 0
    ) {
      dispatch(
        newFilters({
          ...filters,
          [FILTER_FIELDS.OS]: [],
          [FILTER_FIELDS.DEVICE_TYPE]: [],
        })
      );
    }

    if (previewer.layout != FLEXIGRID_LAYOUT) {
      dispatch(
        newPreviewerConfig({
          ...previewer,
          layout: FLEXIGRID_LAYOUT,
        })
      );
    }

    const minZoomLevel = 0.2;
    if (minZoomLevel != zoomLevel) {
      dispatch(newZoomLevel(minZoomLevel));
    }
  };
}

export function screenshotAllDevices() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const {
      browser: {tmpScreenshotConfig},
    } = getState();
    pubsub.publish(SCREENSHOT_ALL_DEVICES, [{now: new Date()}]);
  };
}

export function flipOrientationAllDevices() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(FLIP_ORIENTATION_ALL_DEVICES);
  };
}

export function enableInpector() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(ENABLE_INSPECTOR_ALL_DEVICES);
  };
}

export function triggerScrollUp() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(SCROLL_UP);
  };
}

export function triggerNavigationBack() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(NAVIGATION_BACK);
  };
}

export function triggerNavigationForward() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(NAVIGATION_FORWARD);
  };
}

export function triggerNavigationReload(_, args) {
  return (dispatch: Dispatch, getState: RootStateType) => {
    const ignoreCache = (args || {}).ignoreCache || false;
    pubsub.publish(NAVIGATION_RELOAD, [{ignoreCache}]);
  };
}

export function deleteCookies() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(DELETE_STORAGE, [{storages: ['cookies']}]);
  };
}

export function deleteStorage() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(DELETE_STORAGE, [
      {
        storages: [
          'appcache',
          'filesystem',
          'indexdb',
          'localstorage',
          'shadercache',
          'websql',
          'serviceworkers',
          'cachestorage',
        ],
      },
    ]);
  };
}

export function reloadCSS() {
  return (dispatch: Dispatch, getState: RootStateType) => {
    pubsub.publish(RELOAD_CSS);
  };
}
