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
          <a-button @click="addNew" type="primary" v-auth:role="`add`">新建</a-button>
          <a-dropdown v-auth:role="`edit`">
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
            </a><br/>
            <a-popconfirm
                title="确定要删除?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="onDel(record.id)"
                v-auth:role="`del`" v-if="record.is_delete==0"
            >
              <a href="#"><a-icon type="delete"/>删除</a>
            </a-popconfirm>
            <a @click="onUnDel(record.id)" v-auth:role="`undel`" v-if="record.is_delete==1">
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
        title="管理"
        placement="right"
        :closable="true"
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
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="联系人">
              <a-input
                  v-decorator="[
                  'contact',
                  {
                    rules: [{ required: true, message: '请输入联系人' }],
                  },
                ]"
                  placeholder="请输入联系人"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="电话">
              <a-input
                  v-decorator="[
                  'phone',
                  {
                    rules: [{ required: true, message: '请输入电话' }],
                  },
                ]"
                  style="width: 100%"
                  placeholder="请输入电话"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="地址">
              <a-input
                  v-decorator="[
                  'address',
                  {
                    rules: [{ required: true, message: '请输入地址' }],
                  },
                ]"
                  style="width: 100%"
                  placeholder="请输入地址"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
                label="备注"
            >
              <a-textarea :auto-size="{ minRows: 3, maxRows: 5 }"
                          v-decorator="[
                  'memo',
                  {
                    rules: [{ required: true, message: '请填写备注' }],
                  },
                ]" placeholder="请输入备注">
              </a-textarea>
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
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {index, add, edit, del, undel, get} from "@/services/DeliveryCompany";
import {index as dictIndex} from "@/services/Dict";

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
    title: '联系人',
    dataIndex: 'contact',
    // scopedSlots: {customRender: 'code'}
  },
  {
    title: '电话',
    dataIndex: 'phone',
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
    scopedSlots: {customRender: 'action'},
    width:100,
    fixed: 'right',
  }
]

export default {
  name: 'DeliveryCompany',
  components: {StandardTable},
  data() {
    return {
      onlinePlatformDataSource: [],
      isEnterEditForm: false,
      currentEditId: 0,
      form: this.$form.createForm(this),
      isDrawerVisible: false,
      createNew: false,
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      newName: '',
      newCode: '',
      name: '',
      code: '',
      is_delete: '0',
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  mounted() {
    this.getOnlinePlatformData().then(() => this.getData())
  },
  methods: {
    renderDeleteStatus(is_delete) {
      return parseInt(is_delete) === 1 ? '删除' : '正常'
    },
    handleReset() {
      this.form.resetFields();
    },
    onDrawerClose() {
      console.log('onDrawerClose')
      this.isDrawerVisible = false
    },
    afterDrawerVisibleChange(val) {
      console.log('afterDrawerVisibleChange', val)
    },
    addNew() {
      this.isEnterEditForm = false
      this.isDrawerVisible = true
      this.currentEditId = 0
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
      this.isEnterEditForm = true
      this.currentEditId = id

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
    async getOnlinePlatformData() {
      dictIndex({
        cate_code: 'online_platform',
        is_delete: this.is_delete,
        page: 1,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.onlinePlatformDataSource = list
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
