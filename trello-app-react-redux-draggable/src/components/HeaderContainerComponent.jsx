import { connect } from 'react-redux';

import Header from "./Header";

const mapStateToProps = state => ({
  hasNextStates: state.board.futureStates.length > 0,
  hasPreviousStates: state.board.previousStates.length > 0
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
