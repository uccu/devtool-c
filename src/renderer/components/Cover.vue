<template>
  <div
    class="cover"
    v-bind:class="{ show: show , left: type === 'left', right: type === 'right'}"
    v-on:click="click"
  ></div>
</template>

<script>
export default {
  name: "Cover",
  components: {},
  methods: {
    click() {
      this.$emit("close");
    }
  },
  props: {},
  data() {
    return { show: false, type: "left" };
  },
  mounted() {
    this.$bus.on("coverShow", data => {
      if (data.type) this.type = data.type;
      this.show = true;
      this.$once("close", () => {
        this.show = false;
        data.close && data.close();
      });
    });
    this.$bus.on("coverHide", data => {
      this.$emit("close");
    });
  }
};
</script>

<style scoped>
.cover {
  position: fixed;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s;
}
.cover.right {
  left: 100%;
}
.cover.show,
.cover.right.show {
  left: 0;
}
</style>
