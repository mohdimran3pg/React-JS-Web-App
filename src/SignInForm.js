import React, { Component } from 'react';
import './SignInForm.css';
import './loader.css';
import {browserHistory} from 'react-router';
class SignInFormVC extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
		  username: "",
		  password: "",
		  name: "",
		  films:[]
    	};
		this.handleMyInput = this.handleMyInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	
	
	handleSubmit(event) {
		
		if(this.state.username.trim().length === 0) {
			alert('Please enter username');
		}else if(this.state.password.length === 0) {
			alert('Please enter password');
		}else {
		   document.getElementById("loader-view").style.display = "block";
		   fetch('https://swapi.co/api/people/?search='+this.state.username)
      		.then(response => response.json())
      		.then(data => {
      			document.getElementById("loader-view").style.display = "none";
      			if (this.isValidLogin(data)) {
					localStorage.setItem("name", this.state.username);
					browserHistory.push('/planets')
				} else {
					alert('Username or password is wrong.');
				}
			  })
			  .catch(error => {
				  document.getElementById("loader-view").style.display = "none";
				  alert(error)
			  });
		}
		event.preventDefault();
	}
	
	handleMyInput(event){
	    const name = event.target.name
	    const value = event.target.value	
		this.setState({
      		[name]: value
    	});
	}

	isValidLogin(data) {
		console.log("this is data: ",data)
		for(var i=0;i<data.results.length;i++){
			if(this.state.username.toLowerCase() === data.results[i].name.toLowerCase() && this.state.password === data.results[i].birth_year){
				return true
			}
		}
		return false
	}

	componentDidMount() {
		document.getElementById("loader-view").style.display = "none";
		if (localStorage.getItem("name") != "") {
			console.log("Yes already logged In");
			browserHistory.push('/planets')
		}
  	}

	render() {
		return (
		<body>
			<div id="container">       
				<form>
					<label for="username">Username:</label>
					<input type="text" id="username" name="username" onChange={this.handleMyInput} /><br/>
					<label for="password">Password:</label>
					<input type="password" id="password" name="password" onChange={this.handleMyInput} />
					<div>
						<input type="button" id="login" value="Login" onClick={this.handleSubmit} />
					</div>
				</form>
			</div>
			<div class="transparent-div" id="loader-view">
				<img src="/images/loader.gif" class="loader-img" />
			</div>
	   </body>    
    );
  }
}

export default SignInFormVC;