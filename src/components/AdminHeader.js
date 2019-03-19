import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button,Navbar,Nav,NavItem,NavDropdown,MenuItem,Panel } from 'react-bootstrap';

class Header extends Component {
constructor(props) {
    super(props);
     this.state = {
        empName: "",
      };
      
  }

 componentDidMount() {
    var EMPId = localStorage.getItem('EMPID');
    var EMPType = localStorage.getItem('EMPType');  
      if(!EMPId)
      {
            window.location.href= "/login";
      }
      if(EMPType != 1)
      {
        window.location.href= "/";
      }

}


LogoutUser()
{
    localStorage.clear();
     window.location.href= "/login";
}
 

  render(){
     this.state.empName = localStorage.getItem('EMPName')
    return (
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/admin">CG-VAK Cafeteria - Admin</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
               <NavDropdown eventKey={3} title={this.state.empName} id="basic-nav-dropdown">
                <MenuItem onClick={this.LogoutUser} eventKey={3.2}>Logout</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}



}

export default (Header);

