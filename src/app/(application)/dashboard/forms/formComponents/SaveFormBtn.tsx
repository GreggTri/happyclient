"use client";

import React, { useTransition } from "react";
import { saveSurvey } from "../actions";


interface Field {
  fieldQuestion: string;
  fieldInputType: string;
  options: string[];
  position: number;
}

interface Survey {
  id?: string;
  surveyTitle: string;
  surveyDescription: string | null;
  isPublished: boolean;
  fields: Field[];
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
}

interface SaveFormBtnProps {
  survey?: Survey;
  surveyTitle: string;
  surveyFields: Field[];
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
}

function SaveFormBtn({
  survey,
  surveyTitle,
  surveyFields,
  backgroundColor,
  textColor,
  primaryColor,
}: SaveFormBtnProps) {
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await saveSurvey({
        id: survey?.id,
        surveyTitle,
        fields: surveyFields,
        backgroundColor,
        textColor,
        primaryColor,
      });
      alert("Survey saved successfully!");
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className="bg-blue-500 text-white px-2 rounded-md text-sm"
    >
      {isPending ? "Saving..." : "Save"}
    </button>
  );
}

export default SaveFormBtn;
