import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App, { AddToDo, ToDoItem, ToDoList } from "./App";

describe("AddToDo", () => {
  const defaultProps = {
    addToDo: jest.fn(),
  };

  it("should render successfully with the default props", () => {
    const { container } = render(<AddToDo {...defaultProps} />);
    expect(container).toBeDefined();
  });

  it("should render an input field", () => {
    render(<AddToDo {...defaultProps} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it('should display "Add an item" as a placehodler', () => {
    render(<AddToDo {...defaultProps} />);
    expect(screen.getByPlaceholderText("Add an item")).toBeInTheDocument();
  });

  it("should allow typing", () => {
    render(<AddToDo {...defaultProps} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const value = "test";
    fireEvent.change(input, { target: { value } });
    expect(input.value).toBe(value);
  });

  it("should call clear the input value and call addToDo on hiting the Enter key", () => {
    render(<AddToDo {...defaultProps} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const value = "test";
    fireEvent.change(input, { target: { value } });
    fireEvent.keyDown(input, { code: "Enter" });
    expect(input.value).toBe("");
    expect(defaultProps.addToDo).toHaveBeenCalledWith(value);
  });

  it("should not call addToDo when hitting another key other than Enter", () => {
    render(<AddToDo {...defaultProps} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const value = "test";
    fireEvent.change(input, { target: { value } });
    fireEvent.keyDown(input, { code: "Alt" });
    expect(defaultProps.addToDo).not.toHaveBeenCalled();
  });
});

describe("ToDoItem", () => {
  const defaultProps = { toDo: "Do something", removeToDo: jest.fn() };
  it("should render successfully with the default props", () => {
    const { container } = render(<ToDoItem {...defaultProps} />);
    expect(container).toBeDefined();
  });

  it('should display a text passed to it as the "toDo" prop', () => {
    render(<ToDoItem {...defaultProps} />);
    expect(screen.getByText(defaultProps.toDo)).toBeInTheDocument();
  });

  it('should display a close button labeled "X"', () => {
    render(<ToDoItem {...defaultProps} />);
    const closeButton = screen.getByRole("button");
    expect(closeButton).toHaveTextContent("X");
  });

  it("should call removeToDo when clicking on the Close button", () => {
    render(<ToDoItem {...defaultProps} />);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(defaultProps.removeToDo).toHaveBeenCalledWith(defaultProps.toDo);
  });
});

describe("ToDoList", () => {
  const defaultProps = {
    toDos: ["action 1", "action 2"],
    removeToDo: jest.fn(),
  };
  it("should render successfully with the default props", () => {
    const { container } = render(<ToDoList {...defaultProps} />);
    expect(container).toBeDefined();
  });

  it("should display items in the toDos props", () => {
    render(<ToDoList {...defaultProps} />);
    expect(screen.getByText(defaultProps.toDos[0])).toBeInTheDocument();
    expect(screen.getByText(defaultProps.toDos[1])).toBeInTheDocument();
  });
});

describe("App", () => {
  it("should render successfully", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it("should display an input field", () => {
    render(<App />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should allow adding and removing todo items", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");

    const firstAction = "Action 1";
    fireEvent.change(input, { target: { value: firstAction } });
    fireEvent.keyDown(input, { code: "Enter" });
    expect(screen.queryByText(firstAction)).toBeDefined();

    const secondAction = "Action 2";
    fireEvent.change(input, { target: { value: secondAction } });
    fireEvent.keyDown(input, { code: "Enter" });
    expect(screen.queryByText(secondAction)).toBeDefined();

    const closeButtons = screen.getAllByText("X");
    expect(closeButtons).toHaveLength(2);

    const firstCloseButton = closeButtons[0];
    fireEvent.click(firstCloseButton);
    expect(screen.queryByText(firstAction)).toBeNull();

    const secondCloseButton = closeButtons[1];
    fireEvent.click(secondCloseButton);
    expect(screen.queryByText(secondAction)).toBeNull();
  });
});
