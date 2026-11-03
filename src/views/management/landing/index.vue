<template>
  <div class="section__content landing-management">
    <div class="section__content__head">
      <div>
        <div class="caption">Управління промо-сторінками</div>
        <div class="subcaption">Новорічні подарункові набори для бізнесу</div>
      </div>
      <div class="head-actions">
        <v-btn
          v-if="settings.urls && settings.urls.live"
          dark
          small
          class="head-btn-live"
          style="background-color: #269447 !important; color: #ffffff !important; font-weight: 600; border-radius: 4px;"
          @click="openUrl(settings.urls.live)"
        >
          <v-icon left small color="#ffffff">open_in_new</v-icon>
          <span style="color: #ffffff !important; font-weight: 600;">Бойова сторінка</span>
        </v-btn>
      </div>
    </div>

    <!-- Табы -->
    <v-tabs v-model="activeTab" color="transparent" slider-color="#269447" class="landing-tabs">
      <v-tab href="#tab-files">
        <v-icon left small>folder</v-icon>
        Завантаження файлів та налаштування
      </v-tab>
      <v-tab href="#tab-orders">
        <v-icon left small>receipt</v-icon>
        Заявки з форми
        <v-badge v-if="ordersTotal > 0" color="#269447" class="ml-2">
          <span slot="badge">{{ ordersTotal }}</span>
        </v-badge>
      </v-tab>
      <v-tab href="#tab-menu">
        <v-icon left small>menu</v-icon>
        Пункти меню каталогу
        <v-badge v-if="menuItems && menuItems.length > 0" color="#0288d1" class="ml-2">
          <span slot="badge">{{ menuItems.length }}</span>
        </v-badge>
      </v-tab>

      <!-- Вкладка 1: Файлы и настройки -->
      <v-tab-item value="tab-files">
        <div class="tab-content pt-4">
          <!-- Блок основных настроек -->
          <v-card class="mb-4 settings-card elevation-1">
            <v-card-text>
              <div class="card-title mb-3">
                <v-icon small class="mr-1" color="#269447">settings</v-icon>
                Загальні налаштування сторінки
              </div>
              <v-layout row wrap align-center>
                <v-flex xs12 sm12 md5 class="pr-md-3 mb-2">
                  <v-text-field
                    v-model="settings.manager_email"
                    label="Email менеджера для отримання заявок"
                    placeholder="manager@salvi.ua"
                    hint="На цю адресу надсилатимуться всі заповнені заявки з повним складом набору"
                    persistent-hint
                    outline
                    dense
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="px-md-2 mb-2">
                  <v-switch
                    v-model="settings.active"
                    :label="settings.active ? 'Сторінка активна (доступна усім)' : 'Сторінка вимкнена'"
                    color="#269447"
                    :loading="savingSettings"
                    @change="onActiveSwitchChange"
                  ></v-switch>
                </v-flex>
                <v-flex xs12 sm6 md3 class="text-xs-right text-sm-right mb-2">
                  <v-btn
                    dark
                    :loading="savingSettings"
                    @click="saveSettings"
                    class="save-btn"
                    style="background-color: #269447 !important; color: #ffffff !important; border: none !important;"
                  >
                    <v-icon left small color="#ffffff">save</v-icon>
                    <span style="color: #ffffff !important; font-weight: 600;">Зберегти</span>
                  </v-btn>
                </v-flex>
              </v-layout>

              <!-- Посилання для швидкого доступу -->
              <v-divider class="my-3"></v-divider>
              <div class="links-block">
                <div class="link-item">
                  <span class="link-label">Посилання:</span>
                  <a :href="settings.urls ? settings.urls.live : '#'" target="_blank" class="link-val">
                    {{ settings.urls ? settings.urls.live : '—' }}
                  </a>
                  <v-btn icon small flat @click="copyText(settings.urls ? settings.urls.live : '')" title="Скопіювати">
                    <v-icon small>file_copy</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Скрытые инпуты для загрузки -->
          <input
            type="file"
            ref="inputGuest"
            accept=".html,.htm"
            style="display:none"
            @change="handleFileUpload($event, 'guest')"
          />
          <input
            type="file"
            ref="inputAuth"
            accept=".html,.htm"
            style="display:none"
            @change="handleFileUpload($event, 'auth')"
          />

          <!-- Карточки вариантов загрузки -->
          <v-layout row wrap class="version-cards">
            <!-- 1. ДЛЯ ГОСТЕЙ (НЕАВТОРИЗОВАНІ) -->
            <v-flex xs12 md6 class="pr-md-2 mb-3">
              <v-card class="file-card h-100 elevation-1 border-top-info">
                <v-card-text>
                  <div class="card-badge badge-info">
                    <v-icon small color="#0288d1" class="mr-1">public</v-icon>
                    Для гостей (неавторизовані)
                  </div>
                  <div class="card-desc">
                    Відображається усім звичайним користувачам (або в режимі інкогніто) за основним посиланням.
                  </div>

                  <div class="file-status-box my-3">
                    <div v-if="files.guest && files.guest.exists" class="file-ok">
                      <v-icon color="success" class="mr-2">check_circle</v-icon>
                      <div class="file-meta">
                        <div class="file-name" :title="files.guest.name">{{ files.guest.name }}</div>
                        <div class="file-info">{{ files.guest.size_formatted }} • Оновлено: {{ files.guest.updated_at }}</div>
                      </div>
                    </div>
                    <div v-else class="file-empty">
                      <v-icon color="grey" class="mr-2">cloud_off</v-icon>
                      <div>Файл ще не завантажено</div>
                    </div>
                  </div>

                  <div class="card-actions-box">
                    <v-btn
                      dark
                      class="upload-btn upload-btn--info"
                      style="background-color: #0288d1 !important; color: #ffffff !important; border: none !important;"
                      :loading="uploading.guest"
                      @click="$refs.inputGuest.click()"
                    >
                      <v-icon left small color="#ffffff">cloud_upload</v-icon>
                      <span style="color: #ffffff !important; font-weight: 600;">Завантажити HTML для гостей</span>
                    </v-btn>
                    <v-btn
                      v-if="files.guest && files.guest.exists && settings.urls && settings.urls.live"
                      flat
                      small
                      class="preview-btn mt-2"
                      style="color: #0288d1 !important; font-weight: 600;"
                      @click="openUrl(settings.urls.live)"
                    >
                      <v-icon left small color="#0288d1">visibility</v-icon>
                      <span style="color: #0288d1 !important; font-weight: 600;">Переглянути</span>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>

            <!-- 2. ДЛЯ АВТОРИЗОВАНИХ КЛІЄНТІВ -->
            <v-flex xs12 md6 class="pl-md-2 mb-3">
              <v-card class="file-card h-100 elevation-1 border-top-success">
                <v-card-text>
                  <div class="card-badge badge-success">
                    <v-icon small color="#269447" class="mr-1">person</v-icon>
                    Для авторизованих клієнтів
                  </div>
                  <div class="card-desc">
                    Відображається залогіненим клієнтам. Контактні дані клієнта (ПІБ, телефон, email, компанія) <b>підставляються в форму автоматично</b>.
                  </div>

                  <div class="file-status-box my-3">
                    <div v-if="files.auth && files.auth.exists" class="file-ok">
                      <v-icon color="success" class="mr-2">check_circle</v-icon>
                      <div class="file-meta">
                        <div class="file-name" :title="files.auth.name">{{ files.auth.name }}</div>
                        <div class="file-info">{{ files.auth.size_formatted }} • Оновлено: {{ files.auth.updated_at }}</div>
                      </div>
                    </div>
                    <div v-else class="file-empty">
                      <v-icon color="grey" class="mr-2">cloud_off</v-icon>
                      <div>Файл ще не завантажено (буде показано гостьову версію)</div>
                    </div>
                  </div>

                  <div class="card-actions-box">
                    <v-btn
                      dark
                      class="upload-btn upload-btn--success"
                      style="background-color: #269447 !important; color: #ffffff !important; border: none !important;"
                      :loading="uploading.auth"
                      @click="$refs.inputAuth.click()"
                    >
                      <v-icon left small color="#ffffff">cloud_upload</v-icon>
                      <span style="color: #ffffff !important; font-weight: 600;">Завантажити HTML для клієнтів</span>
                    </v-btn>
                    <v-btn
                      v-if="files.auth && files.auth.exists && settings.urls && settings.urls.live"
                      flat
                      small
                      class="preview-btn mt-2"
                      style="color: #269447 !important; font-weight: 600;"
                      @click="openUrl(settings.urls.live)"
                    >
                      <v-icon left small color="#269447">visibility</v-icon>
                      <span style="color: #269447 !important; font-weight: 600;">Переглянути</span>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
      </v-tab-item>

      <!-- Вкладка 2: Таблица заявок -->
      <v-tab-item value="tab-orders">
        <div class="tab-content pt-3">
          <!-- Панель управления таблицей: поиск справа, чтобы мышь не задевала левое меню -->
          <div class="orders-toolbar mb-3">
            <div class="orders-toolbar__left">
              <v-btn
                flat
                class="refresh-btn"
                style="color: #269447 !important; font-weight: 600;"
                :loading="loadingOrders"
                @click="fetchOrders"
              >
                <v-icon left small color="#269447">refresh</v-icon>
                Оновити список
              </v-btn>
              <span class="orders-count-label text-muted ml-2">
                Всього заявок: <b>{{ ordersTotal }}</b>
              </span>
            </div>

            <div class="orders-toolbar__right">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Пошук за номером, ім'ям, телефоном..."
                single-line
                hide-details
                clearable
                outline
                dense
                class="orders-search-input"
                @input="handleSearchInput"
                @click:clear="handleSearchClear"
              ></v-text-field>
            </div>
          </div>

          <!-- Таблица заявок -->
          <v-data-table
            :headers="orderHeaders"
            :items="orders"
            :pagination.sync="pagination"
            :total-items="ordersTotal"
            :loading="loadingOrders"
            class="elevation-1 table__tamplate-2"
            no-data-text="Заявок поки що немає"
          >
            <template slot="items" slot-scope="props">
              <tr @click="openOrderDetails(props.item)" style="cursor: pointer;">
                <td>
                  <b>{{ props.item.order_number }}</b>
                </td>
                <td>{{ props.item.created_at }}</td>
                <td>
                  <div class="font-weight-bold">{{ props.item.contact.name }}</div>
                  <div class="text-muted small" v-if="props.item.contact.company">{{ props.item.contact.company }}</div>
                </td>
                <td>
                  <div><a :href="'tel:' + props.item.contact.phone" @click.stop>{{ props.item.contact.phone }}</a></div>
                  <div class="text-muted small" v-if="props.item.contact.email">{{ props.item.contact.email }}</div>
                </td>
                <td>
                  <span v-if="props.item.contact.channel" :class="['channel-badge', getChannelClass(props.item.contact.channel)]">
                    {{ props.item.contact.channel }}
                  </span>
                  <span v-else class="text-muted small">—</span>
                </td>
                <td>
                  <div><b>{{ formatMoney(props.item.quiz.total_estimate) }} грн</b></div>
                  <div class="text-muted small">{{ props.item.quiz.qty }} шт. × {{ props.item.quiz.budget }}</div>
                </td>
                <td>{{ props.item.quiz.deadline || '—' }}</td>
                <td>
                  <span v-if="props.item.email_status === 'sent'" class="status-badge status-badge--success">Надіслано</span>
                  <span v-else-if="props.item.email_status === 'failed'" class="status-badge status-badge--error" :title="props.item.email_error">Помилка</span>
                  <span v-else class="status-badge status-badge--pending">В обробці</span>
                </td>
                <td class="text-xs-right" @click.stop>
                  <v-btn icon small flat @click="openOrderDetails(props.item)" title="Деталі заявки">
                    <v-icon small color="#269447">visibility</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="props.item.logo && props.item.logo.url"
                    icon
                    small
                    flat
                    :href="props.item.logo.url"
                    target="_blank"
                    title="Завантажити логотип"
                  >
                    <v-icon small color="#1976d2">cloud_download</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-tab-item>

      <!-- Вкладка 3: Пункти меню каталогу -->
      <v-tab-item value="tab-menu">
        <div class="tab-content pt-3">
          <div class="orders-toolbar mb-3">
            <div class="orders-toolbar__left">
              <v-btn
                flat
                class="refresh-btn"
                style="color: #269447 !important; font-weight: 600;"
                :loading="loadingMenuItems"
                @click="fetchMenuItems"
              >
                <v-icon left small color="#269447">refresh</v-icon>
                Оновити
              </v-btn>
              <span class="text-muted ml-2">
                Вбудовуйте власні посилання на промо-сторінки у 2-й або 3-й рівень меню каталогу
              </span>
            </div>
            <div class="orders-toolbar__right">
              <v-btn
                dark
                class="action-btn"
                style="background-color: #269447 !important; color: #ffffff !important; font-weight: 600;"
                @click="openCreateMenuItem"
              >
                <v-icon left small color="#ffffff">add</v-icon>
                Додати пункт меню
              </v-btn>
            </div>
          </div>

          <!-- Таблица пунктов меню -->
          <v-data-table
            :headers="menuHeaders"
            :items="menuItems"
            :loading="loadingMenuItems"
            class="elevation-1 table__tamplate-2"
            no-data-text="Пунктів меню ще не створено. Натисніть «Додати пункт меню» вище."
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>
                  <div class="d-flex align-center">
                    <div
                      v-if="props.item.icon_url"
                      class="mr-2"
                      style="width: 30px; height: 30px; min-width: 30px; border-radius: 50%; background: #f5f5f5; border: 1px solid #e0e0e0; overflow: hidden; display: flex; align-items: center; justify-content: center;"
                    >
                      <img :src="props.item.icon_url" :alt="props.item.title" style="width: 100%; height: 100%; object-fit: contain; padding: 2px;">
                    </div>
                    <b>{{ props.item.title }}</b>
                  </div>
                </td>
                <td>
                  <a :href="props.item.url" target="_blank" class="link-val" style="font-size: 13px;">
                    {{ props.item.url }}
                  </a>
                  <v-btn icon small flat @click="copyText(props.item.url)" title="Копіювати посилання" class="ml-1">
                    <v-icon small color="#666">file_copy</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-chip
                    small
                    :color="props.item.level === 2 ? '#e3f2fd' : '#e8f5e9'"
                    :text-color="props.item.level === 2 ? '#0288d1' : '#269447'"
                    class="font-weight-bold"
                  >
                    {{ props.item.level === 2 ? '2-й рівень (розділ)' : '3-й рівень (пункт)' }}
                  </v-chip>
                </td>
                <td>
                  <div class="font-weight-medium">{{ props.item.parent_path }}</div>
                  <div class="text-muted small" style="font-size: 11px; color: #999;">ID: {{ props.item.parent_id }}</div>
                </td>
                <td class="text-xs-center font-weight-bold">
                  {{ props.item.sort }}
                </td>
                <td class="text-xs-center">
                  <v-icon v-if="props.item.target_blank" small color="#269447" title="Так">check</v-icon>
                  <span v-else class="text-muted small">—</span>
                </td>
                <td class="text-xs-center">
                  <v-switch
                    v-model="props.item.active"
                    color="#269447"
                    hide-details
                    class="ma-0 pa-0 d-inline-block"
                    @change="toggleMenuItem(props.item)"
                  ></v-switch>
                </td>
                <td class="text-xs-right">
                  <v-btn icon small flat @click="openEditMenuItem(props.item)" title="Редагувати">
                    <v-icon small color="#0288d1">edit</v-icon>
                  </v-btn>
                  <v-btn icon small flat @click="deleteMenuItem(props.item)" title="Видалити">
                    <v-icon small color="#d32f2f">delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-tab-item>
    </v-tabs>

    <!-- Диалог деталей заявки -->
    <v-dialog v-model="dialogDetails" max-width="740px">
      <v-card v-if="selectedOrder" class="order-details-card">
        <v-card-title class="order-modal-title">
          <div>
            Заявка <b class="order-num">{{ selectedOrder.order_number }}</b>
            <span class="sub-date ml-2">({{ selectedOrder.created_at }})</span>
          </div>
          <v-btn icon flat small @click="dialogDetails = false" class="mr-0">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="order-modal-body">
          <!-- 1. Контакты -->
          <div class="detail-section mb-4">
            <div class="detail-title">Контактні дані клієнта</div>
            <v-layout row wrap class="detail-grid">
              <v-flex xs12 sm6><b>Контактна особа:</b> {{ selectedOrder.contact.name }}</v-flex>
              <v-flex xs12 sm6><b>Компанія:</b> {{ selectedOrder.contact.company || '—' }}</v-flex>
              <v-flex xs12 sm6><b>Телефон:</b> <a :href="'tel:' + selectedOrder.contact.phone" class="phone-link">{{ selectedOrder.contact.phone }}</a></v-flex>
              <v-flex xs12 sm6><b>Email:</b> {{ selectedOrder.contact.email || '—' }}</v-flex>
              <v-flex xs12 sm6><b>Зручний канал:</b> {{ selectedOrder.contact.channel }}</v-flex>
              <v-flex xs12 sm6>
                <b>Email менеджеру:</b>
                <span v-if="selectedOrder.email_status === 'sent'" class="status-badge status-badge--success ml-1">Успішно надіслано</span>
                <span v-else class="status-badge status-badge--error ml-1">{{ selectedOrder.email_error || 'Помилка' }}</span>
              </v-flex>
              <v-flex xs12 v-if="selectedOrder.contact.comment" class="mt-2">
                <b>Коментар клієнта:</b>
                <div class="comment-box mt-1">{{ selectedOrder.contact.comment }}</div>
              </v-flex>
            </v-layout>
          </div>

          <!-- 2. Параметры квиза -->
          <div class="detail-section mb-4">
            <div class="detail-title">Параметри замовлення</div>
            <v-layout row wrap class="detail-grid">
              <v-flex xs12 sm6><b>Бюджет на набір:</b> {{ selectedOrder.quiz.budget }}</v-flex>
              <v-flex xs12 sm6><b>Кількість наборів:</b> {{ selectedOrder.quiz.qty }} шт.</v-flex>
              <v-flex xs12 sm6><b>Орієнтовна сума:</b> <b class="green--text font-weight-bold" style="font-size: 15px;">{{ formatMoney(selectedOrder.quiz.total_estimate) }} грн</b></v-flex>
              <v-flex xs12 sm6><b>Бажаний термін:</b> {{ selectedOrder.quiz.deadline || '—' }}</v-flex>
              <v-flex xs12 class="mt-1"><b>Побажання по наповненню:</b> {{ selectedOrder.quiz.interests || 'Підбере менеджер' }}</v-flex>
              <v-flex xs12 v-if="selectedOrder.quiz.wishes" class="mt-1"><b>Додаткові побажання:</b> {{ selectedOrder.quiz.wishes }}</v-flex>
            </v-layout>
          </div>

          <!-- 3. Оформление -->
          <div class="detail-section mb-2">
            <div class="detail-title">Оформлення та логотип</div>
            <v-layout row wrap class="detail-grid">
              <v-flex xs12 sm6><b>Упаковка:</b> {{ selectedOrder.packaging.name || '—' }}</v-flex>
              <v-flex xs12 sm6><b>Наповнювач:</b> {{ selectedOrder.packaging.filler || '—' }}</v-flex>
              <v-flex xs12 sm6><b>Стрічка:</b> {{ selectedOrder.packaging.ribbon || '—' }}</v-flex>
              <v-flex xs12 sm6><b>Декор:</b> {{ selectedOrder.packaging.decor || '—' }}</v-flex>
              <v-flex xs12 class="mt-3 d-flex align-center flex-wrap" style="gap: 10px;">
                <div><b>Логотип:</b> Місце нанесення: <b>{{ selectedOrder.logo.placement || 'не вказано' }}</b></div>
                <v-btn
                  v-if="selectedOrder.logo && selectedOrder.logo.url"
                  dark
                  small
                  class="download-logo-btn"
                  style="background-color: #0288d1 !important; color: #ffffff !important; border-radius: 4px; font-weight: 600; text-transform: uppercase;"
                  :href="selectedOrder.logo.url"
                  target="_blank"
                >
                  <v-icon left small color="#ffffff">cloud_download</v-icon>
                  <span style="color: #ffffff !important; font-weight: 600;">Завантажити файл логотипу</span>
                </v-btn>
                <span v-else class="text-muted" style="color: #999; font-size: 13px;">(файл не завантажено)</span>
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>

        <v-card-actions class="order-modal-actions">
          <v-spacer></v-spacer>
          <v-btn
            dark
            class="close-modal-btn"
            style="background-color: #269447 !important; color: #ffffff !important; font-weight: 600; min-width: 120px; border-radius: 4px;"
            @click="dialogDetails = false"
          >
            <span style="color: #ffffff !important; font-weight: 600;">Закрити</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог создания/редактирования пункта меню -->
    <v-dialog v-model="dialogMenuItem" max-width="640px" persistent>
      <v-card class="menu-item-dialog">
        <v-card-title class="order-modal-title">
          <div class="font-weight-bold" style="font-size: 18px;">
            {{ menuItemForm.id ? 'Редагування пункту меню' : 'Новий пункт меню каталогу' }}
          </div>
          <v-btn icon flat small @click="dialogMenuItem = false" class="mr-0">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="menuItemForm" v-model="menuItemValid" lazy-validation>
            <v-layout row wrap>
              <!-- Назва -->
              <v-flex xs12 class="mb-2">
                <v-text-field
                  v-model="menuItemForm.title"
                  label="Назва пункту в меню *"
                  placeholder="наприклад: Новорічні набори 2026"
                  :rules="[v => !!v || 'Вкажіть назву пункту меню']"
                  outline
                  dense
                  required
                ></v-text-field>
              </v-flex>

              <!-- Посилання (URL) -->
              <v-flex xs12 class="mb-2">
                <v-text-field
                  v-model="menuItemForm.url"
                  label="Посилання (URL) *"
                  placeholder="https://sapi.salvi.ua/promo/novorichni-nabory"
                  :rules="[v => !!v || 'Вкажіть посилання']"
                  outline
                  dense
                  required
                ></v-text-field>
                <div class="mt-n2 mb-2 d-flex align-center" style="gap: 8px;">
                  <v-btn
                    small
                    flat
                    style="color: #269447 !important; font-weight: 600; text-transform: none; padding: 0 4px;"
                    @click="insertLandingUrl"
                  >
                    <v-icon left small color="#269447">link</v-icon>
                    Вставити посилання на промо-сторінку
                  </v-btn>
                </div>
              </v-flex>

              <!-- Рівень -->
              <v-flex xs12 sm6 class="pr-sm-2 mb-2">
                <v-select
                  v-model="menuItemForm.level"
                  :items="levelOptions"
                  item-text="text"
                  item-value="value"
                  label="Рівень меню *"
                  outline
                  dense
                  @change="handleLevelChange"
                ></v-select>
              </v-flex>

              <!-- Порядковий номер -->
              <v-flex xs12 sm6 class="pl-sm-2 mb-2">
                <v-text-field
                  v-model.number="menuItemForm.sort"
                  type="number"
                  label="Порядковий номер (сортування)"
                  hint="0 або 1 щоб показувати першим у списку"
                  persistent-hint
                  outline
                  dense
                ></v-text-field>
              </v-flex>

              <!-- Батьківська категорія -->
              <v-flex xs12 class="mb-2">
                <v-select
                  v-if="menuItemForm.level === 2"
                  v-model="menuItemForm.parent_id"
                  :items="menuCategories.level1"
                  item-text="name"
                  item-value="id"
                  label="Категорія 1-го рівня (куди додати колонку) *"
                  :rules="[v => !!v || 'Виберіть категорію 1-го рівня']"
                  outline
                  dense
                  required
                ></v-select>

                <v-select
                  v-else
                  v-model="menuItemForm.parent_id"
                  :items="menuCategories.level2"
                  item-text="full_label"
                  item-value="id"
                  label="Розділ 2-го рівня (куди додати підпункт) *"
                  :rules="[v => !!v || 'Виберіть розділ 2-го рівня']"
                  outline
                  dense
                  required
                ></v-select>
              </v-flex>

              <!-- Іконка розділу / картки -->
              <v-flex xs12 class="mb-3">
                <div class="font-weight-medium mb-2" style="font-size: 13px; color: #555;">
                  Іконка розділу / картки (відображається в кружечку каталогу)
                </div>
                <div class="d-flex align-center" style="gap: 16px;">
                  <div
                    style="width: 56px; height: 56px; min-width: 56px; border-radius: 50%; background: #f5f5f5; border: 2px dashed #cfd8dc; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                  >
                    <img
                      v-if="menuItemForm.icon_url"
                      :src="menuItemForm.icon_url"
                      alt="Icon"
                      style="width: 100%; height: 100%; object-fit: contain; padding: 4px;"
                    />
                    <v-icon v-else color="#b0bec5">image</v-icon>
                  </div>

                  <div>
                    <input
                      ref="menuIconInput"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      style="display: none;"
                      @change="handleMenuIconUpload"
                    />
                    <v-btn
                      small
                      outline
                      color="#269447"
                      :loading="uploadingIcon"
                      @click="triggerIconSelect"
                      class="ma-0 mr-2"
                    >
                      <v-icon left small>cloud_upload</v-icon>
                      {{ menuItemForm.icon_url ? 'Змінити іконку' : 'Завантажити іконку' }}
                    </v-btn>
                    <v-btn
                      v-if="menuItemForm.icon_url || menuItemForm.icon"
                      small
                      flat
                      color="#d32f2f"
                      @click="removeMenuIcon"
                      class="ma-0"
                    >
                      <v-icon left small>delete</v-icon>
                      Видалити
                    </v-btn>
                    <div class="text-muted mt-1" style="font-size: 11px; color: #888;">
                      PNG, JPG, WEBP або SVG до 5 МБ. Рекомендується зображення з прозорим фоном.
                    </div>
                  </div>
                </div>
              </v-flex>

              <!-- Опции: открыть в новой вкладке, активен -->
              <v-flex xs12 sm6>
                <v-switch
                  v-model="menuItemForm.target_blank"
                  label="Нова вкладка"
                  color="#269447"
                  class="ma-0"
                ></v-switch>
              </v-flex>
              <v-flex xs12 sm6>
                <v-switch
                  v-model="menuItemForm.active"
                  label="Активний"
                  color="#269447"
                  class="ma-0"
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-3 px-4" style="background: #fafafa; border-top: 1px solid #eee;">
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogMenuItem = false" :disabled="savingMenuItem">
            Скасувати
          </v-btn>
          <v-btn
            dark
            class="save-btn"
            style="background-color: #269447 !important; color: #ffffff !important; font-weight: 600;"
            :loading="savingMenuItem"
            @click="saveMenuItem"
          >
            Зберегти пункт
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "LandingManagement",
  data() {
    return {
      activeTab: "tab-files",
      savingSettings: false,
      settings: {
        id: null,
        slug: "novorichni-nabory",
        title: "",
        manager_email: "",
        active: true,
        urls: {
          live: ""
        }
      },
      files: {
        guest: { exists: false, name: "", size_formatted: "", updated_at: "" },
        auth: { exists: false, name: "", size_formatted: "", updated_at: "" }
      },
      uploading: {
        guest: false,
        auth: false
      },
      // Заявки
      orders: [],
      ordersTotal: 0,
      loadingOrders: false,
      search: "",
      searchTimeout: null,
      pagination: {
        page: 1,
        rowsPerPage: 15
      },
      orderHeaders: [
        { text: "№ Заявки", value: "order_number", sortable: false },
        { text: "Дата", value: "created_at", sortable: false },
        { text: "Клієнт / Компанія", value: "name", sortable: false },
        { text: "Контакти", value: "phone", sortable: false },
        { text: "Канал зв'язку", value: "channel", sortable: false },
        { text: "Сума розрахунку", value: "total_estimate", sortable: false },
        { text: "Термін", value: "deadline", sortable: false },
        { text: "Email", value: "email_status", sortable: false },
        { text: "Дії", value: "actions", sortable: false, align: "right" }
      ],
      dialogDetails: false,
      selectedOrder: null,
      // Пункти меню каталогу
      menuItems: [],
      loadingMenuItems: false,
      savingMenuItem: false,
      uploadingIcon: false,
      dialogMenuItem: false,
      menuItemValid: true,
      menuCategories: {
        level1: [],
        level2: []
      },
      levelOptions: [
        { text: "2-й рівень (розділ / заголовок колонки)", value: 2 },
        { text: "3-й рівень (підпункт всередині розділу)", value: 3 }
      ],
      menuHeaders: [
        { text: "Назва", value: "title", sortable: false },
        { text: "Посилання (URL)", value: "url", sortable: false },
        { text: "Рівень", value: "level", sortable: false },
        { text: "Батьківська категорія", value: "parent_path", sortable: false },
        { text: "Сорт.", value: "sort", align: "center", sortable: false },
        { text: "Нова вкладка", value: "target_blank", align: "center", sortable: false },
        { text: "Статус", value: "active", align: "center", sortable: false },
        { text: "Дії", value: "actions", align: "right", sortable: false }
      ],
      menuItemForm: {
        id: null,
        title: "",
        url: "",
        level: 2,
        parent_id: null,
        sort: 0,
        target_blank: true,
        active: true,
        icon: null,
        icon_url: null
      }
    };
  },
  watch: {
    pagination: {
      handler() {
        this.fetchOrders();
      },
      deep: true
    }
  },
  created() {
    this.fetchSettings();
    this.fetchOrders();
    this.fetchMenuItems();
  },
  methods: {
    notify(msg, color = "success") {
      const hexColor = color === "success" ? "#269447" : color === "error" ? "#d32f2f" : color;
      this.$loadingBus.$emit("snackbar", {
        title: msg,
        text: msg,
        color: hexColor
      });
    },

    fetchSettings() {
      this.$api
        .get("/landing-admin/settings?slug=" + (this.settings.slug || "novorichni-nabory"))
        .then(response => {
          if (response.data && response.data.settings) {
            const s = response.data.settings;
            this.settings.id = s.id;
            this.settings.title = s.title || "Новорічні подарункові набори";
            this.settings.manager_email = s.manager_email;
            this.settings.active = !!s.active;
            this.settings.urls = this.formatUrls(s.urls);
            this.files = s.files || this.files;
          }
        })
        .catch(() => {
          this.notify("Помилка завантаження налаштувань промо-сторінки", "error");
        });
    },

    onActiveSwitchChange(val) {
      this.savingSettings = true;
      this.$api
        .post("/landing-admin/toggle-active", {
          slug: this.settings.slug || "novorichni-nabory",
          active: val ? 1 : 0
        })
        .then(response => {
          this.savingSettings = false;
          if (response.data && response.data.success) {
            const statusText = val
              ? "Сторінку увімкнено (активна)"
              : "Сторінку вимкнено (повертає 404 для всіх)";
            this.notify(`Статус змінено: ${statusText}`, "success");
            if (response.data.settings) {
              this.settings.active = !!response.data.settings.active;
            }
          } else {
            this.settings.active = !val;
            const err = (response.data && response.data.message) || "Помилка зміни активності";
            this.notify(err, "error");
          }
        })
        .catch(() => {
          this.savingSettings = false;
          this.settings.active = !val;
          this.notify("Помилка зміни активності сторінки", "error");
        });
    },

    saveSettings() {
      this.savingSettings = true;
      this.$api
        .post("/landing-admin/settings?slug=" + (this.settings.slug || "novorichni-nabory"), {
          manager_email: this.settings.manager_email,
          active: this.settings.active ? 1 : 0,
          title: this.settings.title || "Новорічні подарункові набори"
        })
        .then(response => {
          this.savingSettings = false;
          if (response.data && response.data.success) {
            const statusText = this.settings.active ? "активна" : "вимкнена (404)";
            this.notify(`Налаштування успішно збережено (${statusText})`, "success");
            if (response.data.settings) {
              this.settings.active = !!response.data.settings.active;
              this.settings.urls = this.formatUrls(response.data.settings.urls);
            }
          } else {
            const err = (response.data && response.data.message) || "Помилка при збереженні налаштувань";
            this.notify(err, "error");
          }
        })
        .catch(() => {
          this.savingSettings = false;
          this.notify("Помилка при збереженні налаштувань", "error");
        });
    },

    formatUrls(urls) {
      if (!urls) return {};
      return urls;
    },

    fetchMenuItems() {
      this.loadingMenuItems = true;
      this.$api
        .get("/landing-admin/menu-items")
        .then(response => {
          this.loadingMenuItems = false;
          if (response.data && response.data.items) {
            this.menuItems = response.data.items;
          }
          if (response.data && response.data.categories) {
            const cats = response.data.categories;
            this.menuCategories = {
              level1: (cats.level1 || []).map(c => ({
                ...c,
                id: Number(c.id)
              })),
              level2: (cats.level2 || []).map(c => ({
                ...c,
                id: Number(c.id),
                parent_id: Number(c.parent_id)
              }))
            };
          }
        })
        .catch(() => {
          this.loadingMenuItems = false;
        });
    },

    openCreateMenuItem() {
      const defaultParent =
        this.menuCategories.level1 && this.menuCategories.level1.length
          ? Number(this.menuCategories.level1[0].id)
          : null;

      this.menuItemForm = {
        id: null,
        title: "",
        url: (this.settings.urls && this.settings.urls.live) ? this.settings.urls.live : "",
        level: 2,
        parent_id: defaultParent,
        sort: 0,
        target_blank: true,
        active: true,
        icon: null,
        icon_url: null
      };
      this.dialogMenuItem = true;
      this.$nextTick(() => {
        if (this.$refs.menuItemForm) {
          this.$refs.menuItemForm.resetValidation();
        }
      });
    },

    openEditMenuItem(item) {
      this.menuItemForm = {
        id: item.id,
        title: item.title,
        url: item.url,
        level: Number(item.level || 2),
        parent_id: item.parent_id !== null && item.parent_id !== undefined ? Number(item.parent_id) : null,
        sort: item.sort,
        target_blank: !!item.target_blank,
        active: !!item.active,
        icon: item.icon || null,
        icon_url: item.icon_url || null
      };
      this.dialogMenuItem = true;
      this.$nextTick(() => {
        if (this.$refs.menuItemForm) {
          this.$refs.menuItemForm.resetValidation();
        }
      });
    },

    handleLevelChange(level) {
      const lvl = Number(level);
      if (lvl === 2) {
        this.menuItemForm.parent_id =
          this.menuCategories.level1 && this.menuCategories.level1.length
            ? Number(this.menuCategories.level1[0].id)
            : null;
      } else {
        this.menuItemForm.parent_id =
          this.menuCategories.level2 && this.menuCategories.level2.length
            ? Number(this.menuCategories.level2[0].id)
            : null;
      }
    },

    insertLandingUrl() {
      if (this.settings.urls && this.settings.urls.live) {
        this.menuItemForm.url = this.settings.urls.live;
      }
    },

    saveMenuItem() {
      if (this.$refs.menuItemForm && !this.$refs.menuItemForm.validate()) {
        return;
      }
      this.savingMenuItem = true;
      this.$api
        .post("/landing-admin/save-menu-item", this.menuItemForm)
        .then(response => {
          this.savingMenuItem = false;
          this.dialogMenuItem = false;
          this.notify(response.data.message || "Пункт меню збережено", "success");
          this.fetchMenuItems();
        })
        .catch(err => {
          this.savingMenuItem = false;
          const msg =
            (err.response && err.response.data && err.response.data.message) ||
            "Помилка збереження пункту меню";
          this.notify(msg, "error");
        });
    },

    deleteMenuItem(item) {
      if (!confirm(`Ви дійсно бажаєте видалити пункт меню «${item.title}»?`)) {
        return;
      }
      this.$api
        .post("/landing-admin/delete-menu-item", { id: item.id })
        .then(response => {
          this.notify(response.data.message || "Пункт меню видалено", "success");
          this.fetchMenuItems();
        })
        .catch(err => {
          const msg =
            (err.response && err.response.data && err.response.data.message) ||
            "Помилка видалення пункту меню";
          this.notify(msg, "error");
        });
    },

    triggerIconSelect() {
      if (this.$refs.menuIconInput) {
        this.$refs.menuIconInput.click();
      }
    },

    handleMenuIconUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const ext = file.name.split(".").pop().toLowerCase();
      const allowed = ["png", "jpg", "jpeg", "webp", "svg"];
      if (!allowed.includes(ext)) {
        this.notify("Дозволені лише зображення: PNG, JPG, WEBP, SVG", "error");
        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.notify("Розмір файлу не повинен перевищувати 5 МБ", "error");
        event.target.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("icon", file);

      this.uploadingIcon = true;
      this.$api
        .post("/landing-admin/upload-menu-icon", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          this.uploadingIcon = false;
          event.target.value = "";
          if (response.data && response.data.success) {
            this.menuItemForm.icon = response.data.file_name;
            this.menuItemForm.icon_url = response.data.url;
            this.notify("Іконку успішно завантажено", "success");
          } else {
            const msg = (response.data && response.data.message) || "Помилка завантаження іконки";
            this.notify(msg, "error");
          }
        })
        .catch(err => {
          this.uploadingIcon = false;
          event.target.value = "";
          const msg =
            (err.response && err.response.data && err.response.data.message) ||
            "Помилка завантаження іконки";
          this.notify(msg, "error");
        });
    },

    removeMenuIcon() {
      this.menuItemForm.icon = null;
      this.menuItemForm.icon_url = null;
      if (this.$refs.menuIconInput) {
        this.$refs.menuIconInput.value = "";
      }
    },

    toggleMenuItem(item) {
      this.$api
        .post("/landing-admin/toggle-menu-item", { id: item.id })
        .then(response => {
          const msg =
            (response.data && response.data.message) ||
            (item.active ? "Пункт меню увімкнено" : "Пункт меню вимкнено");
          this.notify(msg, "success");
        })
        .catch(err => {
          item.active = !item.active;
          const msg =
            (err.response && err.response.data && err.response.data.message) ||
            "Помилка зміни статусу пункту меню";
          this.notify(msg, "error");
        });
    },

    handleFileUpload(event, type) {
      const file = event.target.files[0];
      if (!file) return;

      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "html" && ext !== "htm") {
        this.notify("Дозволені лише файли .html або .htm", "error");
        event.target.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("slug", this.settings.slug);
      formData.append("type", type);
      formData.append("file", file);

      this.uploading[type] = true;
      this.$api
        .post("/landing-admin/upload-file", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          this.uploading[type] = false;
          event.target.value = "";
          if (response.data.success) {
            this.notify(response.data.message || "Файл успішно завантажено", "success");
            if (response.data.file_info) {
              this.files[type] = response.data.file_info;
            }
          }
        })
        .catch(err => {
          this.uploading[type] = false;
          event.target.value = "";
          const msg =
            (err.response && err.response.data && err.response.data.message) ||
            "Помилка завантаження файлу";
          this.notify(msg, "error");
        });
    },

    fetchOrders() {
      this.loadingOrders = true;
      const q = new URLSearchParams();
      q.append("slug", this.settings.slug || "novorichni-nabory");
      if (this.search && this.search.trim()) {
        q.append("search", this.search.trim());
      }
      const page = (this.pagination && this.pagination.page) || 1;
      const perPage = (this.pagination && this.pagination.rowsPerPage) || 15;
      q.append("page", page);
      q.append("per_page", perPage);

      const url = `/landing-admin/orders?${q.toString()}`;

      this.$api
        .get(url)
        .then(response => {
          this.loadingOrders = false;
          if (response.data && response.data.orders) {
            this.orders = response.data.orders;
            if (response.data.pagination) {
              this.ordersTotal = response.data.pagination.total;
            }
          }
        })
        .catch(() => {
          this.loadingOrders = false;
        });
    },

    handleSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        if (this.pagination) {
          this.pagination.page = 1;
        }
        this.fetchOrders();
      }, 350);
    },

    handleSearchClear() {
      this.search = "";
      clearTimeout(this.searchTimeout);
      if (this.pagination) {
        this.pagination.page = 1;
      }
      this.$nextTick(() => {
        this.fetchOrders();
      });
    },

    openOrderDetails(order) {
      this.selectedOrder = order;
      this.dialogDetails = true;
    },

    openUrl(url) {
      if (url) {
        window.open(url, "_blank");
      }
    },

    copyText(text) {
      if (!text) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.notify("Посилання скопійовано в буфер", "success");
        });
      }
    },

    formatMoney(val) {
      if (!val) return "0";
      return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    getChannelClass(ch) {
      if (!ch) return "channel-badge--default";
      const c = ch.toLowerCase();
      if (c.includes("viber")) return "channel-badge--viber";
      if (c.includes("telegram")) return "channel-badge--telegram";
      if (c.includes("whatsapp")) return "channel-badge--whatsapp";
      if (c.includes("дзвін") || c.includes("звонок")) return "channel-badge--call";
      return "channel-badge--default";
    }
  }
};
</script>

