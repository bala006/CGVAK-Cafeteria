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
        empName: "",
        empPhNo: "",
        password: "",
        Cpassword: "",
        SecurityQuestion: "",
        errors: 0,
        Failed: 0,
        ErrorMsg: '',
        alert:'',
      };
       this.handleSubmit = this.handleSubmit.bind(this);
      
  }

 componentDidMount() {
  document.title = "CG-VAK Cafeteria - Register";
    this.state.errors = 0
  }

  validateForm() {
    return this.state.empID.length > 0 && this.state.password.length > 0 && this.state.Cpassword.length > 0 && this.state.empName.length > 0 && this.state.SecurityQuestion.length > 0 && this.state.password == this.state.Cpassword;
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

  ValidateEmpID= event => 
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
                   errors : 1,
                   empID: ""
                });
            } else {
              this.setState({
                   errors : 0,
                });
            }
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
    bodyFormData.set('empName', this.state.empName);
    bodyFormData.set('empPhNo', this.state.empPhNo);
    bodyFormData.set('security', this.state.SecurityQuestion);
    API({
          url:'register',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) .then(res => {
               if(res.data == '1')
               {
                  toast.success('Account Created, You can login', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true
                });
                  this.setState({
                    empID: "",
                    empName: "",
                    empPhNo: "",
                    password: "",
                    Cpassword: "",
                    SecurityQuestion: "",
                    errors: 0,
                    Failed: 0,
                    ErrorMsg: ''
                  });
                  setTimeout(function(){ window.location.href="/login"; }, 2000);
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
                    empName: "",
                    empPhNo: "",
                    password: "",
                    Cpassword: "",
                    SecurityQuestion: "",
                    errors: 0,
                    Failed: 0,
                    ErrorMsg: ''
                  });
               }
            })
          .catch(error => {
              console.log(error)
          });
  }

  render() {
    let {empID, password,Cpassword,empPhNo,empName,SecurityQuestion, Failed, errors,alert} = this.state;
    const { close } = this.props

const Alertoptions = {
  timeout: 5000,
  position: "bottom center"
};

    return (
       <div>
      <LoginpageHeader />
      <div className="overlay"></div>
       <div className="text-center">
        <ToastContainer/>
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
            { this.state.errors ? (<ControlLabel className="error">Employee ID Already Exist</ControlLabel>) : ('') }
          </FormGroup>
          <FormGroup controlId="empName" bsSize="large">
            <ControlLabel>Employee Name</ControlLabel>
            <FormControl
              maxLength = "25"
              type="text"
              value={this.state.empName}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="empPhNo" bsSize="large">
            <ControlLabel>Employee Phone No</ControlLabel>
            <FormControl           
              maxLength = "12"
              type="text"
              value={this.state.empPhNo}
              onChange={this.handleChangeID}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
           <FormGroup controlId="Cpassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.Cpassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="SecurityQuestion" bsSize="large">
            <ControlLabel>Security Question : Crush Nickname</ControlLabel>
            <FormControl
              maxLength = "25"
              type="text"
              value={this.state.SecurityQuestion}
              onChange={this.handleChange}
            />
          </FormGroup>

          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Register
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