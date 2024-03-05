import React, { useState } from "react";
import Layout from "../../components/Layout";

const Unboxing = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      probability: 5,
      xTranslationAmount: 0,
    },
    {
      id: 2,
      probability: 5,
      xTranslationAmount: 25,
    },
    {
      id: 3,
      probability: 9,
      xTranslationAmount: 100,
    },
    {
      id: 4,
      probability: 20,
      xTranslationAmount: 200,
    },
    {
      id: 5,
      probability: 20,
      xTranslationAmount: 300,
    },
    {
      id: 6,
      probability: 50,
      xTranslationAmount: 400,
    },
  ]);
  const [xTranslationAmount, setXTranslationAmount] = useState(0);

  const getRandomItem = () => {
    const randomNumber = Math.random() * 100;
    let totalProbability = 0;
    for (let i = 0; i < items.length; i++) {
      totalProbability += items[i].probability;
      if (randomNumber <= totalProbability) {
        return items[i];
      }
    }
    return items[items.length - 1];
  };

  const onSpin = () => {
    const randomItem = getRandomItem();
    setXTranslationAmount(xTranslationAmount + randomItem.xTranslationAmount);
    console.log("Random Item:", randomItem);
    setXTranslationAmount(xTranslationAmount);
  };

  return (
    <div className="w-full h-[calc(100vh-130px)] flex justify-center items-center flex-col">
      <div className="w-[62%] h-[10px] relative">
        <div className="w-[20%] h-[10px] absolute left-1/2 transform -translate-x-1/2 bg-[#d3ba2a]"></div>
      </div>

      <div className="w-[62%] h-[150px] relative overflow-hidden whitespace-nowrap bg-[#1E2224]">
        
        {items.map((item, index) => (
          <div
            style={{ transform: `translateX(${index * 100 - xTranslationAmount}px)` }}
            className={`inline-block h-[100%] w-[25%] transform`}
            key={index}
          >
            <div className={`stripe-bg w-[100%] h-[100%] flex flex-col justify-center items-center ${item.id % 2 === 0 ? "bg-[#d3ba2a]" : "bg-[#1e2122]"}`}>
              Item: {item.id}
            </div>
          </div>
        ))}
      </div>
      <button className="sitebutton" onClick={onSpin}>Next</button>
    </div>
  );
};

export default Unboxing;
