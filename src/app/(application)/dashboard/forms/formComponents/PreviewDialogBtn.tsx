"use client";

import React, { useState } from "react";
import Modal from "./Modal";

interface Field {
  fieldQuestion: string;
  fieldInputType: string;
  options: string[];
  position: number;
}

interface PreviewDialogBtnProps {
  surveyFields: Field[];
  surveyTitle: string;
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
}

function PreviewDialogBtn({
  surveyFields,
  surveyTitle,
  backgroundColor,
  textColor,
  primaryColor,
}: PreviewDialogBtnProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-BLACK px-2 rounded-md text-sm"
      >
        Preview
      </button>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <div
            className="p-4"
            style={{ backgroundColor: backgroundColor, color: textColor }}
          >
            <h2 className="text-xl font-bold mb-4">{surveyTitle}</h2>
            {surveyFields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block font-bold mb-1">{field.fieldQuestion}</label>
                {field.fieldInputType === "text" && (
                  <input
                    type="text"
                    className="w-full p-2 border"
                    style={{ borderColor: primaryColor }}
                  />
                )}
                {field.fieldInputType === "radio" &&
                  field.options.map((option, idx) => (
                    <div key={idx}>
                      <input type="radio" name={`field-${index}`} />
                      <label className="ml-2">{option}</label>
                    </div>
                  ))}
                {field.fieldInputType === "checkbox" &&
                  field.options.map((option, idx) => (
                    <div key={idx}>
                      <input type="checkbox" name={`field-${index}`} />
                      <label className="ml-2">{option}</label>
                    </div>
                  ))}
                {field.fieldInputType === "select" && (
                  <select
                    className="w-full p-2 border"
                    style={{ borderColor: primaryColor }}
                  >
                    {field.options.map((option, idx) => (
                      <option key={idx}>{option}</option>
                    ))}
                  </select>
                )}
                {field.fieldInputType === "date" && (
                  <input
                    type="date"
                    className="w-full p-2 border"
                    style={{ borderColor: primaryColor }}
                  />
                )}
              </div>
            ))}
            <button
              className="mt-4 px-4 py-2 rounded"
              style={{ backgroundColor: primaryColor, color: textColor }}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default PreviewDialogBtn;

