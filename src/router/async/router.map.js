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
  order: {
    name: '订单管理',
    icon: 'table',
    component: view.page
  },
  CreateOrder: {
    path: 'CreateOrder',
    name: '创建订单',
    component: () => import('@/pages/order/create/CreateOrder')
  },
  OrderList: {
    path: 'OrderList',
    name: '订单查询',
    component: () => import('@/pages/order/OrderList')
  },
  OrderSummary: {
    path: 'OrderSummary',
    name: '订单分析',
    component: () => import('@/pages/order/OrderSummary')
  },
  product: {
    name: '产品',
    icon: 'table',
    component: view.page
  },
  CreateProduct: {
    path: 'CreateProduct',
    name: '创建产品',
    component: () => import('@/pages/product/create/CreateProduct')
  },
  ProductList: {
    path: 'ProductList',
    name: '产品查询',
    component: () => import('@/pages/product/ProductList')
  },
  inventory: {
    name: '库存',
    icon: 'table',
    component: view.page
  },
  InventoryIn: {
    path: 'InventoryIn',
    name: '入库',
    component: () => import('@/pages/inventory/in/InventoryIn')
  },
  InventoryOut: {
    path: 'InventoryOut',
    name: '出库',
    component: () => import('@/pages/inventory/out/InventoryOut')
  },
  InventoryList: {
    path: 'InventoryList',
    name: '库存查询',
    component: () => import('@/pages/inventory/InventoryList')
  },
  account: {
    name: '帐号',
    icon: 'table',
    component: view.page
  },
  AccountList: {
    path: 'AccountList',
    name: '帐号列表',
    component: () => import('@/pages/account/AccountList')
  },
  RoleList: {
    path: 'RoleList',
    name: '角色列表',
    component: () => import('@/pages/account/RoleList')
  },
  PermissionList: {
    path: 'PermissionList',
    name: '权限列表',
    component: () => import('@/pages/account/PermissionList')
  },
  Role2Permission: {
    path: 'Role2Permission',
    name: '角色权限分配',
    component: () => import('@/pages/account/Role2Permission')
  },
  Account2Role: {
    path: 'Account2Role',
    name: '帐号角色分配',
    component: () => import('@/pages/account/Account2Role')
  },
  system: {
    name: '系统',
    icon: 'table',
    component: view.page
  },
  DictList: {
    path: 'DictList',
    name: '数据字典',
    component: () => import('@/pages/system/DictList')
  },
  DictCateList: {
    path: 'DictCateList',
    name: '数据字典类型',
    component: () => import('@/pages/system/DictCateList')
  },
  WholeSaler: {
    path: 'WholeSalerList',
    name: '经销商',
    component: () => import('@/pages/system/WholeSalerList')
  },
  DeliveryCompany: {
    path: 'DeliveryCompanyList',
    name: '快递公司',
    component: () => import('@/pages/system/DeliveryCompanyList')
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

