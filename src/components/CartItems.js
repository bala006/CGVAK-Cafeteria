import React, {Component} from 'react';
import {connect} from 'react-redux';
import {removeFromCart,addToCart,UpdateFromCart} from "../action/index";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class CartItems extends Component {

    render(){
        console.log(this.props);

        return (
            <div>
                {this.getdata()}
            </div>
        );
    }

    constructor() {
    super();
     this.handleChangeUpdate = this.handleChangeUpdate.bind(this)
    }
     onClickRemoveCart(props){

        toast.info('Item Removed from Cart', {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: false,
                      pauseOnHover: true,
                      draggable: true
                  });
        this.props.removeFromCart(props);

    }

    handleChangeUpdate(objects,e)
    {
        var data = e.target.value;
        if(!isNaN(data))
        {
            if(data >= 1 && data <= 10)
            {
                 objects.qty = data   
                 this.props.UpdateFromCart(objects)
            } 
           
        }
        
    }

    

     getdata(){
        console.log(this.props.stateArray);
        
        return this.props.stateArray.cart.map((item,index) => {
            const baseUrlforImage = 'http://172.16.23.18:8001/'
            let imagePath1 = baseUrlforImage+item.imagePath;
            let imagePath2 = baseUrlforImage+item.imagePath;
            if(item.qty >= 10)
            {
                item.qty = 10;
            }
            return (

                        <div className="row justify-content-md-center cart-items">
                            <div className="col-md-12 col-xs-12 col-lg-12 col-sm-12">
                                <div className="product-grid">
                                    <div className="product-content">
                                       <h3 className="title">{item.fooditem}</h3>
                                        <div className="price">₹{ item.price }
                                            
                                                <span>₹{ item.price * 2 }</span> <br></br>
                                           

                                          <div className="text-center col-md-offset-2 col-lg-offset-2 col-sm-offset-2 col-md-8 col-xs-8 col-lg-8 col-sm-8">
                                           
                                           
                                             <div class="quantity">
                                                  
                                                    <input type="number" key={index} step="1" max="10" min="1" value={item.qty} onChange={this.handleChangeUpdate.bind(this, item)} title="Qty" class="qty"
                                                           size="4" />
                                                   
                                            </div>
                                             
                                              
                                           
                                         </div>
                                         <button className="btn btn-outline-danger btn-xs" onClick={()=>{this.onClickRemoveCart(item)}} href="#"><span class="glyphicon glyphicon-trash"></span> </button>
                                         
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            );
        })
    }
}

function mapStateToProps(stateArray) {
    // console.log(Object.values(stateArray)[1]);
    // console.log(stateArray);
    // stateArray = Object.values(stateArray)[1].map((item) => (
    //     {
    //         'item' : item
    //     }
    // ));
    // stateArray.every((item)=>{
    //    return item;
    // });
    return {stateArray};
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateFromCart : (item) => dispatch(UpdateFromCart(item)),
        removeFromCart : (item) => dispatch(removeFromCart(item))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);
