import {
  IJsonDictionary,
  IJsonAnalysisDef,
  IDuty,
  IValidationResponses
} from './../types/index';
  
export default class JsonValidator {
  depth: number|null = null;

  descCollection: Map<string, number|null> = null;

  constructor() {
    this.depth = 0;
    this.descCollection = new Map();
  }

  #checkDuties = (duties: IDuty[]) => {
    let found = false;
    let foundItem = '';
    for (const id in duties) {
      if (duties[id].type && duties[id].type.toLowerCase() === 'general') {
        if (found) {
          foundItem = 'Only one General type per record allowed, but two were found';
          break;
        }
        found = true;
      }
    }

    return foundItem;
  };

  validateData = (node: IJsonDictionary, nodeId: string, parentId: number, childId: number, defObj: IJsonAnalysisDef, errors: IValidationResponses, warnings: IValidationResponses) => {
    const objDefKey = Object.keys(defObj);
    const id = `${nodeId}${this.depth}${parentId}${childId}`;
    const humanId = `[${this.depth}:${childId}]`;
    objDefKey.forEach((key: string) => {
      if (!Object.prototype.hasOwnProperty.call(node, key)) {
        if (!Object.prototype.hasOwnProperty.call(errors, id)) {
          errors[id] = [];
        }
        errors[id].push(`${humanId}: The property ${key} is missing`);
        return;
      }

      if (node[key] === null) return; // if the property exist, but is with a value of null
      // then it's fine
      if (node[key] && typeof node[key] === 'object') {
        if (!Object.prototype.hasOwnProperty.call(node[key], 'length') && defObj[key].type === 'array') {
          if (!Object.prototype.hasOwnProperty.call(errors, id)) {
            errors[id] = [];
          }
          errors[id].push(`${humanId}: Wrong type for ${key}. Expected ${defObj[key].type}, but found ${typeof node[key]}`);
        } else if (Object.prototype.hasOwnProperty.call(node[key], 'length')
          && defObj[key].type === 'array'
          && defObj[key].child) {
          // It's an array, so propagate down
          if (node.type === 'ORPHAN') {
            if (!node[key].length) {
              if (!Object.prototype.hasOwnProperty.call(errors, id)) {
                errors[id] = [];
              }
              errors[id].push(`${humanId}: Orphan with no children`);
            }
          }

          let mappedDesc = this.descCollection.get(node.desc) || 0;

          if (node.desc && mappedDesc && mappedDesc > 0) {
            if (!Object.prototype.hasOwnProperty.call(warnings, id)) {
              warnings[id] = [];
            }
            warnings[id].push(`${humanId}: Child with the same description as parent`);
          }

          if (node.desc) {
            this.descCollection.set(node.desc, mappedDesc += 1);
          }

          this.depth += 1;
          (node[key] as Array<IJsonDictionary>).forEach((child: IJsonDictionary, index: number) => {
            this.validateData(child, id, parentId, index, defObj, errors, warnings);
          });
          this.depth -= 1;

          mappedDesc = this.descCollection.get(node.desc);
          if (mappedDesc === 1) {
            this.descCollection.delete(node.desc);
          }
        } else if (Object.prototype.hasOwnProperty.call(node[key], 'length')
            && defObj[key].type === 'array') {
          (node[key] as Array<IJsonDictionary>).forEach((child: IJsonDictionary, index: number) => {
            this.validateData(child, id, parentId, index, defObj[key].components, errors, warnings);
          });
        } else if (node[key] && defObj[key].type === 'map') {
          const dutiesErrors = this.#checkDuties((Object.values((node[key] as IDuty)) as IDuty[]));

          if (dutiesErrors) {
            if (!Object.prototype.hasOwnProperty.call(errors, id)) {
              errors[id] = [];
            }
            errors[id].push(`${humanId}: ${dutiesErrors}`);
          }

          Object.values(node[key]).forEach((child, index) => {
            this.validateData(child, id, parentId, index, defObj[key].components, errors, warnings);
          });
        }
      } else if (typeof node[key] !== defObj[key].type) {
        if (!Object.prototype.hasOwnProperty.call(errors, id)) {
          errors[id] = [];
        }
        errors[id].push(`${humanId}: ${key} of wrong type. Expected ${defObj[key].type}, but ${typeof node[key]} was found`);
      }
    });
    if (!this.depth) {
      this.descCollection.clear();
    }
  };
}
