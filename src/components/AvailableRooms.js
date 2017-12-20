import '../styles/availableRoom.css';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { socket } from 'actions';

class AvailableRooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: []
    };
    socket.on('rooms list', (data) => {
      this.setState(() => ({rooms: data}));
    });
  }

  componentDidMount() {
    socket.emit('get rooms', {user: this.props.user});
  }

  render() {
    return (
      <div>
        {this.state.rooms.map((item, i) => (
          <Link key={i} className="available-room" to={`/app/${item.name}`}>
            <img src={`http://localhost:3000/${item.name}.jpg`}/>
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
    );
  }
}

AvailableRooms.propTypes = {
  user: PropTypes.object,

};

export default AvailableRooms;
