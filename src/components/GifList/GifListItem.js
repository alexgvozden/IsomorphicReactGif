import React, { PureComponent } from "react";
import Link from "../Link/";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import normalizeCss from "normalize.css";
import s from "./GifList.css";

class GifListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(e) {
    console.log("on delete gif");
    e.preventDefault();

    this.props
      .onDeleteGif(this.props.gif._id, this.props.gif.next, this.props.gif.prev)
      .then(result => {
        // alert("Gif successfully deleted");
      })
      .catch(error => alert("error deleting : " + error));
  }

  render() {
    //console.log("add gif", this.props);
    return (
      <Link to={`/gif/${this.props.gif._id}`}>
        <div className={s.listItem}>
          <img className={s.listItemImg} src={this.props.gif.url} />
          <div className={s.download}>FREE DOWNLOAD</div>
          {this.props.loggedIn &&
            <a href="#" onClick={this.onDelete}>
              Delete
            </a>}
        </div>
      </Link>
    );
  }
}

export default withStyles(normalizeCss, s)(GifListItem);
