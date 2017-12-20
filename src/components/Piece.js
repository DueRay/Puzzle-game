import React from 'react';
import PropTypes from 'prop-types';

class Piece extends React.Component {
  constructor() {
    super();
  }

  render() {
    let {x, y, disabled} = this.props;
    let style = {
      backgroundImage: `url("/${this.props.src}.jpg")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '600px 400px',
      height: '100px',
      width: '100px',
      margin: '10px',
      display: 'inline-flex',
      cursor: 'pointer',
      opacity: 1
    };
    if (disabled) {
      return null;
    }
    return (
      <div style={{...style, backgroundPosition: `${x}px ${y}px`}} data-pos={{x: this.props.x, y: this.props.y}}
           draggable={true} onDragStart={() => this.props.handleStart({x, y})}/>
    );
  }
}

Piece.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  position: PropTypes.object,
  handleStart: PropTypes.func,
  src: PropTypes.string,
};

export default Piece;
