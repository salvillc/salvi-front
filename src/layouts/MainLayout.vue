<template>
  <div
    class="container-lk flex"
    :class="{
      bg__green: BG === 'green',
      pink: BG === 'Pink',
      violet: BG === 'Violet',
      blue: BG === 'Blue',
      yellow: BG === 'Yellow',
      green: BG === 'Green',
      darkShade: BG === 'DarkShade'
    }"
    data-app="true"
  >
    <clearCacheNotification />
    <transition name="loadLayout">
      <div
        v-if="ladingLayout"
        class="loaderLayout"
        :class="{ active: ladingLayout }"
      >
        <div class="col-sm-6 text-center">
          <p class="loaderLayout__title">
            {{
              reload && ladingLayout ? "спробуйте перезавантажити" : "Зачекайте"
            }}
          </p>
          <div class="loader3">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </transition>
    <chat v-show="!$root.rbac.receiveMessagesSupport" />
    <sitebar :notification="notificationVal" />
    <div
      class="section"
      :class="{
        full: !bodyMin,
        overlay: $store.getters['category/modalCategory']
      }"
      @click="targetClick"
    >
      <div class="section-head">
        <router-link to="/catalog" class="section-head__logo">
          <svg width="111" height="26" viewBox="0 0 111 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8388 26C8.70977 26 6.70977 25.7419 4.70977 25.2258C2.77428 24.7097 1.16138 24 8.78649e-05 23.0968L2.0646 18.7097C3.22589 19.4839 4.58073 20.129 6.12912 20.5807C7.67751 21.0323 9.29042 21.2903 10.8388 21.2903C12.5807 21.2903 13.8711 21.0323 14.7098 20.5807C15.5485 20.0645 15.9356 19.4194 15.9356 18.5807C15.9356 18 15.6775 17.4839 15.1614 17.0968C14.7098 16.7097 14.0646 16.3871 13.2904 16.129C12.5162 15.871 11.484 15.6129 10.1936 15.3548C8.19364 14.9032 6.51622 14.4516 5.2259 14C3.93558 13.5484 2.8388 12.8387 1.87105 11.8065C0.967828 10.7742 0.516219 9.48388 0.516219 7.80646C0.516219 6.32259 0.903314 5.03226 1.74202 3.87097C2.58073 2.64517 3.80654 1.74194 5.48396 1.03226C7.16138 0.322585 9.2259 4.25901e-06 11.6775 4.36618e-06C13.3549 4.4395e-06 15.0324 0.193553 16.6453 0.58065C18.2582 0.967747 19.6775 1.48388 20.9033 2.19355L19.0324 6.58065C16.5807 5.29033 14.1291 4.64517 11.6775 4.64517C9.93558 4.64517 8.70977 4.90323 7.87106 5.41936C7.03235 5.93549 6.64525 6.64517 6.64525 7.48388C6.64525 8.32259 7.09686 8.96775 8.06461 9.41936C9.03235 9.80646 10.4517 10.2581 12.4517 10.6452C14.4517 11.0968 16.1291 11.5484 17.4194 12C18.7098 12.4516 19.8065 13.1613 20.7098 14.129C21.6775 15.0968 22.1291 16.4516 22.1291 18.129C22.1291 19.5484 21.6775 20.9032 20.8388 22.0645C20.0001 23.2258 18.7098 24.1936 17.0323 24.8387C15.2904 25.6774 13.2259 26 10.8388 26Z" fill="#269447"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M43.8061 20.1926L31.4835 20.1926L29.1609 25.5475L22.8384 25.5475L34.5803 0.450688L40.6448 0.450688L52.5803 25.5475L46.1287 25.5475L43.8061 20.1926ZM41.8706 15.741L37.6771 6.12811L33.4835 15.741L41.8706 15.741Z" fill="#269447"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M55.3542 0.450688L61.4833 0.450688L61.4833 20.7733L74.8381 20.7733L74.8381 25.483L55.3542 25.5475L55.3542 0.450688Z" fill="#269447"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M101.936 0.387212L90.4519 25.484L84.3874 25.484L72.9035 0.387211L79.5487 0.387211L87.6132 18.3227L95.8067 0.387212L101.936 0.387212Z" fill="#269447"/>
            <path d="M110.338 25.4796L110.307 0.382817L104.178 0.39047L104.209 25.4873L110.338 25.4796Z" fill="#269447"/>
          </svg>
        </router-link>
        <Category />
        <search />
      </div>
      <Blackout />
      <chooseCompany v-if="companyLayout()" />
      <transition v-else name="list" class="routerView">
        <router-view
          v-show="changeBodySitebar"
          :key="currentUser.company_id"
          :style="{ transition: transition }"
          @notification="notification"
        />
      </transition>
      <!--    footer-->
      <Footer></Footer>
    </div>
    <v-snackbar
      v-model="snackbar"
      dismissible
      type="success"
      :color="snackbarColor"
      :bottom="true"
    >
      <span>{{ snackbarTitle }}</span>
      <v-btn color="pink" flat icon @click="snackbar = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
    <themeBG />
    <div v-if="is_need_reset_password" class="change">
      <div class="change__wrap">
        <div class="change__title">Зміна паролю</div>
        <div class="change__text">
          <p>Доброго дня!</p>
          <p>
            Ми оновлюємо систему безпеки. <br>
            Після входу вас попросять придумати новий пароль - це займе лише декілька секунд, але суттєво підвищить захист ваших даних.
          </p>
          <p>
            Дякуємо, що ви з нами!
          </p>
        </div>
        <form @submit.prevent="handleResetPassword">
          <input type="hidden" name="username" autocomplete="username" v-model="user_name">
          <div class="change__input-container">
            <input :type="see_password ? 'text' : 'password'"
                   autocomplete="new-password"
                   name="new_password"
                   placeholder="Новий пароль"
                   v-model="new_password">
            <div @click="handleSeePassword" class="change__input-see">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#6c6c6c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#6c6c6c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="change__input-container">
            <input type="password"
                   autocomplete="new-password"
                   name="confirm_password"
                   placeholder="Повторіть пароль"
                   v-model="confirm_password">
          </div>
          <div v-if="errorResetPassword" class="change__error">
            {{ errorResetPassword }}
          </div>
          <button class="change__button" type="submit">Зберегти</button>
        </form>
      </div>
    </div>
    <basket v-if="$store.getters['user/currentUser'].company_id !== 0" ref="basketComponent"/>

  </div>
