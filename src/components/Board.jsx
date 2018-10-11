import React, {Component} from 'react'
import BoardContainer from './BoardContainer.jsx'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import boardReducer from '../reducers/BoardReducer'
import logger from 'redux-logger'
import uuidv1 from "uuid/v1"

const middlewares = process.env.NODE_ENV === 'development' ? [logger] : [];

export default class Board extends Component {
  constructor() {
    super();
    this.store = this.getStore();
    this.id = uuidv1()
  }

  getStore = () => {
    return createStore(boardReducer, applyMiddleware(...middlewares))
  };

  render() {
    return (
      <Provider store={this.store}>
        <BoardContainer {...this.props} id={this.id}/>
      </Provider>
    )
  }
}
