<template>
  <div>
    <a-card>
      <div class="search">
        <a-form layout="horizontal">
          <div>搜索</div>
          <div>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                    label="名称"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="name"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                    label="编码"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="code"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
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
          <a-button @click="addNew" type="primary">新建</a-button>
          <a-dropdown>
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
            <a @click="assignPermission(record.id)">
              <a-icon type="edit"/>
              权限分配
            </a>
            <a @click="onBeforeEdit(record.id)">
              <a-icon type="edit"/>
              修改
            </a>
            <a @click="onDel(record.id)" v-auth="`delete`" v-if="record.is_delete==0">
              <a-icon type="delete"/>
              删除
            </a>
            <a @click="onUnDel(record.id)" v-auth="`delete`" v-if="record.is_delete==1">
              <a-icon type="delete"/>
              恢复
            </a>
          </div>
          <div slot="deleteRender" slot-scope="{text, record}"><span
              :style="record.is_delete==1?'color:red':''">{{ renderDeleteStatus(record.is_delete) }}</span></div>
        </standard-table>
      </div>
    </a-card>
    <a-drawer
        title="角色管理"
        placement="right"
        :closable="false"
        :visible="isDrawerVisible"
        :after-visible-change="afterDrawerVisibleChange"
        @close="onDrawerClose"
        width="640"
    >
      <a-form :form="form" layout="vertical" ORDER>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="名称">
              <a-input
                  v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入名称' }],
                  },
                ]"
                  placeholder="请输入名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="编码">
              <a-input
                  v-decorator="[
                  'code',
                  {
                    rules: [{ required: true, message: '请输入编码' }],
                  },
                ]"
                  style="width: 100%"
                  placeholder="请输入编码"
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
        title="角色权限分配"
        placement="right"
        :closable="false"
        :visible="isDrawerVisibleOfPermission"
        :after-visible-change="afterDrawerVisibleChangeOfPermission"
        @close="onDrawerCloseOfPermission"
        width="700"
    >
      <a-form :form="form_role" layout="vertical" ORDER>
        <a-row :gutter="8">
          <a-col :span="24">
            <standard-table
                size="small"
                :columns="columnsOfPermission"
                :dataSource="dataSourceOfPermission"
                :selectedRows.sync="selectedRowsOfPermission"
                @clear="onClearOfPermission"
                @change="onChangeOfPermission"
                :pagination="{...paginationOfPermission, onChange: onPageChangeOfPermission}"
                @selectedRowChange="onSelectChangeOfPermission"
            >
              <div slot="action" slot-scope="{text, record}">
                <a-form-item>
                  <a-checkbox-group
                      v-decorator="['operation-group-'+record.id, { initialValue: [] }]"
                  >
                    <a-checkbox value="index">
                      查询
                    </a-checkbox>
                    <a-checkbox value="add">
                      新增
                    </a-checkbox>
                    <a-checkbox value="edit">
                      修改
                    </a-checkbox>
                    <a-checkbox value="del">
                      删除
                    </a-checkbox>
                    <a-checkbox value="undel">
                      恢复
                    </a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </div>
            </standard-table>

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
        <a-button type="default" :style="{ marginRight: '8px' }" @click="handleResetOfPermission">
          清空
        </a-button>
        <a-button :style="{ marginRight: '8px' }" @click="onDrawerCloseOfPermission">
          关闭
        </a-button>
        <a-button type="primary" @click="onCreatePermission" v-if="!isEnterEditFormOfPermission">
          保存
        </a-button>
        <a-button type="primary" @click="onEditPermission" v-if="isEnterEditFormOfPermission">
          修改
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {index, add, edit, del, undel, get, assign, get_assign} from "@/services/Role";
import {index as permissionIndex} from "@/services/Permission";

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    // scopedSlots: {customRender: 'name'}
  },
  {
    title: '编码',
    dataIndex: 'code',
    // scopedSlots: {customRender: 'code'}
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

const columnsOfPermission = [
  {
    title: '权限名称',
    dataIndex: 'name',
    // scopedSlots: {customRender: 'name'}
  },
  {
    title: '操作权限',
    scopedSlots: {customRender: 'action'}
  }
]

export default {
  name: 'Role',
  components: {StandardTable},
  data() {
    return {
      isEnterEditForm: false,
      isEnterEditFormOfPermission: false,
      currentEditId: 0,
      currentAssignRoleId: 0,
      form: this.$form.createForm(this),
      form_role: this.$form.createForm(this),
      isDrawerVisibleOfPermission: false,
      isDrawerVisible: false,
      createNew: false,
      advanced: true,
      columns: columns,
      columnsOfPermission: columnsOfPermission,
      dataSource: [],
      dataSourceOfPermission: [],
      selectedRows: [],
      selectedRowsOfPermission: [],
      newName: '',
      newCode: '',
      name: '',
      code: '',
      is_delete: '0',
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      paginationOfPermission: {
        current: 1,
        pageSize: 99999,
        total: 0
      }
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  mounted() {
    this.getDataOfPermission().then(() => this.getData())
  },
  methods: {
    renderDeleteStatus(is_delete) {
      return parseInt(is_delete) === 1 ? '删除' : '正常'
    },
    handleReset() {
      this.form.resetFields();
    },
    handleResetOfPermission() {
      this.form_role.resetFields();
    },
    onDrawerClose() {
      console.log('onDrawerClose')
      this.isDrawerVisible = false
    },
    onDrawerCloseOfPermission() {
      this.isDrawerVisibleOfPermission = false
    },
    afterDrawerVisibleChange(val) {
      console.log('afterDrawerVisibleChange', val)
    },
    afterDrawerVisibleChangeOfPermission(val) {
      console.log('afterDrawerVisibleChangeOfPermission', val)
    },
    addNew() {
      this.isEnterEditForm = false
      this.isDrawerVisible = true
      this.isEnterEditFormOfPermission = false
      this.isDrawerVisibleOfPermission = false
      this.currentEditId = 0
      this.$nextTick(() => {
        this.handleReset()
      })
    },
    assignPermission(id) {
      this.isEnterEditFormOfPermission = true
      this.isDrawerVisibleOfPermission = true
      this.currentAssignRoleId = id
      this.form_role.resetFields();
      this.$nextTick(() => {
        this.getRolePermissions()
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
    onCreatePermission(e) {
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
      this.isEnterEditForm = true
      this.currentEditId = id
      this.isEnterEditFormOfPermission = false
      this.isDrawerVisibleOfPermission = false

      this.$nextTick(() => {
        get({id: id}).then((res) => {
          const detail = res?.data?.data
          // this.form.getFieldDecorator('name',{initialValue:detail.name})
          // this.form.getFieldDecorator('code',{initialValue:detail.code})
          // this.form.getFieldDecorator('value',{initialValue:detail.value})
          this.form.setFieldsValue(detail)
        })
      })

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
    onEditPermission(e) {
      e.preventDefault();
      this.form_role.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          assign({
            id: this.currentAssignRoleId, permissions: values
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
    onPageChangeOfPermission(page, pageSize) {
      this.paginationOfPermission.current = page
      this.paginationOfPermission.pageSize = pageSize
      this.getDataOfPermission()
    },
    async getDataOfPermission() {
      permissionIndex({
        name: this.name,
        code: this.code,
        is_delete: this.is_delete,
        page: 1,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.dataSourceOfPermission = list
        }
      })
    },
    getRolePermissions() {
      get_assign({
        id: this.currentAssignRoleId,
        page: 1,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.form_role.setFieldsValue(list)
        }
      })
    },
    async getData() {
      index({
        name: this.name,
        code: this.code,
        is_delete: this.is_delete,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize
      }).then(res => {
        const {list, page, pageSize, total} = res?.data?.data ?? {}
        this.dataSource = list
        this.pagination.current = page
        this.pagination.pageSize = pageSize
        this.pagination.total = total
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
    onClearOfPermission() {
      // this.$message.info('您清空了勾选的所有行')
      console.log('onClearOfPermission')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange() {
      console.log('表格状态改变了', 'onChange')
    },
    onSelectChange() {
      // this.$message.info('选中行改变了')
    },
    onChangeOfPermission(selectedRowKeys, selectedRows) {
      console.log('表格状态改变了', 'onChangeOfPermission', selectedRowKeys, selectedRows)
    },
    onSelectChangeOfPermission(record, selected, original, isSelected) {
      // console.log('onSelectChangeOfPermission', original, isSelected)
      if (original != undefined) {
        if (original instanceof Array) {
          original.map(item => {
            let checkGroupName = 'operation-group-' + item.id
            this.form_role.setFieldsValue({[checkGroupName]: isSelected ? ['index', 'add', 'edit', 'del', 'undel'] : []})
          })
          let checkGroupName = 'operation-group-' + original.id
          this.form_role.setFieldsValue({[checkGroupName]: isSelected ? ['index', 'add', 'edit', 'del', 'undel'] : []})
        } else {
          let checkGroupName = 'operation-group-' + original.id
          this.form_role.setFieldsValue({[checkGroupName]: isSelected ? ['index', 'add', 'edit', 'del', 'undel'] : []})
        }
      }
      // console.log(this.selectedRowsOfPermission)
      // this.selectedRowsOfPermission.map(item=>{
      //   let checkGroupName = 'operation-group-'+item.id
      //   this.form_role.setFieldsValue({[checkGroupName]:['list','add','edit','delete']})
      // })
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
