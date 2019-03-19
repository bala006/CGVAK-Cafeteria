import React, { Component } from 'react';
import axios from 'axios';

export default class LoaderComponent extends Component {
   constructor(props) {
      super(props);
      this.state = this.state = {name:'',company:'',
         blog: '',
         avatar:'',
         loading: false
       }
      }
       componentDidMount() 
       {  
          loading: false
       }

   render()
   {
    let data;
    if (this.state.loading) {
      data = <img  data-src={ require('../images/giphy.gif') } />
    } else {
      data = <div>
                <br/>
                Name: {this.state.name}
                <br/>
                Company: {this.state.company}
                <br/>
                Blog: {this.state.blog}
                <br/>
                <img src={this.state.avatar}/>
            </div> 
    }
      return(
      <div>
            {data}
       </div>
      )
   }
}