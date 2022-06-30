/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-29 11:11:21
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-30 20:17:08
 */

import { createContext } from 'react';
import { Component } from 'Components/material/registry';
import { Layout } from 'react-grid-layout';

type Grid = {
  w: number, h: number, x: number, y: number
};

type Schema = Array<{
  type: string;
  uuid: string;
  props: Component['propsMap'];
  grid: Grid;
}>;

interface IStateContext {
  originalSchema: Schema;
  modifiedSchema: Schema;
}

interface IDispatchContext {
  importSchema: (content: string) => void;
  updateComponent: (u: Component['uuid'], p: Component['propsMap']) => void;
  dragComponent: (u: Component['uuid'], l: Layout) => void;
  addComponent: (c: Component, l: Layout) => void;
  deleteComponent: (u: Schema[0]['uuid'] | undefined) => void;
}

const DefaultStateContext: IStateContext = {
  originalSchema: [],
  modifiedSchema: [],
};

const DefaultDispatchContext: IDispatchContext = {
  importSchema: () => {},
  updateComponent: () => {},
  addComponent: () => {},
  dragComponent: () => {},
  deleteComponent: () => {},
};

const StateContext = createContext<IStateContext>(DefaultStateContext);
const DispatchContext = createContext<IDispatchContext>(DefaultDispatchContext);

export {
  StateContext, DispatchContext, DefaultDispatchContext, DefaultStateContext,
  IStateContext, IDispatchContext, Schema, Grid,
};
