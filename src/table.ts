import { Element, useElement, ElementConfig } from 'muser';
import RenderRow from './components/table-row';
import { getTableWidth } from './lib/config';
import { TableConfig, TableDataConfig } from './const/common';

interface TableProps {
  data: { [key: string]: number | string }[];
  config: TableConfig;
  dataConfig: TableDataConfig;
  scrollTop: number;
  activate: number;
  onActivate: Function;
}
export default class TableElement extends Element<TableProps> {
  constructor(config: ElementConfig) {
    super({ ...config, alpha: true });
  }

  render({ props }: TableElement) {
    let renderedRange =0;

    const handleActivate = (line: number) => {
      const { onActivate } = props;
      onActivate && onActivate(line);
    };

    return [
      // 主渲染
      // (brush: Brush) => {
      //   const start = performance.now();
      //   const { data: tableData, dataConfig, config } = props;
      //   const { stripe, border } = config;

      //   TableGridFunc({
      //     num: tableData.length,
      //     config: dataConfig,
      //     stripe,
      //     border,
      //   })(brush);

      //   console.log(`render: ${(performance.now() - start).toFixed(2)}`)
      // },

      // 滚动插入
      () => {
        const start = performance.now();
        const { data: tableData, dataConfig, config, scrollTop = 0 } = props;
        const { rowHeight: HEIGHT = 40 } = config;

        const visibleRange = Math.ceil(scrollTop / HEIGHT) + Math.min(20, tableData.length);
        if (visibleRange <= renderedRange + 5) {
          return;
        }

        const tableWidth = getTableWidth(dataConfig);

        const renderRange = Math.min(visibleRange, tableData.length);
        for (let index = renderedRange; index < renderRange; index += 1) {
          const row = tableData[index];
          const renderRow = useElement(RenderRow, {
            width: tableWidth, height: HEIGHT,
            key: `render-row-${index}`,
          });
          renderRow({
            row,
            line: index,
            config: dataConfig,
            tableConfig: config,
            activate: false,
            onActivate: () => handleActivate(index),
          })
            .paste({ x: 0, y: index * HEIGHT });
        }
        renderedRange = visibleRange;

        console.log(`insert: ${(performance.now() - start).toFixed(2)}`)
      },

      // // 更新
      // (brush: Brush) => {
      //   const start = performance.now();
      //   const { data: tableData, dataConfig, config, activate: defaultActivate = -1 } = props;
      //   const { activeIndex } = state;
      //   const { stripe, border } = config;
      //   const finalActiveIndex = defaultActivate !== -1 ? defaultActivate : activeIndex;

      //   const tableWidth = getTableWidth(dataConfig);

      //   if (finalActiveIndex === -1 || finalActiveIndex >= tableData.length) {
      //     return;
      //   }
        
      //   if (lastIndex !== -1 && lastIndex !== finalActiveIndex) {
      //     const renderRow = useElement(RenderRow, {
      //       width: tableWidth, height: HEIGHT,
      //       key: `render-row-${lastIndex}`,
      //     });
      //     renderRow({
      //       row: tableData[lastIndex],
      //       line: lastIndex,
      //       config: dataConfig,
      //       activate: false,
      //     })
      //       .paste({ x: 0, y: lastIndex * HEIGHT });
      //   }

      //   const renderRow = useElement(RenderRow, {
      //     width: tableWidth, height: HEIGHT,
      //     key: `render-row-${finalActiveIndex}`, // 对激活状态进行缓存
      //   });
      //   renderRow({
      //     row: tableData[finalActiveIndex],
      //     line: finalActiveIndex,
      //     config: dataConfig,
      //     activate: true,
      //   })
      //     .paste({ x: 0, y: finalActiveIndex * HEIGHT });

      //   TableGridFunc({
      //     num: tableData.length,
      //     config: dataConfig,
      //     stripe,
      //     border,
      //   })(brush);

      //   lastIndex = finalActiveIndex;
      //   //console.log(`update: ${(performance.now() - start).toFixed(2)}`)
      // },
    ];
  }
}
