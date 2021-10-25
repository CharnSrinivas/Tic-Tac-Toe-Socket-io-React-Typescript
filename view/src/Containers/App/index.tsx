import React from 'react';
import Home from '../Home'
import {BrowserRouter as Router ,Switch,Route} from 'react-router-dom'
import Game from '../Game';
export interface IAppProps {
}

export default class App extends React.Component<IAppProps> { 
constructor(props:any){
super(props);
}
  public render() {
    
    return (
    <Router>
      <Switch>  
        <Route path='/game'  exact component={Game}/>
        <Route path='/' exact component={Home}/>
      </Switch>
    </Router>
    );
  }
}
