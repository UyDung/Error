import { useReducer } from "react";

import CartContext from "./cart-context";

const defaultCartState = {
    items: [],
    totalAmount: 0,
    totalPrice: 0,
};

const cartReducer = (state, action) => {
    if (action.type === "ADD") {
        const updatedTotalPrice = state.totalPrice + action.item.amount * action.item.price;
        const updatedTotalAmount = state.totalAmount + action.item.amount;

        const existingCartItemIndex = state.items.findIndex((item) => (
            item.id === action.item.id
        ));

        const existingItem = state.items[existingCartItemIndex];

        let updatedItems;
        if (existingCartItemIndex >= 0) {
            
            const updatedItem = {...existingItem, amount: existingItem.amount + action.item.amount };
  
            updatedItems = [...state.items]; 
          //   updatedItems = state.items;  // Để thế này cũng ko sai logic nhưng sai vì reactj render ra, sẽ sai khi tăng hay giảm item bằng cách click vào button
          //   updatedItems = [state.items]; // De nhu nay chay qua 1 vai lan click add item la bao loi TypeError: Cannot read properties of undefined (reading 'id')

            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            updatedItems = state.items.concat(action.item);
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount,
            totalPrice: updatedTotalPrice,
        };
    }

    if (action.type === "REMOVE") {
        const updatedTotalPrice = state.totalPrice - action.item.amount * action.item.price;
        const updatedTotalAmount = state.totalAmount + action.item.amount;

        const updatedItems = state.items.concat(action.item);

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount,
            totalPrice: updatedTotalPrice,
        };
    }

    return defaultCartState;
};

const CartProvider = (props) => {
    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

    const addItemToCart = (item) => {
        dispatchCartAction({ type: "ADD", item: item });
    };

    const removeItemFromCart = (id) => {};

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        totalPrice: cartState.totalPrice,
        addItem: addItemToCart,
        removeItem: removeItemFromCart,
    };

    return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>;
};

export default CartProvider;
