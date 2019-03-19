import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button,Navbar,Nav,NavItem,NavDropdown,MenuItem,Panel } from 'react-bootstrap';

class LoginpageHeader extends Component {
constructor(props) {
    super(props);
     this.state = {
        empName: "",
      };
  }

componentDidMount() {
 
}




  render(){
    return (
        <nav>
          <Navbar.Header>
            <Navbar.Toggle />
          </Navbar.Header>
        </nav>
      )}



}

export default (LoginpageHeader);

