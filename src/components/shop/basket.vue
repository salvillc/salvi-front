<template>
  <div
    v-show="$route.name !== 'order-create'"
    class="basket width-no-container"
    :class="{
      open: basketModal,
      fullscreen: $store.getters['params/mobileView']
    }"
  >
<!--    <div-->
<!--      class="basket__icon svg-container"-->
<!--      :class="{-->
<!--        plus: countProduct,-->
<!--        pulse:-->
<!--          (cardProduct.length && !basketModal) ||-->
<!--          (newBasketProduct.length && !basketModal)-->
<!--      }"-->
<!--      @click="basketModalFunc"-->
<!--    >-->
<!--      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--        <path d="M2 14V2H1C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0H3C3.26522 0 3.51957 0.105357 3.70711 0.292893C3.89464 0.48043 4 0.734784 4 1V13H16.438L18.438 5H7C6.44772 5 6 4.55228 6 4C6 3.44772 6.44772 3 7 3H19.72C19.872 3 20.022 3.03466 20.1586 3.10134C20.2952 3.16801 20.4148 3.26495 20.5083 3.38479C20.6019 3.50462 20.6668 3.6442 20.6983 3.79291C20.7298 3.94162 20.7269 4.09555 20.69 4.243L18.19 14.243C18.1358 14.4592 18.011 14.6512 17.8352 14.7883C17.6595 14.9255 17.4429 15 17.22 15H3C2.73478 15 2.48043 14.8946 2.29289 14.7071C2.10536 14.5196 2 14.2652 2 14ZM4 21C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19C2 18.4696 2.21071 17.9609 2.58579 17.5858C2.96086 17.2107 3.46957 17 4 17C4.53043 17 5.03914 17.2107 5.41421 17.5858C5.78929 17.9609 6 18.4696 6 19C6 19.5304 5.78929 20.0391 5.41421 20.4142C5.03914 20.7893 4.53043 21 4 21ZM16 21C15.4696 21 14.9609 20.7893 14.5858 20.4142C14.2107 20.0391 14 19.5304 14 19C14 18.4696 14.2107 17.9609 14.5858 17.5858C14.9609 17.2107 15.4696 17 16 17C16.5304 17 17.0391 17.2107 17.4142 17.5858C17.7893 17.9609 18 18.4696 18 19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21Z" fill="#646c9a"/>-->
<!--      </svg>-->
<!--    </div>-->
<!--    <div-->
<!--      v-if="cardProduct.length || newBasketProduct.length"-->
<!--      class="basket__icon__count"-->
<!--      :class="{ big: newBasketProduct.length > 99 }"-->
<!--    >-->
<!--      {{ newBasketProduct.length }}-->
<!--    </div>-->
    <div @click="basketModalFunc" class="basket__overflow"></div>
    <div class="bascet__modal">
      <my-dialog
        :model="myDialog"
        :button-one="btnClose"
        :button-two="btnApprove"
        :item="dialogItem"
        :text="dialogText"
        :headline="dialogHeadline"
        @buttonOne="buttonOne"
        @buttonTwo="buttonTwo"
      >
        <p slot="text">{{ dialogText }}</p>
      </my-dialog>
      <div class="basket__head" :class="{ newOrder: idProduct.order_id == 0 }">
        <div v-if="idProduct.order_id == 0" class="caption">
          {{ !historyModal ? "Кошик" : "Історія змін" }}
        </div>
        <div v-if="idProduct.order_id != 0" class="caption">
          {{ !historyModal ? `Замовлення №${idProduct.order_id}` : "Історія змін" }}
        </div>
        <div class="basket__modal-close" @click="basketModalFunc">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.364 4.95L10.607 0.707001C10.9975 0.316536 11.6305 0.316535 12.021 0.707C12.4115 1.09747 12.4115 1.73053 12.021 2.121L7.778 6.364L12.021 10.607C12.4115 10.9975 12.4115 11.6305 12.021 12.021C11.6305 12.4115 10.9975 12.4115 10.607 12.021L6.364 7.778L2.121 12.021C1.73054 12.4115 1.09747 12.4115 0.707 12.021C0.316535 11.6305 0.316535 10.9975 0.707 10.607L4.95 6.364L0.707001 2.121C0.316536 1.73054 0.316535 1.09747 0.707 0.707C1.09747 0.316535 1.73053 0.316535 2.121 0.707L6.364 4.95Z" fill="#565656"/>
          </svg>
        </div>
      </div>
      <div ref="basketBody" class="basket__body">
        <div v-if="!historyModal && newBasketProductComputed.length > 0" class="basket__sub-header">
          <div class="basket__sub-header-title">
            Товари
          </div>
          <div
            v-if="idProduct.order_id == 0"
            class=" button button__red"
            :class="{ 'mini-delete': $store.getters['params/mobileView'] }"
            @click="clearBasketOpenModal"
          >
            Очистити корзину
          </div>
        </div>
        <transition name="modalBody" mode="out-in">
          <div
            v-if="!historyModal && basketModal && newBasketProductComputed.length > 0"
            key="list"
            class="basket__body__wrap"
          >
            <template
              v-for="(date, index) of deliveryDateArray"
              :key="index"
            >
              <div v-if="date.id == 1" style="order: 1; -webkit-order: 1;" class="basket-delivery__title"> Доступно на наступний робочий день ({{getNextDay()}}):</div>
              <div v-else-if="date.id == 0" style="order: 9999999999999999; -webkit-order: 9999999999999999;" class="basket-delivery__title">Доступність повідомимо додатково:</div>
              <div v-else :style="`order: ${date.id}; -webkit-order: ${date.id};`" class="basket-delivery__title">Доступно на ({{date.date}}) ({{getDayName(date.date)}}):</div>
            </template>

            <div
              v-for="(item, index) of newBasketProductComputed"
              v-show="newBasketProduct.length"
              :style="`order: ${getOrderProduct(item)}; -webkit-order: ${getOrderProduct(item)}`"
              :key="item.id"
              class="item-row"
              :class="{
                active: rowBG === item.id && item.newProduct,
                blur:
                  loadProduct &&
                  quantityChangeID !== item.id &&
                  !item.lastUpdate,
                activeBG:
                  (rowBG !== item.id && quantityChangeID == item.id) ||
                  item.lastUpdate,
                productDelete: item.is_delete
              }"
            >
              <div :class="['img-name', prod_delete.includes(item.id) && 'opacity']">
                <div v-if="item.is_temperature_conditions" class="badge__isTemp">
                  <v-tooltip top max-width="320px">
                    <span>Товар вимагає дотримання температурного режиму зберігання</span>
                    <span slot="activator">
                      <font-awesome-icon :icon="['fas', 'temperature-low']" />
                    </span>
                  </v-tooltip>
                </div>
                <img :src="item.img" alt="Зображення товару" />
                <div class="name">
                  <v-tooltip top max-width="320px">
                    <div class="wrap-text">{{ item.name }}</div>
                    <span slot="activator" class="d-block">
                      <custom-text :text="item.name" />
                    </span>
                  </v-tooltip>
                </div>
              </div>
              <div class="count">
                <div v-if="!prod_delete.includes(item.id) && !prod_cancel.includes(item.id)" class="quantity-section">
                  <button class="minus-btn" @click="changeQuantity(item, 'remove', index, item.id)">
                    <v-icon color="#4caf50">remove</v-icon>
                  </button>

                  <input
                    type="number"
                    min="1"
                    name="item-quantity"
                    :value="item.quantity"
                    :data-quantity="item.quantity"
                    @input="handleQuantityInput(item, $event.target.value, index, item.id)"
                    @change="handleQuantityCommit(item, $event.target.value, index, item.id)"
                    @blur="handleQuantityCommit(item, $event.target.value, index, item.id)"
                    @keyup.enter="$event.target.blur()"
                  >

                  <button class="plus-btn" @click="changeQuantity(item, 'add', index, item.id)">
                    <v-icon color="#4caf50">add</v-icon>
                  </button>
                </div>
                <div @click="handeleCancelDelete(item.id)" v-if="prod_delete.includes(item.id)" class="basket__cancel-delete">
                  Повернути до замовлення
                </div>
                <div @click="handleChangeProduct(item, index)" v-if="prod_cancel.includes(item.id) && !prod_delete.includes(item.id)" class="basket__change-product">
                  Підібрати заміну
                </div>

                <div v-if="item.multiplicity > 1" class="multiplicity__container">
                  <v-tooltip max-width="320px" bottom z-index="101">
                    <span slot="activator" class="multiplicity__info-icon">?</span>
                    <div v-if="item.strict_multiplicity" class="wrap-text">Товар можливо замовити лише кратно упаковці</div>
                    <div v-if="!item.strict_multiplicity && item.is_strict_multiplicity" class="wrap-text">Товар замовлено кратно упаковці</div>
                    <div v-if="!item.strict_multiplicity && !item.is_strict_multiplicity" class="wrap-text">Товар замовлено не кратно упаковці</div>
                  </v-tooltip>

                  <div
                          v-if="!item.strict_multiplicity"
                          @click="handleChangeMultiplicity(index)"
                          :class="['multiplicity__toggle', item.is_strict_multiplicity && 'active']"
                  >
                    <div class="multiplicity__toggle-button"></div>
                    <div class="multiplicity__toggle-count">{{ item.multiplicity }}</div>
                  </div>

                  <div
                          v-if="item.strict_multiplicity"
                          :class="['multiplicity__toggle', 'active']"
                  >
                    <div class="multiplicity__toggle-count">{{ item.multiplicity }}</div>
                  </div>
                </div>
              </div>
              <div v-if="!prod_delete.includes(item.id) && !prod_cancel.includes(item.id)" class="summ">
                <template v-if="item.discount_price && item.discount_price != '0.00' && item.discount_price != '0'">
                  <span class="new-price-container">
                    <span class="new-price">{{ item.price | price-break }} &#8372; </span>
                    <span class="old">{{ item.discount_price | price-break }} &#8372; </span>
                  </span>
                </template>
                <template v-else>
                  <span>{{ item.price | price-break }} &#8372; </span>
                </template>

                <v-tooltip v-if="item.isSpecificationProduct" top max-width="320px">
                  <span>Товар зi спецiфiкацii</span>
                  <span slot="activator" class="icon__isSpec">
                      <font-awesome-icon :icon="['fas', 'tag']" />
                    </span>
                </v-tooltip>
              </div>
              <div v-else>
                <span v-if="prod_cancel.includes(item.id)">
                  <b>Товар закінчився</b>
                </span>
              </div>
              <div v-if="!prod_delete.includes(item.id)" class="action">
                <svg @click="buttonTwo(item, index, true)" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3.2H16V4.8H14.4V15.2C14.4 15.4122 14.3157 15.6157 14.1657 15.7657C14.0157 15.9157 13.8122 16 13.6 16H2.4C2.18783 16 1.98434 15.9157 1.83431 15.7657C1.68429 15.6157 1.6 15.4122 1.6 15.2V4.8H0V3.2H4V0.8C4 0.587827 4.08429 0.384344 4.23431 0.234315C4.38434 0.0842854 4.58783 0 4.8 0H11.2C11.4122 0 11.6157 0.0842854 11.7657 0.234315C11.9157 0.384344 12 0.587827 12 0.8V3.2ZM12.8 4.8H3.2V14.4H12.8V4.8ZM5.6 1.6V3.2H10.4V1.6H5.6Z" fill="#BCBCBC"/>
                </svg>
              </div>
            </div>
          </div>
          <div v-if="!historyModal && basketModal && newBasketProductComputed.length == 0"
               key="list"
               class="basket__body__wrap">
            <div class="basket__no-product">
              <div class="basket__no-product-text">
                В вашій корзині поки що немає товарів
              </div>
              <router-link @click="basketModalFunc" to="/catalog" class="basket__no-product-button">
                До каталогу
              </router-link>
            </div>
          </div>
          <div
            v-if="historyModal"
            key="hist"
            class="basket__body__wrap"
            :class="{ history: historyModal }"
          >
            <div
              v-for="(item, index) of historyBasket.items"
              :key="index"
              class="item-row item-row__history"
            >
              <div class="date">
                {{ item.created_at | formatDateDotWithTime }}
              </div>
              <div class="user ellipsis">
                <v-tooltip max-width="150px" left>
                  <span slot="activator">{{
                    item.username | truncate(50, "...")
                  }}</span>
                  <span>{{ item.username }}</span>
                </v-tooltip>
              </div>
              <div class="action__user ellipsis">
                <v-tooltip
                  v-if="item.message.length > 50"
                  max-width="150px"
                  left
                >
                  <span slot="activator">{{
                    item.message | truncate(50, "...")
                  }}</span>
                  <span>{{ item.message }}</span>
                </v-tooltip>
                <span v-else>{{ item.message }}</span>
              </div>
            </div>
            <scroll-loader v-if="loadMore" :loader-method="historyUpdate" />
          </div>
        </transition>
      </div>
      <div class="basket__footer">
        <div class="basket__footer__row">
          <div
                  v-if="
            !idProduct.order_id > 0 &&
              newBasketProduct.length > 0 &&
              !loadAddProduct &&
              !changeInputBlock
          "
            class="button button__green-basket no-menu"
            @click="createNewOrder"
          >
            Оформити замовлення
            <span v-if="!orederInorder">
              {{ getSumm() | price-break }} ₴
            </span>
          </div>
          <div
            v-if="changeInputBlock"
            class="button button__green load active"
          >
            <div class="btn-load active">
              <i></i>
              <i></i>
              <i></i>
            </div>
            Збереження
          </div>
          <div
            v-if="loadAddProduct"
            class="button button__purple"
            :class="{
              'mini-add': $store.getters['params/mobileView'],
              'load active': this.loadAddProduct
            }"
          >
            <div class="btn-load" :class="{ active: changeInputBlock }">
              <i></i>
              <i></i>
              <i></i>
            </div>
            Оновлення
          </div>
          <div
            v-if="
              idProduct.order_id > 0 &&
                newBasketProduct.length > 0 &&
                !loadAddProduct &&
                !changeInputBlock
            "
            class="button button__green-basket no-menu"
            :class="{ 'mini-add': $store.getters['params/mobileView'] }"
            @click="addProduct"
          >
            {{productNoSynchronization ? 'Додати в замовлення' : 'Перейти до замовлення'}}
            <span v-if="!orederInorder">
              {{ getSumm() | price-break }} ₴
            </span>
          </div>
        </div>
      </div>
    </div>
    <ModalExceeds :item="itemExceeds" :close="itemExceedsClose" />
    <div v-if="deleteProductModal" class="modal-choose">
      <div class="modal-choose__container">
        <div @click="deleteModalClose" class="modal-choose__close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#000000"/>
          </svg>
        </div>
        <div class="modal-choose__title">
          Ви впевнені, що хочете очистити корзину?
        </div>
        <div class="modal-choose__button-group">
          <div @click="deleteModalClose" class="modal-choose__button">
            Ні
          </div>
          <div @click="clearBasket" class="modal-choose__button">
            Так
          </div>
        </div>
      </div>
    </div>

    <div v-if="availableProductModal" class="modal-choose">
      <div class="modal-choose__container big">
        <div @click="availableProductModalClose" class="modal-choose__close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#000000"/>
          </svg>
        </div>
        <div class="modal-choose__title">
          Недоступні товари для замовлення
        </div>
        <div class="modal-choose__available-title">
          Нажаль, деякі товари закінчились, будь-ласка оберіть заміну з нашого каталогу до таких товарів:
        </div>
        <div v-if="availableProduct.length">
          <div v-for="prod in availableProduct" class="modal-choose__available-item">
            <div class="modal-choose__available-item-img">
              <img :src="prod.images[0].url" alt="">
            </div>
            <div class="modal-choose__available-item-name">{{prod.name}}</div>
            <div class="modal-choose__available-item-price">{{prod.buy_price | price-break}} ₴</div>
          </div>
        </div>
        <div class="modal-choose__button-group">
          <div @click="availableProductModalClose" class="modal-choose__button">
            Зрозуміло
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex"
import create_order from "@/views/orders/create-order"
import ModalExceeds from "../../components/modalExceeds"
import CustomText from "../../components/custom-text"
import moment from "moment";

