import * as React from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';

function App() {
  return (
    <ReduxProvider store={store}>
      <AppInner />
    </ReduxProvider>
  );
}

export default App;
