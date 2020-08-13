import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Container, Draggable } from 'react-smooth-dnd';

import Card from './Card.jsx'
import { LaneHeader, ScrollableLane, Section, Title } from '../styles/Base.jsx'

import * as laneActions from '../actions/LaneActions'

class Lane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentPage: props.currentPage,
      collapsed: false,
      isDraggingOver: false
    };
  }

  handleScroll = evt => {
    const node = evt.target;
    const { id, onLaneScroll } = this.props;
    const { currentPage, loading } = this.state;
    const elemScrollPosition = node.scrollHeight - node.scrollTop - node.clientHeight;

    if (elemScrollPosition <= 0 && onLaneScroll && !loading) {
      this.setState({ loading: true });
      const nextPage = currentPage + 1;
      onLaneScroll(nextPage, id).then(moreCards => {
        if (!moreCards || moreCards.length === 0) {
          node.scrollTop = node.scrollTop - 100
        } else {
          this.props.actions.paginateLane({
            laneId: id,
            newCards: moreCards,
            nextPage: nextPage
          })
        }
        this.setState({ loading: false })
      })
    }
  };

  sortCards(cards, sortFunction) {
    if (!cards) return [];
    if (!sortFunction) return cards;
    return cards.concat().sort(function (card1, card2) {
      return sortFunction(card1, card2)
    })
  }

  laneDidMount = node => {
    if (node) {
      node.addEventListener('scroll', this.handleScroll)
    }
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.cards, nextProps.cards)) {
      this.setState({
        currentPage: nextProps.currentPage
      })
    }
  }

  handleCardClick = (e, card) => {
    const { onCardClick } = this.props;
    onCardClick && onCardClick(card.id, card.metadata, card.laneId);
    e.preventDefault()
  };

  onDragStart = ({ payload }) => {
    const { handleDragStart } = this.props;
    handleDragStart && handleDragStart(payload.id, payload.laneId)
  };

  shouldAcceptDrop = sourceContainerOptions => {
    return this.props.droppable && sourceContainerOptions.groupName === 'CotanoLane'
  };

  onDragEnd = (laneId, result) => {
    const { handleDragEnd } = this.props;
    const { addedIndex, payload } = result;
    if (addedIndex != null) {
      this.props.actions.moveCardAcrossLanes({
        fromLaneId: payload.laneId,
        toLaneId: laneId,
        cardId: payload.id,
        index: addedIndex
      });
      handleDragEnd && handleDragEnd(payload.id, payload.laneId, laneId, addedIndex, payload)
    }
  };

  renderDragContainer = isDraggingOver => {
    const {
      laneSortFunction,
      cardStyle,
      draggable,
      cardDraggable,
      cards,
      cardDragClass,
      id
    } = this.props;
    const { collapsed } = this.state;

    const showableCards = collapsed ? [] : cards;
    const cardList = this.sortCards(showableCards, laneSortFunction).map((card, idx) => {
      const cardToRender = (
        <Card
          key={card.id}
          index={idx}
          cardStyle={cardStyle}
          onClick={e => this.handleCardClick(e, card)}
          {...card}
        />
      );
      return draggable && cardDraggable
        ? <Draggable key={card.id}>{cardToRender}</Draggable>
        : <span key={card.id}>{cardToRender}</span>
    });

    return (
      <ScrollableLane innerRef={this.laneDidMount} isDraggingOver={isDraggingOver}>
        <Container
          orientation="vertical"
          groupName="CotanoLane"
          dragClass={cardDragClass}
          onDragStart={this.onDragStart}
          onDrop={e => this.onDragEnd(id, e)}
          onDragEnter={() => this.setState({ isDraggingOver: true })}
          onDragLeave={() => this.setState({ isDraggingOver: false })}
          shouldAcceptDrop={this.shouldAcceptDrop}
          getChildPayload={index => this.props.getCardDetails(id, index)}
        >
          {cardList}
        </Container>
      </ScrollableLane>
    )
  };

  renderHeader = () => {
    const { title, titleStyle } = this.props;
    return (
      <LaneHeader onDoubleClick={this.toggleLaneCollapsed}>
        <Title style={titleStyle}>{title}</Title>
      </LaneHeader>
    )
  };

  toggleLaneCollapsed = () => {
    this.props.collapsibleLanes && this.setState(state => ({ collapsed: !state.collapsed }))
  };

  render() {
    const { isDraggingOver } = this.state;
    const { id, onLaneClick, ...otherProps } = this.props;
    return (
      <Section {...otherProps} key={id} onClick={() => onLaneClick && onLaneClick(id)} draggable={false}>
        {this.renderHeader()}
        {this.renderDragContainer(isDraggingOver)}
      </Section>
    )
  }
}

Lane.propTypes = {
  actions: PropTypes.object,
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  title: PropTypes.node,
  index: PropTypes.number,
  laneSortFunction: PropTypes.func,
  style: PropTypes.object,
  cardStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  cards: PropTypes.array,
  label: PropTypes.string,
  currentPage: PropTypes.number,
  draggable: PropTypes.bool,
  collapsibleLanes: PropTypes.bool,
  droppable: PropTypes.bool,
  onLaneScroll: PropTypes.func,
  onCardClick: PropTypes.func,
  onLaneClick: PropTypes.func,
  cardDraggable: PropTypes.bool,
  cardDragClass: PropTypes.string
};

Lane.defaultProps = {
  style: {},
  titleStyle: {},
  labelStyle: {},
  label: undefined,
  editable: false
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(laneActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Lane)
