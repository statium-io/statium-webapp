import * as React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import { client } from 'utils/football-data-api-client';
import { AsyncLoadingState, useAsync } from 'utils/hooks';

import { StyledTable, StyledTableBody, StyledTableHeader } from './_styled';
import { Games } from './types';

const DayCalendar: React.FunctionComponent = () => {
  const initialState: Partial<AsyncLoadingState<Games>> = {};
  const { data, error, isError, isLoading, isSuccess, run } = useAsync(initialState);

  React.useEffect(() => {
    run(client('matches'));
  }, [run]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        <p>There was an error:</p>
        <pre>{error?.message}</pre>
      </div>
    );
  }

  if (isSuccess && data !== null) {
    return (
      <>
        <header className="bg-gray-800 text-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight">
              <FormattedDate
                day="numeric"
                month="long"
                value={data?.filters.dateFrom}
                year="numeric"
              />
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg">
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
                      .filter(
                        (match: { competition: { area: { code: string }; name: string } }) => {
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
                        }
                      )
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
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return null;
};

export { DayCalendar };
