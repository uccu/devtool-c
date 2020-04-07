<template>
  <div>
    <Header :selectedProject="selectedProject" :projects="projects" />
    <Apis :selectedProject="selectedProject" :key="selectedProjectName" />
    <Side :selectedProject="selectedProject" />
    <Cover />
    <EditProject :selectedProject="selectedProject" :projects="projects" />
    <EditApi :selectedProject="selectedProject" />
  </div>
</template>

<script>
import Header from "./Header";
import Apis from "./Apis";
import Side from "./Side";
import Cover from "./Cover";
import EditProject from "./EditProject";
import EditApi from "./EditApi";
import tool from "../service/tool";
export default {
  name: "Home",
  components: { Apis, Header, Side, Cover, EditProject, EditApi },
  methods: {},
  data() {
    return {
      selectedProject: undefined,
      selectedProjectName: "",
      projects: {}
    };
  },
  methods: {
    changeProject(pro) {
      this.selectedProject = pro;
      if (pro) this.selectedProjectName = pro.name || "";
      else this.selectedProjectName = "";
    },
    getSelectedProject(pro) {
      return this.selectedProject;
    },
    flesh() {
      let projects = JSON.parse(JSON.stringify(tool.getProjects()));
      let hasp = 0;
      for (let i in projects) {
        projects[i].name = i;
        if (this.selectedProject && i === this.selectedProject.name) {
          hasp = 1;
          projects[i].tag = "success";
          this.selectedProject = projects[i];
          this.selectedProjectName = i;
        } else {
          projects[i].tag = "";
        }
        this.projects = projects;
      }
      if (!hasp) {
        this.selectedProject = undefined;
        this.selectedProjectName = "";
      }
    }
  },
  provide() {
    return {
      changeProject: this.changeProject,
      getSelectedProject: this.getSelectedProject,
      homeFlesh: this.flesh
    };
  },
  mounted() {
    this.flesh();
  }
};
</script>

<style scoped>
</style>
