// {
//     "purpose": "string",
//     "explanation": "string",
//     "comment": "string",
//     "id": 0,
//     "user_id": 0,
//     "movie_id": 0,
//     "movie": {
//       "name": "string",
//       "director": "string",
//       "summary": "string",
//       "cast": "string",
//       "keywords": [],
//       "id": 0,
//       "created_at": "2025-12-07T14:01:59.838Z",
//       "updated_at": "2025-12-07T14:01:59.838Z"
//     },
//     "created_at": "2025-12-07T14:01:59.838Z",
//     "updated_at": "2025-12-07T14:01:59.838Z"
//   }

import Movie from './movie';

type Ticket = {
  id: number;
  user_id: number;
  movie_id: number;
  purpose: string;
  explanation: string;
  comment: string;
  movie: Movie;
  created_at: string;
  updated_at: string;
};

export type { Ticket };
