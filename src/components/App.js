import '../styles/app.css';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Piece from './Piece';
import Header from './Header';
import {socket} from 'actions';
import PieceInspector from './PieceInspector';
import sound from '../media/sound.mp3';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      puzzle: [],
      owner: false
    };
    this.savePosition = this.savePosition.bind(this);
    this.reset = this.reset.bind(this);
    this.setActivePuzzle = this.setActivePuzzle.bind(this);
    this.checkDropObject = this.checkDropObject.bind(this);
    socket.on('image config', (data) => {
      if (data.name === this.props.match.params.id) {
        this.setState(() => ({puzzle: data.pieces}));
      }
    });
    socket.on('yes, you are owner', () => this.setState(() => ({owner: true})));
  }

  componentDidMount() {
    socket.emit('get image config', {query: this.props.match.params.id});
    socket.emit('do i owner', {query: this.props.match.params.id, user: this.props.user});
  }

  savePosition(pos) {
    this.sound.currentTime = 0;
    this.sound.play();
    let newMap = this.state.puzzle.map(item => {
      if (item.x === pos.x && item.y === pos.y) {
        return {...item, disabled: true};
      }
      return item;
    });
    this.setState(() => ({puzzle: newMap}));
    socket.emit('update image config', {query: this.props.match.params.id, piece: {...pos, disabled: true}});
  }

  reset() {
    socket.emit('reset image config', {query: this.props.match.params.id});
  }

  setActivePuzzle(pos) {
    this.setState(() => ({activePuzzle: pos}));
  }

  checkDropObject(pos) {
    if (pos.x === this.state.activePuzzle.x && pos.y === this.state.activePuzzle.y) {
      this.savePosition(pos);
    }
  }

  render() {
    return (
      <div>
        <Header {...this.props} authorized={this.props.authorized} user={this.props.user}
                dispatch={this.props.dispatch} owner={this.state.owner}/>
        <audio src={sound} ref={e => this.sound = e}/>
        <div className="app">
          <div className="left">
            <div className="puzzle">
              {this.state.puzzle.slice().sort((a, b) => {
              if (a.y > b.y) {
                return -1;
              } else if (a.y === b.y) {
                return a.x > b.x ? -1 : 1;
              }
              return 1;
            }).map((item, i) => (
              <PieceInspector {...item} key={i} handleDrop={this.checkDropObject}
                              src={this.props.match.params.id}/>))}
            </div>
          </div>
          <div className="right">
            {this.state.owner &&
            <div className="app__nav-bar">
              <button onClick={this.reset} className="reset-button">Reset</button>
            </div>}
            <div className="app__puzzle-list">
              {this.state.puzzle.map((item, i) => <Piece {...item} key={i} handleStart={this.setActivePuzzle}
                                                         src={this.props.match.params.id}/>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  authorized: PropTypes.bool,
  dispatch: PropTypes.func,
  match: PropTypes.object,
};

export default connect((state) => ({
  user: state.user,
  authorized: state.authorized
}))(App);
