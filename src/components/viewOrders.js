import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import API from '../api/api';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {DataTable, DataColumn, Pagination} from 'react-data-components';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios';
import {ItemUpdate,clearCart,ViewOrders} from "../action/index";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Header from "./Header";
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Moment from 'react-moment';
import 'moment-timezone';

class viewOrder extends Component {
 
  constructor(props) {
    super(props);
     this.state ={
      masterDataItems: [],
      MonthlyCost: 0,
      TotalCost: 0,
      startDate: '',
      stopDate: '',
    }
    this.exportPDF = this.exportPDF.bind(this);
    this.onhandleEvent = this.onhandleEvent.bind(this);
  }

  componentDidMount () {
    var EMPType = localStorage.getItem('EMPType');
    var EMPId = localStorage.getItem('EMPID');
    var EmpName = localStorage.getItem('EMPName')
    document.title = "CG-VAK Cafeteria - "+EmpName+"-"+EMPId+" Orders";
        if(!EMPId)
        {
            window.location.href= "/login";
        }
        if(EMPType == 1)
        {
          window.location.href= "/admin";
        }
    var masterData = [];
      var bodyFormData = new FormData();
      bodyFormData.set('empID', localStorage.getItem('EMPID'));
       API({
          url:'ViemEmployeeOrder',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) .then(res => {
          console.log(res.data)
           var data = res.data[0];
           this.state.MonthlyCost = res.data[1][0].total;
           this.state.TotalCost = res.data[2][0].total;
           var dataTemp = [];
         
           var Indexpos = '';
           var imposData = 0;

           for(var i=0; i<data.length; i++)
           {
             if(dataTemp.includes(data[i].OrderNo) == false)
              {
                imposData++;
                dataTemp.push(data[i].OrderNo);
                var monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var DateFormat = new Date(data[i].created_at);
                var ampm = "am";
                var hr = DateFormat.getHours();
                if( hr > 12 ) 
                {
                    hr -= 12;
                    ampm = "pm";
                }
                var min = DateFormat.getMinutes();

                if (min < 10) 
                {
                    min = "0" + min;
                }
                var month = monthsArray[DateFormat.getMonth()];
                DateFormat =  DateFormat.getDate() + '-' + month + '-' + DateFormat.getFullYear() + ' ' + hr +':'+min+' '+ampm;
                masterData.push({
                  'ONo':data[i].OrderNo,
                  'date' : DateFormat,
                  'item' : data[i].item_name+'-'+data[i].item_qty,
                  'total' : data[i].item_price,
                  'remark' : data[i].order_remark,
                });
                


              } else 
              {
                  var ItemAlready = masterData[(imposData-1)].item;
                  var NewItemload = ItemAlready +' , '+ data[i].item_name+'-'+data[i].item_qty;
                  masterData[(imposData-1)].item = NewItemload;
                  let ItemCost = masterData[(imposData-1)].total;
                  var NewItemCost =  parseInt(ItemCost) + parseInt(data[i].item_price);
                  masterData[(imposData-1)].total = NewItemCost;

                
              }
             
              
           }
           this.props.ViewOrders(masterData);
        })
        .catch(error => {
              console.log(error)
        });
     
       
  }

onhandleEvent(event, picker){
  this.setState({
    startDate: picker.startDate,
    stopDate:picker.endDate
  })
    var bodyFormData = new FormData();
    bodyFormData.set('startDate', picker.startDate);
    bodyFormData.set('endDate', picker.endDate);
    bodyFormData.set('empID', localStorage.getItem('EMPID'));
    var masterData = [];
    API({
          url:'ViemEmployeeOrderByDate',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) .then(res => {
          console.log(res.data)
           var data = res.data;
           var dataTemp = [];
         
           var Indexpos = '';
           var imposData = 0;

           for(var i=0; i<data.length; i++)
           {
             if(dataTemp.includes(data[i].OrderNo) == false)
              {
                imposData++;
                dataTemp.push(data[i].OrderNo);
                var monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var DateFormat = new Date(data[i].created_at);
                var ampm = "am";
                var hr = DateFormat.getHours();
                if( hr > 12 ) 
                {
                    hr -= 12;
                    ampm = "pm";
                }
                var min = DateFormat.getMinutes();

                if (min < 10) 
                {
                    min = "0" + min;
                }
                var month = monthsArray[DateFormat.getMonth()];
                DateFormat =  DateFormat.getDate() + '-' + month + '-' + DateFormat.getFullYear() + ' ' + hr +':'+min+' '+ampm;
                masterData.push({
                  'ONo':data[i].OrderNo,
                  'date' : DateFormat,
                  'item' : data[i].item_name+'-'+data[i].item_qty,
                  'total' : data[i].item_price,
                  'remark' : data[i].order_remark,
                });
                


              } else 
              {
                  var ItemAlready = masterData[(imposData-1)].item;
                  console.log(ItemAlready)
                  var NewItemload = ItemAlready +' , '+ data[i].item_name+'-'+data[i].item_qty;
                  masterData[(imposData-1)].item = NewItemload;

                  let ItemCost = masterData[(imposData-1)].total;
                  var NewItemCost =  parseInt(ItemCost) + parseInt(data[i].item_price);
                  masterData[(imposData-1)].total = NewItemCost;

                
              }
              
           }
           this.props.ViewOrders(masterData);
        })
        .catch(error => {
              console.log(error)
        });
     
}
exportPDF()
{
  let columns = [
        { title: 'Order No', dataKey: 'ONo'  },
        { title: 'Date', dataKey: 'date' },
        { title: 'Item', dataKey: 'item' },
        { title: 'Total', dataKey: 'total' }
      ]
  const doc = new jsPDF();
  let Data = this.props.stateArray.ViewOrders
  var today = new Date(),
  today =  today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let label = 'Reports Untill  '+today;
  doc.text(label, 10, 10)
  doc.autoTable(columns,Data,{
    columnStyles: {
     ONo: {columnWidth: 15}, 
     date:{columnWidth:25}, 
     item: {columnWidth: 50}, 
     total: {columnWidth: 10}
    }
  });
  doc.save(label+'.pdf');
}


  render() {

     const columns = [
        { title: 'Order No', prop: 'ONo'  },
        { title: 'Date', prop: 'date' },
        { title: 'Item', prop: 'item' },
        { title: '₹ Total', prop: 'total' }
      ];


      const data = this.props.stateArray.ViewOrders;



     const dataMain = this.state.masterDataItems

      var EmpID = localStorage.getItem('EMPID');
      var EmpName = localStorage.getItem('EMPName');

      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      var lastDay = new Date(y, m + 1, 0);
      var dds = firstDay.getDate();
      var mms = firstDay.getMonth()+1; 
      var yyyys = firstDay.getFullYear();
      var dde = lastDay.getDate();
      var mme = lastDay.getMonth()+1; 
      var yyyye = lastDay.getFullYear();
      var start = mms+'/'+dds+'/'+yyyys;
      var end = mme+'/'+dde+'/'+yyyye;
    

    return (
             <div>
              <Header /> 
               <div className="overlay"></div>
              <div className="container-fluid">
                <div className="panel panel-primary">
                    <div className="panel-body">
                        <div className="row justify-content-md-center">
                            <div className="col-md-3 col-xs-3 col-lg-3 col-sm-3">
                                <h3> Employee ID : {EmpID}</h3> 
                            </div>
                            <div className="col-md-5 col-xs-5 col-lg-5 col-sm-5">
                                <h3> Employee Name : {EmpName}</h3>
                            </div>
                            <div className="col-md-4 col-xs-4 col-lg-4 col-sm-4">
                                <h3> Bill Month/Annual : {this.state.MonthlyCost} / {this.state.TotalCost}</h3>
                            </div>
                          </div>
                      </div>
                </div>
                 <div className="panel panel-primary show_orders">
                    <div className="panel-body">
                        <div className="row justify-content-md-center">

                            <div className="col-md-12 col-xs-12 col-lg-12 col-sm-12 table-viewOrder">
                             <DateRangePicker onApply={this.onhandleEvent} showDropdowns startDate={start} endDate={end}>
                                                      <button>Click to select Date Range!</button>
                                                    </DateRangePicker>
                             <button type="button" onClick={this.exportPDF} class="btn btn-success float-right"><span><i class="fa glyphicon glyphicon-export fa-download"></i> Export to PDF</span></button>

                            
                              <BootstrapTable ref='ViewOrderTable' data={this.props.stateArray.ViewOrders} search={ true } multiColumnSearch={ true } pagination>
                                              <TableHeaderColumn isKey dataSort dataField='ONo'>Order No</TableHeaderColumn>
                                              <TableHeaderColumn dataSort dataField='date'>Order Date</TableHeaderColumn>
                                              <TableHeaderColumn width='450' tdStyle={ { whiteSpace: 'pre-wrap' } }  dataField='item'>Order Item</TableHeaderColumn>
                                               <TableHeaderColumn width='250' tdStyle={ { whiteSpace: 'pre-wrap' } }  dataField='remark'>Order Instruction</TableHeaderColumn>
                                               <TableHeaderColumn dataField='total'>₹ Total</TableHeaderColumn>
                                          </BootstrapTable>
                               


                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
    )
  }



}

function mapStateToProps(stateArray) {
    console.log(stateArray);
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
        ViewOrders : (item) => dispatch(ViewOrders(item))
    };
}





export default connect(mapStateToProps, mapDispatchToProps)(viewOrder);