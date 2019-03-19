import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button,Navbar,Nav,NavItem,NavDropdown,MenuItem,Panel } from 'react-bootstrap';
import Notifier from "react-desktop-notification";
import axios from 'axios';
import API from '../api/api';

window.React = React;
class Header extends Component {
constructor(props) {
    super(props);
     this.state = {
        empName: "",
      };
      
      this.routeChange = this.routeChange.bind(this);
}

componentDidMount() {
  Notification.requestPermission();
  var EMPId = localStorage.getItem('EMPID');

    this.interval = setInterval(() => {
        this.checkForNotification(EMPId);
     }, 1000);
}

checkForNotification(id)
{
    var bodyFormData = new FormData();
    bodyFormData.set('EmpID', id);
    API({
        url:'checkForNotification',
        method: 'post',
        data: bodyFormData,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        config: { headers: {'Content-Type': 'multipart/form-data'}}
        }).then(res => {
            var data = res.data;
            if(data)
            {
              Notifier.start(data['title'],data['message'],"#","https://etc.usf.edu/clipart/70400/70476/70476_263_rm-050_b_sm.gif");
                 var bodyFormData = new FormData();
                  bodyFormData.set('notifi_id', data['notifi_id']);

                  setTimeout(
                    function() {
                      API({
                      url:'CloseNotification',
                      method: 'post',
                      data: bodyFormData,
                      xsrfCookieName: 'XSRF-TOKEN',
                      xsrfHeaderName: 'X-XSRF-TOKEN',
                      config: { headers: {'Content-Type': 'multipart/form-data'}}
                      });
                    }
                    .bind(this),
                    2000
                );     

            }
        })
        .catch(error => {
            console.log(error)
        });
}

LogoutUser()
{
    localStorage.clear();
     window.location.href= "/login";
}
routeChange(){
    window.location.href="/view";
}


  render(){
     this.state.empName = localStorage.getItem('EMPName')
    return (
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">CG-VAK Cafeteria</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
               <NavDropdown eventKey={3} title={<span class="glyphicon glyphicon-user"></span>} id="basic-nav-dropdown">
                <MenuItem onClick={this.routeChange} eventKey={3.1}>Orders History</MenuItem>
                <MenuItem divider />
                <MenuItem onClick={this.LogoutUser} eventKey={3.2}>Logout</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}



}

export default (Header);

