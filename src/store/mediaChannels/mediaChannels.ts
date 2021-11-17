import { combineReducers } from 'redux'

import { reduceReducers } from '../../services/store'
import byIdReducer from './byId'

export default combineReducers({
  byId: reduceReducers({}, byIdReducer),
})
