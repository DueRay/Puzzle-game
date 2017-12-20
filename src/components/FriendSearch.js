import React from 'react';
import PropTypes from 'prop-types';
import Friends from './Friends';
import { socket } from 'actions';

class FriendSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: []
    };
    this.search = this.search.bind(this);
    socket.on('friends search result', (data) => {
      this.setState(() => ({friends: data}));
    });
  }

  search() {
    if (this.query.value === '') {
      this.setState(() => ({friends: []}));
    } else {
      socket.emit('friends search', {query: this.query.value, user: this.props.user});
    }
  }

  render() {
    return (
      <div>
        <div>
          <input type="text" ref={e => this.query = e} onChange={this.search}/>
        </div>
        <Friends friends={this.state.friends} handleClick={this.props.requestFriend} color={'red'}/>
      </div>
    );
  }
}

FriendSearch.propTypes = {
  user: PropTypes.object,
  requestFriend: PropTypes.func,
};

export default FriendSearch;
