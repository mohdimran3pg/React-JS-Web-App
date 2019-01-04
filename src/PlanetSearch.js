import React, { Component } from 'react';
import './PlanetSearch.css';
import {browserHistory} from 'react-router';
import {DebounceInput} from 'react-debounce-input';
class PlanetSearch extends React.Component {

	constructor(props) {
		super(props);
		var datetime = new Date();
		this.state = {
			planets: [],
			filteredPlanets: [],
			planet: null,
			planetArray: [],
			curretDateTime: datetime,
			apiCounter: 0,
		}
		this.onSearch = this.onSearch.bind(this)
		this.removePopUp = this.removePopUp.bind(this)
		this.onLogout = this.onLogout.bind(this)
		//this.onStartTimer = this.onStartTimer.bind(this)
	}

	myTimer() {
		var d = new Date();
		var dt = new Date("2018-12-31");
		//console.log(dt);
	}

	componentDidMount() {

		console.log("componentDidMount");
		if (localStorage.getItem("name") == "") {
			console.log("Yes already logged In");
			browserHistory.goBack();
		}
		document.getElementById("loader-view").style.display = "block";
		this.fetchPlanets("https://swapi.co/api/planets/?page=1");
		setInterval(this.myTimer, 1000);
	}

	componentWillMount() {
		console.log("componentWillMount");
	}

	onLogout() {
		localStorage.setItem("name", "");
		browserHistory.goBack();
	}

	onSearch(event) {

		//https://swapi.co/api/planets/?search=al
		this.searchPlanets("https://swapi.co/api/planets/?search="+event.target.value.toLowerCase(), event.target.value)

		// console.log(this.state.filteredPlanets);
		// var array = this.state.filteredPlanets.filter(planet => {
		// 	console.log("search text:::::" + event.target.value);
		// 	return planet.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
		// });
		// this.setState({planets: array});
	}

	removePopUp(event){
		document.getElementById("planetDetail").style.display = "none";
	}

	searchPlanets(url, searchKeyword) {
		
		console.log("URL:::", url);
		if(searchKeyword == "") {
			console.log("Search Keyword:::", searchKeyword);
			this.setState({planets: this.state.filteredPlanets});
		} else {

			document.getElementById("loader-view").style.display = "block";
		fetch(url)
		.then(response => response.json())
		.then(data => {
			if (data.results != null) {
				this.setState({planets: [], curretDateTime: datetime});
				this.setState({planetArray: [], curretDateTime: datetime});
				console.log("Search Results:::",data.results);
				for (var index = 0; index < data.results.length; index++ ) {
					this.state.planetArray.push(data.results[index]);
				}
			}

			var array = this.state.planetArray.sort(function(planet1, planet2){
				return parseInt(planet1.population) > parseInt(planet2.population)
			});
			var datetime = new Date();
			//console.log("Sorted Array: ",array, "Date Time:::", datetime);
			this.setState({planets: array, curretDateTime: datetime});
			document.getElementById("loader-view").style.display = "none";
			console.log("Date Time:::", this.state.curretDateTime);
		})
		}
		
	}

	fetchPlanets(url) {
		fetch(url)
		.then(response => response.json())
		.then(data => {
			//console.log("This is whole JSON: ",data);
			//this.setState({planetArray: data.results});
			//this.state.planetArray.push(data.results);
			//console.log("This is whole JSON planetArray : ",this.state.planetArray);
			if (data.results != null) {
				for (var index = 0; index < data.results.length; index++ ) {
					this.state.planetArray.push(data.results[index]);
				}
				console.log("planetArray:::",this.state.planetArray.length);
			}
			if (data.next != null) {
				this.state.apiCounter += 1
				document.getElementById("loader-view").style.display = "none";
				this.setState({planets: this.state.planetArray, filteredPlanets: this.state.planetArray, curretDateTime: datetime});
				this.fetchPlanets(data.next);
			} else {
				
				var array = this.state.planetArray.sort(function(planet1, planet2){
					return parseInt(planet1.population) > parseInt(planet2.population)
				});
				var datetime = new Date();
				//console.log("Sorted Array: ",array, "Date Time:::", datetime);
				this.setState({planets: array, filteredPlanets: array, curretDateTime: datetime});
				//document.getElementById("loader-view").style.display = "none";
				console.log("Date Time:::", this.state.curretDateTime);
			}
		})
	}

	render() {
		return (
			<div>
				<div class="topnav">
					<a class="active" href="javascript:void(0);">Welcome <i>{localStorage.getItem("name")}</i></a>
					<a  href="javascript:void(0);" onClick={this.onLogout} class="closeLink">Logout</a>
					<DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange={this.onSearch} />
				</div>
				<div class="planetList">
				<PlanetList planets={this.state.planets} />
				</div>
				<div class="transparent-div" id="loader-view">
					<img src="/images/loader.gif" class="loader-img" />
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

	getFormatterNumber(population) {
		return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}

	render() {
		const planet = this.props.planet
		return(
			<ul class="planetInfoUL">
				<li class="planetInfo">Name: {planet.name}</li>
				<li class="planetInfo">Population: {this.getFormatterNumber(planet.population)}</li>
				<li class="planetInfo">Rotation Period: {this.getFormatterNumber(planet.rotation_period)}</li>
				<li class="planetInfo">Orbital Period: {this.getFormatterNumber(planet.orbital_period)}</li>
				<li class="planetInfo">Diameter: {this.getFormatterNumber(planet.diameter)}</li>
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

	getFontSize(population) {
		console.log("population:::::::",parseInt(population))

		let value = parseInt(population)
		let minFontSize = 15;
		if (isNaN(value)) {
			return minFontSize - 3;
		} else {

			if (value >= 1000 && value <= 50000) {
				return minFontSize;
			} else if (value > 50000 && value <= 1500000) {
				return minFontSize + 2.5;
			}else if (value > 1500000 && value <= 3000000) {
				return minFontSize + 5;
			}else if (value > 3000000 && value <= 6000000) {
				return minFontSize + 7.5;
			}else if (value > 6000000 && value <= 9000000) {
				return minFontSize + 10;
			}else if (value > 9000000 && value <= 15000000) {
				return minFontSize + 12.5;
			}else if (value > 15000000 && value <= 100000000) {
				return minFontSize + 15;
			}else if (value > 100000000 && value <= 500000000) {
				return minFontSize + 17.5;
			}else if (value > 500000000 && value <= 1000000000) {
				return minFontSize + 20;
			} else {
				return 40
			}
		}
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
				<li class="licss" onClick={this.handleClick} style={{fontSize: this.getFontSize(planet.population)}}>{planet.name}{this.state.population}</li>
				))}
			</ul>
	  	</div>
	  );
	}
  }
  

export default PlanetSearch;