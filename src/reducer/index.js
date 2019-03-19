import {ADD, REMOVE, UPDATE, ITEM, LOGIN, CLEAR, VIEW, VIEWTODAY, VIEWRECIEPT, VIEWREPORT, STORESTATUS} from "../action/index";


// https://github.com/reactjs/react-redux/blob/d5bf492ee35ad1be8ffd5fa6be689cd74df3b41e/src/components/createConnect.js#L91
let initialState = {
    inventory: [],
    cart: [],
    LoginDetails: [],
    ViewOrders: [],
    ViewAdminOrders: [],
    GetAllRecieptName: [],
    ViewOrdersReport:[],
    StoreStatusData:1,
    MaxIteamReached:[],
    total: [{totalvalue:0}]
};

const todos = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
                state.LoginDetails = {
                    EmpId: localStorage.getItem('EMPID'),
                    EmpName: localStorage.getItem('EMPName'),
                    EmpType: localStorage.getItem('EMPType'),
                }
                console.log(state.LoginDetails)
                return {
                ...state
            };
                 console.log(state.LoginDetails)
        case ITEM:
                 state.inventory = action.item
                 return {
                ...state,
                [action.cart] : state.cart
            };
         case CLEAR:
                 state.cart = [];
                 total: [{totalvalue:0}];
                 updateTotal(state);
                 return {
                ...state,
                [action.cart] : state.cart
            };
         case VIEW:
                state.ViewOrders = action.item
                console.log(state.ViewOrders);
                 return {
                ...state,
                [action.cart] : state.cart
            };
         case VIEWTODAY:
                state.ViewAdminOrders = action.item
                console.log(state.ViewAdminOrders);
                 return {
                ...state,
                [action.cart] : state.cart
            }; 
        case VIEWRECIEPT:
                state.GetAllRecieptName = action.item
                
                 return {
                ...state,
                [action.cart] : state.cart
            };
        case STORESTATUS:
            state.StoreStatusData = action.item
        return {
                ...state,
                [action.cart] : state.cart
            };
        case VIEWREPORT:
                state.ViewOrdersReport = action.item
                 return {
                ...state,
                [action.cart] : state.cart
            };     
        case ADD :
            let alreadyInCart = false;
            if(state.cart.length>0) {
                state.cart = state.cart.map((cartitem) => {
                    
                    if (cartitem.ID===action.item.ID) {
                        cartitem.qty = parseInt(cartitem.qty) + parseInt(1);
                        alreadyInCart=true;
                        if(cartitem.qty >= 10)
                        {
                            var index = state.MaxIteamReached.indexOf(cartitem.ID);
                            if(index ==-1)
                            {
                                state.MaxIteamReached.push(cartitem.ID)
                            }
                        }
                    }
                    return cartitem;
                });

                
            }

            if(!alreadyInCart)
            {
                
                state.cart.push({
                    ID: action.item.ID,
                    fooditem: action.item.fooditem,
                    price: action.item.price,
                    qty: 1,
                    imagePath:action.item.imagePath
                });
            }
            updateTotal(state);
            //apart from cart state all objects of state remains same
            return {
                ...state,
                [action.cart] : state.cart
            };

        case REMOVE :
            console.log("Food Item to be removed: "+ action.item.fooditem);
            let index=-1;
            state.cart.every((cartItem) => {
                if(cartItem.ID===action.item.ID)
                {
                    index= state.cart.indexOf(cartItem);
                    var index2 = state.MaxIteamReached.indexOf(cartItem.ID);
                    if(index2!==-1){
                        state.MaxIteamReached.splice(index2,1);
                    }
                }
                return index;
            });
            if(index!==-1) {
                state.cart.splice(index,1);
                //delete state.cart[index];


            }
            updateTotal(state);
            //apart from cart state all objects of state remains same
            return {
                ...state,
                [action.cart] : state.cart
            };
          case UPDATE :
               
                state.cart.every((cartItem) => {
                    if(cartItem.ID===action.item.ID)
                    {
                        index= state.cart.indexOf(cartItem);

                        cartItem.qty = action.item.qty
                         
                        if(cartItem.qty < 10)
                        {
                           var index2 = state.MaxIteamReached.indexOf(cartItem.ID);
                           if(index2!==-1){
                                state.MaxIteamReached.splice(index2,1);
                            }
                        } 
                        else if(cartItem.qty >= 10)
                        {
                            var index2 = state.MaxIteamReached.indexOf(cartItem.ID);
                            if(index2 ==-1)
                            {
                                state.MaxIteamReached.push(cartItem.ID)
                            }
                        }
                       
                    }
                    });
                console.log(state.cart)


               /* state.cart.push({
                    fooditem: action.item.fooditem,
                    price: action.item.price,
                    qty: action.item.qty
                });*/

            updateTotal(state);
            //apart from cart state all objects of state remains same
            return {
                ...state,
                [action.cart] : state.cart
            };

        default :
            return state;
    }
};

export function updateTotal(state) {
    if(state.cart.length>0) {
       
        let total=0;
        state.cart.every((cartitem)=>
        {
            
            total+= (cartitem.price*cartitem.qty);
            return total;
        });
       
        state.total.totalvalue = total;
    }
    else
    {
        state.total.totalvalue = 0;
    }
    return state;
}

export default todos;
