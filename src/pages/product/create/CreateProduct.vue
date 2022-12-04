<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form :from="form">
      <a-form-item
        label="名称"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input
            v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入产品名称' }],
                  },
                ]" placeholder="请输入产品名称" />
      </a-form-item>
      <a-form-item
        label="类别"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >

        <a-select
            v-decorator="[
                  'wholesaler_id',
                  {
                    rules: [{ required: true, message: '请选择经销商' }],
                  },
                ]" placeholder="请选择">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="item in cateDataSource" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('describe')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-textarea rows="4" :placeholder="$t('describeInput')"/>
      </a-form-item>
      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary">{{$t('save')}}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  name: 'BasicForm',
  i18n: require('./i18n'),
  data () {
    return {
      cateDataSource:[],
      form:this.$form.createForm(this),
      value: 1
    }
  },
  computed: {
    desc() {
      return this.$t('pageDesc')
    }
  }
}
</script>

<style scoped>

</style>
