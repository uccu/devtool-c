<template>
  <div class="edit-api" v-bind:class="{ show: show }">
    <div class="edit-api-box">
      <div class="df">
        <div class="ipnut-title">接口标识：</div>
        <div class="ipnut-el">
          <el-input v-model="info.name" placeholder="请输入接口标识" :disabled="!add"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">接口名字：</div>
        <div class="ipnut-el">
          <el-input v-model="info.title" placeholder="请输入接口名字"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">接口路径：</div>
        <div class="ipnut-el">
          <el-input v-model="info.url" placeholder="请输入接口路径"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">请求方式：</div>
        <div class="ipnut-el">
          <el-input v-model="info.method" :placeholder="defaultMethod"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">返回类型：</div>
        <div class="ipnut-el">
          <el-input v-model="info.responseType" :placeholder="defaultResponseType"></el-input>
        </div>
      </div>
      <div
        class="df"
        v-if="info.responseType == 'json' || (defaultResponseType == 'json' && !info.responseType)"
      >
        <div class="ipnut-title">筛选data：</div>
        <div class="ipnut-el">
          <el-input v-model="info.response" placeholder="默认完整的data"></el-input>
        </div>
      </div>
      <div
        class="df"
        v-if="info.responseType == 'json' || (defaultResponseType == 'json' && !info.responseType)"
      >
        <div class="ipnut-title">临时添加到全局：</div>
        <div class="ipnut-el">
          <el-input v-model="info.toGlobalKey" placeholder="参数名"></el-input>
        </div>
      </div>
      <div
        class="df"
        v-if="info.responseType == 'json' || (defaultResponseType == 'json' && !info.responseType)"
      >
        <div class="ipnut-title">(String,Number限定)</div>
        <div class="ipnut-el">
          <el-input v-model="info.toGlobalValue" placeholder="筛选data"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">超时时间（毫秒）：</div>
        <div class="ipnut-el">
          <el-input v-model="info.timeout" :placeholder="defaultTimeout"></el-input>
        </div>
      </div>

      <Vinputs
        :list="info.headers"
        :selected="selectedHeader"
        title="请求头"
        @select="selectHeader"
        @del="delHeader"
      />

      <Vinputs
        :list="info.params"
        :selected="selectedParam"
        title="参数"
        high="1"
        @select="selectParam"
        @del="delParam"
      />

      <Vinputs
        :list="info.restParams"
        :selected="selectedRestParam"
        title="REST参数"
        high="1"
        @select="selectRestParam"
        @del="delRestParam"
      />

      <div class="save">
        <el-button type="warning" size="mini" plain @click="addHeader">添加请求头</el-button>
        <el-button type="warning" size="mini" plain @click="addParam">添加参数</el-button>
        <el-button type="warning" size="mini" plain @click="addRestParam">添加REST参数</el-button>
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
  name: "EditApi",
  components: { Vinputs },
  inject: ["getSelectedProject"],
  methods: {
    selectParam(k) {
      if (this.selectedParam == this.info.params[k]) this.selectedParam = "";
      else this.selectedParam = this.info.params[k];
    },
    addParam() {
      this.info.params.push({
        name: "",
        default: "",
        hidden: false,
        cover: false
      });
      this.selectParam(this.info.params.length - 1);
    },
    delParam(k = -1) {
      let params = [];
      this.info.params.map((e, key) => {
        if ((k > -1 && k != key) || (k == -1 && this.selectedParam != e))
          params.push(e);
        else if (this.selectedParam == e) {
          this.selectedParam = "";
        }
      });
      this.info.params = params;
    },

    selectRestParam(k) {
      if (this.selectedRestParam == this.info.restParams[k])
        this.selectedRestParam = "";
      else this.selectedRestParam = this.info.restParams[k];
    },
    addRestParam() {
      this.info.restParams.push({
        name: "",
        default: "",
        hidden: false,
        cover: false
      });
      this.selectRestParam(this.info.restParams.length - 1);
    },
    delRestParam(k = -1) {
      let restParams = [];
      this.info.restParams.map((e, key) => {
        if ((k > -1 && k != key) || (k == -1 && this.selectedRestParam != e))
          restParams.push(e);
        else if (this.selectedRestParam == e) {
          this.selectedRestParam = "";
        }
      });
      this.info.restParams = restParams;
    },

    selectHeader(k) {
      if (this.selectedHeader == this.info.headers[k]) this.selectedHeader = "";
      else this.selectedHeader = this.info.headers[k];
    },
    addHeader() {
      this.info.headers.push({
        name: "",
        default: ""
      });
      this.selectHeader(this.info.headers.length - 1);
    },
    delHeader(k = -1) {
      let headers = [];
      this.info.headers.map((e, key) => {
        if ((k > -1 && k != key) || (k == -1 && this.selectedHeader != e))
          headers.push(e);
        else if (this.selectedHeader == e) {
          this.selectedHeader = "";
        }
      });
      this.info.headers = headers;
    },

    del() {
      if (!this.info.name || this.add) {
        this.$message.error("无法删除");
        return;
      }
      tool.delApi(this.selectedProject.name, this.info.name);
      this.$message({
        message: "删除成功",
        type: "success"
      });
      this.$bus.emit("coverHide");
      this.homeFlesh();
    },
    save() {
      if (!this.info.name || !this.info.url) {
        this.$message.error("请填写完整的参数");
        return;
      }
      if (this.add) {
        if (this.selectedProject[this.info.name]) {
          this.$message.error("该接口标识已存在，请更换一个标识");
          return;
        }
      }
      tool.updApi(this.selectedProject.name, this.info.name, this.info);
      this.$message({
        message: (this.add ? "添加" : "修改") + "成功",
        type: "success"
      });
      this.$bus.emit("coverHide");
      this.homeFlesh();
    }
  },
  props: ["selectedProject"],
  inject: ["homeFlesh"],
  data() {
    return {
      info: {},
      show: false,
      add: false,
      selectedParam: "",
      selectedRestParam: "",
      selectedHeader: "",
      defaultMethod: "",
      defaultResponseType: "",
      defaultTimeout: ""
    };
  },
  mounted() {
    this.$bus.on("editApiShow", ({ add, info }) => {
      this.add = add;
      if (!add && info) {
        this.info = info;
      } else {
        this.info = {
          params: [],
          restParams: [],
          headers: [],
          method: "",
          responseType: "",
          timeout: "",
          response: "",
          toGlobalKey: "",
          toGlobalValue: ""
        };
      }
      this.selectedParam = "";
      this.selectedRestParam = "";
      this.selectedHeader = "";
      this.defaultMethod = this.selectedProject.method;
      this.defaultResponseType = this.selectedProject.responseType;
      this.defaultTimeout = this.selectedProject.timeout;
      this.$bus.emit("coverShow", {
        close: () => {
          this.show = false;
        },
        type: "right"
      });

      this.show = true;
    });
  }
};
</script>

<style scoped>
.edit-api {
  position: fixed;
  right: -100%;
  top: 0;
  width: 600px;
  height: 100%;
  z-index: 11;
  background-color: #fff;
  box-shadow: 0 0 5px #000;
  transition: all 0.3s;
  overflow: auto;
}
.edit-api-box {
  padding: 50px 0;
}
.edit-api.show {
  right: 0;
}
.ipnut-title {
  line-height: 40px;
  text-align: right;
  padding-right: 20px;
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
.t i {
  transition: all 0.3s;
}
.ed-box {
  animation: spinner 0.3s ease-in-out;
}
@keyframes spinner {
  0% {
    opacity: 0;
    transform: scaleY(0);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>
