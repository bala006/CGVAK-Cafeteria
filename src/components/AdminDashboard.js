import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import API from '../api/api';
import { Button, FormGroup, FormControl, ControlLabel, Tab, Row, Col, Nav, NavItem } from "react-bootstrap";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios';
import './LoginForm.css';
import {ViewTodaysOrders,getAllReciepts,ViewOrdersReport,ViewOrders} from "../action/index";
import AdminHeader from "./AdminHeader";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Moment from 'react-moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Modal from 'react-responsive-modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'react-toastify/dist/ReactToastify.css';




axios.defaults.xsrfHeaderName = "X-CSRFToken";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class AdminDashboard extends React.Component {
 
  constructor(props) {
    super(props);
     this.state = {
        empID: "",
        errors: "",
        recName:"",
        recPrice:'',
        recType:"6",
        image: '',
        startDate: '',
        stopDate: '',
        empSName:'',
        empSFullName:'',
        NotificationCategory:'0',
        imagePreviewUrl: '',
        createSelectItems:[],
        createSelectItemsNotifiy:[],
        NotificationTitle: '',
        NotificationContent: '',
        open: false
      };
      this.getallrecieptData = this.getallrecieptData.bind(this);
      this.onCloseModal = this.onCloseModal.bind(this);
      this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
      this.jobStatusValidator = this.jobStatusValidator.bind(this);
      this.jobStatusValidatorName = this.jobStatusValidatorName.bind(this);
      this.onhandleEvent = this.onhandleEvent.bind(this);
      this.onhandleEventReport = this.onhandleEventReport.bind(this);
      this.exportPDF = this.exportPDF.bind(this);
      this.exportMasterPDF = this.exportMasterPDF.bind(this);
      this.exportReportPDF = this.exportReportPDF.bind(this);
      this.empNameSelect = this.empNameSelect.bind(this);
      this.empNameSelectCategory = this.empNameSelectCategory.bind(this);
      this.createSelectItems = this.createSelectItems.bind(this);



      
      


  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

 componentDidMount() {
  document.title = "CG-VAK Cafeteria - Admin";
   var masterData = [];

    API({
          url:'getTodayOrders',
          method: 'get',
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) 
        .then(res => {
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

                masterData.push({
                  'Emp_ID':data[i].emp_id,
                  'Emp_name':data[i].emp_name,
                  'Emp_orderNo':data[i].OrderNo,
                  'Emp_orderDate' : this.dateFormating(data[i].created_at),
                  'Emp_Item' : data[i].item_name+'-'+data[i].item_qty,
                  'Emp_price' : data[i].item_price,
                  'Emp_remark' : data[i].order_remark,
                });
              } 
              else 
              {

                  var ItemAlready = masterData[(imposData-1)].Emp_Item;
                  var NewItemload = ItemAlready +', '+ data[i].item_name+'-'+data[i].item_qty;
                  masterData[(imposData-1)].Emp_Item = NewItemload;
                  console.log(masterData[(imposData-1)].Emp_Item)

                  var ItemCost = masterData[(imposData-1)].Emp_price;
                  var NewItemCost =  parseInt(ItemCost) + parseInt(data[i].item_price);
                  masterData[(imposData-1)].Emp_price = NewItemCost;
              }  
               
           }
            this.props.ViewTodaysOrders(masterData);
        }).catch(error => {
            console.log(error)
        });
        this.getallrecieptData();

  }
getallrecieptData()
{
   var masterData = [];
    API({
          url:'getAllreciepts',
          method: 'get',
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) 
        .then(res => {
           var data = res.data;
           for(var i=0; i<data.length; i++)
           {
            var rtype = data[i].item_type;
            switch(rtype)
            {
               case 1:
               var Special = 'Monday';
               break;
               case 2:
               var Special = 'Tuesday';
               break;
               case 3:
               var Special = 'Wednesday';
               break;
               case 4:
               var Special = 'Thursday';
               break;
               case 5:
               var Special = 'Friday';
               break;
               default:
                var Special = 'All days';
            } 
               masterData.push({
                  'id':data[i].id,
                  'Item_name':data[i].Item_name,
                  'Item_price':data[i].Item_price,  
                  'Item_type' : Special,
                });
           }
            this.props.getAllReciepts(masterData);
        }).catch(error => {
            console.log(error)
        });
    this.createSelectItems();
}

csvFormatter(cell, row) {
    return `${row.id}: ${cell}`;
}

processData(id)
{
  console.log(id)  
}

 handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
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

  validateForm() {
    return this.state.recName.length > 0 && this.state.recPrice.length > 0 && this.state.image.length > 0;
  }

   validateFormNotifiy() {
    return this.state.NotificationTitle.length > 0 && this.state.NotificationContent.length > 0;
  }

  handleSubmit = event => {
    event.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.set('recName', this.state.recName);
    bodyFormData.set('recPrice', this.state.recPrice);
    bodyFormData.set('recType', this.state.recType);
    bodyFormData.append('Image', this.state.image)
    console.log(bodyFormData);

  API({
        url:'addReciept',
        method: 'post',
        data: bodyFormData,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        config: { headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then(res => {
            if(res.data == 1)
            {
              this.setState({
               recName:"",
                recPrice:'',
                recType:"6",
                image: '',
                imagePreviewUrl: '',
              });
               
               this.onCloseModal();
               toast.success('Recipe Created', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true
                });
               this.getallrecieptData();

            } else {
               toast.error('Something Wrong, Try again later..', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true
              });
              this.onCloseModal();
              this.setState({
               recName:"",
                recPrice:'',
                recType:"6",
                image: '',
                imagePreviewUrl: '',
              });
            }
        })
        .catch(error => {
            console.log(error)
        });
  }

  handleSubmitNotifiy = event => {
    event.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.set('title', this.state.NotificationTitle);
    bodyFormData.set('Content', this.state.NotificationContent);
    bodyFormData.set('From', 0);
    bodyFormData.set('To', this.state.NotificationCategory);
    console.log(this.state.NotificationCategory);
    API({
        url:'sendNotification',
        method: 'post',
        data: bodyFormData,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        config: { headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then(res => {
        	if(res.data == 1)
            {
            	this.setState({
	               NotificationTitle:"",
	               NotificationContent:'',
	              });
            	 toast.success('Notification Sent', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true
                });

            } else {
            	 toast.error('Something Wrong, Try again later..', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true
              });
            }
         })
        .catch(error => {
            console.log(error)
        });


   }

  onAfterDeleteRow(rowKeys) 
  {
      var bodyFormData = new FormData();
      bodyFormData.set('recID', rowKeys);
       API({
        url:'removeReciept',
        method: 'post',
        data: bodyFormData,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        config: { headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then(res => {
          console.log(res.data)
          if(res.data == 1)
            {
               this.getallrecieptData();
            } else {
              alert('Something Went Wrong! please try again later')
              this.getallrecieptData();
            }
        })
        .catch(error => {
            console.log(error)
        });
  }

  jobStatusValidator(value) {
  const nan = isNaN(parseInt(value, 10));
  var lens = value.length;
  if (lens >= 4) {
       return 'Recipt Price is below 999';
  }
  if (nan) {
    return 'Recipt Price must be a integer!';
  }
  return true;
}

jobStatusValidatorName(value){
  var values = value.trim(value)
  var  lens = values.length;
  if (lens == 0)
  {
     return 'Recipt Name not to be Empty';
  }
  if(lens >= 24)
  {
    return 'Recipt Name is too length';
  }
  return true;

}

onhandleEvent(event, picker){
  this.setState({
    startDate: picker.startDate,
    stopDate:picker.endDate
  })
    var bodyFormData = new FormData();

    bodyFormData.set('startDate', picker.startDate);
    bodyFormData.set('endDate', picker.endDate);
     API({
        url:'getReportbyDate',
        method: 'post',
        data: bodyFormData,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        config: { headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then(res => {
          this.props.ViewOrdersReport(res.data);
          console.log(res.data)
        })
        .catch(error => {
            console.log(error)
        });
}

onhandleEventReport(event, picker){
  this.setState({
    startDate: picker.startDate,
    stopDate:picker.endDate
  })

    var bodyFormData = new FormData();
    bodyFormData.set('startDate', picker.startDate);
    bodyFormData.set('endDate', picker.endDate);
    bodyFormData.set('empID', this.state.empSName);
    var masterData = [];
    API({
          url:'ViemEmployeeOrderByDate',
          method: 'post',
          data: bodyFormData,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          config: { headers: {'Content-Type': 'multipart/form-data'}}
        }) .then(res => {
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
                  var NewItemload = ItemAlready +', '+ data[i].item_name+'-'+data[i].item_qty;
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

editingJobStatus = (row, cellName, cellValue) => {
    var bodyFormData = new FormData();
    switch(row.Item_type)
            {
               case 'Monday':
               var Special = 1;
               break;
               case 'Tuesday':
               var Special = 2;
               break;
               case 'Wednesday':
               var Special = 3;
               break;
               case 'Thursday':
               var Special = 4;
               break;
               case 'Friday':
               var Special = 5;
               break;
               default:
                var Special = 6;
            } 
    bodyFormData.set('recName', row.Item_name);
    bodyFormData.set('recPrice', row.Item_price);
    bodyFormData.set('recType', Special);
    bodyFormData.set('recId', row.id);
    API({
        url:'updateReciept',
        method: 'post',
        data: bodyFormData,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        config: { headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then(res => {
          console.log(res.data)
        })
        .catch(error => {
            console.log(error)
        });
}

ImageUploadPreview(e)
{
  let files = e.target.files || e.dataTransfer.files;
  if (!files.length)
    return;
    this.createImage(files[0]);
}
createImage(file) {
    let reader = new FileReader();
    reader.onload = (e) => {
    this.setState({
      image: e.target.result,
      imagePreviewUrl: reader.result
    })

    };
    reader.readAsDataURL(file);

}
exportPDF()
{
  let columns = [
          {title: "ID", dataKey: "Emp_ID"},
          {title: "Name", dataKey: "Emp_name"},
          {title: "Item", dataKey: "Emp_Item"},
          {title: "Instruction", dataKey: "Emp_remark"},
          ]
  const doc = new jsPDF();
  let Data = this.props.MasterArray.ViewAdminOrders
  var today = new Date(),
  today =  today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let label = today+' Orders - Report';
  doc.text(label, 10, 10)
  doc.autoTable(columns,Data,{
      columnStyles: {
     Emp_ID: {columnWidth: 5}, 
     Emp_name:{columnWidth:20}, 
     Emp_Item: {columnWidth: 25}, 
     Emp_remark: {columnWidth: 20}
    }
  });

  doc.save(label+'.pdf');

    /*var server  = email.server.connect({
     user:    "testing.useonly2@gmail.com", 
     password:"CGvak123", 
     host:    "smtp.gmail.com",
     ssl:     true,
     port: 465
    });*/

    var templateParams = {
       text:  "<h1>i hope this works</h1>", 
       from:  "you username@youremail.com", 
       to:    "someone balasubramaniyam@cgvakindia.com",
       cc:    "else else@youremail.com",
       subject: "testing emailjs",
    };

    var api_key = '10927d2bd3710b09baba3eb1f537dc34-acb0b40c-be9a23df';
    var domain = 'sandboxe25ade80180a4122b94bcc6e2eb6a6f4.mailgun.org';
   
    
   
   
}

exportMasterPDF()
{
   let columns = [
                    {title: "ID", dataKey: "emp_id"},
                    {title: "Name", dataKey: "emp_name"},
                    {title: "Total", dataKey: "total"},
                  ]
  const doc = new jsPDF();
  let Data = this.props.MasterArray.ViewOrdersReport
  let startDateFormat = '';
  let stopDateFormat = '';
  if(this.state.startDate)
  {
    let startDate = new Date(this.state.startDate);
    let stopDate = new Date(this.state.stopDate);
    startDateFormat = startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear();
    stopDateFormat = stopDate.getDate() + '-' + (stopDate.getMonth() + 1) + '-' + stopDate.getFullYear();
  } else {
    startDateFormat = '';
    stopDateFormat = '';
  }
  
  let label = 'Custom Order Report '+startDateFormat+' - '+stopDateFormat;
  doc.text(label, 10, 10)
  doc.autoTable(columns,Data);
  doc.save(label+'.pdf');
}

exportReportPDF()
{
  let columns = [
        { title: 'Order No', dataKey: 'ONo'  },
        { title: 'Date', dataKey: 'date' },
        { title: 'Item', dataKey: 'item' },
        { title: 'Total', dataKey: 'total' }
      ]
  const doc = new jsPDF();
  let Data = this.props.MasterArray.ViewOrders
  let startDateFormat = '';
  let stopDateFormat = '';
  let employeeName = this.state.empSFullName;
  if(this.state.startDate)
  {
    let startDate = new Date(this.state.startDate);
    let stopDate = new Date(this.state.stopDate);
    startDateFormat = startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear();
    stopDateFormat = stopDate.getDate() + '-' + (stopDate.getMonth() + 1) + '-' + stopDate.getFullYear();
  } else {
    startDateFormat = '';
    stopDateFormat = '';
  }
  
  let label = employeeName+' Report '+startDateFormat+' - '+stopDateFormat;
  doc.text(label, 10, 10)
  doc.autoTable(columns,Data);
  doc.save(label+'.pdf');
}

dateFormating(date){

  var monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var DateFormat = new Date(date);
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
                return DateFormat;
}

  empNameSelect(event) {
    var index = event.nativeEvent.target.selectedIndex;
    this.setState({empSName: event.target.value});
    this.setState({empSFullName: event.nativeEvent.target[index].text});
  }

  empNameSelectCategory(event) {
    this.setState({NotificationCategory: event.target.value});
  }

  createSelectItems()
  {

     API({
        url:'getAllEmployeeName',
        method: 'get',
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        config: { headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then(res => {
          console.log(res.data)
          var data = res.data
         this.state.createSelectItemsNotifiy.push(ReactHtmlParser('<option key="'+data.length+'" selected value="0">ALL</option>'));
          for(var i=0; i<data.length;i++)
          {
              if(i==0)
              {
                  this.state.empSName = data[i].emp_id;
                  this.state.empSFullName = data[i].emp_id+' - '+data[i].emp_name;
                 
              }
              this.state.createSelectItems.push(ReactHtmlParser('<option key='+i+'  value="'+data[i].emp_id+'">'+data[i].emp_id+' - '+data[i].emp_name+'</option>'));
              this.state.createSelectItemsNotifiy.push(ReactHtmlParser('<option key='+i+' value="'+data[i].emp_id+'">'+data[i].emp_id+' - '+data[i].emp_name+'</option>'));
            
          }

        })
        .catch(error => {
            console.log(error)
        });
     
  }

  

  render() {
    let {empID} = this.state;
    const { open } = this.state;

  const options = {
    afterDeleteRow: this.onAfterDeleteRow
  };
  const selectRowProp = {
    mode: 'checkbox'
  };

  const cellEditProp = {
  mode: 'click',
  blurToSave: true,
  afterSaveCell: this.editingJobStatus
  };


   let {imagePreviewUrl} = this.state;
   let $imagePreview = null;

    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Item Image</div>);
    }

 
       
const jobTypes = [ 'All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ];

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
        <AdminHeader />
        <div className="overlay"></div>
        <ToastContainer/>
        <div className="container-fluid">
                <div className="panel panel-primary show_orders">
                    <div className="panel-body">
                        <div className="row justify-content-md-center">
                            <div className="col-md-12 col-xs-12 col-lg-12 col-sm-12">
                               <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                  <Row className="clearfix">
                                    <Col sm={3}>
                                      <Nav bsStyle="pills" stacked>
                                        <NavItem eventKey="first">Today's Order - <span className="badge badge-warning">{this.props.MasterArray.ViewAdminOrders.length}</span></NavItem>
                                        <NavItem eventKey="second">Recipe Management</NavItem>
                                         <NavItem eventKey="third">Accounts</NavItem>
                                         <NavItem eventKey="forth">Reports</NavItem>
                                         <NavItem eventKey="fifth">Notification</NavItem>
                                      </Nav>
                                    </Col>
                                    <Col sm={9}>
                                      <Tab.Content animation>
                                        <Tab.Pane eventKey="first">
                                         <button type="button" onClick={this.exportPDF} class="btn btn-success float-right"><span><i class="fa glyphicon glyphicon-export fa-download"></i> Export to PDF</span></button>

                                          <div id="TodaysOrderTableDiv">
                                           <BootstrapTable ref='TodaysOrderTable' data={this.props.MasterArray.ViewAdminOrders} search={ true } multiColumnSearch={ true } pagination>
                                              <TableHeaderColumn isKey dataSort dataField='Emp_ID'>Employee ID</TableHeaderColumn>
                                              <TableHeaderColumn width='150' dataSort csvHeader='Employee-name' dataField='Emp_name'>Employee Name</TableHeaderColumn>
                                              <TableHeaderColumn dataField='Emp_orderNo'>Order No</TableHeaderColumn>
                                             
                                              <TableHeaderColumn width='250' tdStyle={ { whiteSpace: 'pre-wrap' } }  dataField='Emp_Item'>Order Item</TableHeaderColumn>
                                               <TableHeaderColumn width='150' tdStyle={ { whiteSpace: 'pre-wrap' } }  dataField='Emp_remark'>Order Instruction</TableHeaderColumn>
                                              
                                          </BootstrapTable>
                                          </div>
                                           

                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                        <div className="row justify-content-md-center">
                                            <div className="col-md-12 col-xs-12 col-lg-12 col-sm-12">
                                          <button className="btn btn-info add-reciept" onClick={this.onOpenModal}>
                                          <span><i className="fa fa-plus" aria-hidden="true"></i> Add Reciept</span></button>
                                          </div>
                                          </div>
                                          <BootstrapTable ref='recieptTable' data={this.props.MasterArray.GetAllRecieptName} selectRow={ selectRowProp } deleteRow={ true } search={ true } multiColumnSearch={ true } cellEdit={ cellEditProp } options={ options }  pagination>
                                              <TableHeaderColumn isKey dataSort dataField='id'>Item ID</TableHeaderColumn>
                                              <TableHeaderColumn editable={ { validator: this.jobStatusValidatorName } }  dataSort csvHeader='Item Name' dataField='Item_name'>Employee Name</TableHeaderColumn>
                                              <TableHeaderColumn dataSort csvHeader='Item Type' editable={ { type: 'select', options: { values: jobTypes } } } dataField='Item_type'>Availability</TableHeaderColumn>
                                              <TableHeaderColumn editable={ { validator: this.jobStatusValidator } }  dataField='Item_price'>Item Price</TableHeaderColumn>  
                                          </BootstrapTable> 

                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third">
                                            <div className="row justify-content-md-center">
                                                <div className="col-md-12 col-xs-12 col-lg-12 col-sm-12">
                                                    <DateRangePicker onApply={this.onhandleEvent} showDropdowns startDate={start} endDate={end}>
                                                      <button>Click to select Date Range!</button>
                                                    </DateRangePicker>
                                                     <button type="button" onClick={this.exportMasterPDF} class="btn btn-success float-right"><span><i class="fa glyphicon glyphicon-export fa-download"></i> Export to PDF</span></button>

                                           
                                          <BootstrapTable data={this.props.MasterArray.ViewOrdersReport} search={ true } multiColumnSearch={ true } pagination>
                                              <TableHeaderColumn isKey dataSort dataField='emp_id'>Employee ID</TableHeaderColumn>
                                              <TableHeaderColumn dataSort csvHeader='Employee-name' dataField='emp_name'>Employee Name</TableHeaderColumn>
                                               <TableHeaderColumn dataField='total'>₹ Total Bill</TableHeaderColumn>
                                          </BootstrapTable>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="forth">
                                             <div className="row justify-content-md-center">
                                                <div className="col-md-3 col-xs-3 col-lg-3 col-sm-3">
                                                  <div className="form-group">
                                                        

                                                        <select value={this.state.empSName} className="form-control" onChange={this.empNameSelect}>
                                                            {this.state.createSelectItems}
                                                        </select>
                                                
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-xs-3 col-lg-3 col-sm-3">
                                                <div className="form-group">
                                                    <DateRangePicker onApply={this.onhandleEventReport} showDropdowns startDate={start} endDate={end}>
                                                      <button>Click to select Date Range!</button>
                                                    </DateRangePicker>
                                                    </div>
                                                </div>
                                              </div>
                                              <div className="row justify-content-md-center">
                                             

                                                <div className="col-md-12 col-xs-12 col-lg-12 col-sm-12">
                                                 <button type="button" onClick={this.exportReportPDF} class="btn btn-success float-right"><span><i class="fa glyphicon glyphicon-export fa-download"></i> Export to PDF</span></button>

                                                     <BootstrapTable ref='ViewOrderTable' data={this.props.MasterArray.ViewOrders} search={ true } multiColumnSearch={ true } pagination>
                                                          <TableHeaderColumn isKey dataSort dataField='ONo'>Order No</TableHeaderColumn>
                                                          <TableHeaderColumn dataSort dataField='date'>Order Date</TableHeaderColumn>
                                                          <TableHeaderColumn width='450' tdStyle={ { whiteSpace: 'pre-wrap' } }  dataField='item'>Order Item</TableHeaderColumn>
                                                           <TableHeaderColumn dataField='total'>₹ Total</TableHeaderColumn>
                                                      </BootstrapTable>
                                                </div>
                                              </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="fifth">
                                      <form encType="multipart/form-data"  onSubmit={this.handleSubmitNotifiy}>
                                       
                                        <FormGroup controlId="NotificationTitle" bsSize="large">
                                          <ControlLabel>Notification Title</ControlLabel>
                                          <FormControl
                                            autoFocus
                                            maxLength = "25"
                                            type="text"
                                            value={this.state.NotificationTitle}
                                            onChange={this.handleChange}
                                          />
                                        </FormGroup>

                                        <FormGroup controlId="NotificationCategory" bsSize="large">
                                          <ControlLabel>Notification To</ControlLabel>
                                                <FormControl 
                                                    onChange={this.empNameSelectCategory}
                                                    componentClass="select" placeholder="select">
                                                     {this.state.createSelectItemsNotifiy}
                                                </FormControl>
                                        </FormGroup>


                                        <FormGroup controlId="NotificationContent" bsSize="large">
                                          <ControlLabel>Notification Content</ControlLabel>
                                          <FormControl
                                            maxLength = "100"
                                            value={this.state.NotificationContent}
                                            onChange={this.handleChange}
                                            type="text"
                                          />
                                        </FormGroup>
                                       
                                        <Button
                                          block
                                          bsSize="large"
                                          disabled={!this.validateFormNotifiy()}
                                          type="submit"
                                        >
                                          Send Notification
                                        </Button>
                                      </form>
                                        </Tab.Pane>
                                      </Tab.Content>
                                    </Col>
                                  </Row>
                                </Tab.Container>
                                <Modal open={open} onClose={this.onCloseModal} center>
                                  <h2 className="model-header">Add New Recipe</h2>
                                    <div className="Login dashoard">
                                      <form encType="multipart/form-data"  onSubmit={this.handleSubmit}>
                                       
                                        <FormGroup controlId="recName" bsSize="large">
                                          <ControlLabel>Recipe Name</ControlLabel>
                                          <FormControl
                                            autoFocus
                                            maxLength = "20"
                                            type="text"
                                            value={this.state.recName}
                                            onChange={this.handleChange}
                                          />
                                        </FormGroup>
                                        <FormGroup controlId="recPrice" bsSize="large">
                                          <ControlLabel>Recipe Price</ControlLabel>
                                          <FormControl
                                            maxLength = "3"
                                            value={this.state.recPrice}
                                            onChange={this.handleChangeID}
                                            type="text"
                                          />
                                        </FormGroup>
                                        <FormGroup controlId="recType">
                                          <ControlLabel>Availability Type</ControlLabel>
                                          <FormControl componentClass="select" value={this.state.recType} onChange={this.handleChange} placeholder="select">
                                            <option value="6">All Days</option>
                                            <option value="1">Monday</option>
                                            <option value="2">Tuesday</option>
                                            <option value="3">Wednesday</option>
                                            <option value="4">Thursday</option>
                                            <option value="5">Friday</option>
                                          </FormControl>
                                        </FormGroup>

                                        <FormGroup controlId="file">
                                        <ControlLabel>Select Recipe Image</ControlLabel>
                                         <input className="fileInput" type="file" onChange={(e)=>this.ImageUploadPreview(e)} />
                                        </FormGroup>
                                         <FormGroup controlId="file">
                                           <div className="imgPreview">
                                            {$imagePreview}
                                          </div>
                                        </FormGroup>

                                        <Button
                                          block
                                          bsSize="large"
                                          disabled={!this.validateForm()}
                                          type="submit"
                                        >
                                          Create
                                        </Button>
                                      </form>
                                    </div>
                                </Modal>
                            </div>
                      </div>
                 </div>
          </div>
         </div>
      </div>
    )

  }
}

function mapStateToProps(MasterArray) {
    return {MasterArray};
}

function  mapDispatchToProps(dispatch) {
    return {
        ViewTodaysOrders : (item) => dispatch(ViewTodaysOrders(item)),
        getAllReciepts : (item) => dispatch(getAllReciepts(item)),
        ViewOrdersReport : (item) => dispatch(ViewOrdersReport(item)),
        ViewOrders: (item) => dispatch(ViewOrders(item)),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(AdminDashboard);