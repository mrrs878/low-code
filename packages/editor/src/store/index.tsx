/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 11:35:57
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-26 14:26:27
 */

import React, { createContext, FC } from 'react';
import { Component } from 'src/components/material/registry';

interface IContext {
  components: Array<Component>;
}

const DefaultContext: IContext = {
  components: [],
};

const Context = createContext<IContext>(DefaultContext);

const Provider: FC<any> = ({
  children,
}) => (
  <Context.Provider value={DefaultContext}>
    {children}
  </Context.Provider>
);

export default Provider;

export { Context };
