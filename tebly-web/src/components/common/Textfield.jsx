import { useState } from 'react';
import { FieldWrapper, FieldInput } from './TextFieldBase';

const TextFieldBase = ({ value, onChange, placeholder }) => {
  const [focused, setFocused] = useState(false);

  return (
    <FieldWrapper $focused={focused}>
      <FieldInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </FieldWrapper>
  );
};

export default TextFieldBase;