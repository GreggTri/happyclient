"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Field {
  fieldQuestion: string;
  fieldInputType: string;
  options: string[];
  position: number;
}

interface SurveyFieldProps {
  field: Field;
  onUpdateField: (field: Field) => void;
}

function SurveyField({ field, onUpdateField }: SurveyFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.position });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField({ ...field, fieldQuestion: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    onUpdateField({ ...field, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...field.options, ""];
    onUpdateField({ ...field, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    onUpdateField({ ...field, options: newOptions });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-4 bg-white p-4 rounded shadow"
    >
      <input
        type="text"
        value={field.fieldQuestion}
        onChange={handleQuestionChange}
        className="font-bold w-full mb-2 border-b outline-none"
        placeholder="Enter question"
      />

      {field.fieldInputType === "text" && (
        <input type="text" className="w-full mt-2 p-2 border" placeholder="User input" disabled />
      )}

      {["radio", "checkbox", "select"].includes(field.fieldInputType) && (
        <div>
          {field.options.map((option, index) => (
            <div key={index} className="flex items-center mb-1">
              {field.fieldInputType === "radio" && <input type="radio" disabled />}
              {field.fieldInputType === "checkbox" && <input type="checkbox" disabled />}
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="ml-2 p-1 border-b outline-none flex-grow"
                placeholder={`Option ${index + 1}`}
              />
              <button className="ml-2 text-red-500" onClick={() => removeOption(index)}>
                &times;
              </button>
            </div>
          ))}
          <button className="mt-2 text-blue-500" onClick={addOption}>
            + Add Option
          </button>
        </div>
      )}

      {field.fieldInputType === "date" && (
        <input type="date" className="w-full mt-2 p-2 border" placeholder="Date input" disabled />
      )}
    </div>
  );
}

export default SurveyField;
