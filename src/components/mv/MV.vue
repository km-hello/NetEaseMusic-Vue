<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>MV管理</el-breadcrumb-item>
      <el-breadcrumb-item>MV列表</el-breadcrumb-item>
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
        <!-- 添加MV按钮 -->
        <el-col :span="3">
            <el-button type="primary" @click="addDialogVisible = true">添加MV</el-button>
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
        <el-table-column label="groupId" v-if="colData[1].istrue" width="60" prop="groupId"></el-table-column>
        <el-table-column label="视频ID" v-if="colData[2].istrue" width="70" prop="videoId"></el-table-column>
        <el-table-column label="名称" v-if="colData[3].istrue" prop="title"></el-table-column>
        <el-table-column label="作者" v-if="colData[4].istrue" width="120" prop="creatorName"></el-table-column>
        <el-table-column label="图片" v-if="colData[5].istrue" width="80" prop="imageUrl">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" width="50" height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="图片URL" v-if="colData[6].istrue" prop="imageUrl"></el-table-column>
        <el-table-column label="视频URL" v-if="colData[7].istrue"  prop="videoUrl"></el-table-column>
        <el-table-column label="操作" v-if="colData[8].istrue">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"   @click="showEditDialog(scope.row.videoId)"></el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="deleteMusicById(scope.row.videoId)"></el-button>
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
    <!-- 添加MV弹出框 -->
    <el-dialog
      title="添加MV"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="MV名称" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="creatorName">
          <el-input v-model="addForm.creatorName"></el-input>
        </el-form-item>
        <el-form-item label="videoId" prop="videoId">
          <el-input v-model="addForm.videoId"></el-input>
        </el-form-item>
        <el-form-item label="groupId" prop="groupId">
          <el-input v-model="addForm.groupId"></el-input>
        </el-form-item>
        <el-form-item label="imageUrl" >
          <el-input v-model="addForm.imageUrl"></el-input>
        </el-form-item>
         <el-form-item label="videoUrl">
          <el-input v-model="addForm.videoUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMusic">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改MV弹出框 -->
    <el-dialog
      title="修改MV信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="videoId">
          <el-input v-model="editForm.videoId" disabled></el-input>
        </el-form-item>
        <el-form-item label="groupId">
          <!-- <el-select v-model="editForm.listId" placeholder="请选择" @change="parentCateChange($event)" clearable>
            <el-option v-for="item in parentCateList" :key="item.listId" :label="item.listId" :value="item.listId"></el-option>
          </el-select> -->
          <el-input v-model="editForm.groupId"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="creatorName">
          <el-input v-model="editForm.creatorName"></el-input>
        </el-form-item>
        <el-form-item label="图片URL" >
          <el-input v-model="editForm.imageUrl"></el-input>
        </el-form-item>
        <el-form-item label="视频URL" >
          <el-input v-model="editForm.videoUrl"></el-input>
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
        pageSize: 5
      },
      videoId: {
        videoId: ''
      },
      // 存放MV数据的数组
      musicList: [],
      total: 0,
      // 添加对话框的显示与否
      addDialogVisible: false,
      // 编辑对话框的显示与否
      editDialogVisible: false,
      // 存放添加表单的数据
      addForm: {
        videoId: '',
        title: '',
        creatorName: '',
        musicId: '',
        imageUrl: '',
        videoUrl: '',
        groupId: ''
        // character: ''
      },
      // 添加表单的规则
      addFormRules: {
        title: [
          { required: true, message: '请输入MV名称', triggle: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入作者', triggle: 'blur' }
        ],
        videoId: [
          { required: true, message: '请输入videoId', triggle: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请输入图片URL', triggle: 'blur' }
        ],
        videoUrl: [
          { required: true, message: '请输入视频URL', triggle: 'blur' }
        ],
        groupId: [
          { required: true, message: '请输入groupId', triggle: 'blur' }
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
        title: [
          { required: true, message: '请输入MV名称', triggle: 'blur' }
        ],
        // listId: [
        //   { required: true, message: '请输入歌单名', triggle: 'blur' }
        // ],
        creatorName: [
          { required: true, message: '请输入作者', triggle: 'blur' }
        ],
        videoId: [
          { required: true, message: '请输入videoId', triggle: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请输入图片URL', triggle: 'blur' }
        ],
        videoUrl: [
          { required: true, message: '请输入视频URL', triggle: 'blur' }
        ]
      },
      selectList: {},
      colData: [{title: '多选框', istrue: true},
        {title: 'groupId', istrue: true},
        {title: '视频ID', istrue: true},
        {title: '名称', istrue: true},
        {title: '作者', istrue: true},
        {title: '图片', istrue: true},
        {title: '图片URL', istrue: true},
        {title: '视频URL', istrue: true},
        {title: '操作', istrue: true}],
      colOptions: ['多选框', 'groupId', '视频ID', '名称', '作者', '图片', '图片URL', '视频URL', '操作'],
      colSelect: ['多选框', 'groupId', '视频ID', '名称', '作者', '图片', '图片URL', '视频URL', '操作']
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
    // 获取MV列表
    getMusicList () {
      this.$axios.get('video/page', {params: this.queryInfo}).then((response) => {
        // console.log(response)
        this.musicList = response.data.list
        this.total = response.data.total
      }).catch((response) => {
        this.$message.error('获取MV列表失败！')
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
    // 添加MV请求
    addMusic () {
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid)
        // console.log(this.addForm)
        if (!valid) return
        this.$axios.post('video', this.addForm).then((response) => {
          if (response.data) {
            this.$message.success('添加MV成功！')
            this.addDialogVisible = false
            this.getMusicList()
          } else { this.$message.error('添加MV失败！') }
        }).catch((response) => {
          this.$message.error('添加MV失败！')
          this.addDialogVisible = false
        })
      })
    },
    // 展示编辑框
    showEditDialog (videoId) {
      // console.log(videoId)
      // this.getPlaylist()
      this.editDialogVisible = true
      this.videoId.videoId = videoId
      this.$axios.get('video/id', {params: this.videoId}).then((response) => {
        // console.log(response.data)
        this.editForm = response.data
        // console.log(this.editForm)
      }).catch((response) => {
        this.$message.error('查询MV信息失败！')
      })
      // console.log(id)
    },
    // 获取歌单数据填入编辑框中
    // getPlaylist () {
    //   this.$axios.get('playlist').then((response) => {
    //     // console.log(response)
    //     this.parentCateList = response.data
    //     // console.log(this.parentCateList)
    //     // this.total = response.data.total
    //   }).catch((response) => {
    //     this.$message.error('获取父级分类失败！')
    //   })
    // },
    // parentCateChange () {

    // },
    // 更新MV数据
    editMusicInfo () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$axios.put('video', this.editForm).then((response) => {
          console.log(response.data)
          if (response.data) {
            this.editDialogVisible = false
            this.getMusicList()
            this.$message.success('更新MV信息成功！')
          } else { this.$message.error('更新MV信息失败！') }
        }).catch((response) => {
          this.editDialogVisible = false
          this.$message.error('更新MV信息失败！')
        })
      })
    },
    // 根据ID删除MV
    async deleteMusicById (videoId) {
      this.videoId.videoId = videoId
      const result = await this.$confirm('此操作将永久删除MV, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   console.log(result)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$axios.delete('video/', {params: this.videoId}).then((response) => {
        this.getMusicList()
        this.$message.success('删除MV成功！')
      }).catch((response) => {
        this.$message.error('删除MV失败！')
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
