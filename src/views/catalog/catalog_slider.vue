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

        <div v-if="catalog_data && !categoryList.length && product_list" style="display: flex; flex-direction: column; align-items: flex-end">
          <v-dialog
            v-model="locationModal"
            :fullscreen="$store.getters['params/mobileView']"
            persistent
            max-width="400px"
          >
            <template v-slot:activator="{ on }">
              <div class="location__title">
                <div v-show="locationName" class="label">Локацiя:</div>
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
        </div>
      </div>

      <div v-if="categoryList.length" class="header-nav">

        <v-dialog
          v-model="locationModal"
          :fullscreen="$store.getters['params/mobileView']"
          persistent
          max-width="400px"
        >
          <template v-slot:activator="{ on }">
            <div class="header-nav__sort-location">
              <div v-show="locationName" class="label">Локацiя:</div>
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

        <div class="justify-self-end d-flex filters-box align-center">
          <v-menu
            v-if="
              (specification.length && $root.rbac.catalogShowBtn) ||
                ($root.rbac.orderShowBtn &&
                  specification.length &&
                  id !== undefined)
            "
            class="mr-2"
            offset-x
            bottom
            :close-on-content-click="false"
            nudge-bottom="40"
            nudge-left="-67"
            left
            content-class="action__td__drop setting__table__collumn radio__view-catalog"
          >
            <v-btn slot="activator" class="btn__setting__table header-nav__sort-filter">
              <i class="fa fa-filter"></i>
              <v-icon class="arrow-icon" color="#93A2DD">arrow_drop_down</v-icon>
            </v-btn>
            <v-list>
              <span>Налаштування каталога</span>
              <v-radio-group
                v-model="radiosSpecification"
                class="mt-0"
                hide-details
                :mandatory="false"
              >
                <v-list-tile>
                  <v-radio
                    label="Всi товари"
                    :value="false"
                    @change="specificationOnly"
                  />
                </v-list-tile>
                <v-list-tile>
                  <v-radio
                    label="З специфікації"
                    :value="true"
                    @change="specificationOnly"
                  />
                </v-list-tile>
              </v-radio-group>
            </v-list>
          </v-menu>
        </div>

        <div class="header-nav__sort">
          <div @click="openSortList" class="header-nav__sort-button">
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1C0 0.447715 0.447715 0 1 0H17C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2H1C0.447716 2 0 1.55228 0 1ZM0 8C0 7.44772 0.447715 7 1 7H11C11.5523 7 12 7.44772 12 8C12 8.55229 11.5523 9 11 9H1C0.447715 9 0 8.55229 0 8ZM0 15C0 14.4477 0.447715 14 1 14H7C7.55228 14 8 14.4477 8 15C8 15.5523 7.55228 16 7 16H1C0.447715 16 0 15.5523 0 15Z" fill="#BCBCBC"/>
            </svg>

            <div v-if="sort_item == null">
              Сортувати
            </div>
            <div v-else>
              {{sort_item.name}}
            </div>

            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.24283 3.82883C5.63335 4.21935 6.26652 4.21936 6.65704 3.82883L10.1929 0.292938C10.5834 -0.0975271 11.2165 -0.097528 11.6069 0.292937C11.9974 0.683403 11.9974 1.31647 11.6069 1.70694L6.65704 6.65683C6.26652 7.04736 5.63335 7.04735 5.24283 6.65683L0.292937 1.70694C-0.097528 1.31647 -0.0975279 0.683403 0.292938 0.292937C0.683403 -0.0975281 1.31647 -0.0975279 1.70694 0.292937L5.24283 3.82883Z" fill="#A4A4A5"/>
            </svg>
          </div>

          <div v-if="sort_item_open" class="header-nav__sort-list">
            <div @click="changeSort(item)" v-for="(item, index) in sort_list" :key="index"
                 :class="['header-nav__sort-list-item', sort_item && item.sort == sort_item.sort && item.orderBy == sort_item.orderBy && 'active', item.sort == 'DESC' ? 'desc' : 'asc']">
              {{item.name}}
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.82883 6.65658C4.21935 6.26606 4.21936 5.63289 3.82883 5.24237L0.292939 1.70648C-0.0975266 1.31601 -0.0975275 0.682941 0.292938 0.292476C0.683403 -0.09799 1.31647 -0.097989 1.70694 0.292476L6.65683 5.24237C7.04736 5.6329 7.04735 6.26606 6.65683 6.65658L1.70694 11.6065C1.31647 11.9969 0.683403 11.9969 0.292937 11.6065C-0.0975281 11.216 -0.0975278 10.5829 0.292938 10.1925L3.82883 6.65658Z" fill="#565656"/>
              </svg>
            </div>
          </div>
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
      <div v-if="catalog_data && categoryList.length">
        <div class="home__categories">
          <div class="home__slider-section-title">
            {{catalog_data.breadCrumbs[catalog_data.length - 1]}}
          </div>
          <div class="home__category-items">
            <div v-for="item in categoryList" :key="item.id" class="home__category-item">
              <a
                v-if="item.url"
                :href="item.url"
                :target="item.target_blank ? '_blank' : '_self'"
                class="home__category-item-container"
              >
                <div class="home__category-item-icon">
                  <img v-if="item.img_path" :src="item.img_path" :alt="item.name">
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M97.5 400l50-160 379.4 0-50 160-379.4 0zm190.7 48L477 448c21 0 39.6-13.6 45.8-33.7l50-160c9.7-30.9-13.4-62.3-45.8-62.3l-379.4 0c-21 0-39.6 13.6-45.8 33.7L80.2 294.4 80.2 96c0-8.8 7.2-16 16-16l138.7 0c3.5 0 6.8 1.1 9.6 3.2L282.9 112c13.8 10.4 30.7 16 48 16l117.3 0c8.8 0 16 7.2 16 16l48 0c0-35.3-28.7-64-64-64L330.9 80c-6.9 0-13.7-2.2-19.2-6.4L273.3 44.8C262.2 36.5 248.8 32 234.9 32L96.2 32c-35.3 0-64 28.7-64 64l0 288c0 35.3 28.7 64 64 64l192 0z"/></svg>
                </div>
                <div class="home__category-item-name" :class="{ 'red--text': item.highlight }">
                  {{item.name}}
                </div>
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.95635 7.07273C4.31194 6.68921 4.31194 6.09647 3.95635 5.71295L0.267086 1.73383C-0.0884996 1.3503 -0.0884997 0.757564 0.267086 0.374041L0.317407 0.319766C0.713125 -0.107042 1.38831 -0.107042 1.78403 0.319766L6.78435 5.71295C7.13994 6.09647 7.13994 6.68921 6.78435 7.07273L1.78403 12.4659C1.38831 12.8927 0.713126 12.8927 0.317408 12.4659L0.267087 12.4116C-0.0884989 12.0281 -0.0884992 11.4354 0.267087 11.0518L3.95635 7.07273Z" fill="#BCBCBC"/>
                </svg>
              </a>
              <router-link
                v-else
                class="home__category-item-container"
                :to="getUrlLinkCategory(item.code)"
              >
                <div class="home__category-item-icon">
                  <img v-if="item.img_path" :src="item.img_path" :alt="item.name">
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M97.5 400l50-160 379.4 0-50 160-379.4 0zm190.7 48L477 448c21 0 39.6-13.6 45.8-33.7l50-160c9.7-30.9-13.4-62.3-45.8-62.3l-379.4 0c-21 0-39.6 13.6-45.8 33.7L80.2 294.4 80.2 96c0-8.8 7.2-16 16-16l138.7 0c3.5 0 6.8 1.1 9.6 3.2L282.9 112c13.8 10.4 30.7 16 48 16l117.3 0c8.8 0 16 7.2 16 16l48 0c0-35.3-28.7-64-64-64L330.9 80c-6.9 0-13.7-2.2-19.2-6.4L273.3 44.8C262.2 36.5 248.8 32 234.9 32L96.2 32c-35.3 0-64 28.7-64 64l0 288c0 35.3 28.7 64 64 64l192 0z"/></svg>
                </div>
                <div class="home__category-item-name" :class="{ 'red--text': item.highlight }">
                  {{item.name}}
                </div>
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.95635 7.07273C4.31194 6.68921 4.31194 6.09647 3.95635 5.71295L0.267086 1.73383C-0.0884996 1.3503 -0.0884997 0.757564 0.267086 0.374041L0.317407 0.319766C0.713125 -0.107042 1.38831 -0.107042 1.78403 0.319766L6.78435 5.71295C7.13994 6.09647 7.13994 6.68921 6.78435 7.07273L1.78403 12.4659C1.38831 12.8927 0.713126 12.8927 0.317408 12.4659L0.267087 12.4116C-0.0884989 12.0281 -0.0884992 11.4354 0.267087 11.0518L3.95635 7.07273Z" fill="#BCBCBC"/>
                </svg>
              </router-link>
              <div v-if="item.children && item.children.length" class="home__category-item-list">
                <div class="home__category-item-list-container">
                  <div class="home__category-item-list-name">
                    {{item.name}}
                  </div>
                  <div class="home__menu-list">
                    <template v-for="ele in item.children">
                      <a
                        v-if="ele.url"
                        :key="ele.id"
                        :href="ele.url"
                        :target="ele.target_blank ? '_blank' : '_self'"
                        class="home__menu-list-item"
                        :class="{ 'red--text': ele.highlight }"
                      >
                        {{ele.name}}
                      </a>
                      <router-link
                        v-else
                        :key="ele.id"
                        :to="`/catalog/${getCategoryUUID}/${item.code}/${ele.code}`"
                        class="home__menu-list-item"
                        :class="{ 'red--text': ele.highlight }"
                      >
                        {{ele.name}}
                      </router-link>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="categoryList">
          <template v-for="(cat, index) in categoryList">
            <div
              v-if="!cat.is_custom && ((cat.products && cat.products.length) || (cat.products_filter && cat.products_filter.length))"
              :key="cat.id"
              class="home__slider-section"
            >
              <div class="home__slider-section-title">
                {{cat.name}}
              </div>

              <div v-if="cat.children && cat.children.length" class="home__slider-categories">
                <div
                  @click="changeActivePopularCategory(null, index)"
                  :class="['home__slider-category', cat.check_category == null && 'active']"
                >
                  Всі
                </div>
                <template v-for="(item, i) in cat.children">
                  <div
                    v-if="!item.url && !item.is_custom"
                    :key="item.id || i"
                    @click="changeActivePopularCategory(item.code, index)"
                    :class="['home__slider-category', cat.check_category == item.code && 'active']"
                  >
                    {{item.name}}
                  </div>
                </template>
              </div>

              <slider_tile
                :dataTable="cat.products_filter ? cat.products_filter : cat.products"
                :urlLink="getUrlLinkCategory(cat.code)"
              />
            </div>
          </template>
        </div>

      </div>

      <div v-if="catalog_data && !categoryList.length && product_list">
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
          @productData="productData"
          @eventSelected="eventSelected"
          @listUpdated="listUpdatedResponse"
        />
      </div>

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
    <div v-if="is_loading" id="page-loader">
      <svg class="spinner" width="122" height="122" viewBox="0 0 122 122" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#paint0_angular_8540_8389_clip_path)" data-figma-skip-parse="true"><g transform="matrix(0.0703846 0 0 0.0703846 61 60.8408)"><foreignObject x="-880.874" y="-880.874" width="1761.75" height="1761.75"><div xmlns="http://www.w3.org/1999/xhtml" style="background:conic-gradient(from 90deg,rgba(255, 255, 255, 1) 0deg,rgba(38, 148, 71, 1) 360deg);height:100%;width:100%;opacity:1"></div></foreignObject></g></g><path d="M61 4.41582C61 1.88912 58.9488 -0.177034 56.4292 0.0122753C45.9744 0.797794 35.8703 4.26786 27.1102 10.1212C17.0788 16.8239 9.26029 26.3508 4.64335 37.4971C0.026403 48.6434 -1.1816 60.9085 1.1721 72.7413C3.5258 84.5742 9.33548 95.4433 17.8665 103.974C26.3975 112.505 37.2666 118.315 49.0995 120.669C60.9323 123.022 73.1974 121.814 84.3437 117.197C95.49 112.581 105.017 104.762 111.72 94.7306C117.573 85.9705 121.043 75.8664 121.829 65.4116C122.018 62.892 119.952 60.8408 117.425 60.8408V60.8408C114.898 60.8408 112.871 62.8932 112.648 65.41C111.884 74.0529 108.959 82.3923 104.112 89.6471C98.4143 98.1738 90.3165 104.82 80.8421 108.744C71.3678 112.668 60.9425 113.695 50.8846 111.695C40.8267 109.694 31.5879 104.756 24.3365 97.5043C17.0852 90.253 12.1469 81.0142 10.1463 70.9563C8.14564 60.8983 9.17244 50.473 13.0968 40.9987C17.0212 31.5243 23.667 23.4265 32.1937 17.7291C39.4486 12.8816 47.7879 9.95707 56.4308 9.1925C58.9477 8.96986 61 6.94252 61 4.41582V4.41582Z" data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.14901961386203766,&#34;g&#34;:0.58039218187332153,&#34;b&#34;:0.27843138575553894,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[],&#34;transform&#34;:{&#34;m00&#34;:140.76922607421875,&#34;m01&#34;:1.2820600484020339e-11,&#34;m02&#34;:-9.3846130371093750,&#34;m10&#34;:-9.4865163901419747e-13,&#34;m11&#34;:140.76922607421875,&#34;m12&#34;:-9.5437898635864258},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"/>
        <defs>
          <clipPath id="paint0_angular_8540_8389_clip_path"><path d="M61 4.41582C61 1.88912 58.9488 -0.177034 56.4292 0.0122753C45.9744 0.797794 35.8703 4.26786 27.1102 10.1212C17.0788 16.8239 9.26029 26.3508 4.64335 37.4971C0.026403 48.6434 -1.1816 60.9085 1.1721 72.7413C3.5258 84.5742 9.33548 95.4433 17.8665 103.974C26.3975 112.505 37.2666 118.315 49.0995 120.669C60.9323 123.022 73.1974 121.814 84.3437 117.197C95.49 112.581 105.017 104.762 111.72 94.7306C117.573 85.9705 121.043 75.8664 121.829 65.4116C122.018 62.892 119.952 60.8408 117.425 60.8408V60.8408C114.898 60.8408 112.871 62.8932 112.648 65.41C111.884 74.0529 108.959 82.3923 104.112 89.6471C98.4143 98.1738 90.3165 104.82 80.8421 108.744C71.3678 112.668 60.9425 113.695 50.8846 111.695C40.8267 109.694 31.5879 104.756 24.3365 97.5043C17.0852 90.253 12.1469 81.0142 10.1463 70.9563C8.14564 60.8983 9.17244 50.473 13.0968 40.9987C17.0212 31.5243 23.667 23.4265 32.1937 17.7291C39.4486 12.8816 47.7879 9.95707 56.4308 9.1925C58.9477 8.96986 61 6.94252 61 4.41582V4.41582Z"/></clipPath></defs>
      </svg>
    </div>
    <error_page v-if="errorPageTrigger" />
  </div>
