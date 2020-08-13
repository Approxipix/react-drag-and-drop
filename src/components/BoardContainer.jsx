import React, { Component } from 'react'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import isEqual from 'lodash/isEqual'
import { BoardDiv } from '../styles/Base.jsx'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Lane from './Lane.jsx'
import { Container, Draggable } from 'react-smooth-dnd'

import * as boardActions from '../actions/BoardActions'
import * as laneActions from '../actions/LaneActions'

class BoardContainer extends Component {
  wireEventBus = () => {
    const { actions, eventBusHandle } = this.props;
    let eventBus = {
      publish: event => {
        switch (event.type) {
          case 'REFRESH_BOARD':
            return actions.loadBoard(event.data);
          case 'MOVE_CARD':
            return actions.moveCardAcrossLanes({
              fromLaneId: event.fromLaneId,
              toLaneId: event.toLaneId,
              cardId: event.cardId,
              index: event.index
            });
          case 'UPDATE_LANES':
            return actions.updateLanes(event.lanes)
        }
      }
    };
    eventBusHandle(eventBus)
  };

  componentWillMount() {
    const { actions, eventBusHandle } = this.props;
    actions.loadBoard(this.props.data);
    if (eventBusHandle) {
      this.wireEventBus()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data, reducerData, onDataChange } = this.props;
    if (nextProps.reducerData && !isEqual(reducerData, nextProps.reducerData)) {
      onDataChange(nextProps.reducerData)
    }
    if (nextProps.data && !isEqual(nextProps.data, data)) {
      this.props.actions.loadBoard(nextProps.data);
      onDataChange(nextProps.data)
    }
  }

  getCardDetails = (laneId, cardIndex) => {
    return this.props.reducerData.lanes.find(lane => lane.id === laneId).cards[cardIndex]
  };

  onDragStart = ({ payload }) => {
    const { handleLaneDragStart } = this.props;
    handleLaneDragStart(payload.id)
  };

  onLaneDrop = ({ removedIndex, addedIndex, payload }) => {
    const { actions, handleLaneDragEnd } = this.props;
    actions.moveLane({ oldIndex: removedIndex, newIndex: addedIndex });
    handleLaneDragEnd(payload.id, addedIndex)
  };

  getLaneDetails = index => {
    return this.props.reducerData.lanes[index]
  };

  render() {
    const {
      id,
      reducerData,
      draggable,
      laneDraggable,
      laneDragClass,
      style,
      ...otherProps
    } = this.props;
    const passthroughProps = pick(this.props, [
      'onLaneScroll',
      'onCardClick',
      'onLaneClick',
      'draggable',
      'cardDraggable',
      'collapsibleLanes',
      'handleDragStart',
      'handleDragEnd',
      'cardDragClass',
      'children'
    ]);

    return (
      <BoardDiv style={style} {...otherProps} draggable={false}>
        <Container
          orientation="horizontal"
          onDragStart={this.onDragStart}
          dragClass={laneDragClass}
          onDrop={this.onLaneDrop}
          lockAxis={'x'}  //x or y
          getChildPayload={index => this.getLaneDetails(index)}
          groupName={`Board${id}`}>
          {reducerData.lanes.map((lane, index) => {
            const { id, droppable, ...otherProps } = lane;
            const laneToRender = (
              <Lane
                key={id}
                id={id}
                getCardDetails={this.getCardDetails}
                index={index}
                droppable={droppable === undefined ? true : droppable}
                {...otherProps}
                {...passthroughProps}
              />
            );
            return draggable && laneDraggable
              ? <Draggable key={lane.id}>{laneToRender}</Draggable>
              : <span key={lane.id}>{laneToRender}</span>
          })}
        </Container>
      </BoardDiv>
    )
  }
}

BoardContainer.propTypes = {
  id: PropTypes.string,
  actions: PropTypes.object,
  data: PropTypes.object.isRequired,
  reducerData: PropTypes.object,
  onDataChange: PropTypes.func,
  eventBusHandle: PropTypes.func,
  onLaneScroll: PropTypes.func,
  onCardClick: PropTypes.func,
  onLaneClick: PropTypes.func,
  draggable: PropTypes.bool,
  handleDragStart: PropTypes.func,
  handleDragEnd: PropTypes.func,
  handleLaneDragStart: PropTypes.func,
  handleLaneDragEnd: PropTypes.func,
  style: PropTypes.object,
  laneDraggable: PropTypes.bool,
  cardDraggable: PropTypes.bool,
  cardDragClass: PropTypes.string,
  laneDragClass: PropTypes.string
};

BoardContainer.defaultProps = {
  onDataChange: () => {},
  handleDragStart: () => {},
  handleDragEnd: () => {},
  handleLaneDragStart: () => {},
  handleLaneDragEnd: () => {},
  draggable: false,
  collapsibleLanes: false,
  laneDraggable: true,
  cardDraggable: true,
  cardDragClass: 'react_dragClass',
  laneDragClass: 'react_dragLaneClass'
};

const mapStateToProps = state => state.lanes ? { reducerData: state } : {};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...boardActions, ...laneActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer)
