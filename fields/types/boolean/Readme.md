# Boolean Field

Stores a `Boolean` in the model.

## Methods

### `format`

Returns the string `"true"` or `"false"`.

### `updateItem`

Because `FormData` can only submit `String` values, and HTML Forms won't submit fields at all when checkbox inputs are not checked, there are a few unusual behaviours when updating Boolean fields:

* The stored value is always updated, even when `undefined` is provided
* Any falsy value, including `undefined`, `null`, `false`, `""` and `0` will store `false`
* The string `"false"` will store `false`
* Any other truthy string will store `true`
* Any truthy number will store `true`
* The boolean `true` will store `true`

There is no way to use `updateItem` to remove Boolean field values from the item.

### `validateInput`

Ensures the value can be interpreted using the rules above. Other complex values (objects that aren't null, dates, arrays, etc) are not valid input.

### `validateRequiredInput`

Ensures the value matches one of the rules above that will store `true`
