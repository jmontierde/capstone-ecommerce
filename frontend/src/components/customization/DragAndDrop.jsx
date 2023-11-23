import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const DragAndDrop = () => {
  const [lists, setLists] = useState({
    list1: [
      { id: 1, item: "Item 1 from List 1" },
      { id: 2, item: "Item 2 from List 1" },
      { id: 3, item: "Item 3 from List 1" },
    ],
    list2: [
      { id: 4, item: "Item 1 from List 2" },
      { id: 5, item: "Item 2 from List 2" },
      { id: 6, item: "Item 3 from List 2" },
    ],
    list3: [
      { id: 7, item: "Item 1 from List 3" },
      { id: 8, item: "Item 2 from List 3" },
      { id: 9, item: "Item 3 from List 3" },
    ],
  });

  const [combinedItems, setCombinedItems] = useState([]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceListId = result.source.droppableId;
    const draggedItem = lists[sourceListId][result.source.index];
    const updatedLists = { ...lists };
    updatedLists[sourceListId].splice(result.source.index, 1);
    setLists(updatedLists);
    setCombinedItems([...combinedItems, draggedItem]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container">
        <div className="lists">
          {Object.keys(lists).map((listId) => (
            <Droppable droppableId={listId} key={listId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="list"
                >
                  {lists[listId].map((item) => (
                    <Draggable
                      draggableId={item.id} // Use the 'id' prop as the draggableId
                      index={item.id}
                      key={item.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="list-item"
                        >
                          {item.item}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
        <Droppable droppableId="table">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="table"
            >
              {combinedItems.map((item) => (
                <div key={item.id} className="item">
                  {item.item}
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default DragAndDrop;