<style scoped>
.landing-management {
  padding: 25px 40px 50px 85px;
  box-sizing: border-box;
}

@media (max-width: 1100px) {
  .landing-management {
    padding: 20px 20px 40px 75px;
  }
}

@media (max-width: 768px) {
  .landing-management {
    padding: 15px 15px 40px 15px;
  }
}

.section__content__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.caption {
  font-size: 22px;
  font-weight: bold;
  color: #2e2f32;
}
.subcaption {
  font-size: 14px;
  color: #737373;
}
.head-actions {
  display: flex;
  gap: 8px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: #2e2f32;
}
.settings-card {
  border-radius: 8px;
  background: #fff;
}
.links-block {
  background: #f7f9fa;
  border-radius: 6px;
  padding: 12px 16px;
}
.link-item {
  display: flex;
  align-items: center;
  font-size: 13.5px;
}
.link-label {
  color: #666;
  min-width: 250px;
  font-weight: 500;
}
.link-val {
  color: #269447;
  text-decoration: underline;
  word-break: break-all;
  flex: 1;
}
.text-warning {
  color: #f57c00 !important;
}

/* Карточки файлов */
.file-card {
  border-radius: 8px;
  background: #fff;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.file-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
}
.border-top-warning {
  border-top: 4px solid #f57c00;
}
.border-top-info {
  border-top: 4px solid #0288d1;
}
.border-top-success {
  border-top: 4px solid #269447;
}
.card-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 8px;
}
.badge-warning {
  background: #fff3e0;
  color: #e65100;
}
.badge-info {
  background: #e1f5fe;
  color: #0277bd;
}
.badge-success {
  background: #e8f5e9;
  color: #1b5e20;
}
.card-desc {
  font-size: 13px;
  color: #555;
  min-height: 48px;
  line-height: 1.4;
}
.file-status-box {
  background: #f9fafb;
  border: 1px solid #eef0f2;
  border-radius: 6px;
  padding: 12px;
  min-height: 64px;
  display: flex;
  align-items: center;
}
.file-ok {
  display: flex;
  align-items: center;
  width: 100%;
}
.file-empty {
  display: flex;
  align-items: center;
  font-size: 12.5px;
  color: #888;
}
.file-name {
  font-weight: 600;
  font-size: 13.5px;
  color: #222;
  word-break: break-all;
}
.file-info {
  font-size: 11.5px;
  color: #777;
  margin-top: 2px;
}
.card-actions-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: 8px;
}

