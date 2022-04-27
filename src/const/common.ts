export interface TableDataConfigItem {
  label: string;
  width: number;
  formatter?: Function;
  sortable?: boolean;
  childs?: {
    [key: string]: TableDataConfigItem;
  };
  fixed?: boolean | 'left' | 'right';
}

export type TableDataConfig = {
  [key: string]: TableDataConfigItem;
};

export interface TableConfig {
  stripe?: boolean;
  border?: boolean;
}

export interface TableDataItem {
  [key: string]: number | string;
}


