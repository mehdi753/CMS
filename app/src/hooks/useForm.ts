/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from "react";

export enum VALIDATORS {
  EMAIL = "email",
  NUMBER = "number",
  URL = "url",
  REQUIRED = "required",
  ENUM = "enum",
}

const URL_REGEX =
  /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)+[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?((\/|\?|=)[[:graph:]]*)?/g;

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface ValidatorResponse {
  state: boolean;
  errorMessage?: string;
}

interface Value<T> {
  value: any;
  validator?: (...values: any[]) => ValidatorResponse;
  validators?: VALIDATORS[];
  dependencies?: T[];
  enum?: (string | number)[];
}

type Values<T extends string> = {
  [key in T]?: Value<T>;
};

interface Field {
  value: any;
  state: boolean;
  errorMessage?: string;
}

type Fields<T extends string> = {
  [key in T]?: Field;
};

const VF: { [key in VALIDATORS]: (...args: any[]) => ValidatorResponse } = {
  url: (value: string): ValidatorResponse => {
    if (!!value.match(URL_REGEX)) {
      return { state: true };
    }
    return { state: false, errorMessage: "This is not a valid URL" };
  },
  required: (value: any): ValidatorResponse => {
    if (value === 0 || !!value) {
      return { state: true };
    }
    return { state: false, errorMessage: "This Field is required" };
  },
  number: (value: number): ValidatorResponse => {
    if (!isNaN(value) && isFinite(value)) {
      return { state: true };
    }
    return { state: false, errorMessage: "This is not a valid number" };
  },
  email: (value: string): ValidatorResponse => {
    if (!!value.match(EMAIL_REGEX)) {
      return { state: true };
    }
    return { state: false, errorMessage: "This is not a valid Email" };
  },
  enum: (
    value: string | number,
    enumArray: (string | number)[]
  ): ValidatorResponse => {
    if (enumArray.includes(value) || enumArray.includes(Number(value))) {
      return { state: true };
    }
    return { state: false, errorMessage: "This is not a valid value" };
  },
};

export default function useForm<T extends string>(initialState: Values<T>) {
  const [values, setValues] = useState<Values<T>>(initialState);
  const [fields, setFields] = useState<Fields<T>>({});
  const [touched, setTouched] = useState<boolean>(false);

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLFormElement;
    const name: T = target.name as T;
    const value = target.value;
    const fieldValue: Value<T> | undefined = values[name];
    if (fieldValue) {
      const field: Values<T> = {
        [name]: { ...fieldValue, value },
      } as Values<T>;
      setValues({
        ...values,
        ...field,
      });
      setTouched(true);
    }
  };

  const validate = (field: Value<T>, value: string): ValidatorResponse => {
    if (field.validators?.length) {
      let i = 0;
      while (i < field.validators.length) {
        const { state, errorMessage } = VF[field.validators[i]](
          value,
          field.enum
        );
        if (!state) {
          return { state, errorMessage };
        }
        i++;
      }
    }
    if (field.validator) {
      const depValues: any[] = [];
      if (field.dependencies) {
        field.dependencies.forEach((dep) => {
          const depVal = values[dep];
          if (depVal) depValues.push(depVal.value);
        });
      }
      const { state, errorMessage } = field.validator(value, ...depValues);
      if (!state) {
        return { state, errorMessage };
      }
    }
    return {
      state: true,
    };
  };

  const validateAll = useCallback((): boolean => {
    let newFields: Fields<T> = {};
    for (const key in values) {
      const field = values[key];
      if (field) {
        const fieldState: ValidatorResponse = validate(field, field.value);
        newFields = {
          ...newFields,
          [key]: {
            value: field.value,
            ...fieldState,
          },
        };
      }
    }
    if (touched) {
      setFields({ ...newFields });
    }
    return !(Object.values(newFields) as Field[]).some((v: Field) => !v.state);
  }, [values]);

  const isValid = useMemo(validateAll, [validateAll]);

  return {
    fields,
    isValid,
    handleChange,
  };
}
