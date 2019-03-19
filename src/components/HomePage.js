import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel,InputGroup } from "react-bootstrap";
import { UncontrolledCollapse } from 'reactstrap';
import MenuItems from "./MenuItems";
import CartItems from "./CartItems";
import {connect} from 'react-redux';
import axios from 'axios';
import API from '../api/api';
import {ItemUpdate,clearCart,UpdateStoreStatus} from "../action/index";
import { ToastContainer, toast } from 'react-toastify';
import Countdown from 'react-countdown-now';
import 'react-toastify/dist/ReactToastify.css';
import './MenuItems.css';
import Header from "./Header";


class HomePage extends Component {

constructor() {
    super();
     this.state = {
        SearchMenu: "",
        loading: true,
        milliseconds:0,
        ShopStatus:1,
        OrderLeft:2,
        Remark:'',
        intervalId: 0
    }
    this.SubmitOrder = this.SubmitOrder.bind(this);
    this.getLimitofOrder = this.getLimitofOrder.bind(this);

    
  }

 componentDidMount() {
    document.title = "CG-VAK Cafeteria - Menu";
    var EMPId = localStorage.getItem('EMPID');
    var EMPType = localStorage.getItem('EMPType');
    this.getLimitofOrder(EMPId);
    if(!EMPId)
    {
        window.location.href= "/login";
    }
    if(EMPType == 1)
    {
        window.location.href= "/admin";
    } 
    this.getallMenu();

    const dt1 = new Date();
    const dt2 = new Date(this.SetBlocktime());
    const differ = this.diff_minutes(dt2, dt1);
    this.state.milliseconds = differ;

   
   
        let CurrentDate = new Date();
        let CurrentHours = CurrentDate.getHours();
        if(CurrentHours >= 21 && CurrentHours <= 24)
        {
            this.props.UpdateStoreStatus(0);
        } else {
             this.props.UpdateStoreStatus(1);
        }
    setInterval(function() {
        let CurrentDate = new Date();
        let CurrentHours = CurrentDate.getHours();
        if(CurrentHours >= 21 && CurrentHours <= 24)
        {
            this.props.UpdateStoreStatus(0);
        }
        
    }
    .bind(this),
    10000
    );
    
  }
getLimitofOrder(EMPId)
{

        var bodyFormData = new FormData();
        bodyFormData.set('empID', EMPId);
         API({
          url:'CheckOrderLimit',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) .then(res => {
            var OrderCount = res.data;
            console.log(OrderCount);
            var OrderLeft = parseInt(2) - parseInt(OrderCount)
            this.setState({
                         OrderLeft: OrderLeft
            });

            if(OrderLeft == 0)
            {
                this.setState({
                         ShopStatus: OrderLeft
                });
                this.props.UpdateStoreStatus(2);
            }

        })
        .catch(error => {
              console.log(error)
          });
}
diff_minutes(dt2, dt1)
{
  var diff = dt2.getTime() - dt1.getTime();
  return Math.round(diff);
}

SetBlocktime() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  return mm + "," + dd + "," + yyyy + ", 21:00:00";
}

  getallMenu()
  {
    var dayID = new Date().getDay();
    if(dayID <= 6)
    {

         var MenuUrl = 'menu/'+dayID; 
            API.get(MenuUrl)
              .then(res => {
              var Data = res.data
              this.props.ItemUpdate(Data);
              setTimeout(
                function() {
                    this.setState({
                         loading: false
                     });
                }
                .bind(this),
                1000
                 );
              
              })
              .catch(error => {
            console.log(error)
        });
    }

  }

  getMenuBySearch(Keys)
  {
    var dayID = new Date().getDay();
    if(dayID <= 6)
    {

         var MenuUrl = 'menu/'+dayID+'/'+Keys; 
            API.get(MenuUrl)
              .then(res => {
              var Data = res.data
              this.props.ItemUpdate(Data);
              })
              .catch(error => {
            console.log(error)
        });
    }
  }
    SubmitOrder()
    {
        var EMPId = localStorage.getItem('EMPID');
        var bodyFormData = new FormData();
        bodyFormData.set('empID', EMPId);
        bodyFormData.set('OrderRemark', this.state.Remark);
        bodyFormData.set('CartDetails', JSON.stringify(this.props.stateArray.cart));
         API({
          url:'placeOrder',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) .then(res => {
            if(res.data != '')
            {
                 toast.success('Order Placed Order No#'+res.data, {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: false,
                      pauseOnHover: true,
                      draggable: true
                  });
                this.props.clearCart();
                 setTimeout(function(){ window.location.href="/view"; }, 2000);
            } else {
                 toast.error('Order Placing Failed, Try again later..', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true
                });
                 this.props.clearCart();
            }

        })
        .catch(error => {
              console.log(error)
          });
    }

SearchMenu = event => {
    this.setState({
      SearchMenu: event.target.value
    });

    if(event.target.value != 0)
    {
        this.getMenuBySearch(event.target.value)
    } else {
        this.getallMenu();
    }
  }

  Remark = event => {
    this.setState({
      Remark: event.target.value
    });
  }

  searchMenuTrigger = event => {
   
    var FilterData = this.state.SearchMenu;
    if(FilterData.length != 0)
    {
        this.getMenuBySearch(FilterData)
    } else {
       this.getallMenu();
    }
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
        clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  }
  
  scrollToTop() {
    let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
    this.setState({ intervalId: intervalId });
  } 

