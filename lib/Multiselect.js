'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _shallowEqual = require('./shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Multiselect = function (_Component) {
  _inherits(Multiselect, _Component);

  function Multiselect(props) {
    _classCallCheck(this, Multiselect);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Multiselect).call(this, props));

    _this._normalizedItems = _normalizeItems(props.items);
    _this._selectedItemsInputValue = _calculateSelectedItemsInputValue(_this._normalizedItems, props.inputProps.size, props.allItemsSelectedLabel);

    var filterInputValue = '';
    _this.state = {
      focus: !!props.inputProps.autoFocus,
      open: false,
      filterInputValue: filterInputValue,
      filteredItems: _filterItems(filterInputValue, _this._normalizedItems),
      hoverIndex: null
    };

    _this._handleDocumentMouseDown = _this._handleDocumentMouseDown.bind(_this);
    _this._handleInputBlur = _this._handleInputBlur.bind(_this);
    _this._handleInputChange = _this._handleInputChange.bind(_this);
    _this._handleInputFocus = _this._handleInputFocus.bind(_this);
    _this._handleInputKeyDown = _this._handleInputKeyDown.bind(_this);
    _this._handleInputOrArrowMouseDown = _this._handleInputOrArrowMouseDown.bind(_this);
    _this._handleItemsMouseLeave = _this._handleItemsMouseLeave.bind(_this);
    _this._inputKeyDownHandlers = {
      13: _this._handleInputReturn,
      27: _this._handleInputEscape,
      38: _this._handleInputArrowUp,
      40: _this._handleInputArrowDown
    };
    return _this;
  }

  _createClass(Multiselect, [{
    key: 'render',
    value: function render() {
      var className = [this.props.classNames.multiselect, this.props.disabled ? this.props.classNames.multiselectDisabled : '', this.state.focus ? this.props.classNames.multiselectFocus : '', this.state.open ? this.props.classNames.multiselectOpen : ''].join(' ');
      var value = this.props.filterable && this.state.focus ? this.state.filterInputValue : this._selectedItemsInputValue;
      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(
          'div',
          { onMouseDown: this._handleInputOrArrowMouseDown },
          _react2.default.createElement('input', _extends({}, this.props.inputProps, { autoCapitalize: 'none',
            autoComplete: 'off', autoCorrect: 'off',
            className: this.props.classNames.input,
            disabled: this.props.disabled, onBlur: this._handleInputBlur,
            onChange: this._handleInputChange, onFocus: this._handleInputFocus,
            onKeyDown: this._handleInputKeyDown,
            readOnly: !this.props.filterable, ref: 'input', spellCheck: false,
            type: 'text', value: value })),
          _react2.default.createElement('span', { className: this.props.classNames.arrow })
        ),
        this._renderList()
      );
    }
  }, {
    key: '_renderList',
    value: function _renderList() {
      return !this.props.disabled && this.state.open ? _react2.default.createElement(
        'ul',
        { className: this.props.classNames.items,
          onMouseLeave: this._handleItemsMouseLeave, ref: 'items' },
        this._renderListItems()
      ) : null;
    }
  }, {
    key: '_renderListItems',
    value: function _renderListItems() {
      var _this2 = this;

      return this.state.filteredItems.map(function (item, i) {
        var className = [item.options ? _this2.props.classNames.group : _this2.props.classNames.option, item.selected ? _this2.props.classNames.itemSelect : '', i === _this2.state.hoverIndex ? _this2.props.classNames.itemHover : ''].join(' ');
        return _react2.default.createElement(
          'li',
          { className: className, key: item.key,
            onMouseDown: _this2._handleItemMouseDown(i),
            onMouseMove: _this2._handleItemMouseMove(i) },
          _react2.default.createElement(
            'span',
            { className: _this2.props.classNames.label },
            item.label
          ),
          _react2.default.createElement('span', { className: _this2.props.classNames.checkbox })
        );
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.open !== this.state.open) {
        if (!prevState.open && this.state.open) {
          document.addEventListener('mousedown', this._handleDocumentMouseDown);
        } else if (prevState.open && !this.state.open) {
          document.removeEventListener('mousedown', this._handleDocumentMouseDown);
        }
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.items !== nextProps.items) {
        this._normalizedItems = _normalizeItems(nextProps.items);
        this._selectedItemsInputValue = _calculateSelectedItemsInputValue(this._normalizedItems, nextProps.inputProps.size, nextProps.allItemsSelectedLabel);
        var filteredItems = _filterItems(this.state.filterInputValue, this._normalizedItems);
        var hoverIndex = filteredItems.length === this.state.filteredItems.length ? this.state.hoverIndex : null;
        this.setState({ filteredItems: filteredItems, hoverIndex: hoverIndex });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mousedown', this._handleDocumentMouseDown);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.allItemsSelectedLabel !== nextProps.allItemsSelectedLabel || !(0, _shallowEqual2.default)(this.props.classNames, nextProps.classNames) || this.props.filterable !== nextProps.filterable || !(0, _shallowEqual2.default)(this.props.inputProps, nextProps.inputProps) || this.props.items !== nextProps.items || !(0, _shallowEqual2.default)(this.state, nextState);
    }
  }, {
    key: '_handleDocumentMouseDown',
    value: function _handleDocumentMouseDown(e) {
      var inputNode = _reactDom2.default.findDOMNode(this.refs.input);
      var itemsNode = _reactDom2.default.findDOMNode(this.refs.items);
      if (!e.path.find(function (n) {
        return n === inputNode || n === itemsNode;
      })) {
        inputNode.blur();
        this.setState({
          focus: false,
          open: false,
          filteredItems: this._normalizedItems,
          filterInputValue: ''
        });
      } else if (e.path.find(function (n) {
        return n === itemsNode;
      })) {
        e.preventDefault();
      }
    }
  }, {
    key: '_handleInputArrowDown',
    value: function _handleInputArrowDown(e) {
      e.preventDefault();
      if (!this.state.open) {
        this.setState({ open: true });
      } else {
        this._moveHover(1);
      }
    }
  }, {
    key: '_handleInputArrowUp',
    value: function _handleInputArrowUp(e) {
      e.preventDefault();
      if (!this.state.open) {
        this.setState({ open: true });
      } else {
        this._moveHover(-1);
      }
    }
  }, {
    key: '_handleInputBlur',
    value: function _handleInputBlur() {
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
  }, {
    key: '_handleInputChange',
    value: function _handleInputChange(e) {
      var filterInputValue = e.target.value;
      var filteredItems = _filterItems(filterInputValue, this._normalizedItems);
      var hoverIndex = filteredItems.length === this.state.filteredItems.length ? this.state.hoverIndex : null;
      this.setState({ open: true, filterInputValue: filterInputValue, filteredItems: filteredItems, hoverIndex: hoverIndex });
    }
  }, {
    key: '_handleInputEscape',
    value: function _handleInputEscape() {
      if (this.state.open) {
        this.setState({ open: false, hoverIndex: null });
      }
    }
  }, {
    key: '_handleInputFocus',
    value: function _handleInputFocus() {
      if (!this.props.disabled && !this.state.focus) {
        this.setState({ focus: true });
      }
    }
  }, {
    key: '_handleInputKeyDown',
    value: function _handleInputKeyDown(e) {
      if (!this.props.disabled) {
        var handler = this._inputKeyDownHandlers[e.keyCode];
        if (handler) {
          handler.call(this, e);
        }
      }
    }
  }, {
    key: '_handleInputOrArrowMouseDown',
    value: function _handleInputOrArrowMouseDown(e) {
      e.preventDefault();
      if (!this.props.disabled && !this.state.open) {
        _reactDom2.default.findDOMNode(this.refs.input).focus();
        this.setState({ open: true });
      }
    }
  }, {
    key: '_handleInputReturn',
    value: function _handleInputReturn(e) {
      e.preventDefault();
      var hoverIndex = this.state.hoverIndex;
      if (hoverIndex !== null) {
        this._selectItem(hoverIndex);
      }
    }
  }, {
    key: '_handleItemMouseDown',
    value: function _handleItemMouseDown(index) {
      var _this3 = this;

      return function (e) {
        e.preventDefault();
        _this3._selectItem(index);
      };
    }
  }, {
    key: '_handleItemMouseMove',
    value: function _handleItemMouseMove(index) {
      var _this4 = this;

      return function () {
        if (index !== _this4.state.hoverIndex) {
          _this4.setState({ hoverIndex: index });
        }
      };
    }
  }, {
    key: '_handleItemsMouseLeave',
    value: function _handleItemsMouseLeave() {
      this.setState({ hoverIndex: null });
    }
  }, {
    key: '_moveHover',
    value: function _moveHover(delta) {
      var items = this.state.filteredItems;
      var hover = this.state.hoverIndex;
      hover = hover === null ? delta > 0 ? delta - 1 : delta : hover + delta;
      if (hover < 0) {
        hover = items.length - Math.abs(hover) % items.length;
      } else if (hover >= items.length) {
        hover = hover % items.length;
      }
      this.setState({ hoverIndex: hover });
    }
  }, {
    key: '_selectItem',
    value: function _selectItem(index) {
      var item = this.state.filteredItems[index];
      this.props.onItemSelected(_extends({
        items: this.props.items
      }, item.initialLocation, {
        selected: !item.selected
      }));
    }
  }]);

  return Multiselect;
}(_react.Component);

exports.default = Multiselect;


function _calculateSelectedItemsInputValue(items, size, allItemsSelectedLabel) {
  if (allItemsSelectedLabel && items.length && !items.find(function (i) {
    return !i.selected;
  })) {
    return allItemsSelectedLabel;
  } else {
    var dst = [];
    var i = 0,
        length = 0;
    while (i < items.length && length < size) {
      var item = items[i];
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
    return items.map(function (option, o) {
      return {
        key: option.key,
        label: option.label,
        selected: option.selected,
        initialLocation: { index: o }
      };
    });
  } else {
    return Array.prototype.concat.apply([], Object.keys(items).map(function (g) {
      var group = items[g];
      return [].concat({
        key: group.key,
        label: group.label,
        options: group.options,
        selected: !group.options.find(function (option) {
          return !option.selected;
        }),
        initialLocation: { key: g }
      }, group.options.map(function (option, o) {
        return {
          key: group.key + '-' + option.key,
          label: option.label,
          selected: option.selected,
          initialLocation: { key: g, index: o }
        };
      }));
    }));
  }
}

function _filterItems(filter, items) {
  if (filter.length) {
    filter = filter.trim().toLowerCase();
    return items.filter(function (i) {
      return i.label.trim().toLowerCase().indexOf(filter) >= 0;
    });
  } else {
    return items;
  }
}

Multiselect.propTypes = {
  allItemsSelectedLabel: _react.PropTypes.string,
  classNames: _react.PropTypes.shape({
    arrow: _react.PropTypes.string,
    checkbox: _react.PropTypes.string,
    group: _react.PropTypes.string,
    input: _react.PropTypes.string,
    items: _react.PropTypes.string,
    itemHover: _react.PropTypes.string,
    itemSelect: _react.PropTypes.string,
    label: _react.PropTypes.string,
    multiselect: _react.PropTypes.string,
    multiselectDisabled: _react.PropTypes.string,
    multiselectFocus: _react.PropTypes.string,
    multiselectOpen: _react.PropTypes.string,
    option: _react.PropTypes.string
  }),
  disabled: _react.PropTypes.bool,
  filterable: _react.PropTypes.bool.isRequired,
  inputProps: _react.PropTypes.shape({
    autoFocus: _react.PropTypes.bool,
    maxLength: _react.PropTypes.number,
    placeholder: _react.PropTypes.string,
    size: _react.PropTypes.number.isRequired
  }),
  items: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.shape({
    key: _react.PropTypes.string.isRequired,
    label: _react.PropTypes.string.isRequired,
    selected: _react.PropTypes.bool.isRequired
  })), _react.PropTypes.objectOf(_react.PropTypes.shape({
    key: _react.PropTypes.string.isRequired,
    label: _react.PropTypes.string.isRequired,
    options: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      key: _react.PropTypes.string.isRequired,
      label: _react.PropTypes.string.isRequired,
      selected: _react.PropTypes.bool.isRequired
    })).isRequired
  }))]).isRequired,
  onItemSelected: _react.PropTypes.func
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
  onItemSelected: function onItemSelected() {}
};