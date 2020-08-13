import React, { Component } from 'react';
import BoardContainer from './BoardContainer.jsx';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import boardReducer from '../reducers/BoardReducer';
import logger from 'redux-logger';
import uuidv1 from 'uuid/v1';

const middlewares = process.env.NODE_ENV === 'development' ? [logger] : [];

class Board extends Component {
  constructor(props) {
    super(props);
    this.store = this.getStore();
    this.id = uuidv1()
  }

  getStore = () => createStore(boardReducer, applyMiddleware(...middlewares));

  render() {
    return (
      <Provider store={this.store}>
        <BoardContainer {...this.props} id={this.id}/>
      </Provider>
    )
  }
}

export default Board;
