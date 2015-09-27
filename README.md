# bapmrl-react-multiselect

`bapmrl-react-multiselect` is a javascript library that provides a filterable
React Multiselect Component. [Read the code examples](https://github.com/bapmrl/bapmrl-react-multiselect/tree/master/Examples).

## API

### constructor(props)

#### props.allItemsSelectedLabel

Type: `string`

The value of the `<input>` element when all items are selected.

#### props.classNames

Type: `object`

Allowed Keys:
  `arrow`, `checkbox`, `group`, `input`, `items`, `itemHover`, `itemSelect`,
  `label`, `multiselect`, `multiselectDisabled`, `multiselectFocus`,
  `multiselectOpen`, `option`

An object containing custom class names for child elements.

#### props.disabled

Type: `bool`

Indicates that the component is not available for interaction.

#### props.filterable

Type: `bool`

Indicates that the items are filtered by the `value` of the `input` element.

#### props.inputProps

Type: `object`

Props to pass directly to the `<input>` element.

#### props.items

Type: `object` or `array`

Can either be an object with property values of type `group` or an array of type
`option`.

Type `group` has the following shape:
```javascript
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
```

Type `option` has the following shape:
```javascript
PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired
})
```

#### props.onItemSelected

Type: `func`

Event handler triggered whenever a group or option is selected.

Event shape:

| Type of `props.items` / Action | Select group               | Select option                     |
|--------------------------------|:--------------------------:|:---------------------------------:|
| `object`                       | `{ items, key, selected }` | `{ items, key, index, selected }` |
| `array`                        |                            | `{ items, index, selected }`      |

where `items` is the latest `props.items` used for rendering the component and
`selected` is the item's new `selected` state.

Use this callback to create new `props.items` and make the component rerender.
