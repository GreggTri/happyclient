"use client";

import React, { useTransition } from "react";
import { publishSurvey } from "../actions";
import { Icons } from "@/app/components/icons";


interface PublishFormBtnProps {
  surveyId?: string;
}

function PublishFormBtn({ surveyId }: PublishFormBtnProps) {
  const [isPending, startTransition] = useTransition();

  const handlePublish = () => {
    if (!surveyId) {
      alert("Survey must be saved before publishing.");
      return;
    }

    startTransition(async () => {
      await publishSurvey(surveyId);
      alert("Survey published successfully!");
    });
  };

  return (
    <button
      onClick={handlePublish}
      disabled={isPending}
      className="bg-green-500 text-white px-2 rounded-md text-sm"
    >
      {isPending ? <Icons.spinner width={20} height={20}/> : "Publish"}
    </button>
  );
}

export default PublishFormBtn;
