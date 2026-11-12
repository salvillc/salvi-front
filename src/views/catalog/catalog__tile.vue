<template>
  <div>
    <div v-if="!noResult">

      <div v-if="popularCategory.length" class="home__slider-categories">
        <div
          @click="changeActivePopularCategory(null)"
          :class="['home__slider-category', activePopularCategory == null && 'active']"
        >
          Всі
        </div>
        <div
          @click="changeActivePopularCategory(item.category.code)"
          v-for="(item, index) in popularCategory"
          :key="index"
          :class="['home__slider-category', activePopularCategory == item.category.code && 'active']"
        >
          {{item.category.name}}
        </div>
      </div>

      <div class="header-nav">
        <div v-if="categoryName" class="header-nav__title">
          {{categoryName}}
        </div>
        <div v-if="categoryName" class="header-nav__total">
           {{total_items}} {{total_items < 2 ? 'товар' : 'товари'}}
        </div>

        <div v-if="search.length == 0" class="header-nav__sort">
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

      <v-dialog
              v-model="dialogInput"
              content-class="dialogInput"
              dark
              max-width="200px"
      >
        <v-card>
          <v-card-title style="line-height: 16px">
            <span>Кількість:</span>
            <b style="font-size: 16px; color: white">{{ summ__prod.join("") }}</b>
          </v-card-title>
          <v-card-text style="height: 240px;">
            <v-btn fab small dark color="teal" @click="num__input(1)">
              <span>1</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(2)">
              <span>2</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(3)">
              <span>3</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(4)">
              <span>4</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(5)">
              <span>5</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(6)">
              <span>6</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(7)">
              <span>7</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(8)">
              <span>8</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(9)">
              <span>9</span>
            </v-btn>
            <v-btn fab small dark color="teal" @click="num__input(0)">
              <span>0</span>
            </v-btn>

            <v-btn fab small dark color="teal" @click="summ__prod = ['']">
              <v-icon>delete_forever</v-icon>
            </v-btn>
            <v-btn fab small dark color="teal" @click="summ__prod.splice(-1, 1)">
              <v-icon>backspace</v-icon>
            </v-btn>
          </v-card-text>
          <v-card-actions style="justify-content: space-around">
            <v-btn color="#fff" small icon flat @click="closeDialogInput">
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn color="#19B200" small icon flat @click="saveQuality">
              <v-icon>check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="catalog__layout">
        <aside v-if="!hasFilters && !hasRadiosSpecification && categorySearch && categorySearch.length && !searchHasCategory" class="catalog__filters">
          <div class="catalog__filters-head">
            <span class="catalog__filters-title-info">
              Для відображення фільтрів оберіть категорію
            </span>
          </div>
          <div v-if="categorySearch.length" class="filter-group-container">
            <router-link
              v-for="(item, index) in categorySearch"
              :key="index" :to="getCategoryButton(item.name, item.path)"
              class="filter-group__link">
              {{item.name}}
            </router-link>
          </div>
        </aside>
        <aside v-if="hasFilters || hasRadiosSpecification" class="catalog__filters">
          <div class="catalog__filters-head">
            <span class="catalog__filters-title">Фільтри</span>
            <span v-if="activeFiltersCount || radiosSpecification" class="catalog__filters-reset" @click="resetFilters">Скинути</span>
          </div>
          <div v-if="hasRadiosSpecification" class="filter-group-container">
            <div class="filter-group">
              <div class="filter-group__body">
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    :checked="radiosSpecification"
                    @change="toggleFilterValueSpec"
                  />
                  <span class="filter-checkbox__box"></span>
                  <span class="filter-checkbox__label">Товари зі специфікації</span>
                </label>
              </div>
            </div>
          </div>

          <div v-if="hasFilters">
            <div v-for="group in groupFilters" :key="group.id" class="filter-group-container">
              <div v-if="group.values && group.values.length" class="filter-group">
                <div class="filter-group__header" @click="toggleGroup(group.id)">
                  <span>{{ group.name }}</span>
                  <svg :class="['filter-group__arrow', expandedGroups[group.id] && 'open']" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#A4A4A5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div v-show="expandedGroups[group.id]" class="filter-group__body">
                  <label v-for="val in group.values" :key="val.id" class="filter-checkbox">
                    <input
                            type="checkbox"
                            :checked="isChecked(group.id, val.id)"
                            @change="toggleFilterValue(group.id, val.id)"
                    />
                    <span class="filter-checkbox__box"></span>
                    <span class="filter-checkbox__label">{{ val.value }}</span>
                    <span class="filter-checkbox__count">{{ val.count }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </aside>

        <div v-if="hasFilters || hasRadiosSpecification" class="catalog__filters-mobile-btn" @click="filtersMobileOpen = true">
          <svg width="16" height="14" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 1C0 0.447715 0.447715 0 1 0H17C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2H1C0.447716 2 0 1.55228 0 1ZM0 8C0 7.44772 0.447715 7 1 7H11C11.5523 7 12 7.44772 12 8C12 8.55229 11.5523 9 11 9H1C0.447715 9 0 8.55229 0 8ZM0 15C0 14.4477 0.447715 14 1 14H7C7.55228 14 8 14.4477 8 15C8 15.5523 7.55228 16 7 16H1C0.447715 16 0 15.5523 0 15Z" fill="#fff"/>
          </svg>
          <span>Фільтри</span>
          <span v-if="activeFiltersCount" class="catalog__filters-mobile-btn__badge">{{ activeFiltersCount }}</span>
        </div>

        <div class="catalog__content">
          <div
                  v-if="dataTable.length == 0 && !loadingProduct"
                  class="default-title__card"
          >
            <span class="titleNoData">Немає даних</span>
          </div>

          <div class="catalog__tile">
            <div v-for="item in 12" v-show="loadingProduct" class="item">
              <CardLoad :key="item" />
            </div>
        <div
                v-for="(item, index) in dataTable"
                v-show="!loadingProduct"
                :key="index"
                class="item"
                :class="{ add: btnId(item), 'no-available': item.deleted }"
                @mouseleave="hoverCatalog = -1"
                @mouseover="hoverItem(index)"
        >
          <div class="item__head">
            <div v-if="item.is_popular && !item.deleted" class="item__top">Топ продажів</div>
            <v-tooltip v-if="item.is_temperature_conditions " top max-width="320px">
              <span>Товар вимагає дотримання температурного режиму зберігання</span>
              <span slot="activator" class="icon__isTemp">
                <font-awesome-icon :icon="['fas', 'temperature-low']" />
              </span>
            </v-tooltip>
            <v-badge
                    v-if="item.images.length"
                    class="imgBarge__custom img__display"
                    overlap
                    color="green"
            >
              <template v-slot:badge>
                <span v-if="item.images.length > 1">{{
                  item.images.length
                }}</span>
              </template>
              <img
                      v-if="showImgDefault"
                      class="default"
                      src="/images/Spinner.gif"
                      alt="Завантаження"
              />
              <img
                      v-if="showImg && item.img"
                      :data-src="item.img"
                      class="lazyload"
                      style="cursor: zoom-in"
                      onload="this.classList.add('finishLoad')"
                      @click="openImg(item.images, item.name)"
              />
            </v-badge>
            <svg
                    v-if="!showImg && !item.img"
                    class="img__display"
                    xmlns="http://www.w3.org/2000/svg"
                    width="260"
                    height="260"
                    viewBox="0 0 260 260"
                    fill="none"
            >
              <rect width="260" height="260" fill="#E3E3E3" />
              <rect x="55" y="88" width="150" height="100" rx="10" fill="white" />
              <rect x="90" y="72" width="80" height="100" rx="10" fill="white" />
              <rect
                      x="110"
                      y="118"
                      width="40"
                      height="40"
                      rx="20"
                      fill="#E3E3E3"
              />
              <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M105 138C105 151.807 116.193 163 130 163C143.807 163 155 151.807 155 138C155 124.193 143.807 113 130 113C116.193 113 105 124.193 105 138ZM130 108C113.431 108 100 121.431 100 138C100 154.569 113.431 168 130 168C146.569 168 160 154.569 160 138C160 121.431 146.569 108 130 108Z"
                      fill="#E3E3E3"
              />
            </svg>
          </div>
          <div class="item__body">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ item.sku }}</div>
              <span slot="activator" class="number">{{
                item.sku | truncate(20, "...")
              }}</span>
            </v-tooltip>

            <v-tooltip max-width="320px" bottom z-index="101">
              <span slot="activator" class="name">{{ item.name }}</span>
              <div class="wrap-text">{{ item.name }}</div>
            </v-tooltip>
            <div class="chip">
              <router-link :to="item.category_url" class="chip__item">{{ item.category.name }}</router-link>
            </div>

            <div v-if="!item.deleted" class="price__wrap">
              <div class="price">
                <template v-if="item.discount_price && item.discount_price != '0.00'">
                  <span class="new-price">{{ item.price }} &#8372; </span>
                  <span class="old">{{ item.discount_price }} &#8372; </span>
                </template>
                <span v-else>{{ item.price }} &#8372; </span>
                <v-tooltip v-if="item.isSpecificationProduct" top max-width="320px">
                  <span>Товар зi спецiфiкацii</span>
                  <span slot="activator" class="icon__isSpec">
                    <font-awesome-icon :icon="['fas', 'tag']" />
                  </span>
                </v-tooltip>
              </div>
              <div class="multiplicity__wrap">
                <div v-if="item.multiplicity > 1" class="multiplicity__container">
                  <v-tooltip max-width="320px" bottom z-index="101">
                    <span slot="activator" class="multiplicity__info-icon">?</span>
                    <div v-if="item.strict_multiplicity" class="wrap-text">Товар можливо замовити лише кратно упаковці</div>
                    <div v-if="!item.strict_multiplicity && item.multiplicity_switch" class="wrap-text">Товар можливо замовити кратно упаковці</div>
                    <div v-if="!item.strict_multiplicity && !item.multiplicity_switch" class="wrap-text">Товар можливо замовити кратно упаковці</div>
                  </v-tooltip>

                  <div
                      v-if="!item.strict_multiplicity"
                      @click="handleChangeMultiplicity(index)"
                      :class="['multiplicity__toggle', item.multiplicity_switch && 'active']"
                  >
                    <div class="multiplicity__toggle-button"></div>
                    <div class="multiplicity__toggle-count">{{ item.multiplicity }}</div>
                  </div>

                  <div
                      v-if="item.strict_multiplicity"
                      :class="['multiplicity__toggle', 'active no-pointer']"
                  >
                    <div class="multiplicity__toggle-count">{{ item.multiplicity }}</div>
                  </div>
                </div>

                <div class="multiplicity__unit" v-if="item.unit">
                  {{item.unit.name}}
                </div>
              </div>
            </div>

            <div v-else class="price">
              <span style="color: #F24949; font-size: 14px">
                Товару немає в наявностi
              </span>
            </div>

            <div v-if="!item.deleted" class="buttons">
              <transition name="scaleBtn">
                <v-btn
                        v-if="!btnId(item) && canAddToCart(item)"
                        class="btnAdd"
                        v-class="{'d-none': canAddToCart(item)}"
                        flat
                        icon
                        color="#2A8B1A"
                        @click="addToCart(item)"
                >
                  <v-icon color="#fff">add_shopping_cart</v-icon>
                </v-btn>
              </transition>

              <div class="quantity-section" v-if="!canAddToCart(item)">
                <button class="minus-btn" @click="changeQuantity(item, 'remove', index, item.id)">
                  <v-icon color="#4caf50">remove</v-icon>
                </button>

                <input type="number" name="item-quantity" :value="getProductCartQty(item.id)" :data-quantity="getProductCartQty(item.id)" @mouseleave="getProductCartQty(item.id) != $event.target.value ? changeQuantity(item, $event.target.value, index, item.id) : ''" @change="changeQuantity(item, $event.target.value, index, item.id)">

                <button class="plus-btn" @click="changeQuantity(item, 'add', index, item.id)">
                  <v-icon color="#4caf50">add</v-icon>
                </button>
              </div>

              <v-btn
                      v-if="!canAddToCart(item)"
                      class="removeItem"
                      icon
                      flat
                      color="#CCCCCC"
                      @click="deleteItemNewBasket(item, index)"
              >
                <v-icon color="#CCCCCC">delete_outline</v-icon>
              </v-btn>
            </div>

            <div class="delivery" v-if="!item.deleted">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              	 viewBox="0 0 100.354 100.352" style="enable-background:new 0 0 100.354 100.352;" xml:space="preserve">
              <path fill="#262447" d="M94.384,49.638h-7.759V36.544c0-0.829-0.672-1.5-1.5-1.5H60.824V21.977c0-0.829-0.672-1.5-1.5-1.5H5.618
              	c-0.829,0-1.5,0.671-1.5,1.5v49.185c0,0.828,0.671,1.5,1.5,1.5h12.538c0.52,3.867,3.832,6.861,7.838,6.861s7.318-2.994,7.838-6.861
              	h25.492h9.686c0.52,3.867,3.834,6.861,7.844,6.861s7.324-2.994,7.845-6.861h9.686c0.828,0,1.5-0.672,1.5-1.5V51.138
              	C95.884,50.309,95.212,49.638,94.384,49.638z M25.994,76.523c-2.711,0-4.917-2.207-4.917-4.92s2.206-4.92,4.917-4.92
              	s4.917,2.207,4.917,4.92S28.706,76.523,25.994,76.523z M25.994,63.683c-3.695,0-6.797,2.549-7.666,5.979H7.118V23.477h50.706v13.067
              	v14.594v18.523H33.661C32.792,66.232,29.689,63.683,25.994,63.683z M76.854,76.523c-2.715,0-4.923-2.207-4.923-4.92
              	s2.208-4.92,4.923-4.92s4.924,2.207,4.924,4.92S79.568,76.523,76.854,76.523z M92.884,69.661h-8.357
              	c-0.87-3.43-3.975-5.979-7.673-5.979s-6.803,2.549-7.672,5.979h-8.357V51.138V38.044h22.801v13.094c0,0.828,0.672,1.5,1.5,1.5h7.759
              	V69.661z"/>
              </svg>
              <span v-if="!canAddToCart(item)">
                <span class="delivery-info">{{getDeliveryInfo(item, getProductCartQty(item.id))}}</span>
              </span>

              <span v-else>
                <span class="delivery-info">{{getDeliveryInfo(item, item.multiplicity, true)}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

<!--      <v-pagination-->
<!--              v-if="dataTable.length > 0"-->
<!--              v-model="pagination.page"-->
<!--              :length="total_pages"-->
<!--              :total-visible="7"-->
<!--              color="#2a8b1a"-->
<!--      />-->

      <div class="load-more">
        <div class="load-more__title">
          {{total_loaded}} з {{total_items}} товарів
        </div>
        <div class="load-more__line">
          <div class="load-more__line-progress" :style="{width: total_loaded ? ( total_loaded / total_items * 100) + '%' : '0%'}"></div>
        </div>
        <div v-if="pagination.page < total_pages" @click="loadMoreProduct" class="load-more__button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.84662 3.12367C3.62307 2.72119 3.70927 2.21278 4.08 1.93979C5.78953 0.680986 7.86325 -0.0029712 10 9.70266e-06C15.523 9.70266e-06 20 4.47701 20 10C20 11.5654 19.6402 13.0469 18.9992 14.366C18.6766 15.0299 17.7731 14.9899 17.4146 14.3447L15.8257 11.4858C15.4553 10.8192 15.9373 10 16.6998 10H18C18.0001 8.43163 17.5392 6.89781 16.6747 5.58927C15.8101 4.28072 14.5799 3.25517 13.1372 2.64013C11.6944 2.0251 10.1027 1.84771 8.55996 2.13003C7.4334 2.33618 6.36923 2.78082 5.43649 3.42862C4.91219 3.79276 4.15657 3.68172 3.84662 3.12367ZM16.1534 16.8763C16.3769 17.2788 16.2907 17.7872 15.92 18.0602C14.2105 19.319 12.1368 20.003 10 20C4.477 20 0 15.523 0 10C0 8.43465 0.359833 6.95307 1.00078 5.63399C1.32336 4.97013 2.22689 5.01014 2.58543 5.65529L4.17428 8.51424C4.54471 9.18077 4.06275 10 3.3002 10H2C1.99987 11.5684 2.46075 13.1022 3.32534 14.4108C4.18992 15.7193 5.42007 16.7449 6.86282 17.3599C8.30557 17.9749 9.89729 18.1523 11.44 17.87C12.5666 17.6638 13.6308 17.2192 14.5635 16.5714C15.0878 16.2073 15.8434 16.3183 16.1534 16.8763Z" fill="#269447"/>
          </svg>
          Показати ще {{ Math.max(0, Math.min(pagination.rowsPerPage, total_items - total_loaded)) }} товарів
        </div>
      </div>
        </div>
      </div>

      <v-dialog
              v-model="filtersMobileOpen"
              fullscreen
              content-class="catalog__filters-modal"
              transition="dialog-bottom-transition"
      >
        <div class="catalog__filters-modal-inner">
          <div class="catalog__filters-modal-header">
            <span>Фільтри</span>
            <v-btn icon flat @click="filtersMobileOpen = false">
              <v-icon>close</v-icon>
            </v-btn>
          </div>

          <div class="catalog__filters-modal-body">
<!--            <div v-if="priceFilterObj" class="filter-group">-->
<!--              <div class="filter-group__header" @click="toggleGroup('price')">-->
<!--                <span>{{ priceFilterObj.name }}</span>-->
<!--                <svg :class="['filter-group__arrow', expandedGroups['price'] && 'open']" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                  <path d="M1 1L5 5L9 1" stroke="#A4A4A5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                </svg>-->
<!--              </div>-->
<!--              <div v-show="expandedGroups['price']" class="filter-group__body filter-group__body&#45;&#45;price">-->
<!--                <div class="filter-price__inputs">-->
<!--                  <input-->
<!--                          type="number"-->
<!--                          class="filter-price__input"-->
<!--                          :placeholder="String(priceFilterObj.min)"-->
<!--                          v-model.number="priceSelected.min"-->
<!--                          @change="applyFilters"-->
<!--                  />-->
<!--                  <span class="filter-price__divider">—</span>-->
<!--                  <input-->
<!--                          type="number"-->
<!--                          class="filter-price__input"-->
<!--                          :placeholder="String(priceFilterObj.max)"-->
<!--                          v-model.number="priceSelected.max"-->
<!--                          @change="applyFilters"-->
<!--                  />-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->

            <div v-if="hasRadiosSpecification" class="filter-group-container">
              <div class="filter-group">
                <div class="filter-group__body">
                  <label class="filter-checkbox">
                    <input
                      type="checkbox"
                      :checked="radiosSpecification"
                      @change="toggleFilterValueSpec"
                    />
                    <span class="filter-checkbox__box"></span>
                    <span class="filter-checkbox__label">Товари зі специфікації</span>
                  </label>
                </div>
              </div>
            </div>

            <div v-if="hasFilters">
              <div v-for="group in groupFilters" :key="'m-' + group.id" class="filter-group-container">
                <div v-if="group.values && group.values.length" class="filter-group">
                  <div class="filter-group__header" @click="toggleGroup(group.id)">
                    <span>{{ group.name }}</span>
                    <svg :class="['filter-group__arrow', expandedGroups[group.id] && 'open']" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="#A4A4A5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div v-show="expandedGroups[group.id]" class="filter-group__body">
                    <label v-for="val in group.values" :key="'m-' + val.id" class="filter-checkbox">
                      <input
                              type="checkbox"
                              :checked="isChecked(group.id, val.id)"
                              @change="toggleFilterValue(group.id, val.id)"
                      />
                      <span class="filter-checkbox__box"></span>
                      <span class="filter-checkbox__label">{{ val.value }}</span>
                      <span class="filter-checkbox__count">{{ val.count }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="catalog__filters-modal-footer">
            <button
                    v-if="activeFiltersCount || radiosSpecification"
                    class="catalog__filters-modal-reset"
                    @click="resetFilters"
            >
              Скинути
            </button>
            <button class="catalog__filters-modal-apply" @click="filtersMobileOpen = false">
              Показати {{ total_items }} товарів
            </button>
          </div>
        </div>
      </v-dialog>

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

      <v-dialog v-model="dialogImg" width="fit-content">
        <v-card>
          <v-card-title>
            <span class="headline image-modal">{{
              imgSliderName
            }}</span>
            <v-spacer />
            <v-flex xs1 sm1>
              <v-btn flat icon color="" @click="dialogImg = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-flex>
          </v-card-title>
          <div class="silerModal">
            <!--<el-carousel-->
                    <!--:arrow="imgSlider.length <= 1 ? 'never' : 'hover'"-->
                    <!--height="250px"-->
            <!--&gt;-->
              <!--<el-carousel-item v-for="(src, i) in imgSlider" :key="i">-->
                <img v-if="imgSlider[0]" :src="imgSlider[0].url" class="img__slider" />
              <!--</el-carousel-item>-->
            <!--</el-carousel>-->
          </div>
        </v-card>
      </v-dialog>
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
    </div>
    <div v-else>
      <p class="search__no-result-text">
        Нажаль, за вашим запитом {{ this.$route.query.query }} ми нічого не знайшли :(
      </p>
      <p class="search__no-result-text">
        Спробуйте інший запит
      </p>
      <p class="search__no-result-text">
        Для продовження роботи перейдіть в необхідний вам розділ
      </p>
      <div class="search__no-result-buttons">
        <a href="/catalog" class="search__no-result-button button button__yellow">
          до каталогу
        </a>
        <a href="/orders" class="search__no-result-button button button__yellow">
          до списку замовлень
        </a>
      </div>
    </div>
    <ModalExceeds :item="itemExceeds" :close="itemExceedsClose" />
    <div v-if="more_loading" class="preloader"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import CardLoad from "../../components/CardLoad"
import ModalExceeds from "../../components/modalExceeds"
import moment from "moment"
import 'lazysizes'
import router from "../../router";

export default {
  name: "CatalogTile",
  components: { CardLoad, ModalExceeds },
  props: [
    "search",
    "isActive",
    "filterUuid",
    "listUpdate",
    "id",
    "locationId",
    "canLoad",
    "categorySearch",
    // "radiosSpecification",
    "deliveryDate",
    "dateFilterWithNoDate",
    "categoryName"
  ],
  data: () => ({
    fetchScheduled: false,
    more_loading: false,
    sort_item_open: false,
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
    radiosSpecification: false,
    hasRadiosSpecification: false,
    popularCategory: [],
    activePopularCategory: null,
    hoverCatalog: -1,
      noResult: false,
    dataTable: [],
    pagination: {
      sortBy: "sort",
      rowsPerPage: 32,
      page: 1
    },
      itemExceeds: null,
    total_items: 0,
    total_loaded: 0,
    total_pages: 0,
    loading: false,
    showImg: false,
    showImgDefault: true,
    selectedChild: [],
    dialogInput: false,
    summ__prod: [],
    snack: false,
    snackColor: "",
    snackText: "",
    quantity: "",
    idProd: -1,
    valProd: "",
    indexProd: -1,
    dialogImg: false,
    imgSlider: [],
    imgSliderName: "Зображення",
    loadingProduct: true,
    myDialog: false,
    dialogText: "",
    dialogItem: {},
    dialogHeadline: "",
      btnClose: {name: "Скасувати", class: "button__blue"},
      btnApprove: {name: "Підтвердити", class: "button__yellow"},

      // --- filters ---
      filters: [],
      selectedFilters: {},
      priceRange: { min: null, max: null },
      priceSelected: { min: null, max: null },
      expandedGroups: {},
      filtersMobileOpen: false,
      suppressRouteFetch: false,
  }),
  computed: {
    ...mapGetters("basket", ["newBasketProduct", "idProduct"]),
    ...mapGetters("user", ["currentUser"]),
    groupFilters() {
      return this.filters.filter(f => f && f.values)
    },
    priceFilterObj() {
      return this.filters.find(f => f && f.code === 'price')
    },
    hasFilters() {
      return this.groupFilters.some(filter => filter.code !== 'price')
    },
    searchHasCategory() {
      if (this.$route.query.category) {
        return true
      } else {
        return false
      }
    },
    activeFiltersCount() {
      let count = Object.values(this.selectedFilters).reduce((acc, arr) => acc + (arr ? arr.length : 0), 0)
      // if (this.priceFilterObj) {
      //   if (this.priceSelected.min !== null && this.priceSelected.min !== undefined && Number(this.priceSelected.min) !== Number(this.priceRange.min)) {
      //     count++
      //   }
      //   if (this.priceSelected.max !== null && this.priceSelected.max !== undefined && Number(this.priceSelected.max) !== Number(this.priceRange.max)) {
      //     count++
      //   }
      // }

      return count
    },
  },
  watch: {
    dataTable() {
      this.$emit("productData", this.dataTable)
    },
    dialogInput() {
      this.keymonitor()
    },
    newBasketProduct() {
      this.qantityFunc()
      this.checkMap()

        setTimeout(() => {
          if (this.dataTable.length > 0) {
              for(let i = 0; this.dataTable.length > i; i++) {
                  if(this.newBasketProduct.length) {
                      this.newBasketProduct.find(product => {
                          if(product.id === this.dataTable[i].id) {
                              this.dataTable[i].multiplicity_switch = product.is_strict_multiplicity
                          };
                      });
                  }
              }
          }
        }, 0)
    },
    canLoad(newVal) {
      this.pagination.page = 1
      if (newVal) {
        this.scheduleFetch()
      }
    },
    listUpdate(e) {
      if (e) {
        // this.getDataFromApi(true)
      }
    },
    total_items() {
      this.totalPages()
    },
    search(e) {
      this.$nextTick(() => {
        // this.getDataFromApi(true)
      })
    },
    // loading(e) {
    //   this.$loadingBus.$emit("loading", e)
    // },
    id(e) {
      this.getDataFromApi()
    },
    // radiosSpecification() {
    //   this.pagination.page = 1;
    //   this.getDataFromApi(true)
    // },
    deliveryDate() {
      this.getDataFromApi(true)
    },
    dateFilterWithNoDate() {
      this.getDataFromApi(true)
    },
    locationId(newVal, oldVal) {
      if (+newVal === +oldVal) return;

      this.pagination.page = 1;
      this.scheduleFetch();
    },
    $route(to, from) {
        if (this.suppressRouteFetch) {
            this.suppressRouteFetch = false;
            return;
        }
        if (to != from) {
            if (to.query.category) {
              if (to.query.category != from.query.category) {
                this.radiosSpecification = false
              }
            }
            this.pagination.page = 1;
            this.getDataFromApi(true, false, false, true);
        }
    },
  },
  created() {
    this.checkMap()
  },
  mounted() {
    if (this.canLoad) {
      this.getDataFromApi(true)
    }
    if (this.$route.query.category) {
      // the initial getDataFromApi() call is filtered by category, so its categoryList
      // is narrowed too — fetch the unfiltered list separately to seed the tabs
      this.loadPopularCategoryList()
    }
    if(this.$route.query) {
      this.activePopularCategory = this.$route.query.category
    } else {
      this.activePopularCategory = null
    }
  },
  methods: {
      loadPopularCategoryList() {
        if (this.$route.name !== 'must_see' && this.$route.name !== 'popular') {
          return
        }

        const url = this.$route.name === 'must_see' ? '/search/get-season-goods' : '/search/get-popular'
        const data = {
          pagination: {
            rowsPerPage: 1,
            page: 1,
            sortBy: 'sort'
          }
        }

        this.$api.post(url, data).then(response => {
          this.popularCategory = response.data.categoryList || []
        })
      },
      getCategoryButton(name, path) {
        return `/search?query=${this.$route.query.query}&category=${path.includes('/') ? path.split('/').pop() : path}`
      },
      openSortList() {
        this.sort_item_open = !this.sort_item_open
      },
      changeSort(sort) {
        this.sort_item = sort
        this.sort_item_open = false
        this.pagination.page = 1
        this.applyFilters()
      },
      changeActivePopularCategory(data) {
        if (data) {
          this.activePopularCategory = data
          if (this.$route.name == 'must_see') {
            this.$router.push(`/must-see?category=${data}`)
          } else if (this.$route.name == 'popular') {
            this.$router.push(`/popular?category=${data}`)
          }
        } else {
          this.activePopularCategory = data
          if (this.$route.name == 'must_see') {
            this.$router.push(`/must-see`)
          } else if (this.$route.name == 'popular') {
            this.$router.push(`/popular`)
          }
        }
      },
      getDeliveryInfo(item, count, first = false) {
          if ((item.strict_multiplicity && first) || (item.multiplicity_switch && first)) {
            count = item.multiplicity;
          } else if (first) {
            count = 1;
          }
          const now = new Date();
          // const now = new Date(new Date().getTime() + 24 * 5 * 60 * 60 * 1000);
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

          return `Доступно на ${moment(devDate).format("DD.MM.YYYY")}`;
      },


      buttonOne() {
          if (this.myDialogAction == "deleteItemCardProduct") {
              this.myDialog = false
              // this.getDataFromApi();
              this.myDialogAction = ""
          }
      },
      buttonTwo(e, i) {
          if (this.myDialogAction == "deleteItemCardProduct") {
              let dellete
              this.newBasketProduct.filter(e => {
                  if (e.product.id == this.dialogItem.id) return (dellete = e)
              })
              this.arrDelete.push(dellete)
              this.deleteItemNewBasket(e, i)
              this.myDialog = false
              this.myDialogAction = ""
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
      deleteItemNewBasket(e, i) {
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
                  // }
              })
      },
      getProductCartQty(productId) {
          var qty = 1;

          this.newBasketProduct.forEach(i => {
              if (i.id === productId) {
                  qty = i.quantity;
              }
          });

          return qty;
      },
      changeQuantity(item, newQty, index, productId) {
          var nQty;
          const multiplicity = item.multiplicity
          // const maxCount = Math.floor(item.leftovers / item.multiplicity) * item.multiplicity
          this.newBasketProduct.forEach(i => {
              if (i.id === productId) {
                  nQty = +i.quantity;
              }
          });
          if(newQty === 'add') {
              if (item.multiplicity_switch || item.strict_multiplicity) {
                  nQty += +multiplicity;
              } else {
                  nQty += 1
              }
          } else if(newQty === 'remove') {
              if (item.multiplicity_switch || item.strict_multiplicity) {
                  nQty -= +multiplicity;
              } else {
                  nQty -= 1
              }
          } else {
              if (item.multiplicity_switch || item.strict_multiplicity) {
                  if (Number.isInteger(newQty / item.multiplicity) * item.multiplicity) {
                      nQty = Math.floor(newQty / item.multiplicity) * item.multiplicity;
                  } else {
                      if (Math.floor(item.leftovers / item.multiplicity) < Math.floor(newQty / item.multiplicity)) {
                          nQty = Math.floor(newQty / item.multiplicity) * item.multiplicity;
                      } else {
                          nQty = Math.ceil(newQty / item.multiplicity) * item.multiplicity;
                      }
                  }
              } else {
                  nQty = newQty
              }

          }

          if(nQty < 1) {
              this.deleteItemNewBasket(item, index)
              return
          }

          if (item.multiplicity_switch || item.strict_multiplicity) {
            nQty = Math.floor(nQty / item.multiplicity) * item.multiplicity
          }

          // r = +r;
          let newProduct = false;
          // let changeQuantity = true;
          if (item.newProduct) {
              newProduct = true
          }

          if (true) {
              item.quantity = nQty;
              // this.socketEmitFreez(true);

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
                      img: item.img,
                      newProduct: newProduct,
                      changeQuantity: true,
                      leftovers_salvi: item.leftovers_salvi,
                      leftovers_supplier: item.leftovers_supplier,
                      supplier_delivery_postpone: item.supplier_delivery_postpone,
                      multiplicity: item.multiplicity,
                      isSpecificationProduct: item.isSpecificationProduct,
                      is_strict_multiplicity: item.multiplicity_switch || item.strict_multiplicity ? 1 : 0,
                      strict_multiplicity: item.strict_multiplicity,
                      is_temperature_conditions : item.is_temperature_conditions
                  }
              })
              this.$api
                  .post("/cart/update-product", {
                      order_id: this.idProduct.order_id,
                      product_id: item.id,
                      id: item.addId,
                      quantity: nQty,
                      is_strict_multiplicity: item.multiplicity_switch || item.strict_multiplicity ? 1 : 0,
                  })
                  // eslint-disable-next-line no-unused-vars
                  .then(response => {
                      // if (response.data.success) {
                      this.socketEmit()
                      // }
                  })
              this.changeInputBlock = false
              this.loading = true
              setTimeout(() => {
                  this.loading = false
              }, 1000)
          }
      },
      itemExceedsClose() {
        this.itemExceeds = null;
      },
    addToCart(item,index) {
        if(item.deleted === 1) {
            return false;
        }
        this.valProd = item;
        this.idProd = item.id;
        this.indexProd = index;

        // let sum = this.summ__prod.reduce((a, b) => a + b, 0)


        if(this.idProd === this.valProd.id) {
            // if(sum > 0) {/
                this.valProd.quantity = +this.summ__prod.join("");
                this.summ__prod = [];

                let $false = false;
                let s = this.selectedChild;

                this.selectedChild.push(this.idProd);

                for(let i = 0; i < s.length; i++) {
                    if(this.selectedChild[i] == item.id) {
                        $false = true;
                    }
                }
                let newProduct = true;
                let changeQuantity = false;
                let index = undefined;

                this.newBasketProduct.forEach(i => {
                    if (i.id === item.id) {
                        i.newProduct ? (newProduct = true) : (newProduct = false)
                        index = i.index
                    }
                });

                if(!item.newProduct) {
                    changeQuantity = true;
                }

                let price = item.price;
                price = price.replace(/[\s,%]/g, "");

                let total_sum
                let quantity

                if (item.multiplicity_switch || item.strict_multiplicity) {
                    total_sum = +price * item.multiplicity;
                    quantity = item.multiplicity
                } else {
                    total_sum = +price
                    quantity = 1
                }

                this.$api
                    .post("/cart/add-product", {
                        id: this.idProduct.id,
                        order_id: this.idProduct.order_id,
                        product_id: item.id,
                        quantity: quantity,
                        price: item.price,
                        is_specification: item.isSpecificationProduct ? 1 : 0,
                        is_strict_multiplicity: item.multiplicity_switch || item.strict_multiplicity ? 1 : 0,
                        discount_price: item.discount_price,
                    })
                    // eslint-disable-next-line no-unused-vars
                    .then(response => {
                        // this.socketEmitFreez(false);
                        if (response.data.success) {
                            this.socketEmit()
                            this.$nextTick(() => {
                                this.setNewBasketProduct({
                                    ctx: {
                                        index: index,
                                        id: item.id,
                                        addId: undefined,
                                        lastUpdate: true,
                                        quantity: quantity,
                                        val: $false,
                                        total_sum: total_sum.toFixed(2),
                                        price: item.price,
                                        img: item.img,
                                        name: item.name,
                                        newProduct: newProduct,
                                        changeQuantity: changeQuantity,
                                        leftovers_salvi: item.leftovers_salvi,
                                        leftovers_supplier: item.leftovers_supplier,
                                        supplier_delivery_postpone: item.supplier_delivery_postpone,
                                        multiplicity: item.multiplicity,
                                        isSpecificationProduct: item.isSpecificationProduct,
                                        is_strict_multiplicity: item.multiplicity_switch || item.strict_multiplicity ? 1 : 0,
                                        strict_multiplicity: item.strict_multiplicity,
                                        is_temperature_conditions : item.is_temperature_conditions,
                                        discount_price: item.discount_price,
                                    }
                                })
                            })
                        }
                    });


                this.snack = true;
                this.snackColor = "#19B200";
                this.snackText = "Зміни збережені";
            // } else if(sum <= 0) {
            //     this.snack = true;
            //     this.snackColor = "#ff2525";
            //     this.snackText = "число больше 0 !";
            // }
        }

    },
    changeItemQty(qty, item) {
        item.quantity = qty;
    },
    updateCategory(item) {
      this.$store.dispatch("category/setUUID", { ctx: item.category.uuid })
      this.$loadingBus.$emit("updateBreadcrum", item.category.name)
    },
    ...mapActions("basket", ["setNewBasketProduct", "setValueSelect"]),
    closeDialogInput() {
      this.dialogInput = false
      this.summ__prod = [""]
    },
    openImg(item, name) {
      if (item.length > 0) {
        this.dialogImg = true
        this.imgSlider = item
        this.imgSliderName = name
      }
    },
    canAddToCart(item) {
        var result = true;

        if(!this.newBasketProduct.length) {
            return result;
        }

        this.newBasketProduct.find(product => {
            if(product.id === item.id) {
                result = false;
            };
        });

        return result;
    },
    btnId(e) {
      let s = this.selectedChild
      let visible = false
      for (let i = 0; i < s.length; i++) {
        if (this.selectedChild[i] == e.id) {
          visible = true
        }
      }
      if (visible == true) {
        return true
      }
    },
    checkMap() {
      this.qantityFunc()
      this.selectedChild = this.newBasketProduct.map(ctx => {
        return ctx.id
      })
    },
    changeCheckbox(e, index) {
      this.socketEmitFreez(true)
      let $false = false
      let s = this.selectedChild
      for (let i = 0; i < s.length; i++) {
        if (this.selectedChild[i] == e.id) {
          $false = true
        }
      }
      this.setNewBasketProduct({
        ctx: {
          index: index,
          id: e.id,
          quantity: e.quantity,
          val: $false,
          price: e.price
        }
      })
      this.$api
        .post("/cart/delete-product", {
          order_id: this.idProduct.order_id,
          product_id: e.id
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.socketEmit()
        })
    },
    dialogQuantity(id, quantity, e, index) {
      this.idProd = e.id
      this.valProd = e
      this.dialogInput = true
      this.indexProd = index
    },
    qantityFunc() {
      let e = this.newBasketProduct
      this.dataTable.forEach(i => {
        e.forEach(n => {
          if (i.id == n.id) {
            i.quantity = n.quantity
          } else {
            i.quantity
          }
        })
      })
    },
    num__input(e) {
      this.summ__prod.push(e)
    },
    saveQuality() {
      this.socketEmitFreez(true)
      let sum = this.summ__prod.reduce((a, b) => a + b, 0)
      if (this.idProd == this.valProd.id) {
        if (sum > 0) {
          this.valProd.quantity = +this.summ__prod.join("")
          this.summ__prod = []
          let e = this.valProd
          let $false = false
          let s = this.selectedChild

          this.selectedChild.push(this.idProd)
          for (let i = 0; i < s.length; i++) {
            if (this.selectedChild[i] == e.id) {
              $false = true
            }
          }
          let newProduct = true
          let changeQuantity = false
          let index = undefined
          this.newBasketProduct.forEach(i => {
            if (i.id == e.id) {
              i.newProduct ? (newProduct = true) : (newProduct = false)
              index = i.index
            }
          })
          if (!e.newProduct) {
            changeQuantity = true
          }
          let price = e.price
          price = price.replace(/[\s,%]/g, "")
          let total_sum = +price * +e.quantity
          this.$api
            .post("/cart/add-product", {
              id: this.idProduct.id,
              order_id: this.idProduct.order_id,
              product_id: e.id,
              quantity: e.quantity,
              price: e.price
            })
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              // this.socketEmitFreez(false);
              if (response.data.success) {
                this.socketEmit()
                this.$nextTick(() => {
                  this.setNewBasketProduct({
                    ctx: {
                      index: index,
                      id: e.id,
                      addId: undefined,
                      lastUpdate: true,
                      quantity: e.quantity,
                      val: $false,
                      total_sum: total_sum.toFixed(2),
                      price: e.price,
                      img: e.img,
                      name: e.name,
                      newProduct: newProduct,
                      changeQuantity: changeQuantity
                    }
                  })
                })
              }
            })
          this.dialogInput = false

          this.snack = true
          this.snackColor = "#19B200"
          this.snackText = "Зміни збережені"
        } else if (sum <= 0) {
          this.snack = true
          this.snackColor = "#ff2525"
          this.snackText = "число больше 0 !"
        }
      }
    },
    socketEmit() {
      this.$socket.emit("userCartAction", {
        order_id: this.idProduct.order_id,
        user_id: this.currentUser.id,
        update: true
      })
    },
    socketEmitFreez(freez) {
      this.$socket.emit("userCartAction", {
        order_id: this.idProduct.order_id,
        user_id: this.currentUser.id,
        update: false,
        freez: freez
      })
    },
    keyOn(e) {
      if (
        e.key == 1 ||
        e.key == 2 ||
        e.key == 3 ||
        e.key == 4 ||
        e.key == 5 ||
        e.key == 6 ||
        e.key == 7 ||
        e.key == 8 ||
        e.key == 9 ||
        e.key == 0
      ) {
        this.dataKey = e.key
        this.summ__prod.push(this.dataKey)
      }
      if (e.key == "Enter") {
        this.saveQuality()
      }
      if (e.key == "Backspace") {
        this.summ__prod.splice(-1, 1)
      }
    },
    keymonitor() {
      if (this.dialogInput) {
        document.addEventListener("keydown", this.keyOn)
      } else {
        document.removeEventListener("keydown", this.keyOn)
      }
    },

    totalPages() {
      if (this.total_items > 0) {
        this.total_pages = Math.ceil(
          this.total_items / this.pagination.rowsPerPage
        )
      } else {
        this.total_pages = 0
      }
    },
    hoverItem(index) {
      this.hoverCatalog = index
    },
    handleChangeMultiplicity(index) {
      this.dataTable[index].multiplicity_switch = !this.dataTable[index].multiplicity_switch
        const el = this.dataTable[index]
        if (!this.canAddToCart(el)) {
          this.changeQuantity(el, this.getProductCartQty(el.id), index, el.id)
        }
    },
    scheduleFetch() {
      // canLoad and locationId are often set together by the parent once the
      // location resolves — coalesce both into a single getDataFromApi() call
      // instead of firing one request per prop change
      if (this.fetchScheduled) return
      this.fetchScheduled = true
      this.$nextTick(() => {
        this.fetchScheduled = false
        this.getDataFromApi(true)
      })
    },
    loadMoreProduct() {
        if (this.more_loading) {
          return
        }
        if (this.pagination.page < this.total_pages) {
          this.pagination.page = this.pagination.page + 1
          this.getDataFromApi(false, false, true)
        }
    },
    // --- filters ---

    initFiltersFromUrl() {
      const query = this.$route.query || {}
      const props = {}

      Object.keys(query).forEach(key => {
        const match = key.match(/^props\[(.+)\]$/)

        if (!match) return

        const groupId = String(match[1])
        const raw = query[key]

        if (raw !== undefined && raw !== null && raw !== '') {
          props[groupId] = String(raw)
            .split(',')
            .filter(Boolean)
        }
      })

      this.selectedFilters = props

      if (query.sort_by !== undefined && query.sort_by !== '') {
        this.sort_item = {}
        this.sort_item.orderBy = query.sort_by
        this.sort_item.sort = query.sort_order
        this.sort_item.name = query.sort_name
      } else {
        this.sort_item = null
      }

      if (query.specification_only !== undefined) {
        this.radiosSpecification = true
      } else {
        this.radiosSpecification = false
      }
    },

    mergeFiltersFromResponse(rawFilters) {
      if (!Array.isArray(rawFilters) || !rawFilters.length) {
        this.filters = []
        return
      }

      this.filters = rawFilters

      const priceObj = rawFilters.find(f => f && f.code === 'price')

      if (priceObj) {
        this.priceRange.min = priceObj.min
        this.priceRange.max = priceObj.max

        if (
          this.priceSelected.min === null ||
          this.priceSelected.min === undefined
        ) {
          this.priceSelected.min = priceObj.min
        }

        if (
          this.priceSelected.max === null ||
          this.priceSelected.max === undefined
        ) {
          this.priceSelected.max = priceObj.max
        }
      }

      rawFilters.forEach(f => {
        if (
          f &&
          f.id !== undefined &&
          !(String(f.id) in this.expandedGroups)
        ) {
          this.$set(
            this.expandedGroups,
            String(f.id),
            true
          )
        }
      })

      if (priceObj && !('price' in this.expandedGroups)) {
        this.$set(this.expandedGroups, 'price', true)
      }
    },

    toggleGroup(groupId) {
      const gid = String(groupId)

      this.$set(
        this.expandedGroups,
        gid,
        !this.expandedGroups[gid]
      )
    },

    isChecked(groupId, valueId) {
      const gid = String(groupId)
      const vid = String(valueId)

      return !!(
        this.selectedFilters[gid] &&
        this.selectedFilters[gid].includes(vid)
      )
    },

    toggleFilterValueSpec() {
      this.radiosSpecification = !this.radiosSpecification

      this.applyFilters()
    },

    toggleFilterValue(groupId, valueId) {
      const gid = String(groupId)
      const vid = String(valueId)

      const current = this.selectedFilters[gid]
        ? [...this.selectedFilters[gid]]
        : []

      const idx = current.indexOf(vid)

      if (idx === -1) {
        current.push(vid)
      } else {
        current.splice(idx, 1)
      }

      if (current.length) {
        this.$set(
          this.selectedFilters,
          gid,
          current
        )
      } else {
        this.$delete(
          this.selectedFilters,
          gid
        )
      }

      this.applyFilters()
    },

    resetFilters() {
      this.radiosSpecification = false

      this.selectedFilters = {}

      if (this.priceRange.min !== null) {
        this.priceSelected.min = this.priceRange.min
      }

      if (this.priceRange.max !== null) {
        this.priceSelected.max = this.priceRange.max
      }

      this.applyFilters()
    },

    buildFilterQuery() {
      const query = {
        ...this.$route.query
      }

      Object.keys(query).forEach(key => {
        if (key.startsWith('props[')) {
          delete query[key]
        }
      })

      delete query.props
      delete query.price_min
      delete query.price_max
      delete query.sort_by
      delete query.sort_order
      delete query.delivery_date
      delete query.specification_only

      Object.keys(this.selectedFilters).forEach(groupId => {
        const values = this.selectedFilters[groupId]

        if (
          Array.isArray(values) &&
          values.length
        ) {
          query[`props[${groupId}]`] = values.join(',')
        }
      })

      // if (this.priceFilterObj && false) {
      //   if (
      //     this.priceSelected.min !== null &&
      //     this.priceSelected.min !== undefined &&
      //     Number(this.priceSelected.min) !== Number(this.priceRange.min)
      //   ) {
      //     query.price_min = this.priceSelected.min
      //   }
      //
      //   if (
      //     this.priceSelected.max !== null &&
      //     this.priceSelected.max !== undefined &&
      //     Number(this.priceSelected.max) !== Number(this.priceRange.max)
      //   ) {
      //     query.price_max = this.priceSelected.max
      //   }
      // }

      if (this.sort_item) {
        query.sort_by = this.sort_item.orderBy
        query.sort_order = this.sort_item.sort
        query.sort_name = this.sort_item.name
      }

      // if (this.deliveryDate && false) {
      //   query.delivery_date = this.deliveryDate
      // }

      if (this.radiosSpecification) {
        query.specification_only = 1
      }

      return query
    },

    applyFilters() {
      this.pagination.page = 1

      const newQuery = this.buildFilterQuery()

      this.suppressRouteFetch = true

      this.$router
        .replace({
          query: newQuery
        })
        .catch(() => {})

      this.getDataFromApi(true)
    },
    async getDataFromApi(loadCard, scroll = false, loadMore = false, noChangeCategory = false) {
      this.initFiltersFromUrl()

      const scrollTop = window.pageYOffset
      if (!loadMore) {
        if (loadCard) {
          this.loadingProduct = true
        } else {
          this.loading = true
        }
      } else {
        this.more_loading = true
      }

      // let url = "/graphql"
      let order = "ASC"
      if (this.pagination.descending) {
        order = "DESC"
      }
      let order_id = ""
      if (this.locationId) {
        order_id = "location_id: " + this.locationId
      } else if (this.id != undefined) {
        order_id = "order_id: " + this.id
      }
      let add_product = false
      if (this.$route.name == "order-add-product") {
        add_product = true
      }

      if(this.sort_item) {
        this.pagination.sort = this.sort_item.sort
        this.pagination.orderBy = this.sort_item.orderBy
      }

      const defaultData = {
        query: this.search,
        order: order,
        order_id: order_id,
        pagination: this.pagination,
        specification_only: this.radiosSpecification,
        add_product: add_product,
        location_id: this.locationId,
        category: this.filterUuid,
        delivery_date: this.deliveryDate,
        with_no_date_product: this.dateFilterWithNoDate,
        filters: this.selectedFilters,
        // price_min: this.priceSelected.min,
        // price_max: this.priceSelected.max,
      }
      const specialData = {
        pagination: this.pagination,
        props: this.selectedFilters,
        // price_min: this.priceSelected.min,
        // price_max: this.priceSelected.max,
      }

      let data = defaultData
      if (this.$route.name == 'popular' || this.$route.name == 'must_see') {
        if (this.$route.query.category) {
          specialData.category = this.$route.query.category
        }
        data = specialData
      }


      let defaultUrl = "/search/search"
      let categoryUrl = "/search/get-category-page"
      let moreSeeUrl = "/search/get-season-goods"
      let popularUrl = "/search/get-popular"

      let url = defaultUrl
      if (this.$route.name == 'must_see') {
        url = moreSeeUrl
      } else if (this.$route.name == 'popular') {
        url = popularUrl
      } else if (this.search.length < 1 && this.filterUuid) {
        url = categoryUrl
      }


      await this.$api
          .post(url, data)
          .then(response => {
              if (this.$route.name == 'popular' || this.$route.name == 'must_see') {
                if (!this.$route.query.category) {
                  // unfiltered response already carries the full tabs list — no extra request needed
                  this.popularCategory = response.data.categoryList || []
                }
              } else {
                this.popularCategory = []
              }

              let data
              if (response.data.products) {
                data = response.data.products
              } else {
                data = response.data.model
              }

              for(let i = 0; data.length > i; i++) {
                  data[i].multiplicity_switch = false

                  if(this.newBasketProduct.length) {
                    this.newBasketProduct.find(product => {
                        if(product.id === data[i].id) {
                            if (product.is_strict_multiplicity) {
                                data[i].multiplicity_switch = true
                            }
                        };
                    });
                  }

              }

              if (loadMore) {
                const existingIds = new Set(this.dataTable.map(item => item.id))
                this.dataTable.push(...data.filter(item => !existingIds.has(item.id)))
                this.$nextTick(() => {
                  window.scrollTo(0, scrollTop)
                })
                this.more_loading = false
              } else {
                this.dataTable = data
              }


              this.total_items = response.data.total

              if (loadMore) {
                this.total_loaded = Math.min(this.total_loaded + data.length, this.total_items)
              } else {
                this.total_loaded = data.length
              }

              // if (this.search.length > 0) {
              //     this.total_pages = Math.ceil(
              //         this.total_items / 60
              //     )
              // }

              this.noResult = response.data.is_search_empty

              if (response.data.filters) {
                this.mergeFiltersFromResponse(response.data.filters)
              }

              if (response.data.catalogOptions && response.data.catalogOptions.specification_only && response.data.catalogOptions.specification_only.available) {
                this.hasRadiosSpecification = true
              } else {
                this.hasRadiosSpecification = false
              }

              this.showImg = false
              this.showImgDefault = true
              setTimeout(() => {
                  this.showImg = true
                  this.loadingProduct = false
              }, 300)
              this.loading = false
              setTimeout(() => (this.showImgDefault = false), 10000);

              if (scroll) {
                this.$nextTick(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                });
              }
          })
      this.$emit("listUpdated", false)
    }
  }
}
</script>

