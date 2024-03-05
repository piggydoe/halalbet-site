import React, { useState } from "react";

export default function Cell({ details, updateFlag, revealCell }: any) {

  return (
    <div onContextMenu={(e) => updateFlag(e, details.x, details.y)} onClick={() => revealCell(details.x, details.y)} className={`m-1.5 border rounded w-[80px] h-[80px] flex justify-center items-center text-black stripe-bg ${details.revealed && details.value === "X" ? "bg-red-500" : details.revealed && details.value !== "X" ? "bg-green-500" : "bg-gray-400"}`}>
      {!details.revealed ? null : details.value === "X" ? <img src="https://i.imgur.com/YFnuXfa.png" className="w-[60px] h-[60px]" /> : <img src="https://static.wikia.nocookie.net/play-rust/images/a/a1/High_Quality_Metal_icon.png" className="w-[60px] h-[60px]" />}
    </div>
  );
}