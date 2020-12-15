export type Games = {
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
