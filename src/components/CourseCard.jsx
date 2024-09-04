
"use client";

import { ArrowRightAltOutlined } from "@mui/icons-material";
import { Card } from "flowbite-react";

export function CourseCard() {
  return (
    <Card className="w-1/4">
      <p className="text-2xl font-bold  text-gray-900  ">
        {'classname'} <span>{'classcode'}</span>
      </p>
      <p className="font-normal text-gray-700  ">
  {'teacher name'}      </p>
      <button className="self-end bg-blue-600 rounded-full px-3 p-1 text-white">
      <ArrowRightAltOutlined/>

      </button>
    </Card>
  );
}
