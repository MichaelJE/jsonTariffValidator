import { describe, expect } from '@jest/globals';

import JsonValidator from '../shared/jsonValidator';

import { IValidationResponses } from './../types';

import definitionObj from './../test-data/definitions';
import data from './../test-data/data';

describe('JsonValidator module', () => {
  it('Should validate with no errors the following object', () => {
    const errors: IValidationResponses = {};
    const warnings: IValidationResponses = {};
    
    const validator = new JsonValidator();
    
    validator.validateData(data, '', 0, 0, definitionObj, errors, warnings);

    expect(Object.values(errors).length).toEqual(0);
    expect(Object.values(errors).length).toEqual(0);
  });

  it('should fail if the data object doesn\'t match the object definition', () => {
    const validator = new JsonValidator();
    const errors: IValidationResponses = {};
    const warnings: IValidationResponses = {};

    const wrongData = JSON.parse(JSON.stringify(data));
    wrongData.uom = 1;

    validator.validateData(wrongData, '', 0, 0, definitionObj, errors, warnings);
    expect(Object.values(errors).length).toEqual(1);
  });
});
