/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:14:43
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-28 11:03:47
 */

import 'antd/dist/antd.css';

declare global {
  interface Window {
    $RefreshReg$?: any;
    $RefreshSig$?: any;
  }
}

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  const runtime = require('react-refresh/runtime');
  runtime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type: any) => type;

  import('./bootstrap');
}
