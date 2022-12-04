// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  root: {
    path: '/',
    name: '启动页',
    redirect: '/login',
    component: view.tabs
  },
  home: {
    name: '首页',
    component: view.blank
  },
  workplace: {
    name: '工作台',
    component: () => import('@/pages/home/workplace')
  },
  analysis: {
    name: '业绩分析',
    component: () => import('@/pages/home/analysis')
  },
  order2: {
    name: '订单',
    icon: 'table',
    component: view.page
  },
  CreateOrder: {
    path: 'CreateOrder',
    name: '下订单',
    component: () => import('@/pages/order/create/CreateOrder')
  },
  Order: {
    path: 'Order',
    name: '订单查询',
    component: () => import('@/pages/order/Order')
  },
  OrderSummary: {
    path: 'OrderSummary',
    name: '订单分析',
    component: () => import('@/pages/order/OrderSummary')
  },
  product2: {
    name: '产品',
    icon: 'table',
    component: view.page
  },
  CreateProduct: {
    path: 'CreateProduct',
    name: '添加产品',
    component: () => import('@/pages/product/create/CreateProduct')
  },
  Product: {
    path: 'Product',
    name: '产品管理',
    component: () => import('@/pages/product/Product.vue')
  },
  Sku: {
    path: 'SkuList',
    name: '产品SKU管理',
    component: () => import('@/pages/product/Sku.vue')
  },
  inventory2: {
    name: '库存',
    icon: 'table',
    component: view.page
  },
  Inventory: {
    path: 'Inventory',
    name: '库存管理',
    component: () => import('@/pages/inventory/Inventory.vue')
  },
  InventoryLog: {
    path: 'InventoryLog',
    name: '库存变更记录',
    component: () => import('@/pages/inventory/InventoryLog')
  },
  account2: {
    name: '帐号',
    icon: 'table',
    component: view.page
  },
  Account: {
    path: 'Account',
    name: '帐号列表',
    component: () => import('@/pages/account/Account.vue')
  },
  Role: {
    path: 'Role',
    name: '角色列表',
    component: () => import('@/pages/account/Role.vue')
  },
  Permission: {
    path: 'Permission',
    name: '权限列表',
    component: () => import('@/pages/account/Permission.vue')
  },
  // Role2Permission: {
  //   path: 'Role2Permission',
  //   name: '角色权限分配',
  //   component: () => import('@/pages/account/Role2Permission')
  // },
  // Account2Role: {
  //   path: 'Account2Role',
  //   name: '帐号角色分配',
  //   component: () => import('@/pages/account/Account2Role')
  // },
  system: {
    name: '系统',
    icon: 'table',
    component: view.page
  },
  Dict: {
    path: 'Dict',
    name: '数据字典',
    component: () => import('@/pages/system/Dict.vue')
  },
  DictCate: {
    path: 'DictCate',
    name: '数据字典类型',
    component: () => import('@/pages/system/DictCate.vue')
  },
  WholeSaler: {
    path: 'WholeSaler',
    name: '经销商',
    component: () => import('@/pages/system/WholeSaler.vue')
  },
  WholeSalerShop: {
    path: 'WholeSalerShop',
    name: '经销商店铺',
    component: () => import('@/pages/system/WholeSalerShop')
  },
  DeliveryCompany: {
    path: 'DeliveryCompany',
    name: '快递公司',
    component: () => import('@/pages/system/DeliveryCompany')
  },
  OpLog: {
    path: 'OpLog',
    name: '操作日志',
    component: () => import('@/pages/system/OpLog')
  },


  form: {
    name: '表单页',
    icon: 'form',
    component: view.page
  },
  basicForm: {
    path: 'basic',
    name: '基础表单',
    component: () => import('@/pages/form/basic')
  },
  stepForm: {
    path: 'step',
    name: '分步表单',
    component: () => import('@/pages/form/step')
  },
  advanceForm: {
    path: 'advance',
    name: '高级表单',
    component: () => import('@/pages/form/advance')
  },
  list: {
    name: '列表页',
    icon: 'table',
    component: view.page
  },
  queryList: {
    path: 'query',
    name: '查询表格',
    component: () => import('@/pages/list/QueryList')
  },
  primaryList: {
    path: 'primary',
    name: '标准列表',
    component: () => import('@/pages/list/StandardList')
  },
  cardList: {
    path: 'card',
    name: '卡片列表',
    component: () => import('@/pages/list/CardList')
  },
  searchList: {
    path: 'search',
    name: '搜索列表',
    component: () => import('@/pages/list/search/SearchLayout')
  },
  article: {
    name: '文章',
    component: () => import('@/pages/list/search/ArticleList')
  },
  application: {
    name: '应用',
    component: () => import('@/pages/list/search/ApplicationList')
  },
  project: {
    name: '项目',
    component: () => import('@/pages/list/search/ProjectList')
  },
  details: {
    name: '详情页',
    icon: 'profile',
    component: view.blank
  },
  basicDetails: {
    path: 'basic',
    name: '基础详情页',
    component: () => import('@/pages/detail/BasicDetail')
  },
  advanceDetails: {
    path: 'advance',
    name: '高级详情页',
    component: () => import('@/pages/detail/AdvancedDetail')
  },
  result: {
    name: '结果页',
    icon: 'check-circle-o',
    component: view.page
  },
  success: {
    name: '成功',
    component: () => import('@/pages/result/Success')
  },
  error: {
    name: '失败',
    component: () => import('@/pages/result/Error')
  },
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  },
  components: {
    name: '小组件',
    icon: 'appstore-o',
    component: view.page
  },
  taskCard: {
    name: '任务卡片',
    component: () => import('@/pages/components/TaskCard')
  },
  palette: {
    name: '颜色复选框',
    component: () => import('@/pages/components/Palette')
  }
}
export default routerMap

