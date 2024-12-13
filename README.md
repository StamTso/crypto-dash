# Crypto Dash
The project was scaffolded using Vite with React-TS flavor. It uses Vitest and React Testing-Library for unit testing.


## Run locally

### Install Dependencies
>npm install

### Start the dev server
>npm run dev

### Start a test run
>npm run test

## What was implemented
- Dashboard with 2 columns, displaying Watched and Unwatched crypto coins.
- Drag and Drop between columns and within the same column, with tracking of order during the drag's end.
- Price chart under each coin in Watched column displaying price updates since the coin dropped to Watched for the first time.
  Refresh rate of price data is set to 60 seconds, based on the specs of the api used (`api.coingecko.com/api/v3`).
- Handling of errors during fetch and drag and drop operations. A coin is automatically placed back to the Unwatched list if a fetch
  error occurs during drag end.
- Toast error notifications to display error messages.
- Simple but fairly responsive styling (occasional wrapping might occur in very small screens and it is subject to improvements).
- Unit testing for the main components and features.


## What needs to be improved
- Styling and responsiveness in some scenarios
- Extracting some logic out of some components (e.g. updatePriceHistory function can be moved outside of CryptoContext to reduce size of files and readability)
- The logic for moving a component back to "Unwatched" column when fetch fails during DnD ops, can be expanded to handle errors during subsequent fetch operations for coins already in the "Watched" column.
- Extend static typing, with typing endpoint responses

