import styled from 'styled-components';

// react-native-markdown-display 같은 라이브러리 없이, 이 프로젝트(웹앱)에서
// 실제로 쓰는 마크다운 문법(#/##/###, **bold**, ---, >, 표, -/N. 목록)만
// 지원하는 가벼운 렌더러. 새 의존성을 추가하지 않기 위한 선택.

const H1 = styled.h1`
  ${({ theme }) => theme.typography.h2};
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0 0 4px;
`;

const H2 = styled.h2`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.primary100};
  margin: 24px 0 8px;
`;

const H3 = styled.h3`
  ${({ theme }) => theme.typography.s2};
  color: ${({ theme }) => theme.colors.gray900};
  margin: 16px 0 6px;
`;

const Paragraph = styled.p`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0 0 12px;
  white-space: pre-line;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  margin: 16px 0;
`;

const Blockquote = styled.div`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray500};
  background: ${({ theme }) => theme.colors.primary10};
  border-left: 3px solid ${({ theme }) => theme.colors.primary50};
  padding: 10px 12px;
  margin: 0 0 12px;
  border-radius: 0 8px 8px 0;
`;

const ListRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding-left: ${({ $level }) => 4 + $level * 16}px;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray800};
  margin-bottom: 6px;
`;

const ListMarker = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary100};
`;

const TableScroll = styled.div`
  overflow-x: auto;
  margin: 0 0 16px;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 320px;
`;

const Th = styled.th`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.primary100};
  padding: 8px 10px;
  text-align: left;
  white-space: nowrap;
`;

const Td = styled.td`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.colors.gray800};
  padding: 8px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  vertical-align: top;
`;

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part ? <span key={i}>{part}</span> : null;
  });
}

function parseTableRow(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
}

function parseBlocks(md) {
  const lines = md.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i++;
      continue;
    }

    if (trimmed === '---') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join(' ') });
      continue;
    }

    if (trimmed.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parseTableRow(lines[i]));
        i++;
      }
      // 두 번째 줄은 |---|---| 구분선이라 스킵
      const header = rows[0];
      const body = rows.slice(2);
      blocks.push({ type: 'table', header, body });
      continue;
    }

    const listMatch = raw.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        if (!m) break;
        const indent = m[1].length;
        items.push({ level: Math.min(Math.floor(indent / 2), 3), marker: m[2], text: m[3] });
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,3})\s/.test(lines[i].trim()) &&
      lines[i].trim() !== '---' &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !/^(\s*)([-*]|\d+\.)\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: 'p', text: paraLines.join('\n') });
  }

  return blocks;
}

export default function MarkdownText({ content }) {
  const blocks = parseBlocks(content);

  return (
    <div>
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          if (block.level === 1) return <H1 key={i}>{renderInline(block.text)}</H1>;
          if (block.level === 2) return <H2 key={i}>{renderInline(block.text)}</H2>;
          return <H3 key={i}>{renderInline(block.text)}</H3>;
        }
        if (block.type === 'hr') return <Hr key={i} />;
        if (block.type === 'blockquote') return <Blockquote key={i}>{renderInline(block.text)}</Blockquote>;
        if (block.type === 'table') {
          return (
            <TableScroll key={i}>
              <Table>
                <thead>
                  <tr>
                    {block.header.map((cell, ci) => <Th key={ci}>{renderInline(cell)}</Th>)}
                  </tr>
                </thead>
                <tbody>
                  {block.body.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => <Td key={ci}>{renderInline(cell)}</Td>)}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableScroll>
          );
        }
        if (block.type === 'list') {
          return (
            <div key={i}>
              {block.items.map((item, ii) => (
                <ListRow key={ii} $level={item.level}>
                  <ListMarker>{/^\d+\.$/.test(item.marker) ? item.marker : '•'}</ListMarker>
                  <span>{renderInline(item.text)}</span>
                </ListRow>
              ))}
            </div>
          );
        }
        return <Paragraph key={i}>{renderInline(block.text)}</Paragraph>;
      })}
    </div>
  );
}
