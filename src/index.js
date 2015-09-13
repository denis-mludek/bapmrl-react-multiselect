import React, { Component, PropTypes } from 'react';
import { shallowEqual } from './utils';

export default class Multiselect extends Component {
  constructor(props) {
    super(props);

    this._items = _prepareItems(props.items);
    this._inputValue = _calculateInputValue(
      this._items,
      props.inputProps.size,
      props.allItemsSelectedLabel
    );

    this.state = {
      focus: props.inputProps.autoFocus,
      open: false,
      hoverIndex: null
    };

    this._handleDocumentMouseDown = this._handleDocumentMouseDown.bind(this);
    this._handleInputBlur = this._handleInputBlur.bind(this);
    this._handleInputFocus = this._handleInputFocus.bind(this);
    this._handleInputKeyDown = this._handleInputKeyDown.bind(this);
    this._handleInputOrArrowMouseDown = this._handleInputOrArrowMouseDown.bind(this);
    this._handleItemsMouseLeave = this._handleItemsMouseLeave.bind(this);
    this._inputKeyDownHandlers = {
      13: this._handleInputReturn,
      27: this._handleInputEscape,
      38: this._handleInputArrowUp,
      40: this._handleInputArrowDown
    };
  }

  render() {
    const className = [
      this.props.classNames.multiselect,
      this.state.focus ? this.props.classNames.multiselectFocus : '',
      this.state.open ? this.props.classNames.multiselectOpen : ''
    ].join(' ');
    return (
      <div className={className}>
        <div onMouseDown={
            !this.state.open ? this._handleInputOrArrowMouseDown : null
          }>
          <input {...this.props.inputProps} autoCapitalize="none"
            autoComplete="off" autoCorrect="off"
            className={this.props.classNames.input}
            onBlur={this.state.focus ? this._handleInputBlur : null}
            onFocus={!this.state.focus ? this._handleInputFocus : null}
            onKeyDown={this.state.focus ? this._handleInputKeyDown : null}
            readOnly={true} ref="input" spellCheck={false} type="text"
            value={this._inputValue} />
          <span className={this.props.classNames.arrow} />
        </div>
        {this._renderList()}
      </div>
    );
  }

  _renderList() {
    return this.state.open ? (
      <ul className={this.props.classNames.items}
        onMouseLeave={this._handleItemsMouseLeave} ref="items">
        {this._renderListItems()}
      </ul>
    ) : null;
  }

