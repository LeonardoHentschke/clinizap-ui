<script lang="ts" setup></script>

<template>
  <eui-toolbar isFixed>
    <div class="is-flex-grow-2 is-flex">
      <slot name="left"></slot>
    </div>

    <div
      class="is-flex-grow-2 is-flex is-justify-content-center is-align-items-center"
    >
      <slot name="middle"></slot>
    </div>

    <div
      class="is-flex-grow-2 is-flex is-justify-content-flex-end is-align-items-center"
    >
      <slot name="right"></slot>
    </div>
  </eui-toolbar>
</template>

<style lang="scss"></style>
