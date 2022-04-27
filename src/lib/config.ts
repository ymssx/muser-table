import { Element, ElementConfig } from 'muser';
import { TableDataConfigItem, TableDataConfig, TableDataItem } from '../const/common';

export interface TableElement {
  element: { new (config: ElementConfig): Element<Object> };
  config: ElementConfig;
  props: { [key: string]: unknown };
}

export interface TableFormatterConfigItem extends TableDataConfigItem {
  left: number;
}

export interface TableConfig {
  [key: string]: TableDataConfigItem;
}

export interface TableFormatterConfig {
  [key: string]: TableFormatterConfigItem;
}

export const tableConfigFormatter = (config: TableConfig) => {
  const res: TableFormatterConfig = {};
  let left = 0;
  for (const key in config) {
    res[key] = {
      ...config[key],
      left,
    };
    left += config[key].width;
  }
  return res;
};

export const getTableWidth = (config: TableConfig) => {
  let width = 0;
  for (const key in config) {
    width += config[key].width;
  }
  return width;
};

export const splitTableDataConfig = (tableDataConfig: TableDataConfig) => {
  const leftConfig: { [key: string]: TableDataConfigItem } = {};
  const mainConfig: { [key: string]: TableDataConfigItem } = {};
  const rightConfig: { [key: string]: TableDataConfigItem } = {};

  for (const key in tableDataConfig) {
    const config = tableDataConfig[key];
    const { fixed } = config;
    if (fixed === true || fixed === 'left') {
      leftConfig[key] = config;
    } else if (fixed === 'right') {
      rightConfig[key] = config;
    } else {
      mainConfig[key] = config;
    }
  }

  return[
    leftConfig,
    mainConfig,
    rightConfig,
  ];
};