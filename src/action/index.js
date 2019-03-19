export const LOGIN = 'LOGIN';
export const ITEM = 'ITEM';
export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const UPDATE = 'UPDATE';
export const CLEAR = 'CLEAR';
export const VIEW = 'VIEW';
export const VIEWTODAY = 'VIEWTODAY';
export const VIEWRECIEPT = 'VIEWRECIEPT';
export const VIEWREPORT = 'VIEWREPORT';
export const STORESTATUS = 'STORESTATUS';

export function LoginUpdate(item) {
    return {
        type : LOGIN,
        item                                // this is same as newItem : newItem in ES6
    }
}

export function ItemUpdate(item) {
    return {
        type : ITEM,
        item                                // this is same as newItem : newItem in ES6
    }
}

export function addToCart(item) {
    return {
        type : ADD,
        item                                // this is same as newItem : newItem in ES6
    }
}

export function removeFromCart(item) {
    return {
        type : REMOVE,
        item
    }
}

export function UpdateFromCart(item) {
    return {
        type : UPDATE,
        item
    }
}
export function clearCart(item) {
    return {
        type : CLEAR,
        item                                // this is same as newItem : newItem in ES6
    }
}
export function ViewOrders(item) {
    return {
        type : VIEW,
        item                                // this is same as newItem : newItem in ES6
    }
}
export function ViewTodaysOrders(item) {
    return {
        type : VIEWTODAY,
        item                                // this is same as newItem : newItem in ES6
    }
}

export function getAllReciepts(item) {
    return {
        type : VIEWRECIEPT,
        item                                // this is same as newItem : newItem in ES6
    }
}

export function ViewOrdersReport(item) {
    return {
        type : VIEWREPORT,
        item                                // this is same as newItem : newItem in ES6
    }
}

export function UpdateStoreStatus(item) {
    return {
        type : STORESTATUS,
        item                                // this is same as newItem : newItem in ES6
    }
}





