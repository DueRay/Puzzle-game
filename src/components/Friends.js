import '../styles/friendsList.css';

import React from 'react';
import PropTypes from 'prop-types';

class Friends extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="friends-list">
        {this.props.friends.map(friend => (
          <div key={friend.name} className={`friend friend_${this.props.color}`} onClick={() => this.props.handleClick(friend.name)}>
            <p className="friend__text">{friend.name}</p>
          </div>
        ))}
      </div>
    )
  }
}

Friends.propTypes = {
  friends: PropTypes.array,
  handleClick: PropTypes.func,
  color: PropTypes.string,
};

Friends.defaultProps = {
  handleClick: () => ({})
};

export default Friends;
