<template>
  <div class="item-child">
    <a
      v-if="item.url"
      :href="item.url"
      :target="item.target_blank ? '_blank' : '_self'"
      class="child-name"
      :class="{
        'head-name': main
      }"
      :title="item.name"
    >
      {{ item.name }}
    </a>
    <router-link
      v-else
      class="child-name"
      :class="{
        'head-name': main,
        active: item.uuid == $store.getters['category/uuid']
      }"
      :title="item.name"
      :to="`/catalog/${parent}/${item.code}`"
    >
      {{ item.name }}
    </router-link>
    <div v-for="(itemChild, index) in item.children" :key="index">
      <a
        v-if="itemChild.url"
        :href="itemChild.url"
        :target="itemChild.target_blank ? '_blank' : '_self'"
        class="child-name"
        :title="itemChild.name"
      >
        {{ itemChild.name }}
      </a>
      <router-link
        v-else
        class="child-name"
        :class="[{ active: itemChild.code == $store.getters['category/uuid'] }, itemChild.name == 'Новорічні подарунки' ? 'red--text' : '']"
        :title="itemChild.name == 'Новорічні подарунки' ? 'Новорічні товари та подарунки' : itemChild.name"
        :to="`/catalog/${parent}/${item.code}/${itemChild.code}`"
      >
        {{ itemChild.name == 'Новорічні подарунки' ? 'Новорічні товари та подарунки' : itemChild.name }}
      </router-link>
      <tree-item
        v-for="(i, index) in itemChild.children"
        :key="index"
        :item="i"
        :main="false"
        @getItem="getItem"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "TreeItem",
  props: ["item", "main", "parent"],
  methods: {
    getItem(item) {
      this.postItem(item)
    },
    postItem(item) {
      this.$emit("getItem", item)
    }
  }
}
</script>

<style scoped lang="sass">
  .item-child
    a
      color: inherit
.child-name
    cursor: pointer
    font-style: normal
    font-weight: normal
    font-size: 14px
    line-height: 140%
    color: #646C9A
    width: 100%
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap
    display: block
    &:hover
      text-decoration: underline
      .item-child, div
        text-decoration: none!important
    &.active
      text-decoration: none
      background-color: #f0f3ff
    &.red--text
      color: red
      font-size: 16px
</style>
