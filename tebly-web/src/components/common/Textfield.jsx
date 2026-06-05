import { useState } from 'react';
import { FieldWrapper, FieldInput } from './TextfieldBase';

const TextFieldBase = ({ value, onChange, placeholder, width }) => {
  const [focused, setFocused] = useState(false);

  return (
    <FieldWrapper $focused={focused} $width={width}>
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