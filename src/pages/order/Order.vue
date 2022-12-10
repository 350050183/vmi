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
                    label="产品名称"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="product_name"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item
                    label="客户电话"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="customer_phone"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item
                    label="三方订单"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input placeholder="请输入" v-model="out_trade_no"/>
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
          <!--          <a-button @click="addNew" type="primary">新建</a-button>-->
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
            <a-dropdown v-auth:role="`del`">
              <a-menu @click="showModal" slot="overlay">
<!--                <a-menu-item :key="'1-'+record.id">新订单</a-menu-item>-->
                <a-menu-item :key="'2-'+record.id">审核通过</a-menu-item>
                <a-menu-item :key="'3-'+record.id">退回</a-menu-item>
                <a-menu-item :key="'4-'+record.id">退单</a-menu-item>
                <a-menu-item :key="'5-'+record.id">取消</a-menu-item>
              </a-menu>
              <a-button size="small">
                订单受理
                <a-icon type="down"/>
              </a-button>
            </a-dropdown>
            <a-dropdown v-auth:role="`del`">
              <a-menu @click="showModalDelivery" slot="overlay">
<!--                <a-menu-item :key="'1-'+record.id">待发货</a-menu-item>-->
                <a-menu-item :key="'2-'+record.id">发货</a-menu-item>
                <a-menu-item :key="'3-'+record.id">拦截/取消发货</a-menu-item>
                <a-menu-item :key="'5-'+record.id">退回</a-menu-item>
                <a-menu-item :key="'4-'+record.id">退货</a-menu-item>
              </a-menu>
              <a-button size="small">
                物流受理
                <a-icon type="down"/>
              </a-button>
            </a-dropdown>
            <a-button style="margin-left:5px;margin-top:3px;" size="small" @click="showOpLogDrawer(record.id)">
              操作日志
            </a-button>
            <a style="margin-right: 8px;margin-left: 8px" @click="onBeforeEdit(record.id)">
              <a-icon type="edit"/>
              修改
            </a>
          </div>
          <div slot="deleteRender" slot-scope="{text, record}"><span
              :style="record.is_delete==1?'color:red':''">{{ renderDeleteStatus(record.is_delete) }}</span></div>
          <div slot="cate_id" slot-scope="{text, record}">{{ renderCateId(record.cate_id) }}</div>
          <div slot="orderStatusRender" slot-scope="{text, record}">{{ orderStatusRender(record.order_status) }}</div>
          <div slot="deliveryStatusRender" slot-scope="{text, record}">
            {{ deliveryStatusRender(record.delivery_status_id) }}
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-drawer
        title="订单管理"
        placement="right"
        :closable="false"
        :visible="isDrawerVisible"
        @close="onDrawerClose"
        width="640"
    >
      <a-form :form="form">
        <a-form-item
            label="选择产品"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-select
              v-decorator="[
                  'product_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择" @change="onProductSelectChange">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in productDataSource" :key="item.id" :value="item.id">{{ item.name }}
            </a-select-option>
          </a-select>
          <a-button @click="this.getProductData" size="small">刷新</a-button>
        </a-form-item>
        <a-form-item
            label="选择SKU"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-select
              v-decorator="[
                  'sku_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in skuDataSource" :key="item.id" :value="item.id">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="经销商"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-select
              v-decorator="[
                  'wholesaler_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择" @change="onWholeSalerSelectChange">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in wholeSalerDataSource" :key="item.id" :value="item.id">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="经销商店铺"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-select
              v-decorator="[
                  'wholesaler_shop_id',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]" placeholder="请选择">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in wholeSalerShopDataSource" :key="item.id" :value="item.id">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="订单日期"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-date-picker v-decorator="[
                  'order_date',
                  {
                    rules: [{ required: true, message: '请选' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item
            label="第三方平台订单号"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-input v-decorator="[
                  'out_trade_no',
                  {
                    rules: [{ required: false, message: '请填写' }],
                  },
                ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="订单数量"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-input v-decorator="[
                  'sku_num',
                  {
                    rules: [{ required: true, message: '请填写' }],
                  },
                ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="客户昵称"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-input v-decorator="[
                  'customer_nickname',
                  {
                    rules: [{ required: false, message: '请填写' }],
                  },
                ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="客户姓名"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-input v-decorator="[
                  'customer_name',
                  {
                    rules: [{ required: true, message: '请填写' }],
                  },
                ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="客户联系电话"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-input v-decorator="[
                  'customer_phone',
                  {
                    rules: [{ required: true, message: '请填写' }],
                  },
                ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="客户地址"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-input v-decorator="[
                  'customer_address',
                  {
                    rules: [{ required: true, message: '请填写' }],
                  },
                ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="订单备注"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-textarea rows="4" v-decorator="[
                  'order_memo',
                  {
                    rules: [{ required: false, message: '请填写' }],
                  },
                ]" placeholder="请填写"/>
        </a-form-item>

        <a-form-item
            label="物流公司"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-select v-decorator="[
          'delivery_company_id',
          {
          rules: [{ required: true, message: '请填写' }],
          },
          ]" placeholder="请填写">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in deliveryDataSource" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="物流订单号"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-input v-decorator="[
          'delivery_track_no',
          {
          rules: [{ required: true, message: '请填写' }],
          },
          ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="物流费用"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-input v-decorator="[
          'delivery_fee',
          {
          rules: [{ required: true, message: '请填写' }],
          },
          ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="物流日期"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-date-picker v-decorator="[
          'delivery_date',
          {
          rules: [{ required: true, message: '请填写' }],
          },
          ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="备注"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
        >
          <a-textarea rows="4" v-decorator="[
          'delivery_memo',
          {
          rules: [{ required: false, message: '请填写' }],
          },
          ]" placeholder="请填写"></a-textarea>
        </a-form-item>
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
        title="操作日志"
        placement="right"
        :closable="true"
        :maskClosable="true"
        :visible="isDrawerVisibleOfOpLog"
        @close="onDrawerOfOpLogClose"
        width="640"
    >
      <div>
        <standard-table
            :columns="columnsOfOpLog"
            :dataSource="dataSourceOfOpLog"
            :pagination="{...paginationOfOpLog, onChange: onPageChangeOfOpLog}"
            :selectedRows.sync="selectedRows"
            @clear="onClear"
            @change="onChange"
            @selectedRowChange="onSelectChange"
        >
        </standard-table>
      </div>
    </a-drawer>
    <a-modal
        :title="modalTitle"
        :visible="modalVisible"
        :confirm-loading="modalConfirmLoading"
        @ok="modalHandleOk"
        @cancel="modalHandleCancel"
    >
      <a-form :form="form_modal">
        <a-form-item
            :label="'备注'+modalTitle+'原因'"
        >
          <a-textarea rows="4" v-decorator="[
          'op_memo',
          {
          rules: [{ required: false, message: '请填写' }],
          },
          ]" placeholder="请填写"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
        :title="modalTitleOfDelivey"
        :visible="modalVisibleOfDelivery"
        :confirm-loading="modalConfirmLoadingOfDelivery"
        @ok="modalHandleOkOfDelivery"
        @cancel="modalHandleCancel"
    >
      <a-form :form="form_modal_delivery">
        <a-form-item
            label="物流公司"
            v-if="this.modalOrderStatusOfDelivery==2"
        >
          <a-select v-decorator="[
          'delivery_company_id',
          {
          rules: [{ required: true, message: '请填写' }],
          },
          ]" placeholder="请填写">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in deliveryDataSource" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="物流订单号"
            v-if="this.modalOrderStatusOfDelivery==2"
        >
          <a-input v-decorator="[
          'delivery_track_no',
          {
          rules: [{ required: true, message: '请填写' }],
          },
          ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="物流费用"
            v-if="this.modalOrderStatusOfDelivery==2"
        >
          <a-input v-decorator="[
          'delivery_fee',
          {
          rules: [{ required: true, message: '请填写' }],
          },
          ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            label="物流日期"
            v-if="this.modalOrderStatusOfDelivery==2"
        >
          <a-date-picker v-decorator="[
          'delivery_date',
          {
          rules: [{ required: true, message: '请填写' }],
          },
          ]" placeholder="请填写"/>
        </a-form-item>
        <a-form-item
            :label="'备注'+modalTitleOfDelivey+'原因'"
        >
          <a-textarea rows="4" v-decorator="[
          'op_memo',
          {
          rules: [{ required: false, message: '请填写' }],
          },
          ]" placeholder="请填写"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {index, add, edit, del, undel, get,
  checkStatus, backStatus, returnStatus, cancelStatus,
  newStatusDelivery, checkStatusDelivery, interceptStatusDelivery, returnStatusDelivery, backStatusDelivery,
} from "@/services/Order";
import {mapGetters} from "vuex";
import {FILEMANAGER} from '../../services/api'
import {index as productIndex} from "@/services/Product";
import {index as skuIndex} from "@/services/Sku";
import {index as opLogIndex} from "@/services/OrderLog";
import {index as deliveryIndex} from "@/services/DeliveryCompany";
import {index as wholeSalerShopIndex} from "@/services/WholeSalerShop";
import {index as wholeSalerIndex} from "@/services/WholeSaler";


