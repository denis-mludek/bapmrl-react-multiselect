import React, { Component, PropTypes } from 'react';

export default class Multiselect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focus: props.inputProps.autoFocus,
      open: false,
      groupHoverIndex: null,
      optionHoverIndex: null
    };

    this._handleDocumentMouseDown = this._handleDocumentMouseDown.bind(this);
    this._handleInputBlur = this._handleInputBlur.bind(this);
    this._handleInputFocus = this._handleInputFocus.bind(this);
    this._handleInputKeyDown = this._handleInputKeyDown.bind(this);
    this._handleInputOrArrowMouseDown = this._handleInputOrArrowMouseDown.bind(this);
    this._handleOptionsMouseLeave = this._handleOptionsMouseLeave.bind(this);
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
            readOnly={true} ref="input" spellCheck={false} type="text" />
          <span className={this.props.classNames.arrow} />
        </div>
        {this.renderList()}
      </div>
    );
  }

  renderList() {
    return this.state.open ? (
      <ul className={this.props.classNames.items}
        onMouseLeave={this._handleOptionsMouseLeave} ref="options">
        {
          Array.isArray(this.props.items) ?
           this.renderOptions(this.props.items, null) :
           this.renderGroups(this.props.items)
        }
      </ul>
    ) : null;
  }

  renderGroups(groups) {
    return Object.keys(groups).map((key, index) => {
      const group = groups[key];
      const className = [
        this.props.classNames.group,
        !group.options.find(o => !o.selected) ?
        this.props.classNames.itemSelect : '',
        (
          index === this.state.groupHoverIndex &&
          this.state.optionHoverIndex === null
        ) ? this.props.classNames.itemHover : ''
      ].join(' ');
      return (
        <div key={group.key}>
          <li className={className}
            onMouseDown={this._handleItemMouseDown(index, null)}
            onMouseMove={this._handleItemMouseMove(index, null)}>
            <span className={this.props.classNames.label}>{group.label}</span>
            <span className={this.props.classNames.checkbox}></span>
          </li>
          {this.renderOptions(group.options, index)}
        </div>
      );
    }.bind(this));
  }

  renderOptions(options, groupIndex) {
    return options.map((option, optionIndex) => {
      const className = [
        this.props.classNames.option,
        option.selected ? this.props.classNames.itemSelect : '',
        (
          groupIndex === this.state.groupHoverIndex &&
          optionIndex === this.state.optionHoverIndex
        ) ? this.props.classNames.itemHover : ''
      ].join(' ');
      return (
        <li className={className} key={option.key}
          onMouseDown={this._handleItemMouseDown(groupIndex, optionIndex)}
          onMouseMove={this._handleItemMouseMove(groupIndex, optionIndex)}>
          <span className={this.props.classNames.label}>{option.label}</span>
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

  componentWillUnmount() {
    document.removeEventListener('click', this._handleDocumentMouseDown);
  }

  _handleDocumentMouseDown(e) {
    e.preventDefault();
    const inputNode = React.findDOMNode(this.refs.input);
    const optionsNode = React.findDOMNode(this.refs.options);
    if (!e.path.find(n => n === inputNode || n === optionsNode)) {
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
    this.setState({
      focus: false,
      open: false,
      groupHoverIndex: null,
      optionHoverIndex: null
    });
  }

  _handleInputEscape() {
    if (this.state.open) {
      this.setState({
        open: false,
        groupHoverIndex: null,
        optionHoverIndex: null
      });
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
    const groupHoverIndex = this.state.groupHoverIndex;
    const optionHoverIndex = this.state.optionHoverIndex;
    if (groupHoverIndex !== null || optionHoverIndex !== null) {
      this._selectItem(groupHoverIndex, optionHoverIndex);
    }
  }

  _handleItemMouseDown(groupIndex, optionIndex) {
    return e => {
      e.preventDefault();
      this._selectItem(groupIndex, optionIndex);
    };
  }

  _handleItemMouseMove(groupIndex, optionIndex) {
    return () => {
      if (
        groupIndex !== this.state.groupHoverIndex ||
        optionIndex !== this.state.optionHoverIndex
      ) {
        this.setState({
          groupHoverIndex: groupIndex,
          optionHoverIndex: optionIndex
        });
      }
    }
  }

  _handleOptionsMouseLeave() {
    this.setState({ groupHoverIndex: null, optionHoverIndex: null });
  }

  _moveItemHover(delta) {
    const items = this.props.items;
    if (Array.isArray(items)) {
      let hover = this.state.optionHoverIndex;
      hover = hover === null ? (delta > 0 ? delta - 1 : delta) : hover + delta;
      if (hover < 0) {
        hover = items.length - Math.abs(hover) % items.length;
      } else if (hover >= items.length) {
        hover = hover % items.length;
      }
      this.setState({ optionHoverIndex : hover });
    }
  }

  _selectItem(groupIndex, optionIndex) {
    const items = this.props.items;
    if (Array.isArray(items)) {
      this.props.onItemSelected({
        items,
        index: optionIndex,
        selected: !items[optionIndex].selected
      });
    } else {
      const key = Object.keys(items)[groupIndex];
      const options = items[key].options;
      if (optionIndex === null) {
        const selected = !!options.find(o => !o.selected);
        this.props.onItemSelected({ items, key, selected });
      } else {
        this.props.onItemSelected({
          items,
          key,
          index: optionIndex,
          selected: !options[optionIndex].selected
        });
      }
    }
  }
}

Multiselect.propTypes = {
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
    size: PropTypes.number
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
    size: 20
  },
  onItemSelected: () => {}
};
