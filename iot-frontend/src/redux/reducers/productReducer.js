import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {
    addItem: (state, action) => {
      const id = action.payload.id;
      const price = Number(action.payload.price);
      const index = state.findIndex(item => item.id === id);
      if (index !== -1) {
        //console.log("the item already exists in the cart")
        // If the item already exists in the cart, update the quantity
        state[index].quantity += 1;
        state[index].price += price;
      } else {
        // If the item doesn't exist in the cart, add it
        //console.log("the item doesn't exist in the cart")
        state.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      state.pop()
    },
    clearItem: (state) => {
      state = [];
      return [];
    }
  }
});

export const { addItem, removeItem, clearItem } = productSlice.actions;
export default productSlice.reducer