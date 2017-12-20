import '../styles/registration.css';

import React from 'react';
import PropTypes from 'prop-types';
import { socket } from 'actions';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: ''
    };
    this.handleClick = this.handleClick.bind(this);
    socket.on('register success', (data) => {
      this.props.dispatch({type: 'SET_USER', user: data});
      this.name.value = '';
      this.password.value = '';
      this.setState(() => ({name: '', password: ''}));
    });
    socket.on('register failed', (data) => {
      this.setState(() => ({...data}));
    });
  }

  handleClick() {
    socket.emit('register', {name: this.name.value, password: this.password.value});
  }

  render() {
    return (
      <div className="registration">
        <p className="registration__label">User name</p>
        <input type="text" name="name" ref={e => this.name = e}/>
        <p className="registration__error">{this.state.name}</p>
        <p className="registration__label">Password</p>
        <input type="password" ref={e => this.password = e}/>
        <p className="registration__error">{this.state.password}</p>
        <button onClick={this.handleClick}>Register</button>
      </div>
    );
  }
}

Registration.propTypes = {
  dispatch: PropTypes.func,
};

export default Registration;
