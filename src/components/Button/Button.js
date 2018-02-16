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
import s from "./Button.css";
import Link from "../Link";

class Button extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    target: PropTypes.string
  };

  static defaultProps = {
    target: "_self",
    style: {}
  };

  constructor(props) {
    super(props);
  }

  render() {
    console.log("style", this.props.style);
    return (
      <Link
        to={this.props.to}
        style={this.props.style}
        target={this.props.target}
      >
        <div className={s.button} style={this.props.style}>
          {this.props.children}
          <div className="mask" />
        </div>
      </Link>
    );
  }
}

export default withStyles(s)(Button);
