import '../styles/main.css';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { socket } from 'actions';
import Header from './Header';
import Registration from './Registration';
import Friends from './Friends';
import FriendSearch from './FriendSearch';
import CreateRoom from "./CreateRoom";
import AvailableRooms from './AvailableRooms';
import main1 from 'images/main1.jpg';
import main2 from 'images/main2.jpg';
import main3 from 'images/main3.jpg';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.requestFriend = this.requestFriend.bind(this);
    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    socket.on('update user', (data) => this.props.dispatch({type: 'SET_USER', user: data}));
  }

  requestFriend(name) {
    socket.emit('request friend', {query: name, user: this.props.user});
  }

  acceptFriendRequest(name) {
    socket.emit('accept friend request', {query: name, user: this.props.user});
  }

  render() {
    return (
      <div>
        <Header {...this.props} dispatch={this.props.dispatch} authorized={this.props.authorized}
                user={this.props.user}/>
        <div className="content">
          <div className="main__left">
            {!this.props.authorized &&
            <div>
              <p className="main__greeting">Welcome to the Puzzle game website!</p>
              <p className="main__text">Here you can collect puzzles together with friends</p>
              <p className="main__text">Upload any picture and make puzzles from it</p>
            </div>}
            {this.props.authorized && <CreateRoom user={this.props.user} history={this.props.history}/>}
            {this.props.authorized &&
            <div>
              <p className="main__text">Available puzzle games for you</p>
              <AvailableRooms user={this.props.user}/>
            </div>}
            {!this.props.authorized &&
            <div className="main__gallery">
              <img src={main1} className="main__img"/>
              <img src={main2} className="main__img"/>
              <img src={main3} className="main__img"/>
            </div>}
          </div>
          <div className="main__right">
            {this.props.authorized
              ? <div>
                <p>Your friends</p>
                <Friends friends={this.props.user.requested_friends} handleClick={this.acceptFriendRequest} color={'blue'}/>
                <Friends friends={this.props.user.friends} color={'green'}/>
                <p>Search new friends</p>
                <FriendSearch user={this.props.user} requestFriend={this.requestFriend}/>
              </div>
              : <Registration dispatch={this.props.dispatch} user={this.props.user} authorized={this.props.authorized}/>}
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  authorized: PropTypes.bool,
  user: PropTypes.object,
  dispatch: PropTypes.func,
  history: PropTypes.object,
};

export default connect((state) => ({
  authorized: state.authorized,
  user: state.user,
}))(Main);
