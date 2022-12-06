//跨域代理前缀
const API_PROXY_PREFIX='/vmi'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `${BASE_URL}/login`,
  ROUTES: `${BASE_URL}/routes`,
  DICTCATE: `${BASE_URL}/DictCate/`,
  DICT: `${BASE_URL}/Dict/`,
  ORDER: `${BASE_URL}/Order/`,
  PRODUCT: `${BASE_URL}/Product/`,
  SKU: `${BASE_URL}/Sku/`,
  INVENTORY: `${BASE_URL}/Inventory/`,
  INVENTORYLOG: `${BASE_URL}/InventoryLog/`,
  OPLOG: `${BASE_URL}/OpLog/`,
  ROLE2PERMISSION: `${BASE_URL}/Role2Permission/`,
  ACCOUNT2ROLE: `${BASE_URL}/Account2Role/`,
  ROLE: `${BASE_URL}/Role/`,
  PERMISSION: `${BASE_URL}/Permission/`,
  ACCOUNT: `${BASE_URL}/Account/`,
  WHOLESALER: `${BASE_URL}/WholeSaler/`,
  WHOLESALERSHOP: `${BASE_URL}/WholeSalerShop/`,
  DELIVERYCOMPANY: `${BASE_URL}/DeliveryCompany/`,
  FILEMANAGER: `${BASE_URL}/FileManager/`,
  GOODS: `${BASE_URL}/goods`,
  GOODS_COLUMNS: `${BASE_URL}/columns`,
}
