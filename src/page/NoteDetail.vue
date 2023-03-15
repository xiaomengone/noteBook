<template>
  <div id="note" class="detail">
    <NoteSidebar @update:notes="(val) => (notes = val)" />
    <div class="note-detail">
      <!-- 没有选择笔记时右边展示 -->
      <div class="note-empty" v-show="!curNote.id">请选择笔记</div>
      <div v-show="curNote.id" class="note-detail-ct">
        <div class="note-bar">
          <span> 创建日期: {{ curNote.createdAtFriendly }}</span>
          <span> 更新日期: {{ curNote.updatedAtFriendly }}</span>
          <span> {{ statusText }}</span>
          <!-- 删除icon -->
          <span class="iconfont icon-delete" @click="deleteNote"></span>
          <span
            class="iconfont icon-fullscreen"
            @click="isShowPreview = !isShowPreview"
          ></span>
        </div>
        <div class="note-title">
          <input
            type="text"
            v-model="curNote.title"
            @input="updateNote"
            @keydown="statusText = '正在输入...'"
            placeholder="输入标题"
          />
        </div>
        <div class="editor">
          <textarea
            v-model="curNote.content"
            v-show="!isShowPreview"
            @input="updateNote"
            @keydown="statusText = '正在输入...'"
            placeholder="输入内容, 支持 markdown 语法"
          ></textarea>
          <div
            class="preview markdown-body"
            v-show="isShowPreview"
            v-html="previewContent"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "@/apis/auth.js";
import NoteSidebar from "@/page/NoteSidebar.vue";
import Bus from "@/Http/bus";
import Notes from "@/apis/notes";
import MarkdownIt from "markdown-it";
//将markdown的字符串转换成HTML
let md = new MarkdownIt();
import _ from "lodash";
//节流来保存记录的笔记
export default {
  name: "Login",
  components: { NoteSidebar },
  data() {
    return {
      curNote: {},
      notes: [],
      statusText: "笔记未改动",
      isShowPreview: false,
    };
  },
  computed: {
    previewContent() {
      console.log(this.curNote.content || "");
      return md.render(this.curNote.content || "");
    },
  },
  created() {
    Auth.getInfo().then((res) => {
      if (!res.isLogin) {
        this.$router.push({ path: "/login" });
      }
    });
    Bus.$once("update:notes", (val) => {
      this.curNote =
        val.find((note) => note.id == this.$route.query.noteId) || {};
    });
  },
  methods: {
    //使用节流保存数据
    updateNote: _.debounce(function () {
      Notes.updateNote(
        { noteId: this.curNote.id },
        { title: this.curNote.title, content: this.curNote.content }
      )
        .then((data) => {
          this.statusText = "已保存";
        })
        .catch((data) => {
          this.statusText = "保存出错";
        });
    }, 300),
    //300毫秒以内有输入的话会合并成一个
    deleteNote() {
      Notes.deleteNote({ noteId: this.curNote.id }).then((data) => {
        this.$message.success(data.msg);
        this.notes.splice(this.notes.indexOf(this.curNote), 1);
        this.$router.replace({ path: "/note" });
      });
    },
  },
  // 路由守卫
  beforeRouteUpdate(to, from, next) {
    this.curNote = this.notes.find((note) => note.id == to.query.noteId) || {};
    next();
  },
};
</script>

<style lang="less" scoped>
@import url(../assets/css/noteDetail.less);

#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}
</style>