const columnsOfOpLog = [
  {
    title: '日期',
    dataIndex: 'cdate',
  },
  {
    title: '状态',
    dataIndex: 'order_status_str',
  },
  {
    title: '备注',
    dataIndex: 'memo',
  },
  {
    title: '帐号',
    dataIndex: 'account_id',
  },
]

const columns = [
  {
    title: '状态',
    dataIndex: 'order_status',
    scopedSlots: {customRender: 'orderStatusRender'}
  },
  {
    title: '物流',
    dataIndex: 'delivery_status_id',
    scopedSlots: {customRender: 'deliveryStatusRender'}
  },
  {
    title: '订单号',
    dataIndex: 'trade_no',
  },
  {
    title: '第三方订单号',
    dataIndex: 'out_trade_no',
  },
  {
    title: '产品名称',
    dataIndex: 'product_name',
    scopedSlots: {customRender: 'product_name'}
  },
  {
    title: 'SKU名称',
    dataIndex: 'sku_name',
    scopedSlots: {customRender: 'sku_name'}
  },
  {
    title: 'SKU数量',
    dataIndex: 'sku_num',
  },
  {
    title: '经销商',
    dataIndex: 'wholesaler_id',
    scopedSlots: {customRender: 'wholesalerRender'}
  },
  {
    title: '客户姓名',
    dataIndex: 'customer_name',
    needTotal: false,
  },
  {
    title: '客户电话',
    dataIndex: 'customer_phone',
    needTotal: false,
  },
  {
    title: '订单时间',
    dataIndex: 'order_date',
    sorter: true
  },
  {
    title: '创建时间',
    dataIndex: 'cdate',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: {customRender: 'action'}
  }
]

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name: 'Order',
  components: {StandardTable},
  data() {
    return {
      deliveryDataSource: [],
      currentOpLogOrderId: 0,
      dataSourceOfOpLog: [],
      isDrawerVisibleOfOpLog: false,
      modalOrderStatus: 0,
      modalOrderStatusOfDelivery: 0,
      modalOrderId: 0,
      form_modal: this.$form.createForm(this),
      form_modal_delivery: this.$form.createForm(this),
      modalTitle: '',
      modalTitleOfDelivey: '',
      modalVisible: false,
      modalVisibleOfDelivery: false,
      modalConfirmLoading: false,
      modalConfirmLoadingOfDelivery: false,
      product_name: '',
      customer_phone: '',
      out_trade_no: '',
      uploadedFile: '',
      uploadUrl: FILEMANAGER + '/upload',
      loading: false,
      imageUrl: '',
      cateDataSource: [],
      isEnterEditForm: false,
      currentEditId: 0,
      form: this.$form.createForm(this),
      isDrawerVisible: false,
      createNew: false,
      advanced: true,
      columns: columns,
      columnsOfOpLog: columnsOfOpLog,
      dataSource: [],
      productDataSource: [],
      skuDataSource: [],
      selectedRows: [],
      newName: '',
      newWholesalerId: '',
      name: '',
      wholesaler_id: '',
      is_delete: '0',
      wholeSalerDataSource: [],
      wholeSalerShopDataSource: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      paginationOfOpLog: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  authorize: {
    // deleteRecord: 'delete'
    onDel: {check: 'del', type: 'role'},
    onUnDel: {check: 'undel', type: 'role'}
  },
  mounted() {
    this.getProductData().then(()=>this.getSkuData()).then(()=>this.getData())
    this.getDeliveryData()
    this.getWholeSalerData()
    this.getWholeSalerShopData()
  },
  computed: {
    orderStatusDataSource: function () {
      return this.dictByCateCode()('order_status')
    },
    deliveryStatusDataSource: function () {
      return this.dictByCateCode()('delivery_status')
    },
  },
  methods: {
    ...mapGetters('dict', ['dictByCateCode']),
    showOpLogDrawer(order_id) {
      this.isDrawerVisibleOfOpLog = true
      this.currentOpLogOrderId = order_id
      this.getOpLogData()
    },
    showModal(e) {
      const [type, orderId] = e.key.split('-')
      this.modalOrderStatus = type
      this.modalOrderId = orderId
      console.log(type, orderId)
      this.modalVisible = true
      if (this.modalOrderStatus == '2') {
        this.modalTitle = '审核'
      } else if (this.modalOrderStatus == '3') {
        this.modalTitle = '退回'
      } else if (this.modalOrderStatus == '4') {
        this.modalTitle = '退单'
      } else if (this.modalOrderStatus == '5') {
        this.modalTitle = '取消'
      } else {
        this.modalTitle = '新订单'
      }
    },
    modalHandleOk() {
      this.modalConfirmLoading = true;
      if (this.modalOrderStatus == '2') {
        this.saveCheckStatus()
      } else if (this.modalOrderStatus == '3') {
        this.saveReturnStatus()
      } else if (this.modalOrderStatus == '4') {
        this.saveBackStatus()
      } else if (this.modalOrderStatus == '5') {
        this.saveCancelStatus()
      }
    },
    saveCheckStatus() {
      this.form_modal.validateFields((err, values) => {
        if (!err) {
          checkStatus({id: this.modalOrderId, order_status: this.modalOrderStatus, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisible = false;
              this.modalConfirmLoading = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoading = false;
            }
          })
        }
      })
    },
    saveReturnStatus() {
      this.form_modal.validateFields((err, values) => {
        if (!err) {
          returnStatus({id: this.modalOrderId, order_status: this.modalOrderStatus, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisible = false;
              this.modalConfirmLoading = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoading = false;
            }
          })
        }
      })
    },
    saveBackStatus() {
      this.form_modal.validateFields((err, values) => {
        if (!err) {
          backStatus({id: this.modalOrderId, order_status: this.modalOrderStatus, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisible = false;
              this.modalConfirmLoading = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoading = false;
            }
          })
        }
      })
    },
    saveCancelStatus() {
      this.form_modal.validateFields((err, values) => {
        if (!err) {
          cancelStatus({id: this.modalOrderId, order_status: this.modalOrderStatus, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisible = false;
              this.modalConfirmLoading = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoading = false;
            }
          })
        }
      })
    },
    modalHandleCancel() {
      console.log('Clicked cancel button');
      this.modalVisible = false;
      this.modalVisibleOfDelivery = false;
    },
    showModalDelivery(e) {
      const [type, orderId] = e.key.split('-')
      this.modalOrderStatusOfDelivery = type
      this.modalOrderId = orderId
      this.modalVisibleOfDelivery = true
      if (this.modalOrderStatusOfDelivery == '2') {
        this.modalTitleOfDelivey = '发货'
      } else if (this.modalOrderStatusOfDelivery == '3') {
        this.modalTitleOfDelivey = '拦截'
      } else if (this.modalOrderStatusOfDelivery == '4') {
        this.modalTitleOfDelivey = '退货'
      } else if (this.modalOrderStatusOfDelivery == '5') {
        this.modalTitleOfDelivey = '退回'
      } else {
        this.modalTitleOfDelivey = '待发货'
      }
    },
    modalHandleOkOfDelivery() {
      this.modalConfirmLoadingOfDelivery = true;
      if (this.modalOrderStatusOfDelivery == '1') {
        this.saveDeliveryWaitStatus()
      }else if (this.modalOrderStatusOfDelivery == '2') {
        this.saveDeliveryCheckStatus()
      } else if (this.modalOrderStatusOfDelivery == '3') {
        this.saveDeliveryInterceptStatus()
      } else if (this.modalOrderStatusOfDelivery == '4') {
        this.saveDeliveryReturnStatus()
      } else if (this.modalOrderStatusOfDelivery == '5') {
        this.saveDeliveryBackStatus()
      }
    },
    saveDeliveryWaitStatus() {
      this.form_modal_delivery.validateFields((err, values) => {
        if (!err) {
          newStatusDelivery({id: this.modalOrderId, order_status: this.modalOrderStatusOfDelivery, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisibleOfDelivery = false;
              this.modalConfirmLoadingOfDelivery = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoadingOfDelivery = false;
            }
          })
        }
      })
    },
    saveDeliveryCheckStatus() {
      this.form_modal_delivery.validateFields((err, values) => {
        if (!err) {
          checkStatusDelivery({id: this.modalOrderId, order_status: this.modalOrderStatusOfDelivery, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisibleOfDelivery = false;
              this.modalConfirmLoadingOfDelivery = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoadingOfDelivery = false;
            }
          })
        }
      })
    },
    saveDeliveryInterceptStatus() {
      this.form_modal_delivery.validateFields((err, values) => {
        if (!err) {
          interceptStatusDelivery({id: this.modalOrderId, order_status: this.modalOrderStatusOfDelivery, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisibleOfDelivery = false;
              this.modalConfirmLoadingOfDelivery = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoadingOfDelivery = false;
            }
          })
        }
      })
    },
    saveDeliveryReturnStatus() {
      this.form_modal_delivery.validateFields((err, values) => {
        if (!err) {
          returnStatusDelivery({id: this.modalOrderId, order_status: this.modalOrderStatusOfDelivery, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisibleOfDelivery = false;
              this.modalConfirmLoadingOfDelivery = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoadingOfDelivery = false;
            }
          })
        }
      })
    },
    saveDeliveryBackStatus() {
      this.form_modal_delivery.validateFields((err, values) => {
        if (!err) {
          backStatusDelivery({id: this.modalOrderId, order_status: this.modalOrderStatusOfDelivery, ...values}).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              this.getData()
              this.modalVisibleOfDelivery = false;
              this.modalConfirmLoadingOfDelivery = false;
            } else {
              this.$message.error(message)
              this.modalConfirmLoadingOfDelivery = false;
            }
          })
        }
      })
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
          if (info.file.response.status == 'done') {
            this.uploadedFile = info.file.response.relative_path
          }
        });
      }
    },
    beforeUpload(file) {
      this.uploadedFile = ''
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg/png格式');
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error('图片不能超过10MB');
      }
      return isJpgOrPng && isLt2M;
    },

    renderDeleteStatus(is_delete) {
      return parseInt(is_delete) === 1 ? '删除' : '正常'
    },
    orderStatusRender(order_status) {
      return this.orderStatusDataSource.filter(item => (item.code) === (order_status))[0]?.name
    },
    deliveryStatusRender(delivery_status) {
      return this.deliveryStatusDataSource.filter(item => (item.code) === (delivery_status))[0]?.name
    },
    renderCateId(cate_id) {
      return this.cateDataSource.filter(item => (item.id) === (cate_id))[0]?.name
    },
    handleReset() {
      this.form.resetFields();
    },
    onDrawerClose() {
      console.log('onDrawerClose')
      this.isDrawerVisible = false
    },
    onDrawerOfOpLogClose() {
      console.log('onDrawerClose')
      this.isDrawerVisibleOfOpLog = false
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
          add({cover_img: this.uploadedFile, ...values}).then(res => {
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
          if (detail.cover_img && detail.cover_img.length > 0) {
            this.imageUrl = process.env.VUE_APP_FILE_BASE_URL + detail.cover_img
          }
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
    onPageChangeOfOpLog(page, pageSize) {
      this.paginationOfOpLog.current = page
      this.paginationOfOpLog.pageSize = pageSize
      this.getOpLogData()
    },
    async cateCateData() {
      this.cateDataSource = this.dictByCateCode()('product_cate')
    },
    onProductSelectChange() {
      this.$nextTick(() => {
        console.log(this.form.getFieldValue('product_id'))
        this.currentProductId = this.form.getFieldValue('product_id')
        this.form.resetFields('sku_id')
        this.getSkuData()
      })

    },
    onWholeSalerSelectChange() {

      this.$nextTick(() => {
        console.log(this.form.getFieldValue('wholesaler_id'))
        this.currentWholeSalerId = this.form.getFieldValue('wholesaler_id')
        this.form.resetFields('wholesaler_shop_id')
        this.getWholeSalerShopData()
      })

    },
    async getData() {
      await index({
        product_name: this.product_name,
        customer_phone: this.customer_phone,
        out_trade_no: this.out_trade_no,
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
    async getDeliveryData() {
      await deliveryIndex({
        is_delete: 0,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.deliveryDataSource = list
        }
      })
    },
    async getWholeSalerData() {
      wholeSalerIndex({pageSize: 99999}).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.wholeSalerDataSource = list
        }
      })
    },
    async getWholeSalerShopData() {
      wholeSalerShopIndex({pageSize: 99999}).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.wholeSalerShopDataSource = list
        }
      })
    },
    async getOpLogData() {
      await opLogIndex({
        order_id: this.currentOpLogOrderId,
        page: this.paginationOfOpLog.current,
        pageSize: this.paginationOfOpLog.pageSize
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list, page, pageSize, total} = res?.data?.data ?? {}
          this.dataSourceOfOpLog = list
          this.paginationOfOpLog.current = page
          this.paginationOfOpLog.pageSize = pageSize
          this.paginationOfOpLog.total = total
        }
      })
    },
    async getProductData() {
      productIndex({
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
    async getSkuData() {
      skuIndex({
        product_id: this.currentEditId,
        is_delete: 0,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.skuDataSource = list
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


.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
