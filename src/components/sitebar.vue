<template lang="pug">
    sidebar-menu( :menu="menu" :header="header")
</template>

<script>
import SidebarMenu from "./vue-sidebar-menu/src/components/SidebarMenu"
import headerSidebar from "./vue-sidebar-menu/src/components/headerSidebar"
import { mapGetters, mapActions } from "vuex"

export default {
  name: "Sitebar",
  components: {
    SidebarMenu,
    headerSidebar
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["notification"],

  data() {
    return {
      menu: [],
      header: []
    }
  },
  computed: {
    ...mapGetters("permissionStore", ["getPermission"])
  },
  watch: {
    getPermission() {
      this.dataMenu()
    },
    notification() {
      this.dataMenu()
    }
  },
  created() {
    this.dataMenu()
  },
  methods: {
    dataMenu() {
      this.header = [
        {
          header: true,
          // title: 'site bar',
          component: headerSidebar,
          notification: this.notification,
          visibleOnCollapse: true
          // class:''
          // attributes: {}
        }
      ]
      this.menu = [
        // {
        //   href: "/catalog",
        //   title: "Каталог",
        //   icon: "icon-folder",
        //   disabled: !this.$root.rbac.viewCatalog
        // },
        {
          href: "/lk-index",
          title: "Дошка",
          icon: "icon-dosh",
          disabled: !this.$root.rbac.viewDashboard
          // class:''
          // attributes: {}
          // alias: '/path'
          /*
                        badge: {
                            text: 'new',
                            // class:''
                            // attributes: {}
                        }
                        */
        },
        {
          href: "/lk-base-info",
          title: "Основна інформація",
          icon: "icon-account"
        },
        {
          href: "/contracts",
          title: "Договори",
          icon: "icon-doc",
          disabled: !this.$root.rbac.viewContract
        },
        {
          href: "/directory-legal",
          title: "Довідник Юр. осіб",
          icon: "icon-shared",
          disabled: !this.$root.rbac.viewCompanyEntity
        },
        {
          href: "/specification",
          title: "Специфікація",
          disabled: !this.$root.rbac.viewSpecification,
          icon: "icon-cash"
        },
        {
          href: "",
          title: "Локації",
          icon: "icon-local_shipping",
          disabled:
            !this.$root.rbac.viewLocations &&
            !this.$root.rbac.viewCostCenter &&
            !this.$root.rbac.viewLocationTree,
          child: [
            {
              href: "/list-location",
              title: "Список локацій",
              disabled: !this.$root.rbac.viewLocations
            },
            {
              href: "/list-cost-center",
              title: "Список кост-центрів",
              disabled: !this.$root.rbac.viewCostCenter
            },
            {
              href: "/tree-location",
              title: "Дерево компаній",
              disabled: !this.$root.rbac.viewLocationTree
            }
          ]
        },
        {
          href: "",
          title: "Користувачі",
          icon: "icon-supervisor_account",
          disabled:
            !this.$root.rbac.viewUser &&
            !this.$root.rbac.viewManager &&
            !this.$root.rbac.viewRoles &&
            !this.$root.rbac.viewSupplier,
          child: [
            {
              href: "/users",
              title: "Список користувачів",
              disabled: !this.$root.rbac.viewUser
            },
            {
              href: "/users-manager",
              title: "Список менеджерів",
              disabled: !this.$root.rbac.viewManager
            },
            {
              href: "/users-role",
              title: "Список ролей",
              disabled: !this.$root.rbac.viewRoles
            },
            {
              href: "/suppliers",
              title: "Постачальники",
              disabled: !this.$root.rbac.viewSupplier
            }
          ]
        },
        {
          href: "/matching",
          title: "Узгодження",
          icon: "icon-ballot",
          disabled: !this.$root.rbac.viewCoordination
        },
        {
          href: "/orders",
          title: "Замовлення",
          icon: "icon-box",
          disabled: !this.$root.rbac.viewOrder
        },
        {
          href: "/budget",
          title: "Бюджети",
          icon: "icon-calc",
          disabled: !this.$root.rbac.viewBudgets
        },
        {
          href: "/import",
          title: "Імпорт",
          icon: "get_app",
          disabled: !this.$root.rbac.importModel
        },
        {
          href: "",
          title: "Управління",
          icon: "icon-supervisor_account",
          disabled:
            !this.$root.rbac.managementProductView &&
            !this.$root.rbac.managementEmail &&
            !this.$root.rbac.managementUsers,
          child: [
            {
              href: "/banners",
              title: "Управління банерами",
              disabled: !this.$root.rbac.managementProductView
            },
            {
              href: "/banners-history-elastic",
              title: "Управління запитами",
              disabled: !this.$root.rbac.managementProductView
            },
            {
              href: "/management/product",
              title: "Управління товарами",
              disabled: !this.$root.rbac.managementProductView
            },
            // {
            //     href: '/management/category',
            //     title: 'Категоріями',
            //     disabled: !this.$root.rbac.importModel,
            // },
            {
              href: "/management/email/admin-email",
              title: "Управління заявками",
              disabled: !this.$root.rbac.managementEmail
            },
            {
              href: "/management/users",
              title: "Управління користувачами",
              disabled: !this.$root.rbac.managementUsers
            },
            {
              href: "/management/landings",
              title: "Промо-сторінки",
              disabled: !this.$root.rbac.managementProductView
            }
          ]
        },
        {
          href: "/logout",
          title: "Вийти",
          icon: "v-icon material-icons exit_to_app",
          disabled: false
        }
      ]
    },
    // onCollapse(collapsed) {
    //   this.collapsed = collapsed
    //   this.setCollaps({
    //     collapsed: collapsed
    //   })
    // },
    ...mapGetters("params", ["collapsed"]),
    ...mapActions("params", ["setCollaps"])
  }
}
</script>

<style lang="sass">
.v-sidebar-menu .vsm-item.active-item > .vsm-link, .v-sidebar-menu .vsm-item.parent-active-item > .vsm-link
    font-weight: 400
    .v-sidebar-menu
        background-color: #212121
        bottom: 0px
        min-height: 100vh
        .first-item
            i:before
                color: white
            &.active-item
                i:before
                    color: #64DD17
</style>
