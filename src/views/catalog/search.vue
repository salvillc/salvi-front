<template>
  <div
    class="catalog__page section__content"
    :class="{ overlay: $store.getters['category/modalCategory'] }"
  >
    <v-btn
      v-if="id > 0"
      flat
      icon
      class="btn__back"
      @click="$router.push('/order/' + id)"
    >
      <v-tooltip right class="quote-start">
        <v-icon slot="activator">keyboard_arrow_left</v-icon>
        <span>до замовлення №{{ id }}</span>
      </v-tooltip>
    </v-btn>

    <div class="section__content__head">
      <div>
        Результати пошуку за запитом: "{{ this.$route.query.query || '' }}"
      </div>
      <div></div>
      <div style="display: flex; flex-direction: column; align-items: flex-end">
        <v-dialog
          v-if="specification.length"
          v-model="locationModal"
          :fullscreen="$store.getters['params/mobileView']"
          persistent
          max-width="705px"
        >
          <template v-slot:activator="{ on }">
            <div v-if="locationName" class="location__title">
              <div class="label">Локацiя:</div>
              <div class="name">
                <b class="ellipsis">{{ locationName }}</b>
                <v-btn
                  v-if="
                (location_id || (selectedId != undefined && selectedId)) &&
                  listLocations.length > 1 &&
                  specification.length
              "
                  icon
                  flat
                  color="#19B200"
                  @click="locationModal = true"
                >
                  <v-icon size="14">create</v-icon>
                </v-btn>
              </div>
            </div>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Вибір локації</span>
              <v-spacer />
            </v-card-title>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 class="input-box">
                  <label>Локації</label>
                  <v-select
                    v-model="locationIdSelect"
                    class="v-select-empty"
                    hide-details
                    solo
                    :items="listLocations"
                    item-text="name"
                    item-value="id"
                    :clearable="false"
                    :searchable="false"
                    placeholder=""
                  />
                </v-flex>
              </v-layout>
            </v-container>

            <v-card-actions>
              <v-spacer />
              <button class="button button__yellow" flat @click="closeModal">
                Готово
              </button>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

    </div>
    <div v-if="categorySearch && categorySearch.length" class="search__category">
      <div v-for="(item, index) in categorySearch"
           :key="index"
           :class="['search__category-item', getCategoryUUID == item.path && 'active']"
           @click="categoryButton(item.name, item.path)"
      >
        {{item.name}}
      </div>
    </div>
    <div class="catalog__table__head">
      <span
        v-if="showProduct"
        class="count__price"
        :class="{
          hidden1: productDataBul.length < 1 || productDataBul.length == 0
        }"
      >
        Виділено товарів: {{ newBasketProduct.length }}
        <span v-if="total_sum > 0">({{ total_sum }} &#8372; )</span>
      </span>
    </div>
    <div
      v-if="!showProduct"
      class="no-data-catalog mt-3"
      :class="{ relative: $store.getters['category/modalCategory'] }"
    >
      <div class="button button__yellow" @click="checkItemCatregory">
        {{
          $store.getters["category/uuid"] == ""
            ? "Показати всi товари"
            : "Вибрати категорiю"
        }}
      </div>
    </div>
    <catalog__table
      v-if="radios == 'radio-1' && showProduct"
      :id="selectedId"
      :selected="selected"
      :filter-uuid="filterUuid"
      :location-id="location_id"
      :list-update="updateListVal"
      :radios-specification="radiosSpecification"
      :can-load="canLoad"
      :search="searchData"
      @eventSelected="eventSelected"
      @productData="productData"
      @listUpdated="listUpdatedResponse"
    />

    <catalog__tile
      v-if="radios == 'radio-2' && showProduct"
      :id="selectedId"
      :filter-uuid="getCategoryUUID"
      :list-update="updateListVal"
      :location-id="location_id"
      :radios-specification="radiosSpecification"
      :can-load="canLoad"
      :search="searchData"
      :category-search="categorySearch"
      @productData="productData"
      @eventSelected="eventSelected"
      @listUpdated="listUpdatedResponse"
    />
    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
      :bottom="true"
    >
      {{ snackText }}
      <v-btn flat @click="snack = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import filterCategory from "./filterCategory"
import catalog__table from "./catalog__table.vue"
import catalog__tile from "./catalog__tile.vue"
import create_order from "@/views/orders/create-order"
import { mapActions, mapGetters } from "vuex"
// eslint-disable-next-line no-unused-vars
import store from "../../store"

export default {
  name: "Search",
  // eslint-disable-next-line vue/no-unused-components
  components: { catalog__table, catalog__tile, create_order, filterCategory },
  data() {
    return {
      id: undefined,
      snack: false,
      snackColor: "",
      snackText: "",
      filterUuid: "",
      incIndex: 1,
      radios: this.radiosLocal,
      radiosLocal: "",
      radiosSpecification: false,
      dialog: false,
      update: false,
      updateListVal: false,
      selected: [],
      selectedData: [],
      selectTags: [],
      categoryData: [],
      categorySelect: [],
      clear: false,
      model: {
        delivery_date: "",
        company_entity_id: "",
        location_id: "",
        cost_center_id: "",
        contract_id: "",
        budget_id: "",
        comment: ""
      },
      maxLocation: 1,
      total_sum: 0,
      productDataBul: [],
      listLocations: [],
      location_id: 0,
      locationIdSelect: 0,
      locationModal: false,
      selectedId: undefined,
      specification: [],
      canLoad: false,
      locationName: "",
      showProduct: true,
      search: "",
      categoryDate: null,
      categorySearch: null,
    }
  },
  computed: {
    uuidStore() {
      return this.$store.getters["category/uuid"]
    },
    showProductStore() {
      return this.$store.getters["category/showProduct"]
    },
    ...mapGetters("basket", [
      "newBasketProduct",
      "addProductID",
      "idProduct",
      "basketModal",
      "ladingLayoutV",
      "currentLocation"
    ]),
    ...mapGetters("category", ["searchCatalog"]),
    getCategoryUUID() {
      const category = this.$route.query.category;
      if (category == undefined) {
        return ''
      } else {
        return category
      }
    },
    searchData() {
      const search = this.$route.query.query;
      if (search == undefined) {
        return ''
      } else {
        return search
      }
    }
  },

  watch: {
    uuidStore() {
      this.checkItemCatregory()
    },
    searchCatalog(e) {
      this.searchStart(e)
    },
    idProduct(e) {
      this.changeID(e.order_id)
    },
    newBasketProduct() {
      this.eventSelected()
    },
    filterUuid(e) {
      this.$store.dispatch("category/setUUID", { ctx: e })
    },
    location_id() {
      if (this.location_id !== this.currentLocation) {
        window.localStorage.setItem("location_id", this.location_id)
        this.setCurrentLocation({ ctx: this.location_id })
        this.setLocation({ ctx: this.location_id })
      }
      if (this.listLocations.length) {
        this.listLocations.forEach(val => {
          if (val.id == this.location_id) {
            this.locationName = val.name
          }
        })
      }
    },
    currentLocation(e) {
      this.location_id = e
      this.loadListLocation()
    },
    $route(to, from) {
      if (to != from) {
        this.getSearchCategory()
      }
    },
  },
  created() {
    this.checkItemCatregory()
    this.searchStart()
    if (this.idProduct.order_id !== 0 && !this.ladingLayoutV) {
      this.setBasketModal({
        ctx: true
      })
    }
    this.changeID(this.idProduct.order_id)
    if (this.id !== undefined) {
      this.selectedId = this.id
      this.canLoad = true
    } else {
      this.location_id = +this.currentLocation
      this.locationIdSelect = +this.currentLocation
      if (this.location_id) {
        this.canLoad = true
      }
    }
    this.loadListLocation()
    this.radiosLocal = localStorage.getItem("radioView")
    if (this.radiosLocal == null) {
      this.radiosLocal = "radio-2"
      this.radios = this.radiosLocal
    } else {
      this.radios = this.radiosLocal
    }
  },
  beforeDestroy() {
    this.$store.dispatch("category/setUUID", { ctx: "" })
    this.$store.dispatch("category/setShowProduct", { ctx: "" })
    this.$store.dispatch("category/setBreadcrumbCut", { ctx: false })
  },
  mounted() {
    this.getSearchCategory()
  },
  methods: {
    ...mapActions("user", ["setLocation"]),
    ...mapActions("basket", [
      "setNewBasketProduct",
      "setIdProduct",
      "setAddProductID",
      "setBasketModal",
      "setCurrentLocation"
    ]),
    getSearchCategory() {
      if (this.$route.query.query && this.$route.query.query.length) {
        try {
          this.$api
            .get(`/search/get-category-search?query=${this.$route.query.query}`)
            .then(res => {
              console.log(res)
              if (res.data.success && res.data.urls.length > 0) {
                this.categorySearch = res.data.urls
              } else {
                this.categorySearch = null
              }
            })
        } catch (e) {}
      }
    },
    categoryButton(name, path) {
      this.$router.push({
        path: `/search?query=${this.$route.query.query}&category=${path.includes('/') ? path.split('/').pop() : path}`
      })
    },
    fiterBredcrumb(ctx) {
      if (ctx !== "") {
        this.$store.dispatch("category/setUUID", { ctx: ctx.uuid })
        this.$store.dispatch("category/setBreadcrumbCut", { ctx: ctx })
      } else {
        this.$store.dispatch("category/setUUID", { ctx: "forceRestart" })
        this.$store.dispatch("category/setBreadcrumbCut", { ctx: false })
      }
    },
    // getCategoryData() {
    //     let url = process.env.VUE_APP_API_HOST
    //     url = url.replace('v1', 'v2')
    //     url = url + '/categories/category-data'
    //     this.$api.post(url, {
    //         uuid: this.getCategoryUUID,
    //     }).then((res) => {
    //         if (res.data.success) {
    //             this.categoryData = res.data;
    //         } else {
    //             this.categoryData = null;
    //             this.$router.push({ path: '/catalog' });
    //         }
    //     }).catch((e) => {
    //         console.log(e)
    //     })
    // },
    changeID(e) {
      if (this.idProduct.order_id == 0) {
        this.id = undefined
      } else {
        this.id = e.toString()
      }
    },
    closeModal() {
      if (!this.locationIdSelect) {
        this.snack = true
        this.snackColor = "#ff2525"
        this.snackText = "Виберіть локацію"
      } else {
        if (this.location_id !== this.locationIdSelect) {
          this.setIdProduct({
            ctx: {
              order_id: 0
            }
          })
        }
        this.location_id = this.locationIdSelect
        this.locationModal = false
        this.canLoad = true
        this.clearCategory()
      }
    },
    loadListLocation() {
      this.loading = true
      let order_id = ""
      let order = ""
      if (this.id !== undefined) {
        order_id = "order_id: " + this.id
        order =
          "orderInfo(id: " +
          this.id +
          "){" +
          "location_id " +
          "location_name" +
          "}"
      }
      this.$api
        .post("/graphql", {
          query:
            `query{
                                locationList(all_location: true ` +
            order_id +
            `){
                                     id
                                     name
                                }
                                specification(page: 1 perPage: 1000 active_only: true list: true){
                                 items{
                                  id
                                  name
                                }
                              }
                              ` +
            order +
            `
                           }`
        })
        .then(response => {
          this.specification = response.data.data.specification.items
          this.listLocations = response.data.data.locationList
          if (response.data.data.orderInfo != undefined) {
            this.locationName = response.data.data.orderInfo.location_name
            this.locationIdSelect = +response.data.data.orderInfo.location_id
          }
          if (this.specification.length) {
            if (this.listLocations.length == 1 && this.id == undefined) {
              this.locationModal = false
              this.canLoad = true
              this.location_id = this.listLocations[0].id
            }
            if (this.id == undefined && !this.location_id) {
              this.locationModal = true
            }
          } else {
            this.canLoad = true
            this.location_id = 0
            this.locationModal = false
          }
          if (this.listLocations.length) {
            this.listLocations.forEach(val => {
              if (val.id == this.location_id) {
                this.locationName = val.name
              }
            })
          }
          this.loading = false
        })
    },
    productData(e) {
      this.productDataBul = e
    },
    addProduct() {
      this.$api
        .post("/order/add-products", {
          order_id: this.id,
          products: this.newBasketProduct
        })
        .then(response => {
          if (response.data.success) {
            this.$router.push("/order/" + this.id)
          }
        })
    },
    checkItemCatregory() {
      this.filterUuid = this.$store.getters["category/uuid"]
      this.showProduct = true
      this.$nextTick(() => {
        this.updateListVal = true
      })
    },
    searchStart(e) {
      this.search = this.searchCatalog
      this.showProduct = true
      this.$nextTick(() => {
        this.updateListVal = true
        if (this.$store.getters["params/mobileView"]) {
          this.$store.dispatch("params/setCollaps", { ctx: false })
        }
        this.$store.dispatch("basket/setBasketModal", { ctx: false })
      })
    },
    clearCategory() {
      this.clear = true
      let $this = this
      setTimeout(function() {
        $this.clear = false
      }, 100)
    },
    specificationOnly(e) {
    },
    radioView(e) {
      localStorage.setItem("radioView", e)
      this.radios = e
      this.radiosLocal = localStorage.getItem("radioView")
    },
    eventSelected() {
      if (this.newBasketProduct.length > 0) {
        let sum = 0
        this.newBasketProduct.forEach(function(value) {
          sum += parseFloat(value.price.replace(/,/g, "")) * value.quantity
        })
        this.total_sum = Number(sum).toFixed(2)
      } else {
        this.total_sum = 0
      }
    },
    listUpdatedResponse(e) {
      this.updateListVal = e
    },
    filterData() {
      this.updateListVal = true
    },
    uuid(e) {
      this.filterUuid = e
    },
    categoryTotal(e) {
      if (e.val == true) {
        this.categorySelect.push(e.name)
      } else {
        for (let i = 0; i < this.categorySelect.length; i++) {
          if (this.categorySelect[i] == e.name) {
            this.categorySelect.splice(i)
          }
        }
      }
    },
    closeDialog(e) {
      this.dialog = e
      this.initialize()
      this.update = false
    },
    openDialog(e) {
      this.dialog = e
    },
    updateList(e) {
      this.updateListVal = e
    },
    listUpdated(e) {
      this.updateListVal = e
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
    rolesList(e) {
      this.roles = e.roles
      this.locations = e.locations
    }
  }
  // beforeRouteEnter(to, from, next) {
  //     next((vm) => {
  //         if (from.fullPath == '/orders') {
  //             vm.snack = true;
  //             vm.snackColor = '#19B200';
  //             vm.snackText = 'Замовлення створено';
  //         }
  //     });
  // },
}
</script>

<style type="scss" scoped>
  /deep/.v-dialog.v-dialog--active.v-dialog--persistent {
    width: 400px;

    .v-card__title {
      box-shadow: none;
      padding: 24px;

      .headline {
        font-size: 24px;
        color: #222222;
      }
    }

    .container {
      padding-top: 0;
    }

    .v-card__actions {
      padding-top: 0 !important;
      box-shadow: none;
      grid-template-columns: 1fr;
    }

    .button__yellow {
      background: #269447;
      border: 2px solid #269447;
      color: #fff;
      border-radius: 8px;
      width: 100%;
    }
  }
.head__iconBtn {
  cursor: pointer;
}

.search__category {
  padding: 20px 0 10px;
  display: flex;
  flex-wrap: wrap;
}
.search__category-item {
  padding: 10px 20px;
  font-size: 16px;
  color: #2a8b1a;
  border: 1px solid #2a8b1a;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  font-weight: 700;

  &.active {
    background: #2a8b1a;
    color: #FFFFFF;
  }
}
</style>
