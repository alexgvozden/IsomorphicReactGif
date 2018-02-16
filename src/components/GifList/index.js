import { connect } from "react-redux";

import GifList from "./GifList";
import { getGifs, onDeleteGif } from "../../actions/gif";

const mapDispatchToProps = { getGifs, onDeleteGif };
const mapStateToProps = state => {
  const loggedIn = state.user !== null && state.user.loggedIn;
  return {
    list: state.gifs.list,
    loadMore: state.gifs.loadMore,
    loggedIn: loggedIn
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GifList);
