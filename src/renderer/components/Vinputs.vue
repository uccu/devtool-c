<template>
  <div>
    <div class="ed-box" v-if="list && list.length">
      <el-tag
        class="t"
        style="margin:10px;cursor:pointer"
        @close="del(k)"
        v-for="(p,k) in list"
        :key="k"
        closable
        :type="selected === p ? 'success' : 'info'"
        @click="select(k)"
      >{{title}}{{k+1}}</el-tag>
    </div>
    <div v-if="selected" class="ed-box">
      <div class="df">
        <div class="ipnut-title">{{title}}：</div>
        <div class="ipnut-el">
          <el-input v-model="selected.name" :placeholder="'请输入'+title+'名'"></el-input>
        </div>
      </div>
      <div class="df">
        <div class="ipnut-title">
          <el-button
            v-if="high"
            size="mini"
            :type="selected.hidden ?'success':'info'"
            @click="selected.hidden = !selected.hidden"
          >隐藏</el-button>
          <el-button size="mini" type="danger" @click="del(-1)">删除</el-button>
        </div>
        <div class="ipnut-el">
          <el-input v-model="selected.default" :placeholder="'请输入'+title+'值'"></el-input>
        </div>
      </div>
      <div class="df" v-if="high">
        <div class="ipnut-title">正则：</div>
        <div class="ipnut-el">
          <el-input v-model="selected.pattern" placeholder="请输入正则表达式"></el-input>
        </div>
      </div>
      <div class="df" v-if="high">
        <div class="ipnut-title">占位文本：</div>
        <div class="ipnut-el">
          <el-input v-model="selected.placeholder" placeholder="请输入占位文本"></el-input>
        </div>
      </div>
      <div class="df" v-if="high">
        <div class="ipnut-title">警告文本：</div>
        <div class="ipnut-el">
          <el-input v-model="selected.errorMessage" placeholder="请输入正则不匹配时的警告文本"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Vinputs",
  components: {},
  methods: {
    del(k) {
      this.$emit("del", k);
    },
    select(k) {
      this.$emit("select", k);
    }
  },
  props: ["list", "selected", "title","high"]
};
</script>

<style scoped>
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
.t i {
  transition: all 0.3s;
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
</style>
