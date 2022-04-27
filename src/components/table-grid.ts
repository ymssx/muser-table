import { Brush } from 'muser';
import { getTableWidth } from '../lib/config';

interface TableGridFuncProps {
  num: number;
  config: {
    [key: string]: {
      label: string;
      width: number;
    };
  },
  stripe?: boolean;
  border?: boolean;
}

export const TableGridFunc = (props: TableGridFuncProps) => {
  const { num, config, stripe, border } = props;
  const HEIGHT = 40;
  const style = {
    strokeStyle: 'rgb(218, 223, 227)',
    lineWidth: 2,
  };

  return (brush: Brush) => {
    const { ctx } = brush;

    if (border === false) {
      return;
    }

    const tableWidth = getTableWidth(config);
    const lines = [];
    for (let x = 1; x <= num; x += 1) {
      const top = (HEIGHT + 0.5) * x;
      lines.push([0, top - 0.5, tableWidth, top - 0.5]);
    }
    
    if (stripe === true) {
      brush.lines(lines, style);
      return;
    }

    let left = 0;
    for (const key in config) {
      left += config[key].width;
      lines.push([left + ctx.lineWidth / 2, 0, left + ctx.lineWidth / 2, HEIGHT * num]);
    }
    brush.lines(lines, style);
  }
};