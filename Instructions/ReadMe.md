# Pepper Logic React Project: Kanban Board for Cryptocurrencies

This assignment involves creating a simple Kanban board using React to help users manage and monitor a list of cryptocurrencies. The board will include two columns: an **"Unwatched" list** and a **"Watched" list**, enabling users to drag and drop coins between them. When a coin is added to the Watched list, a live chart showcasing real-time price data should appear below it. The application must also handle errors effectively.
## Project Requirements
1.	**Board Columns**
    - **Unwatched Coins**: Displays a list of all available cryptocurrencies.
    - **Watched Coins**: A section where users can drag coins they wish to monitor.
2.	**Drag-and-Drop Functionality**
    - Users must be able to drag coins from the Unwatched list to the Watched list.
     - If any issue arises during this operation (e.g., a data-fetching error), the app should notify the user and return the coin to the Unwatched list.
3.	**Live Price Charts**
    - For each cryptocurrency in the Watched list, a live price chart should appear, updating regularly with real-time data.
4.	**Error Management**
    - Handle potential errors during drag-and-drop operations (e.g., network issues).
    - Display appropriate error messages and revert the affected coin to the Unwatched list if necessary.
5.	**Styling**
    - Keep the design simple and functional, prioritizing usability and problem-solving over aesthetics.

## Technical Guidelines
- Utilize any drag-and-drop library of your choice.
- Use any charting library to create the live price graphs.
- Feel free to use pre-built components from a library or design your own.
- Build the application using React.
- Implement a state management solution (e.g., Context API, Redux).

