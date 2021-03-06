// @flow

import { applyMiddleware, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createLogger from 'redux-logger'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { makeRootReducer } from './reducers'
import sagas from './sagas'


export default (initialState: Object = {}, history: Object) => {
  const rootReducer = makeRootReducer()
  const sagaMiddleware = createSagaMiddleware()
  const loggerMiddleware = createLogger({ collapsed: true })

  const middleware = [routerMiddleware(history), sagaMiddleware, loggerMiddleware]
  const enhancers = []

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  )

  sagaMiddleware.run(sagas)

  // if (module.hot) {
  //   module.hot.accept('./reducers', () => {
  //     const reducers = require('./reducers').default
  //     console.log('replace Reducer', reducers)
  //     store.replaceReducer(connectRouter(history)(reducers))
  //   })
  // }

  return store
}
