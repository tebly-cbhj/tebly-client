import { useState } from 'react';
import styled from 'styled-components';
import { FieldWrapper, FieldInput } from './TextFieldBase';
import SearchIconSvg from '../../assets/icons/search.svg?react'; // SVG 컬러 변경용

const SearchIcon = styled(SearchIconSvg)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${(props) => props.theme.colors.gray800};
`;

export default function SearchField({ placeholder = '검색' }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <FieldWrapper $focused={focused}>
      <SearchIcon />
      <FieldInput
        value={value}
        placeholder={placeholder}
        $hasValue={value.length > 0}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </FieldWrapper>
  );
}