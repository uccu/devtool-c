<template>
  <div class="side" v-bind:class="{ show: show }">
    <ul class="side-list">
      <li class="t" @click="editProjectShow(true)">添加项目</li>
      <li class="t" @click="editProjectShow()" v-if="selectedProject">修改项目</li>
      <li class="t" @click="editApiShow()" v-if="selectedProject">添加接口</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Side",
  components: {},
  methods: {
    editProjectShow(add) {
      this.$bus.emit("editProjectShow", add);
      this.show = false;
    },
    editApiShow() {
      this.$bus.emit("editApiShow", { add: true });
      this.show = false;
    }
  },
  props: ['selectedProject'],
  data() {
    return { show: false };
  },
  mounted() {
    this.$bus.on("sideShow", () => {
      this.$bus.emit("coverShow", {
        close: () => {
          this.show = false;
        },
        type: "left"
      });
      this.show = true;
    });
  }
};
</script>

<style scoped>
.side {
  position: fixed;
  left: -100%;
  top: 0;
  width: 300px;
  height: 100%;
  z-index: 11;
  background-color: #fff;
  box-shadow: 0 0 5px #000;
  transition: all 0.3s;
  padding-top: 100px;
}
.side.show {
  left: 0;
}

.side-list {
  text-align: right;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}
.side-list li {
  padding: 1em 1.5em;
  position: relative;
  overflow: hidden;
  margin-left: 8em;
  transition: all 0.3s;
}

.side-list li:hover:active {
  background-color: #eeeeee;
}

.side-list li:hover {
  color: #4dd0e1;
  padding-right: 3em;
  background-color: #f3f3f3;
  margin-left: 3em;
}
</style>
