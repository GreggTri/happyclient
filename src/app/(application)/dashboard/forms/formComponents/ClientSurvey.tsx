"use client";

import React, { useState } from "react";
import { submitSurveyResponse } from "../[domain]/formActions";

interface Field {
  id: string;
  fieldQuestion: string;
  fieldInputType: string;
  options: string[];
  position: number;
}

interface Survey {
  id: string;
  surveyTitle: string;
  surveyDescription: string | null;
  isPublished: boolean;
  fields: Field[];
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
}

function ClientSurvey({ survey }: { survey: Survey }) {
  const [responses, setResponses] = useState<{ [key: string]: any }>({});

  const handleChange = (fieldId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitSurveyResponse(survey.id, responses);
    alert("Thank you for your response!");
  };

  return (
    <div
      className="p-4 min-h-screen flex items-center justify-center"
      style={{ backgroundColor: survey.backgroundColor, color: survey.textColor }}
    >
      <form
        className="max-w-lg w-full"
        onSubmit={handleSubmit}
        style={{ color: survey.textColor }}
      >
        <h1 className="text-3xl font-bold mb-4">{survey.surveyTitle}</h1>
        {survey.fields.map((field, index) => (
          <div key={field.id} className="mb-4">
            <label className="block font-bold mb-1">{field.fieldQuestion}</label>
            {field.fieldInputType === "text" && (
              <input
                type="text"
                className="w-full p-2 border"
                style={{ borderColor: survey.primaryColor }}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.fieldInputType === "radio" &&
              field.options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    style={{ accentColor: survey.primaryColor }}
                  />
                  <label className="ml-2">{option}</label>
                </div>
              ))}
            {field.fieldInputType === "checkbox" &&
              field.options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    name={field.id}
                    value={option}
                    onChange={(e) => {
                      const prevValues = responses[field.id] || [];
                      if (e.target.checked) {
                        handleChange(field.id, [...prevValues, option]);
                      } else {
                        handleChange(
                          field.id,
                          prevValues.filter((val: string) => val !== option)
                        );
                      }
                    }}
                    style={{ accentColor: survey.primaryColor }}
                  />
                  <label className="ml-2">{option}</label>
                </div>
              ))}
            {field.fieldInputType === "select" && (
              <select
                className="w-full p-2 border"
                style={{ borderColor: survey.primaryColor }}
                onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {field.fieldInputType === "date" && (
              <input
                type="date"
                className="w-full p-2 border"
                style={{ borderColor: survey.primaryColor }}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="mt-4 px-4 py-2 rounded"
          style={{
            backgroundColor: survey.primaryColor,
            color: survey.textColor,
            borderColor: survey.primaryColor,
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ClientSurvey;
