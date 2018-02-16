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

import Dropzone from "react-dropzone";
import { onFileUpload } from "../../actions/gif";

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../login/Login.css";

class Admin extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      gif: ""
    };

    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * on dropzone file drop, call upload action on file
   * @param {*array} accepted 
   */
  onDrop(accepted) {
    // send file to upload

    onFileUpload(accepted)
      .then(url => {
        console.log("URL", url);
        this.setState({ gif: url });
        this.inputUrl.value = url;
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Submit form to invoice save gif action
   * @param {*event} e 
   */
  onSubmit(e) {
    e.preventDefault();

    const title = String(this.inputTitle.value).trim();
    const url = String(this.inputUrl.value).trim();

    if (title !== "" && url !== "") {
      this.props.onSaveGif(title, url);
    } else {
      alert("Please fill in url and title");
    }
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <form method="post" onSubmit={this.onSubmit}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="name">
                Title
              </label>
              <input
                className={s.input}
                ref={i => {
                  this.inputTitle = i;
                }}
                id="title"
                type="text"
                name="title"
                autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              />
            </div>
            {this.state.gif === ""
              ? <Dropzone
                  accept="image/gif"
                  ref={dropzone => (this.dropzone = dropzone)}
                  multiple={false}
                  onDrop={(accepted, rejected) => {
                    //console.log("on drop ");
                    this.onDrop(accepted);
                  }}
                >
                  <div>
                    <div>Drag n’ drop or click to upload gif</div>
                  </div>
                </Dropzone>
              : <img src={this.state.gif} />}
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="url">
                URL
              </label>
              <input
                className={s.input}
                ref={i => {
                  this.inputUrl = i;
                }}
                id="url"
                type="text"
                name="url"
              />
            </div>

            <div className={s.formGroup}>
              <button className={s.button} type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Admin);
