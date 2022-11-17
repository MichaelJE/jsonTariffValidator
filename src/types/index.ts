export interface IJsonDictionary {
  [target: string]: string | IDuties | ITax[] | IJsonDictionary[];
  uom: string | null;
  duties: IDuties | null;
  taxes: ITax[] | [];
  errorCode: string | null;
  desc: string | null;
  code: string | null;
  children: IJsonDictionary[];
  errorMessage: string | null;
  id: string | null;
  type: string | null;
}

export interface IJsonAnalysisDef {
  [key: string]: {
    type?: string;
    child?: boolean;
    components?: {
      [cKey: string]: Record<string, unknown>;
    };
  };
}

export interface IValidationResponses {
  [key: string]: string[];
}

export interface IDuties {
  [key: string]: {
    [key: string]: string;
    longname?: string;
    meursing?: string | null;
    name?: string;
    nonAVEquivalent?: string;
    rate?: string;
    type?: string;
  } | null;
}

export interface IDuty {
  longName?: string;
  meursing?: string | null;
  name?: string;
  nonAVEquivalent?: string;
  rate?: string;
  type?: string;
}

export interface ITax {
  [target: string]: string;
  name?: string;
  rate?: string;
}