    render() {
        let EmpName = localStorage.getItem('EMPName')
        let content;
        const renderer = ({ hours, minutes, seconds, completed }) => {
              if (completed) {
                return <h4 className= "Header-event"><span className="badge badge-light timer-danger">Shop Closed</span></h4>;
              } else {
                return <h4 className= "Header-event"><span className="badge badge-light timer-primary">Order will Close in {hours}:{minutes}:{seconds}</span></h4>;
              }
        };
        
        if (this.state.loading) {
             content = <img className="text-center pre-loader" src={ require('../image/loader-2_food.gif') } />;
        } else { 
        const statusID = this.state.ShopStatus;
        content = <div> 
            <Header /> 
             <div className="overlay"></div>
            <div className="container-fluid">
            <ToastContainer/>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                    
                        <div className="row justify-content-md-center">
                            <div className="panel panel-primary">
                                <div className="panel-body"> 
                                <button className="Cart-Btn" id="toggler" onClick={this.toggle} style={{ marginBottom: '1rem' }}><span className="glyphicon glyphicon-shopping-cart"></span> {this.props.stateArray.cart.length}</button>

                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                     
                                        
                                           <div  className="text-right">
                                           <h4 className="Header-event"><span className="badge badge-warning timer-badge">Order Left Today - {this.state.OrderLeft} </span></h4>
                                            <Countdown
                                                                date={Date.now() + this.state.milliseconds}
                                                                renderer={renderer}
                                           />
                                     </div>
                                    <div className="row">
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                <div className="row justify-content-md-center">
                                                    <div className="panel panel-primary">
                                                        <div className="panel-body">
                                                        <div className="col-sm-5 col-md-5 col-lg-5">
                                                            <h3> Welcome {EmpName}</h3> 
                                                        </div>
                                                         <div className="col-sm-3 col-md-3 col-lg-3">
                                                           
                                                         </div>
                                                            <div className="col-sm-4 col-md-4 col-lg-4">
                                                                <FormGroup controlId="SearchMenu" bsSize="large">
                                                                    <FormControl
                                                                      maxLength = "25"
                                                                      type="text"
                                                                      placeHolder="Search Menu"
                                                                      value={this.state.SearchMenu}
                                                                      onChange={this.SearchMenu}
                                                                    />
                                                                  </FormGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel panel-primary">
                                            <div className="panel-body">
                                                <div className="panel-heading">
                                                    <div className="container-fluid">
                                                        <div className="row justify-content-md-center">
                                                                <h2 className="text-center">Today Special</h2>
                                                        </div>
                                                        <div className="row justify-content-md-center">
                                                            <div className="card-body ">

                                                                

                                                                {this.props.stateArray.inventory.length ? (

                                                                    this.props.stateArray.inventory.map((item,index) => {
                                                                            return(
                                                                                <MenuItems
                                                                                    key={index}
                                                                                    item={item}
                                                                                    status={this.props.stateArray.StoreStatusData}
                                                                                />
                                                                            );
                                                                            })
                                                                    ) : (
                                                                        <h2 className="text-center">Order Closed</h2>
                                                                    )}
                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                                    <UncontrolledCollapse toggler="#toggler">
                                     
                                        <div className="panel panel-primary Fixed-pan">
                                            <div className="panel-body">
                                                <div className="panel-heading">
                                                    <div className="cont-flu">
                                                        <div className="row justify-content-md-center padd-adjust">
                                                             <div className="text-center">
                                                                <label className="h3 control-label">Total:₹ 
                                                                {this.props.stateArray.total.totalvalue ? (this.props.stateArray.total.totalvalue) : (0)}
                                                               </label> <br/>

                                                               {this.props.stateArray.StoreStatusData ? (
                                                                      <button onClick={this.SubmitOrder} disabled={!this.props.stateArray.total.totalvalue}className="btn btn-sm btn-success">Order Now</button>
                                                                  ): (
                                                                      <button disabled className="btn btn-sm btn-danger">Shop Closed</button>
                                                                  )
                                                                }
                                                               
                                                              
                                                              
                                                            </div>
                                                        </div>
                                                        <div className="row justify-content-md-center">
                                                            <div className="card-body">

                                                                

                                                                <CartItems 
                                                                     status={this.props.stateArray.StoreStatusData}
                                                                    />

                                                                <FormGroup className={this.props.stateArray.total.totalvalue ? 0 : "hidden"} controlId="Remark" bsSize="large">

                                                                    <FormControl
                                                                      maxLength = "40"
                                                                      type="text"
                                                                      placeHolder="Order Instructions"
                                                                      value={this.state.Remark}
                                                                      onChange={this.Remark}
                                                                    />
                                                                    <span Style="float: right;">Max 40 character.</span> 
                                                                  </FormGroup>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                    </div>
                                     </UncontrolledCollapse>
                                </div>
                            </div>
                        </div>
                    </div>

                   <button title='Back to top' className="scroll" onClick={ () => { this.scrollToTop(); }}><span className='arrow-up glyphicon glyphicon-chevron-up'></span></button> 
                </div>
            </div>
            </div>
        }

        return (
            <div>
        {content}
            </div>
        );
    }
}



function mapStateToProps(stateArray) {
    // const inventoryArr = Object.keys(state.inventory).map((item) => (
    //     {
    //         'item' : item,
    //     }
    // ));
    // return {inventoryArray};
    return {stateArray};
}

function  mapDispatchToProps(dispatch) {
    return {
        ItemUpdate : (item) => dispatch(ItemUpdate(item)),
        clearCart : (item) => dispatch(clearCart(item)),
        UpdateStoreStatus: (item) => dispatch(UpdateStoreStatus(item))
    };
}





export default connect(mapStateToProps, mapDispatchToProps)(HomePage);