import {combineReducers} from '@reduxjs/toolkit';
import userSlice from '../slices/userSlice';
import orderSlice from '../slices/orderSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
