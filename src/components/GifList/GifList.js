import React, { PureComponent } from "react";
import GifListItem from "./GifListItem";
import withStyles from "isomorphic-style-loader/lib/withStyles";
// external-global styles must be imported in your JS.
import normalizeCss from "normalize.css";
import s from "./GifList.css";

class GifList extends PureComponent {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    if (!this.props.list) {
      this.props.getGifs();
    }

    document.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    document.addEventListener("scroll", this.onScroll, false);
  }

  onScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
      this.props.getGifs();
    }
  }

  getGifList() {
    const { loggedIn } = this.props;
    return this.props.list.map((gif, index) =>
      <GifListItem
        gif={gif}
        key={index}
        loggedIn={loggedIn}
        onDeleteGif={this.props.onDeleteGif}
      />
    );
  }

  render() {
    if (!this.props.list) return null;

    return (
      <div>
        {this.getGifList()}
        {this.props.loadMore &&
          <span
            onClick={e => {
              e.preventDefault();
              this.props.getGifs();
            }}
            style={{
              cursor: "pointer",
              display: "block",
              textAlign: "center",
              width: "100%"
            }}
          >
            Load more
          </span>}
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(GifList);
