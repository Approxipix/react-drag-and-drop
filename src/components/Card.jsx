import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardHeader, CardTitle, Detail, MovableCardWrapper } from '../styles/Base.jsx';

class Card extends Component {
  renderBody = () => {
    const { title, description } = this.props;
    return (
      <div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <Detail>{description}</Detail>
      </div>
    )
  };

  render() {
    const { id, cardStyle, dragStyle, ...otherProps } = this.props;
    return (
      <MovableCardWrapper
        key={id}
        data-id={id}
        style={{ ...cardStyle, ...dragStyle }}
        {...otherProps}
      >
        {this.renderBody()}
      </MovableCardWrapper>
    )
  }
}

Card.defaultProps = {
  cardStyle: {},
  dragStyle: {}
};

Card.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  index: PropTypes.number,
  description: PropTypes.string,
  label: PropTypes.string,
  laneId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  metadata: PropTypes.object,
  cardStyle: PropTypes.object,
  dragStyle: PropTypes.object
};

export default Card
