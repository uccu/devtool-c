<template>
  <div class="edit-project" v-bind:class="{ show: show }">
    <div class="edit-project-box">
      <div class="df">
        <div class="ipnut-title">项目标识：</div>
        <div class="ipnut-el">
          <el-input v-model="vSelectedProject.name" placeholder="请输入项目标识" :disabled="!add"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">项目名字：</div>
        <div class="ipnut-el">
          <el-input v-model="vSelectedProject.title" placeholder="请输入项目名字"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">接口前缀：</div>
        <div class="ipnut-el">
          <el-input v-model="vSelectedProject.url" placeholder="请输入接口前缀"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">请求方式：</div>
        <div class="ipnut-el">
          <el-input v-model="vSelectedProject.method" placeholder="请输入请求方式"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">返回类型：</div>
        <div class="ipnut-el">
          <el-input v-model="vSelectedProject.responseType" placeholder="请输入返回类型"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">超时时间（毫秒）：</div>
        <div class="ipnut-el">
          <el-input v-model="vSelectedProject.timeout" placeholder="请输入超时时间"></el-input>
        </div>
      </div>

      <Vinputs
        :list="vSelectedProject.headers"
        :selected="selectedHeader"
        title="请求头"
        @select="selectHeader"
        @del="delHeader"
      />

      <Vinputs
        :list="vSelectedProject.params"
        :selected="selectedParam"
        title="参数"
        @select="selectParam"
        @del="delParam"
      />

      <div class="save">
        <el-button type="warning" size="mini" plain @click="addHeader">添加请求头</el-button>
        <el-button type="warning" size="mini" plain @click="addParam">添加参数</el-button>
        <el-button type="danger" size="mini" v-if="!add" plain @click="del">删除</el-button>
        <el-button type="success" size="mini" plain @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import tool from "../service/tool";
import Vinputs from "./Vinputs";
export default {
  name: "EditProject",
  components: { Vinputs },
  methods: {
    selectParam(k) {
      if (this.selectedParam == this.vSelectedProject.params[k])
        this.selectedParam = "";
      else this.selectedParam = this.vSelectedProject.params[k];
    },
    addParam() {
      this.vSelectedProject.params.push({
        id: Symbol(),
        name: "",
        default: "",
        hidden: false
      });
      this.selectParam(this.vSelectedProject.params.length - 1);
    },
    delParam(k = -1) {
      let params = [];
      this.vSelectedProject.params.map((e, key) => {
        if ((k > -1 && k != key) || (k == -1 && this.selectedParam != e))
          params.push(e);
        else if (this.selectedParam == e) {
          this.selectedParam = "";
        }
      });
      this.vSelectedProject.params = params;
    },

    selectHeader(k) {
      if (this.selectedHeader == this.vSelectedProject.headers[k])
        this.selectedHeader = "";
      else this.selectedHeader = this.vSelectedProject.headers[k];
    },
    addHeader() {
      this.vSelectedProject.headers.push({
        id: Symbol(),
        name: "",
        default: ""
      });
      this.selectHeader(this.vSelectedProject.headers.length - 1);
    },
    delHeader(k = -1) {
      let headers = [];
      this.vSelectedProject.headers.map((e, key) => {
        if ((k > -1 && k != key) || (k == -1 && this.selectedHeader != e))
          headers.push(e);
        else if (this.selectedHeader == e) {
          this.selectedHeader = "";
        }
      });
      this.vSelectedProject.headers = headers;
    },
    del() {
      if (!this.vSelectedProject.name || this.add) {
        this.$message.error("无法删除");
        return;
      }
      tool.delProject(this.vSelectedProject.name);
      this.$message({
        message: "删除成功",
        type: "success"
      });
      this.$bus.emit("coverHide");
      this.homeFlesh();
    },
    save() {
      if (!this.vSelectedProject.name || !this.vSelectedProject.url) {
        this.$message.error("请填写完整的参数");
        return;
      }
      if (this.add) {
        if (this.projects[this.vSelectedProject.name]) {
          this.$message.error("该项目已存在，请更换标识");
          return;
        }
      }
      let data = JSON.parse(JSON.stringify(this.vSelectedProject));
      delete data.tag;
      tool.updProject(this.vSelectedProject.name, data);
      this.$message({
        message: (this.add ? "添加" : "修改") + "成功",
        type: "success"
      });
      this.$bus.emit("coverHide");
      this.homeFlesh();
    }
  },
  props: ["selectedProject", "projects"],
  inject: ["homeFlesh"],
  data() {
    return {
      vSelectedProject: {},
      show: false,
      add: false,
      selectedParam: "",
      selectedHeader: ""
    };
  },
  mounted() {
    this.$bus.on("editProjectShow", add => {
      this.$bus.emit("coverShow", {
        close: () => {
          this.show = false;
        },
        type: "right"
      });

      if (this.selectedProject && !add)
        this.vSelectedProject = this.selectedProject;
      else {
        this.vSelectedProject = {
          title: "",
          url: "",
          method: "post",
          responseType: "json",
          timeout: "5000",
          apiList: {},
          headers: [],
          params: [],
        };
      }
      this.selectedParam = "";
      this.selectedHeader = "";
      this.show = true;
      this.add = add;
    });
  }
};
</script>

<style scoped>
.edit-project {
  position: fixed;
  right: -100%;
  top: 0;
  width: 500px;
  height: 100%;
  z-index: 11;
  background-color: #fff;
  box-shadow: 0 0 5px #000;
  transition: all 0.3s;
  overflow: auto;
}
.edit-project-box {
  padding: 50px 0;
}
.edit-project.show {
  right: 0;
}
.ipnut-title {
  line-height: 40px;
  text-align: right;
  flex: 1;
}
.ipnut-el {
  flex: 2;
}
.df {
  padding: 0 20px;
  margin-bottom: 20px;
}
.el-button {
  margin: auto;
}
.save {
  text-align: right;
  padding: 0 20px;
}
</style>
