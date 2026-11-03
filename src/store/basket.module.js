import ApiService from "../services/api.service"
const state = {
  idProduct: JSON.parse(window.localStorage.getItem("basketLastOrder")),
  cardProduct: [],
  orders: [],
  newBasketProduct: [],
  quantityChangeID: -1,
  addProductID: false,
  basketModal: false,
  ladingLayoutV: false,
  historyBasket: []
}

const getters = {
  cardProduct(state) {
    return state.cardProduct
  },
  orders(state) {
    return state.orders
  },
  idProduct(state) {
    if (state.idProduct == null)
      state.idProduct = {
        order_id: 0
      }
    return state.idProduct
  },
  currentLocation(state) {
    if (state.idProduct == null) {
      return window.localStorage.getItem("location_id")
    }
    if (state.idProduct.location_id == undefined) {
      return window.localStorage.getItem("location_id")
    }
    if (state.idProduct.location_id) {
      return state.idProduct.location_id
    }
    return window.localStorage.getItem("location_id")
  },
  newBasketProduct(state) {
    return state.newBasketProduct
  },
  selectedChild() {
    return state.selectedChild
  },
  quantityChangeID() {
    return state.quantityChangeID
  },
  addProductID() {
    return state.addProductID
  },
  basketModal() {
    return state.basketModal
  },
  ladingLayoutV() {
    return state.ladingLayoutV
  },
  historyBasket() {
    return state.historyBasket
  }
}
const actions = {
  setProduct({ commit }, { ctx }) {
    commit("setProductMut", ctx)
  },
  setOrders({ commit }, { ctx }) {
    commit("setOrdersMut", ctx)
  },
  setIdProduct({ commit }, { ctx }) {
    commit("setIdProductMut", ctx)
  },
  setNewBasketProduct({ commit }, { ctx }) {
    commit("setNewBasketProduct", ctx)
  },
  setQuantityChangeID({ commit }, { ctx }) {
    commit("setQuantityChangeID", ctx)
  },
  setAddProductID({ commit }, { ctx }) {
    commit("setAddProductID", ctx)
  },
  setBasketModal({ commit }, { ctx }) {
    commit("setBasketModal", ctx)
  },
  setladingLayoutV({ commit }, { ctx }) {
    commit("setladingLayoutV", ctx)
  },
  setHistoryBasket({ commit }, { ctx }) {
    commit("setHistoryBasket", ctx)
  },
  setHistoryBasketPage({ commit }, { ctx }) {
    commit("setHistoryBasket", ctx)
  },
  setCurrentLocation({ commit }, { ctx }) {
    commit("setCurrentLocation", ctx)
  }
}
const mutations = {
  setProductMut(state, ctx) {
    if (ctx.length > 0) {
      let AllProduct = ctx.map(e => {
        return {
          name: e.product.name,
          id: e.product.id,
          addId: e.id,
          lastUpdate: e.last_update,
          quantity: e.quantity,
          price: e.price.toString(),
          discount_price: e.discount_price ? e.discount_price.toString() : null,
          val: true,
          total_sum: e.total_sum,
          img: e.product.img,
          newProduct: e.newProduct,
          changeQuantity: e.changeQuantity,
          is_delete: e.is_delete,
            leftovers_salvi: e.leftovers_salvi || e.product.leftovers_salvi,
            leftovers_supplier: e.leftovers_supplier || e.product.leftovers_supplier,
            supplier_delivery_postpone: e.supplier_delivery_postpone || e.product.supplier_delivery_postpone,
            multiplicity: e.multiplicity || e.product.multiplicity,
            isSpecificationProduct: e.isSpecificationProduct || e.product.isSpecificationProduct || e.is_specification,
            is_strict_multiplicity: e.is_strict_multiplicity || e.product.is_strict_multiplicity,
            strict_multiplicity: e.strict_multiplicity || e.product.strict_multiplicity,
            is_temperature_conditions : e.is_temperature_conditions  || e.product.is_temperature_conditions
        }
      })
      AllProduct.forEach((e, index) => {
        e.index = index
      })
      state.newBasketProduct = AllProduct
    } else {
      state.newBasketProduct = []
    }

    state.cardProduct = ctx
  },
  setOrdersMut(state, ctx) {
    let ctxStatus = []
    ctx.forEach(e => {
      ctxStatus.push(e)
    })
    state.orders = ctxStatus
  },
  setIdProductMut(state, ctx) {
    if (ctx !== null) {
      if (ctx.order_id == 0) state.newBasketProduct = []
      window.localStorage.setItem("basketLastOrder", JSON.stringify(ctx))
      state.idProduct = ctx
    } else {
      ctx = 0
      state.idProduct.order_id = ctx
      window.localStorage.setItem("basketLastOrder", JSON.stringify(ctx))
    }
  },
  setNewBasketProduct(state, ctx) {
    if (ctx.length !== 0) {
      if (ctx.newProduct === undefined || ctx.newProduct === true) {
        ctx.newProduct = true
      } else {
        ctx.newProduct = false
      }
      if (ctx.val == true) {
        state.quantityChangeID = ctx.id
        setTimeout(() => {
          state.quantityChangeID = -1
        }, 2000)
        let found = false
        for (let i = 0; i < state.newBasketProduct.length; i++) {
          if (state.newBasketProduct[i].id == ctx.id) {
            state.newBasketProduct.splice(i, 1, ctx)
            found = true
            break
          }
        }

        if (!found) {
          state.newBasketProduct.push(ctx)
          state.newBasketProduct.sort(function(a, b) {
            if (ctx.index !== undefined) {
              if (a.index > b.index) {
                return 1
              }
              if (a.index < b.index) {
                return -1
              }
            } else {
              ctx.index = state.newBasketProduct.length + 1
            }
            return 0
          })
        }
      } else {
        for (let i = 0; i < state.newBasketProduct.length; i++) {
          if (state.newBasketProduct[i].id == ctx.id) {
            state.newBasketProduct.splice(i, 1)
          }
        }
      }
    } else state.newBasketProduct = ctx
  },
  // eslint-disable-next-line no-unused-vars
  clearNewBasket(state, ctx) {
    let clear = []

    state.newBasketProduct = clear
  },
  setQuantityChangeID(state, ctx) {
    state.quantityChangeID = ctx
  },
  setAddProductID(state, ctx) {
    state.addProductID = ctx
  },
  setBasketModal(state, ctx) {
    state.basketModal = ctx
  },
  setladingLayoutV(state, ctx) {
    state.ladingLayoutV = ctx
  },
  setHistoryBasket(state, ctx) {
    let i = 1
    if (ctx.page !== undefined) {
      i = ctx.page
    }
    let id = state.idProduct.order_id
    if (id == undefined) id = 0
    ApiService.post("/graphql", {
      query:
        `
                        query{
                          cartProductHistory(order_id: ` +
        id +
        ` page: ` +
        i +
        `  perPage: 20 order: "DESC" orderBy: "id"){
                              totalCount
                              items{
                                id
                                cart_id
                                user_id
                                username
                                message
                                created_at
                              }
                          }
                          cart(order_id: ` +
        id +
        `){
                               id
                               location_id
                               location_name
                               cost_center_id
                               cost_center_name
                               order_id
                               total
                             }
                        }`
    }).then(response => {
      if (ctx.page == 1 || ctx.page == 0) {
        state.historyBasket = response.data.data.cartProductHistory
      } else {
        let i = state.historyBasket.items
        if (i === undefined) {
          i = []
        }
        state.historyBasket = {
          items: [...i, ...response.data.data.cartProductHistory.items],
          totalCount: response.data.data.cartProductHistory.totalCount
        }
      }
      if (response.data.data.cart[0] === undefined) {
        state.idProduct = { order_id: 0 }
      } else {
        state.idProduct = response.data.data.cart[0]
      }
    })
  },
  setCurrentLocation(state, ctx) {
    if (state.idProduct.location_id == undefined)
    {
     if(state.idProduct == undefined || state.idProduct == 0)
     {
       state.idProduct = {
         location_id: ctx,
         order_id: 0
       }
     }
     else
     {
       state.idProduct.location_id = ctx
     }
    }
    else
    {
      state.idProduct.location_id = ctx
    }
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
