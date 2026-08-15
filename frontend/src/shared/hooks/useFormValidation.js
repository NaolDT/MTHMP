import { useCallback, useState } from 'react';

export function useFormValidation(initialValues, validators) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (name, value, allValues) => {
      const validator = validators[name];
      return validator ? validator(value, allValues) : null;
    },
    [validators]
  );

  function handleChange(e) {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, newValues) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, values) }));
  }

  function setFieldValue(name, value) {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, newValues) }));
    }
  }

  function validateAll() {
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    for (const name of Object.keys(validators)) {
      newTouched[name] = true;
      const err = validateField(name, values[name], values);
      if (err) {
        newErrors[name] = err;
        isValid = false;
      }
    }

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors(newErrors);
    return isValid;
  }

  function reset(newValues = initialValues) {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }

  return { values, errors, touched, handleChange, handleBlur, setFieldValue, setValues, validateAll, reset };
}