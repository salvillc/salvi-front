<template>
  <div>
    <div
      class="catalog__page section__content"
      :class="{ overlay: $store.getters['category/modalCategory'] }"
      v-show="!errorPageTrigger"
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
        <div v-if="specialBread" class="breadcrumbCatalog">
          <span>{{specialBread}}</span>
        </div>
        <div v-else-if="categoryData == null" class="breadcrumbCatalog">
          <span>Каталог</span>
        </div>
        <div v-else class="breadcrumbCatalog">
          <span v-for="(item, index) in categoryData.breadcrumbs"
                :key="index">
            <router-link v-if="(index + 1) != categoryData.breadcrumbs.length" :to="item.link">
              {{ item.name }}
            </router-link>
            <span v-else>
              {{ item.name }}
            </span>

            <svg v-if="(index + 1) != categoryData.breadcrumbs.length" width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.41494 3.82845L0.293045 1.70731C-0.0974997 1.3169 -0.0975876 0.68375 0.29275 0.293137C0.683233 -0.0976231 1.31667 -0.0978158 1.70729 0.292806L5.24294 3.82845L1.70729 7.36409C1.31667 7.75471 0.683233 7.75452 0.29275 7.36376C-0.0975876 6.97315 -0.0975004 6.34 0.293044 5.94959L2.41494 3.82845Z" fill="#269447"/>
            </svg>
          </span>
        </div>

        <div style="display: flex; flex-direction: column; align-items: flex-end">
          <v-dialog
            v-if="specification.length"
            v-model="locationModal"
            :fullscreen="$store.getters['params/mobileView']"
            persistent
            max-width="400px"
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
                  Зберегти
                </button>
              </v-card-actions>
            </v-card>
          </v-dialog>

<!--          <div class="justify-self-end d-flex filters-box align-center">-->
<!--            <v-menu-->
<!--              v-if="-->
<!--                (specification.length && $root.rbac.catalogShowBtn) ||-->
<!--                  ($root.rbac.orderShowBtn &&-->
<!--                    specification.length &&-->
<!--                    id !== undefined)-->
<!--              "-->
<!--              class="mr-2"-->
<!--              offset-x-->
<!--              bottom-->
<!--              :close-on-content-click="false"-->
<!--              nudge-bottom="40"-->
<!--              nudge-left="-67"-->
<!--              left-->
<!--              content-class="action__td__drop setting__table__collumn radio__view-catalog"-->
<!--            >-->
<!--              <v-btn slot="activator" class="btn__setting__table">-->
<!--                <i class="fa fa-filter"></i>-->
<!--                <v-icon class="arrow-icon" color="#93A2DD">arrow_drop_down</v-icon>-->
<!--              </v-btn>-->
<!--              <v-list>-->
<!--                <span>Налаштування каталога</span>-->
<!--                <v-radio-group-->
<!--                  v-model="radiosSpecification"-->
<!--                  class="mt-0"-->
<!--                  hide-details-->
<!--                  :mandatory="false"-->
<!--                >-->
<!--                  <v-list-tile>-->
<!--                    <v-radio-->
<!--                      label="Всi товари"-->
<!--                      :value="false"-->
<!--                      @change="specificationOnly"-->
<!--                    />-->
<!--                  </v-list-tile>-->
<!--                  <v-list-tile>-->
<!--                    <v-radio-->
<!--                      label="З специфікації"-->
<!--                      :value="true"-->
<!--                      @change="specificationOnly"-->
<!--                    />-->
<!--                  </v-list-tile>-->
<!--                </v-radio-group>-->
<!--                <span>Доставка</span>-->
<!--                <v-col class="catalog-filter__checkboxs">-->
<!--                  <v-checkbox @change="handleChangeDate('nextDay')" v-model="dateFilterNextDay" label="Завтра"></v-checkbox>-->
<!--                  <v-checkbox v-model="dateFilterWithNoDate" label="Повідомимо додатково"></v-checkbox>-->
<!--                </v-col>-->
<!--                <v-col class="catalog-filter__datepicker">-->
<!--                  <v-menu-->
<!--                    v-model="fromDateMenu"-->
<!--                    :close-on-content-click="false"-->
<!--                    :nudge-right="40"-->
<!--                    transition="scale-transition"-->
<!--                    offset-y-->
<!--                    max-width="290px"-->
<!--                    min-width="290px"-->
<!--                  >-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                      <v-text-field-->
<!--                        label="Доступно на дату"-->
<!--                        prepend-icon="event"-->
<!--                        readonly-->
<!--                        :value="fromDateDisp"-->
<!--                        v-on="on"-->
<!--                      ></v-text-field>-->
<!--                    </template>-->
<!--                    <v-date-picker-->
<!--                      locale="ru-in"-->
<!--                      v-model="fromDateVal"-->
<!--                      no-title-->
<!--                      dark-->
<!--                      @input="fromDateMenu = false; handleChangeDate('date')"-->
<!--                      :min="minDate"-->
<!--                    >-->
<!--                    </v-date-picker>-->
<!--                  </v-menu>-->
<!--                </v-col>-->
<!--              </v-list>-->
<!--            </v-menu>-->
<!--          </div>-->
        </div>
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
        :search="''"
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
        :delivery-date="delivery_date"
        :date-filter-with-no-date="dateFilterWithNoDate"
        :search="''"
        :categoryName="categoryData && categoryData.breadcrumbs && categoryData.breadcrumbs[categoryData.breadcrumbs.length - 1].name"
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
    <error_page v-if="errorPageTrigger" />
  </div>
