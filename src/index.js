import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import reducer from './reducer';
import { Provider } from 'react-redux';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
  .catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
}

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
	
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));

