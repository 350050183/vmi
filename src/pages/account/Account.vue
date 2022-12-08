<template>
  <div>
    <a-card>
      <div class="search">
        <a-form layout="horizontal">
          <div>搜索</div>
          <div>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item
                    label="帐号"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="name"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item
                    label="电话"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="phone"/>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item
                    label="状态"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-select placeholder="请选择" :value="is_delete=='1'?'删除':(is_delete=='0'?'正常':'全部')"
                            @change="onStatusChange">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">正常</a-select-option>
                    <a-select-option value="1">删除</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="onSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="onSearchReset">重置</a-button>
        </span>
        </a-form>
      </div>
      <div>
        <a-space class="operator">
          <a-button @click="addNew" type="primary" v-auth:role="`add`">新建</a-button>
          <a-dropdown v-auth:role="`del`">
            <a-menu @click="handleMenuClick" slot="overlay">
              <a-menu-item key="delete">删除</a-menu-item>
              <a-menu-item key="undelete">恢复</a-menu-item>
            </a-menu>
            <a-button>
              批量操作
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </a-space>

        <standard-table
            :columns="columns"
            :dataSource="dataSource"
            :selectedRows.sync="selectedRows"
            @clear="onClear"
            @change="onChange"
            :pagination="{...pagination, onChange: onPageChange}"
            @selectedRowChange="onSelectChange"
        >
          <div slot="action" slot-scope="{text, record}">
            <a style="margin-right: 8px" @click="onBeforeEdit(record.id)" v-auth:role="`edit`">
              <a-icon type="edit"/>
              修改
            </a>
            <a style="margin-right: 8px" @click="onBeforeResetPassword(record.id)" v-auth:role="`edit`">
              <a-icon type="edit"/>
              重置密码
            </a>
            <a @click="onDel(record.id)" v-auth:role="`del`" v-if="record.is_delete==0">
              <a-icon type="delete"/>
              删除
            </a>
            <a @click="onUnDel(record.id)" v-auth:role="`undel`" v-if="record.is_delete==1">
              <a-icon type="delete"/>
              恢复
            </a>
          </div>
          <div slot="deleteRender" slot-scope="{text, record}"><span
              :style="record.is_delete==1?'color:red':''">{{ renderDeleteStatus(record.is_delete) }}</span></div>
          <div slot="wholesaler_id" slot-scope="{text, record}">{{ renderWholeSaler(record.wholesaler_id) }}</div>
          <div slot="roleRender" slot-scope="{text, record}">{{ roleRender(record.roles) }}</div>
        </standard-table>
      </div>
    </a-card>
    <a-drawer
        title="帐号管理"
        placement="right"
        :closable="false"
        :visible="isDrawerVisible"
        :after-visible-change="afterDrawerVisibleChange"
        @close="onDrawerClose"
        width="640"
    >
      <a-form :form="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="帐号">
              <a-input
                  v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入帐号名称' }],
                  },
                ]"
                  placeholder="请输入帐号名称"
                  :disabled="isEnterEditForm"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密码" v-if="!isEnterEditForm">
              <a-input
                  v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: '请输入密码' }],
                  },
                ]"
                  style="width: 100%"
                  placeholder="请输入密码"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="电话">
              <a-input
                  v-decorator="[
                  'phone',
                  {
                    rules: [{ required: true, message: '请输入电话' }],
                  },
                ]"
                  placeholder="请输入电话"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
                label="角色"
            >
              <a-select
                  v-decorator="[
                  'role_ids',
                  {
                    rules: [{ required: true, message: '请选择角色' }],
                  },
                ]" placeholder="请选择" mode="multiple" option-label-prop="label">
                <a-select-option value="" label="">请选择</a-select-option>
                <a-select-option v-for="item in dataSourceOfRole" :key="item.id" :value="item.id" :label="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-button @click="this.getRoleData" size="small" style="margin-right:8px;">刷新</a-button>
              <router-link :to="`/account/RoleList`">角色管理</router-link>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
                label="经销商"
            >
              <a-select
                  v-decorator="[
                  'wholesaler_id',
                  {
                    rules: [{ required: false, message: '请选择经销商' }],
                  },
                ]" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in wholesalerDataSource" :key="item.id" :value="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
              <a-button @click="this.getWholesalerData" size="small" style="margin-right:8px;">刷新</a-button>
              <router-link :to="`/system/WholeSaler`">经销商管理</router-link>
            </a-form-item>
          </a-col>

        </a-row>

      </a-form>
      <div
          :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button type="default" :style="{ marginRight: '8px' }" @click="handleReset">
          清空
        </a-button>
        <a-button :style="{ marginRight: '8px' }" @click="onDrawerClose">
          关闭
        </a-button>
        <a-button type="primary" @click="onCreate" v-if="!isEnterEditForm">
          保存
        </a-button>
        <a-button type="primary" @click="onEdit" v-if="isEnterEditForm">
          修改
        </a-button>
      </div>
    </a-drawer>
    <a-drawer
        title="重置密码"
        placement="right"
        :closable="false"
        :visible="isDrawerVisibleResetPassword"
        @close="onDrawerCloseResetPassword"
        width="640"
    >
      <a-form :form="form_reset_password" layout="vertical" ORDER>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="新密码">
              <a-input
                  v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: '请输入新密码',min:6 }],
                  },
                ]"
                  placeholder="请输入新密码"
                  min="6"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="重复密码">
              <a-input
                  v-decorator="[
                  'password2',
                  {
                    rules: [{ required: true, message: '请重复输入密码',min:6 }],
                  },
                ]"
                  style="width: 100%"
                  placeholder="请重复输入密码"
              />
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
      <div
          :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button type="default" :style="{ marginRight: '8px' }" @click="handleReset">
          清空
        </a-button>
        <a-button :style="{ marginRight: '8px' }" @click="onDrawerCloseResetPassword">
          关闭
        </a-button>
        <a-button type="primary" @click="onResetPassword">
          修改
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {index, add, edit, del, undel, get, reset_password} from "@/services/Account";
import {index as roleIndex} from "@/services/Role";
import {index as wholeSalerIndex} from "@/services/WholeSaler";

