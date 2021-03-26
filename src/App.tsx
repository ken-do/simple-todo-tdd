import React, { useCallback, useState } from "react";
import "./App.css";

interface AddToDoProps {
  addToDo(value: string): void;
}

export const AddToDo = ({ addToDo }: AddToDoProps) => {
  const [value, setValue] = useState("");

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.code === "Enter") {
        setValue("");
        addToDo(event.target.value);
      }
    },
    [addToDo]
  );

  return (
    <input
      placeholder="Add an item"
      onKeyDown={handleKeyDown}
      value={value}
      onChange={handleChange}
    />
  );
};

interface ToDoItemProps {
  toDo: string;
  removeToDo(value: string): void;
}

export const ToDoItem = ({ toDo, removeToDo }: ToDoItemProps) => {
  return (
    <li>
      <span>{toDo}</span>
      <button onClick={() => removeToDo(toDo)}>X</button>
    </li>
  );
};

interface ToDoListProps {
  toDos: string[];
  removeToDo(value: string): void;
}

export const ToDoList = ({ toDos, removeToDo }: ToDoListProps) => {
  return (
    <ul>
      {toDos.map((toDo) => (
        <ToDoItem key={toDo} toDo={toDo} removeToDo={removeToDo} />
      ))}
    </ul>
  );
};

const App = () => {
  const [toDos, setToDos] = useState<string[]>([]);

  const addToDo = useCallback((value: string) => {
    setToDos((currentToDos) => [...currentToDos, value]);
  }, []);

  const removeToDo = useCallback((value: string) => {
    setToDos((currentToDos) => currentToDos.filter((toDo) => toDo !== value));
  }, []);

  return (
    <div className="App">
      <div className="container">
        <AddToDo addToDo={addToDo} />
        <ToDoList toDos={toDos} removeToDo={removeToDo} />
      </div>
    </div>
  );
};

export default App;
