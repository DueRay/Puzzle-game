import '../styles/header.css';
import logo from '../images/user.png';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { socket } from 'actions';
import Participants from './Participants';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.switchMenu = this.switchMenu.bind(this);
    socket.on('login success', (data) => {
      this.props.dispatch({type: 'SET_USER', user: data});
    });
    socket.on('login failed', () => {
      this.name.value = '';
      this.password.value = '';
    });
  }

  onSubmit() {
    socket.emit('login', {name: this.name.value, password: this.password.value});
  }

  switchMenu() {
    this.setState((prev) => ({menu: !prev.menu}));
  }

  render() {
    return (
      <div className="header">
        <Link to="/"><p className="logo">PUZZLE game</p></Link>
        {!this.props.authorized
          ? <div className="login">
              <input type="text" name="name" ref={e => this.name = e}
                     className="input"/>
              <input type="password" name="password" ref={e => this.password = e}
                     className="input"/>
              <button onClick={this.onSubmit}>Login</button>
            </div>
          : <div className="login">
            {this.props.match.params.id && this.props.owner && <p onClick={this.switchMenu} className="menu">Participants</p>}
            <p className="profile__name">{this.props.user.name}</p>
            <img src={logo} className="profile__img"/>
            <p onClick={() => this.props.dispatch({type: 'RESET_USER'})} className="logout">Logout</p>
          </div>}
          {this.state.menu && this.props.owner && <Participants {...this.props}/>}
      </div>
    )
  }
}

Header.propTypes = {
  authorized: PropTypes.bool,
  user: PropTypes.object,
  dispatch: PropTypes.func,
  match: PropTypes.object,
  owner: PropTypes.bool,
};

export default Header;