export default {
  name: "Basket",
  components: {
    create_order,
      ModalExceeds,
      CustomText
  },
  props: [],
  data: function() {
      return {
          deleteProductModal: false,
          availableProductModal: false,
          availableProduct: [],
          itemExceeds: null,
          notAvailability: [],
          prod_delete: [],
          prod_cancel: [],
          // prod_leftovers: [],
          loading: false,
          historyModal: false,
          value: "номер замовлення",
          idSelect: 0,
          inputDisable: false,
          countProduct: false,
          rowBG: -1,
          rowBGCount: 0,
          myDialog: false,
          btnClose: {name: "Скасувати", class: "button__blue"},
          btnApprove: {name: "Підтвердити", class: "button__yellow"},
          dialogText: "",
          dialogItem: {},
          dialogHeadline: "",
          myDialogAction: "",
          quantityModalChange: 1,
          dialogCreate: false,
          update: false,
          model: {
              delivery_date: "",
              company_entity_id: "",
              location_id: "",
              cost_center_id: "",
              contract_id: "",
              budget_id: "",
              comment: ""
          },
          arrDelete: [],
          loadProduct: false,
          loadAddProduct: false,
          changeInputBlock: false,
          pageHistory: 1,
          loadMore: true,
          orederInorder: false,
          productNoSynchronization: false,
          deliveryDateArray: [],
          debounceTimers: {}
      };
  },
  computed: {
    ...mapGetters("basket", [
      "cardProduct",
      "orders",
      "idProduct",
      "newBasketProduct",
      "quantityChangeID",
      "basketModal",
      "historyBasket"
    ]),
    ...mapGetters("user", ["currentUser"]),
    newBasketProductComputed() {
      return this.newBasketProduct.map(e => {
        setTimeout(() => (e.lastUpdate = false), 2000)
        return e
      })
    }
  },
  watch: {
    $route(e) {
      if (this.$route.query.basket == 'open') {
          setTimeout(() => {
              this.setBasketModal({
                  ctx: true
              })
          }, 1000)
      } else {
          setTimeout(() => {
              this.setBasketModal({
                  ctx: false
              })
          }, 1000)
      }
    },
    newBasketProductComputed(arr) {
        // this.checkProduct()
        this.getDeliveryDateArray()
        // this.checkProductLeftovers()
      this.productNoSynchronization = arr.find(function(element) {
        if (element.newProduct || element.changeQuantity) {
          return true
        }
      })
      if (arr.length < this.cardProduct.length) {
        this.productNoSynchronization = true
      }
    },
      getProductNoSynchronization() {
          return this.productNoSynchronization;
      },
    loading(e) {
      this.$loadingBus.$emit("updateBasket", e)
    },
    newBasketProduct(e) {
      this.historyUpdate()
      this.countProductFunc()
      this.rowBGFunc(e)
      this.loadBasket()
      this.pageHistory = 1
      this.historyModal = false
    },
    cardProduct() {
      this.countProductFunc()
    },
    historyModal() {
      this.scrollDownBasket()
    },
    basketModal(e) {
      if (e) this.scrollDownBasket()
    }
  },
  created() {
    this.historyUpdate()
    this.$loadingBus.$on("cartFreez", this.cartFreez)
  },
  beforeDestroy() {
    this.$loadingBus.$off("cartFreez", this.cartFreez)
    if (this.debounceTimers) {
      Object.keys(this.debounceTimers).forEach(key => {
        clearTimeout(this.debounceTimers[key])
      })
    }
  },
    mounted() {
        if (this.$route.query.basket == 'open') {
            setTimeout(() => {
                this.setBasketModal({
                    ctx: true
                })
            }, 1000)

        } else {
            setTimeout(() => {
                this.setBasketModal({
                    ctx: false
                })
            }, 1000)
        }

    },
  methods: {
    ...mapActions("basket", [
      "setIdProduct",
      "setNewBasketProduct",
      "setAddProductBul",
      "setQuantityChangeID",
      "setProductMut",
      "setBasketModal",
      "setHistoryBasket",
      "setHistoryBasketPage"
    ]),
    ...mapMutations("basket", ["clearNewBasket"]),
      createNewOrder() {
        this.$api
          .get(`/order/check-no-available-product-for-order`)
          // eslint-disable-next-line no-unused-vars
          .then(res => {
            if (res.data.listDeleteFormCart.length) {
              this.availableProduct = res.data.listDeleteFormCart
              this.availableProductModal = true
            } else {
              this.handleCreateNewOrder()
            }
          })
      },
      handleCreateNewOrder() {
        if (this.prod_delete.length > 0) {
          for(let i = 0; this.prod_delete.length > i; i++) {
            const id = this.prod_delete[i]
            for(let a = 0; this.newBasketProductComputed.length > a; a++) {
              const element = this.newBasketProductComputed[a]
              if (element.id == id) {
                this.deleteItemNewBasket(element, a)
              }
            }
          }
        }
        this.$router.push(`/orders/create-order/?id=undefined&update=false`)
      },
      getOrderProduct(item) {
          const now = new Date();
          // let now = new Date(new Date().getTime() + 24 * 1 * 60 * 60 * 1000);

          let nowTime = now.getHours() * 60 + now.getMinutes();
          let dayNumber = moment(now).day();

          if (item.leftovers_salvi >= item.quantity) {
              if (nowTime > 900) {
                  return moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours');
              } else {
                  if (dayNumber === 5 || dayNumber === 6 || dayNumber === 0) { // Исправлено на || (ИЛИ)
                      return moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours');
                  } else {
                      return 1
                  }
              }
          } else if (+item.leftovers_salvi + +item.leftovers_supplier >= item.quantity) {
              let dateSup = now
              let dayNumberSup = dayNumber
              let isSupplier = false
              if (item.supplier_delivery_postpone > 1) {
                  dateSup = new Date(now.getTime() + 24 * (item.supplier_delivery_postpone - 1) * 60 * 60 * 1000);
                  dayNumberSup = moment(dateSup).day();
                  isSupplier = true
              }
              if (nowTime > 900) {
                  return moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours');
              } else {
                  if (isSupplier || dayNumberSup === 5 || dayNumberSup === 6 || dayNumberSup === 0) { // Исправлено на || (ИЛИ)
                      return moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours');
                  } else {
                      return 1
                  }
              }
          } else {
              return 9999999999999999
          }
      },
      getDeliveryDateArray() {
          this.deliveryDateArray = [];
          const now = new Date();
          // const now = new Date(new Date().getTime() + 24 * 1 * 60 * 60 * 1000);

          const nowTime = now.getHours() * 60 + now.getMinutes();
          const dayNumber = moment(now).day();

          for (let i = 0; i < this.newBasketProductComputed.length; i++) {
              let item = this.newBasketProductComputed[i];

              if (item.leftovers_salvi >= item.quantity) {
                  this.processDelivery(nowTime, dayNumber, item);
              } else if (+item.leftovers_salvi + +item.leftovers_supplier >= item.quantity) {
                  this.processSupplierDelivery(nowTime, dayNumber, item);
              } else {
                  this.addDeliveryDate(0);
              }
          }

      },

      processDelivery(nowTime, dayNumber, item) {
        if (nowTime > 900) {
          this.addDeliveryDate(moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours'), this.getDeliveryInfo(item, item.quantity));
        } else {
            if ( (dayNumber === 5 || dayNumber === 6 || dayNumber === 0)) { // Исправлено на || (ИЛИ)
                this.addDeliveryDate(moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours'), this.getDeliveryInfo(item, item.quantity));
            } else {
                this.addDeliveryDate(1);
            }
        }
      },

      processSupplierDelivery(nowTime, dayNumber, item) {
          if (item.supplier_delivery_postpone < 2) {
              this.processDelivery(nowTime, dayNumber, item);
          } else {
              this.addDeliveryDate(moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours'), this.getDeliveryInfo(item, item.quantity));
          }
      },

      addDeliveryDate(id, date = null) {
          const existingDate = this.deliveryDateArray.find(el => el.id === id);
          if (!existingDate) {
              const newDate = { id };
              if (date) newDate.date = date;
              this.deliveryDateArray.push(newDate);
          }
      },
      getNextDay() {
          const dayNumber = moment().day();

          if (dayNumber == 1) {
              return 'Вівторок'
          } else if (dayNumber == 2) {
              return 'Середа'
          } else if (dayNumber == 3) {
              return 'Четверг'
          } else if (dayNumber == 4) {
              return 'П`ятниця'
          } else {
              return 'Понеділок'
          }
      },
      getDayName(date) {
          const dayNumber = moment(date, 'DD.MM.YYYY').day();
          const dayNames = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];
          const dayName = dayNames[dayNumber];

          return dayName
      },
      getDeliveryInfo(item, count) {
          const now = new Date();
          // const now = new Date(new Date().getTime() + 24 * 1 * 60 * 60 * 1000);

          const nowTime = now.getHours() * 60 + now.getMinutes();
          const dayNumber = moment(now).day();
          let devDate;

          if (+item.leftovers_salvi >= count) {
              if (nowTime < 900) {
                  if (dayNumber === 5) {
                      devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                  } else if (dayNumber === 6) {
                      devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                  } else if (dayNumber === 0) {
                      devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                  } else {
                      return 'Доставка на наступний робочий день';
                  }
              } else {
                  if (dayNumber === 4) {
                      devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
                  } else if (dayNumber === 5) {
                      devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
                  } else if (dayNumber === 6) {
                      devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                  } else {
                      devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                  }
              }
          } else if (+item.leftovers_salvi + item.leftovers_supplier >= count) {
              if (item.supplier_delivery_postpone < 2) {
                  if (nowTime < 900) {
                      if (dayNumber === 5) {
                          devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                      } else if (dayNumber === 6) {
                          devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                      } else if (dayNumber === 0) {
                          devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                      } else {
                          return 'Доставка на наступний робочий день';
                      }
                  } else {
                      if (dayNumber === 4) {
                          devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
                      } else if (dayNumber === 5) {
                          devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
                      } else if (dayNumber === 6) {
                          devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                      } else {
                          devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                      }
                  }
              } else {
                  const dateSup = new Date(now.getTime() + 24 * (item.supplier_delivery_postpone - 1) * 60 * 60 * 1000);
                  const dayNumberSup = moment(dateSup).day();

                  if (nowTime < 900) {
                      if (dayNumberSup === 5) {
                          devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
                      } else if (dayNumberSup === 6) {
                          devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
                      } else if (dayNumberSup === 0) {
                          devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
                      } else if (dayNumberSup === 1) {
                          devDate = new Date(dateSup.getTime() + 48 * 60 * 60 * 1000);
                      } else {
                          devDate = new Date(dateSup.getTime() + 24 * 60 * 60 * 1000);
                      }
                  } else {
                      if (dayNumberSup === 4) {
                          devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
                      }else if (dayNumberSup === 5) {
                          devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
                      } else if (dayNumberSup === 6) {
                          devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
                      } else if (dayNumberSup === 0) {
                          devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
                      } else {
                          devDate = new Date(dateSup.getTime() + 48 * 60 * 60 * 1000);
                      }
                  }
              }
          } else {
              return 'повідомимо додатково';
          }

          return `${moment(devDate).format("DD.MM.YYYY")}`;
      },
      getDeliverDate(day) {
          const now = new Date(new Date().getTime() + 24 * day * 60 * 60 * 1000)
          const nowTime = now.getHours()*60+now.getMinutes();
          const dayNumber = moment(now).day();
          let endDate;
          if (dayNumber == 6) {
              endDate = new Date(now.getTime() + 72 * 60 * 60 * 1000)
          } else if (dayNumber == 0) {
              endDate = new Date(now.getTime() + 48 * 60 * 60 * 1000)
          } else {
              if ( +nowTime < 900 ) {
                  endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
              } else {
                  if (dayNumber == 5) {
                      endDate = new Date(now.getTime() + 96 * 60 * 60 * 1000)
                  } else {
                      endDate = new Date(now.getTime() + 48 * 60 * 60 * 1000)
                  }
              }
          }
          return moment(endDate).format("DD.MM.YYYY")
      },
      getSumm() {
        let summ = 0
        const product = this.newBasketProductComputed
        for (let i = 0; product.length > i; i++) {
          if (!this.prod_cancel.includes(product[i].id) && !this.prod_delete.includes(product[i].id)) {
              summ = +summ + (+product[i].total_sum)
          }
        }
        return  summ.toFixed(2)
      },
      itemExceedsClose() {
          this.itemExceeds = null;
      },

      checkProduct() {
        if (this.newBasketProductComputed.length > 0) {
            const product = this.newBasketProductComputed
            const products = []
            for (let i = 0; product.length > i; i++) {
                products.push(product[i].id)
            }
            this.$api
                .get(`/cart/check-availability-product?ids=${JSON.stringify(products)}`)
                // eslint-disable-next-line no-unused-vars
                .then(response => {
                    this.notAvailability = response.data.notAvailability
                    if (this.notAvailability.length > 0) {
                        for (let i = 0; this.notAvailability.length > i; i++) {
                            this.prod_cancel.push(this.notAvailability[i].id)
                        }
                    }
                })
        }
      },
    historyUpdate() {
      if (this.historyBasket.totalCount == undefined) {
        this.loadMore = true
      } else {
        if (this.historyBasket.totalCount > this.historyBasket.items.length) {
          this.loadMore = true
        } else {
          this.loadMore = false
        }
        this.setHistoryBasketPage({
          ctx: {
            page: ++this.pageHistory
          }
        })
      }
    },
    basketModalFunc() {
      if (this.basketModal) {
        this.setBasketModal({
          ctx: false
        })
        if (this.$route.query.basket == 'open') {
          let currentQuery = { ...this.$route.query };
          delete currentQuery.basket;
          this.$router.push({ query: currentQuery });
        }
      } else {
        this.setBasketModal({
          ctx: true
        })
      }
    },
    quantityModal(item) {
      this.changeInputBlock = true
      let sum = []
      sum.push(+item.target.value)
      let input_sum = sum.reduce((a, b) => a + b, 0)
      if (isNaN(input_sum)) {
        item.target.value = +1
        this.quantityModalChange = 1
      } else {
        if (input_sum == 0) {
          this.quantityModalChange = 1
        } else {
          this.quantityModalChange = input_sum
        }
      }
    },

    handleChangeMultiplicity(index) {
        const el = this.newBasketProductComputed[index]
        el.is_strict_multiplicity = !el.is_strict_multiplicity
        this.changeQuantity(el, el.quantity, index, el.id)
    },

    handleQuantityInput(item, val, index, productId) {
        if (this.debounceTimers && this.debounceTimers[productId]) {
            clearTimeout(this.debounceTimers[productId]);
        }
        if (!this.debounceTimers) {
            this.debounceTimers = {};
        }
        if (val === '' || val === null || isNaN(val) || +val < 1) {
            // User is typing/clearing the input - do not trigger change or delete item yet
            return;
        }
        this.debounceTimers[productId] = setTimeout(() => {
            this.changeQuantity(item, val, index, productId);
        }, 600);
    },

    handleQuantityCommit(item, val, index, productId) {
        if (this.debounceTimers && this.debounceTimers[productId]) {
            clearTimeout(this.debounceTimers[productId]);
        }
        if (val === '' || val === null || isNaN(val) || +val < 1) {
            val = item.quantity || 1;
        }
        this.changeQuantity(item, val, index, productId);
    },

    changeQuantity(item, newQty, index, productId) {
        if (newQty === '' || newQty === null || newQty === undefined) {
            return;
        }

        const multiplicity = item.multiplicity && item.multiplicity > 1 ? +item.multiplicity : 1;

        var nQty;
        this.newBasketProduct.forEach(i => {
            if (i.id === productId) {
                nQty = +i.quantity;
            }
        });
        if(newQty === 'add') {
            if (item.is_strict_multiplicity || item.strict_multiplicity) {
                nQty += multiplicity;
            } else {
                nQty += 1;
            }
        } else if(newQty === 'remove') {
            if (item.is_strict_multiplicity || item.strict_multiplicity) {
                nQty -= multiplicity;
            } else {
                nQty -= 1;
            }
        } else {
            const parsed = parseInt(newQty, 10);
            if (isNaN(parsed) || parsed < 1) {
                nQty = 1;
            } else if ((item.is_strict_multiplicity || item.strict_multiplicity) && multiplicity > 1) {
                if (parsed % multiplicity === 0) {
                    nQty = parsed;
                } else {
                    const leftovers = item.leftovers_salvi || item.leftovers || 0;
                    if (leftovers > 0 && Math.floor(leftovers / multiplicity) < Math.floor(parsed / multiplicity)) {
                        nQty = Math.floor(parsed / multiplicity) * multiplicity;
                    } else {
                        nQty = Math.ceil(parsed / multiplicity) * multiplicity;
                    }
                    if (nQty < multiplicity) {
                        nQty = multiplicity;
                    }
                }
            } else {
                nQty = parsed;
            }
        }

        if(nQty < 1) {
            if (newQty === 'remove') {
                this.buttonTwo(item, index, true);
            } else {
                item.quantity = 1;
            }
            return;
        }

        let newProduct = false;
        if (item.newProduct) {
            newProduct = true;
        }

        item.quantity = nQty;
        this.setQuantityChangeID({
            ctx: productId
        });
        setTimeout(() => {
            this.setQuantityChangeID({
                ctx: 0
            });
        }, 2000);
        let total_sum = +item.price * + nQty;
        this.setNewBasketProduct({
            ctx: {
                name: item.name,
                total_sum: total_sum.toFixed(2),
                index: index,
                id: item.id,
                addId: item.addId,
                lastUpdate: item.lastUpdate,
                quantity: nQty,
                val: true,
                price: item.price,
                discount_price: item.discount_price,
                img: item.img,
                newProduct: newProduct,
                changeQuantity: true,
                leftovers_salvi: item.leftovers_salvi,
                leftovers_supplier: item.leftovers_supplier,
                supplier_delivery_postpone: item.supplier_delivery_postpone,
                multiplicity: item.multiplicity,
                isSpecificationProduct: item.isSpecificationProduct,
                is_strict_multiplicity: item.is_strict_multiplicity || item.strict_multiplicity ? 1 : 0,
                strict_multiplicity: item.strict_multiplicity,
                is_temperature_conditions: item.is_temperature_conditions,
            }
        });
        this.$api
            .post("/cart/update-product", {
                order_id: this.idProduct.order_id,
                product_id: item.id,
                id: item.addId,
                quantity: nQty,
                is_strict_multiplicity: item.is_strict_multiplicity || item.strict_multiplicity ? 1 : 0,
            })
            .then(response => {
                this.socketEmit();
            })
            .catch(() => {});
        this.changeInputBlock = false;
        setTimeout(() => {
            this.$loadingBus.$emit("updateBasket");
        }, 1000);
    },

    quantity(e, i, r) {
      r = +r
      let newProduct = false
      let changeQuantity = false
      if (e.newProduct) {
        newProduct = true
      }
      if (!e.newProduct) {
        changeQuantity = true
      }
      if (r !== e.quantity) {
        this.socketEmitFreez(true)

        this.setQuantityChangeID({
          ctx: e.id
        })
        setTimeout(() => {
          this.setQuantityChangeID({
            ctx: 0
          })
        }, 2000)
        let total_sum = +e.price * +this.quantityModalChange
          this.setNewBasketProduct({
          ctx: {
            name: e.name,
            total_sum: total_sum.toFixed(2),
            index: i,
            id: e.id,
            addId: e.addId,
            lastUpdate: e.lastUpdate,
            quantity: this.quantityModalChange,
            val: true,
            price: e.price,
            img: e.img,
            newProduct: newProduct,
            changeQuantity: changeQuantity
          }
        })
        this.$api
          .post("/cart/update-product", {
            order_id: this.idProduct.order_id,
            product_id: e.id,
            id: e.addId,
            quantity: this.quantityModalChange
          })
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            // if (response.data.success) {
            this.socketEmit()
            // }
          })
        this.changeInputBlock = false
        // this.loading = true
        setTimeout(() => {
          // this.loading = false
            this.$loadingBus.$emit("updateBasket", e)
        }, 1000)
      }
    },
    deleteItemCardProduct(item) {
      this.myDialog = true
      this.myDialog = true
      this.dialogHeadline = "Підтвердіть дію"
      this.dialogText = "Ви впевнені, що хочете видалити товар з кошика?"
      this.myDialogAction = "deleteItemCardProduct"
      this.dialogItem = item
    },
    deleteModalClose() {
      this.deleteProductModal = false
    },
    availableProductModalClose() {
      location.reload()
    },
    clearBasketOpenModal() {
      this.deleteProductModal = true
    },
    buttonOne() {
      if (this.myDialogAction == "deleteItemCardProduct") {
        this.myDialog = false
        // this.getDataFromApi();
        this.myDialogAction = ""
      }
    },
    addProduct() {
        if (this.prod_delete.length > 0) {
            for(let i = 0; this.prod_delete.length > i; i++) {
                const id = this.prod_delete[i]
                for(let a = 0; this.newBasketProductComputed.length > a; a++) {
                    const element = this.newBasketProductComputed[a]
                    if (element.id == id) {
                        this.deleteItemNewBasket(element, a)
                    }
                }
            }
            setTimeout(() => {
                if (this.changeInputBlock) {
                    this.changeInputBlock = false
                } else {
                    this.socketEmitFreez(true)
                    this.$api
                        .post("/cart/update-cart", {
                            order_id: this.idProduct.order_id,
                            id: this.idProduct.id
                        })
                        .then(response => {
                            if (response.data.success) {
                                this.socketEmit()
                                this.$router.push("/orders/?order=" + this.idProduct.order_id)
                            }
                            this.setNewBasketProduct({
                                ctx: []
                            })
                        })
                }
            }, 1000)
        } else {
            if (this.changeInputBlock) {
                this.changeInputBlock = false
            } else {
                this.socketEmitFreez(true)
                this.$api
                    .post("/cart/update-cart", {
                        order_id: this.idProduct.order_id,
                        id: this.idProduct.id
                    })
                    .then(response => {
                        if (response.data.success) {
                            this.socketEmit()
                            this.$router.push("/orders/?order=" + this.idProduct.order_id)
                        }
                        this.setNewBasketProduct({
                            ctx: []
                        })
                    })
            }
        }

    },
    buttonTwo(e, i, handleDelete = false) {
      if (this.myDialogAction == "deleteItemCardProduct" || handleDelete) {
        let dellete
        this.cardProduct.filter(e => {
          if (e.product.id == this.dialogItem.id) return (dellete = e)
        })
        this.arrDelete.push(dellete)
        this.addItemToDeleteList(e, i)
        this.myDialog = false
        this.myDialogAction = ""
      }
    },
      handleChangeProduct(e, i) {
          this.addItemToDeleteList(e, i)
          const indexToRemove = this.prod_cancel.indexOf(e.id);
          if (indexToRemove !== -1) {
              this.prod_cancel.splice(indexToRemove, 1);
          }

          const url = this.notAvailability.find(prod => prod.id === e.id).category_url
          this.$router.push(url)
      },
      addItemToDeleteList(e, i) {
        this.prod_delete.push(e.id)
          setTimeout(() => {
              this.deleteItemNewBasket(e, i)
          },10000)
      },
      handeleCancelDelete(id) {
          const indexToRemove = this.prod_delete.indexOf(id);
          if (indexToRemove !== -1) {
              this.prod_delete.splice(indexToRemove, 1);
          }
      },
    deleteItemNewBasket(e, i) {
        if(this.prod_delete.includes(e.id)) {
          this.socketEmitFreez(true)
          this.setNewBasketProduct({
            ctx: {
              index: i,
              id: e.id,
              quantity: e.quantity,
              val: false,
              price: e.price
            }
          })
          this.$api
            .post("/cart/delete-product", {
              order_id: this.idProduct.order_id,
              id: e.addId,
              product_id: e.id
            })
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              // if(response.data.success){
              this.socketEmit()
                const indexToRemove = this.prod_delete.indexOf(e.id);
                if (indexToRemove !== -1) {
                    this.prod_delete.splice(indexToRemove, 1);
                }

                const indexToRemove1 = this.prod_cancel.indexOf(e.id);
                if (indexToRemove1 !== -1) {
                    this.prod_cancel.splice(indexToRemove1, 1);
                }
              // }
            })
        }
    },
    clearBasket() {
      this.historyModal = false
      this.socketEmitFreez(true)
      let obj = {
        order_id: this.idProduct.order_id,
        id: this.idProduct.id
      }
      if (
        this.idProduct.order_id == undefined ||
        this.idProduct.order_id == 0
      ) {
        obj = {
          order_id: 0,
          id: 0
        }
      }
      // eslint-disable-next-line no-unused-vars
      this.$api.post("/cart/clear-cart", obj).then(response => {
        // if(response.data.success){
        this.socketEmit()
          this.deleteProductModal = false
        // }
      })
      this.clearNewBasket()
      this.arrDelete = []
      // this.loading = true
      setTimeout(() => {
          this.$loadingBus.$emit("updateBasket", e)
        // this.loading = false
      }, 1000)
    },
    socketEmit() {
      this.$socket.emit("userCartAction", {
        order_id: this.idProduct.order_id,
        user_id: this.currentUser.id,
        update: true
      })
    },
    createNewBasket() {
      this.setIdProduct({
        ctx: {
          order_id: 0
        }
      })
    },
    idProductChange(e) {
      if (this.orederInorder) {
        this.$api
          .post("/cart/new-to-old-cart", {
            old_id: e.id
          })
          .then(response => {
            if (response.data.success) {
              this.pageHistory = 1
              if (e == undefined) {
                e = {
                  order_id: 0
                }
              }
              this.arrDelete = []
              this.setIdProduct({
                ctx: e
              })
              this.setNewBasketProduct({
                ctx: []
              })
            }
            this.orederInorder = false
          })
      } else {
        this.pageHistory = 1
        if (e === undefined) {
          e = {
            order_id: 0
          }
        }
        this.arrDelete = []
        this.setIdProduct({
          ctx: e
        })
        this.setNewBasketProduct({
          ctx: []
        })
      }
    },
    countProductFunc() {
      if (this.cardProduct.length > 0 || this.newBasketProduct.length > 0) {
        this.countProduct = true
        setTimeout(() => {
          this.countProduct = false
        }, 2000)
      }
    },
    async loadBasket() {
      this.loadProduct = true
      this.loadAddProduct = true
      // eslint-disable-next-line no-unused-vars
      let e = new Promise((resolve, reject) => {
        setTimeout(() => resolve(false), 2000)
      })
      this.loadProduct = await e
      this.loadAddProduct = await e
    },
    rowBGFunc(e) {
      if (e.length > this.rowBGCount) {
        this.rowBGCount = e.length
        let id = e.map(i => i.id)
        id = id.pop()
        this.rowBG = id
        this.scrollDownBasket()
        setTimeout(() => (this.rowBG = -1), 2500)
      } else {
        this.rowBG = 0
        this.rowBGCount = e.length
      }
    },
    scrollDownBasket() {
      this.pageHistory = 1
      this.setHistoryBasketPage({
        ctx: {
          page: 1
        }
      })
      setTimeout(() => {
        if (
          this.$refs.basketBody.querySelector(".basket__body__wrap") !== null
        ) {
          this.$refs.basketBody.querySelector(".basket__body__wrap").scrollTop =
            this.$refs.basketBody.querySelector(".basket__body__wrap")
              .scrollHeight +
            180 +
            70
        }
      }, 500)
    },
    closeDialogCreate(e) {
      this.dialogCreate = e
      this.initialize()
      this.update = false
    },
    initialize() {
      this.user = {
        email: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        position: "",
        role: "",
        password: "",
        repeatPassword: "",
        role_name: "",
        all_location: false,
        isActive: true,
        activeTill: "",
        companyEntity: "",
        locations: [],
        cost_centers: []
      }
    },
    cartFreez(e) {
      if (e.order_id == this.idProduct.order_id) {
        this.loadAddProduct = e.freez
      }
    },
    socketEmitFreez(freez) {
      this.$socket.emit("userCartAction", {
        order_id: this.idProduct.order_id,
        user_id: this.currentUser.id,
        update: false,
        freez: freez
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .basket__body__wrap .item-row .summ {
    display: flex;
    align-items: center;
  }
  .new-price-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .new-price {
      color: #e10000!important;
    }

    .old {
      font-size: 11px !important;
      font-weight: 400 !important;
      color: gray !important;
      text-decoration: line-through !important;
    }
  }
  .badge__isTemp {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    color: #3d4465;

    svg {
      width: 20px;
      height: 20px;
    }
  }
  .icon__isSpec {
    color: #3d4465 !important;
    margin-left: 5px;

    svg {
      width: 15px;
      height: 15px;
    }
  }
  .basket__body__wrap {
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
  }
  .basket__body__wrap .item-row {
    grid-template-columns: 280px 300px 1fr 20px;
  }
  .basket__body__wrap .item-row .summ {
    text-align: left;
  }
  .count {
    display: flex;
  }
  .multiplicity__container {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .multiplicity__wrap {
    display: flex;
    align-items: center;
  }
  .price__wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .multiplicity__info-icon {
    font-size: 14px;
    font-weight: 700;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(42, 139, 26);
    border: 2px solid rgb(42, 139, 26);
    margin-right: 10px;
    border-radius: 50px;
    cursor: pointer;
  }
  .multiplicity__toggle {
    height: 26px;
    width: 52px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;
    background: grey;
    padding: 0 2px;
  }
  .multiplicity__toggle.active {
    background: rgb(42, 139, 26);
  }
  .multiplicity__toggle.active .multiplicity__toggle-button {
    order: 1;
  }
  .multiplicity__toggle-count {
    flex-grow: 1;
    color: #ffffff;
    text-align: center;
  }
  .multiplicity__toggle-button {
    width: 22px;
    height: 22px;
    border-radius: 50px;
    background: #ffffff;
  }
.modalBody-enter-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.modalBody-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.modalBody-enter,
.modalBody-leave-to {
  transform: translateX(0px);
  opacity: 0;
}
.quantity-section {
  /*height: 50px;*/
  display: flex;
}

.quantity-section > button {
  color: #4caf50;
  height: 40px;
  width: 40px;
}

.quantity-section > button.minus-btn {
  border: 1px solid #E3E3E3;
  border-right: none;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.quantity-section > button.plus-btn {
  border: 1px solid #E3E3E3;
  border-left: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.quantity-section > input {
  width: 70px;
  border: 1px solid #E3E3E3;
  height: 40px;
  padding: 5px 10px;
  text-align: center;
}



.quantity-section > button:hover {
  background-color: #4caf50;
}
.quantity-section > button:hover > i{
  color: #fff !important;
}

.quantity-section > input::-webkit-outer-spin-button,
.quantity-section > input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-section > input[type="number"] {
  -moz-appearance: textfield;
}

.basket.width-no-container {
  width: 0;
  height: 0;
}

.modal-choose {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &__available-item {
    display: flex;
    padding: 0 10px 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #c3c3c3;
  }

  &__available-item-img {
    width: 120px;
    margin-right: 20px;

    img {
      width: 100%;
    }
  }

  &__available-title {
    padding-bottom: 30px;
  }

  &__available-item-name {
    flex-grow: 1;
    font-size: 12px;
    font-weight: 600;
  }

  &__available-item-price {
    width: 100px;
    text-align: right;
    margin-left: 20px;
    font-weight: 700;
  }

  &__container {
    position: relative;
    width: 400px;
    max-width: 100%;
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;

    &.big {
      width: 600px;
    }
  }

  &__close {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    padding: 10px 0 20px;
  }

  &__button-group {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__button {
    border-radius: 10px;
    margin: 0 5px;
    width: 150px;
    height: 50px;
    background: #269446;
    cursor: pointer;
    padding: 5px;
    font-size: 12px;
    color: #ffffff;
    font-size: 700;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;

    &.grey {
      background: #bcbcbc;
      color: black;
    }
  }
}
</style>
