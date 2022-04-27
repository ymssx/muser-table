import { Element, Brush, ElementConfig } from 'muser';

const PADDING = 5;
const W = 10;
const H = 12;
const GAP = 2;
const COLOR = '#BDBDBD';
const ACTIVATE_COLOR = '#888';

interface ArrowProps {
  onIncreaseSort: Function;
  onDecreaseSort: Function;
  onCancel: Function;
}

export default class Arrow extends Element<ArrowProps> {
  constructor(config: ElementConfig) {
    super({ ...config, direct: true, alpha: true });
  }

  state = {
    activate: 0,
    selected: 0,
  };

  created() {
    this.addEventListener('mousemove', ({ y }) => {
      this.changeCursor('pointer');
      if (y < (H - GAP) / 2 + PADDING) {
        this.setState({
          activate: 1,
        });
      } else if (y > (H + GAP) / 2 + PADDING) {
        this.setState({
          activate: -1,
        });
      } else {
        this.setState({
          activate: 0,
        });
      }
    });

    this.addEventListener('click', ({ y }) => {
      const { onIncreaseSort, onDecreaseSort, onCancel } = this.props;
      const { selected } = this.state;

      if (y < (H - GAP) / 2 + PADDING) {
        if (selected !== 1) {
          (onIncreaseSort instanceof Function) && onIncreaseSort();
          this.setState({
            selected: 1,
          });
        } else {
          (onCancel instanceof Function) && onCancel();
          this.setState({
            selected: 0,
          });
        }
      } else if (y > (H + GAP) / 2 + PADDING) {
        if (selected !== -1) {
          (onDecreaseSort instanceof Function) && onDecreaseSort();
          this.setState({
            selected: -1,
          });
        } else {
          (onCancel instanceof Function) && onCancel();
          this.setState({
            selected: 0,
          });
        }
      }
    });

    this.addEventListener('out', () => {
      this.setState({
        activate: 0,
      });
      this.changeCursor('default');
    });
  }

  render({ state }: Arrow) {
    return (brush: Brush) => {
      const { activate, selected } = state;

      brush.poly(
        [
          [W / 2 + PADDING, 0 + PADDING],
          [0 + PADDING, (H - GAP) / 2 + PADDING],
          [W + PADDING, (H - GAP) / 2 + PADDING],
        ],
        { fillStyle: (activate === 1 || selected === 1) ? ACTIVATE_COLOR : COLOR }
      );

      brush.poly(
        [
          [0 + PADDING, (H + GAP) / 2 + PADDING],
          [W + PADDING, (H + GAP) / 2 + PADDING],
          [W / 2 + PADDING, H + PADDING],
        ],
        { fillStyle: (activate === -1 || selected === -1) ? ACTIVATE_COLOR : COLOR }
      );
    };
  }
}