/* Кнопки загрузки */
.v-btn.upload-btn,
.theme--light.v-btn.upload-btn {
  border-radius: 6px !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  letter-spacing: 0.3px;
  height: 40px !important;
  padding: 0 18px !important;
  color: #ffffff !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
  text-transform: uppercase;
}

.v-btn.upload-btn /deep/ .v-btn__content,
.v-btn.upload-btn span,
.theme--light.v-btn.upload-btn .v-btn__content {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.v-btn.upload-btn /deep/ .v-icon,
.theme--light.v-btn.upload-btn .v-icon {
  color: #ffffff !important;
}

/* Тестовая кнопка - яркий оранжевый */
.v-btn.upload-btn--warning,
.theme--light.v-btn.upload-btn--warning {
  background-color: #f57c00 !important;
  border: 1px solid #e65100 !important;
}
.v-btn.upload-btn--warning:hover,
.theme--light.v-btn.upload-btn--warning:hover {
  background-color: #ef6c00 !important;
}

/* Гостевая кнопка - насыщенный синий */
.v-btn.upload-btn--info,
.theme--light.v-btn.upload-btn--info {
  background-color: #0288d1 !important;
  border: 1px solid #0277bd !important;
}
.v-btn.upload-btn--info:hover,
.theme--light.v-btn.upload-btn--info:hover {
  background-color: #01579b !important;
}

/* Клиентская кнопка - фирменный зеленый */
.v-btn.upload-btn--success,
.theme--light.v-btn.upload-btn--success {
  background-color: #269447 !important;
  border: 1px solid #1e7a3a !important;
}
.v-btn.upload-btn--success:hover,
.theme--light.v-btn.upload-btn--success:hover {
  background-color: #1e7a3a !important;
}

/* Кнопка предпросмотра теста */
.v-btn.preview-btn,
.theme--light.v-btn.preview-btn {
  font-weight: 600 !important;
  color: #f57c00 !important;
}
.v-btn.preview-btn /deep/ .v-btn__content,
.v-btn.preview-btn span {
  color: #f57c00 !important;
  font-weight: 600 !important;
}

/* Кнопка сохранения настроек */
.v-btn.save-btn,
.theme--light.v-btn.save-btn {
  background-color: #269447 !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}
.v-btn.save-btn /deep/ .v-btn__content,
.v-btn.save-btn /deep/ .v-icon,
.v-btn.save-btn span {
  color: #ffffff !important;
}

/* Детали заявки */
.order-details-card {
  border-radius: 8px !important;
  overflow: hidden;
}

.order-modal-title {
  padding: 16px 28px !important;
  background-color: #f7f8fa !important;
  border-bottom: 1px solid #e8ecfa !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

.order-num {
  color: #269447;
  font-size: 19px;
}

.order-modal-body {
  padding: 24px 28px !important;
  box-sizing: border-box;
}

.order-modal-actions {
  padding: 14px 28px 20px 28px !important;
  background-color: #fafbfc !important;
  border-top: 1px solid #e8ecfa !important;
  display: flex !important;
  justify-content: flex-end !important;
  box-shadow: none !important;
}

.v-btn.download-logo-btn,
.theme--light.v-btn.download-logo-btn {
  background-color: #0288d1 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 6px rgba(2, 136, 209, 0.3) !important;
}
.v-btn.download-logo-btn /deep/ .v-btn__content,
.v-btn.download-logo-btn span,
.theme--light.v-btn.download-logo-btn .v-btn__content {
  color: #ffffff !important;
  font-weight: 600 !important;
}
.v-btn.download-logo-btn /deep/ .v-icon,
.theme--light.v-btn.download-logo-btn .v-icon {
  color: #ffffff !important;
}

.v-btn.close-modal-btn,
.theme--light.v-btn.close-modal-btn {
  background-color: #269447 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 6px rgba(38, 148, 71, 0.25) !important;
}
.v-btn.close-modal-btn /deep/ .v-btn__content,
.v-btn.close-modal-btn span,
.theme--light.v-btn.close-modal-btn .v-btn__content {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.phone-link {
  color: #269447;
  font-weight: 600;
  text-decoration: none;
}
.phone-link:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}
.status-badge--success {
  background-color: #e8f5e9;
  color: #2e7d32;
}
.status-badge--error {
  background-color: #ffebee;
  color: #c62828;
}
.status-badge--pending {
  background-color: #eceff1;
  color: #546e7a;
}

/* Бейджи каналов связи */
.channel-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
}
.channel-badge--viber {
  background-color: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #e1bee7;
}
.channel-badge--telegram {
  background-color: #e1f5fe;
  color: #0288d1;
  border: 1px solid #b3e5fc;
}
.channel-badge--whatsapp {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}
.channel-badge--call {
  background-color: #fff3e0;
  color: #e65100;
  border: 1px solid #ffe0b2;
}
.channel-badge--default {
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #e0e0e0;
}

/* Панель над таблицей заявок */
.orders-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background-color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.orders-toolbar__left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.orders-count-label {
  font-size: 13.5px;
  color: #666;
}
.orders-count-label b {
  color: #269447;
}

.orders-toolbar__right {
  flex: 1 1 320px;
  max-width: 420px;
  margin-left: auto;
}

.orders-search-input {
  max-width: 420px;
  margin-left: auto;
}

.orders-search-input /deep/ .v-input__control {
  min-height: 40px !important;
}

.orders-search-input /deep/ .v-input__slot {
  border-radius: 6px !important;
  border-color: #dcdfe6 !important;
  margin-bottom: 0 !important;
}

.detail-title {
  font-weight: 600;
  font-size: 14px;
  color: #269447;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 4px;
  margin-bottom: 8px;
}
.detail-grid > div {
  padding: 4px 0;
  font-size: 13.5px;
}
.comment-box {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.4;
}
.sub-date {
  font-size: 13px;
  font-weight: normal;
  color: #666;
}

/* ========================================================== */
/* Стилизация переключателей (v-switch): четкое различие ВКЛ и ВЫКЛ */
/* ========================================================== */

/* ВКЛЮЧЕННЫЙ свитч: зеленый трек (#81c784) и насыщенный зеленый бегунок (#269447) */
.landing-management .v-input--switch.v-input--is-label-active .v-input--switch__track,
.landing-management .v-input--switch.v-input--is-dirty .v-input--switch__track,
.menu-item-dialog .v-input--switch.v-input--is-label-active .v-input--switch__track,
.menu-item-dialog .v-input--switch.v-input--is-dirty .v-input--switch__track {
  background-color: #81c784 !important;
  color: #81c784 !important;
  opacity: 0.85 !important;
}

.landing-management .v-input--switch.v-input--is-label-active .v-input--switch__thumb,
.landing-management .v-input--switch.v-input--is-dirty .v-input--switch__thumb,
.menu-item-dialog .v-input--switch.v-input--is-label-active .v-input--switch__thumb,
.menu-item-dialog .v-input--switch.v-input--is-dirty .v-input--switch__thumb {
  background-color: #269447 !important;
  color: #269447 !important;
  box-shadow: 0 2px 5px rgba(38, 148, 71, 0.45) !important;
}

/* ВЫКЛЮЧЕННЫЙ свитч: мягкий серый трек и чистый белый бегунок */
.landing-management .v-input--switch:not(.v-input--is-label-active):not(.v-input--is-dirty) .v-input--switch__track,
.menu-item-dialog .v-input--switch:not(.v-input--is-label-active):not(.v-input--is-dirty) .v-input--switch__track {
  background-color: #cfd8dc !important;
  color: #cfd8dc !important;
  opacity: 0.9 !important;
}

.landing-management .v-input--switch:not(.v-input--is-label-active):not(.v-input--is-dirty) .v-input--switch__thumb,
.menu-item-dialog .v-input--switch:not(.v-input--is-label-active):not(.v-input--is-dirty) .v-input--switch__thumb {
  background-color: #ffffff !important;
  color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25) !important;
}

/* Плавный переход при переключении */
.v-input--switch__thumb,
.v-input--switch__track {
  transition: all 0.25s ease-in-out !important;
}

/* Верхние кнопки быстрого перехода */
.v-btn.head-btn-test,
.v-btn.head-btn-test /deep/ .v-btn__content,
.theme--light.v-btn.head-btn-test .v-btn__content,
.head-btn-test span {
  background-color: #f57c00 !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 5px rgba(245, 124, 0, 0.3) !important;
}

.v-btn.head-btn-live,
.v-btn.head-btn-live /deep/ .v-btn__content,
.theme--light.v-btn.head-btn-live .v-btn__content,
.head-btn-live span {
  background-color: #269447 !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 5px rgba(38, 148, 71, 0.3) !important;
}
</style>