<style scoped lang="scss">
  .price {
    flex-wrap: wrap;
  }
  .price .old {
    font-size: 14px !important;
    font-weight: 400 !important;
    color: gray !important;
    text-decoration: line-through !important;
    padding-left: 10px;
  }
  .load-more {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__title {
      font-size: 14px;
      color: #565656;
    }

    &__line {
      margin: 10px 0 20px;
      width: 280px;
      height: 4px;
      position: relative;
      background: #F6F6F8;
      border-radius: 50px;

    }

    &__line-progress {
      height: 4px;
      background: #269447;
      border-radius: 50px;
    }

    &__button {
      padding: 10px 20px;
      background: #F6F6F8;
      cursor: pointer;
      color: #269447;
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      transition: all ease-in-out .3s;
      border-radius: 8px;

      svg {
        margin-right: 10px;
      }

      &:hover {
        transition: all ease-in-out .3s;
        background: #269447;
        color: #fff;

        svg {
          path {
            fill: #fff;
          }
        }
      }
    }
  }
  .header-nav {
    display: flex;
    align-items: center;
    padding: 10px 0;

    &__title {
      font-size: 36px;
      font-weight: 700;
    }

    &__total {
      padding-top: 3px;
      font-size: 16px;
      color: #565656;
      padding-left: 50px;
    }

    &__sort {
      margin-left: auto;
      position: relative;
    }

    &__sort-button {
      padding: 10px 15px;
      border: 1px solid #E3E3E3;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      div {
        color: #4B4B4A;
        font-size: 14px;
        padding: 0 15px 0 15px;
      }
    }

    &__sort-list {
      position: absolute;
      right: 0;
      min-width: 200px;
      z-index: 10;
      top: 100%;
      padding: 10px;
      border: 1px solid #E3E3E3;
      background: #fff;
    }

    &__sort-list-item {
      font-size: 15px;
      padding-bottom: 10px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.desc svg {
        transform: rotate(90deg);
      }

      &.asc svg {
        transform: rotate(-90deg);
      }

      &:hover, &.active {
        color: #269447;
      }
    }
  }

  .item__top {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    padding: 5px 10px;
    background: #269447;
    border-radius: 10px;
    color: #fff;
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
  }
  .home__slider-categories {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 5px 0 20px;
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
  .icon__isTemp {
     position: absolute;
     z-index: 9;
     top: 10px;
     left: 10px;
     color: #3d4465;

     svg {
       width: 25px;
       height: 25px;
     }
   }

  .icon__isSpec {
    color: #3d4465 !important;
    margin-left: 15px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
  .multiplicity__container {
    display: flex;
    align-items: center;
  }
  .multiplicity__wrap {
    display: flex;
    align-items: center;
  }
  .price__wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .catalog__tile .item__body .price span.new-price {
    color: #e10000;
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
  .multiplicity__toggle.no-pointer {
    cursor: auto;
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
  .silerModal {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .silerModal .img__slider {
    width: fit-content;
    height: fit-content;
    max-width: 90vw;
    max-height: 90vh;
  }
  .image-modal {
    width: fit-content;
  }
.scaleBtn-enter-active,
.scaleBtn-leave-active,
.scaleBtn-move {
  transition: 600ms;
  transition-property: opacity, transform;
}

.price .name {
  display: flex;
  align-items: center;
}

.search__no-result-text {
  font-size: 20px;
  text-align: center;
}

.search__no-result-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.search__no-result-button {
  margin: 0 10px 20px;
}

.chip a {
  color: #3181ff;
}

.chip__item {
  cursor: pointer;
}

.chip__item:hover {
  text-decoration: underline;
}

.scaleBtn-enter {
  transition: 100ms;
  opacity: 0;
  transform: rotateX(180deg);
}

.scaleBtn-enter-to {
  opacity: 1;
  transition: 0.5s;
  transform: rotateX(0deg) scale(0.9);
}

.scaleBtn-leave-active {
  transform: rotateX(0deg);
  opacity: 0;
  position: absolute;
  transition: 0.3s;
}

.scaleBtn-leave-to {
  opacity: 0;
  transform-origin: center top;
}

.icon__isSpecification {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 9;
}

  .btnAdd {
    background: rgb(42, 139, 26);
    width: 80px;
    border-radius: 5px;
  }

  .removeItem i {
    color: #CCCCCC;
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

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .image-modal {
    padding-right: 40px;
    white-space: normal !important;
    overflow: auto;
  }

  .preloader {
    position: fixed;
    inset: 0;
    z-index: 10000000000;
    background: #fff;

    animation: fade 0.5s ease-in-out infinite;
  }

  @keyframes fade {
    0% {
      opacity: .2;
    }

    50% {
      opacity: 0.8;
    }

    100% {
      opacity: .2;
    }
  }

  /* ---------- filters ---------- */
  .catalog__layout {
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }

  .catalog__content {
    flex: 1 1 auto;
    min-width: 0;
  }

  .catalog__filters {
    flex: 0 0 240px;
    width: 240px;
    background: #fff;
    border: 1px solid #E3E3E3;
    border-radius: 8px;
    padding: 16px;
    position: sticky;
    top: 16px;
  }

  .catalog__filters-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .catalog__filters-title {
    font-size: 16px;
    font-weight: 700;
    color: #262447;
  }

  .catalog__filters-title-info {
    font-size: 18px;
    font-weight: 700;
    color: #262447;
  }

  .catalog__filters-reset {
    font-size: 13px;
    color: #2A8B1A;
    cursor: pointer;
  }

  .catalog__filters-reset:hover {
    text-decoration: underline;
  }

  .filter-group {
    border-top: 1px solid #EDEDED;
    padding: 12px 0;
  }

  .filter-group-container:first-of-type .filter-group {
    border-top: none;
    padding-top: 0;
  }

  .filter-group__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #262447;
    user-select: none;
  }

  .filter-group__link {
    display: flex;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #262447;
    user-select: none;
    padding-bottom: 15px;
    transition: all ease-in-out .3s;
  }

  .filter-group__link:hover {
    color: #2a8b1a;
    transition: all ease-in-out .3s;
  }

  .filter-group__arrow {
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .filter-group__arrow.open {
    transform: rotate(180deg);
  }

  .filter-group__body {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .filter-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #565656;
    cursor: pointer;
  }

  .filter-checkbox input {
    display: none;
  }

  .filter-checkbox__box {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border: 1px solid #BCBCBC;
    border-radius: 4px;
    position: relative;
  }

  .filter-checkbox input:checked + .filter-checkbox__box {
    background: #2A8B1A;
    border-color: #2A8B1A;
  }

  .filter-checkbox input:checked + .filter-checkbox__box::after {
    content: "";
    position: absolute;
    left: 4px;
    top: 1px;
    width: 5px;
    height: 9px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .filter-checkbox__label {
    flex: 1 1 auto;
  }

  .filter-checkbox__count {
    color: #A4A4A5;
    font-size: 12px;
  }

  .filter-price__inputs {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-price__input {
    width: 100%;
    min-width: 0;
    border: 1px solid #E3E3E3;
    border-radius: 5px;
    padding: 6px 8px;
    font-size: 13px;
  }

  .filter-price__divider {
    color: #A4A4A5;
  }

  .catalog__filters-mobile-btn {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: fixed;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
    background: #2A8B1A;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    padding: 12px 22px;
    border-radius: 50px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 50;
  }

  .catalog__filters-mobile-btn__badge {
    background: #fff;
    color: #2A8B1A;
    font-size: 11px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  .catalog__filters-modal-inner {
    background: #fff;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .catalog__filters-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #E3E3E3;
    font-size: 16px;
    font-weight: 700;
    color: #262447;
    flex-shrink: 0;
  }

  .catalog__filters-modal-body {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 0 16px;
  }

  .catalog__filters-modal-body .filter-group__body {
    max-height: none;
  }

  .catalog__filters-modal-footer {
    display: flex;
    gap: 10px;
    padding: 12px 16px;
    border-top: 1px solid #E3E3E3;
    flex-shrink: 0;
  }

  .catalog__filters-modal-reset {
    flex: 0 0 auto;
    background: #fff;
    border: 1px solid #E3E3E3;
    border-radius: 8px;
    padding: 0 18px;
    font-size: 14px;
    font-weight: 600;
    color: #565656;
  }

  .catalog__filters-modal-apply {
    flex: 1 1 auto;
    background: #2A8B1A;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 14px 18px;
    font-size: 14px;
    font-weight: 700;
  }

  @media (max-width: 992px) {
    .catalog__filters {
      display: none;
    }

    .catalog__filters-mobile-btn {
      display: flex;
    }

    .catalog__layout {
      display: block;
    }
  }

</style>
