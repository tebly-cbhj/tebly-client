import 'styled-components/native';
import { theme } from './theme';

type Theme = typeof theme;

// theme.ts가 RN에서 적용되게 함
declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}