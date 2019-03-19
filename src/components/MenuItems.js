import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addToCart} from '../action/index';
import momentTz from 'moment-timezone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const timeZone = 'Asia/Kolkata'

class MenuItems extends Component {

    onClickAddCart(props){
        toast.info('Item Added to Cart', {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: false,
                      pauseOnHover: true,
                      draggable: true
                  });
        this.props.addToCart(props);

    }

    render() {

        const {item} = this.props;
        switch(item.type)
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
            var Special = '';
        }

        
        const moment = require('moment');
        const momentTz = require('moment-timezone');
        const timeZone = 'Asia/Calcutta|Asia/Kolkata';
        const baseUrlforImage = 'http://172.16.23.18:8001/';
        const AddToCartBtn = () => {
         if(this.props.status == 1)
        {
            let  indexPos = this.props.stateArray.MaxIteamReached.indexOf(item.ID);
            if(indexPos!==-1)
            {
               return <li><button className="btn btn-sm btn-transparent" disabled data-tip="Add to Cart"> Maximum reach </button></li>;
            } else {
              return <li><button className="btn btn-sm btn-transparent" onClick={() => {this.onClickAddCart(item);}} data-tip="Add to Cart"><span class="glyphicon glyphicon-shopping-cart"></span> Add To Cart </button></li>;
            }
            


        }
        else if (this.props.status == 2) {
            return <li><button className="btn btn-sm btn-transparent" disabled data-tip="Add to Cart"> Order Closed </button></li>;
        }
         else {
            return <li><button className="btn btn-sm btn-transparent" disabled onClick={() => {this.onClickAddCart(item);}} data-tip="Add to Cart"><span class="glyphicon glyphicon-shopping-cart"></span> Shop Closed </button></li>;
        }

          
        };
        
        var Timezone = momentTz().utcOffset(timeZone).format('HH');
        let imagePath1 = baseUrlforImage+item.imagePath;
        let imagePath2 = baseUrlforImage+item.imagePath;
        return (
            <div className="col-md-2 col-xs-12 col-lg-2 col-sm-2 menu-list">
                <div className="product-grid">
                <div className="product-image">
                    
                        <img className="pic-1" src={imagePath1} />
                        <img className="pic-2 blur-part" src={imagePath2} />
                   
                    <ul className="social">
                        <AddToCartBtn />
                    </ul>
                    <span className={"product-new-label " +(Special ? "":"hidden")}>{Special}</span>
                    <span className="product-discount-label">50%</span>
                </div>
               
                <div className="product-content">
                    <h3 className="title">{item.fooditem}</h3>
                    <div className="price">₹{ item.price }
                        <span>₹{ item.price * 2 }</span>
                    </div>
                   
                </div>
            </div>
        </div>
        );
    }
}

function mapStateToProps(stateArray) {

    return {stateArray};
}

function mapDispatchToProps(dispatch) {
    return {
        addToCart : (item) => dispatch(addToCart(item))
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MenuItems);