const columns = [
  {
    title: '帐号',
    dataIndex: 'name',
    // scopedSlots: {customRender: 'name'}
  },
  {
    title: '电话',
    dataIndex: 'phone',
    // scopedSlots: {customRender: 'name'}
  },
  {
    title: '分销商',
    dataIndex: 'wholesaler_id',
    scopedSlots: {customRender: 'wholesaler_id'}
  },
  {
    title: '角色',
    dataIndex: 'roles',
    scopedSlots: {customRender: 'roleRender'}
  },
  {
    title: '状态',
    dataIndex: 'is_delete',
    needTotal: false,
    scopedSlots: {customRender: 'deleteRender'}
  },
  {
    title: '更新时间',
    dataIndex: 'mdate',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: {customRender: 'action'}
  }
]

export default {
  name: 'Account',
  components: {StandardTable},
  data() {
    return {
      wholesalerDataSource: [],
      dataSourceOfRole: [],
      isEnterEditForm: false,
      isEnterResetPasswordForm: false,
      currentEditId: 0,
      form: this.$form.createForm(this),
      form_reset_password: this.$form.createForm(this),
      isDrawerVisible: false,
      isDrawerVisibleResetPassword: false,
      createNew: false,
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      newName: '',
      newWholesalerId: '',
      name: '',
      phone: '',
      wholesaler_id: '',
      is_delete: '0',
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  authorize: {
    // deleteRecord: 'delete'
    onDel: {check: 'delete', type: 'role'},
    onUnDel: {check: 'delete', type: 'role'}
  },
  mounted() {
    this.getWholesalerData().then(() => this.getRoleData()).then(() => this.getData())
  },
  methods: {
    renderDeleteStatus(is_delete) {
      return parseInt(is_delete) === 1 ? '删除' : '正常'
    },
    renderWholeSaler(wholesaler_id) {
      return this.wholesalerDataSource.filter(item => (item.id) === (wholesaler_id))[0]?.name
    },
    roleRender(roles) {
      return roles.join(',')
    },
    handleReset() {
      this.form.resetFields();
    },
    onDrawerClose() {
      console.log('onDrawerClose')
      this.isDrawerVisible = false
    },
    onDrawerCloseResetPassword() {
      console.log('onDrawerCloseResetPassword')
      this.isDrawerVisibleResetPassword = false
    },
    afterDrawerVisibleChange(val) {
      console.log('afterDrawerVisibleChange', val)
    },
    addNew() {
      this.isEnterEditForm = false
      this.isDrawerVisible = true
      this.isDrawerVisibleResetPassword = false
      this.currentEditId = 0
      // this.form.setFieldsValue({})
      this.$nextTick(() => {
        this.handleReset()
      })

    },
    onCreate(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          add(values).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
            } else {
              this.$message.error(message)
            }
          })
        }
      });
    },
    onBeforeEdit(id) {
      this.isDrawerVisible = true
      this.isDrawerVisibleResetPassword = false
      this.isEnterEditForm = true
      this.currentEditId = id

      this.$nextTick(() => {
        get({id: id}).then((res) => {
          const detail = res?.data?.data
          this.form.setFieldsValue(detail)
        })
      })

    },
    onBeforeResetPassword(id) {
      this.isDrawerVisible = false
      this.isDrawerVisibleResetPassword = true
      this.isEnterResetPasswordForm = id

    },
    onEdit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          edit({
            id: this.currentEditId, ...values
          }).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.isDrawerVisible = false
            } else {
              this.$message.error(message)
            }
          })
        }
      });

    },
    onResetPassword(e) {
      e.preventDefault();
      this.form_reset_password.validateFields((err, values) => {
        if (!err) {
          reset_password({
            id: this.isEnterResetPasswordForm, ...values
          }).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.isDrawerVisibleResetPassword = false
            } else {
              this.$message.error(message)
            }
          })
        }
      });

    },
    onDel(id) {
      let ids
      if (id && id != 0) {
        ids = [id]
      } else {
        ids = this.selectedRows.map(item => item.id)
      }
      if (ids.length <= 0) {
        this.$message.error('请选择记录再操作')
        return
      }
      del({
        ids: ids,
      }).then(res => {
        const {success, message} = res?.data ?? {}
        if (success) {
          this.$message.success(message)
          this.selectedRows = []
          this.getData()
        } else {
          this.$message.error(message)
        }
      })
    },
    onUnDel(id) {
      let ids
      if (id && id != 0) {
        ids = [id]
      } else {
        ids = this.selectedRows.map(item => item.id)
      }
      if (ids.length <= 0) {
        this.$message.error('请选择记录再操作')
        return
      }
      undel({
        ids: ids,
      }).then(res => {
        const {success, message} = res?.data ?? {}
        if (success) {
          this.$message.success(message)
          this.selectedRows = []
          this.getData()
        } else {
          this.$message.error(message)
        }
      })
    },
    onSearchReset() {
      this.name = ''
      this.code = ''
      this.is_delete = '0'
      this.onSearch()
    },
    onSearch() {
      this.getData()
    },
    onStatusChange(val) {
      this.is_delete = val
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.getData()
    },
    async getWholesalerData() {
      await wholeSalerIndex({
        is_delete: 0,
        page: 1,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.wholesalerDataSource = list
        }
      })
    },
    async getRoleData() {
      await roleIndex({
        is_delete: 0,
        page: 1,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.dataSourceOfRole = list
        }
      })
    },
    async getData() {
      await index({
        name: this.name,
        code: this.code,
        phone: this.phone,
        is_delete: this.is_delete,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list, page, pageSize, total} = res?.data?.data ?? {}
          this.dataSource = list
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          this.pagination.total = total
        }
      })
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.id !== key)
      this.selectedRows = this.selectedRows.filter(item => item.id !== key)
    },
    remove() {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.id === item.id) === -1)
      this.selectedRows = []
    },
    onClear() {
      // this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange() {
      this.$message.info('表格状态改变了')
    },
    onSelectChange() {
      // this.$message.info('选中行改变了')
    },
    handleMenuClick(e) {
      if (e.key === 'delete') {
        // this.remove()
        this.onDel(0)
      } else if (e.key == 'undelete') {
        this.onUnDel(0)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
