import '../styles/participants.css';

import React from 'react';
import PropTypes from 'prop-types';
import { socket } from 'actions';
import Friends from './Friends';
import lodash from 'lodash';

class Participants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: []
    };
    this.handleClick = this.handleClick.bind(this);
    socket.on('participants list', (data) => this.setState(() => ({participants: data})));
  }

  componentDidMount() {
    socket.emit('get participants', {query: this.props.match.params.id})
  }

  handleClick(name) {
    socket.emit('add participant', {query: this.props.match.params.id, name});
  }

  render() {
    return (
      <div className="participants">
        <p>Participants</p>
        <Friends color="green" friends={this.state.participants}/>
        <p>Invite some friends</p>
        <Friends color="green" friends={lodash.differenceBy(this.props.user.friends, this.state.participants, 'name')}
                 handleClick={this.handleClick}/>
      </div>
    );
  }
}

Participants.propTypes = {
  user: PropTypes.object,
  match: PropTypes.object,
};

export default Participants;
