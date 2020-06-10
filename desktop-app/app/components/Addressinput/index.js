// @flow
import React from 'react';
import cx from 'classnames';
import HomePlusIcon from '../icons/HomePlus';
import DeleteCookieIcon from '../icons/DeleteCookie';
import DeleteStorageIcon from '../icons/DeleteStorage';
import {iconsColor} from '../../constants/colors';

import commonStyles from '../common.styles.css';
import styles from './style.css';
import {Tooltip} from '@material-ui/core';

type Props = {
  address: string,
  onChange: () => void,
};

type State = {
  address: string,
};

class AddressBar extends React.Component<Props> {
  props: Props;
  state: State;

  constructor(props) {
    super(props);
    this.state = {
      userTypedAddress: props.address,
      previousAddress: props.address,
    };
    this.inputRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.address != state.previousAddress) {
      return {
        userTypedAddress: props.address,
        previousAddress: props.address,
      };
    }
    return null;
  }

  render() {
    return (
      <div className={styles.addressBarContainer}>
        <input
          ref={this.inputRef}
          type="text"
          id="adress"
          name="address"
          className={styles.addressInput}
          placeholder="https://your-website.com"
          value={this.state.userTypedAddress}
          onKeyDown={this._handleKeyDown}
          onChange={e => this.setState({userTypedAddress: e.target.value})}
        />
        <div className={cx(styles.floatingOptionsContainer)}>
          <div
            className={cx(commonStyles.icons, commonStyles.roundIcon, {
              [commonStyles.enabled]: true,
            })}
          >
            <Tooltip title="Delete Storage">
              <div
                className={cx(commonStyles.flexAlignVerticalMiddle)}
                onClick={this.props.deleteStorage}
              >
                <DeleteStorageIcon
                  height={22}
                  width={22}
                  color={iconsColor}
                  padding={5}
                />
              </div>
            </Tooltip>
          </div>
          <div
            className={cx(commonStyles.icons, commonStyles.roundIcon, {
              [commonStyles.enabled]: true,
            })}
          >
            <Tooltip title="Delete Cookies">
              <div
                className={cx(commonStyles.flexAlignVerticalMiddle)}
                onClick={this.props.deleteCookies}
              >
                <DeleteCookieIcon
                  height={22}
                  width={22}
                  color={iconsColor}
                  padding={5}
                />
              </div>
            </Tooltip>
          </div>
          <div
            className={cx(commonStyles.icons, commonStyles.roundIcon, {
              [commonStyles.enabled]:
                this.props.address !== this.props.homepage,
              [commonStyles.disabled]:
                this.props.address == this.props.homepage,
            })}
          >
            <Tooltip title="Set as Homepage">
              <div
                className={cx(commonStyles.flexAlignVerticalMiddle)}
                onClick={this.props.setHomepage}
              >
                <HomePlusIcon
                  height={22}
                  width={22}
                  color={iconsColor}
                  padding={5}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }

  _handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.inputRef.current.blur();
      this._onChange();
    }
  };

  _onChange = () => {
    if (!this.state.userTypedAddress) {
      return;
    }
    this.props.onChange &&
      this.props.onChange(this._normalize(this.state.userTypedAddress), true);
  };

  _normalize = address => {
    if (address.indexOf('://') === -1) {
      let protocol = 'https://';
      if (address.startsWith('localhost') || address.startsWith('127.0.0.1')) {
        protocol = 'http://';
      }
      address = `${protocol}${address}`;
    }
    return address;
  };
}

export default AddressBar;
