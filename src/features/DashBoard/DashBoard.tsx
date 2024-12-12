import { useCryptoContext } from '../../hooks/useCryptoContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import BoardColumn from './BoardColumn';
import BoardItem from './BoardItem';
import { DroppableId } from './types';
import { WATCHED_COLUMN_ID, UNWATCHED_COLUMN_ID } from '../../constants/dashBoardConstants';

const DashBoard = () => {
  const { unwatchedCoins, watchedCoins, moveCoin, loadingCoinsList, priceHistory, loadingChartDataCoins } = useCryptoContext();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    moveCoin(
      result.draggableId,
      source.droppableId as DroppableId,
      destination.droppableId as DroppableId,
      source.index,
      destination.index
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-row w-full min-h-screen h-max bg-gray-100 p-4 gap-4">
        <Droppable droppableId={UNWATCHED_COLUMN_ID}>
          {(provided) => (
            <BoardColumn
              title="Unwatched"
              width="w-1/4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {loadingCoinsList
                ? <p>Fetching Coins...</p>
                : unwatchedCoins.map((coin, index) => (
                  <Draggable key={coin.id} draggableId={coin.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <BoardItem
                          name={`${coin.name} (${coin.symbol.toUpperCase()})`}
                          imageUrl={coin.image}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </BoardColumn>
          )}
        </Droppable>

        <Droppable droppableId={WATCHED_COLUMN_ID}>
          {(provided) => (
            <BoardColumn
              title="Watched"
              width="w-3/4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {watchedCoins.map((coin, index) => (
                <Draggable key={coin.id} draggableId={coin.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <BoardItem
                        name={`${coin.name} (${coin.symbol.toUpperCase()})`}
                        imageUrl={coin.image}
                        priceHistory={priceHistory[coin.id] || []}                      
                        isLoading={loadingChartDataCoins.has(coin.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </BoardColumn>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default DashBoard;