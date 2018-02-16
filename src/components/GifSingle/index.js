import { connect } from "react-redux";

import GifSingle from "./GifSingle";
import { getGif, onDeleteGif } from "../../actions/gif";

const mapDispatchToProps = { getGif, onDeleteGif };

const mapStateToProps = (state, ownProps) => {
  const loggedIn = state.user !== null && state.user.loggedIn;
  return {
    item: state.gifs.current || ownProps.item,
    loggedIn: loggedIn
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GifSingle);
