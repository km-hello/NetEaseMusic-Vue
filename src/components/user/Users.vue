<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card >
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.name" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column label="用户名" width="80" prop="nickName"></el-table-column>
        <el-table-column label="头像" width="80" prop="imageUrl">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" width="50" height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row.phone)"></el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="deleteUserById(scope.row.phone)"></el-button>
            <!-- <el-button type="warning" icon="el-icon-setting" size='mini'></el-button> -->
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 2, 4, 5]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="nickName">
          <el-input v-model="addForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="imageUrl">
          <el-input v-model="addForm.imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹出框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="电话">
          <el-input v-model="editForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="imageUrl">
          <el-input v-model="editForm.imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义邮箱规则
    // var checkEmail = (rule, value, callback) => {
    //   const regEmail = /^\w+@\w+(\.\w+)+$/
    //   if (regEmail.test(value)) {
    //     // 合法邮箱
    //     return callback()
    //   }
    //   callback(new Error('请输入合法邮箱'))
    // }
    // 自定义手机号规则
    var checkPhone = (rule, value, callback) => {
      const regMobile = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        name: '',
        pageNum: 1,
        pageSize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      phone: {
        phone: ''
      },
      addForm: {
        // id: null,
        nickName: '',
        password: '',
        imageUrl: '',
        phone: ''
        // character: ''
      },
      addFormRules: {
        nickName: [
          { required: true, message: '请输入用户名', triggle: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', triggle: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请输入头像URL', triggle: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', triggle: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        nickName: [
          { required: true, message: '请输入用户名', triggle: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', triggle: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请输入头像URL', triggle: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.$axios.get('user/page', {params: this.queryInfo}).then((response) => {
        // console.log(response)
        this.userList = response.data.list
        this.total = response.data.total
      }).catch((response) => {
        this.$message.error('获取用户列表失败！')
      })
    },
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange (newpage) {
      console.log(newpage)
      this.queryInfo.pageNum = newpage
      this.getUserList()
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid)
        // console.log(this.addForm)
        if (!valid) return
        this.$axios.post('user', this.addForm).then((response) => {
          this.$message.success('添加用户成功！')
          this.addDialogVisible = false
          this.getUserList()
        }).catch((response) => {
          this.$message.error('添加用户失败！')
          this.addDialogVisible = false
        })
      })
    },
    showEditDialog (id) {
      this.editDialogVisible = true
      this.phone.phone = id
      this.$axios.get('user/phone', {params: this.phone}).then((response) => {
        // console.log(response.data)
        this.editForm = response.data
        // console.log(this.editForm)
      }).catch((response) => {
        this.$message.error('查询用户信息失败！')
      })
      // console.log(id)
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$axios.put('user', this.editForm).then((response) => {
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('更新用户信息成功！')
        }).catch((response) => {
          this.$message.error('更新用户信息失败！')
          this.editDialogVisible = false
        })
      })
    },
    async deleteUserById (id) {
      this.phone.phone = id
      const result = await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(result)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$axios.delete('user/', {params: this.phone}).then((response) => {
        this.$message.success('删除用户信息成功！')
        this.getUserList()
      }).catch((response) => {
        this.$message.error('删除用户信息失败！')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
