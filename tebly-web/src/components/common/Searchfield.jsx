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

export default function SearchField({ placeholder = '검색', value = '', onChange = () => {} }) {
  const [focused, setFocused] = useState(false);

  return (
    <FieldWrapper $focused={focused}>
      <SearchIcon />
      <FieldInput
        value={value}               // ← 밖에서 받은 값 사용
        placeholder={placeholder}
        $hasValue={value.length > 0}
        onChange={onChange}         // ← 밖에서 받은 함수 사용
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </FieldWrapper>
  );
}