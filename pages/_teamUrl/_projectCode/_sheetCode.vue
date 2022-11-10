<template>
  <div class="container">
    <Header></Header>
    <div :class="showHeader ? 'content' : 'contents'">
      <Aside
        @getFieldList="getFieldList"
        @getTeamUrl="getTeamUrl"
        @getProjectCode="getProjectCode"
        @getSheetCode="getSheetCode"
        @getHeadline="getHeadline"></Aside>
      <div :class="showSidebar ? 'main' : 'main-left main'">
        <div class="main-top">
          <div>
            <b>{{ headline }}</b>
          </div>
          <div class="mg-tp-15 flex-r just-between">
            <div class="tabs">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部数据" name="first"></el-tab-pane>
                <el-tab-pane label="我的数据" name="second"></el-tab-pane>
                <el-tab-pane label="待处理数据" name="third"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="add">
              <el-input size="small" style="width: 150px" placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="input2"></el-input>
              <el-button type="primary" size="small" plain @click="addMore">展开更多</el-button>
              <el-button icon="el-icon-menu" size="small" @click="openSearch">高级筛选</el-button>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addProvider(teamUrl, projectCode, sheetCode)">添加数据</el-button>
            </div>
          </div>
        </div>
        <div class="main-content">
          <div v-if="ifShow">
            <SearchArea :items="searchItems" @search="search" @event="event" @reset="reset" />
          </div>
          <div class="mg-tp-10" v-if="ifDelete">
            <span>已选中{{ checkedLength }}项</span>
            <el-button @click="batchRemove" size="small" type="danger">批量删除</el-button>
          </div>
          <el-table
            border
            class="mg-tp-10"
            :data="recordList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            v-loading="loadingData"
            element-loading-text="数据正在加载中..."
            @row-click="rowClick"
            @selection-change="handleSelectionChange">
            <template slot="empty">
              <p>{{ tableText }}</p>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <template>
              <el-table-column v-for="(item, index) in fieldList" :show-overflow-tooltip="item.type !== '富文本'" :label="item.name" :key="index">
                <template slot-scope="scope">
                  <span v-if="item.type === '单选'" v-html="scope.row.fields[item.key]"></span>
                  <span v-if="item.type === '单行文本'" v-html="scope.row.fields[item.key]"></span>
                  <span v-if="item.type === '多行文本'" v-html="scope.row.fields[item.key]"></span>
                  <span class="rich-text" v-if="item.type === '富文本'" v-html="scope.row.fields[item.key]"></span>
                  <span v-if="item.type === '数字'" v-html="scope.row.fields[item.key]"></span>
                  <div v-for="about in scope.row.fields[item.key]" :key="about">
                    <el-tag type="info" v-if="item.type === '关联表'" v-html="Object.values(about.fields)[0]"></el-tag>
                  </div>

                  <div v-for="url in scope.row.fields[item.key]" :src="url.url + '!icon.jpg'" :key="url">
                    <img class="table-img" v-if="item.type === '附件' && item.key === 'imgs'" />
                  </div>

                  <div v-for="url in scope.row.fields[item.key]" :key="url">
                    <img
                      v-if="item.type === '附件' && item.key === 'video'"
                      @click.stop="showVideo(url.url)"
                      class="video-img"
                      src="../../../assets/images/video.svg" />
                  </div>
                  <el-dialog title="视频预览" width="50%" append-to-body top="20px" :visible.sync="dialogVisible" @close="close">
                    <video width="100%" autoplay="autoplay" :src="playvideo" :poster="playvideo" controls="controls" id="video" preload ref="vueRef"></video>
                  </el-dialog>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <Pagination
          @fatherSize="fatherSize"
          @fatherCurrent="fatherCurrent"
          :size="pagination.size"
          :total-elements="pagination.total"
          class="paging"></Pagination>
        <div style="clear: both"></div>
        <edit ref="child"></edit>
        <advanced-search ref="searchChild"></advanced-search>
      </div>
    </div>
  </div>
</template>

<script>
import _SheetCode from './_sheetCode'

export default _SheetCode
</script>
