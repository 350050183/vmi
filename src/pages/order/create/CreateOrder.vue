<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form :form="form">
      <a-form-item
          label="选择产品"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
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
          :wrapperCol="{span: 15}"
      >
        <a-textarea rows="4" v-decorator="[
                  'order_memo',
                  {
                    rules: [{ required: false, message: '请填写' }],
                  },
                ]" placeholder="请填写"/>
      </a-form-item>

      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" @click="onCreateOrder">{{ $t('submit') }}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import {index as productIndex} from "@/services/Product";
import {index as skuIndex} from "@/services/Sku";
import {index as wholeSalerIndex} from "@/services/WholeSaler";
import {index as wholeSalerShopIndex} from "@/services/WholeSalerShop";
import {add} from "@/services/Order";

export default {
  name: 'BasicForm',
  i18n: require('./i18n'),
  data() {
    return {
      value: 1,
      form: this.$form.createForm(this, {name: 'coordinated'}),
      productDataSource: [],
      skuDataSource: [],
      wholeSalerDataSource: [],
      wholeSalerShopDataSource: [],
      currentProductId: 0,
      currentWholeSalerId: 0,
    }
  },
  computed: {
    desc() {
      return this.$t('pageDesc')
    }
  },
  authorize:{
    'onCreateOrder':'add',
  },
  mounted() {
    this.getProductData()

    this.getWholeSalerData()
  },
  methods: {
    onCreateOrder(e) {

      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          add(values).then(res => {
            const {success, message} = res?.data ?? {}
            if (success) {
              this.$message.success(message)
              // this.getData()
              this.form.resetFields()
            } else {
              this.$message.error(message)
            }
          })
        }
      });
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
    async getSkuData() {
      await skuIndex({
        product_id: this.currentProductId,
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
    async getWholeSalerData() {
      await wholeSalerIndex({
        is_delete: 0,
        pageSize: 99999
      }).then(res => {
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
      await wholeSalerShopIndex({
        wholesaler_id: this.currentWholeSalerId,
        is_delete: 0,
        pageSize: 99999
      }).then(res => {
        const {success, message, code} = res?.data ?? {}
        if (!success) {
          this.$message.warning(code + ': ' + message)
        } else {
          const {list} = res?.data?.data ?? {}
          this.wholeSalerShopDataSource = list
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
