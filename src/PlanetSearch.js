import React, { Component } from 'react';
import './PlanetSearch.css';
import {browserHistory} from 'react-router';
class PlanetSearch extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			planets: [],
			filteredPlanets: [],
			planet: null
		}
		this.onSearch = this.onSearch.bind(this)
		this.removePopUp = this.removePopUp.bind(this)
		this.onLogout = this.onLogout.bind(this)
	}

	componentDidMount() {
		console.log("componentDidMount");
		if (localStorage.getItem("name") == "") {
			console.log("Yes already logged In");
			browserHistory.goBack();
		}
		fetch("https://swapi.co/api/planets/")
		.then(response => response.json())
		.then(data => {
			var array = data.results.sort(function(planet1, planet2){
				return parseInt(planet1.diameter) < parseInt(planet2.diameter)
			});
			console.log("Sorted Array: ",array);
			this.setState({planets: array, filteredPlanets: array});
		})
	}

	componentWillMount() {
		console.log("componentWillMount");
	}

	onLogout() {
		localStorage.setItem("name", "");
		browserHistory.goBack();
	}

	onSearch(event) {
		console.log(this.state.filteredPlanets);
		var array = this.state.filteredPlanets.filter(planet => {
			console.log("search text:::::" + event.target.value);
			return planet.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
		});
		this.setState({planets: array});
	}

	removePopUp(event){
		document.getElementById("planetDetail").style.display = "none";
	}

	render() {
		return (
			<div>
				<div class="topnav">
					<a class="active" href="javascript:void(0);">Welcome <i>{localStorage.getItem("name")}</i></a>
					<a  href="javascript:void(0);" onClick={this.onLogout} class="closeLink">Logout</a>
					<input type="text" placeholder="Enter planet name here to search....." onChange = {this.onSearch} />
				</div>
				<div class="planetList">
				<PlanetList planets={this.state.planets} />
				</div>
				
			</div>
		);
	}
}

class PlanetDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			planet: null
		}
	}

	render() {
		const planet = this.props.planet
		return(
			<ul class="planetInfoUL">
				<li class="planetInfo">Name: {planet.name}</li>
				<li class="planetInfo">Population: {planet.population}</li>
				<li class="planetInfo">Rotation Period: {planet.rotation_period}</li>
				<li class="planetInfo">Orbital Period: {planet.orbital_period}</li>
				<li class="planetInfo">Diameter: {planet.diameter}</li>
				<li class="planetInfo">Climate: {planet.climate}</li>
				<li class="planetInfo">Climate: {planet.gravity}</li>
				<li class="planetInfo">Terrain: {planet.terrain}</li>
				<li class="planetInfo">Surface Water: {planet.surface_water}</li>
			</ul>
		);
	}
}

class PlanetList extends React.Component {
	
	constructor(props){
		super(props)
		this.state = {
			planet: null
		}
		this.handleClick = this.handleClick.bind(this);
		this.removePopUp = this.removePopUp.bind(this)
	}
	
	removePopUp(event){
		document.getElementById("planetDetail").style.display = "none";
		this.setState({planet: null})
	}

	handleClick(event){
		
		let array = this.props.planets.filter(planet => {
			if(planet.name.toLowerCase() == event.target.innerHTML.toLowerCase()) {
				return true
			} else {
				return false
			}
		});
		console.log(array);
		this.setState({planet: array[0]});
		
	}

	render() {

	  return (
		<div>
			{this.state.planet !=null?
			<div class="popupBox" id="planetDetail">
				<a href="javascript:void(0);" onClick={this.removePopUp}>Close</a>
				<PlanetDetail planet={this.state.planet}/> 
			</div> :null}
			<ul class="listing">
				{this.props.planets.map(planet => (
				<li class="licss" onClick={this.handleClick}>{planet.name}</li>
				))}
			</ul>
	  	</div>
	  );
	}
  }
  

export default PlanetSearch;