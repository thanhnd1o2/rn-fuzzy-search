# rn-fuzzy-search

for fuzzy search by native

## Installation

```sh
npm install rn-fuzzy-search
```

## Usage

```js
import { search } from 'rn-fuzzy-search';

// Example usage
const result = await search(
  'Doe',
  [
    { id: '1', name: 'Steven Wilson' },
    { id: '2', name: 'John Doe' },
    { id: '3', name: 'Stephen Wilkson' },
  ],
  {
    keyField: 'id',
    fields: 'name',
    threshold: 0.1,
    onlyIdReturned: false,
  }
);

console.log(result);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
