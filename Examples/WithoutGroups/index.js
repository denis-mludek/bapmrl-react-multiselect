import React, { Component } from 'react';
import Multiselect from 'bapmrl-react-multiselect';

class WithoutGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          key: '0',
          label: 'Option 0',
          selected: true
        },
        {
          key: '1',
          label: 'Option 1',
          selected: false
        }
      ]
    };
    this.handleItemSelected = this.handleItemSelected.bind(this);
  }

  render() {
    return (
      <Multiselect
        items={this.state.items}
        onItemSelected={this.handleItemSelected}
      />
    );
  }

  handleItemSelected(e) {
    const items = e.items.map((option, index) => {
      const selected = e.index === index ? e.selected : option.selected;
      return Object.assign({}, option, { selected });
    });
    this.setState({ items });
  }
}

React.render(<WithoutGroups />, document.body);
