import React, { useState, useEffect, useRef } from "react";
import createBoard from "./createBoard";
import Cell from "./Cell";
import { revealed } from "./reveal";
import app, { auth } from "../../firebase/firebase";
import { doc, setDoc, getDoc, updateDoc, getFirestore } from "firebase/firestore";

const Board = () => {
  const db = getFirestore(app);
  const [grid, setGrid] = useState<{ value: number; revealed: boolean; x: number; y: number; flagged: boolean; }[][]>([]);
  const [nonMineCount, setNonMineCount] = useState(0);
  const [mineLocations, setMineLocations] = useState<number[][]>([]);
  const [numOfMines, setNumOfMines] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [userBet, setUserBet] = useState(0);
  const [gameInSession, setGameInSession] = useState(false);
  const [userBalance, setUserBalance] = useState(0)
  const [userActuallyPlayed, setUserActuallyPlayed] = useState(false);
  const [tilesClicked, setTilesClicked] = useState(0);
  const [boardHasBeenCreated, setBoardHasBeenCreated] = useState(false);

  const audioRef = useRef();

  const playGoodTile = () => {
    if (!gameOver && gameInSession && userActuallyPlayed && audioRef.current) {
        audioRef.current.play();
    }
  }
  
  useEffect(() => {
    getUserBalance();
  }, [gameOver, gameInSession]);

  function getUserBalance() {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) {
      console.error("User email is null or undefined.");
      return;
    }
  
    getDoc(doc(db, "users", userEmail)).then((snapshot) => {
      const balanceSnap = snapshot.data();
      const result = balanceSnap?.balance;
      setUserBalance(result);
    });
  }

  const updateBalance = async (balanceToUpdate: number, email: string) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", email);
      await updateDoc(userDocRef, { balance: balanceToUpdate });
    } else {
      console.error("User is not logged in.");
    }
  };

  const freshBoard = async () => {
    setBoardHasBeenCreated(true);
    await getUserBalance();
    if(userBet > 0 && numOfMines > 0 && numOfMines < 25){
      setGameInSession(true);
      setMultiplier(1); // Reset multiplier
      setTilesClicked(0); // Reset tiles clicked
      const newBoard = createBoard(5, 5, numOfMines);
      setNonMineCount(5 * 5 - numOfMines);
      setMineLocations(newBoard.mineLocation);
      setGrid(newBoard.board);
    } else {
      alert("Please choose a number of mines between 1 and 25.")
    }
  };

  const restartGame = async () => {
    setBoardHasBeenCreated(true)
    await getUserBalance();
    if(userBet > 0 && numOfMines > 0 && numOfMines < 25 && userBet <= userBalance){
       setUserBalance((prevBalance) => {
        let newBalance = prevBalance;
        newBalance -= userBet;
        updateBalance(newBalance, auth.currentUser?.email); // Update balance here
        return newBalance;
      });
       setGameInSession(true);
       freshBoard();
       setGameOver(false);
    } else {
      alert("Please choose a number of mines between 1 and 25 and enter an amount less than your balance.")
    }
  };

  const updateFlag = (e: any, x: number, y: number) => {
    e.preventDefault();
    let newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[x][y].flagged = true;
    setGrid(newGrid);
  };

  const cashOut = async () => {
    await getUserBalance();
    if (!userActuallyPlayed) {
      alert("You did not play this game. Please play it before cashing out.");
    } else {
      setUserBalance((prevBalance) => {
        let newBalance = prevBalance + userBet * multiplier;
        updateBalance(newBalance, auth.currentUser?.email); // Update balance here
        return newBalance;
      });
      setGameInSession(false);
      setUserActuallyPlayed(false);
  
      let newGrid = JSON.parse(JSON.stringify(grid));
      for (let i = 0; i < mineLocations.length; i++) {
        const [x, y] = mineLocations[i];
        newGrid[x][y].revealed = true;
      }
      setGrid(newGrid);
      setGameOver(true);
    }
  };

  const revealCell = (x : number, y : number) => {
    if (grid[x][y].revealed || gameOver) {
      return;
    }
    setUserActuallyPlayed(true);
    let newGrid = JSON.parse(JSON.stringify(grid));
    if (newGrid[x][y].value === "X") {
      for (let i = 0; i < mineLocations.length; i++) {
        newGrid[mineLocations[i][0]][mineLocations[i][1]].revealed = true;
      }
      setGrid(newGrid);
      setGameOver(true);
      setUserActuallyPlayed(false);
      setGameInSession(false);
    } else {
      newGrid[x][y].revealed = true;
      setGrid(newGrid);
      playGoodTile();
      setNonMineCount(nonMineCount - 1);
      setTilesClicked(tilesClicked + 1);
      updateMultiplier();
      if (nonMineCount - 1 === 0) {
        setGameOver(true);
        setUserActuallyPlayed(false);
        setGameInSession(false);
        setUserBalance((prevBalance) => {
          let newBalance = prevBalance;
          newBalance += userBet * multiplier;
          updateBalance(newBalance, auth.currentUser?.email); // Update balance here
          return newBalance;
        });
      }
    }
  };

  const updateMultiplier = () => {

    if (numOfMines === 1 && tilesClicked <= 24) {

      
      if(tilesClicked === 0){
        setMultiplier(1.19);
      }

      if(tilesClicked === 1){
        setMultiplier(1.5);
      }

      if(tilesClicked === 2){
        setMultiplier(1.92);
      }

      if(tilesClicked === 3){
        setMultiplier(2.45);
      }

      if(tilesClicked === 4){
        setMultiplier(3.21);
      }

      if(tilesClicked === 5){
        setMultiplier(4.1);
      }

      if(tilesClicked === 6){
        setMultiplier(6.12);
      }

      if(tilesClicked === 7){
        setMultiplier(8.26);
      }

      if(tilesClicked === 8){
        setMultiplier(10.52);
      }

      if(tilesClicked === 9){
        setMultiplier(13.01);
      }

      if(tilesClicked === 10){
        setMultiplier(15.64);
      }

      if(tilesClicked === 11){
        setMultiplier(18.41);
      }

      if(tilesClicked === 12){
        setMultiplier(21.32);
      }

      if(tilesClicked === 13){
        setMultiplier(24.46);
      }

      if(tilesClicked === 14){
        setMultiplier(27.83);
      }

      if(tilesClicked === 15){
        setMultiplier(31.36);
      }

      if(tilesClicked === 16){
        setMultiplier(34.15);
      }

      if(tilesClicked === 17){
        setMultiplier(37.12);
      }

      if(tilesClicked === 18){
        setMultiplier(40.29);
      }

      if(tilesClicked === 19){
        setMultiplier(43.64);
      }
      
    }

    if (numOfMines === 2 && tilesClicked <= 23) {

      
      if(tilesClicked === 0){
        setMultiplier(1.19);
      }

      if(tilesClicked === 1){
        setMultiplier(1.5);
      }

      if(tilesClicked === 2){
        setMultiplier(1.92);
      }

      if(tilesClicked === 3){
        setMultiplier(2.45);
      }

      if(tilesClicked === 4){
        setMultiplier(3.21);
      }

      if(tilesClicked === 5){
        setMultiplier(4.1);
      }

      if(tilesClicked === 6){
        setMultiplier(6.12);
      }

      if(tilesClicked === 7){
        setMultiplier(8.26);
      }

      if(tilesClicked === 8){
        setMultiplier(10.52);
      }

      if(tilesClicked === 9){
        setMultiplier(13.01);
      }

      if(tilesClicked === 10){
        setMultiplier(15.64);
      }

      if(tilesClicked === 11){
        setMultiplier(18.41);
      }

      if(tilesClicked === 12){
        setMultiplier(21.32);
      }

      if(tilesClicked === 13){
        setMultiplier(24.46);
      }

      if(tilesClicked === 14){
        setMultiplier(27.83);
      }

      if(tilesClicked === 15){
        setMultiplier(31.36);
      }

      if(tilesClicked === 16){
        setMultiplier(34.15);
      }

      if(tilesClicked === 17){
        setMultiplier(37.12);
      }

      if(tilesClicked === 18){
        setMultiplier(40.29);
      }

      if(tilesClicked === 19){
        setMultiplier(43.64);
      }
      
    }
    if (numOfMines === 3 && tilesClicked <= 22) {

      
      if(tilesClicked === 0){
        setMultiplier(1.19);
      }

      if(tilesClicked === 1){
        setMultiplier(1.5);
      }

      if(tilesClicked === 2){
        setMultiplier(1.92);
      }

      if(tilesClicked === 3){
        setMultiplier(2.45);
      }

      if(tilesClicked === 4){
        setMultiplier(3.21);
      }

      if(tilesClicked === 5){
        setMultiplier(4.1);
      }

      if(tilesClicked === 6){
        setMultiplier(6.12);
      }

      if(tilesClicked === 7){
        setMultiplier(8.26);
      }

      if(tilesClicked === 8){
        setMultiplier(10.52);
      }

      if(tilesClicked === 9){
        setMultiplier(13.01);
      }

      if(tilesClicked === 10){
        setMultiplier(15.64);
      }

      if(tilesClicked === 11){
        setMultiplier(18.41);
      }

      if(tilesClicked === 12){
        setMultiplier(21.32);
      }

      if(tilesClicked === 13){
        setMultiplier(24.46);
      }

      if(tilesClicked === 14){
        setMultiplier(27.83);
      }

      if(tilesClicked === 15){
        setMultiplier(31.36);
      }

      if(tilesClicked === 16){
        setMultiplier(34.15);
      }

      if(tilesClicked === 17){
        setMultiplier(37.12);
      }

      if(tilesClicked === 18){
        setMultiplier(40.29);
      }

      if(tilesClicked === 19){
        setMultiplier(43.64);
      }
      
    }

    if (numOfMines === 4 && tilesClicked <= 21) {

      
      if(tilesClicked === 0){
        setMultiplier(1.19);
      }

      if(tilesClicked === 1){
        setMultiplier(1.5);
      }

      if(tilesClicked === 2){
        setMultiplier(1.92);
      }

      if(tilesClicked === 3){
        setMultiplier(2.45);
      }

      if(tilesClicked === 4){
        setMultiplier(3.21);
      }

      if(tilesClicked === 5){
        setMultiplier(4.1);
      }

      if(tilesClicked === 6){
        setMultiplier(6.12);
      }

      if(tilesClicked === 7){
        setMultiplier(8.26);
      }

      if(tilesClicked === 8){
        setMultiplier(10.52);
      }

      if(tilesClicked === 9){
        setMultiplier(13.01);
      }

      if(tilesClicked === 10){
        setMultiplier(15.64);
      }

      if(tilesClicked === 11){
        setMultiplier(18.41);
      }

      if(tilesClicked === 12){
        setMultiplier(21.32);
      }

      if(tilesClicked === 13){
        setMultiplier(24.46);
      }

      if(tilesClicked === 14){
        setMultiplier(27.83);
      }

      if(tilesClicked === 15){
        setMultiplier(31.36);
      }

      if(tilesClicked === 16){
        setMultiplier(34.15);
      }

      if(tilesClicked === 17){
        setMultiplier(37.12);
      }

      if(tilesClicked === 18){
        setMultiplier(40.29);
      }

      if(tilesClicked === 19){
        setMultiplier(43.64);
      }
      
    }

    if (numOfMines === 5 && tilesClicked <= 20) {

      
      if(tilesClicked === 0){
        setMultiplier(1.19);
      }

      if(tilesClicked === 1){
        setMultiplier(1.5);
      }

      if(tilesClicked === 2){
        setMultiplier(1.92);
      }

      if(tilesClicked === 3){
        setMultiplier(2.45);
      }

      if(tilesClicked === 4){
        setMultiplier(3.21);
      }

      if(tilesClicked === 5){
        setMultiplier(4.1);
      }

      if(tilesClicked === 6){
        setMultiplier(6.12);
      }

      if(tilesClicked === 7){
        setMultiplier(8.26);
      }

      if(tilesClicked === 8){
        setMultiplier(10.52);
      }

      if(tilesClicked === 9){
        setMultiplier(13.01);
      }

      if(tilesClicked === 10){
        setMultiplier(15.64);
      }

      if(tilesClicked === 11){
        setMultiplier(18.41);
      }

      if(tilesClicked === 12){
        setMultiplier(21.32);
      }

      if(tilesClicked === 13){
        setMultiplier(24.46);
      }

      if(tilesClicked === 14){
        setMultiplier(27.83);
      }

      if(tilesClicked === 15){
        setMultiplier(31.36);
      }

      if(tilesClicked === 16){
        setMultiplier(34.15);
      }

      if(tilesClicked === 17){
        setMultiplier(37.12);
      }

      if(tilesClicked === 18){
        setMultiplier(40.29);
      }

      if(tilesClicked === 19){
        setMultiplier(43.64);
      }
      
    }
    if (numOfMines === 6 && tilesClicked <= 20) {

      if(tilesClicked === 0){
        setMultiplier(1.30);
      }

      if(tilesClicked === 1){
        setMultiplier(1.5);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(5.4);
      }

      if(tilesClicked === 6){
        setMultiplier(6.72);
      }

      if(tilesClicked === 7){
        setMultiplier(10.26);
      }

      if(tilesClicked === 8){
        setMultiplier(15.52);
      }

      if(tilesClicked === 9){
        setMultiplier(22.01);
      }

      if(tilesClicked === 10){
        setMultiplier(27.64);
      }

      if(tilesClicked === 11){
        setMultiplier(34.41);
      }

      if(tilesClicked === 12){
        setMultiplier(40.32);
      }

      if(tilesClicked === 13){
        setMultiplier(46.46);
      }

      if(tilesClicked === 14){
        setMultiplier(52.83);
      }

      if(tilesClicked === 15){
        setMultiplier(59.36);
      }

      if(tilesClicked === 16){
        setMultiplier(65.15);
      }

      if(tilesClicked === 17){
        setMultiplier(71.12);
      }

      if(tilesClicked === 18){
        setMultiplier(77.29);
      }

      if(tilesClicked === 19){
        setMultiplier(83.64);
      }
    }
    if (numOfMines === 7 && tilesClicked <= 18) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(29.01);
      }

      if(tilesClicked === 10){
        setMultiplier(37.64);
      }

      if(tilesClicked === 11){
        setMultiplier(50.41);
      }

      if(tilesClicked === 12){
        setMultiplier(70.32);
      }

      if(tilesClicked === 13){
        setMultiplier(80.46);
      }

      if(tilesClicked === 14){
        setMultiplier(150.83);
      }

      if(tilesClicked === 15){
        setMultiplier(240.36);
      }

      if(tilesClicked === 16){
        setMultiplier(300.15);
      }

      if(tilesClicked === 17){
        setMultiplier(400.15);
      }
    }
    if (numOfMines === 8 && tilesClicked <= 17) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(400.36);
      }

      if(tilesClicked === 16){
        setMultiplier(512.15);
      }
    }

    if (numOfMines === 9 && tilesClicked <= 16) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }

    if (numOfMines === 10 && tilesClicked <= 15) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 11 && tilesClicked <= 14) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 12 && tilesClicked <= 14) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 13 && tilesClicked <= 13) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 14 && tilesClicked <= 12) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 15 && tilesClicked <= 11) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 16 && tilesClicked <= 11) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 17 && tilesClicked <= 10) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 18 && tilesClicked <= 9) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 19 && tilesClicked <= 8) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 20 && tilesClicked <= 7) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 21 && tilesClicked <= 6) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 22 && tilesClicked <= 5) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 23 && tilesClicked <= 4) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
    if (numOfMines === 24 && tilesClicked <= 3) {

      if(tilesClicked === 0){
        setMultiplier(1.37);
      }

      if(tilesClicked === 1){
        setMultiplier(1.74);
      }

      if(tilesClicked === 2){
        setMultiplier(2.35);
      }

      if(tilesClicked === 3){
        setMultiplier(3.21);
      }

      if(tilesClicked === 4){
        setMultiplier(4.3);
      }

      if(tilesClicked === 5){
        setMultiplier(6.42);
      }

      if(tilesClicked === 6){
        setMultiplier(8.72);
      }

      if(tilesClicked === 7){
        setMultiplier(13.26);
      }

      if(tilesClicked === 8){
        setMultiplier(20.52);
      }

      if(tilesClicked === 9){
        setMultiplier(40.01);
      }

      if(tilesClicked === 10){
        setMultiplier(70.64);
      }

      if(tilesClicked === 11){
        setMultiplier(100.41);
      }

      if(tilesClicked === 12){
        setMultiplier(150.32);
      }

      if(tilesClicked === 13){
        setMultiplier(215.46);
      }

      if(tilesClicked === 14){
        setMultiplier(322.83);
      }

      if(tilesClicked === 15){
        setMultiplier(512.15);
      }
    }
  };

  return (
    <div className={`p-6 ${gameInSession ? "flex" : "flex justify-start"}`}>
      <audio src={'../../assets/mine_good_tile.wav'}>
        <source src={'../../assets/mine_good_tile.wav'} type="audio/wav" />
      </audio>
      <div className={`w-[90%] bg-[#0e1011] rounded-lg ${boardHasBeenCreated ? "" : "h-[500px]"}`}>
  
        <div className="board flex justify-center flex-col items-center w-full h-full ">
          {grid.map((singleRow, index1) => {
            return (
              <div style={{ display: "flex" }} key={index1}>
                {singleRow.map((singleBlock, index2) => {
                  return (
                    <Cell
                      revealCell={revealCell}
                      details={singleBlock}
                      updateFlag={updateFlag}
                      key={index2}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-2">
        <div className="bg-[#1E2224] w-full p-2 rounded-lg">
          <p className="text-center text-2xl font-bold">Mines: {numOfMines} | Your bet: {userBet} | Multiplier: {multiplier} | Balance: {userBalance}</p>
          <div className="p-4 flex flex-col gap-2">
            {gameInSession ? null : 
            
            <div className="flex flex-col gap-2">
              <input type="number" min={1} max={24} value={numOfMines} placeholder="Number of Mines" onChange={(e) => setNumOfMines(parseInt(e.target.value))} className="w-full p-2 text-black rounded-lg"/>
              <input type="number" min={1} max={1000} value={userBet} placeholder="Your Bet" onChange={(e) => setUserBet(parseInt(e.target.value))} className="w-full p-2 text-black rounded-lg"/>
            </div>

          }
          {numOfMines < 1 || numOfMines > 24 ? <p className="text-red-500">Number of Mines should be between 1 and 24</p> : !gameInSession ? <button className="primary-bg stripe-bg w-full p-2 rounded-lg" onClick={restartGame}>Start</button> : <button onClick={cashOut} className="primary-bg stripe-bg w-full p-2 rounded-lg">Cashout</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;