// {
//   "movies": [
//     {
//       "name": "string",
//       "director": "string",
//       "summary": "string",
//       "cast": "string",
//       "keywords": [],
//       "id": 0,
//       "created_at": "2025-12-06T09:42:34.824Z",
//       "updated_at": "2025-12-06T09:42:34.824Z"
//     }
//   ],
//   "keywords": [
//     "string"
//   ]
// }

type Movie = {
  id: number;
  name: string;
  director: string;
  summary: string;
  cast: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
};

export type MovieResponse = {
  movies: Movie[];
  keywords: string[];
};

export type MovieSummary = {
  name: string;
  director: string;
  summary: string;
  cast: string;
  keywords: string[];
};

export default Movie;
