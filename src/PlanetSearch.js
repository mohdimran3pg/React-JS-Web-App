import React, { Component } from 'react';
import './PlanetSearch.css';
import {browserHistory} from 'react-router';
import {DebounceInput} from 'react-debounce-input';
class PlanetSearch extends React.Component {

	
	constructor(props) {
		super(props);
		var searchAttempt = 0;
		this.state = {
			planets: [],
			filteredPlanets: [],
			planet: null,
			planetArray: [],
			apiCounter: 0,
		}
		this.onSearch = this.onSearch.bind(this)
		this.removePopUp = this.removePopUp.bind(this)
		this.onLogout = this.onLogout.bind(this)
	}

	componentDidMount() {

		this.searchAttempt = 0;
		console.log("componentDidMount");
		if (localStorage.getItem("name") == "") {
			console.log("Yes already logged In");
			browserHistory.goBack();
		}
		document.getElementById("loader-view").style.display = "block";
		this.fetchPlanets("https://swapi.co/api/planets/?page=1");
	}

	componentWillMount() {
		console.log("componentWillMount");
	}

	onLogout() {
		localStorage.setItem("name", "");
		browserHistory.goBack();
	}

	startTimer() {
		setTimeout(() => {
			this.cleanAttempt()
		}, 1000*60);
		//setInterval(this.cleanAttempt(), 1000*10);
	}

	cleanAttempt() {
		this.searchAttempt = 0;
		console.log("Clean Timer:::::");
	}

	onSearch(event) {

		console.log("this.searchAttempt::::", this.searchAttempt);

		if(this.searchAttempt == 0) {

			this.startTimer()
			
		} 

		this.searchAttempt += 1
		if(this.searchAttempt > 5 && localStorage.getItem("name").toLowerCase().trim() != "luke skywalker") {
			alert("You have already made 5 search attempt");
		} else {
			
			this.searchPlanets("https://swapi.co/api/planets/?search="+event.target.value.toLowerCase(), event.target.value)
		}

		
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
				this.setState({planets: [], planetArray: []});
				console.log("Search Results:::",data.results);
				for (var index = 0; index < data.results.length; index++ ) {
					this.state.planetArray.push(data.results[index]);
				}
			}

			var array = this.state.planetArray.sort(function(planet1, planet2){
				return parseInt(planet1.population) > parseInt(planet2.population)
			});
			var datetime = new Date();
			this.setState({planets: array});
			document.getElementById("loader-view").style.display = "none";
			console.log("Date Time:::", this.state.curretDateTime);
		})
		.catch(error => {
			document.getElementById("loader-view").style.display = "none";
			alert(error)
		});
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
				//console.log("planetArray:::",this.state.planetArray.length);
			}
			if (data.next != null) {
				this.state.apiCounter += 1
				document.getElementById("loader-view").style.display = "none";
				this.setState({planets: this.state.planetArray, filteredPlanets: this.state.planetArray});
				this.fetchPlanets(data.next);
			} else {
				
				var array = this.state.planetArray.sort(function(planet1, planet2){
					return parseInt(planet1.population) > parseInt(planet2.population)
				});
				var datetime = new Date();
				//console.log("Sorted Array: ",array, "Date Time:::", datetime);
				this.setState({planets: array, filteredPlanets: array});
				//document.getElementById("loader-view").style.display = "none";
				//console.log("Date Time:::", this.state.curretDateTime);
			}
		})
		.catch(error => {
			document.getElementById("loader-view").style.display = "none";
			alert(error)
		});
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
				<li class="planetInfo"><span class="headingSpan">Name:</span> <span class="planetDetailInfo">{planet.name}</span> </li>
				<li class="planetInfo"><span class="headingSpan">Population:</span>  <span class="planetDetailInfo">{this.getFormatterNumber(planet.population)}</span></li>
				<li class="planetInfo"><span class="headingSpan">Rotation Period:</span>  <span class="planetDetailInfo">{this.getFormatterNumber(planet.rotation_period)}</span></li>
				<li class="planetInfo"><span class="headingSpan">Orbital Period:</span>  <span class="planetDetailInfo">{this.getFormatterNumber(planet.orbital_period)}</span></li>
				<li class="planetInfo"><span class="headingSpan">Diameter:</span>  <span class="planetDetailInfo">{this.getFormatterNumber(planet.diameter)}</span></li>
				<li class="planetInfo"><span class="headingSpan">Climate:</span>  <span class="planetDetailInfo">{planet.climate}</span></li>
				<li class="planetInfo"><span class="headingSpan">Climate:</span>  <span class="planetDetailInfo">{planet.gravity}</span></li>
				<li class="planetInfo"><span class="headingSpan">Terrain:</span>  <span class="planetDetailInfo">{planet.terrain}</span></li>
				<li class="planetInfo"><span class="headingSpan">Surface Water:</span> <span class="planetDetailInfo">{planet.surface_water}</span></li>
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
		//console.log("population:::::::",parseInt(population))

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
				<a href="javascript:void(0);" onClick={this.removePopUp} class="closePopUp">Close</a>
				<PlanetDetail planet={this.state.planet}/> 
			</div> :null}
			{this.props.planets.length != 0 ?
			<ul class="listing">
				
				{this.props.planets.map(planet => (
				<li class="licss" onClick={this.handleClick} style={{fontSize: this.getFontSize(planet.population)}}>{planet.name}{this.state.population}</li>
				)) 
				}
			</ul>
			: <img src="/images/no-planet-found.png" class="no-planet-not-found"/>}
			
	  	</div>
	  );
	}
  }
  

export default PlanetSearch;