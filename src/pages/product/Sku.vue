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
                    label="SKU名称"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="name"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item
                    label="编码"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="code"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item
                    label="型号"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="model"/>
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
            <a style="margin-right: 8px" @click="onBeforeEdit(record.id)">
              <a-icon type="edit"/>
              修改
            </a>
            <a @click="onDel(record.id)" v-auth:role="`delete`" v-if="record.is_delete==0">
              <a-icon type="delete"/>
              删除
            </a>
            <a @click="onUnDel(record.id)" v-auth:role="`delete`" v-if="record.is_delete==1">
              <a-icon type="delete"/>
              恢复
            </a>
          </div>
          <div slot="deleteRender" slot-scope="{text, record}"><span
              :style="record.is_delete==1?'color:red':''">{{ renderDeleteStatus(record.is_delete) }}</span></div>
          <div slot="specRender" slot-scope="{text, record}">{{ specRender(record.spec_id) }}</div>
          <div slot="materialRender" slot-scope="{text, record}">{{ materialRender(record.material_id) }}</div>
          <div slot="colorRender" slot-scope="{text, record}">{{ colorRender(record.color_id) }}</div>
        </standard-table>
      </div>
    </a-card>
    <a-drawer
        title="产品管理"
        placement="right"
        :closable="false"
        :visible="isDrawerVisible"
        @close="onDrawerClose"
        width="640"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">

          <a-col :span="12">
            <a-form-item
                label="产品"
            >
              <a-select
                  v-decorator="[
                  'product_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in productDataSource" :key="item.id" :value="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
              <a-button @click="this.getProductData" size="small">刷新</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="名称">
              <a-input
                  v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入帐号名称' }],
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
            <a-form-item
                label="型号"
            >
              <a-input
                  v-decorator="[
                  'model',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请填写">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
                label="规格"
            >
              <a-select
                  v-decorator="[
                  'spec_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in specDataSource" :key="item.id" :value="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
                label="材质"
            >
              <a-select
                  v-decorator="[
                  'material_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in materialDataSource" :key="item.id" :value="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
                label="颜色"
            >
              <a-select
                  v-decorator="[
                  'color_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in colorDataSource" :key="item.id" :value="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
                label="重量单位"
            >
              <a-select
                  v-decorator="[
                  'weight_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in weightDataSource" :key="item.id" :value="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
                label="长度单位"
            >
              <a-select
                  v-decorator="[
                  'length_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in lengthDataSource" :key="item.id" :value="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
                label="最低库存"
            >
              <a-input
                  v-decorator="[
                  'least_stock',
                  {
                    rules: [{ required: false, message: '请填写' }],
                  },
                ]" placeholder="请填写">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
                label="描述"
            >
              <a-textarea
                  v-decorator="[
                  'desc',
                  {
                    rules: [{ required: false, message: '请填写描述' }],
                  },
                ]" placeholder="请填写描述" :auto-size="{ minRows: 3, maxRows: 5 }">
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
import {index, add, edit, del, undel, get} from "@/services/ProductSku";
import {index as productIndex} from "@/services/Product";
import {mapGetters} from "vuex";

const columns = [
  {
    title: 'SKU名称',
    dataIndex: 'name',
    // scopedSlots: {customRender: 'name'}
  },
  {
    title: '编码',
    dataIndex: 'code',
  },
  {
    title: '型号',
    dataIndex: 'model',
  },
  {
    title: '规格',
    dataIndex: 'spec_id',
    scopedSlots: {customRender: 'specRender'}
  },
  {
    title: '材质',
    dataIndex: 'material_id',
    scopedSlots: {customRender: 'materialRender'}
  },
  {
    title: '颜色',
    dataIndex: 'color_id',
    scopedSlots: {customRender: 'colorRender'}
  },
  {
    title: '最低库存',
    dataIndex: 'least_stock',
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
  name: 'Sku',
  components: {StandardTable},
  data() {
    return {
      isEnterEditForm: false,
      currentEditId: 0,
      form: this.$form.createForm(this),
      isDrawerVisible: false,
      createNew: false,
      advanced: true,
      columns: columns,
      productDataSource: [],
      dataSource: [],
      selectedRows: [],
      newName: '',
      newWholesalerId: '',
      name: '',
      code: '',
      model: '',
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
    this.getProductData().then(() => this.getData())
  },
  computed: {
    specDataSource: function () {
      return this.dictByCateCode()('product_spec')
    },
    colorDataSource: function () {
      return this.dictByCateCode()('color')
    },
    weightDataSource: function () {
      return this.dictByCateCode()('weight_unit')
    },
    feeDataSource: function () {
      return this.dictByCateCode()('fee_cate')
    },
    platformDataSource: function () {
      return this.dictByCateCode()('online_platform')
    },
    lengthDataSource: function () {
      return this.dictByCateCode()('length_unit')
    },
    materialDataSource: function () {
      return this.dictByCateCode()('material')
    },
  },
  methods: {
    ...mapGetters('dict', ['dictByCateCode']),
    renderDeleteStatus(is_delete) {
      return parseInt(is_delete) === 1 ? '删除' : '正常'
    },
    specRender(spec_id) {
      return this.specDataSource.filter(item => (item.id) === (spec_id))[0]?.name
    },
    materialRender(material_id) {
      return this.materialDataSource.filter(item => (item.id) === (material_id))[0]?.name
    },
    colorRender(color_id) {
      return this.colorDataSource.filter(item => (item.id) === (color_id))[0]?.name
    },
    handleReset() {
      this.form.resetFields();
    },
    onDrawerClose() {
      console.log('onDrawerClose')
      this.isDrawerVisible = false
    },
    addNew() {
      this.isEnterEditForm = false
      this.isDrawerVisible = true
      this.currentEditId = 0
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
      this.isEnterEditForm = true
      this.currentEditId = id

      this.$nextTick(() => {
        get({id: id}).then((res) => {
          const detail = res?.data?.data
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
    async getData() {
      await index({
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
    async getProductData() {
      await productIndex({
        is_delete: 0,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.productDataSource = list
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
      // this.$message.info('你点击了状态栏表头')
    },
    onChange() {
      // this.$message.info('表格状态改变了')
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
