export function required(label = 'This field') {
  return (value) => (!value || !String(value).trim() ? `${label} is required` : null);
}

export function email(value) {
  if (!value) return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value) ? null : 'Enter a valid email address';
}

export function minLength(n, label = 'This field') {
  return (value) => (value && value.length < n ? `${label} must be at least ${n} characters` : null);
}

export function passwordStrength(value) {
  if (!value) return null;
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
  if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter';
  if (!/[0-9]/.test(value)) return 'Password must include a number';
  return null;
}

export function matches(otherFieldName, label = 'Fields') {
  return (value, allValues) => (value !== allValues[otherFieldName] ? `${label} do not match` : null);
}

export function isTrue(message) {
  return (value) => (value ? null : message);
}

export function pastDate(label = 'Date') {
  return (value) => {
    if (!value) return null;
    return new Date(value) < new Date() ? null : `${label} must be in the past`;
  };
}

export function compose(...validatorFns) {
  return (value, allValues) => {
    for (const fn of validatorFns) {
      const err = fn(value, allValues);
      if (err) return err;
    }
    return null;
  };
}
export function minValue(n, label = 'This field') {
  return (value) => (value !== '' && value !== null && Number(value) < n ? `${label} must be at least ${n}` : null);
}