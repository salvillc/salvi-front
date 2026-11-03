<template>
    <div class="create-order">
        <v-dialog
                ref="modal"
                v-model="dialog"
                :fullscreen="$store.getters['params/mobileView']"
                persistent
                max-width="705px"
        >
            <template v-slot:activator="{ on }">
                <slot name="default">
                    <button
                            v-if="!nonCatalog"
                            v-show="products.length && id == undefined && $root.rbac.createOrder"
                            class="button button__yellow"
                            @click="openDialog"
                    >
                        Перенести в замовлення
                    </button>
                    <button
                            v-else
                            v-show="$root.rbac.createOrder"
                            class="button button__yellow"
                            @click="openDialog"
                    >
                        Створити замовлення
                    </button>
                </slot>
            </template>
            <v-card class="create-order__card">

                <v-card-title>
                    <v-spacer />

                    <v-flex class="v-card__title--flexed justify-content-between align-center">
                        <svg
                                width="111"
                                height="26"
                                viewBox="0 0 111 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M10.8386 26C8.70955 26 6.70955 25.7419 4.70955 25.2258C2.77406 24.7097 1.16116 24 -0.000134524 23.0968L2.06438 18.7097C3.22567 19.4839 4.58051 20.129 6.1289 20.5806C7.67729 21.0323 9.29019 21.2903 10.8386 21.2903C12.5805 21.2903 13.8708 21.0323 14.7095 20.5806C15.5483 20.0645 15.9354 19.4194 15.9354 18.5806C15.9354 18 15.6773 17.4839 15.1612 17.0968C14.7095 16.7097 14.0644 16.3871 13.2902 16.129C12.516 15.871 11.4837 15.6129 10.1934 15.3548C8.19342 14.9032 6.516 14.4516 5.22568 14C3.93536 13.5484 2.83857 12.8387 1.87083 11.8065C0.967605 10.7742 0.515997 9.48387 0.515997 7.80645C0.515997 6.32258 0.903091 5.03226 1.7418 3.87097C2.58051 2.64516 3.80632 1.74193 5.48374 1.03226C7.16116 0.32258 9.22568 -5.64018e-07 11.6773 -4.56855e-07C13.3547 -3.83532e-07 15.0321 0.193548 16.645 0.580645C18.2579 0.967742 19.6773 1.48387 20.9031 2.19355L19.0321 6.58065C16.5805 5.29032 14.1289 4.64516 11.6773 4.64516C9.93536 4.64516 8.70954 4.90323 7.87083 5.41935C7.03212 5.93548 6.64503 6.64516 6.64503 7.48387C6.64503 8.32258 7.09664 8.96774 8.06438 9.41935C9.03213 9.80645 10.4515 10.2581 12.4515 10.6452C14.4515 11.0968 16.1289 11.5484 17.4192 12C18.7095 12.4516 19.8063 13.1613 20.7096 14.129C21.6773 15.0968 22.1289 16.4516 22.1289 18.129C22.1289 19.5484 21.6773 20.9032 20.8386 22.0645C19.9999 23.2258 18.7095 24.1935 17.0321 24.8387C15.2902 25.6774 13.2257 26 10.8386 26Z"
                                    fill="#269447"
                            />
                            <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M43.8078 20.1924L31.4853 20.1924L29.1627 25.5472L22.8401 25.5472L34.582 0.450439L40.6465 0.450439L52.582 25.5472L46.1304 25.5472L43.8078 20.1924ZM41.8724 15.7408L37.6788 6.12786L33.4853 15.7408L41.8724 15.7408Z"
                                    fill="#269447"
                            />
                            <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M55.356 0.450439L61.485 0.450439L61.485 20.773L74.8398 20.773L74.8398 25.4827L55.356 25.5472L55.356 0.450439Z"
                                    fill="#269447"
                            />
                            <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M101.938 0.386963L90.4536 25.4837L84.3891 25.4837L72.9052 0.386962L79.5504 0.386962L87.6149 18.3225L95.8085 0.386963L101.938 0.386963Z"
                                    fill="#269447"
                            />
                            <path
                                    d="M110.339 25.4797L110.308 0.382935L104.179 0.390587L104.21 25.4874L110.339 25.4797Z"
                                    fill="#269447"
                            />
                        </svg>
                        <div class="create-order__card-phone__inner">
                            <label class="create-order__card-phone"> <a style="color: inherit" href="tel:+380441282810">+380 44 128 28 10</a></label>
                        </div>
                    </v-flex>

                    <v-flex xs1 sm1>
                        <v-btn flat icon color="" @click="cancel">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-title>

                <div class="create-order__scroll-container">
                    <v-container grid-list-md>
                        <v-layout row class="create-order__delivery-row">
                            <v-layout column class="create-order__delivery-col">
                                <v-flex>
                                    <span v-if="update && !copy" class="create-order__title">Редагування замовлення</span>
                                    <span v-else-if="!update && copy" class="create-order__title">Копіювати замовлення</span>
                                    <span v-else class="create-order__title">Оформлення замовлення</span>
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
                                            placeholder="Додайте коментар до замовлення"
                                    ></textarea>
                                    <div class="error__box">
                                        <span>{{ errors.comment }}</span>
                                    </div>
                                </v-flex>
                                <author :update="update" :history="model.history" />

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
                                                                    placeholder="ДД/ММ/РРРР"
                                                                    prepend-icon="event"
                                                                    readonly
                                                                    v-on="on"
                                                            />
                                                            <div class="error__box">
                                                                <span>{{ errors.delivery_date }}</span>
                                                            </div>
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
                                            </v-tab-item>
                                            <v-tab-item :key="2" value="random-date">
                                                <v-card flat>
                                                    <v-card-text> Наш менеджер додатково з вами погодить строки доставки замовлення</v-card-text>
                                                </v-card>
                                            </v-tab-item>
                                        </v-tabs-items>

                                        <v-text v-if="haveProductNoLeftovers">*звертаємо увагу, в замовленні присутні товари
                                            дату доступності котрих ми повідомимо додатково
                                        </v-text>
                                    </div>

                                </v-layout>


                            </v-layout>
                            <v-layout column class="create-order__delivery-col create-order__delivery-col_right">
                                <v-card variant="outlined">
                                    <div class="delivery-info">
                                        <div class="delivery-info__col">
                                            <div class="delivery-info_title">Ваше замовлення</div>
                                            <div v-if="!update && !copy" class="delivery-info_edit" @click="cancel">Редагувати</div>
                                            <div class="delivery-info_count">{{products.length}} товарів на суму</div>
                                        </div>
                                        <div class="delivery-info_price">Загальна сума <span> {{this.totalSum | price-break}}₴</span></div>
                                        <div v-if="model.budget_id" class="delivery-info_budget">Доступний бюджет <span> {{this.availableBudget | price-break}}₴</span></div>
                                        <div v-if="budgetExceeded" class="delivery-info_budget-info">
                                            Йой! Нажаль Ваше замовлення перевищує доступний залишок за бюдетом на <span> {{this.differenceBudget | price-break}}₴</span> !
                                            <div v-if="budget_restriction">Для продовження оформлення замовлення, будь-ласка, поверніться до корзини та відредагуйте замовлення</div>
                                        </div>
                                        <div v-if="budgetExceeded" class="delivery-info__edit-btn" @click="cancel">Редагувати замовлення</div>
                                        <div v-if="!update && !copy" :class="['delivery-info_btn', budgetExceeded && budget_restriction && 'blocked']" @click="createOrder">Підтвердити замовлення</div>
                                        <div v-else-if="!update && copy" class="delivery-info_btn" @click="handleDuplicateOrder">Копіювати замовлення</div>
                                        <div v-else class="delivery-info_btn" @click="updateOrder">Редагувати замовлення</div>
                                    </div>
                                </v-card>
                            </v-layout>
                        </v-layout>
                    </v-container>
                </div>
            </v-card>

        </v-dialog>
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
    import {mapActions} from 'vuex';
    import moment from "moment";
    // import CustomDatepicker from '@/components/custom-datepicker.vue'

    export default {
        name: "CreateOrder",
        props: {
            locationId: {
                type: Number,
                default: 0
            },
            dialog: {
                type: Boolean
            },
            products: {
                type: Array
            },
            id: {
                type: String
            },
            model: {
                type: Object
            },
            update: {
                type: Boolean
            },
            nonCatalog: {
                type: Boolean
            },
            copy: {
                type: Number,
                default: 0
            }
        },
        components: {
            // CustomDatepicker,
        },
        data: () => ({
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
            getMinDate() {
                const now = new Date(new Date().getTime() + 24 * this.minDateDelivery * 60 * 60 * 1000)
                const nowTime = now.getHours()*60+now.getMinutes();
                const dayNumber = moment(now).day();
                let endDate;
                if (dayNumber == 6) {
                    endDate = new Date(now.getTime() + 72 * 60 * 60 * 1000)
                } else if (dayNumber == 0) {
                    endDate = new Date(now.getTime() + 48 * 60 * 60 * 1000)
                } else {
                    if ( +nowTime < 930 ) {
                        endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
                    } else {
                        if (dayNumber == 5) {
                            endDate = new Date(now.getTime() + 96 * 60 * 60 * 1000)
                        } else {
                            endDate = new Date(now.getTime() + 48 * 60 * 60 * 1000)
                        }
                    }
                }
                return endDate.toISOString().slice(0, 10)
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
            dialog(e) {
                this.iterationProduct()
                if (this.update) {
                    if (!this.model.one_day_shipment) {
                        this.tab = 'random-date'
                    }
                }
                this.initLoad = true
                if (!e) {
                    let allInput = this.$refs.modal.$refs.content.querySelectorAll(
                        ".input-step"
                    )
                    allInput.forEach(e => {
                        e.classList.remove("activeStep")
                    })
                }
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
            if (!this.model.delivery_date) {
                // this.setDefaultDate();
            }
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
                    this.filterLocationList()
                })
        },
        mounted() {
        },
        methods: {
            ...mapActions("basket", ["setNewBasketProduct", "setIdProduct"]),
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
                let quantity = 0
                if (this.products.length) {
                    for (let i = 0; this.products.length > i; i++) {
                        summ += +this.products[i].total_sum
                        quantity += +this.products[i].quantity

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
                    this.countProduct = quantity
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
                    this.blockSubmit = true
                    this.loading(true)
                    if (this.tab == 'one-date') {
                        this.model.one_day_shipment = true
                    } else {
                        this.model.one_day_shipment = false
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
                            this.errors = errors
                        }
                    }).catch(err => {
                        this.loading(false)
                        this.blockSubmit = false
                        this.$loadingBus.$emit("snackbar", {
                            text: (err && err.response && err.response.data && err.response.data.message) || "Помилка при створенні замовлення",
                            color: "error"
                        })
                    })
                }
            },
            updateOrder() {
                if (this.tab == 'one-date') {
                    this.model.one_day_shipment = true
                } else {
                    this.model.one_day_shipment = false
                }
                this.$api.post("/order/update", this.model).then(response => {
                    let errors = []
                    if (response.data.success) {
                        this.cancel()
                        this.updateList()
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
