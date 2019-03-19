import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HomePage from "./components/HomePage";
import {addToCart} from './action/index';
import Login from "./components/LoginForm";
import registerForm from "./components/registerForm";
import forgotPassword from "./components/forgotPassword";
import ViewOrders from "./components/viewOrders";
import AdminDashboard from "./components/AdminDashboard";
import {LoginUpdate} from "./action/index";
import Favicon from 'react-favicon';


class App extends Component {

 constructor(props) {
 	super(props);
 	this.state = {
 		 LoginID: "",
 		 LoginName: "",
 	}
 }

componentDidMount() {
	this.state.LoginID = localStorage.getItem('EMPID');
    this.state.LoginName = localStorage.getItem('EMPName');
    
}
    render() {
    		
        return (
            <div>
                <Favicon url="http://202.129.196.131:8085/synergy/public/favicon.png" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
                
                 <Router>
			      	<div>
				      <Route exact path='/login'  component={Login} />
				      <Route exact path='/register' component={registerForm} />
				      <Route exact path='/forgotPassword' component={forgotPassword} />
				      <Route exact path='/' component={HomePage} />
                      <Route exact path='/view' component={ViewOrders} />
                      <Route exact path='/admin' component={AdminDashboard} />
				      <h4 className="text-center">©  CG-VAK Software & Exports Ltd. 2019</h4>
			    	</div>

			    </Router> 
            </div>
        
        );
    }
}

function mapStateToProps(LoginaArray) {
    return {LoginaArray};
}


export default connect(mapStateToProps,null)(App);
