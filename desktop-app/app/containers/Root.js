// @flow
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import log from 'electron-log';
import type {Store} from '../reducers/types';
import Routes from '../Routes';
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import {grey} from '@material-ui/core/colors';
import {themeColor} from '../constants/colors';
import ErrorBoundary from '../components/ErrorBoundary';

import {registerShortcut, clearAllShortcuts, unregisterShortcut} from '../shortcut-manager/renderer-shortcut-manager';
import {
  onZoomChange, 
  triggerScrollUp, 
  triggerScrollDown, 
  screenshotAllDevices, 
  flipOrientationAllDevices, 
  enableInpector, 
  goToHomepage, 
  triggerNavigationBack, 
  triggerNavigationForward,
  deleteCookies,
  deleteStorage
} from '../actions/browser';

type Props = {
  store: Store,
  history: {},
};

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: themeColor,
    },
    secondary: {
      main: '#424242',
    },
    ternary: {
      main: '#C4C5CE',
    },
    divider: grey[500],
    background: {
      main: '#252526',
    },
  },
});

const getApp = history => {
  if (true || process.env.NODE_ENV !== 'development') {
    return (
      <ErrorBoundary>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </ErrorBoundary>
    );
  }
  return (
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  );
};

export default class Root extends Component<Props> {
  componentDidMount() {
    this.registerAllShortcuts();
  }

  registerAllShortcuts = () => {
    const {store} = this.props;

    registerShortcut({id: 'ZoomIn', title: 'Zoom In', accelerators: ['mod+plus', 'mod+shift+=']}, () => {
      store.dispatch(onZoomChange(store.getState().browser.zoomLevel + 0.1));
    }, true);

    registerShortcut({id: 'ZoomOut', title: 'Zoom Out', accelerators: ['mod+-']}, () => {
      store.dispatch(onZoomChange(store.getState().browser.zoomLevel - 0.1));
    }, true);

    registerShortcut({id: 'ZoomReset', title: 'Zoom Reset', accelerators: ['mod+0']}, () => {
      store.dispatch(onZoomChange(0.6));
    }, true);

    registerShortcut({id: 'EditUrl', title: 'Edit URL', accelerators: ['mod+l']}, () => {
      document.getElementById('adress').select();
    }, true);

    registerShortcut({id: 'ScroolUp', title: 'Scroll Up', accelerators: ['mod+pageup']}, () => {
      store.dispatch(triggerScrollUp());
    }, true);

    registerShortcut({id: 'ScroolDown', title: 'Scroll Down', accelerators: ['mod+pagedown']}, () => {
      store.dispatch(triggerScrollDown());
    }, true);

    registerShortcut({id: 'Screenshot', title: 'Take Screenshot', accelerators: ['mod+prtsc']}, () => {
      store.dispatch(screenshotAllDevices());
    }, true, 'keyup');

    registerShortcut({id: 'TiltDevices', title: 'Tilt Devices', accelerators: ['mod+tab']}, () => {
      store.dispatch(flipOrientationAllDevices());
    }, true);
    
    registerShortcut({id: 'ToggleInspector', title: 'Toggle Inspector', accelerators: ['mod+i']}, () => {
      store.dispatch(enableInpector());
    }, true);

    registerShortcut({id: 'OpenHome', title: 'Go to Homepage', accelerators: ['alt+home']}, () => {
      store.dispatch(goToHomepage());
    }, true);

    registerShortcut({id: 'BackAPage', title: 'Back a Page', accelerators: ['alt+left']}, () => {
      store.dispatch(triggerNavigationBack());
    }, true);

    registerShortcut({id: 'ForwardAPage', title: 'Forward a Page', accelerators: ['alt+right']}, () => {
      store.dispatch(triggerNavigationForward());
    }, true);

    registerShortcut({id: 'DeleteStorage', title: 'Delete Storage', accelerators: ['mod+del']}, () => {
      store.dispatch(deleteStorage());
    }, true);

    registerShortcut({id: 'DeleteCookies', title: 'Delete Cookies', accelerators: ['mod+shift+del']}, () => {
      store.dispatch(deleteCookies());
    }, true);
  }

  componentWillUnmount() {
    clearAllShortcuts();
  }

  render() {
    const {store, history} = this.props;
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>{getApp(history)}</ThemeProvider>
      </Provider>
    );
  }
}
