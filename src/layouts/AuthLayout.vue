<template lang="pug">
    div(data-app="true")
        clearCacheNotification
        chat(v-show="!$root.rbac.receiveMessagesSupport")
        Header(:button="button" v-if="$router.name == 'home'")
        .container-Home
            .section.black__theme
                router-view(@oneButton="oneButton")
        v-snackbar(v-model="snackbar" dismissible type="success" :color='snackbarColor' :top="true")
            span {{ snackbarTitle }}
            v-btn(color="pink" flat icon @click="snackbar = false")
                v-icon close
</template>

<script>
import Header from "@/components/Header.vue"
import chat from "../components/vue-chat/chat"
import clearCacheNotification from "../components/clearCacheNotification"


export default {
  name: "AuthLayout",
  components: {
    Header,
    chat,
      clearCacheNotification
  },
  data() {
    return {
      snackbar: false,
      snackbarTitle: "",
      snackbarColor: "#4caf50",
      button: {
        name: "Залишити заявку",
        link: "/registration"
      }
    }
  },
    mounted() {
        var script = document.createElement('script');
        script.setAttribute("data-b24-form", "click/35/9qc2mj");
        script.setAttribute("data-skip-moving", "true");

        script.append(" (function(w,d,u){\n" +
            "                var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);\n" +
            "                var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);\n" +
            "        })(window,document,'https://cdn.bitrix24.eu/b7849145/crm/form/loader_35.js');");
        var button = document.createElement('button')
        button.classList.add('b24-web-form-popup-btn-1')
        document.body.appendChild(script);
        document.body.appendChild(button);

        var script2 = document.createElement('script');

        script2.append(" (function(w,d,u){\n" +
            "                var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);\n" +
            "                var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);\n" +
            "        })(window,document,'https://cdn.bitrix24.eu/b7849145/crm/site_button/loader_11_hlll13.js');");

        document.head.appendChild(script2);

        window.addEventListener('b24:form:init', (event) => {
            window._b24LastFormObj = event.detail.object;
        });
    },
  created() {
    document.querySelector("body").classList = "auth__layout"
    this.$loadingBus.$on("snackbar", this.snackbarFunc)
  },
  methods: {
    oneButton(e) {
      this.button = e
    },
    snackbarFunc(e) {
      this.snackbarTitle = e.title
      this.snackbarColor = e.color
      this.snackbar = true
    }
  }
}
</script>

<style scoped>
html {
  overflow-y: auto;
}
.section {
  width: 100%;
}
    .b24-web-form-popup-btn-1 {
        display: none;
    }
</style>
