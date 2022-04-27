import { tableConfigFormatter } from '../lib/config';
import { Element, useElement, Brush, ElementConfig } from 'muser';
import { TableDataConfig } from '../const/common';
import { getTableWidth } from '../lib/config';

interface RenderRowProps {
  row: { [key: string]: number | string };
  config: TableDataConfig;
  line: number;
  activate: boolean;
  onActivate: Function;
}

export default class RenderRow extends Element<RenderRowProps> {
  constructor(config: ElementConfig) {
    super({
      ...config,
    });
  }

  state = {
    activate: false,
  };

  created() {
    this.addEventListener('in', () => {
      this.setState({
        activate: true,
      });

      const { onActivate } = this.props;
      onActivate && onActivate();
    });
    this.addEventListener('out', () => {
      this.setState({
        activate: false,
      });
    });
  }

  render({ props, state }: RenderRow) {
    const PADDING = 10;
    const HEIGHT = 40;

    return (brush: Brush) => {
      const { row, config: originConfig, line, activate: defaultActivate } = props;
      const { activate: eventActivate } = state;
      const rowConfig = tableConfigFormatter(originConfig);
      const tableWidth = getTableWidth(originConfig);

      const activate = eventActivate || defaultActivate;

      brush.rect([0, 0, tableWidth, HEIGHT], {
        fillStyle: activate ? '#F2F2F2' : '#FFFFFF',
      });
      
      const lines = [];
      for (const key in row) {
        let data = row[key];

        // data formatter
        const formatter = rowConfig[key]?.formatter;
        if (formatter instanceof Function) {
          const res = formatter(data);
          // if it's an Element
          if (res instanceof Object && res.element) {
            const { element: elementClass, config, props } = res;
            const element = useElement(elementClass, { ...config, key: `${key}-${line}-c` });
            element({ activate, ...props })
             .paste({ x: PADDING + rowConfig[key]?.left, y: 0 });
            continue;
          }
          data = res;
        }

        brush.text(
          String(data),
          [PADDING + rowConfig[key]?.left, 0.5 * HEIGHT],
          {
            font: "14pr normal",
            fillStyle: '#121212',
            textBaseline: 'middle',
          },
        );

        lines.push([rowConfig[key]?.left + 0.5, 0, rowConfig[key]?.left + 0.5, HEIGHT]);
      }
      lines.push([0, HEIGHT, '100%', HEIGHT]);

      brush.lines(lines, {
        strokeStyle: 'rgb(218, 223, 227)',
        lineWidth: 2,
      });
    }
  }
}

interface RenderRowFuncProps {
  row: { [key: string]: string | number };
  line: number;
  config: TableDataConfig;
  activate?: boolean;
}

export const RenderRowFunc = function(props: RenderRowFuncProps) {
  const PADDING = 10;
  const HEIGHT = 40;

  return (brush: Brush) => {
    const { row, config: originConfig, activate, line } = props;
    const rowConfig = tableConfigFormatter(originConfig);
    const tableWidth = getTableWidth(originConfig);

    brush.rect([0, line * HEIGHT, tableWidth, HEIGHT], {
      fillStyle: activate ? '#F2F2F2' : '#FFFFFF',
    });

    for (const key in rowConfig) {
      let data = row[key];

      // data formatter
      const formatter = rowConfig[key]?.formatter;
      if (formatter instanceof Function) {
        const res = formatter(data);
        // if it's an Element
        if (res instanceof Object && res.element) {
          const { element: elementClass, config, props } = res;
          const element = useElement(elementClass, { ...config, key: `${key}-${line}` });
          element({ activate, ...props })
            .paste({ x: PADDING + rowConfig[key]?.left, y: HEIGHT * line });
          continue;
        }
        data = res;
      }

      brush.text(
        String(data),
        [PADDING + rowConfig[key]?.left, (0.5 + line) * HEIGHT],
        {
          font: "14pr normal",
          fillStyle: '#121212',
          textBaseline: 'middle',
        },
      );
    }
  }
}