</template>

<script>
import filterCategory from "./filterCategory"
import catalog__table from "./catalog__table.vue"
import catalog__tile from "./catalog__tile.vue"
import error_page from "../404"
import create_order from "@/views/orders/create-order"
import moment from "moment"
import { mapActions, mapGetters } from "vuex"
// eslint-disable-next-line no-unused-vars
import store from "../../store"

export default {
  name: "Users",
  // eslint-disable-next-line vue/no-unused-components
  components: { catalog__table, catalog__tile, create_order, filterCategory, error_page },
  data() {
    return {
      specialBread: null,
      id: undefined,
      snack: false,
      snackColor: "",
      snackText: "",
      filterUuid: "",
      incIndex: 1,
      radios: this.radiosLocal,
      radiosLocal: "",
      radiosSpecification: false,
      fromDateMenu: false,
      fromDateVal: null,
      minDate: "2020-01-05",
      maxDate: "2019-08-30",
      dialog: false,
      update: false,
      updateListVal: false,
      selected: [],
      selectedData: [],
      selectTags: [],
      categoryData: [],
      categorySelect: [],
        dateFilterNextDay: false,
        dateFilterWithNoDate: true,
        delivery_date: null,
      clear: false,
        errorPageTrigger: false,
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
    }
  },
  computed: {
    uuidStore() {
      return this.$store.getters["category/uuid"]
    },
    showProductStore() {
      return this.$store.getters["category/showProduct"]
    },
    fromDateDisp() {
      return this.fromDateVal
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
          const category1 = this.$route.params.category_1;
          const category2 = this.$route.params.category_2;
          const category3 = this.$route.params.category_3;
          if (category3 != undefined) {
              return category3
          } else if (category2 != undefined) {
              return category2
          } else if (category1 != undefined) {
              return category1
          } else {
              return ''
          }
      },
      getFullUrl() {
        return this.$route.fullPath.split('?')[0];
      }
  },
    mounted() {
        this.getCategoryData();
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
              this.getCategoryData();
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
  methods: {
    ...mapActions("user", ["setLocation"]),
    ...mapActions("basket", [
      "setNewBasketProduct",
      "setIdProduct",
      "setAddProductID",
      "setBasketModal",
      "setCurrentLocation"
    ]),
    fiterBredcrumb(ctx) {
      if (ctx !== "") {
        this.$store.dispatch("category/setUUID", { ctx: ctx.uuid })
        this.$store.dispatch("category/setBreadcrumbCut", { ctx: ctx })
      } else {
        this.$store.dispatch("category/setUUID", { ctx: "forceRestart" })
        this.$store.dispatch("category/setBreadcrumbCut", { ctx: false })
      }
    },
      handleChangeDate(item) {
        if (item == 'nextDay') {
            if (this.dateFilterNextDay) {
                this.fromDateVal = null;
                this.delivery_date = moment().add(1, 'days').format('YYYY-MM-DD');
            } else {
                this.fromDateVal = null;
                this.delivery_date = null;
            }
        } else if (item == 'date') {
            this.dateFilterNextDay = false;
            this.delivery_date = this.fromDateVal;
        }
      },
      getCategoryData() {
        this.specialBread = null
        if(this.$route.name == 'must_see' || this.$route.name == 'popular') {
          this.errorPageTrigger = false;
          if (this.$route.name == 'must_see') {
            this.specialBread = "Варто придивитися"
          } else if (this.$route.name == 'popular') {
            this.specialBread = "Популярне для офісу"
          }
          return;
        }

        let url = process.env.VUE_APP_API_HOST
          url = url.replace('v1', 'v2')
          url = url + '/categories/category-data';
          if (this.getFullUrl == '/catalog' || this.getFullUrl == '/catalog/' || this.getFullUrl == '/catalog?basket=open') {
            this.categoryData = null;
          } else {
            this.$api.post(url, {
                uuid: this.getFullUrl.endsWith('/') ? this.getFullUrl.slice(0, -1) : this.getFullUrl,
            }).then((res) => {
                console.log(res, 'ddd')
                if (res.data.success) {
                    this.categoryData = res.data;
                    this.errorPageTrigger = false;
                } else {
                    this.categoryData = null;
                    this.errorPageTrigger = true;
                }
            }).catch((e) => {
                this.errorPageTrigger = true;
            })
          }
      },
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
              order_id: 0}
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
</style>
