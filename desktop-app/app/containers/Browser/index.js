// @flow
import React, {Fragment} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Header from '../../components/Header';
import DevicePreviewerContainer from '../DevicePreviewerContainer';
import DrawerContainer from '../DrawerContainer';
import * as BrowserActions from '../../actions/browser';
import Grid from '@material-ui/core/Grid';
import {DEVTOOLS_MODES} from '../../constants/previewerLayouts';

type Props = {};

const Browser = ({browser}) => {
  return (
    <Fragment>
      <Header />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
        }}
      >
        <DrawerContainer />
        <div
          style={{
            display: 'flex',
            flex: 1,
            height: '100%',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <DevicePreviewerContainer />
          {browser.devToolsConfig.open &&
          browser.devToolsConfig.mode === DEVTOOLS_MODES.BOTTOM ? (
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: browser.devToolsConfig.size.height,
              }}
            />
          ) : null}
        </div>
        {browser.devToolsConfig.open &&
        browser.devToolsConfig.mode === DEVTOOLS_MODES.RIGHT ? (
          <div
            style={{
              height: '100%',
              width: browser.devToolsConfig.size.width,
              display: 'flex',
            }}
          />
        ) : null}
      </div>
    </Fragment>
  );
};

function mapStateToProps(state) {
  return {
    browser: state.browser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(BrowserActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
