import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import API from '../api/api';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import './LoginForm.css';
import {LoginUpdate} from "../action/index";
import LoginpageHeader from "./LoginpageHeader";



axios.defaults.xsrfHeaderName = "X-CSRFToken";

class LoginForm extends Component {
 
  constructor(props) {
    super(props);
     this.state = {
        empID: "",
        password: "",
        errors: 0,
        Failed: 0,
        ErrorMsg: ''
      };
  
  }

 componentDidMount() {

  document.title = "CG-VAK Cafeteria - Login";
    var EMPId = localStorage.getItem('EMPID');
    var EMPType = localStorage.getItem('EMPType');
    if(EMPId)
    {
      if(EMPType == 1)
      {
        window.location.href= "/admin";
      } else {
        window.location.href= "/";
      }
    }
  }

  validateForm() {
    return this.state.empID.length > 0 && this.state.password.length > 0;
  }



  handleChangeID = event => {

    const rules = /^[0-9\b]+$/;
    if (event.target.value === '' || rules.test(event.target.value))
    {
       this.setState({
        [event.target.id]: event.target.value
      });
    }
   
  }



  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  

  handleSubmit = event => {
    event.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.set('empID', this.state.empID);
    bodyFormData.set('password', this.state.password);
    API({
        url:'login',
        method: 'post',
        data: bodyFormData,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        config: { headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then(res => {
          if(res.data == '')
          {
             this.setState({
                Failed: 1
             })
             this.state.ErrorMsg = ('<h1>TEST</h1>');
            
          } 
          else 
          {
            this.setState({
                Failed: 0
             })
            for(var i=0; i<res.data.length; i++)
            {
                this.props.LoginUpdate(res.data[i]);
                localStorage.setItem('EMPID', res.data[i].emp_id);
                localStorage.setItem('EMPName', res.data[i].emp_name);
                localStorage.setItem('EMPType', res.data[i].emp_userType);
                
            }
            var EMPType = localStorage.getItem('EMPType');
            if(EMPType == 1)
            {
              window.location.href= "/admin";
            } else {
              window.location.href= "/";
            }
          }
        })
        .catch(error => {
            console.log(error)
        });
  }

  render() {
    let {empID, password, Failed} = this.state;

    return (
      <div>
      <div className="overlay"></div>
      <div className="LoginCover">
        <div className="text-center">
          <h1>CG-VAK Cafeteria</h1>      
          <p>Powered by Achi Mess</p>
        </div>
       <div className="Login">
       
        <form className="padd-bottom" onSubmit={this.handleSubmit}>

        {this.state.Failed ? (
              <div className="alert alert-danger">
              <strong>Invalid!</strong> Check Username and Password.
              </div>
          ): (
              ''
          )
        }

          <FormGroup controlId="empID" bsSize="large">
            <ControlLabel>Employee ID</ControlLabel>
            <FormControl
              autoFocus
              maxLength = "4"
              type="text"
              placeholder = "1234"
              value={this.state.empID}
              onChange={this.handleChangeID}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              placeholder = "*****"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
           <a href="/register">Register </a>  <a className="float-right" href="/forgotPassword">Forget Password </a>
        </form>
      </div>
      </div>
      </div>
    )
  }



}

function mapStateToProps(LoginaArray) {
    return {LoginaArray};
}

function  mapDispatchToProps(dispatch) {
    return {
        LoginUpdate : (item) => dispatch(LoginUpdate(item))
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginForm);