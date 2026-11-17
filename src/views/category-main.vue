<template>
  <div class="home">
    <div v-if="banners.length" class="home__banners">
      <v-carousel
        v-model="slide"
        :hide-controls="true"
        hide-delimiter-background
        cycle
        :interval="currentInterval()"
        class="banner-slider"
      >
        <v-carousel-item
          v-for="(item, i) in banners"
          :key="i"
        >
          <a
            :href="item.url"
            class="banner-slide"
            :style="bannerStyle(item)"
          >
<!--            <a class="banner-slide-button" :href="item.url">{{item.text}}</a>-->
          </a>
        </v-carousel-item>
      </v-carousel>
      <div class="slider__header">
        <div @click="prevSlide" :class="['slider__header-nav prev', slide == 0 && 'disabled']">
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.95635 7.07273C4.31194 6.68921 4.31194 6.09647 3.95635 5.71295L0.267087 1.73383C-0.0884986 1.3503 -0.0884987 0.757562 0.267087 0.374039L0.317408 0.319765C0.713126 -0.107043 1.38831 -0.107043 1.78403 0.319764L6.78435 5.71295C7.13994 6.09647 7.13994 6.68921 6.78435 7.07273L1.78403 12.4659C1.38831 12.8927 0.713126 12.8927 0.317408 12.4659L0.267087 12.4116C-0.0884988 12.0281 -0.0884992 11.4354 0.267087 11.0518L3.95635 7.07273Z" fill="#565656"/>
          </svg>
        </div>
        <div @click="nextSlide" :class="['slider__header-nav next', slide == banners.length - 1 && 'disabled']">
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.95635 7.07273C4.31194 6.68921 4.31194 6.09647 3.95635 5.71295L0.267087 1.73383C-0.0884986 1.3503 -0.0884987 0.757562 0.267087 0.374039L0.317408 0.319765C0.713126 -0.107043 1.38831 -0.107043 1.78403 0.319764L6.78435 5.71295C7.13994 6.09647 7.13994 6.68921 6.78435 7.07273L1.78403 12.4659C1.38831 12.8927 0.713126 12.8927 0.317408 12.4659L0.267087 12.4116C-0.0884988 12.0281 -0.0884992 11.4354 0.267087 11.0518L3.95635 7.07273Z" fill="#565656"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="section__content">
      <div v-if="season_item && season_item.length" class="home__slider-section">
        <div class="home__slider-section-title">
          Варто придивитися
        </div>

        <div class="home__slider-categories">
          <div
            @click="changeActiveSeasonCategory(null)"
            :class="['home__slider-category', active_season_categories == null && 'active']"
          >
            Всі
          </div>
          <div
            @click="changeActiveSeasonCategory(item.category.code)"
            v-for="(item, index) in season_categories"
            :key="index"
            :class="['home__slider-category', active_season_categories == item.category.code && 'active']"
          >
            {{item.category.name}}
          </div>
        </div>

        <slider_tile
          :dataTable="season_item"
          :urlLink="`/must-see${active_season_categories ? `?category=${active_season_categories}` : ''}`"
          :total="season_item_total"
        />
      </div>

      <!--      categories-->
      <div class="home__categories">
        <div class="home__slider-section-title">
          Популярні категорії в SALVI
        </div>
        <div class="home__category-items">
          <router-link :to="`/catalog${item.full_path ? item.full_path : `/${item.code}`}`" v-for="item in categories" :key="item.id" class="home__category-item">
            <div class="home__category-item-icon">
              <img v-if="item.img_path" :src="item.img_path" :alt="item.name">
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M97.5 400l50-160 379.4 0-50 160-379.4 0zm190.7 48L477 448c21 0 39.6-13.6 45.8-33.7l50-160c9.7-30.9-13.4-62.3-45.8-62.3l-379.4 0c-21 0-39.6 13.6-45.8 33.7L80.2 294.4 80.2 96c0-8.8 7.2-16 16-16l138.7 0c3.5 0 6.8 1.1 9.6 3.2L282.9 112c13.8 10.4 30.7 16 48 16l117.3 0c8.8 0 16 7.2 16 16l48 0c0-35.3-28.7-64-64-64L330.9 80c-6.9 0-13.7-2.2-19.2-6.4L273.3 44.8C262.2 36.5 248.8 32 234.9 32L96.2 32c-35.3 0-64 28.7-64 64l0 288c0 35.3 28.7 64 64 64l192 0z"/></svg>
            </div>
            <div class="home__category-item-name">
              {{item.name}}
            </div>
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.95635 7.07273C4.31194 6.68921 4.31194 6.09647 3.95635 5.71295L0.267086 1.73383C-0.0884996 1.3503 -0.0884997 0.757564 0.267086 0.374041L0.317407 0.319766C0.713125 -0.107042 1.38831 -0.107042 1.78403 0.319766L6.78435 5.71295C7.13994 6.09647 7.13994 6.68921 6.78435 7.07273L1.78403 12.4659C1.38831 12.8927 0.713126 12.8927 0.317408 12.4659L0.267087 12.4116C-0.0884989 12.0281 -0.0884992 11.4354 0.267087 11.0518L3.95635 7.07273Z" fill="#BCBCBC"/>
            </svg>
          </router-link>
        </div>
      </div>

      <!--      popular office-->
      <div v-if="popular_office && popular_office.length" class="home__slider-section">
        <div class="home__slider-section-title">
          Популярне для офісу
        </div>

        <div class="home__slider-categories">
          <div
            @click="changeActivePopularCategory(null)"
            :class="['home__slider-category', active_popular_categories == null && 'active']"
          >
            Всі
          </div>
          <div
            @click="changeActivePopularCategory(item.category.code)"
            v-for="(item, index) in popular_categories"
            :key="index"
            :class="['home__slider-category', active_popular_categories == item.category.code && 'active']"
          >
            {{item.category.name}}
          </div>
        </div>

        <slider_tile
          :dataTable="popular_office"
          :urlLink="`/popular${active_popular_categories ? `?category=${active_popular_categories}` : ''}`"
          :isTop="true"
          :total="popular_office_total"
        />
      </div>

      <!--      list categories-->
      <div v-for="(item, index) in categories_list" :key="index" class="home__slider-section">
        <div class="home__slider-section-title">
          {{item.category.name}}
        </div>
        <slider_tile
          :dataTable="item.products"
          :urlLink="item.category.category_url"
          :total="item.total"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex"
  import slider_tile from "./catalog/slider_tile.vue"

  export default {
    name: "LkIndex",
    components: {
      slider_tile
    },
    data() {
      return {
        slide: 0,
        banners: [],
        season_item: [],
        season_item_total: null,
        popular_office_total: null,
        categories: [],
        popular_office: [],
        popular_categories: [],
        season_categories: [],
        active_popular_categories: null,
        active_season_categories: null,
        categories_list: [],
        loadedBanners: {}
      }
    },
    computed: {
      ...mapGetters("basket", ["newBasketProduct"]),
    },
    created() {
      this.getBanners()
      this.getData()
    },
    methods: {
      nextSlide () {
        if (this.slide < this.banners.length - 1) {
          this.slide++
        }
      },
      prevSlide () {
        if (this.slide > 0) {
          this.slide--
        }
      },
      changeActivePopularCategory(data) {
        this.active_popular_categories = data
        this.getPopularCategoryItems()
      },
      changeActiveSeasonCategory(data) {
        this.active_season_categories = data
        this.getSeasonCategoryItems()
      },
      getSeasonCategoryItems() {
        const data = {
          pagination: {
            rowsPerPage: 24,
            page: 1,
            sortBy: 'sort'
          }
        }

        if (this.active_season_categories) {
          data.category = this.active_season_categories
        }

        let url = '/search/get-season-goods'
        this.$api.post(url, data).then(res => {
          const data = res.data.model

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
          this.season_item = data
          this.season_item_total = res.data.total
        })
      },
      getPopularCategoryItems() {
        const dataPopular = {
          pagination: {
            rowsPerPage: 24,
            page: 1,
            sortBy: 'sort'
          }
        }

        if (this.active_popular_categories) {
          dataPopular.category = this.active_popular_categories
        }

        let url = '/search/get-popular'
        this.$api.post(url, dataPopular).then(res => {
          const data = res.data.model

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
          this.popular_office = data
          this.popular_office_total = res.data.total
        })
      },
      getBanners() {
        this.$api.get(`/banner/get-banners`).then(response => {
          this.banners = response.data.banners
          this.banners.forEach(item => this.preloadBanner(item.img_path))
        })
      },
      preloadBanner(src) {
        if (this.loadedBanners[src] !== undefined) return

        this.$set(this.loadedBanners, src, false)

        const img = new Image()
        img.onload = () => {
          this.$set(this.loadedBanners, src, true)
        }
        img.onerror = () => {
          this.$set(this.loadedBanners, src, true)
        }
        img.src = src
      },
      bannerStyle(item) {
        const isLoaded = this.loadedBanners[item.img_path]

        return {
          backgroundImage: isLoaded ? `url(${item.img_path})` : 'none',
          opacity: isLoaded ? 1 : 0
        }
      },
      currentInterval() {
        return this.banners[this.slide].time_swap ? this.banners[this.slide].time_swap * 1000 : 7000
      },
      getData() {
        const data = {
          pagination: {
            rowsPerPage: 24,
            page: 1,
            sortBy: 'sort'
          }
        }
        const dataPopular = {
          pagination: {
            rowsPerPage: 4,
            page: 1,
            sortBy: 'sort'
          }
        }
        this.$api.post(`/search/get-season-goods`, data).then(res => {
          const data = res.data.model

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
          this.season_item = data
          this.season_categories = (res.data.categoryList || []).slice(0, 8)
        })
        this.$api.post(`/search/get-popular`, data).then(res => {
          const data = res.data.model

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
          this.popular_office = data
          this.popular_categories = res.data.categoryList
          this.popular_office_total = res.data.total
        })
        this.$api.post(`/search/get-4-block-categories`).then(res => {
          this.categories = res.data.categories3Levels

          const data = res.data.categories
          for(let a = 0; data.length > a; a++) {
            for(let i = 0; data[a].products.length > i; i++) {
              data[a].products[i].multiplicity_switch = false

              if(this.newBasketProduct.length) {
                this.newBasketProduct.find(product => {
                  if(product.id === data[a].products[i].id) {
                    if (product.is_strict_multiplicity) {
                      data[a].products[i].multiplicity_switch = true
                    }
                  };
                });
              }
            }
          }
          this.categories_list = data
          console.log(this.categories_list, 'categories_list')
        })
      }
    }

  }
