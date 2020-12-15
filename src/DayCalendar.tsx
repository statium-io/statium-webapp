import * as React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import styled from 'styled-components';

import { client } from './utils/football-data-api-client';
import { AsyncLoadingState, useAsync } from './utils/hooks';

const MainContent = styled.div`
  margin: 0 auto;
  padding: 0 1rem;
  max-width: min(100ch, 100%);
`;

const StyledTable = styled.table`
  border-radius: 0.5rem;
  border: thin solid #eee;
  width: 100%;
`;

const StyledTableHeader = styled.thead`
  margin: 2rem;

  & > tr {
    & > th {
      padding: 1rem;
      text-align: left;
      border-bottom: thin solid #eee;
    }
  }
`;

const StyledTableBody = styled.tbody`
  margin: 2rem;

  & > tr {
    & > td {
      padding: 1rem;
      text-align: left;
      border-bottom: thin solid #eee;
    }
  }
`;

type Games = {
  count: number;
  filters: Filters;
  matches: Array<Game>;
};

type Filters = {
  dateFrom: Date;
  dateTo: Date;
};

type Game = {
  competition: Competition;
  utcDate: string;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  status: string;
  score: {
    fullTime: {
      homeTeam: number;
      awayTeam: number;
    };
  };
};

type Competition = {
  id: number;
  area: {
    code: string;
  };
  name: string;
};

const DayCalendar: React.FunctionComponent = () => {
  const initialState: Partial<AsyncLoadingState<Games>> = {};
  const { data, error, isError, isLoading, isSuccess, run } = useAsync(initialState);

  React.useEffect(() => {
    run(client('matches'));
  }, [run]);

  return (
    <MainContent>
      {isLoading ? <div>Loading...</div> : null}

      {isError ? (
        <div>
          <p>There was an error:</p>
          <pre>{error?.message}</pre>
        </div>
      ) : null}

      {isSuccess && data !== null ? (
        <>
          <h1>
            <FormattedDate
              day="numeric"
              month="long"
              value={data?.filters.dateFrom}
              year="numeric"
            />
          </h1>
          <StyledTable>
            <StyledTableHeader>
              <tr>
                <th>Competition</th>
                <th>Time</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </StyledTableHeader>
            <StyledTableBody>
              {data.matches
                .filter((match: { competition: { area: { code: string }; name: string } }) => {
                  if (match.competition.area.code === 'BRA') {
                    return false;
                  }

                  if (match.competition.area.code === 'PRT') {
                    return false;
                  }

                  if (
                    match.competition.area.code === 'ENG' &&
                    match.competition.name === 'Championship'
                  ) {
                    return false;
                  }

                  return true;
                })
                .map((match) => (
                  <tr>
                    <td>
                      {match.competition.name} ({match.competition.area.code})
                    </td>
                    <td>
                      <FormattedTime value={match.utcDate} />
                    </td>
                    <td>{match.homeTeam.name}</td>
                    <td>{match.awayTeam.name}</td>
                    <td>{match.status}</td>
                    <td>
                      {match.score.fullTime.homeTeam} - {match.score.fullTime.awayTeam}
                    </td>
                  </tr>
                ))}
            </StyledTableBody>
          </StyledTable>
          <pre></pre>
        </>
      ) : null}
    </MainContent>
  );
};

export { DayCalendar };
