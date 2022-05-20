<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>歌曲管理</el-breadcrumb-item>
      <el-breadcrumb-item>歌曲列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card >
      <el-row :gutter="30">
        <!-- 搜索框 -->
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.name" clearable @clear="getMusicList">
            <el-button slot="append" icon="el-icon-search" @click="getMusicList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加歌曲按钮 -->
        <el-col :span="3">
            <el-button type="primary" @click="addDialogVisible = true">添加歌曲</el-button>
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
      <!-- 表格组件 -->
      <el-table :data="musicList" @selection-change="handleSelectionChange" border stripe>
        <el-table-column type="selection" v-if="colData[0].istrue" width="55" :reserve-selection="false"></el-table-column>
        <el-table-column label="listId" v-if="colData[1].istrue" width="60" prop="listId"></el-table-column>
        <el-table-column label="歌曲ID" v-if="colData[2].istrue" width="70" prop="musicId"></el-table-column>
        <el-table-column label="名称" v-if="colData[3].istrue" prop="name"></el-table-column>
        <el-table-column label="作者" v-if="colData[4].istrue" width="70" prop="author"></el-table-column>
        <el-table-column label="图片" v-if="colData[5].istrue" width="80" prop="imageUrl">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" width="50" height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="图片URL" v-if="colData[6].istrue" prop="imageUrl"></el-table-column>
        <el-table-column label="音乐URL" v-if="colData[7].istrue" prop="musicUrl"></el-table-column>
        <el-table-column label="操作" v-if="colData[8].istrue">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"   @click="showEditDialog(scope.row.musicId)"></el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="deleteMusicById(scope.row.musicId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加歌曲弹出框 -->
    <el-dialog
      title="添加歌曲"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="歌曲名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="addForm.author"></el-input>
        </el-form-item>
        <el-form-item label="musicId" prop="musicId">
          <el-input v-model="addForm.musicId"></el-input>
        </el-form-item>
        <el-form-item label="listId" prop="listId">
          <el-input v-model="addForm.listId"></el-input>
        </el-form-item>
        <el-form-item label="imageUrl" >
          <el-input v-model="addForm.imageUrl"></el-input>
        </el-form-item>
         <el-form-item label="musicUrl">
          <el-input v-model="addForm.musicUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMusic">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改歌曲弹出框 -->
    <el-dialog
      title="修改歌曲信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="musicId">
          <el-input v-model="editForm.musicId" disabled></el-input>
        </el-form-item>
        <el-form-item label="listId">
          <el-select v-model="editForm.listId" placeholder="请选择" @change="parentCateChange($event)" clearable>
            <el-option v-for="item in parentCateList" :key="item.listId" :label="item.listId" :value="item.listId"></el-option>
          </el-select>
          <!-- <el-input v-model="editForm.listId"></el-input> -->
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editForm.author"></el-input>
        </el-form-item>
        <el-form-item label="图片URL" >
          <el-input v-model="editForm.imageUrl"></el-input>
        </el-form-item>
        <el-form-item label="音乐URL" >
          <el-input v-model="editForm.musicUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMusicInfo">确 定</el-button>
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
        pageSize: 10
      },
      musicId: {
        musicId: ''
      },
      // 存放音乐数据的数组
      musicList: [],
      total: 0,
      // 添加对话框的显示与否
      addDialogVisible: false,
      // 编辑对话框的显示与否
      editDialogVisible: false,
      // 存放添加表单的数据
      addForm: {
        // id: null,
        name: '',
        author: '',
        musicId: '',
        imageUrl: '',
        musicUrl: '',
        lsitId: ''
        // character: ''
      },
      // 添加表单的规则
      addFormRules: {
        name: [
          { required: true, message: '请输入歌曲名', triggle: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', triggle: 'blur' }
        ],
        musicId: [
          { required: true, message: '请输入musicId', triggle: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请输入图片URL', triggle: 'blur' }
        ],
        musicUrl: [
          { required: true, message: '请输入音乐URL', triggle: 'blur' }
        ],
        listId: [
          { required: true, message: '请输入歌单Id', triggle: 'blur' }
        ]
      },
      // 存放获取的歌单列表
      parentCateList: [],
      // 编辑表单中歌单下拉列表选中的参数
      categorySelect: '',
      // 存放编辑表单的数据
      editForm: {},
      // 编辑表单的规则
      editFormRules: {
        name: [
          { required: true, message: '请输入歌曲名', triggle: 'blur' }
        ],
        listId: [
          { required: true, message: '请输入歌单名', triggle: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', triggle: 'blur' }
        ],
        musicId: [
          { required: true, message: '请输入musicId', triggle: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请输入图片URL', triggle: 'blur' }
        ],
        musicUrl: [
          { required: true, message: '请输入音乐URL', triggle: 'blur' }
        ]
      },
      selectList: {},
      colData: [{title: '多选框', istrue: true},
        {title: 'listId', istrue: true},
        {title: '歌曲ID', istrue: true},
        {title: '名称', istrue: true},
        {title: '作者', istrue: true},
        {title: '图片', istrue: true},
        {title: '图片URL', istrue: true},
        {title: '音乐URL', istrue: true},
        {title: '操作', istrue: true}],
      colOptions: ['多选框', 'listId', '歌曲ID', '名称', '作者', '图片', '图片URL', '音乐URL', '操作'],
      colSelect: ['多选框', 'listId', '歌曲ID', '名称', '作者', '图片', '图片URL', '音乐URL', '操作']
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
    // 获取歌曲列表
    getMusicList () {
      this.$axios.get('music/page', {params: this.queryInfo}).then((response) => {
        // console.log(response)
        this.musicList = response.data.list
        this.total = response.data.total
      }).catch((response) => {
        this.$message.error('获取歌曲列表失败！')
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
    // 关闭添加对话框并清除信息
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加音乐请求
    addMusic () {
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid)
        // console.log(this.addForm)
        if (!valid) return
        this.$axios.post('music', this.addForm).then((response) => {
          if (response.data) {
            this.$message.success('添加歌曲成功！')
            this.addDialogVisible = false
            this.getMusicList()
          } else { this.$message.error('添加歌曲失败！') }
        }).catch((response) => {
          this.$message.error('添加歌曲失败！')
          this.addDialogVisible = false
        })
      })
    },
    // 展示编辑框
    showEditDialog (musicId) {
      this.getPlaylist()
      this.editDialogVisible = true
      this.musicId.musicId = musicId
      this.$axios.get('music/detail', {params: this.musicId}).then((response) => {
        // console.log(response.data)
        this.editForm = response.data
        // console.log(this.editForm)
      }).catch((response) => {
        this.$message.error('查询歌曲信息失败！')
      })
      // console.log(id)
    },
    // 获取歌单数据填入编辑框中
    getPlaylist () {
      this.$axios.get('playlist').then((response) => {
        // console.log(response)
        this.parentCateList = response.data
        // console.log(this.parentCateList)
        // this.total = response.data.total
      }).catch((response) => {
        this.$message.error('获取父级分类失败！')
      })
    },
    parentCateChange () {

    },
    // 更新音乐数据
    editMusicInfo () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$axios.put('music', this.editForm).then((response) => {
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
    // 根据ID删除歌曲
    async deleteMusicById (musicId) {
      this.musicId.musicId = musicId
      const result = await this.$confirm('此操作将永久删除歌曲, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   console.log(result)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$axios.delete('music/', {params: this.musicId}).then((response) => {
        this.getMusicList()
        this.$message.success('删除歌曲成功！')
      }).catch((response) => {
        this.$message.error('删除歌曲失败！')
      })
    },
    // 存放选中的数据
    handleSelectionChange (val) {
      this.selectList = val
      // console.log(this.selectList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