</template>

<script>
  import filterCategory from "./filterCategory"
  import catalog__table from "./catalog__table.vue"
  import catalog__tile from "./catalog__tile.vue"
  import slider_tile from "./slider_tile.vue"
  import error_page from "../404"
  import create_order from "@/views/orders/create-order"
  import moment from "moment"
  import { mapActions, mapGetters } from "vuex"
  // eslint-disable-next-line no-unused-vars
  import store from "../../store"

  export default {
    name: "Users",
    // eslint-disable-next-line vue/no-unused-components
    components: {create_order, filterCategory, error_page, slider_tile, catalog__tile },
    data() {
      return {
        sort_item_open: false,
        is_loading: false,
        product_list: [],
        catalog_data: null,
        categoryList: [],
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
        sort_item: null,
        sort_list: [
          {
            orderBy: "buy_price",
            name: "Ціна",
            sort: "DESC",
          },
          {
            orderBy: "buy_price",
            name: "Ціна",
            sort: "ASC",
          },
          {
            orderBy: "is_popular",
            name: "Популярні",
            sort: "DESC",
          },
          {
            orderBy: "is_popular",
            name: "Популярні",
            sort: "ASC",
          },
        ],
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
        const url = this.$route.fullPath;
        return url;
      }
    },
    mounted() {
      this.getCategoryData();
      this.getData();
    },
    watch: {
      radiosSpecification() {
        this.getData();
      },
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

        if(this.location_id != e)
        {
          this.location_id = e
          this.loadListLocation()
        }
      },
      $route(to, from) {
        if (to != from) {
          this.getCategoryData();
          this.getData();
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

      if(this.idProduct.order_id !== undefined)
      {
        this.changeID(this.idProduct.order_id)
      }
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
      openSortList() {
        this.sort_item_open = !this.sort_item_open
      },
      changeSort(sort) {
        this.sort_item = sort
        this.sort_item_open = false
        this.pagination.page = 1
        this.getData()
      },
      getUrlLinkCategory(cat) {
        const category1 = this.$route.params.category_1;
        const category2 = this.$route.params.category_2;

        let url = `/catalog`

        if (category1 != undefined) {
          url += `/${category1}`
        }
        if (category2 != undefined) {
          url += `/${category2}`
        }

        url += `/${cat}`

        return url
      },
      async changeActivePopularCategory(category, idx) {
        const current = this.categoryList[idx]
        if (!current) return

        // сразу обновим check_category заменой элемента
        this.$set(this.categoryList, idx, { ...current, check_category: category })

        if (category == null) {
          const cur2 = this.categoryList[idx]
          this.$set(this.categoryList, idx, { ...cur2, products_filter: null })
          return
        }

        const payload = {
          pagination: { rowsPerPage: 24, page: 1, sortBy: "sort" },
          location_id: this.location_id,
          category
        }

        try {
          this.is_loading = true
          const res = await this.$api.post("/search/search", payload)
          const items = (res.data.model || []).map(it => ({
            ...it,
            multiplicity_switch: !!this.newBasketProduct.some(
              p => p.id === it.id && p.is_strict_multiplicity
            )
          }))

          const cur3 = this.categoryList[idx]
          this.$set(this.categoryList, idx, { ...cur3, products_filter: items })
          this.is_loading = false
        } catch (e) {
          this.is_loading = false
          console.error(e)
          const cur4 = this.categoryList[idx]
          this.$set(this.categoryList, idx, { ...cur4, products_filter: null })
        }
      },

      getData() {
        const data = {
          category: this.getCategoryUUID,
          location_id: this.location_id,
          specification_only: this.radiosSpecification,
        }
        data.pagination = {
          page: 1,
          rowsPerPage: 24,
        }
        if(this.sort_item) {
          data.pagination.sort = this.sort_item.sort
          data.pagination.orderBy = this.sort_item.orderBy
        }

        this.is_loading = true
        this.$api.post(`/search/get-category-page`, data).then(res => {
          console.log(res)
          const data = res.data
          const category = res.data.categoryListNext

          this.catalog_data = data

          if (res.data.categoryListNext && res.data.categoryListNext.length) {
            category.forEach((item, index) => {
              const data = item.products
              item.check_category = null
              item.products_filter = null
              if (data && data.length) {
                for(let i = 0; data.length > i; i++) {
                  data[i].multiplicity_switch = false

                  if(this.newBasketProduct && this.newBasketProduct.length) {
                    this.newBasketProduct.find(product => {
                      if(product.id === data[i].id) {
                        if (product.is_strict_multiplicity) {
                          data[i].multiplicity_switch = true
                        }
                      };
                    });
                  }
                }
              }
            })
          }

          this.is_loading = false
          this.categoryList = category
          console.log(category, 'category')
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

<style scoped type="scss">
  .header-nav {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 0 0;
    flex-wrap: wrap;
  }

  .header-nav__sort-location {
    display: flex;
    align-items: center;
    padding: 0 0 0 10px;
    border: 1px solid #E3E3E3;
    border-radius: 4px;
    cursor: pointer;
    height: 43px;
    margin-right: .5rem;
    margin-bottom: .5rem;
  }

  .header-nav__sort-location .name {
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .header-nav__sort-location .v-btn {
    margin: 0 0 0 5px;
  }

  .header-nav__sort-filter {
    height: 43px;
    display: flex;
    background-color: transparent !important;
    border: 1px solid #E3E3E3;
    border-radius: 4px;
    cursor: pointer;
    padding: 0 10px;
    margin: 0 0 .5rem 0 !important;
  }

  .header-nav__title {
    font-size: 36px;
    font-weight: 700;
  }

  .header-nav__total {
    padding-top: 3px;
    font-size: 16px;
    color: #565656;
    padding-left: 50px;
  }

  .header-nav__sort {
    position: relative;
  }

  .header-nav__sort-button {
    margin-bottom: .5rem;
    padding: 10px 15px;
    border: 1px solid #E3E3E3;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .header-nav__sort-button div {
    color: #4B4B4A;
    font-size: 14px;
    padding: 0 15px 0 15px;
  }

  .header-nav__sort-list {
    position: absolute;
    right: 0;
    min-width: 200px;
    z-index: 10;
    top: 100%;
    padding: 10px;
    border: 1px solid #E3E3E3;
    background: #fff;
  }

  .header-nav__sort-list-item {
    font-size: 15px;
    padding-bottom: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-nav__sort-list-item.desc svg {
    transform: rotate(90deg);
  }

  .header-nav__sort-list-item.asc svg {
    transform: rotate(-90deg);
  }

  .header-nav__sort-list-item:hover, .header-nav__sort-list-item.active {
    color: #269447;
  }

  .head__iconBtn {
    cursor: pointer;
  }

  .home__banners {
    position: relative;
    aspect-ratio: 24/5;
  }
  .home__categories {
    padding-top: 30px;
  }
  .home__slider-categories {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px 0;
    margin-left: 10px;
  }
  .home__slider-category {
    color: #737373;
    padding: 5px 10px;
    border-radius: 8px;
    background: #F6F6F8;
    cursor: pointer;
    transition: all ease-in-out .3s;
    margin-right: 5px;
    margin-bottom: 5px;
    white-space: nowrap;

    &:hover {
      transition: all ease-in-out .3s;
      background: #dfdfe1;
    }

    &.active {
      background: #269447;
      transition: all ease-in-out .3s;
      color: #fff;

      &:hover {
        transition: all ease-in-out .3s;
        background: #1f773b;
      }
    }
  }
  .home__category-items {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
  }
  .home__category-item {
    background: #fff;
    border-radius: 8px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    width: calc(25% - 10px);
    margin-right: 10px;
    padding: 18px 20px 18px 18px;
    transition: all ease-in-out .3s;
    margin-bottom: 10px;
    position: relative;

    svg {
      margin-left: auto;
      path {
        transition: all ease-in-out .3s;
      }
    }

    .home__category-item-container {
      display: flex;
      align-items: center;
      text-decoration: none;
      width: 100%;
    }

    &:hover {
      background: #38AB5B;
      transition: all ease-in-out .3s;

      .home__category-item-name {
        color: #fff;
        transition: all ease-in-out .3s;
      }

      svg {
        path {
          fill: #fff;
          transition: all ease-in-out .3s;
        }
      }

      .home__category-item-list {
        display: block;
      }
    }
    @media (max-width: 1200px) {
      width: calc(48% - 10px);
    }
    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .home__category-item-list {
    display: none;
    padding-top: 10px;
    position: absolute;
    top: 100%;
    left: 0;
    width: 300px;
    z-index: 10;
  }

  .home__category-item-list-container {
    background: #fff;
    padding: 10px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  .home__category-item-list-name {
    font-size: 20px;
    padding-bottom: 10px;
    font-weight: 700;
  }
  .home__menu-list-item {
    display: block;
    color: #4b4b4b;
    text-decoration: none;
    padding-bottom: 10px;

    &:hover {
      color: #38AB5B;
      text-decoration: none;
    }
  }

  .home__category-item-icon {
    width: 64px;
    height: 64px;
    min-width: 64px;
    min-height: 64px;
    overflow: hidden;
    border-radius: 50px;
    background: #e9e9e9;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;

    svg {
      width: 32px;
      height: 32px;
      min-width: 32px;
      min-height: 32px;
      margin: 0;

      path {
        fill: #434343!important;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .home__category-item-name {
    font-size: 14px;
    font-weight: 600;
    transition: all ease-in-out .3s;
    color: #222222;
    word-break: normal;
    overflow-wrap: normal;
    white-space: normal;
    hyphens: none;

    &.red--text {
      color: #e53935;
    }
  }
  .home__slider-section {
    padding-top: 50px;
  }

  .home__slider-section-title {
    font-size: 36px;
    font-weight: 600;
    margin-left: 10px;
  }

  .home__banners .banner-slider {
    overflow: hidden;
    aspect-ratio: 24/5;
    height: auto !important;
  }

  /deep/.home__banners .v-window__container {
    height: auto !important;
    aspect-ratio: 24/5;
  }

  /deep/.home__banners .v-carousel__item {
    height: auto !important;
    aspect-ratio: 24/5;
  }

  .banner-slide {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }

  .banner-slide-button {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 10px 30px;
    border-radius: 5px;
    background: #269447;
    color: #fff;
    text-transform: uppercase;

    &:hover {
      background: #206e37;
    }
  }

  .banner-slider >>> .v-carousel__controls {
    background: transparent !important;
  }

  .banner-slider >>> .v-btn--icon.v-carousel__controls__item {
    opacity: 0.55;
    transform: scale(0.95);
    width: 30px;
    height: 4px;
    border-radius: 50px;
    margin: 0 2px;
    background: #fff;

    &::before {
      display: none;
    }

    .v-btn__content {
      display: none;
    }
  }

  .banner-slider >>> .v-btn--icon.v-carousel__controls__item.v-btn--active {
    opacity: 1;
    transform: scale(1.15);
  }

  .slider__header-nav {
    margin: 0 5px;
    cursor: pointer;
    height: 40px;
    width: 40px;
    background: #dbdbdd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all ease-in-out .3s;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    opacity: 0.5;

    &:hover {
      opacity: 1;
      background: #b4b4b6;
      transition: all ease-in-out .3s;
    }

    &.prev {
      svg {
        transform: rotate(180deg);
      }
      left: 10px;
    }

    &.next {
      right: 10px;
    }

    &.disabled {
      opacity: 0.5;
      cursor: auto;
    }
  }
  .slider__header-button {
    margin-right: 10px;
    color: #38AB5B;
    font-size: 14px;
    cursor: pointer;
    padding: 5px 10px;
    height: 40px;
    display: flex;
    align-items: center;
    background: #F6F6F8;
    border-radius: 8px;
    transition: all ease-in-out .3s;

    &:hover {
      background: #dadadc;
      transition: all ease-in-out .3s;
    }
  }
  .slider__header {
    padding-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
  }
  #page-loader {
    position: fixed;
    inset: 0;
    background: rgba(255,255,255,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .spinner {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

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

</style>
