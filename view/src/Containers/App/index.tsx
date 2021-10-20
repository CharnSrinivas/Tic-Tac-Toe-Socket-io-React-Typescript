import React from 'react';
import Home from '../Home'
import {BrowserRouter as Router ,Switch,Route} from 'react-router-dom'
import Board from '../../Components/Board/Board';
import swDev from '../../swDev';
export interface IAppProps {
}

export default class App extends React.Component<IAppProps> { 
constructor(props:any){
super(props);
swDev();
}
  public render() {
    
    return (
    <Router>
      <Switch>
        
        <Route path='/game'  exact component={Board}/>
        <Route path='/' exact component={Home}/>
      </Switch>
    </Router>
    );
  }
}
