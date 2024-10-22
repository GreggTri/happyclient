"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableFieldProps {
  id: string;
  name: string;
}

function DraggableField({ id, name }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: {
      type: "component",
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 mb-2 bg-gray-200 rounded cursor-pointer"
    >
      {name}
    </div>
  );
}

export default DraggableField;
