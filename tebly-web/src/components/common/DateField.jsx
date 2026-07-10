import { useState, useRef } from 'react';
import styled from 'styled-components';
import { FieldWrapper } from './TextfieldBase';

// 내부 프레임 (YYYY/MM/DD)
const DateInner = styled.div`
  display: flex;
  padding: 0 32px;
  align-items: center;
  gap: 32px;
  flex: 1 0 0;
  justify-content: center;
`;

// YMD 입력 필드
const DateInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  text-align: center;

  ${(props) => props.theme.typography.body3}
  color: ${(props) => props.$hasValue
    ? props.theme.colors.gray800
    : props.theme.colors.gray500};  // 입력 유무에 따라 색상 변경

  &::placeholder {
    color: ${(props) => props.theme.colors.gray500};  
  }

  width: ${(props) => props.$type === 'year' ? '40px' : '24px'};
`;

const Slash = styled.span`
  ${(props) => props.theme.typography.body3}
  color: ${(props) => props.$active
    ? props.theme.colors.gray800
    : props.theme.colors.gray500};  // 앞의 입력이 완료되었는지에 따라 색상 변경
`;

export default function DateField() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [focused, setFocused] = useState(false);

  const monthRef = useRef(null);  // 월 입력 필드에 대한 참조
  const dayRef = useRef(null);  // 일 입력 필드에 대한 참조

  // 입력값이 한자리 수 일 때 앞에 0을 붙여줌
  const padZero = (value, length) => value.padStart(length, '0');

  return (
    <FieldWrapper $focused={focused}>
      <DateInner>
        <DateInput
          $type="year"
          placeholder="YYYY"
          maxLength={4}
          value={year}
          $hasValue={year.length > 0}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setYear(val);
            if (val.length === 4) {
              monthRef.current.focus();
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
          }}  
        />  
        <Slash $active={year.length === 4}>/</Slash>
        
        <DateInput
          ref={monthRef}
          $type="month"
          placeholder="MM"
          maxLength={2}
          value={month}
          $hasValue={month.length > 0}
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, '');
            // 1~12월만 입력 가능하도록 처리
            if (val.length === 2 && parseInt(val, 10) > 12) val = '12';
            if (val === '00') val = '01';
            setMonth(val);
            if (val.length === 2) dayRef.current.focus();
          }}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            const currentVal = e.target.value; 
            if (currentVal === '0' || currentVal === '00') {
              setMonth('01');
            } else if (currentVal.length > 0 && currentVal.length < 2) {
              setMonth(padZero(currentVal, 2)); // 1~9일 때만 01~09로 변환
            }
          }} 
        />
        <Slash $active={month.length === 2}>/</Slash>
        
        <DateInput
          ref={dayRef}
          $type="day"
          placeholder="DD"
          maxLength={2}
          value={day}
          $hasValue={day.length > 0}
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, '');

            const currentYear = year.length === 4 ? parseInt(year, 10) : new Date().getFullYear();
            const currentMonth = month.length > 0 ? parseInt(month, 10) : 1;
            // 각 달의 마지막 날짜까지만 입력 가능하도록 처리
            const maxDay = new Date(currentYear, currentMonth, 0).getDate();

            // 각 달의 마지막 날짜를 넘어가게 입력하면 마지막 날짜로 변경
            if (val.length === 2 && parseInt(val, 10) > maxDay) {
              val = maxDay.toString();
            }
            if (val === '00') val = '01'; // 00 입력시 01로 변경
            setDay(val);
          }}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            const currentVal = e.target.value; 
            
            // 0 혹은 00 입력 시 01로 변경
            if (currentVal === '0' || currentVal === '00') {
              setDay('01');
            } else if (currentVal.length > 0 && currentVal.length < 2) {
              setDay(padZero(currentVal, 2)); // 1~9 입력시에만 01~09로 변환
            }
          }}
        />
      </DateInner>
    </FieldWrapper>
  );
}