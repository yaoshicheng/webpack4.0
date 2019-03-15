import React from 'react';
import {createElement} from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';
// import FundsFlowList from '../routes/Transaction-Center/Funds/FundsFlowList';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      name: '',
      component: dynamicWrapper(app, ['user', 'login', 'notice', 'global'], () =>
        import('../layouts/BasicLayout')
      ),
    },
    '/dashboard': {
      name: '仪表盘',
      component: dynamicWrapper(app, ['chart','dashboard'], () => import('../routes/Dashboard/Analysis')),
    },
    // '/dashboard/monitor': {
    //   component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    // },
    // '/dashboard/workplace': {
    //   component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
    //     import('../routes/Dashboard/Workplace')
    //   ),
    //   // hideInBreadcrumb: true,
    //   // name: '工作台',
    //   // authority: 'admin',
    // },
    // '/transaction/manager': {
    //   component: dynamicWrapper(app, ['rule'], () =>
    //     import('../routes/Transaction-Center/Manager/TransactionManager')
    //   ),
    // },
    // '/transaction/:transactionId': {
    //   component: dynamicWrapper(app, ['rule'], () =>
    //     import('../routes/Transaction-Center/Manager/TransactionDetail')
    //   ),
    // },
    '/account/profile': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/BasicProfileDetail')
      ),
    },
    '/transaction/refund': {
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/Transaction-Center/Refund/RefundManager')
      ),
    },
    '/transaction/refund-apply': {
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/Transaction-Center/Refund/Apply')
      ),
    },
    '/transaction/refund-apply/order': {
      name: '申请退款（填写订单信息）',
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/Transaction-Center/Refund/Apply/Step1')
      ),
    },
    '/transaction/refund-apply/funds': {
      name: '申请退款（确认退款信息）',
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/Transaction-Center/Refund/Apply/Step2')
      ),
    },
    '/transaction/refund-apply/result': {
      name: '申请退款（完成）',
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/Transaction-Center/Refund/Apply/Step3')
      ),
    },
    // '/transaction/funds': {
    //   component: dynamicWrapper(app, ['form'], () =>
    //     import('../routes/Transaction-Center/Funds/FundsManager')
    //   ),
    // },
    '/trade/funds/flow': {
      name: '资金流水',
      component: dynamicWrapper(app, ['merchantFundsFlow'], () =>
        import('../routes/Transaction-Center/Funds/FundsFlowList')
      ),
    },
    '/trade/fundsFlowDetail/:id': {
      component: dynamicWrapper(app, ['merchantFundsFlow'], () =>
        import('../routes/Transaction-Center/Funds/FundsFlowDetail')
      ),
    },
    // '/transaction/funds/:id': {
    //   component: dynamicWrapper(app, ['merchantFundsFlow', ], () =>
    //     import('../routes/Transaction-Center/Funds/detail')
    //   ),
    // },
    '/trade/funds/balance': {
      name: '账户余额',
      component: dynamicWrapper(app, ['balance'], () =>
        import('../routes/Transaction-Center/Funds/Balance')
      ),
    },
    // 用户中心
    // 用户仪表盘
    '/consumer/dashboard': {
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/ConsumerCenter/Consumer/ConsumerManager')
      ),
    },

    // 用户中心模块
    // 用户管理
    '/consumer/management': {
      component: dynamicWrapper(app, ['ConsumerCenter/member'], () =>
        import('../routes/ConsumerCenter/Consumer/ConsumerManager')
      ),
    },
    // 用户详情
    '/consumer/detail/:consumerCode': {
      component: dynamicWrapper(app, ['ConsumerCenter/member'], () =>
        import('../routes/ConsumerCenter/Consumer/ConsumerDetail')
      ),
    },
    // 灰名单
    /* '/consumer/greylist': {
      component: dynamicWrapper(app, ['ConsumerCenter/member'], () =>
        import('../routes/ConsumerCenter/Greylist/GreylistManager')
      ),
    }, */
    // 黑名单
    '/consumer/blacklist': {
      component: dynamicWrapper(app, ['ConsumerCenter/blacklist'], () =>
        import('../routes/ConsumerCenter/Blacklist/BlacklistManager')
      ),
    },
    '/store/manager': {
      component: dynamicWrapper(app, ['merchantStore'], () =>
        import('../routes/Store-Center/Manager/StoreManager')
      ),
    },
    '/store/create': {
      component: dynamicWrapper(app, ['merchantStore'], () =>
        import('../routes/Store-Center/Manager/NewStore')
      ),
    },
    '/store/create/step0': {
      component: dynamicWrapper(app, ['merchantStore'], () =>
        import('../routes/Store-Center/Manager/NewStore/Step0')
      ),
    },
    '/store/create/step1': {
      component: dynamicWrapper(app, ['merchantStore'], () =>
        import('../routes/Store-Center/Manager/NewStore/Step1')
      ),
    },
    '/store/create/step2': {
      component: dynamicWrapper(app, ['merchantStore', 'device'], () =>
        import('../routes/Store-Center/Manager/NewStore/Step2')
      ),
    },
    '/store/create/step3': {
      component: dynamicWrapper(app, ['merchantStore'], () =>
        import('../routes/Store-Center/Manager/NewStore/Step3')
      ),
    },
    '/store/profile/:storeCode': {
      component: dynamicWrapper(app, ['merchantStore', 'iot/device'], () =>
        import('../routes/Store-Center/Manager/StoreProfile')
      ),
    },
    '/store/price': {
      component: dynamicWrapper(app, ['storePrice'], () =>
        import('../routes/Store-Center/Price/PriceManager')
      ),
    },
    '/store/store/settings': {
      component: dynamicWrapper(app, ['form'], () =>
        import('../routes/Store-Center/Settings/SettingsManager')
      ),
    },

    /*
    iot module
     */
    // 设备仪表盘
    '/iot/dashboard': {
      component: dynamicWrapper(app, ['chart', 'dashboard'], () =>
        import('../routes/Iot/Dashboard/Analysis')
      ),
    },

    // 设备故障
    '/iot/trouble': {
      component: dynamicWrapper(app, ['iot/device'], () =>
        import('../routes/Iot/DeviceList/RepairDeviceList')
      ),
    },

    '/iot/list': {
      component: dynamicWrapper(app, ['iotMonitor'], () => import('../routes/Iot/DeviceList/list')),
    },

    '/iot/iot-monitor/detail': {
      component: dynamicWrapper(app, ['iotMonitor'], () =>
        import('../routes/Iot/DeviceList/detail')
      ),
    },

    // 设备报修
    '/iot/device/repair/:deviceCode': {
      component: dynamicWrapper(app, ['iot/device'], () =>
        import('../routes/Iot/DeviceList/Repair')
      ),
    },

    // 设备管理
    '/iot/manager': {
      component: dynamicWrapper(app, ['iot/device', 'workOrder'], () =>
        import('../routes/Iot/DeviceList/MyDeviceList')
      ),
    },

    // 设备详情页
    '/iot/device/detail/:deviceCodeAndStaffId': {
      component: dynamicWrapper(app, ['iot/device'], () =>
        import('../routes/Iot/Device/DeviceDetail')
      ),
    },

    // '/iot/device/brokenDevice/detail/:deviceCode': {
    //   component: dynamicWrapper(app, ['iot/device'], () =>
    //     import('../routes/Iot/Device/BrokenDeviceDetail')
    //   ),
    // },

    // 工单管理
    '/workOrder/createWork': {
      name: '创建工单',
      component: dynamicWrapper(app, ['workOrder'], () =>
        import('../routes/WorkOrder/create/CreateWork')
      ),
    },

    '/workOrder/createWork/step1': {
      name: '选择工单类型',
      component: dynamicWrapper(app, ['createWork'], () =>
        import('../routes/WorkOrder/create/CreateWorkStep1')
      ),
    },
    '/workOrder/createWork/step2-1': {
      name: '填写基本信息',
      component: dynamicWrapper(app, ['createWork', 'imageFile', 'workOrder'], () =>
        import('../routes/WorkOrder/create/CreateWorkStep2.1')
      ),
    },
    '/workOrder/createWork/step2-2': {
      name: '填写基本信息',
      component: dynamicWrapper(app, ['createWork', 'imageFile', 'workOrder'], () =>
        import('../routes/WorkOrder/create/CreateWorkStep2.2')
      ),
    },
    '/workOrder/createWork/step2-3': {
      name: '填写基本信息',
      component: dynamicWrapper(app, ['createWork', 'imageFile', 'workOrder'], () =>
        import('../routes/WorkOrder/create/CreateWorkStep2.3')
      ),
    },

    '/workOrder/createWork/step3-1': {
      name: '预览信息',
      component: dynamicWrapper(app, ['createWork'], () =>
        import('../routes/WorkOrder/create/CreateWorkStep3.1')
      ),
    },
    '/workOrder/createWork/step3-2': {
      name: '预览信息',
      component: dynamicWrapper(app, ['createWork'], () =>
        import('../routes/WorkOrder/create/CreateWorkStep3.2')
      ),
    },
    '/workOrder/createWork/step3-3': {
      name: '预览信息',
      component: dynamicWrapper(app, ['createWork'], () =>
        import('../routes/WorkOrder/create/CreateWorkStep3.3')
      ),
    },

    '/workOrder/createWork/step4': {
      name: '完成',
      component: dynamicWrapper(app, ['createWork'], () =>
        import('../routes/WorkOrder/create/CreateWorkStep4')
      ),
    },
    // '/workOrder/createList': {
    //   name: '我发起的工单',
    //   exact: true,
    //   component: dynamicWrapper(app, ['workOrder', 'createWork'], () =>
    //     import('../routes/WorkOrder/CreateList')
    //   ),
    // },
    // '/workOrder/receiveList': {
    //   name: '我收到的工单',
    //   exact: true,
    //   component: dynamicWrapper(app, ['workOrder', 'createWork'], () =>
    //     import('../routes/WorkOrder/ReceiveList')
    //   ),
    // },

    // 运维中心
    '/workOrder/workList': {
      name: '工单管理',
      exact: true,
      component: dynamicWrapper(
        app,
        ['workOrder', 'createWork'],
        () => import('../routes/WorkOrder/WorkManagement')
        // import('../routes/WorkOrder/CreateList')
      ),
    },
    '/workOrder/myWork/createList': {
      name: '我发起的工单',
      exact: true,
      component: dynamicWrapper(app, ['workOrder', 'createWork'], () =>
        import('../routes/WorkOrder/CreateList')
      ),
    },
    '/workOrder/myWork/receiveList': {
      name: '我收到的工单',
      exact: true,
      component: dynamicWrapper(app, ['workOrder', 'createWork'], () =>
        import('../routes/WorkOrder/ReceiveList')
      ),
    },

    '/workOrder/createList/displayWorkDetail': {
      name: '工单详情',
      component: dynamicWrapper(app, ['workOrder', 'createWork'], () =>
        import('../routes/WorkOrder/WorkOrderDetail')
      ),
    },
    '/workOrder/receiveList/displayWorkDetail': {
      name: '工单详情',
      component: dynamicWrapper(app, ['workOrder', 'createWork'], () =>
        import('../routes/WorkOrder/WorkOrderDetail')
      ),
    },
    '/workOrder/createList/workOrderEdit': {
      name: '编辑工单',
      component: dynamicWrapper(app, ['workOrder', 'createWork'], () =>
        import('../routes/WorkOrder/WorkOrderEdit')
      ),
    },
    '/workOrder/receiveList/workOrderEdit': {
      name: '编辑工单',
      component: dynamicWrapper(app, ['workOrder', 'createWork'], () =>
        import('../routes/WorkOrder/WorkOrderEdit')
      ),
    },

    '/product/goodsManage': {
      name: '商品中心',
      component: dynamicWrapper(app, ['product'], () => import('../routes/Product/ProductList')),
    },
    '/product/createProduct': {
      name: '创建商品',
      component: dynamicWrapper(app, ['product'], () => import('../routes/Product/CreateProduct')),
    },
    '/product/createProduct/type': {
      name: '创建商品（选择商品类型）',
      component: dynamicWrapper(app, ['productStep'], () =>
        import('../routes/Product/CreateProductChooseType')
      ),
    },
    '/product/createProduct/info': {
      name: '创建商品（填写商品信息）',
      component: dynamicWrapper(app, ['productStep', 'imageFile'], () =>
        import('../routes/Product/CreateProductStep1')
      ),
    },
    '/product/createProduct/infoForVirtual': {
      name: '创建商品（填写商品信息）',
      component: dynamicWrapper(app, ['productStep', 'imageFile'], () =>
        import('../routes/Product/CreateProductStep1ForVirtual')
      ),
    },
    '/product/createProduct/confirm': {
      name: '创建商品（确认商品信息）',
      component: dynamicWrapper(app, ['productStep'], () =>
        import('../routes/Product/CreateProductStep2')
      ),
    },
    '/product/createProduct/confirmForVirtual': {
      name: '创建商品（确认商品信息）',
      component: dynamicWrapper(app, ['productStep'], () =>
        import('../routes/Product/CreateProductStep2ForVirtual')
      ),
    },
    '/product/ProductDetail/:id': {
      name: '商品详情',
      component: dynamicWrapper(app, ['productDetail'], () =>
        import('../routes/Product/ProductDetail')
      ),
    },

    '/product/ProductEdit/:id': {
      name: '编辑商品',
      component: dynamicWrapper(app, ['productEdit'], () =>
        import('../routes/Product/ProductEdit')
      ),
    },

    '/product/ProductDetailForVirtual/:id': {
      name: '商品详情',
      component: dynamicWrapper(app, ['productDetail'], () =>
        import('../routes/Product/ProductDetailForVirtual')
      ),
    },

    '/product/ProductEditForVirtual/:id': {
      name: '编辑商品',
      component: dynamicWrapper(app, ['productEdit'], () =>
        import('../routes/Product/ProductEditForVirtual')
      ),
    },
    '/product/category': {
      component: dynamicWrapper(app, ['productCategory'], () =>
        import('../routes/Product/ProductCategoryList')
      ),
    },

    '/product/createProduct/result': {
      name: '创建商品（完成）',
      component: dynamicWrapper(app, ['productStep'], () =>
        import('../routes/Product/CreateProductStep3')
      ),
    },

    '/product/models': {
      name: '模板管理',
      exact: true,
      component: dynamicWrapper(app, ['template', 'marketManager'], () =>
        import('../routes/goods/model/index')
      ),
    },
    '/product/models/use': {
      name: '应用模板',
      exact: true,
      component: dynamicWrapper(app, ['template', 'marketManager'], () =>
        import('../routes/goods/model/modeluse')
      ),
    },
    '/product/models/newmodel': {
      name: '新建模板',
      component: dynamicWrapper(app, ['template'], () =>
        import('../routes/goods/model/CreateModel')
      ),
    },
    '/product/models/editmodel': {
      name: '编辑模板',
      component: dynamicWrapper(app, ['template'], () => import('../routes/goods/model/editModel')),
    },
    '/product/models/modelinfo': {
      name: '模板详情',
      component: dynamicWrapper(app, ['template', 'modelManage'], () =>
        import('../routes/goods/model/info')
      ),
    },
    '/product/models/newmodel/info': {
      name: '新建模板(填写信息)',
      component: dynamicWrapper(app, ['template', 'createModel'], () =>
        import('../routes/goods/model/CreateModelStep1')
      ),
    },
    '/product/models/newmodel/goods': {
      name: '包含商品',
      component: dynamicWrapper(app, ['template'], () =>
        import('../routes/goods/model/CreateModelStep2')
      ),
    },
    '/product/models/newmodel/cargoroad': {
      name: '设置货到信息',
      component: dynamicWrapper(app, ['template'], () =>
        import('../routes/goods/model/CreateModelStep3')
      ),
    },
    '/product/models/newmodel/goodsConfirm': {
      name: '预览',
      component: dynamicWrapper(app, ['template'], () =>
        import('../routes/goods/model/CreateModelStep4')
      ),
    },
    '/product/models/newmodel/goodsAccomplish': {
      name: '创建完成',
      component: dynamicWrapper(app, ['template'], () =>
        import('../routes/goods/model/CreateModelStep5')
      ),
    },

    '/dbcode/goods': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/DBCode/Goods/GoodsManager')),
    },
    '/dbcode/market': {
      // name: '模型市场',
      exact: true,
      component: dynamicWrapper(app, ['marketManager'], () =>
        import('../routes/DBCode/Market/MarketManager')
      ),
    },
    '/dbcode/my': {
      // name: '我的模型',
      exact: true,
      component: dynamicWrapper(app, ['marketManager'], () =>
        import('../routes/DBCode/My/MyManager')
      ),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    // '/user': {
    //   component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    // },
    // '/user/login': {
    //   component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    // },
    // '/user/register': {
    //   component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    // },
    // '/user/register-result': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    // },
    '/account/staff': {
      component: dynamicWrapper(app, ['staff', 'imageFile'], () =>
        import('../routes/Account/Staff/StaffList')
      ),
    },

    '/profile/edit': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/BasicProfileEdit')
      ),
    },
    '/account/staffsNew': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Account/Staff/StaffNew')),
    },
    '/account/staffsInfo/:staffId': {
      component: dynamicWrapper(app, ['staff', 'role'], () =>
        import('../routes/Account/Staff/StaffInfo')
      ),
    },
    '/account/staffsEdit/:staffId': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Account/Staff/StaffEdit')),
    },
    '/account/staffsEditPwd/:staffId': {
      component: dynamicWrapper(app, ['staff'], () =>
        import('../routes/Account/Staff/StaffEditPwd')
      ),
    },
    '/account/roles': {
      exact: true,
      component: dynamicWrapper(app, ['role'], () => import('../routes/Account/Role/RoleList')),
    },
    '/account/roles/new': {
      name: '新建角色',
      component: dynamicWrapper(app, ['role'], () => import('../routes/Account/Role/RoleNew')),
    },
    '/account/roles/:roleId/edit': {
      name: '角色编辑',
      component: dynamicWrapper(app, ['role'], () => import('../routes/Account/Role/RoleEdit')),
    },
    '/account/roles/:roleId/info': {
      name: '角色信息',
      component: dynamicWrapper(app, ['role'], () => import('../routes/Account/Role/RoleInfo')),
    },
    '/dbcode/market/createModel': {
      name: '模型申请',
      component: dynamicWrapper(app, ['marketManager'], () =>
        import('../routes/DBCode/Market/CreateModel')
      ),
    },
    '/dbcode/market/marketDetail': {
      name: '模型详情',
      component: dynamicWrapper(app, ['marketManager'], () =>
        import('../routes/DBCode/Market/MarketDetail')
      ),
    },
    '/dbcode/market/marketModelUse': {
      name: '应用到设备',
      component: dynamicWrapper(app, ['marketManager'], () =>
        import('../routes/DBCode/Market/MarketModelUse')
      ),
    },
    '/dbcode/my/myMarketDetail': {
      name: '模型详情',
      component: dynamicWrapper(app, ['marketManager'], () =>
        import('../routes/DBCode/Market/MarketDetail')
      ),
    },
    '/dbcode/my/applyModelDetail': {
      name: '模型详情',
      component: dynamicWrapper(app, ['marketManager'], () =>
        import('../routes/DBCode/My/ApplyModelDetail')
      ),
    },

    '/trade/list': {
      name: '交易管理',
      component: dynamicWrapper(app, ['trade'], () => import('../routes/Trade/tradeList')),
    },
    '/trade/settle/settled': {
      name: '已结算查询',
      component: dynamicWrapper(app, ['settled'], () => import('../routes/Trade/settleManage')),
    },
    '/trade/settle/settleMethod': {
      name: '结算方式',
      component: dynamicWrapper(app, ['settled'], () => import('../routes/Trade/settleMethod')),
    },
    '/trade/tradeInfo/:orderNo': {
      name: '交易订单详情',
      component: dynamicWrapper(app, ['trade'], () => import('../routes/Trade/TradeInfo')),
    },
    '/trade/refund': {
      name: '退款查询',
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Trade/refundManage')),
    },
    '/trade/refundByOrder/:orderNo': {
      name: '退款申请',
      component: dynamicWrapper(app, ['trade'], () => import('../routes/Trade/refundByOrder')),
    },
    '/refund/refundDetail/:refundOrderNo': {
      name: '退款详情',
      component: dynamicWrapper(app, ['refund', 'trade'], () =>
        import('../routes/Trade/refundDetail')
      ),
    },
    '/refund/refundSolve/:refundOrderNo': {
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Trade/refundSolve')),
    },
    '/message': {
      component: dynamicWrapper(app, ['notice', 'global'], () =>
        import('../routes/NoticeCenter/noticeCenter')
      ),
    },
    '/themeMall': {
      exact: true,
      name: '主题商城',
      component: dynamicWrapper(app, ['themeMall'], () =>
        import('../routes/AddServices/ThemeMall')
      ),
    },
    '/themeMall/edit': {
      component: dynamicWrapper(app, ['themeMall', 'imageFile'], () =>
        import('../routes/AddServices/EditThemeMall')
      ),
    },
    '/store/inventory': {
      name: '库存管理',
      component: dynamicWrapper(app, ['inventory'], () => import('../routes/Inventory/index')),
    },
    '/store/cargoroad': {
      component: dynamicWrapper(app, ['cargoroad'], () => import('../routes/Cargoroad/index')),
    },

    '/store/passengerflow': {
      name: '门店客流',
      component: dynamicWrapper(app, ['passengerflow'], () =>
        import('../routes/Passengerflow/index')
      ),
    },

    '/merchant_log': {
      name: '操作日志',
      component: dynamicWrapper(app, ['merchantLog'], () =>
        import('../routes/NoticeCenter/merchantLog')
      ),
    },

    '/marketCenter/marketModule': {
      name: '营销模块',
      component: dynamicWrapper(app, ['marketModule'], () =>
        import('../routes/marketCenter/marketModule/index')
      ),
    },

    '/marketCenter/marketModuleCreate': {
      name: '创建活动',
      component: dynamicWrapper(app, ['marketModule'], () =>
        import('../routes/marketCenter/marketModule/create')
      ),
    },

    '/marketCenter/marketModuleDetail/:id': {
      name: '活动详情',
      component: dynamicWrapper(app, ['marketModule'], () =>
        import('../routes/marketCenter/marketModule/detail')
      ),
    },

    '/marketCenter/marketModuleEdit/:id': {
      name: '编辑活动',
      component: dynamicWrapper(app, ['marketModule'], () =>
        import('../routes/marketCenter/marketModule/edit')
      ),
    },

    '/product/groups': {
      name: '商品组合列表',
      component: dynamicWrapper(app, ['groupCommodity'], () =>
        import('../routes/GroupCommodity/GroupCommodityList')
      ),
    },

    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};

  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
