<template>
  <div class="apis">
    <el-main>
      <div style="padding-left:60px">
        <template v-for="(apiList, category) in apis">
          <div class="hr">{{category}}</div>
          <template v-for="(p, i) in apiList">
            <el-dropdown @command="handleCommand">
              <span @click="request(p)">
                <el-button style="margin:10px;" size="mini" :type="p.type" plain>{{p.title || i}}</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="['edit', p, i]">修改</el-dropdown-item>
                <el-dropdown-item :command="['del', i]" class="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </template>
      </div>
    </el-main>
  </div>
</template>

<script>
import tool from "../service/tool";
export default {
  name: "Apis",
  components: {},
  inject: ["changeProject", "homeFlesh"],
  methods: {
    handleCommand([command, api, i]) {
      if (command == "edit") {
        api.name = i;
        this.$bus.emit("editApiShow", { info: api });
      }
      if (command == "del") {
        tool.delApi(this.selectedProject.name, api);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.homeFlesh();
      }
    },
    async request(i) {
      const project = this.selectedProject;
      const apiInfo = i;

      const url = project.url + apiInfo.url;
      let params = {},
        options = { headers: {} };
      project.params &&
        project.params.map(p => {
          params[p.name] = p.default;
        });
      if (apiInfo.params) {
        for (let p of apiInfo.params) {
          let dvalue = p.default;
          const falseS = Symbol();
          if (!p.hidden) {
            let val = await this.$prompt(
              "请输入参数" + p.name + "的值",
              "参数手动输入",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPattern: RegExp(p.pattern || undefined),
                inputErrorMessage: p.errorMessage || "参数格式不正确",
                inputValue: p.default,
                Placeholder: p.placeholder || ""
              }
            )
              .then(({ value }) => {
                return value;
              })
              .catch(() => {
                return falseS;
              });
            if (val === falseS) return;
            dvalue = val;
            if (p.cover) p.default = dvalue;
          }
          if (p.type) {
            if (p.type === "number") {
              dvalue = parseInt(dvalue);
            } else if (p.type === "float") {
              dvalue = parseFloat(dvalue);
            } else if (p.type === "boolean") {
              dvalue = dvalue ? true : false;
            } else if (p.type === "json") {
              try {
                dvalue = JSON.parse(dvalue);
              } catch (e) {
                return;
              }
            }
          }
          params[p.name] = dvalue;
        }
      }

      if (apiInfo.restParams) {
        options.rest = {};
        for (let p of apiInfo.restParams) {
          let dvalue = p.default;
          const falseS = Symbol();
          if (!p.hidden) {
            let val = await this.$prompt(
              "请输入REST参数 <font style='color:#E6A23C'>" +
                p.name +
                "</font> 的值",
              "参数手动输入",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPattern: RegExp(p.pattern || undefined),
                inputErrorMessage: p.errorMessage || "参数格式不正确",
                inputValue: p.default,
                Placeholder: p.placeholder || ""
              }
            )
              .then(({ value }) => {
                return value;
              })
              .catch(() => {
                return falseS;
              });
            if (val === falseS) return;
            dvalue = val;
            if (p.cover) p.default = dvalue;
          }
          options.rest[p.name] = dvalue;
        }
      }

      project.headers &&
        project.headers.map(p => {
          options.headers[p.name] = p.default;
        });
      apiInfo.headers &&
        apiInfo.headers.map(p => {
          options.headers[p.name] = p.default;
        });

      (arr => {
        arr.map(e => {
          if (project[e]) options[e] = project[e];
          if (apiInfo[e]) options[e] = apiInfo[e];
        });
      })(["method", "responseType", "timeout", "proxy"]);

      tool
        .api(url, params, options)
        .then(data => {
          this.$message({
            message: "请求成功",
            type: "success"
          });

          let gdata = function(arr, data) {
            if (!arr.length || !data) {
              return data;
            }
            let key = arr.shift();
            return gdata(arr, data[key]);
          };

          if (
            apiInfo.toGlobalKey &&
            apiInfo.toGlobalValue &&
            options.responseType == "json"
          ) {
            let arr = apiInfo.toGlobalValue.split(".");
            let v = gdata(arr, data);
            if (!project.params) project.params = [];

            let has = 0;
            project.params.map(p => {
              if (p.name == apiInfo.toGlobalKey) {
                p.default = v;
                has = 1;
              }
            });
            if (!has) {
              project.params.push({
                name: apiInfo.toGlobalKey,
                default: v
              });
            }
          }

          if (apiInfo.response && options.responseType == "json") {
            let arr = apiInfo.response.split(".");
            console.log(gdata(arr, data));
          } else {
            console.log(data);
          }
        })
        .catch(e => {
          this.$message.error(e.toString());
        });
    }
  },
  props: ["selectedProject"],
  data() {
    return {
      apis: {}
    };
  },
  watch: {
    selectedProject: {
      immediate: true,
      handler(val) {
        const list = val ? val.apiList : [];
        for (let i in list) {
          const category = list[i].category || "default";
          if (!this.apis[category]) this.apis[category] = {};
          this.apis[category][i] = list[i];
        }
        console.log(this.apis);
      }
    }
  }
};
</script>

<style scoped>
.hr {
  width: 100%;
  border-bottom: solid 1px #eee;
  font-size: 14px;
  font-weight: 700;
  color: brown;
  margin-top:20px;
}
.el-tag {
  margin: 10px;
  cursor: pointer;
  user-select: none;
}
.apis {
  animation: spinner 0.3s ease-in-out;
}
@keyframes spinner {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.el-dropdown-menu__item {
  transition: all 0.3s;
}
.del:hover {
  color: #fff;
  background: #f56c6c;
}
</style>
