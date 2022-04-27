import { Element, useElement, Brush } from 'muser';
import Arrow from './sort-arrow';
import { tableConfigFormatter } from '../../lib/config';
import { TableGridFunc } from '../table-grid';
import { getTableWidth } from '../../lib/config';

interface RenderHeaderProps {
  onIncreaseSort: Function;
  onDecreaseSort: Function;
  onCancel: Function;
}

export default class RenderHeader extends Element<RenderHeaderProps> {
  handleSort(key: string, status: 1 | -1 | 0) {
    const { onIncreaseSort, onDecreaseSort, onCancel } = this.props;
    if (status === 1 && onIncreaseSort instanceof Function) {
      onIncreaseSort(key);
    }
    if (status === -1 && onDecreaseSort instanceof Function) {
      onDecreaseSort(key);
    }
    if (status === 0 && onCancel instanceof Function) {
      onCancel();
    }
  }

  render({ props }: any) {
    const PADDING = 10;
    const HEIGHT = 40;

    return (brush: Brush) => {
      const { ctx } = brush;
      const { config: originConfig } = props;
      const rowConfig = tableConfigFormatter(originConfig);
      const header: { [key: string]: string } = {};
      for (const key in rowConfig) {
        header[key] = rowConfig[key]?.label;
      }

      const tableWidth = getTableWidth(originConfig);
      brush.rect([0, 0, tableWidth, HEIGHT], { fillStyle: '#F8F8F8' });
  
      for (const key in header) {
        const data = header[key];
        const left = PADDING + rowConfig[key]?.left;
        brush.text(String(data), [left, 0.5 * HEIGHT], {
          font: "bold normal 14pr sans-serif",
          fillStyle: '#121212',
          textBaseline: 'middle',
        });

        if (rowConfig[key].sortable) {
          const textWidth = brush.measure(String(data), { font: "bold normal 14pr sans-serif" });
          const arrow = useElement(Arrow, {
            width: 20,
            height: 22,
            key: `arrow-${key}`,
          });
          arrow({
            onIncreaseSort: () => this.handleSort(key, 1),
            onDecreaseSort: () => this.handleSort(key, -1),
            onCancel: () => this.handleSort(key, 0),
          })
            .paste({
              x: textWidth + left + 10,
              y: 0.5 * HEIGHT - 11,
            });
        }
      }

      TableGridFunc({
        num: 1,
        config: originConfig,
        border: true,
      })(brush);
    }
  }
}