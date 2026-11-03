import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"
import {TokenService} from "./services/storage.service"
import Permission from "./services/permission.service"

Vue.use(Router)

const profileCompleted = !Permission.profileCompleted()
const loggedIn = !!TokenService.getToken()

const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
            meta: {
                company: true,
                title: "Головна",
                public: true, // Allow access to even if not logged in
                layout: "auth"
            }
        },
        {
            path: "/lk-index",
            name: "lk-index",
            meta: {
                company: true,
                title: "Дошка",
                layout: "main",
                rule: "viewDashboard"
            },
            component: () => import("./views/lk-index.vue")
        },
        {
            path: "/lk-base-info",
            name: "lk-base-info",
            meta: {
                company: true,
                title: "Основна інформація",
                layout: "main"
            },
            component: () => import("./views/lk-base-info.vue")
        },
        {
            path: "/setting-company-page",
            name: "setting-company-page",
            meta: {
                company: false,
                title: "Налаштування компанії",
                layout: "main"
            },
            component: () => import("./views/setting-company-page.vue")
        },
        {
            path: "/success-order",
            name: "success-order",
            meta: {
                company: false,
                title: "Дякуємо за замовлення",
                layout: "main"
            },
            component: () => import("./views/orders/success-order.vue")
        },
        {
            path: "/admin-setting-company",
            name: "admin-setting-company",
            meta: {
                company: true,
                title: "Вибір підприємства",
                layout: "main",
                rule: "administrationChangeCompany"
            },
            component: () => import("./views/admin-setting-company.vue")
        },
        {
            path: "/login",
            name: "login",
            meta: {
                company: true,
                title: "Вхід",
                layout: "auth",
                public: true, // Allow access to even if not logged in
                onlyWhenLoggedOut: true
            },
            component: () => import("./views/autotiztion.vue")
        },
        {
            path: "/recovery-password",
            name: "recovery__password",
            meta: {
                company: true,
                title: "Відновлення паролю",
                layout: "auth",
                public: true
            },
            component: () => import("./views/recovery__password.vue")
        },
        {
            path: "/contracts",
            name: "contracts",
            meta: {
                company: false,
                title: "Договори",
                layout: "main",
                rule: "viewContract"
            },
            component: () => import("./views/contracts/contracts.vue")
        },
        {
            path: "/budget",
            name: "budget",
            meta: {
                company: false,
                title: "Бюджети",
                layout: "main",
                rule: "viewBudgets"
            },
            component: () => import("./views/budget/budget.vue")
        },
        {
            path: "/budget/:id",
            name: "budget-detail",
            meta: {
                company: false,
                title: "Детально про бюджет",
                layout: "main",
                rule: "detailBudget"
            },
            props: true,
            component: () => import("./views/budget/budget-detail.vue")
        },
        {
            path: "/directory-legal",
            name: "directory-legal",
            meta: {
                company: false,
                title: "Довідник юридичних осіб",
                layout: "main",
                rule: "viewCompanyEntity"
            },
            component: () =>
                import("./views/directory-legal/directory-legal-index.vue")
        },
        {
            path: "/registration",
            name: "registration",
            meta: {
                company: true,
                title: "Реєстрація",
                layout: "auth",
                public: true, // Allow access to even if not logged in
                onlyWhenLoggedOut: true
            },
            component: () => import("./views/registration.vue")
        },
        {
            path: "/list-location",
            name: "list_location",
            meta: {
                company: false,
                title: "Список локацій",
                layout: "main",
                rule: "viewLocations"
            },
            component: () => import("./views/location/list_location.vue")
        },
        {
            path: "/list-cost-center",
            name: "list_cost_center",
            meta: {
                company: false,
                title: "Список кост-центрів",
                layout: "main",
                rule: "viewCostCenter"
            },
            component: () => import("./views/location/list_cost_center.vue")
        },
        {
            path: "/specification",
            name: "specification",
            meta: {
                company: false,
                title: "Специфікація",
                layout: "main",
                rule: "viewSpecification"
            },
            component: () => import("./views/specification/specification.vue")
        },
        {
            path: "/specification/create",
            name: "specification-create",
            meta: {
                company: false,
                title: "Створення специфікації",
                layout: "main",
                rule: "createSpecification"
            },
            component: () => import("./views/specification/catalog/catalog.vue")
        },
        {
            path: "/specification/create/:id",
            name: "specification-add-product",
            meta: {
                company: false,
                title: "Оновлення специфікації",
                layout: "main",
                rule: "updateSpecification"
            },
            props: true,
            component: () => import("./views/specification/catalog/catalog.vue")
        },
        {
            path: "/specification/:id",
            name: "specification-detail",
            meta: {
                company: false,
                title: "Деталі специфікації",
                layout: "main",
                rule: "viewSpecificationDetail"
            },
            props: true,
            component: () => import("./views/specification/specification__detail.vue")
        },
        {
            path: "/users",
            name: "users",
            meta: {
                company: false,
                title: "Список користувачів",
                layout: "main",
                rule: "viewUser"
            },
            component: () => import("./views/users/users.vue")
        },
        {
            path: "/users-manager",
            name: "users-manager",
            meta: {
                company: true,
                title: "Список менеджерів",
                layout: "main",
                rule: "viewManager"
            },
            component: () => import("./views/users/users__manager/users.vue")
        },
        {
            path: "/verify-email",
            name: "verify-email",
            meta: {
                company: true,
                title: "Підтвердження email",
                layout: "auth",
                public: true, // Allow access to even if not logged in
                onlyWhenLoggedOut: true
            },
            component: () => import("./views/verify-email.vue")
        },
        {
            path: "/reset-password",
            name: "reset__password",
            meta: {
                company: true,
                title: "Відновлення пароля",
                layout: "auth",
                public: true, // Allow access to even if not logged in
                onlyWhenLoggedOut: true
            },
            component: () => import("./views/reset__password.vue")
        },
        {
            path: "/users-role",
            name: "users__role",
            meta: {
                company: true,
                title: "Список ролей",
                layout: "main",
                rule: "viewRoles"
            },
            component: () => import("./views/users/users__role/users__role.vue")
        },
        {
            path: "/suppliers",
            name: "suppliers",
            meta: {
                company: true,
                title: "Постачальники",
                layout: "main",
                rule: "viewSupplier"
            },
            component: () => import("./views/users/suppliers/suppliers.vue")
        },
        {
            path: "/matching",
            name: "matching",
            meta: {
                company: false,
                title: "Узгодження",
                layout: "main",
                rule: "viewCoordination"
            },
            component: () => import("./views/matching/matching.vue")
        },
        {
            path: "/orders",
            name: "orders",
            meta: {
                company: false,
                title: "Замовлення",
                layout: "main",
                rule: "viewOrder"
            },
            component: () => import("./views/orders/orders.vue")
        },
        {
            path: "/orders/add-product/:id",
            name: "order-add-product",
            props: true,
            meta: {
                company: false,
                title: "Додавання товару до замовлення",
                layout: "main",
                rule: "viewProduct"
            },
            component: () => import("./views/catalog/catalog.vue")
        },
        {
            path: "/orders/create-order/",
            name: "order-create",
            props: true,
            meta: {
                company: false,
                title: "Створення замовлення",
                layout: "main",
                rule: "viewProduct"
            },
            component: () => import("./views/orders/create-order.vue")
        },
        {
            path: "/unsubscribe-mails",
            name: "unsubscribe-mails",
            props: true,
            meta: {
                company: false,
                title: "Відписатися від повідомлень",
                layout: "main",
                rule: "viewProduct"
            },
            component: () => import("./views/unsubscribe-mails.vue")
        },
        // {
        //     path: "/order/:id",
        //     name: "order__page",
        //     meta: {
        //         company: false,
        //         title: "Деталі замовлення",
        //         layout: "main",
        //         rule: "viewOrderDetail"
        //     },
        //     props: true,
        //     component: () => import("./views/orders/order__page.vue")
        // },
        {
          path: "/must-see",
          name: "must_see",
          meta: {
            company: false,
            title: "Варто придивитися",
            layout: "main",
            rule: "viewCatalog"
          },
          component: () => import("./views/catalog/catalog.vue")
        },
      {
        path: "/popular",
        name: "popular",
        meta: {
          company: false,
          title: "Популярне для офісу",
          layout: "main",
          rule: "viewCatalog"
        },
        component: () => import("./views/catalog/catalog.vue")
      },
        {
            path: "/catalog",
            name: "catalog",
            meta: {
                company: false,
                title: "Каталог",
                layout: "main",
                rule: "viewCatalog"
            },
            component: () => import("./views/category-main.vue")
        },
        {
            path: "/catalog/:category_1",
            name: "catalogCategory",
            meta: {
                company: false,
                title: "Каталог",
                layout: "main",
                // rule: "viewCatalog"
            },
            component: () => import("./views/catalog/catalog_slider.vue")
        },
        {
            path: "/catalog/:category_1/:category_2",
            name: "catalogCategory",
            meta: {
                company: false,
                title: "Каталог",
                layout: "main",
                // rule: "viewCatalog"
            },
            component: () => import("./views/catalog/catalog_slider.vue")
        },
        {
            path: "/catalog/:category_1/:category_2/:category_3",
            name: "catalogCategory",
            meta: {
                company: false,
                title: "Каталог",
                layout: "main",
                // rule: "viewCatalog"
            },
            component: () => import("./views/catalog/catalog.vue")
        },
        {
            path: "/search",
            name: "Search",
            meta: {
                company: false,
                title: "Пошук",
                layout: "main",
                // rule: "viewCatalog"
            },
            component: () => import("./views/catalog/search.vue")
        },
        {
            path: "/notification",
            name: "notification",
            meta: {
                company: true,
                title: "Сповіщення",
                layout: "main"
            },
            component: () => import("./views/notification/notification.vue")
        },
        {
            path: "/tree-location",
            name: "tree__location",
            meta: {
                company: false,
                title: "Дерево локацій",
                layout: "main",
                rule: "viewLocationTree"
            },
            component: () =>
                import("./views/location/tree__location/tree__location.vue")
        },
        {
            path: "*",
            name: "page_404",
            meta: {
                company: true,
                title: "Упс, помилка",
                public: true,
                layout: "auth"
            },
            component: () => import("./views/404.vue")
        },
        {
            path: "/logout",
            name: "logout",
            meta: {
                company: true,
                title: "Вихід",
                layout: "main"
            },
            component: () => import("./views/logout.vue")
        },
        {
            path: "/choose-company",
            name: "choose-company",
            meta: {
                company: true,
                title: "не встановлене підприємство",
                layout: "main"
            },
            component: () => import("./components/choose-company.vue")
        },
        {
            path: "/import",
            name: "import_entity",
            meta: {
                company: false,
                title: "Імпорт моделей",
                layout: "main",
                rule: "importModel"
            },
            component: () => import("./views/import/upload.vue")
        },
        {
            path: "/management/product",
            name: "management_product",
            meta: {
                company: true,
                title: "Управління товарами",
                layout: "main",
                rule: "managementProductView"
            },
            component: () => import("./views/management/product/product.vue")
        },
        {
          path: "/banners",
          name: "management_banner",
          meta: {
            company: true,
            title: "Управління банерами",
            layout: "main",
            rule: "managementProductView"
          },
          component: () => import("./views/management/banner/list.vue")
        },
        {
          path: "/banners-history-elastic",
          name: "management_search",
          meta: {
            company: true,
            title: "Управління запитами",
            layout: "main",
            rule: "managementProductView"
          },
          component: () => import("./views/management/search/list.vue")
        },
        {
            path: "/management/email/admin-email",
            name: "admin-email",
            meta: {
                company: true,
                title: "Управління заявками",
                layout: "main",
                rule: "managementEmail"
            },
            component: () => import("./views/management/email/admin-email.vue")
        },
        {
            path: "/management/users",
            name: "management_users",
            meta: {
                company: true,
                title: "Управління користувачами",
                layout: "main",
                rule: "managementUsers"
            },
            component: () => import("./views/management/users/user.vue")
        },
        {
            path: "/management/landings",
            name: "management_landings",
            meta: {
                company: true,
                title: "Промо-сторінки",
                layout: "main",
                rule: "managementProductView"
            },
            component: () => import("./views/management/landing/index.vue")
        },
    ]
})
router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.title)
    const isPublic = to.matched.some(record => record.meta.public)
    const onlyWhenLoggedOut = to.matched.some(
        record => record.meta.onlyWhenLoggedOut
    )

    if (nearestWithTitle)
        document.title = nearestWithTitle.meta.title + " - Salvi"

    if (!isPublic && !loggedIn) {
        return next({
            path: "/login",
            query: {redirect: to.fullPath} // Store the full path to redirect the user to after login
        })
    }

    // Do not allow user to visit login page or register page if they are logged in
    if (loggedIn && onlyWhenLoggedOut) {
        let path = "/catalog"
        if (to.query.redirect != undefined) {
            path = to.query.redirect
        }
        return next({
            path: path
        })
    }
    if (loggedIn && profileCompleted && to.path != "/lk-base-info") {
        return next("/lk-base-info")
    }

    next()
})

export default router
