import React from 'react';
import PropTypes from 'prop-types';

class PieceInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pos: this.props.pos
    };
  }

  render() {
    let {x, y} = this.props;
    let style = {
      backgroundImage: `url("/${this.props.src}.jpg")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '600px 400px',
      height: '100px',
      width: '100px',
      display: 'inline-block',
      opacity: 0.3
    };
    if (this.props.disabled) {
      style.opacity = 1;
      return (
        <div style={{...style, backgroundPosition: `${x}px ${y}px`}}/>
      );
    }
    return (
      <div style={{...style, backgroundPosition: `${x}px ${y}px`}} onDrop={() => this.props.handleDrop({x, y})}
           onDragOver={e => e.preventDefault()}/>
    );
  }
}

PieceInspector.propTypes = {
  pos: PropTypes.string,
  handleDrop: PropTypes.func,
  disabled: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  src: PropTypes.string,
};

export default PieceInspector;
