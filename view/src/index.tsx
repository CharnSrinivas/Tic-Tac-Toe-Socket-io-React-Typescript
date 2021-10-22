import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Containers/App';
import {Provider} from 'react-redux'
import store from './Redux/store'
import swDev from './swDev';
swDev();
ReactDOM.render(
  <Provider store={store}>{
    
    // console.log(store.getState())
    
  }
    <App />
  </Provider>,
  document.getElementById('root')
);

