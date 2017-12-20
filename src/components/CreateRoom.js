import '../styles/createRoom.css';

import React from 'react';
import PropTypes from 'prop-types';
import { socket } from 'actions';
import ss from 'socket.io-stream';

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.stream = ss.createStream({});
    socket.on('create room success', (data) => this.props.history.push(`/app/${data.name}`))
  }

  handleClick() {
    ss(socket).emit('create room', this.stream, {name: this.name.value, user: this.props.user, extension: this.image.files[0].name.split('.').pop()});
    ss.createBlobReadStream(this.image.files[0], {}).pipe(this.stream);
  }

  render() {
    return (
      <div className="create-room">
        <p>Just load your favorite image and give the name to your puzzle</p>
        <input type="file" name="file" ref={e => this.image = e}/>
        <input type="text" name="name" ref={e => this.name = e}/>
        <button onClick={this.handleClick}>Create room</button>
      </div>
    );
  }
}

CreateRoom.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};

export default CreateRoom;
