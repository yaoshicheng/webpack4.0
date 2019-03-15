import React from 'react';
import { isUrl } from '../utils/utils';
import { FormattedMessage } from 'react-intl';

const menuData = [
  {
    name: <FormattedMessage id="slidedashboard" />,
    icon: 'dashboard',
    path: 'dashboard',
    authority: 'dashboard',
    // children: [
    //   {
    //     name: '分析页',
    //     path: 'analysis',
    //   },
    //   {
    //     name: '监控页',
    //     path: 'monitor',
    //   },
    //   {
    //     name: '工作台',
    //     path: 'workplace',
    //     // hideInBreadcrumb: true,
    //     // hideInMenu: true,
    //   },
    // ],
  },
  // {
  //   name: '主题商城',
  //   icon: 'skin',
  //   path: 'themeMall',
  // },
  // {
  //   name: '交易中心',
  //   icon: 'bars',
  //   path: 'transaction',
  //   children: [
  //     {
  //       name: '交易仪表',
  //       path: 'dashboard',
  //     },
  //     {
  //       name: '交易管理',
  //       path: 'manager',
  //     },
  //     {
  //       name: '退款管理',
  //       // authority: 'admin',
  //       path: 'refund',
  //     },
  //     {
  //       name: '资金管理',
  //       // authority: 'admin',
  //       path: 'funds',
  //       children: [
  //         {
  //           name: '账户余额',
  //           path: 'balance',
  //         },
  //         {
  //           name: '资金流水',
  //           path: 'flow',
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    name: <FormattedMessage id="slidetrade" />,
    icon: 'pay-circle-o',
    path: 'trade',
    authority: 'transation_center,settle_mgr,funds_mgr,transation_mgr,refund_mgr',
    children: [
      {
        name: <FormattedMessage id="slidefundmanagement" />,
        path: 'funds',
        authority: 'funds_mgr,merchant_balance,funds_flow',
        children: [
          {
            name: <FormattedMessage id="slideaccountbalance" />,
            path: 'balance',
            authority: 'merchant_balance',
          },
          {
            name: <FormattedMessage id="slidecapitalflow" />,
            path: 'flow',
            authority: 'funds_flow',
          },
        ],
      },
      {
        name: <FormattedMessage id="slidetransactionmanagement" />,
        path: 'list',
        authority: 'transation_mgr',
      },
      {
        name: <FormattedMessage id="sliderefundmanagement" />,
        path: 'refund',
        authority: 'refund_mgr',
      },
      {
        name: <FormattedMessage id="slidesettlementmanagement" />,
        path: 'settle',
        authority: 'settle_mgr,settle_list,settle_mgr',
        children: [
          {
            name: <FormattedMessage id="slidebilledquery" />,
            path: 'settled',
            authority: 'settle_list',
          },
          {
            name: <FormattedMessage id="slidesettlementmethod" />,
            path: 'settleMethod',
            authority: 'settle_mgr',
          },
        ],
      },
    ],
  },
  {
    name: <FormattedMessage id="slideusercenter" />,
    icon: 'user',
    path: 'consumer',
    authority: 'customer_center,customer_list,customer_black_list',
    children: [
      // {
      //   name: '用户仪表',
      //   path: 'dashboard',
      // },
      {
        name: <FormattedMessage id="slideusermanagement" />,
        path: 'management',
        authority: 'customer_list',
      },
      /* {
        name: '灰名单',
        // authority: 'admin',
        path: 'greylist',
      }, */
      {
        name: <FormattedMessage id="slideblacklist" />,
        // authority: 'admin',
        path: 'blacklist',
        authority: 'customer_black_list',
      },
    ],
  },
  {
    name: <FormattedMessage id="slidestorecenter" />,
    icon: 'shop',
    path: 'store',
    authority: 'store_center,store_list,price_mgr',
    children: [
      // {
      //   name: '门店仪表',
      //   path: 'dashboard',
      // },
      {
        name: <FormattedMessage id="slidestoremanagement" />,
        path: 'manager',
        authority: 'store_list',
      },
      {
        name: <FormattedMessage id="slidepricemanagement" />,
        path: 'price',
        authority: 'price_mgr',
      },
      {
        name: <FormattedMessage id="slideinventorymanagement" />,
        path: 'inventory',
        // authority: 'price_mgr',
      },
      {
        name: <FormattedMessage id="cargoLaneConfig" />,
        path: 'cargoroad',
        // authority: 'price_mgr',
      },
      // {
      //   name: '门店设置',
      //   // authority: 'admin',
      //   path: 'settings',
      // },
    ],
  },
  {
    name: <FormattedMessage id="slideequipmentcenter" />,
    icon: 'printer',
    path: 'iot',
    authority: 'device_dashboard,device_list,device_repair,device_monitor_down',
    children: [
      // {
      //   name: '设备管理',
      //   path: 'device',
      //   children: [
      {
        name: <FormattedMessage id="slideequipmentmanagement" />,
        path: 'manager',
        authority: 'device_list',
      },
      {
        name: <FormattedMessage id="slidewarrantyfailure" />,
        //  authority: 'admin',
        path: 'trouble',
        authority: 'device_repair',
      },
      {
        name: <FormattedMessage id="slidemonitoringfailure" />,
        //  authority: 'admin',
        path: 'list',
        authority: 'device_monitor_down',
      },
      //   ],
      // },
    ],
  },

  {
    name: <FormattedMessage id="slideworkorderoperation" defaultMessage="Operation" />,
    path: 'workOrder',
    authority: 'operation_center,workorder_mgr,owned_workorder',
    icon: 'tool',
    children: [
      {
        name: <FormattedMessage id="slideworkordermanagement" />,
        // icon: 'tool',
        path: 'workList',
        authority: 'wororder_mgr,my_request_workorder,my_recieved_workorder',
      },
      {
        name: <FormattedMessage id="slideworkordermyTask" defaultMessage="My Task" />,
        path: 'myWork',
        authority: 'owned_workorder,my_receieved_workorder,my_request_workorder',
        children: [
          {
            name: <FormattedMessage id="slideworkorderinitiated" />,
            path: 'createList',
            authority: 'my_request_workorder',
          },
          {
            name: <FormattedMessage id="slideworkorderreceived" />,
            path: 'receiveList',
            authority: 'my_recieved_workorder',
          },
        ],
      },
    ],
  },

  // {
  //   name: <FormattedMessage id="slideworkordermanagement" />,
  //   icon: 'tool',
  //   path: 'workOrder',
  //   authority: 'wororder_mgr,my_request_workorder,my_recieved_workorder',
  //   children: [
  //     {
  //       name: <FormattedMessage id="slideworkorderinitiated" />,
  //       path: 'createList',
  //       authority: 'my_request_workorder',
  //     },
  //     {
  //       name: <FormattedMessage id="slideworkorderreceived" />,
  //       path: 'receiveList',
  //       authority: 'my_recieved_workorder',
  //     },
  //   ],
  // },
  {
    name: <FormattedMessage id="slidedbcode" />,
    icon: 'plus-circle-o',
    path: 'dbcode',
    authority: 'dbcode_center,model_data,owned_model',
    children: [
      // {
      //   name:  <FormattedMessage
      //     id="slidecommoditymanagement"
      //   />,
      //   path: 'goods',
      // },
      {
        name: <FormattedMessage id="slidemodelmarket" />,
        // authority: 'admin',
        path: 'market',
        authority: 'model_data',
      },
      {
        name: <FormattedMessage id="slidemymodel" />,
        // authority: 'admin',
        path: 'my',
        authority: 'owned_model',
      },
    ],
  },
  // {
  //   name: "商品中心",
  //   icon: 'plus-circle-o',
  //   path: 'goods',
  //   authority: 'dbcode_center,model_data,owned_model',
  //   children: [
  //     // {
  //     //   name:  <FormattedMessage
  //     //     id="slidecommoditymanagement"
  //     //   />,
  //     //   path: 'goods',
  //     // },
  //     {
  //       name:"模板管理",
  //       path: 'models',
  //       authority: 'model_data',
  //     },
  //   ],
  // },
  {
    name: <FormattedMessage id="goodsCenter" />,
    icon: 'inbox',
    path: 'product',
    children: [
      {
        name: <FormattedMessage id="goodsManage" />,
        path: 'goodsManage',
      },
      {
        name: <FormattedMessage id="categoryManage" />,
        path: 'category',
      },
      {
        name: <FormattedMessage id="useTemplate" />,
        path: 'models',
        authority: 'model_data',
      },
      // {
      //   name: '商品组合',
      //   path: 'groups',
      // },
    ],
    authority: 'messag_center',
  },
  {
    name: <FormattedMessage id='marketCenter' />,
    icon: 'gift',
    path: 'marketCenter',
    children: [
      {
        name: <FormattedMessage id='marketModule' />,
        path: 'marketModule',
      },
    ],
    // authority: 'messag_center',
  },

  // {
  //   name: '增值业务',
  //   icon: 'plus-circle-o',
  //   path: 'energize',
  //   children: [
  //     {
  //       name: '广告管理',
  //       path: 'ad',
  //     },
  //   ],
  // },
  // {
  //   name: '开放平台',
  //   icon: 'appstore',
  //   path: 'open',
  //   children: [
  //     {
  //       name: '应用管理',
  //       path: 'apps',
  //     },
  //     {
  //       name: '文档中心',
  //       path: 'document',
  //     },
  //     {
  //       name: '资源中心',
  //       path: 'resources',
  //     },
  //   ],
  // },
  {
    name: <FormattedMessage id="slideaccountcenter" />,
    icon: 'setting',
    path: 'account',
    authority: 'account_center,account_profile,staff_list,role_list,merchant_login',
    children: [
      {
        name: <FormattedMessage id="slidepersonalcenter" />,
        path: 'profile',
        authority: 'account_profile,merchant_login',
      },
      // {
      //   name: '账户设置',
      //   path: 'setting',
      // },
      {
        name: <FormattedMessage id="slideemployeeaccount" />,
        path: 'staff',
        authority: 'staff_list',
      },
      {
        name: <FormattedMessage id="sliderolemanagement" />,
        path: 'roles',
        authority: 'role_list',
      },
    ],
  },
  {
    name: <FormattedMessage id="slidemessagecenter" />,
    icon: 'message',
    path: 'message',
    authority: 'messag_center',
  },
  // {
  //   name: '操作日志',
  //   icon: 'form',
  //   path: 'merchant_log',
  // },
  // {
  //   name: '表单页',
  //   icon: 'form',
  //   path: 'form',
  //   children: [
  //     {
  //       name: '基础表单',
  //       path: 'basic-form',
  //     },
  //     {
  //       name: '分步表单',
  //       path: 'step-form',
  //     },
  //     {
  //       name: '高级表单',
  //       authority: 'admin',
  //       path: 'advanced-form',
  //     },
  //   ],
  // },
  // {
  //   name: '列表页',
  //   icon: 'table',
  //   path: 'list',
  //   children: [
  //     {
  //       name: '查询表格',
  //       path: 'table-list',
  //     },
  //     {
  //       name: '标准列表',
  //       path: 'basic-list',
  //     },
  //     {
  //       name: '卡片列表',
  //       path: 'card-list',
  //     },
  //     {
  //       name: '搜索列表',
  //       path: 'search',
  //       children: [
  //         {
  //           name: '搜索列表（文章）',
  //           path: 'articles',
  //         },
  //         {
  //           name: '搜索列表（项目）',
  //           path: 'projects',
  //         },
  //         {
  //           name: '搜索列表（应用）',
  //           path: 'applications',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: '详情页',
  //   icon: 'profile',
  //   path: 'profile',
  //   children: [
  //     {
  //       name: '基础详情页',
  //       path: 'basic',
  //     },
  //     {
  //       name: '高级详情页',
  //       path: 'advanced',
  //       authority: 'admin',
  //     },
  //   ],
  // },
  // {
  //   name: '结果页',
  //   icon: 'check-circle-o',
  //   path: 'result',
  //   children: [
  //     {
  //       name: '成功',
  //       path: 'success',
  //     },
  //     {
  //       name: '失败',
  //       path: 'fail',
  //     },
  //   ],
  // },
  // {
  //   name: '异常页',
  //   icon: 'warning',
  //   path: 'exception',
  //   children: [
  //     {
  //       name: '403',
  //       path: '403',
  //     },
  //     {
  //       name: '404',
  //       path: '404',
  //     },
  //     {
  //       name: '500',
  //       path: '500',
  //     },
  //     {
  //       name: '触发异常',
  //       path: 'trigger',
  //       hideInMenu: true,
  //     },
  //   ],
  // },
  // {
  //   name: '账户',
  //   icon: 'user',
  //   path: 'user',
  //   authority: 'guest',
  //   children: [
  //     {
  //       name: '登录',
  //       path: 'login',
  //     },
  //     {
  //       name: '注册',
  //       path: 'register',
  //     },
  //     {
  //       name: '注册结果',
  //       path: 'register-result',
  //     },
  //   ],
  // },
];
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
