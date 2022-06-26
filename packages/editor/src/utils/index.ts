/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 18:11:13
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-26 18:12:38
 */

/**
 * 快速生成uuid
 * @returns uuid
 */
// eslint-disable-next-line import/prefer-default-export
export function uuid() {
  const url = URL.createObjectURL(new Blob());
  const res = url.toString();
  URL.revokeObjectURL(url);
  return res.substr(res.lastIndexOf('/') + 1);
}
