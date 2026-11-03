<template>
  <div class="create-order">
      <div class="create-order__card">
        <div class="create-order__scroll-container">
            <v-container grid-list-md>
                <v-layout row class="create-order__delivery-row">
                    <v-layout column class="create-order__delivery-col create-order__delivery-col_left">
                        <v-flex>
                            <span v-if="update && !copy" class="create-order__title">Редагування замовлення</span>
                            <span v-else-if="!update && copy" class="create-order__title">Копіювати замовлення</span>
                            <span v-else class="create-order__title">Оформлення замовлення</span>
                            <span>{{newBasketProduct}}</span>
                        </v-flex>
                    <v-flex xs12 sm6 class="input-box create-order__box">
                      <div class="form-group locations__container" :class="{ active: isActive }" @click="isActive = !isActive">
                        <label class="form-group__label">
                          Локація
                          <v-tooltip top max-width="320px">
                            <div class="wrap-text">Заповнення поля є обов'язковим</div>
                            <i slot="activator" class="red--text pointer">*</i>
                          </v-tooltip>
                        </label>
                        <input ref="locations" placeholder="Виберіть локацію" type="text" class="v-input__control form-control" name="locations" id="locations" v-model="nameLocations" v-on:input="filterLocationList" v-on:focus="onFocusLocations" v-on:blur="onBlurLocations">
                          <div v-if="activeLocationsInput" class="locations__items" v-on:mouseenter="onMouseEnterLocations" v-on:mouseleave="onMouseLeaveLocations">
                          <div v-if="filtredLocationsList.length > 0">
                            <div v-for="location in filtredLocationsList" @click="choseLocation(location)" :class="['locations__item', location.id == selectedLocation && 'active']">
                              {{location.name}}
                            </div>
                          </div>
                          <div v-else>
                            <div class="locations__text">
                              Немає співпадінь
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="error__box">
                        <span>{{ errors.location_id }}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 sm6 class="input-box create-order__box">
                      <label class="form-group__label">
                        Кост-центр
                        <v-tooltip top max-width="320px">
                          <div class="wrap-text">Заповнення поля є обов'язковим</div>
                          <i slot="activator" class="red--text pointer">*</i>
                        </v-tooltip>
                      </label>
                      <v-select
                              ref="input-step"
                              v-model="model.cost_center_id"
                              class="input-step"
                              :class="{ activeStep: indexSelect === 1 }"
                              hide-details
                              solo
                              attach
                              :menu-props="{
                        closeOnClick: true,
                        closeOnContentClick: true,
                        openOnClick: true,
                        value: indexSelect === 1
                      }"
                              :items="costCenters"
                              :clearable="false"
                              :searchable="false"
                              item-text="name"
                              item-value="id"
                              label="Виберіть кост-центр"
                      />
                      <div class="error__box">
                        <span>{{ errors.cost_center_id }}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 sm6 md6 class="input-box create-order__box">
                      <label class="form-group__label">
                        Юридична особа
                        <v-tooltip top max-width="320px">
                          <div class="wrap-text">Заповнення поля є обов'язковим</div>
                          <i slot="activator" class="red--text pointer">*</i>
                        </v-tooltip>
                      </label>
                      <v-select
                              ref="input-step"
                              v-model="model.company_entity_id"
                              class="input-step"
                              :class="{ activeStep: indexSelect === 2 }"
                              hide-details
                              solo
                              attach
                              :menu-props="{
                        closeOnClick: true,
                        closeOnContentClick: true,
                        openOnClick: true,
                        value: indexSelect === 2
                      }"
                              :items="companyEntity"
                              :clearable="false"
                              :searchable="false"
                              item-text="short_name"
                              item-value="id"
                              label="Виберіть юридичну особу"
                      />
                      <div class="error__box">
                        <span>{{ errors.company_entity_id }}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 sm6 class="input-box create-order__box">
                      <label class="form-group__label">
                        Договір
                        <v-tooltip top max-width="320px">
                          <div class="wrap-text">Заповнення поля є обов'язковим</div>
                          <i slot="activator" class="red--text pointer">*</i>
                        </v-tooltip>
                      </label>
                      <v-select
                              ref="input-step"
                              v-model="model.contract_id"
                              class="input-step"
                              hide-details
                              attach
                              solo
                              :items="contracts"
                              :class="{ activeStep: indexSelect === 3 }"
                              :menu-props="{
                        closeOnClick: true,
                        closeOnContentClick: true,
                        openOnClick: true,
                        value: indexSelect === 2
                      }"
                              :clearable="false"
                              :searchable="false"
                              item-text="name"
                              item-value="id"
                              label="Виберіть договір"
                      />
                      <div class="error__box">
                        <span>{{ errors.contract_id }}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 sm6 class="input-box create-order__box">
                      <label class="form-group__label">
                        Бюджет
                        <v-tooltip v-if="!nonBudget" top max-width="320px">
                          <div class="wrap-text">Заповнення поля є обов'язковим</div>
                          <i slot="activator" class="red--text pointer">*</i>
                        </v-tooltip>
                      </label>
                      <v-select
                              ref="input-step"
                              v-model="model.budget_id"
                              class="input-step"
                              :class="{ activeStep: indexSelect === 4 }"
                              hide-details
                              solo
                              attach
                              :menu-props="{
                        closeOnClick: true,
                        closeOnContentClick: true,
                        openOnClick: true,
                        value: indexSelect === 4
                      }"
                              :items="budgets"
                              :clearable="false"
                              :searchable="false"
                              item-text="name"
                              item-value="id"
                              label="Виберіть бюджет"
                      >
                        <div
                                slot="selection"
                                slot-scope="{ item }"
                                class="v-select__selection v-select__selection--comma"
                        >
                          {{ item.name }} ( {{ item.available }} &#8372; )
                        </div>
                        <div slot="item" slot-scope="{ item }">
                          {{ item.name }} ( {{ item.available }} &#8372; )
                        </div>
                      </v-select>
                      <div class="error__box">
                        <span>{{ errors.budget_id }}</span>
                      </div>
                    </v-flex>
                    <!--<v-flex xs12 sm12 class="input-box create-order__box">-->
                      <!--<label class="form-group__label">№ Purchase Order</label>-->
                      <!--<input-->
                              <!--v-model="model.ro_number"-->
                              <!--type="text"-->
                              <!--class="input-default v-input__control&#45;&#45;purchase"-->
                      <!--/>-->
                      <!--<div class="error__box">-->
                        <!--<span>{{ errors.ro_number }}</span>-->
                      <!--</div>-->
                    <!--</v-flex>-->
                    <v-flex xs12 sm12 class="input-box create-order__box">
                      <label class="form-group__label">Коментар до замовлення</label>
                      <textarea
                              v-model="model.comment"
                              class="textarea-default"
                              placeholder="Додайте інформацію про особлівості відвантаження замовлення, і ми передамо її кур'єру"
                      ></textarea>
                      <div class="error__box">
                        <span>{{ errors.comment }}</span>
                      </div>
                    </v-flex>

                  <v-layout column class="create-order__delivery">
                      <v-flex class="create-order__delivery-title__inner"><label class="create-order__title">Оберіть бажану дату доставки</label></v-flex>

                      <div class="create-order__delivery-block">
                          <v-flex class="create-order__delivery-subtitle__inner"><label>Доставляти товари за вашим замовленням</label></v-flex>

                          <v-tabs v-model="tab" centered class="create-order__delivery-tabs">
                              <v-tab href="#one-date">однією датою</v-tab>
                              <v-tab href="#random-date">по мірі доступності</v-tab>
                          </v-tabs>

                          <v-tabs-items v-model="tab" class="create-order__delivery-tabs_content">
                              <v-tab-item :key="1" value="one-date">
                                  <v-card flat>
                                      <v-dialog
                                              ref="dialog_delivery_date"
                                              v-model="modal_delivery_date"
                                              content-class="datepicker"
                                              :return-value.sync="datePickerValue"
                                              persistent
                                              lazy
                                              full-width
                                              width="290px"
                                      >
                                          <template v-slot:activator="{ on }">
                                              <input
                                                      ref="input-step"
                                                      v-model="model.delivery_date"
                                                      :class="{ activeStep: indexSelect == 0 }"
                                                      type="text"
                                                      class="input-default input-step"
                                                      placeholder="ДД/ММ/РРРР *"
                                                      prepend-icon="event"
                                                      readonly
                                                      v-on="on"
                                              />
                                          </template>
                                          <v-date-picker
                                                  v-model="datePickerValue"
                                                  first-day-of-week="1"
                                                  locale="uk"
                                                  dark
                                                  scrollable
                                                  :min="getMinDate"
                                                  :allowed-dates="allowedDates"
                                          >

                                              <v-spacer />
                                              <v-btn flat color="primary" @click="modal_delivery_date = false">Скасувати</v-btn>
                                              <v-btn flat color="primary" @click="saveDate()">
                                                  Зберегти
                                              </v-btn>
                                          </v-date-picker>
                                      </v-dialog>
                                  </v-card>
                                  <div v-if="delivery_date_error" class="error__box">
                                      <span>{{ errors.delivery_date }}</span>
                                  </div>
                              </v-tab-item>
                              <v-tab-item :key="2" value="random-date">

                              </v-tab-item>
                          </v-tabs-items>

                          <div v-if="tab == 'random-date'" class="create-order__temp-info">
                              <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.1432 0L20 5.86V14.1442L14.1432 20H5.85895L0 14.1432V5.85895L5.85895 0H14.1432ZM13.2705 2.10526H6.73053L2.10632 6.73158V13.2716L6.73053 17.8968H13.2705L17.8958 13.2716V6.73053L13.2705 2.10632V2.10526ZM8.94737 13.1579H11.0526V15.2632H8.94737V13.1579ZM8.94737 4.73684H11.0526V11.0526H8.94737V4.73684Z" fill="#222222"/>
                              </svg>
                              Ми додатково звами погодимо строки доставки замовлення.
                          </div>

                          <div v-if="haveProductNoLeftovers" class="create-order__temp-info">
                              <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.1432 0L20 5.86V14.1442L14.1432 20H5.85895L0 14.1432V5.85895L5.85895 0H14.1432ZM13.2705 2.10526H6.73053L2.10632 6.73158V13.2716L6.73053 17.8968H13.2705L17.8958 13.2716V6.73053L13.2705 2.10632V2.10526ZM8.94737 13.1579H11.0526V15.2632H8.94737V13.1579ZM8.94737 4.73684H11.0526V11.0526H8.94737V4.73684Z" fill="#222222"/>
                              </svg>
                              Звертаємо увагу, в замовленні присутні товари дату доступності котрих ми повідомимо додатково
                          </div>

                          <div v-if="order_with_temperature_conditions" class="create-order__temp-info">
                              <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 0C0.671875 0 0 0.839844 0 1.875V14.375C0 15.4102 0.671875 16.25 1.5 16.25H2C2 18.3203 3.34375 20 5 20C6.65625 20 8 18.3203 8 16.25H12C12 18.3203 13.3438 20 15 20C16.6562 20 18 18.3203 18 16.25H19C19.5531 16.25 20 15.6914 20 15C20 14.3086 19.5531 13.75 19 13.75V11.25V10V9.26953C19 8.60547 18.7906 7.96875 18.4156 7.5L16 4.48047C15.625 4.01172 15.1156 3.75 14.5844 3.75H13V1.875C13 0.839844 12.3281 0 11.5 0H1.5ZM13 6.25H14.5844L17 9.26953V10H13V6.25ZM3.5 16.25C3.5 15.7527 3.65804 15.2758 3.93934 14.9242C4.22064 14.5725 4.60218 14.375 5 14.375C5.39782 14.375 5.77936 14.5725 6.06066 14.9242C6.34197 15.2758 6.5 15.7527 6.5 16.25C6.5 16.7473 6.34197 17.2242 6.06066 17.5758C5.77936 17.9275 5.39782 18.125 5 18.125C4.60218 18.125 4.22064 17.9275 3.93934 17.5758C3.65804 17.2242 3.5 16.7473 3.5 16.25ZM15 14.375C15.3978 14.375 15.7794 14.5725 16.0607 14.9242C16.342 15.2758 16.5 15.7527 16.5 16.25C16.5 16.7473 16.342 17.2242 16.0607 17.5758C15.7794 17.9275 15.3978 18.125 15 18.125C14.6022 18.125 14.2206 17.9275 13.9393 17.5758C13.658 17.2242 13.5 16.7473 13.5 16.25C13.5 15.7527 13.658 15.2758 13.9393 14.9242C14.2206 14.5725 14.6022 14.375 15 14.375Z" fill="#222222"/>
                                <path d="M9.99961 4.20074C9.99961 4.04158 9.93639 3.88894 9.82387 3.7764C9.71135 3.66385 9.55874 3.60063 9.39961 3.60063C9.24048 3.60063 9.08787 3.66385 8.97535 3.7764C8.86282 3.88894 8.79961 4.04158 8.79961 4.20074C8.79961 4.3599 8.86282 4.51255 8.97535 4.62509C9.08787 4.73763 9.24048 4.80086 9.39961 4.80086C9.55874 4.80086 9.71135 4.73763 9.82387 4.62509C9.93639 4.51255 9.99961 4.3599 9.99961 4.20074ZM7.59961 4.20074C7.59961 3.72326 7.78925 3.26533 8.12682 2.9277C8.46438 2.59007 8.92222 2.40039 9.39961 2.40039C9.877 2.40039 10.3348 2.59007 10.6724 2.9277C11.01 3.26533 11.1996 3.72326 11.1996 4.20074C11.1996 4.67823 11.01 5.13615 10.6724 5.47378C10.3348 5.81141 9.877 6.00109 9.39961 6.00109C8.92222 6.00109 8.46438 5.81141 8.12682 5.47378C7.78925 5.13615 7.59961 4.67823 7.59961 4.20074ZM4.29961 3.60063C3.80273 3.60063 3.39961 4.00383 3.39961 4.5008V7.58578C3.39961 7.91022 3.26648 8.18402 3.11273 8.38281C2.91586 8.63786 2.79961 8.9548 2.79961 9.30174C2.79961 10.1307 3.47086 10.802 4.29961 10.802C5.12836 10.802 5.79961 10.1307 5.79961 9.30174C5.79961 8.9548 5.68336 8.63786 5.48648 8.38469C5.33273 8.1859 5.19961 7.91209 5.19961 7.58765V4.5008C5.19961 4.00383 4.79648 3.60063 4.29961 3.60063ZM2.19961 4.5008C2.19961 3.34182 3.13898 2.40039 4.29961 2.40039C5.46023 2.40039 6.39961 3.33995 6.39961 4.5008V7.5839C6.39961 7.5839 6.40148 7.58953 6.40336 7.59516C6.40711 7.60641 6.41836 7.62516 6.43523 7.64767C6.78961 8.10526 6.99961 8.67912 6.99961 9.29986C6.99961 10.7908 5.79023 12.0004 4.29961 12.0004C2.80898 12.0004 1.59961 10.7927 1.59961 9.30174C1.59961 8.67912 1.80961 8.10526 2.16398 7.64954C2.18086 7.62704 2.19211 7.60828 2.19586 7.59703C2.19773 7.5914 2.19961 7.58578 2.19961 7.58578V4.5008ZM5.19961 9.30174C5.19961 9.79871 4.79648 10.2019 4.29961 10.2019C3.80273 10.2019 3.39961 9.79871 3.39961 9.30174C3.39961 8.90979 3.65086 8.57597 3.99961 8.4522V7.50139C3.99961 7.33636 4.13461 7.20133 4.29961 7.20133C4.46461 7.20133 4.59961 7.33636 4.59961 7.50139V8.4522C4.94836 8.57597 5.19961 8.90979 5.19961 9.30174Z" fill="#FFFF9E"/>
                              </svg>
                              Деякі товари в замовленні потребують особливих температурних умов у випадку їх доставки перевізником  — у разі необхідності повідомимо додатково
                          </div>
                      </div>

                  </v-layout>


              </v-layout>
                    <v-layout column class="create-order__delivery-col create-order__delivery-col_right">
                        <v-card variant="outlined">
                            <div class="delivery-info">
                                <div class="delivery-info__col">
                                    <div class="delivery-info_title">Ваше замовлення</div>
                                    <div v-if="!update && !copy" class="delivery-info_edit" @click="toBascket">Редагувати</div>
                                    <div class="delivery-info_count">{{products.length}} товарів на суму</div>
                                </div>
                                <div class="delivery-info_price">Загальна сума <span> {{this.totalSum | price-break}}₴</span></div>
                                <div v-if="model.budget_id" class="delivery-info_budget">Доступний бюджет <span> {{this.availableBudget | price-break}}₴</span></div>
                                <div v-if="budgetExceeded" :class="['delivery-info_budget-info', budget_restriction && 'restriction']">
                                    Йой! Нажаль Ваше замовлення перевищує доступний залишок за бюдетом на <span> {{this.differenceBudget | price-break}}₴</span> !
                                    <div v-if="budget_restriction">Для продовження оформлення замовлення, будь-ласка, поверніться до корзини та відредагуйте замовлення</div>
                                </div>
                                <div v-if="budgetExceeded && !update" class="delivery-info__edit-btn" @click="toBascket">Редагувати замовлення</div>
                                <div v-if="!update" :class="['delivery-info_btn', budgetExceeded && budget_restriction && 'blocked']" @click="createOrder">Підтвердити замовлення</div>
                                <div v-else class="delivery-info_btn" @click="updateOrder">Редагувати замовлення</div>
                                <div v-if="errorMessage" style="padding-top: 15px" :class="['delivery-info_budget-info', 'restriction']">
                                    {{errorMessage}}
                                </div>
                            </div>
                        </v-card>
                    </v-layout>
                </v-layout>
            </v-container>
        </div>
      </div>

    <v-dialog
            v-model="modalDeleted"
            :fullscreen="$store.getters['params/mobileView']"
            persistent
            max-width="705px"
    >
      <v-card>
        <v-card-title>
          <span v-if="deletedAll" class="headline">ВСІ ТОВАРИ НЕ ДОСТУПНІ ДО ЗАМОВЛЕННЯ</span>
          <span v-else class="headline">ТОВАР НЕ ДОСТУПНИЙ ДО ЗАМОВЛЕННЯ <br>
            дані товари не будуть перенесені до нового замовлення
          </span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="handleCloseModalDeleted">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-container grid-list-md>
          <div class="deleted">
            <div v-for="item in deletedProduct" :key="item.id" class="deleted__item">
              <div class="deleted__item-cell-img">
                <img class="deleted__item-cel-img" :src="item.photo" alt="">
              </div>
              <div class="deleted__item-cell">
                {{item.sku}}
              </div>
              <div class="deleted__item-cell">
                {{item.name}}
              </div>
            </div>
          </div>
        </v-container>

        <v-card-actions class="button--center">
          <!--<v-spacer />-->
          <button class="button button__blue" flat @click="handleCancelDuplicate">
            Скасувати
          </button>
          <button
                  v-if="!deletedAll"
                  class="button button__yellow"
                  flat
                  @click="duplicateOrder"
          >
            Копіювати
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import moment from "moment";
  import { mapGetters, mapActions } from "vuex"


  export default {
    name: "CreateOrder",
    components: {
      },
      data: () => ({
          order_with_temperature_conditions: false,
          errorMessage: null,
          locationId: 0,
          products: [],
          id: '',
          model: {
              delivery_date: "",
              company_entity_id: "",
              location_id: "",
              cost_center_id: "",
              contract_id: "",
              budget_id: "",
              comment: ""
          },
          update: false,
          copy: 0,

          pagination: {
              sortBy: "id",
              rowsPerPage: 100,
              page: 1
          },
          delivery_date_error: false,


        tab: "one-date",
          selectedDate: null,
        toggle: "Завтра",
          blockSubmit: false,
        companyEntity: [],
        locations: [],
        costCenters: [],
        contracts: [],
        budgets: [],
        errors: [],
        isActive: false,
        arr: [],
        tabs: null,
        nonBudget: true,
        initLoad: true,
        indexSelect: -1,
          modalDeleted: false,
          deletedAll: false,
          deletedProduct: [],
          nameLocations: '',
          activeLocationsInput: false,
          hoverListLocations: false,
          filtredLocationsList: [],

          countProduct: 0,
          totalSum: 0,
          modal_delivery_date: false,
          datePickerValue: "",
          minDateDelivery: 1,
          haveProductNoLeftovers: false,
          availableBudget: 0,
          differenceBudget: 0,
          budgetExceeded: false,
          budget_restriction: false,
          chooseLocationData: null,
          successCreate: false,
          newOrderID: '',
          errorModal: false,
          errorMsg: "",
      }),
    computed: {
      // ...mapGetters("basket", [
      //     "newBasketProduct"
      // ]),
      getMinDate() {
          let now
          if (this.minDateDelivery < 2) {
              now = new Date(new Date())
          } else {
              now = new Date(new Date().getTime() + 24 * (this.minDateDelivery - 1) * 60 * 60 * 1000)
          }
          const nowTime = now.getHours()*60+now.getMinutes();
          const dayNumber = moment(now).day();

          let devDate;
          if (nowTime < 900) {
              if (dayNumber === 5) {
                  devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
              } else if (dayNumber === 6) {
                  devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
              } else if (dayNumber === 0) {
                  devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
              } else {
                  devDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
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

          return devDate.toISOString().slice(0, 10)
      },
  },
  watch: {
    model: {
      handler() {
        this.$nextTick(() => {
          if (this.dialog) {
            this.stepInput()
            if (this.locations.length == 1 && this.model.location_id == "") {
              this.model.location_id = this.locations[0].id
            }
          }
        })
      },
      deep: true
    },
    "model.company_entity_id": function() {
      this.changeCostCenter()
    },
    "model.location_id": function() {
      this.changeLocation()
      if (this.model.location_id) {
          let locationName = this.locations.find(location => location.id === this.model.location_id).name
          this.nameLocations = locationName
      }
    },
    "model.cost_center_id": function() {
      this.changeCostCenter()
    },
      "model.budget_id": function() {
          this.changeBudget()
      }
  },
  created() {
    this.$api
      .post("/graphql", {
        query: `
                        query{
                              location(perPage: 1000 list: true){
                                items{
                                  id
                                  name
                                  isActive
                                  city
                                  street
                                  building
                                  office
                                  floor
                                }
                              }
                              myCompany{
                                non_budget_order
                              }
                            }`
      })
      .then(response => {
          const locations = response.data.data.location.items
          const locationsActive = []
          for(let i = 0; locations.length > i; i++) {
              if (locations[i].isActive) {
                  locationsActive.push(locations[i])
              }
          }
        this.locations = locationsActive
        this.nonBudget = response.data.data.myCompany.non_budget_order
          if (locations.length == 1 && this.model.location_id == '') {
              this.model.location_id = locations[0].id
          }
          this.filterLocationList()
      })
  },
  mounted() {
      this.id = this.$route.query.id == 'undefined' ? undefined : this.$route.query.id
      this.update = this.$route.query.update == 'false' ? false : true

      if (!this.update) {
          if (!this.id) {
              this.getProduct()
          }
      } else {
          if (this.id) {
              console.log('edit')
              this.getOrder()
          }
      }
  },
  methods: {
    ...mapActions("basket", ["setNewBasketProduct", "setIdProduct"]),
      toBascket() {
        this.$router.push('/orders?basket=open')
      },
      getProduct() {
          this.loading(true)
          this.$api
              .post("/graphql", {
                  query:
                  `
                        query{
                          cartProduct(order_id: ` +
                  0 +
                  ` page:1  perPage: 1000 order: "ASC" orderBy: "id"){
                              items{
                                last_update
                                id
                                quantity
                                price
                                total_sum
                                status
                                newProduct
                                changeQuantity
                                is_delete
                                is_strict_multiplicity
                                product{
                                  id
                                  sku
                                  name
                                  leftovers_salvi
                                  leftovers_supplier
                                  supplier_delivery_postpone
                                  multiplicity
                                  strict_multiplicity
                                  is_temperature_conditions
                                  unit{
                                    name
                                  }
                                  img
                                }
                              }
                              totalCount
                          }
                          cart{
                                  id
                                  location_id
                                  location_name
                                  cost_center_id
                                  cost_center_name
                                  order_id
                                  total
                                  total_sum
                              }
                        }`
              })
              .then(response => {
                  const items = response.data.data.cartProduct.items

                  let AllProduct = items.map(e => {
                      return {
                          name: e.product.name,
                          id: e.product.id,
                          addId: e.id,
                          lastUpdate: e.last_update,
                          quantity: e.quantity,
                          price: e.price.toString(),
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
                          strict_multiplicity: e.strict_multiplicity || e.product.strict_multiplicity,
                          is_strict_multiplicity: e.is_strict_multiplicity || e.product.is_strict_multiplicity || e.strict_multiplicity || e.product.strict_multiplicity,
                      }
                  })
                  AllProduct.forEach((e, index) => {
                      e.index = index
                  })
                  this.products = AllProduct

                  for(let i = 0; items.length > i; i++) {
                      console.log(items[i], 'jjj')
                      if(items[i].product.is_temperature_conditions) {
                          this.order_with_temperature_conditions = true;
                      }
                  }

                  this.loading(false)
                  this.iterationProduct()
              })
      },
      getOrder() {
          this.loading(true)
          let order = "DESC"
          if (this.pagination.descending) {
              order = "ASC"
          }

          this.$api
              .post("/graphql", {
                  query:
                  `
                        query{
                          orderInfo(id:` +
                  this.id +
                  `){
                            id
                            ro_number
                            order_id
                            company_id
                            delivery_date
                            company_entity_id
                            location_id
                            location_name
                            cost_center_id
                            cost_center_name
                            contract_id
                            budget_id
                            comment
                            created_by_user
                            created_at
                            updated_at
                            status
                            total_sum
                            cart_id
                            total
                            coordination
                            ttn
                            one_day_shipment
                            company_entity{
                                short_name
                                full_name
                            }
                            history{
                                email
                                role
                            }
                            budget{
                              availableSum
                            }
                            empty_string
                            created_by{
                                first_name
                                last_name
                            }
                            modal
                            can_approve_next_coordination
                          }


                          orderProduct(order_id: ` +
                  this.id +
                  ` page: ` +
                  this.pagination.page +
                  ` perPage: ` +
                  this.pagination.rowsPerPage +
                  ` order: "` +
                  order +
                  `" orderBy: "` +
                  this.pagination.sortBy +
                  `"){
                              items{
                                is_delete
                                catalog
                                id
                                quantity
                                price
                                total_sum
                                view_only
                                is_strict_multiplicity
                                product{
                                  id
                                  sku
                                  leftovers
                                  leftovers_salvi
                                  leftovers_supplier
                                  supplier_delivery_postpone
                                  multiplicity
                                  strict_multiplicity
                                  is_temperature_conditions
                                  name
                                  unit{
                                    name
                                  }
                                  img
                                }
                                name
                                custom
                                comment
                                avaliable_quantity
                                order_id
                                product_status
                                approved
                                approved_quantity
                                status{
                                    id
                                    icon
                                    text
                                    style
                                }
                                orderProductHistory{
                                    id
                                    from_uuid
                                    to_uuid
                                    product_name
                                }
                              }
                              totalCount
                          }
                        }`
              })
              .then(response => {
                  this.loading(false)
                  this.data = response.data.data.orderInfo
                  this.model.comment = this.data.comment
                  this.model = {
                      company_entity_id: this.data.company_entity_id,
                      location_id: this.data.location_id,
                      cost_center_id: this.data.cost_center_id,
                      contract_id: this.data.contract_id,
                      budget_id: this.data.budget_id,
                      comment: this.data.comment,
                      one_day_shipment: this.data.one_day_shipment
                  }

                  if (this.model.delivery_date) {
                      this.model.delivery_date = moment(this.data.delivery_date * 1000).format('YYYY-MM-DD')
                  }
                  this.products = response.data.data.orderProduct.items

                    for(let i = 0; this.products.length > i; i++) {
                      console.log(this.products[i], 'jjj')
                      if(this.products[i].product.is_temperature_conditions) {
                          this.order_with_temperature_conditions = true;
                      }
                    }

                  this.nameLocations = this.data.location_name

                  if (this.update) {
                      if (!this.model.one_day_shipment) {
                          this.tab = 'random-date'
                      }
                  }

                  this.iterationProduct()
              })
      },
      changeBudget() {
          const budget = this.budgets.find(budget => budget.id === this.model.budget_id)
          this.availableBudget = budget.available
          if (+this.availableBudget < +this.totalSum) {
            this.budgetExceeded = true
            this.budget_restriction = budget.budget_restriction ? true : false
            this.differenceBudget = (this.totalSum - this.availableBudget).toFixed(2)
          } else {
            this.budgetExceeded = false
          }
      },
      showFullAdress(item) {
          let address = ""
          if (item.city != "") {
              address += item.city
          }
          if (item.street != "") {
              address += ", " + item.street
          }
          if (item.building != "") {
              address += ", б." + item.building
          }
          if (item.office != "") {
              address += ", оф." + item.office
          }
          if (item.floor) {
              address += ", поверх " + item.floor
          }
          return address
      },
      iterationProduct () {
          let summ = 0
          let quantityAll = 0
          if (this.products.length) {
            for (let i = 0; this.products.length > i; i++) {
                let quantity = +this.products[i].quantity
                summ += +this.products[i].total_sum
                quantityAll += +this.products[i].quantity

                if (this.products[i].leftovers_salvi > 0) {
                    if (this.products[i].leftovers_salvi >= quantity) {

                    } else {
                        if (this.products[i].leftovers_supplier >= (quantity - this.products[i].leftovers_salvi)) {
                            if (this.minDateDelivery < this.products[i].supplier_delivery_postpone) {
                                this.minDateDelivery = this.products[i].supplier_delivery_postpone
                            }
                        } else {
                            if (this.minDateDelivery < this.products[i].supplier_delivery_postpone) {
                                this.minDateDelivery = this.products[i].supplier_delivery_postpone
                            }
                            this.haveProductNoLeftovers = true
                        }
                    }
                } else {
                    if (this.products[i].leftovers_supplier > 0) {
                        if (this.products[i].leftovers_supplier >= quantity) {
                            if (this.minDateDelivery < this.products[i].supplier_delivery_postpone) {
                                this.minDateDelivery = this.products[i].supplier_delivery_postpone
                            }
                        } else {
                            if (this.minDateDelivery < this.products[i].supplier_delivery_postpone) {
                                this.minDateDelivery = this.products[i].supplier_delivery_postpone
                            }
                            this.haveProductNoLeftovers = true
                        }
                    } else {
                        this.haveProductNoLeftovers = true
                    }
                }
            }
            this.countProduct = quantityAll
            this.totalSum = summ.toFixed(2)
          }
      },
      allowedDates(val) {
          return moment(val).day() !== 0 && moment(val).day() !== 6;
      },
      saveDate() {
          this.$nextTick(() => (this.model.delivery_date = this.datePickerValue))
          this.modal_delivery_date = false;
          // this.dateError = false;
      },
      setDefaultDate() {
          const dateToDay = moment().format("YYYY-MM-DD")
          let dateDefault = moment(dateToDay).add(2, 'd').format("YYYY-MM-DD")
          function addDay() {
              if (moment(dateDefault).day() == 0 || moment(dateDefault).day() == 6) {
                  dateDefault = moment(dateDefault).add(1, 'd').format("YYYY-MM-DD")
                  addDay()
              }
          }
          addDay();

          if (moment(dateToDay).day() == 6 || moment(dateToDay).day() == 0) {
              dateDefault = moment(dateDefault).add(1, 'd').format("YYYY-MM-DD")
          }

          const now = new Date();
          const nowTime = now.getHours()*60+now.getMinutes();
          const dayNumber = moment(now).day();
          if ( +nowTime > 930 && dayNumber == 5 ) {
              dateDefault = moment(dateDefault).add(1, 'd').format("YYYY-MM-DD")
          }
          this.model.delivery_date = dateDefault;
      },
      filterLocationList() {
          if (this.nameLocations.length > 0) {
              const list = this.locations
              const newList = []
              for (let i = 0; list.length > i; i++) {
                  if (list[i].name.toLowerCase().includes(this.nameLocations.toLowerCase())) {
                      newList.push(list[i])
                  }
              }
              this.filtredLocationsList = newList
          } else {
              this.filtredLocationsList = this.locations
          }
      },
      onFocusLocations() {
          this.activeLocationsInput = true
      },
      onBlurLocations() {
          if (!this.hoverListLocations) {
              this.activeLocationsInput = false
          }
      },
      onMouseEnterLocations() {
          this.hoverListLocations = true
      },
      onMouseLeaveLocations() {
          this.hoverListLocations = false
      },
      choseLocation(item) {
          this.activeLocationsInput = false
          this.hoverListLocations = false
          this.model.location_id = item.id
          this.nameLocations = item.name
      },
    stepInput() {
        if (!this.model.location_id) {
            const elem = this.$refs.locations
            setTimeout(()=> {
                elem.focus()
            })
            return
        }
      let arrIndex = []
      // eslint-disable-next-line no-unused-vars
      let nextStep = true
      let allInput = this.$refs.modal.$refs.content.querySelectorAll(
        ".input-step"
      )
      allInput.forEach((item, index) => {
        let selectorValue = item.querySelector(
          ".v-select__selections .v-select__selection--comma"
        )
        let inputValue = item.value
        if (selectorValue !== null && inputValue == "") {
          this.indexSelect = index
          allInput[index].classList.add("activeStep")
        }
        if (
          (inputValue !== undefined && inputValue !== "") ||
          selectorValue !== null
        ) {
          allInput.forEach(e => {
            e.classList.remove("activeStep")
          })
          if (allInput[index + 1]) {
            allInput[index + 1].classList.add("activeStep")
            this.indexSelect = index + 1
          } else {
            this.indexSelect = -1
          }
        } else {
          nextStep = false
          allInput.forEach(e => {
            e.classList.remove("activeStep")
          })
          arrIndex.push(index)
          allInput[arrIndex[0]].classList.add("activeStep")
          this.indexSelect = false
          this.$nextTick(() => {
            this.indexSelect = arrIndex[0]
          })
        }
      })
    },
      setStatusOnApprove(id) {
          const data = {
              id: id,
          }
          this.$api
              .post("/order/set-status-on-approve", data)
              .then(response => {
                  this.loading(false)
                  this.blockSubmit = false
                  this.setNewBasketProduct({
                      ctx: []
                  });
                  this.setIdProduct({
                      ctx: {
                          order_id: 0
                      }
                  })
                  if (response.data.success) {
                      this.$router.push(`/success-order?id=${id}`)
                  } else {
                      if (response.data.message) {
                          this.$loadingBus.$emit("snackbar", {
                              text: response.data.message,
                              color: "error"
                          })
                      }
                      this.$router.push(`/orders?order=${id}`)
                  }
              })
              .catch(() => {
                  this.loading(false)
                  this.blockSubmit = false
                  this.setNewBasketProduct({
                      ctx: []
                  });
                  this.setIdProduct({
                      ctx: {
                          order_id: 0
                      }
                  })
                  this.$router.push(`/orders?order=${id}`)
              })
      },
    createOrder() {
        if (!this.blockSubmit) {
            this.errorMessage = null
            this.blockSubmit = true
            this.loading(true)
            if (this.tab == 'one-date') {
                this.model.one_day_shipment = 1
            } else {
                this.model.one_day_shipment = 0
                this.model.delivery_date = ''
            }

            if (this.model.one_day_shipment) {
                if (this.model.delivery_date.length > 1) {

                } else {
                    this.delivery_date_error = true
                    this.errors['delivery_date'] = "Заповніть дату доставки"
                    this.loading(false)
                    this.blockSubmit = false
                    return
                }
            }
            this.model.products = this.products
            if (this.location_id == this.model.location_id) {
                this.model.modal = 0
            } else {
                this.model.modal = 1
            }
            this.model.add_product = false

            if (this.$route.name == "order-add-product") {
                this.model.add_product = true
            }
            this.$api.post("/order/create", this.model).then(response => {
                let errors = []
                if (response.data.success) {

                    this.setStatusOnApprove(response.data.id)

                } else {
                    this.loading(false)
                    this.blockSubmit = false

                    if (response.data.errors) {
                        response.data.errors.forEach(function(value) {
                            errors[value.field] = value.message
                        })
                    }

                    if (response.data.error) {
                        this.errorMessage = response.data.error.message
                    }

                    this.errors = errors
                }
            }).catch(err => {
                this.loading(false)
                this.blockSubmit = false
                this.errorMessage = (err && err.response && err.response.data && err.response.data.message)
                    || "Помилка зв'язку з сервером при створенні замовлення. Будь ласка, спробуйте ще раз."
            })
        }
    },
    updateOrder() {
        if (this.tab == 'one-date') {
            this.model.one_day_shipment = 1
        } else {
            this.model.one_day_shipment = 0
            this.model.delivery_date = ''
        }
        if (this.model.one_day_shipment) {
            if (this.model.delivery_date != null && this.model.delivery_date.length > 1) {

            } else {
                this.delivery_date_error = true
                this.errors['delivery_date'] = "Заповніть дату доставки"
                this.loading(false)
                this.blockSubmit = false
                return
            }
        }
        this.model.id = this.id
      this.$api.post("/order/update", this.model).then(response => {
        let errors = []
        if (response.data.success) {
            this.$router.push(`/orders?order=${this.id}`)
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
      handleCancelDuplicate() {
          this.modalDeleted = false;
          this.cancel()
      },
      handleCloseModalDeleted() {
        this.modalDeleted = false
      },
      handleDuplicateOrder() {
        this.model.copy_id = this.copy
        this.$api
            .post("/order/get-list-no-available-product-for-duplicate-order", this.model)
            .then(response => {
                let errors = []
                if (response.data.success) {
                    if (response.data.products.length == 0) {
                        this.duplicateOrder()
                    } else {
                        this.modalDeleted = true
                        this.deletedProduct = response.data.products
                        this.deletedAll = response.data.isAll
                    }
                } else {
                    response.data.errors.forEach(function(value) {
                        errors[value.field] = value.message
                    })
                    this.errors = errors
                }
            })
      },
    duplicateOrder() {
        if (this.tab == 'one-date') {
            this.model.one_day_shipment = true
        } else {
            this.model.one_day_shipment = false
        }
      this.model.copy_id = this.copy
      this.$api
        .post("/order/duplicate-with-modal", this.model)
        .then(response => {
          let errors = []
          if (response.data.success) {
            this.cancel()
            return this.$router.push("/order/" + response.data.id)
          } else {
            response.data.errors.forEach(function(value) {
              errors[value.field] = value.message
            })
            this.errors = errors
          }
        })
    },
    cancel() {
        if (this.successCreate) {
            location.reload();
        } else {
          this.$emit("closeDialog", false)
          this.updateList()
          this.errors = []
            this.successCreate = false
        }
    },
    updateList() {
      this.$emit("updateList", true)
      setTimeout(() => {
        this.$emit("updateList", false)
      }, 100)
    },
    openDialog() {
      this.$emit("closeDialog", true)
    },
    changeLocation() {
        this.chooseLocationData = this.locations.find(location => location.id === this.model.location_id)
      if (!this.initLoad) {
        this.model.cost_center_id = ""
        this.model.company_entity_id = ""
      }
      if (this.model.location_id > 0) {
        this.$api
          .post("locations/get-list-of-cost-centers", {
            id: this.model.location_id
          })
          .then(response => {
            this.costCenters = response.data.costCenters
            if (this.costCenters.length == 0) {
              this.model.cost_center_id = ""
            }
            if (
              this.costCenters.length == 1 &&
              this.model.cost_center_id == ""
            ) {
              this.model.cost_center_id = this.costCenters[0].id
            }
          })
        this.$api
          .post("locations/get-company-entity", { id: this.model.location_id })
          .then(response => {
            this.companyEntity = response.data.companyEntity
            if (
              this.companyEntity.length == 1 &&
              this.model.company_entity_id == ""
            ) {
              this.model.company_entity_id = this.companyEntity[0].id
            }
            this.$nextTick(() => {
              if (this.companyEntity.length == 0) {
                this.model.company_entity_id = ""
              }
            })
          })
      } else {
        this.costCenters = []
        this.companyEntity = []
      }
      setTimeout(() => {
        this.initLoad = false
      }, 1000)
    },
      loading(e) {
          this.$loadingBus.$emit("loading", e)
      },
    changeCostCenter() {
      if (!this.initLoad) {
        this.model.contract_id = ""
        this.model.budget_id = ""
      }
      if (this.model.cost_center_id > 0) {
        this.$api
          .post("contract/get-list-of-contracts", {
            cost_center_id: this.model.cost_center_id,
            company_entity_id: this.model.company_entity_id,
            location_id: this.model.location_id
          })
          .then(response => {
            this.contracts = response.data.contracts
            if (this.contracts.length == 0) {
              this.model.contract_id = ""
            }
            if (this.contracts.length == 1 && this.model.contract_id == "") {
              this.model.contract_id = this.contracts[0].id
            }
          })
      } else {
        this.contracts = []
      }

      if (this.model.cost_center_id > 0) {
        this.$api
          .post("budget/get-list-of-budgets", {
            cost_center_id: this.model.cost_center_id,
            location_id: this.model.location_id
          })
          .then(response => {
            let budget = response.data.budgets
            if (budget.length > 0) {
              budget.forEach(function(value, index) {
                budget[index].name = value.name
              })
            }
            this.budgets = budget
            if (this.budgets.length == 0) {
              this.model.budget_id = ""
            }
            if (
              this.budgets.length == 1 &&
              this.model.budget_id == "" &&
              !this.nonBudget
            ) {
              this.model.budget_id = this.budgets[0].id
            }
          })
      } else {
        this.budgets = []
      }
    }
  }
}
</script>

<style scoped lang="sass">
    .crete-order__text-info
        font-size: 18px
        padding: 20px 0 20px 10px
    .create-order__card .create-order__box .textarea-default
        background: #fff
    .create-order__temp-info
        padding: 10px 30px
        font-size: 14px
        background: #FFFF9E
        color: #000000
        border-radius: 4px
        margin: 15px 0
        display: flex
        align-items: center
        border-radius: 4px

        svg
            margin-right: 20px
            width: 25px
            min-width: 25px
            height: 25px
            min-height: 25px
    .create-order *:not(.v-icon)
        font-family: "Montserrat", sans-serif
    .create-order__delivery-tabs_content
        padding-top: 20px
    .delivery-info_edit
        cursor: pointer
    .create-order__delivery-block
        padding: 10px
        margin: 10px 3px 0
        border: 1px solid #e8ecfa
    .textarea-default
        height: 90px !important

  .locations__container
    margin-bottom: 0
    width: 100%
    input
      padding: 20px 14px 4px
      height: auto
      width: 100%
      cursor: pointer
  .locations__items
    z-index: 1000
    padding: 0
    background: #ffffff
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px
    position: absolute
    top: 105%
    left: 0
    width: 100%
    max-height: 200px
    overflow-y: auto
  .locations__text
    padding: 10px
  .locations__item
    padding: 5px 20px

    &:hover
      background: gainsboro

    &.active
      background: black
      color: #ffffff
  .deleted
    display: block
  .deleted__item
    display: flex
    align-items: center
    width: 100%
    padding: 10px 20px
    border-bottom: 1px solid #a5a5a5
  .deleted__item-cell
    min-width: calc(100% / 2 - 120px)
    width: calc(100% / 2 - 120px)
    font-size: 14px
    font-weight: 500
    padding: 0 10px
  .deleted__item-cell-img
    min-width: 120px
    width: 120px
    padding: 0 10px
  .deleted__item-cel-img
    max-width: 100px
    max-height: 100px
    object-fit: contain
  .button--center
    display: flex
    justify-content: center
    button
      width: 33%
.checkbox__custom
    transition: 0.3s

    .visibleBlock-enter-active,
    .visibleBlock-leave-active,
    .visibleBlock-move
        transition: 600ms
        transition-property: opacity, transform

    .visibleBlock-enter
        transition: 100ms
        opacity: 0
        max-height: 1000px
        transform: translateY(200px)


    .visibleBlock-enter-to
        opacity: 1
        transition: 0.5s
        transform: translateY(0)


    .visibleBlock-leave-active
        max-height: 0px
        padding: 0px !important
        overflow: hidden
        opacity: 0
        transition: 0.3s


    .visibleBlock-leave-to
        opacity: 0
        transform-origin: center top

    .box-cost-input
        width: 100%
        display: flex
        padding-left: 0px !important

        .v-icon
            color: red

    .plus__cost__box
        .input-box
            margin-bottom: 0px

        label
            font-size: 13px
            color: #5578EB

        .btn__plus
            width: 20px !important
            min-width: 20px !important
            height: 20px !important
            background-color: #5578EB !important
            border-radius: 4px !important
            margin: 0px !important
            margin-right: 8px !important
            margin-left: 2px !important

            i
                color: white !important
                font-size: 18px !important
.v-card__title--flexed
  width: 100%
  display: flex
  padding-right: 40px
.form-group__label
  position: absolute
  top: 9px
  left: 18px
  font-size: 10px
  z-index: 1
.input-box
  position: relative
.v-input__control--purchase
    min-height: 48px
    padding: 20px 14px 4px 14px !important
</style>
