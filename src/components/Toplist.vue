<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>歌单管理</el-breadcrumb-item>
      <el-breadcrumb-item>歌单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card >
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.name" clearable @clear="getMusicList">
            <el-button slot="append" icon="el-icon-search" @click="getMusicList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true">创建榜单</el-button>
        </el-col>
        <el-col :span="3">
          <el-popover placement="right" width="400" trigger="click">
            <el-checkbox-group v-model="colOptions">
                <el-checkbox v-for="item in colSelect" :label="item" :key="item" ></el-checkbox>
            </el-checkbox-group>
            <el-button slot="reference">设置</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <el-table :data="musicList" border stripe>
        <el-table-column label="listId" v-if="colData[0].istrue" width="80" prop="listId"></el-table-column>
        <el-table-column label="图片" v-if="colData[1].istrue" width="80" prop="imageUrl">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" width="50" height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="图片URL" v-if="colData[2].istrue" prop="imageUrl"></el-table-column>
        <el-table-column label="榜单名称" v-if="colData[3].istrue" prop="name"></el-table-column>
        <el-table-column label="操作" v-if="colData[4].istrue">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row.listId)"></el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="deletePlaylistById(scope.row.listId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加排行榜弹出框 -->
    <el-dialog
      title="创建榜单"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="榜单Id" prop="listId">
          <el-input v-model="addForm.listId"></el-input>
        </el-form-item>
        <el-form-item label="榜单名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片URL" prop="imageUrl">
          <el-input v-model="addForm.imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMusic">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改排行榜弹出框 -->
    <el-dialog
      title="修改榜单信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="榜单ID">
          <el-input v-model="editForm.listId" disabled></el-input>
        </el-form-item>
        <el-form-item label="榜单名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片URL" prop="imageUrl">
          <el-input v-model="editForm.imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="editPlaylist" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分页查询参数
      queryInfo: {
        name: '',
        pageNum: 1,
        pageSize: 5
      },
      queryPlaylistById: {
        listId: ''
      },
      // 存放排行榜数据
      musicList: [],
      total: 0,
      // 添加对话框的显示与否
      addDialogVisible: false,
      // 编辑对话框的显示与否
      editDialogVisible: false,
      // 存放添加表单的数据
      addForm: {
        listId: '',
        name: '',
        imageUrl: ''
      },
      // 添加表单的规则
      addFormRules: {
        name: [
          {required: true, message: '请输入榜单名', triggle: 'blur'}
        ],
        listId: [
          {required: true, message: '请输入listId', triggle: 'blur'}
        ],
        imageUrl: [
          {required: true, message: '请输入图片URL', triggle: 'blur'}
        ]
      },
      // 存放编辑表单的数据
      editForm: {},
      // 编辑表单的规则
      editFormRules: {
        name: [
          {required: true, message: '请输入榜单名', triggle: 'blur'}
        ],
        listId: [
          {required: true, message: '请输入lsitId', triggle: 'blur'}
        ],
        imageUrl: [
          {required: true, message: '请输入图片URL', triggle: 'blur'}
        ]
      },
      colData: [{title: 'listId', istrue: true},
        {title: '图片', istrue: true},
        {title: '图片URL', istrue: true},
        {title: '榜单名称', istrue: true},
        {title: '操作', istrue: true}],
      colOptions: ['listId', '图片', '图片URL', '榜单名称', '操作'],
      colSelect: ['listId', '图片', '图片URL', '榜单名称', '操作']
    }
  },
  created () {
    this.getMusicList()
  },
  watch: {
    colOptions (valArr) {
      var arr = this.colSelect.filter(i => valArr.indexOf(i) < 0) // 未选中
      this.colData.filter(i => {
        if (arr.indexOf(i.title) !== -1) {
          i.istrue = false
          // this.$nextTick(() => {
          //   this.$refs.tableDataRef.doLayout()
          // })
        } else {
          i.istrue = true
          // this.$nextTick(() => {
          //   this.$refs.tableDataRef.doLayout()
          // })
        }
      })
    }
  },
  methods: {
    // 获取排行榜列表
    getMusicList () {
      this.$axios.get('toplist/page', {params: this.queryInfo}).then((response) => {
        // console.log(response)
        this.musicList = response.data.list
        this.total = response.data.total
      }).catch((response) => {
        this.$message.error('获取歌单列表失败！')
      })
    },
    // 改变分页大小
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getMusicList()
    },
    // 跳转到第几页
    handleCurrentChange (newpage) {
      console.log(newpage)
      this.queryInfo.pageNum = newpage
      this.getMusicList()
    },
    // 添加对话框隐藏后清除数据
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加排行榜
    addMusic () {
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid)
        // console.log(this.addForm)
        if (!valid) return
        console.log(this.addForm)
        this.$axios.post('toplist', this.addForm).then((response) => {
          this.$message.success('添加歌单成功！')
          this.addDialogVisible = false
          this.getMusicList()
        }).catch((response) => {
          this.$message.error('添加歌单失败！')
          this.addDialogVisible = false
        })
      })
    },
    // 展示修改对话框
    showEditDialog (listId) {
      this.queryPlaylistById.listId = listId
      this.editDialogVisible = true
      this.$axios.get('toplist/id', {params: this.queryPlaylistById}).then((response) => {
        // console.log(response.data)
        this.editForm = response.data
      }).catch((response) => {
        this.$message.error('查询歌单信息失败！')
      })
      // console.log(id)
    },
    editPlaylist () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$axios.put('toplist', this.editForm).then((response) => {
          console.log(response.data)
          if (response.data) {
            this.editDialogVisible = false
            this.getMusicList()
            this.$message.success('更新歌曲信息成功！')
          } else { this.$message.error('更新歌曲信息失败！') }
        }).catch((response) => {
          this.editDialogVisible = false
          this.$message.error('更新歌曲信息失败！')
        })
      })
    },
    async deletePlaylistById (listId) {
      this.queryPlaylistById.listId = listId
      const result = await this.$confirm('此操作将永久删除歌单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   console.log(result)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$axios.delete('toplist/', {params: this.queryPlaylistById}).then((response) => {
        this.getMusicList()
        this.$message.success('删除歌单成功！')
      }).catch((response) => {
        this.$message.error('删除歌单失败！')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
