import moment from 'moment';
import { message } from 'antd/lib/index';
import * as qiniu from 'qiniu-js';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getTimeDuration(utcTimeMilli) {
  // const localeTimeMilli = utcTimeMilli - 60000 * new Date().getTimezoneOffset();
  const localeTimeMilli = utcTimeMilli;
  const localeTimeMilliNow = new Date().getTime();
  const durationSecond = (localeTimeMilliNow - localeTimeMilli) / 1000;
  let durationString = '';
    console.log('durationSecond',durationSecond);
  if (durationSecond < 60) {
    durationString = '刚刚';
  } else if (durationSecond < 3600) {
    const minutes = Math.floor(moment.duration(durationSecond, 'seconds').asMinutes());
    durationString = `${minutes}分钟前 `;
  } else if (durationSecond < 86400) {
    const hours = Math.floor(moment.duration(durationSecond, 'seconds').asHours());
    durationString = `${hours}小时前`;
  } else if (durationSecond < 2592000) {
    const days = Math.floor(moment.duration(durationSecond, 'seconds').asDays());
    durationString = `${days}天前`;
  } else if (durationSecond < 31104000) {
    const months = Math.floor(moment.duration(durationSecond, 'seconds').asMonths());
    durationString = `${months}月前`;
  } else {
    const years = Math.floor(moment.duration(durationSecond, 'seconds').asYears());
    durationString = `${years}年前`;
  }
  return durationString;
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // NOTE(wangst): don't use `getRenderArr()`, it will ignore '/staffs/:staffId' when '/staffs' found
  // Get the route to be rendered to remove the deep rendering
  // const renderArr = getRenderArr(routes);
  const renderArr = routes;
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function convertToRegion(b) {
  if (typeof b !== 'object') {
    return b;
  } else {
    const a = [];
    for (let i = 0; i < b.length; i += 1) {
      const item1 = b[i];
      const obj1 = {};
      obj1.value = item1.countryCode;
      obj1.label = item1.name;
      obj1.children = [];
      if (item1.provinces) {
        for (let j = 0; j < item1.provinces.length; j += 1) {
          const item2 = item1.provinces[j];
          const obj2 = {};
          obj2.value = item2.provinceCode;
          obj2.label = item2.name;
          obj2.children = [];
          if (item2.cities) {
            for (let m = 0; m < item2.cities.length; m += 1) {
              const item3 = item2.cities[m];
              const obj3 = {};
              obj3.value = item3.cityCode;
              obj3.label = item3.name;
              obj3.children = [];
              if (item3.areas) {
                for (let n = 0; n < item3.areas.length; n += 1) {
                  const item4 = item3.areas[n];
                  const obj4 = {};
                  obj4.value = item4.areaCode;
                  obj4.label = item4.name;
                  obj3.children.push(obj4);
                }
              } else {
                obj3.children = null;
              }
              obj2.children.push(obj3);
            }
          } else {
            obj2.children = null;
          }

          obj1.children.push(obj2);
        }
      } else {
        obj1.children = null;
      }
      a.push(obj1);
    }
    return a;
  }
}

// 精确加法
export function accAdd(arg1, arg2) {
  let r1 = null;
  let r2 = null;
  let m = null;
  let c = null;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = 10 ** Math.max(r1, r2);
  if (c > 0) {
    const cm = 10 ** c;
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm;
      arg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''));
    arg2 = Number(arg2.toString().replace('.', ''));
  }
  return (arg1 + arg2) / m;
}

// 精确减法
export function accSub(arg1, arg2) {
  let r1 = null;
  let r2 = null;
  let m = null;
  let n = null;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = 10 ** Math.max(r1, r2);
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

export function getNowFormatDate(timestamp){
  const date = new Date(timestamp);
  const Y = `${date.getFullYear()  }-`;
  const M = `${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1  }-`;
  const D = `${date.getDate()  } `;
  const h = `${date.getHours()  }:`;
  const m = `${date.getMinutes()  }:`;
  const s = date.getSeconds();
  return Y+M+D+h+m+s;
}
export function checkImage(imageFile, file, callbackpercent, err, completeback) {
  const observable = qiniu.upload(file.file, imageFile.filekey, imageFile.uploadToken);
  // console.log(imageFile.accessURL, file, '11111111');

  observable.subscribe({
    next(loading) {
      callbackpercent(loading.total.percent);
      // console.log('过程', loading.total.percent);
    },
    error(er) {
      err(er);
      // console.log(er, '错误');
    },
    complete() {
      // console.log('上传图片');

      const img = new Image();
      img.onload = function() {
        const image43 = img.width / 4 * 3;
        const image169 = img.width / 16 * 9;

        if (file.filename === 'avatar11URL') {
          if (img.width === 1024 && img.height === 1024) {
            return completeback('avatar11URL', true);
          } else {
            completeback('avatar11URL', false);
            message.error('图片尺寸不正确,格式(1:1)');
            return false;
          }
        }
        if (file.filename === 'avatar43URL') {
          if (image43 === img.height && img.width === 1024 && img.height === 768) {
            return completeback('avatar43URL', true);
          } else {
            completeback('avatar43URL', false);
            message.error('图片尺寸不正确,格式(4:3)');
            return false;
          }
        }
        if (file.filename === 'avatar169URL') {
          if (image169 === img.height && img.width === 1280 && img.height === 720) {
            return completeback('avatar169URL', true);
          } else {
            completeback('avatar169URL', false);
            message.error('图片尺寸不正确,格式(16:9)');
            return false;
          }
        }
      };
      img.onerror = function() {
        // alert('error!');
      };
      img.src = imageFile.accessURL;
    },
  });
}