  _renderListItems() {
    return this._items.map((item, i) => {
      const className = [
        item.options ? this.props.classNames.group : this.props.classNames.option,
        item.selected ? this.props.classNames.itemSelect : '',
        i === this.state.hoverIndex ? this.props.classNames.itemHover : ''
      ].join(' ');
      return (
        <li className={className} key={item.key}
          onMouseDown={this._handleItemMouseDown(i)}
          onMouseMove={this._handleItemMouseMove(i)}>
          <span className={this.props.classNames.label}>{item.label}</span>
          <span className={this.props.classNames.checkbox}></span>
        </li>
      );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      if (!prevState.open && this.state.open) {
        document.addEventListener('mousedown', this._handleDocumentMouseDown);
      } else if (prevState.open && !this.state.open) {
        document.removeEventListener('mousedown', this._handleDocumentMouseDown);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      const prevItems = this._items;
      this._items = _prepareItems(nextProps.items);
      this._inputValue = _calculateInputValue(
        this._items,
        nextProps.inputProps.size,
        nextProps.allItemsSelectedLabel
      );
      if (this._items.length > prevItems.length) {
        this.setState({ hoverIndex: null });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleDocumentMouseDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.allItemsSelectedLabel !== nextProps.allItemsSelectedLabel ||
      !shallowEqual(this.props.classNames, nextProps.classNames) ||
      !shallowEqual(this.props.inputProps, nextProps.inputProps) ||
      this.props.items !== nextProps.items ||
      !shallowEqual(this.state, nextState);
  }

  _handleDocumentMouseDown(e) {
    e.preventDefault();
    const inputNode = React.findDOMNode(this.refs.input);
    const itemsNode = React.findDOMNode(this.refs.items);
    if (!e.path.find(n => n === inputNode || n === itemsNode)) {
      this.setState({ focus: false, open: false });
    }
  }

  _handleInputArrowDown(e) {
    e.preventDefault();
    if (!this.state.open) {
      this.setState({ open: true });
    } else {
      this._moveItemHover(1);
    }
  }

  _handleInputArrowUp(e) {
    e.preventDefault();
    if (!this.state.open) {
      this.setState({ open: true });
    } else {
      this._moveItemHover(-1);
    }
  }

  _handleInputBlur() {
    this.setState({ focus: false, open: false, hoverIndex: null });
  }

  _handleInputEscape() {
    if (this.state.open) {
      this.setState({ open: false, hoverIndex: null });
    }
  }

  _handleInputFocus() {
    this.setState({ focus: true })
  }

  _handleInputKeyDown(e) {
    const handler = this._inputKeyDownHandlers[e.keyCode];
    if (handler) {
      handler.call(this, e);
    }
  }

  _handleInputOrArrowMouseDown(e) {
    e.preventDefault();
    React.findDOMNode(this.refs.input).focus();
    this.setState({ open: true });
  }

  _handleInputReturn(e) {
    e.preventDefault();
    const hoverIndex = this.state.hoverIndex;
    if (hoverIndex !== null) {
      this._selectItem(hoverIndex);
    }
  }

  _handleItemMouseDown(index) {
    return e => {
      e.preventDefault();
      this._selectItem(index);
    };
  }

  _handleItemMouseMove(index) {
    return () => {
      if (index !== this.state.hoverIndex) {
        this.setState({ hoverIndex: index });
      }
    }
  }

  _handleItemsMouseLeave() {
    this.setState({ hoverIndex: null });
  }

  _moveItemHover(delta) {
    const items = this._items;
    let hover = this.state.hoverIndex;
    hover = hover === null ? (delta > 0 ? delta - 1 : delta) : hover + delta;
    if (hover < 0) {
      hover = items.length - Math.abs(hover) % items.length;
    } else if (hover >= items.length) {
      hover = hover % items.length;
    }
    this.setState({ hoverIndex : hover });
  }

  _selectItem(index) {
    const item = this._items[index];
    this.props.onItemSelected({
      items: this.props.items,
      ...item.initialLocation,
      selected: !item.selected
    });
  }
}

function _prepareItems(items) {
  if (Array.isArray(items)) {
    return items.map((option, o) => {
      return {
        key: option.key,
        label: option.label,
        selected: option.selected,
        initialLocation: { index: o }
      };
    });
  } else {
    return Array.prototype.concat.apply([], Object.keys(items).map(g => {
      const group = items[g];
      return [].concat(
        {
          key: group.key,
          label: group.label,
          options: group.options,
          selected: !group.options.find(option => !option.selected),
          initialLocation: { key: g }
        },
        group.options.map((option, o) => {
          return {
            key: `${group.key}-${option.key}`,
            label: option.label,
            selected: option.selected,
            initialLocation: { key: g, index: o }
          };
        })
      );
    }));
  }
}

function _calculateInputValue(items, size, allItemsSelectedLabel) {
  if (allItemsSelectedLabel && !items.find(i => !i.selected)) {
    return allItemsSelectedLabel;
  } else {
    const dst = [];
    let i = 0, length = 0;
    while (i < items.length && length < size) {
      const item = items[i];
      if (item.selected) {
        dst.push(item.label);
        if (item.options) {
          i += item.options.length;
        }
      }
      ++i;
      length = dst.reduce((length, str) => length + str.length, 0);
    }
    return dst.join(', ').substring(0, size);
  }
}

Multiselect.propTypes = {
  allItemsSelectedLabel: PropTypes.string,
  classNames: PropTypes.shape({
    arrow: PropTypes.string,
    checkbox: PropTypes.string,
    group: PropTypes.string,
    input: PropTypes.string,
    items: PropTypes.string,
    itemHover: PropTypes.string,
    itemSelect: PropTypes.string,
    label: PropTypes.string,
    multiselect: PropTypes.string,
    multiselectFocus: PropTypes.string,
    multiselectOpen: PropTypes.string,
    option: PropTypes.string
  }),
  inputProps: PropTypes.shape({
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    size: PropTypes.number.isRequired
  }),
  items: PropTypes.oneOfType(
    PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired
      })
    ),
    PropTypes.objectOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            selected: PropTypes.bool.isRequired
          })
        ).isRequired
      })
    )
  ).isRequired,
  onItemSelected: PropTypes.func
};

Multiselect.defaultProps = {
  classNames: {
    arrow: 'multiselectArrow',
    checkbox: 'multiselectCheckbox',
    group: 'multiselectGroup',
    input: 'multiselectInput',
    items: 'multiselectItems',
    itemHover: 'multiselectItemHover',
    itemSelect: 'multiselectItemSelect',
    label: 'multiselectLabel',
    multiselect: 'multiselect',
    multiselectFocus: 'multiselectFocus',
    multiselectOpen: 'multiselectOpen',
    option: 'multiselectOption'
  },
  inputProps: {
    autoFocus: false,
    disabled: false,
    maxLength: null,
    placeholder: '',
    size: 100
  },
  onItemSelected: () => {}
};