</template>

<script>
import themeBG from "@/components/themeBG.vue"
import sitebar from "@/components/sitebar.vue"
import search from "@/components/search-LK.vue"
import chat from "../components/vue-chat/chat"
import chooseCompany from "../components/choose-company"
import basket from "@/components/shop/basket"
import Footer from "@/components/home/footer"

// import basket from "../components/shop/basket"
import { mapGetters, mapActions } from "vuex"
import Category from "../components/category/category"
import clearCacheNotification from "../components/clearCacheNotification"
import Blackout from "../components/blackout.vue"

export default {
  name: "MainLayout",
  components: {
    Category,
    sitebar,
    search,
    chat,
    chooseCompany,
    themeBG,
    basket,
    clearCacheNotification,
    Blackout,
    Footer
  },
  data() {
    return {
      is_need_reset_password: false,
      user_name: "",
      see_password: false,
      new_password: "",
      confirm_password: "",
      errorResetPassword: null,
      reload: false,
      window: {
        width: 0,
        height: 0
      },
      mobileView: false,
      notificationVal: false,
      ladingLayout: false,
      BG: "silver",
      changeBodySitebar: true,
      transition: "all 0s",
      snackbar: false,
      snackbarTitle: "",
      snackbarColor: "#4caf50",
        user: null,
    }
  },
  computed: {
    ...mapGetters("basket", ["orders", "idProduct", "cardProduct"]),
    ...mapGetters("params", ["bodyMin"]),
    ...mapGetters("permissionStore", ["getPermission"]),
    ...mapGetters("user", ["currentUser"])
  },
  watch: {
    ladingLayout() {
    },
    bodyMin() {
      if (this.window.width > 768) {
        this.changeBodySitebar = false
        this.ladingLayout = true
        this.transition = "all 0s"
        setTimeout(() => {
          this.changeBodySitebar = true
          this.transition = ""
          this.ladingLayout = false
        }, 500)
      }
    },
    "idProduct.order_id": function(e,old) {
      if (e == undefined || old == undefined) {
        this.setIdProduct({
          ctx: {
            order_id: 0
          }
        })
      }
      else if(e != old)
      {
        this.getDataFromApi()
      }

    },
    getPermission() {
      this.initPermission()
      this.accessToRoute()
    },
    $route() {
      this.setSearch({ ctx: "" })
      if (this.$route.query.basket == 'open') {
        this.setBasketModal({
            ctx: true
        })
      }
      this.checkResetPassword()
    }
  },
  created() {
    window.localStorage.setItem("bodyMin", false)
    this.getDataFromApi()
    document.querySelector("body").classList = "main__layout"
    window.addEventListener("resize", this.handleResize)
    this.handleResize()
    this.sockets.subscribe("getPermissions", () => {
      let time = Math.floor(Math.random() * Math.floor(10) * 1000)
      setTimeout(() => {
        this.getPermissions()
      }, time)
    })
    this.sockets.subscribe("cartChannel", e => {
      if (this.currentUser.id !== e.user_id) {
        if (e.order_id == this.idProduct.order_id && e.order_id > 0) {
          if (e.update) {
            this.getDataFromApi()
          } else {
            this.$loadingBus.$emit("cartFreez", e)
          }
        }
      }
    })
    this.getPermissions()
    this.initPermission()
    this.accessToRoute()
    this.$loadingBus.$on("loading", this.loadLayout)
    this.$loadingBus.$on("snackbar", this.snackbarFunc)
    this.$loadingBus.$on("updateBasket", this.loadingBasket)
    this.$loadingBus.$on("updateRoutTransition", this.updateRoutTransition)
    this.$nextTick(function() {
      this.$loadingBus.$on("themeBG", this.themeBG)
    })
  },
  beforeDestroy() {
    this.$loadingBus.$off("loading")
    if (this._b24Observer) {
      this._b24Observer.disconnect()
      this._b24Observer = null
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize)
    if (this._b24Observer) {
      this._b24Observer.disconnect()
      this._b24Observer = null
    }
  },
  mounted() {
      if (this.$route.query.basket == 'open') {
          this.setBasketModal({
              ctx: true
          })
      }
    let $this = this;
    this.mouseScroll();
    this.initPermission();
    this.getUserData();
    window.addEventListener("storage", function(event) {
      if (event.key == "current_user") {
        let newValue = event.newValue
        let oldValue = $this.currentUser
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          $this.setData({ ctx: newValue })
        }
      }
    })

      var script = document.createElement('script');
      // script.setAttribute("data-b24-form", "auto/25/40lyk2");
      // script.setAttribute("data-skip-moving", "true");

      // script.append("(function(w,d,u)\n" +
      //     "\n" +
      //     "{                 var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);                 var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);         }\n" +
      //     ")(window,document,'https://cdn.bitrix24.ua/b7849145/crm/form/loader_25.js');");

      script.append(" (function(w,d,u){\n" +
          "                var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);\n" +
          "                var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);\n" +
          "        })(window,document,'https://cdn.bitrix24.eu/b7849145/crm/site_button/loader_11_hlll13.js');");

      document.head.appendChild(script);
      this.autoCompleteForm();
      this.checkResetPassword()
  },
  updated() {
    this.mouseScroll()
    this.accessToRoute()
  },
  methods: {
      checkResetPassword() {
        const user = JSON.parse(localStorage.getItem('current_user'))
        if (user) {
          this.user_name = user.username;
          this.is_need_reset_password = user.is_need_change_password
        }
      },
      handleSeePassword() {
        this.see_password = !this.see_password
      },
      handleResetPassword() {
        this.errorResetPassword = null;

        if (this.new_password.trim().length < 8 || this.confirm_password.trim().length < 8) {
          this.errorResetPassword = 'Пароль повинен бути не менше 8 символів.'
          return;
        }
        const data = {
          'new-password': this.new_password.trim(),
          'repeat-new-password': this.confirm_password.trim()
        }
        this.$api
            .post("users/special-change-password", data)
            .then(res => {
              if(res.data.status) {
                const user = JSON.parse(localStorage.getItem('current_user'));
                user.is_need_change_password = 0;
                localStorage.setItem('current_user', JSON.stringify(user));
                this.is_need_reset_password = false;
              } else {
                this.errorResetPassword = res.data.error
              }
            })
            .error(error => {
              console.log(error)
            })
      },
      getCurrentUserData() {
        if (this.user && (this.user.phone_number || this.user.phone)) {
          return this.user;
        }
        try {
          const stored = localStorage.getItem('current_user');
          if (stored) return JSON.parse(stored);
        } catch (e) {}
        return this.user || null;
      },
      isUserMessageSent() {
        return !!(this._b24UserSentMessage || sessionStorage.getItem('b24_user_sent_message') === 'true');
      },
      onClientSentMessage() {
        this._b24UserSentMessage = true;
        try {
          sessionStorage.setItem('b24_user_sent_message', 'true');
        } catch (e) {}
        // Теперь, когда клиент отправил сообщение, инициируем автоотправку скрытой формы
        this.triggerB24AutoSubmit();
      },
      autoCompleteForm() {
        if (window._b24FormAutoSubmitInit) return;
        window._b24FormAutoSubmitInit = true;

        // 1. Слушаем событие отправки сообщения пользователем через официальный API виджета
        window.addEventListener('onBitrixLiveChat', (event) => {
          const widget = event.detail.widget;
          if (widget && typeof widget.subscribe === 'function') {
            widget.subscribe({
              type: 'userMessage',
              callback: () => {
                this.onClientSentMessage();
              }
            });
          }
        });

        // 2. DOM-обработчики отправки сообщения: нажатие Enter в чате
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            const textarea = e.target && e.target.closest && e.target.closest('.bx-livechat-wrapper textarea, .bx-im-textarea-input');
            if (textarea && textarea.value && textarea.value.trim().length > 0) {
              this.onClientSentMessage();
            }
          }
        }, true);

        // 3. DOM-обработчики отправки сообщения: клик по кнопке/иконке отправки в чате
        document.addEventListener('click', (e) => {
          if (e.target && e.target.closest && e.target.closest('.bx-livechat-wrapper')) {
            const sendBtn = e.target.closest(
              '.bx-im-textarea-send-button, .bx-livechat-send-btn, .bx-messenger-textarea-send-button, [data-icon="send"], button[title*="відправити" i], button[title*="отправить" i], button[title*="send" i]'
            );
            if (sendBtn) {
              this.onClientSentMessage();
            }
          }
        }, true);

        // 4. Инициализация формы Битрикс24
        window.addEventListener('b24:form:init', (event) => {
          const formObj = event.detail.object;
          const user = this.getCurrentUserData();

          // Если пользователя нет или нет обязательного поля (телефона) — НЕ автозаполняем и НЕ отправляем
          const phone = user ? String(user.phone_number || user.phone || '').trim() : '';
          if (!user || !phone) {
            return;
          }

          const formattedPhone = phone.startsWith('+') ? phone : `+380 ${phone}`;

          // Автоподстановка контактов в форму
          formObj.setValues({
            "name": user.first_name || '',
            "last-name": user.last_name || '',
            "email": user.email || '',
            "phone": formattedPhone
          });

          // Скрываем форму (но отправляем только если пользователь уже отправил сообщение!)
          this.triggerB24AutoSubmit();
        });

        // 5. Запуск наблюдателя за появлением элементов в DOM чата
        this.initB24FormObserver();
      },
      triggerB24AutoSubmit() {
        const wrappers = document.querySelectorAll('.bx-imopenlines-form-wrapper');
        if (wrappers.length === 0) return;

        const wrapper = wrappers[wrappers.length - 1];
        const messageItem = wrapper.closest('.bx-im-dialog-list-item') || wrapper;

        // В любом случае сразу скрываем форму в чате
        messageItem.style.setProperty('display', 'none', 'important');
        wrapper.style.setProperty('display', 'none', 'important');

        // КРИТИЧНО: если клиент ещё не отправил сообщение — НЕ отправляем форму!
        if (!this.isUserMessageSent()) {
          return;
        }

        const submitBtn = wrapper.querySelector(
          '.b24-form-btn-block button[type="submit"], .b24-form-btn[type="submit"], button.b24-form-btn, button[type="submit"]'
        );
        const phoneInput = wrapper.querySelector('input[name="phone"], input[type="tel"]');

        if (submitBtn && !wrapper.dataset.b24Submitted) {
          const isReady = !phoneInput || phoneInput.value || phoneInput.classList.contains('b24-form-control-not-empty');

          if (isReady) {
            wrapper.dataset.b24Submitted = 'true';

            const messageId = messageItem.getAttribute('data-message-id');
            if (messageId) {
              try {
                const submitted = JSON.parse(sessionStorage.getItem('b24_submitted_ids') || '[]');
                if (!submitted.includes(messageId)) {
                  submitted.push(messageId);
                  sessionStorage.setItem('b24_submitted_ids', JSON.stringify(submitted));
                }
              } catch (e) {}
            }

            // Небольшая задержка 100мс перед кликом
            setTimeout(() => {
              submitBtn.click();
            }, 100);
          }
        }
      },
      initB24FormObserver() {
        if (this._b24Observer) return;

        this._b24Observer = new MutationObserver((mutations) => {
          const user = this.getCurrentUserData();
          const hasContacts = user && (user.phone_number || user.phone);

          // Если не авторизован — наблюдатель ничего не трогает, чтобы не мешать ручному вводу
          if (!hasContacts) return;

          // Проверяем: если в диалоге появилось новое сообщение от пользователя
          for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
              if (node.nodeType === 1) {
                // Если добавлен элемент сообщения, который не является формой и не разделителем
                if (
                  node.classList &&
                  (node.classList.contains('bx-im-dialog-list-item') || node.classList.contains('bx-im-message')) &&
                  !node.querySelector('.bx-imopenlines-form-wrapper') &&
                  !node.classList.contains('bx-imopenlines-form-wrapper') &&
                  !node.classList.contains('bx-im-dialog-delimiter') &&
                  !node.classList.contains('bx-im-dialog-group')
                ) {
                  // Пользовательское сообщение (не от оператора)
                  if (!node.querySelector('.bx-im-message-avatar') || node.querySelector('.bx-im-message-type-user')) {
                    this.onClientSentMessage();
                  }
                }
              }
            }
          }

          const wrappers = document.querySelectorAll('.bx-imopenlines-form-wrapper');
          wrappers.forEach((wrapper) => {
            const messageItem = wrapper.closest('.bx-im-dialog-list-item') || wrapper;
            const messageId = messageItem.getAttribute('data-message-id');

            // Всегда держим форму скрытой для авторизованного клиента с контактами
            if (messageItem.style.display !== 'none') {
              messageItem.style.setProperty('display', 'none', 'important');
            }
            if (wrapper.style.display !== 'none') {
              wrapper.style.setProperty('display', 'none', 'important');
            }

            // Проверяем, было ли уже отправлено ранее
            let alreadySubmitted = wrapper.dataset.b24Submitted === 'true';
            if (!alreadySubmitted && messageId) {
              try {
                const submitted = JSON.parse(sessionStorage.getItem('b24_submitted_ids') || '[]');
                if (submitted.includes(messageId)) {
                  alreadySubmitted = true;
                  wrapper.dataset.b24Submitted = 'true';
                }
              } catch (e) {}
            }

            if (alreadySubmitted) {
              return;
            }

            // КРИТИЧНО: НЕ отправляем форму, если пользователь еще не отправил сообщение!
            if (!this.isUserMessageSent()) {
              return;
            }

            const phoneInput = wrapper.querySelector('input[name="phone"], input[type="tel"]');
            const submitBtn = wrapper.querySelector(
              '.b24-form-btn-block button[type="submit"], .b24-form-btn[type="submit"], button.b24-form-btn, button[type="submit"]'
            );

            const isFilled = phoneInput && (
              phoneInput.value.trim().length > 0 ||
              phoneInput.classList.contains('b24-form-control-not-empty')
            );

            if (isFilled && submitBtn) {
              wrapper.dataset.b24Submitted = 'true';

              if (messageId) {
                try {
                  const submitted = JSON.parse(sessionStorage.getItem('b24_submitted_ids') || '[]');
                  if (!submitted.includes(messageId)) {
                    submitted.push(messageId);
                    sessionStorage.setItem('b24_submitted_ids', JSON.stringify(submitted));
                  }
                } catch (e) {}
              }

              setTimeout(() => {
                submitBtn.click();
              }, 100);
            }
          });
        });

        this._b24Observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      },
      getUserData() {
          this.$api.get("/account/index").then(response => {
              this.user = response.data.user
          })
      },
    updateRoutTransition(ctx) {
      this.transition = "all 0.3s"
      if (ctx) {
        document.querySelector(".v-sidebar-menu").style.zIndex = "999"
      } else {
        document.querySelector(".v-sidebar-menu").style.zIndex = ""
      }
    },
    snackbarFunc(e) {
      this.snackbarTitle = e.title || e.text || ""
      this.snackbarColor = (e.color === 'success' || !e.color) ? '#269447' : (e.color === 'error' ? '#d32f2f' : e.color)
      this.snackbar = true
    },
    loadingBasket() {
      this.getDataFromApi()
    },
    themeBG(e) {
      this.BG = e
    },
    companyLayout() {
      let l = false
      l = this.$route.meta.company == false && this.currentUser.company_id == 0
      return l
    },
    loadLayout(e) {
      this.ladingLayout = e
      // this.setladingLayoutV({
      //     ctx: e
      // })
    },
    notification(e) {
      this.notificationVal = e
    },
    targetClick() {
      if (this.window.width < 1100 && this.window.width > 768) {
        // this.bodyWith = false
        this.setCollaps({
          ctx: false
        })
      }
    },
    mouseScroll() {
      let timeline = this.$el.querySelectorAll(".v-table__overflow")
      if (timeline !== null) {
        timeline.forEach(function(e) {
          e.onmousedown = () => {
            let pageX = 0
            document.onmousemove = x => {
              if (pageX !== 0) {
                e.scrollLeft = e.scrollLeft + (pageX - x.pageX)
              }
              pageX = x.pageX
            }
            e.onmouseup = () => {
              document.onmousemove = null
              e.onmouseup = null
            }

            e.ondragstart = () => {
              return false
            }
          }
        })
      }
    },
    ...mapActions("params", ["setCollaps", "setMobileView"]),
    ...mapActions("user", ["setData"]),
    ...mapActions("params", ["setSearch"]),
    ...mapActions("basket", ["setOrders"]),
    ...mapActions("basket", ["setProduct", "setIdProduct", "setladingLayoutV", "setBasketModal"]),
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      if (
        this.window.width >= 1100 &&
        window.localStorage.getItem("bodyMin") == "false"
      ) {
        this.$nextTick(() => {
          let lsCtx = false
          lsCtx = window.localStorage.getItem("bodyMin") !== "false"
          this.$store.dispatch("params/setCollaps", {
            ctx: lsCtx
          })
        })
      } else if (this.window.width <= 1100 && this.window.width > 768) {
        this.$store.dispatch("params/setCollaps", { ctx: false })
      } else if (this.window.width > 1100) {
        this.$store.dispatch("params/setCollaps", { ctx: true })
      }

      if (this.window.width <= 768) {
        this.$store.dispatch("params/setMobileView", { ctx: true })
      } else {
        this.$store.dispatch("params/setMobileView", { ctx: false })
      }
    },
    getDataFromApi() {
      this.ladingLayout = true
      let i = this.idProduct.order_id

      if (i == undefined || i == null) {
        i = 0
        // this.setIdProduct({
        //   ctx: i
        // })
      } else {
        i = this.idProduct.order_id
      }
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                          cartProduct(order_id: ` +
            i +
            ` page:1  perPage: 1000 order: "ASC" orderBy: "id"){
                              items{
                                last_update
                                id
                                quantity
                                price
                                discount_price
                                total_sum
                                status
                                newProduct
                                changeQuantity
                                is_delete
                                is_specification
                                is_strict_multiplicity
                                product{
                                  id
                                  sku
                                  name
                                  leftovers_salvi
                                  leftovers_supplier
                                  supplier_delivery_postpone
                                  strict_multiplicity
                                  multiplicity
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
            console.log(items, 'basket items')
          this.setProduct({
            ctx: items
          })
          this.setOrders({
            ctx: response.data.data.cart
          })
          this.ladingLayout = false
        })
    },
    getPermissions() {
      this.$api.get("/account/permissions").then(response => {
        this.$permission.setPermissions(response.data.permissions)
        this.setData({ ctx: JSON.stringify(response.data.user) })
      })
    },
    initPermission() {
      let rbac = {
        viewDashboardOrder: this.$permission.can("viewDashboardOrder"),
        viewDashboardOpenStatistic: this.$permission.can(
          "viewDashboardOpenStatistic"
        ),
        viewDashboardCloseStatistic: this.$permission.can(
          "viewDashboardCloseStatistic"
        ),
        updateProfileAddFields: this.$permission.can("updateProfileAddFields"),
        viewContract: this.$permission.can("viewContract"),
        statusContract: this.$permission.can("statusContract"),
        createContract: this.$permission.can("createContract"),
        updateContract: this.$permission.can("updateContract"),
        viewOnlyContract: this.$permission.can("viewOnlyContract"),
        viewCompanyEntity: this.$permission.can("viewCompanyEntity"),
        statusCompanyEntity: this.$permission.can("statusCompanyEntity"),
        viewOnlyCompanyEntity: this.$permission.can("viewOnlyCompanyEntity"),
        updateCompanyEntity: this.$permission.can("updateCompanyEntity"),
        createCompanyEntity: this.$permission.can("createCompanyEntity"),
        viewLimitation: this.$permission.can("viewLimitation"),
        catalogLimitationCreate: this.$permission.can(
          "catalogLimitationCreate"
        ),
        catalogLimitationUpdate: this.$permission.can(
          "catalogLimitationUpdate"
        ),
        catalogLimitationViewDetail: this.$permission.can(
          "catalogLimitationViewDetail"
        ),
        viewSpecification: this.$permission.can("viewSpecification"),
        createSpecification: this.$permission.can("createSpecification"),
        viewSpecificationDetail: this.$permission.can(
          "viewSpecificationDetail"
        ),
        updateSpecification: this.$permission.can("updateSpecification"),
        changeStatusSpecification: this.$permission.can(
          "changeStatusSpecification"
        ),
        viewLocations: this.$permission.can("viewLocations"),
        createLocations: this.$permission.can("createLocations"),
        statusLocations: this.$permission.can("statusLocations"),
        updateLocations: this.$permission.can("updateLocations"),
        viewOnlyLocations: this.$permission.can("viewOnlyLocations"),
        viewLocationTree: this.$permission.can("viewLocationTree"),
        viewCostCenter: this.$permission.can("viewCostCenter"),
        updateCostCenter: this.$permission.can("updateCostCenter"),
        createCostCenter: this.$permission.can("createCostCenter"),
        viewUser: this.$permission.can("viewUser"),
        createUser: this.$permission.can("createUser"),
        updateUser: this.$permission.can("updateUser"),
        statusUser: this.$permission.can("statusUser"),
        viewManager: this.$permission.can("viewManager"),
        createManager: this.$permission.can("createManager"),
        updateManager: this.$permission.can("updateManager"),
        updateManagerStatus: this.$permission.can("updateManagerStatus"),
        viewOnlyManager: this.$permission.can("viewOnlyManager"),
        viewRoles: this.$permission.can("viewRoles"),
        createRoles: this.$permission.can("createRoles"),
        viewOnlyRoles: this.$permission.can("viewOnlyRoles"),
        updateRoles: this.$permission.can("updateRoles"),
        updateManagerRoles: this.$permission.can("updateManagerRoles"),
        changeStatusRoles: this.$permission.can("changeStatusRoles"),
        changeStatusManagerRoles: this.$permission.can(
          "changeStatusManagerRoles"
        ),
        viewSupplier: this.$permission.can("viewSupplier"),
        updateSupplier: this.$permission.can("updateSupplier"),
        createSupplier: this.$permission.can("createSupplier"),
        viewCoordination: this.$permission.can("viewCoordination"),
        createCoordination: this.$permission.can("createCoordination"),
        updateCoordination: this.$permission.can("updateCoordination"),
        viewOnlyCoordination: this.$permission.can("viewOnlyCoordination"),
        changeOrderCoordination: this.$permission.can(
          "changeOrderCoordination"
        ),
        changeStatusCoordination: this.$permission.can(
          "changeStatusCoordination"
        ),
        deleteCoordination: this.$permission.can("deleteCoordination"),
        viewOrder: this.$permission.can("viewOrder"),
        viewProduct: this.$permission.can("viewProduct"),
        createOrder: this.$permission.can("createOrder"),
        viewOrderDetail: this.$permission.can("viewOrderDetail"),
        updateOrder: this.$permission.can("updateOrder"),
        coordinationApproveOrder: this.$permission.can(
          "coordinationApproveOrder"
        ),
        changeStatusOrder: this.$permission.can("changeStatusOrder"),
        changeAnyStatusOrder: this.$permission.can("changeAnyStatusOrder"),
        viewBudgets: this.$permission.can("viewBudgets"),
        createBudget: this.$permission.can("createBudget"),
        updateBudget: this.$permission.can("updateBudget"),
        detailBudget: this.$permission.can("detailBudget"),
        deleteBudget: this.$permission.can("deleteBudget"),
        settingsCompany: this.$permission.can("settingsCompany"),
        administrationChangeCompany: this.$permission.can(
          "administrationChangeCompany"
        ),
        createCompany: this.$permission.can("createCompany"),
        receiveMessagesSupport: this.$permission.can("receiveMessagesSupport"),
        viewAndCreateCostOrder: this.$permission.can("viewAndCreateCostOrder"),
        viewAndCreateLocationOrder: this.$permission.can(
          "viewAndCreateLocationOrder"
        ),
        viewAndCreateAllOrder: this.$permission.can("viewAndCreateAllOrder"),
        viewCatalog: this.$permission.can("viewCatalog"),
        orderModeration: this.$permission.can("orderModeration"),
        orderShowBtn: this.$permission.can("orderShowBtn"),
        catalogShowBtn: this.$permission.can("catalogShowBtn"),
        viewDashboard: this.$permission.can("viewDashboard"),
        uuidCostCenter: this.$permission.can("uuidCostCenter"),
        orderApproveReceive: this.$permission.can("orderApproveReceive"),
        orderDuplicate: this.$permission.can("orderDuplicate"),
        orderGoBack: this.$permission.can("orderGoBack"),
        orderChangeProduct: this.$permission.can("orderChangeProduct"),
        importModel: this.$permission.can("importModel"),
        managementEmail: this.$permission.can("managementEmail"),
        managementUsers: this.$permission.can("managementUsers"),
        editOnApproveOrder: this.$permission.can("editOnApproveOrder"),
        managementProductView: this.$permission.can("managementProductView"),
        managementProductCreate: this.$permission.can(
          "managementProductCreate"
        ),
        managementProductUpdate: this.$permission.can(
          "managementProductUpdate"
        ),
        managementImportCatalog: this.$permission.can(
          "managementImportCatalog"
        ),
        managementImportPrice: this.$permission.can("managementImportPrice"),
        managementImportImage: this.$permission.can("managementImportImage"),
        managementProductBuffer: this.$permission.can("managementProductBuffer")
      }
      this.$changeRbac(rbac)
      this.$root.rbac = rbac
    },
    accessToRoute() {
      let isset = this.$route.matched.some(record => record.meta.rule)
      let isset2 = this.$route.matched.some(record => record.meta.rule2)
      if (isset && isset2) {
        let number = 1
        if (!this.$root.rbac[this.$route.meta.rule]) {
          number -= 1
        }
        if (!this.$root.rbac[this.$route.meta.rule2]) {
          number -= 1
        }
        if (number < 0) {
          this.$router.push("/lk-base-info")
        }
      } else if (isset) {
        if (!this.$root.rbac[this.$route.meta.rule]) {
          if (this.$root.rbac["viewOrder"]) {
            this.$router.push("/orders")
          } else {
            this.$router.push("/lk-base-info")
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .change {
    position: fixed;
    z-index: 1000000000;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;

    &__input-see {
      position: absolute;
      top: 6px;
      right: 5px;
      padding: 5px;
      cursor: pointer;
    }

    &__error {
      padding-bottom: 10px;
      color: orangered;
    }

    &__wrap {
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      max-width: 500px;
    }

    &__title {
      font-size: 30px;
      font-weight: 700;
      padding-bottom: 15px;
    }

    &__text {
      p {
        margin-bottom: 15px;
        color: #6c6c6c;
      }
    }

    &__input-container {
      width: 100%;
      padding-bottom: 10px;
      position: relative;

      input {
        width: 100%;
        padding: 10px 20px;
        border: 1px solid #6c6c6c;
        border-radius: 5px;
      }
    }

    &__button {
      width: 100%;
      background: #19b200;
      padding: 15px;
      font-size: 18px;
      color: #fff;
      border: none;
      outline: none;
      border-radius: 10px;
    }
  }
html {
  overflow-y: hidden;
}
#blurSvg {
  position: absolute;
  z-index: -1;
}
.width__span {
  position: absolute;
  left: 25%;
  transform: translateX(-50%);
  top: 70px;
  background-color: black;
  color: white;
}

.list-enter-active,
.list-leave-active,
.list-move {
  transition: 600ms;
  transition-property: opacity, transform;
}

.list-enter {
  transition: 100ms;
  opacity: 0;
  transform: translateX(400px);
}

.list-enter-to {
  opacity: 1;
  transition: 0.5s;
  transform: translateX(0);
}

.list-leave-active {
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform-origin: center top;
}

.loadLayout-enter-active,
.loadLayout-leave-active,
.loadLayout-move {
  transition: 0.3s;
  transition-property: opacity, transform;
}

.loadLayout-enter {
  transition: 100ms;
  opacity: 0;
  z-index: -1;
}

.loadLayout-enter-to {
  opacity: 1;
  visibility: visible;
  transition: 1s;
}

.loadLayout-leave-active {
}

.loadLayout-leave-to {
  opacity: 0;
  transition: 200ms;
  visibility: hidden;
}
.section-head__logo {
  display: flex;
  align-items: center;
  position: fixed;
  left: 80px;
  top: 17px;

  @media (max-width: 1100px) {
    display: none;
  }
}
</style>
