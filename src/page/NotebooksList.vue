<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate"
        ><i class="iconfont icon-plus"></i> 新建笔记本</a
      >
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{ notebooks.length }})</h3>
        <div class="book-list">
          <router-link
            v-for="(notebook, index) in notebooks"
            :key="index"
            :to="`/note?notebookId=${notebook.id}`"
            class="notebook"
          >
            <div>
              <span class="iconfont icon-notebook"></span> {{ notebook.title }}
              <span>{{ notebook.noteCounts }}</span>
              <span class="action" @click.stop.prevent="onEdit(notebook)"
                >编辑</span
              >
              <span class="action" @click.stop.prevent="onDelete(notebook)"
                >删除</span
              >
              <span class="date">{{ notebook.friendlyCreatedAt }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Auth from "@/apis/auth.js";
import Notebooks from "@/apis/notebooks";
import { friendlyDate } from "@/Http/util.js";
export default {
  name: "NotebooksList",
  data() {
    return {
      notebooks: [],
    };
  },
  methods: {
    //创建笔记本
    onCreate() {
      this.$prompt("输入新笔记本标题", "创建笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: "标题不能为空，且不超过30个字符",
      })
        .then(({ value }) => {
          return Notebooks.addNoteBook({ title: value });
        })
        .then((res) => {
          res.data.friendlyCreatedAt = friendlyDate(res.data.createdAt);
          this.notebooks.unshift(res.data);
          this.$message.success(res.msg);
        });
    },
    //编辑笔记本
    onEdit(notebook) {
      let title = "";
      this.$prompt("输入新笔记本标题", "修改笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,30}$/,
        inputValue: notebook.title,
        inputErrorMessage: "标题不能为空，且不超过30个字符",
      })
        .then(({ value }) => {
          title = value;
          return Notebooks.updateNotebook(notebook.id, { title });
        })
        .then((res) => {
          notebook.title = title;
          this.$message.success(res.msg);
        });
    },
    //删除笔记本
    onDelete(notebook) {
      this.$confirm("确认要删除笔记本吗", "删除笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return Notebooks.deleteNotebook(notebook.id);
        })
        .then((res) => {
          this.notebooks.splice(this.notebooks.indexOf(notebook), 1);
          this.$message.success(res.msg);
        });
    },
  },
  created() {
    Auth.getInfo().then((res) => {
      if (!res.isLogin) {
        this.$router.push({ path: "/login" });
      }
      this.notebooks = res.data;
    });
    Notebooks.getAll().then((res) => {
      this.notebooks = res.data;
      console.log(this.notebooks);
    });
  },
};
</script>

<style lang="less" scoped>
@import url(../assets/css/notebook-list.less);
</style>