</script>

<style scoped type="scss">
  .home__banners {
    position: relative;
    aspect-ratio: 24/5;
    margin-left: 50px;

    @media (max-width: 768px) {
      margin-left: 0;
      width: 100%;
      margin-bottom: 0;
    }
  }

  .section__content {
    @media (max-width: 768px) {
      padding-top: 15px;
    }
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
    justify-content: space-between;
    padding-top: 10px;
  }
  .home__category-item {
    background: #fff;
    border-radius: 8px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    width: 24%;
    padding: 20px 20px 20px 20px;
    display: flex;
    align-items: center;
    transition: all ease-in-out .3s;
    margin-bottom: 10px;

    svg {
      margin-left: auto;
      path {
        transition: all ease-in-out .3s;
      }
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
    }

    @media (max-width: 1200px) {
      width: 48%;
    }
  }
  .home__category-item-icon {
    width: 64px;
    height: 64px;
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
  }
  .home__slider-section {
    padding-top: 50px;

    @media (max-width: 768px) {
      padding-top: 0;
    }
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

    @media (max-width: 768px) {
      width: 100%;
    }
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
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-color: #f2f2f2;
    transition: opacity .25s ease-in;
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
    z-index: 3;
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

    @media (max-width: 768px) {
      display: none !important;
    }

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

    @media (max-width: 768px) {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .banner-slider >>> .v-window__prev,
    .banner-slider >>> .v-window__next,
    .banner-slider >>> .v-carousel__prev,
    .banner-slider >>> .v-carousel__next {
      display: none !important;
    }
  }
</style>
