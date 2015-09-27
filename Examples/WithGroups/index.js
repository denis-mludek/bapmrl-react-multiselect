import React, { Component } from 'react';
import Multiselect from 'bapmrl-react-multiselect';

class WithGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {
        '0': {
          key: '0',
          label: 'Group 0',
          options: [
            {
              key: '0',
              label: 'Option 0-0',
              selected: true
            },
            {
              key: '1',
              label: 'Option 0-1',
              selected: false
            }
          ]
        },
        '1': {
          key: '1',
          label: 'Group 1',
          options: [
            {
              key: '0',
              label: 'Option 1-0',
              selected: true
            },
            {
              key: '1',
              label: 'Option 1-1',
              selected: false
            }
          ]
        }
      }
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
    const options = e.items[e.key].options.map((option, index) => {
      let selected;
      if (e.index === undefined) {
        selected = e.selected;
      } else {
        selected = e.index === index ? e.selected : option.selected;
      }
      return Object.assign({}, option, { selected });
    });
    const group = Object.assign({}, e.items[e.key], { options });
    const items = Object.assign({}, e.items, { [e.key]: group });
    this.setState({ items });
  }
}

React.render(<WithGroups />, document.body);
