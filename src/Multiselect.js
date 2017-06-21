import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import shallowEqual from './shallowEqual';

export default class Multiselect extends Component {
  constructor(props) {
    super(props);

    this._normalizedItems = _normalizeItems(props.items);
    this._selectedItemsInputValue = _calculateSelectedItemsInputValue(
      this._normalizedItems,
      props.inputProps.size,
      props.allItemsSelectedLabel
    );

    const filterInputValue = '';
    this.state = {
      focus: !!props.inputProps.autoFocus,
      open: false,
      filterInputValue,
      filteredItems: _filterItems(filterInputValue, this._normalizedItems),
      hoverIndex: null
    };

    this._handleDocumentMouseDown = this._handleDocumentMouseDown.bind(this);
    this._handleInputBlur = this._handleInputBlur.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
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
      this.props.disabled ? this.props.classNames.multiselectDisabled : '',
      this.state.focus ? this.props.classNames.multiselectFocus : '',
      this.state.open ? this.props.classNames.multiselectOpen : ''
    ].join(' ');
    const value = this.props.filterable && this.state.focus ?
      this.state.filterInputValue : this._selectedItemsInputValue;
    return (
      <div className={className}>
        <div onMouseDown={this._handleInputOrArrowMouseDown}>
          <input {...this.props.inputProps} autoCapitalize="none"
            autoComplete="off" autoCorrect="off"
            className={this.props.classNames.input}
            disabled={this.props.disabled} onBlur={this._handleInputBlur}
            onChange={this._handleInputChange} onFocus={this._handleInputFocus}
            onKeyDown={this._handleInputKeyDown}
            readOnly={!this.props.filterable} ref="input" spellCheck={false}
            type="text" value={value} />
          <span className={this.props.classNames.arrow} />
        </div>
        {this._renderList()}
      </div>
    );
  }

  _renderList() {
    return !this.props.disabled && this.state.open ? (
      <ul className={this.props.classNames.items}
        onMouseLeave={this._handleItemsMouseLeave} ref="items">
        {this._renderListItems()}
      </ul>
    ) : null;
  }

  _renderListItems() {
    return this.state.filteredItems.map((item, i) => {
      const className = [
        item.options ? this.props.classNames.group : this.props.classNames.option,
        item.selected ? this.props.classNames.itemSelect : '',
        i === this.state.hoverIndex ? this.props.classNames.itemHover : ''
      ].join(' ');
      return (
        <li className={className} key={item.key}
          onMouseDown={this._handleItemMouseDown(i)}
          onMouseMove={this._handleItemMouseMove(i)}>
          <span className={this.props.classNames.label} ref={'msLabel' + i}>{item.label}</span>
          <span className={this.props.classNames.checkbox} ref={'msCheck' + i}></span>
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
      this._normalizedItems = _normalizeItems(nextProps.items);
      this._selectedItemsInputValue = _calculateSelectedItemsInputValue(
        this._normalizedItems,
        nextProps.inputProps.size,
        nextProps.allItemsSelectedLabel
      );
      const filteredItems = _filterItems(
        this.state.filterInputValue,
        this._normalizedItems
      );
      const hoverIndex = filteredItems.length === this.state.filteredItems.length ? this.state.hoverIndex : null;
      this.setState({ filteredItems, hoverIndex });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleDocumentMouseDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.allItemsSelectedLabel !== nextProps.allItemsSelectedLabel ||
      !shallowEqual(this.props.classNames, nextProps.classNames) ||
      this.props.filterable !== nextProps.filterable ||
      !shallowEqual(this.props.inputProps, nextProps.inputProps) ||
      this.props.items !== nextProps.items ||
      !shallowEqual(this.state, nextState);
  }

  _handleDocumentMouseDown(e) {
    const inputNode = ReactDOM.findDOMNode(this.refs.input);
    const itemsNode = ReactDOM.findDOMNode(this.refs.items);
    if (e && e.path && !e.path.find(n => n === inputNode || n === itemsNode)) {
      inputNode.blur();
      this.setState({
        focus: false,
        open: false,
        filteredItems: this._normalizedItems,
        filterInputValue: ''
      });
    } else if (e && e.path && e.path.find(n => n === itemsNode)) {
      e.preventDefault();
    } else {
      //In case of IE11, e.path is undefined. So below is the workaround
      const isItemCheckBox = this.state.filteredItems.reduce((acc, item, i) => acc || e.target === ReactDOM.findDOMNode(this.refs['msCheck'+ i]), false);
      const isItemLabel = this.state.filteredItems.reduce((acc, item, i) => acc || e.target === ReactDOM.findDOMNode(this.refs['msLabel'+ i]), false);
      if(isItemCheckBox || isItemLabel) {
        e.preventDefault();
      } else {
        inputNode.blur();
        this.setState({
          focus: false,
          open: false,
          filteredItems: this._normalizedItems,
          filterInputValue: ''
        });
      }
    }
  }

  _handleInputArrowDown(e) {
    e.preventDefault();
    if (!this.state.open) {
      this.setState({ open: true });
    } else {
      this._moveHover(1);
    }
  }

  _handleInputArrowUp(e) {
    e.preventDefault();
    if (!this.state.open) {
      this.setState({ open: true });
    } else {
      this._moveHover(-1);
    }
  }

  _handleInputBlur() {
    if (this.state.focus) {
      this.setState({
        focus: false,
        open: false,
        filteredItems: this._normalizedItems,
        filterInputValue: '',
        hoverIndex: null
      });
    }
  }

  _handleInputChange(e) {
    const filterInputValue = e.target.value;
    const filteredItems = _filterItems(filterInputValue, this._normalizedItems);
    const hoverIndex = filteredItems.length === this.state.filteredItems.length ? this.state.hoverIndex : null;
    this.setState({ open: true, filterInputValue, filteredItems, hoverIndex });
  }

  _handleInputEscape() {
    if (this.state.open) {
      this.setState({ open: false, hoverIndex: null });
    }
  }

  _handleInputFocus() {
    if (!this.props.disabled && !this.state.focus) {
      this.setState({ focus: true });
    }
  }

  _handleInputKeyDown(e) {
    if (!this.props.disabled) {
      const handler = this._inputKeyDownHandlers[e.keyCode];
      if (handler) {
        handler.call(this, e);
      }
    }
  }

  _handleInputOrArrowMouseDown(e) {
    e.preventDefault();
    if (!this.props.disabled && !this.state.open) {
      ReactDOM.findDOMNode(this.refs.input).focus();
      this.setState({ open: true });
    }
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
    };
  }

  _handleItemsMouseLeave() {
    this.setState({ hoverIndex: null });
  }

  _moveHover(delta) {
    const items = this.state.filteredItems;
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
    const item = this.state.filteredItems[index];
    this.props.onItemSelected({
      items: this.props.items,
      ...item.initialLocation,
      selected: !item.selected
    });
  }
}

function _calculateSelectedItemsInputValue(items, size, allItemsSelectedLabel) {
  if (allItemsSelectedLabel && items.length && !items.find(i => !i.selected)) {
    return allItemsSelectedLabel;
  } else {
    const dst = [];
    let i = 0, length = 0;
    while (i < items.length && length < size) {
      const item = items[i];
      if (!item.options && item.selected) {
        dst.push(item.label);
        length += item.label.length;
      }
      ++i;
    }
    return dst.join(', ').substring(0, size);
  }
}

function _normalizeItems(items) {
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

function _filterItems(filter, items) {
  if (filter.length) {
    filter = filter.trim().toLowerCase();
    return items.filter(i => i.label.trim().toLowerCase().indexOf(filter) >= 0);
  } else {
    return items;
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
    multiselectDisabled: PropTypes.string,
    multiselectFocus: PropTypes.string,
    multiselectOpen: PropTypes.string,
    option: PropTypes.string
  }),
  disabled: PropTypes.bool,
  filterable: PropTypes.bool.isRequired,
  inputProps: PropTypes.shape({
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    size: PropTypes.number.isRequired
  }),
  items: PropTypes.oneOfType([
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
  ]).isRequired,
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
    multiselectDisabled: 'multiselectDisabled',
    multiselectFocus: 'multiselectFocus',
    multiselectOpen: 'multiselectOpen',
    option: 'multiselectOption'
  },
  disabled: false,
  filterable: true,
  inputProps: {
    autoFocus: false,
    maxLength: null,
    placeholder: '',
    size: 100
  },
  onItemSelected: () => {}
};
