import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import API from '../api/api';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import './LoginForm.css';
import {LoginUpdate} from "../action/index";
import LoginpageHeader from "./LoginpageHeader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


axios.defaults.xsrfHeaderName = "X-CSRFToken";

class LoginForm extends Component {
 
  constructor(props) {
    super(props);
     this.state = {
        empID: "",
        password: "",
        Cpassword: "",
        SecurityQuestion: "",
        errors: 0,
        Failed: 0,
        disabled:0,
        disabledPass:0,
        ErrorMsg: ''
      };
  }

 componentDidMount() {
  document.title = "CG-VAK Cafeteria - Password Reset";
    this.state.errors = 0
  }

  validateForm() {
    return this.state.empID.length > 0 && this.state.password.length > 0 && this.state.Cpassword.length > 0  && this.state.SecurityQuestion.length > 0 && this.state.password == this.state.Cpassword;
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

  ValidateEmpID = event => 
  {
    if(event.target.value.length >= 2)
    {
        var bodyFormData = new FormData();
      bodyFormData.set('empID', event.target.value);
       API({
          url:'empIDValidate',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) .then(res => {
            if(res.data == '1')
            {
                 this.setState({
                   errors : 0,
                   disabled: 1,

                });
            } else {
               this.setState({
                   errors : 1,
                   empID: "",
                   disabled: 0,
                   SecurityQuestion: ""

                });
            }
        })
        .catch(error => {
              console.log(error)
          });
    }
    
   
  }

  ValidateEmpSequrityQuestion = event => 
  {
    if(this.state.empID.length >= 2 && this.state.SecurityQuestion.length >= 1 && this.state.errors == 0)
    {
        var bodyFormData = new FormData();
        bodyFormData.set('empID', this.state.empID);
        bodyFormData.set('security', this.state.SecurityQuestion);
         API({
          url:'empSequrityValidate',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
          }) .then(res => 
          {
             if(res.data == '1')
             {
                 this.setState({
                   Failed : 0,
                   disabledPass:1

                });
             } else 
             {
                 this.setState({
                   Failed : 1,
                   disabledPass:0,
                   SecurityQuestion: ""

                });
             }
              console.log(res.data)
          })
        .catch(error => {
              console.log(error)
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
          url:'UpdatePassword',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) .then(res => {
               if(res.data == '1')
               {
                  toast.success('Password Updated, You can login..', {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: false,
                      pauseOnHover: true,
                      draggable: true
                  });
                  this.setState({
                    empID: "",
                    password: "",
                    Cpassword: "",
                    SecurityQuestion: "",
                    errors: 0,
                    Failed: 0,
                    disabled:0,
                    disabledPass:0,
                    ErrorMsg: ''
                  });
                   setTimeout(function(){ window.location.href="/login"; }, 3000);
               }
               else {
                   toast.error('Something Wrong, Try again later..', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true
                });
                  this.setState({
                    empID: "",
                    password: "",
                    Cpassword: "",
                    SecurityQuestion: "",
                    errors: 0,
                    Failed: 0,
                    disabled:0,
                    disabledPass:0,
                    ErrorMsg: ''
                  });
               }
            })
          .catch(error => {
              console.log(error)
          });
  }

  render() {
    let {empID, password,Cpassword,SecurityQuestion, Failed, disabled,disabledPass, errors} = this.state;

    return (
    <div>
      <LoginpageHeader />
      <div className="overlay"></div>
       <div className="text-center">
       <ToastContainer
        />
          <h1>CG-VAK Cafeteria</h1>      
          <p>Powered by Achi Mess</p>
        </div>
       <div className="Login LoginCover">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="empID" bsSize="large">
            <ControlLabel>Employee ID</ControlLabel>
            <FormControl
              autoFocus
              maxLength = "4"
              type="text"
              value={this.state.empID}
              onChange={this.handleChangeID}
              onBlur={this.ValidateEmpID}
            />
             { this.state.errors ? (<ControlLabel className="error">Invalid Employee ID</ControlLabel>) : ('') }
          
          </FormGroup>
         
          <FormGroup controlId="SecurityQuestion" bsSize="large">
            <ControlLabel>Security Question : Crush Nickname</ControlLabel>
            <FormControl  
              maxLength = "25"
              type="text"
              readOnly = {(this.state.disabled ? 0 : "readOnly")}
              value={this.state.SecurityQuestion}
              onChange={this.handleChange}
              onBlur={this.ValidateEmpSequrityQuestion}
            />
            { this.state.Failed ? (<ControlLabel className="error">Verification Mismatch</ControlLabel>) : ('') }
            
          </FormGroup>
         
          
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              readOnly = {(this.state.disabledPass ? 0 : "readOnly")}
              type="password"
            />
          </FormGroup>
           <FormGroup controlId="Cpassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.Cpassword}
              onChange={this.handleChange}
              readOnly = {(this.state.disabledPass ? 0 : "readOnly")}
              type="password"
            />
          </FormGroup>
         

          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Change
          </Button>
           <a href="/login">Back to Login </a>
        </form>
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