import React from 'react';
import Home from '../Home'
import {BrowserRouter as Router ,Switch,Route} from 'react-router-dom'
<<<<<<< HEAD
import Board from '../Game/Board';
import swDev from '../../swDev';
=======
import Game from '../Game';
>>>>>>> 8596f5cb28f073edae1d00f48eaf1b6f0ca99449
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
