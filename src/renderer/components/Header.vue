<template>
  <div class="header">
    <div>
      <span class="iconfont icon-menu" v-on:click="sideShow"></span>
    </div>
    <el-main>
      <div style="padding-left:60px">
        <template v-for="(p, i) in projects">
          <el-tag
            effect="dark"
            :type="p.tag || p.defaultTag || 'info'"
            @click="selectProject(p)"
          >{{p.title || i}}</el-tag>
        </template>
      </div>
    </el-main>
  </div>
</template>

<script>
import tool from "../service/tool";
export default {
  name: "Header",
  components: {},
  inject: ["changeProject", "getSelectedProject"],
  methods: {
    selectProject(p) {
      let project = this.selectedProject;
      if (project) {
        project.tag = "";
      }
      
      if (project === p) {
        this.changeProject();
        return;
      }
      this.changeProject(p);
      p.tag = "success";
    },
    sideShow() {
      this.$bus.emit("sideShow");
    }
  },
  props: ["selectedProject", "projects"]
};
</script>

<style scoped>
.icon-menu {
  position: relative;
  top: 0;
  left: 10px;
  font-size: 2em;
  color: brown;
  cursor: pointer;
}
.el-tag {
  margin: 10px;
  cursor: pointer;
}
</style>
