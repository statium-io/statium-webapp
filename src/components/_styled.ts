import styled from 'styled-components';

export const MainContent = styled.div`
  margin: 0 auto;
  padding: 0 1rem;
  max-width: min(100ch, 100%);
`;

export const StyledTable = styled.table`
  border-radius: 0.5rem;
  border: thin solid #eee;
  width: 100%;
`;

export const StyledTableHeader = styled.thead`
  margin: 2rem;

  & > tr {
    & > th {
      padding: 1rem;
      text-align: left;
      border-bottom: thin solid #eee;
    }
  }
`;

export const StyledTableBody = styled.tbody`
  margin: 2rem;

  & > tr {
    & > td {
      padding: 1rem;
      text-align: left;
      border-bottom: thin solid #eee;
    }
  }
`;
