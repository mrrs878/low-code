/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-07-05 10:24:34
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-05 10:36:24
 */

import { useCallback } from 'react';

/**
 * 设置父元素高度
 *
 * 因为所有的子元素都是 position: absolute; 父元素高度无法撑开，因此需要手动计算，然后设置到父元素上
 * @param container 父元素选择器
 * @returns 父元素高度
 */
const useContainerHeight = (container: string) => {
  const setHeight = useCallback(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(`${container} .react-draggable`));
    if (elements.length === 0) {
      // throw new Error('useContainerHeight: no elements found');
      return;
    }
    const height = elements.reduce((acc, cur) => acc + cur.offsetHeight, 0)
      + (elements.length - 1) * 10;

    document.querySelector<HTMLElement>(container)!.style.height = `${height}px`;
  }, [container]);

  return [setHeight];
};

export default useContainerHeight;
