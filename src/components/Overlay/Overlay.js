/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Overlay.css";

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: true };
    this.onClose = this.onClose.bind(this);
  }
  onClose() {
    this.setState({ open: false });
  }
  render() {
    if (!this.state.open) return null;
    return (
      <div className={s.overlay} onClick={this.onClose}>
        <div className={s.text}>
          <h1>Welcome to GifHub</h1>
          <br />Click to close
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Overlay);
