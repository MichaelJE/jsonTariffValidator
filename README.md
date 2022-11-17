# `JSONValidator`
This module is responsible for validating JSON objects meant solely for real life tariffs.
## Usage
``` js
// ES6 usage
import JsonValidator from './{path-to-folder}/shared/jsonValidator';
```
### Initialisation

Before we are able to use the entire package, we need to initialise it:
``` js
const validator = new JsonValidator();
```

### How it works
After we have initialised the module, we end up with an object that contains a series of
data validation functions. To validate tariff data we need to use the `validateData` function.

``` ts
validateData = (node: IJsonDictionary, nodeId: string, parentId: number, childId: number, defObj: IJsonAnalysisDef, errors: IValidationResponses, warnings: IValidationResponses): void
```

**Params**
- **node** - The root node (The data is of type **general tree**, and can provide only a single root that propagates down to its branches/children)
- **nodeId** - the location of the node of interest. This  will always be an empty string. And will serve as the current address in the general tree ('000' will be automatically generated for the root)
- **parentId** - always an initial number 0, this will be the current parent node, from which the iteration is coming
- **childId** - a number, the current index of the leaf
- **defObj** - The dictionary of definitions (read below)
- **errors** - When the function completes the tree traversal it will pass all the errors by reference out to the variable passed
- **warnings** - Same as the errors parameter, but it collects all non-critical issues

1. In order to use the `validateData` function, a data format/definition needs to be established:
``` js
const dataDefinition = {
  element: { type: 'string' },
  name: { type: 'string' },
  type: { type: 'string' },
  children: {
    type: 'array',
    child: true
  }
};
```

2. Together with that some data needs to be established
``` js
const data = {
    element: null,
    name: 'electro positive',
    type: 'metal',
    children: [{
        element: 'Nb',
        name: 'Niobium'
        type: 'metal'
    }]
}
```

3. An error holder for any validation errors is necessary, along with a warnings holder:
``` js
    const errors: IValidationResponses = {};
    const warnings: IValidationResponses = {};
```

4. Finally, after all above is defined we can start validating some data

``` js
validator.validateData(data, '', 0, 0, 0, dataDefinition, errors, warnings);

if (!Object.values(errors).length) console.log('no errors found');
if (!Object.values(warnings).length) console.log('no warnings found');
```
#### Class Members
```js
depth: Number // Tracks the depth of the current iteration
descCollection: Map<string, number|null>  // Customized description/text collector, to  please the needs of the task it was made for. (not related to the general means of the component)
```
#### validateData Symmary
Validates generic json data with any ***predefined*** format.

**Parameters**
1. The data to validate
2. Node  address always an empty string at the initial function invokation
3.  Parent index (always 0), tracks the depth of the current iteration
4. child node index (If no specific logic is applied it can just be left as **zero**)
5. The object definition
6. errors - passed by reference
7. warnings - passed by reference


#### To run the tests
```js
npm run test
```
This woud run the Jest test kit. Feel free to play with it in order to get a bit more general idea of what's happening.