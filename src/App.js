import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PlanetSearch from './PlanetSearch.js';
import SignInFormVC from './SignInForm.js';
import {Router, Route, browserHistory} from 'react-router';

const Loginpage = () => (
	<SignInFormVC />
  );
  
  const Home = () => (
	<PlanetSearch />
  );

class App extends Component {
	render() {
		return (<Router history = {browserHistory}>
			<div className="App">
			  <Route path='/planets' component={Home} />
			  <Route  path='/'  component={Loginpage} />
			</div>
		  </Router>);
	}
	
}

export default App;