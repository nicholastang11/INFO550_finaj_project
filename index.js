/*
Nicholas Tang
INFO550
index.js
This code is the backend of test.html
it implements the entire game of sudoku, 4 search algorithms, and the DOM
This source helped me implement the board onto the html page
https://stackoverflow.com/questions/42192412/output-2d-array-into-html-file
*/


//numberCheck is used to check 1-9 values for rows, columns, and 3x3 subSquares.
//This object is referenced many times in this file.
let numberCheck = {
    1:false,
    2:false,
    3:false,
    4:false,
    5:false,
    6:false,
    7:false,
    8:false,
    9:false
};

const colorMaps={//used to color the board when solving
0:"#2AA10F",
1:"#92E000",
2:"#E1FF00",
3:"#F58B00",
4:"#DE3700",
5:"#9c0519",
6:"#9c0519",
}


//these arrays help display the board and their colors
const total =[];
const totalBoard2=[];
const totalBoard3=[];
const totalColors=[];
const totalColors2=[];
const totalColors3=[];


/*
let board1 = [
  [0, 7, 5, 0, 9, 0, 0, 0, 6],
  [0, 2, 3, 0, 8, 0, 0, 4, 0],
  [8, 0, 0, 0, 0, 3, 0, 0, 1],
  [5, 0, 0, 7, 0, 2, 0, 0, 0],
  [0, 4, 0, 8, 0, 6, 0, 2, 0],
  [0, 0, 0, 9, 0, 1, 0, 0, 3],
  [9, 0, 0, 4, 0, 0, 0, 0, 7],
  [0, 6, 0, 0, 7, 0, 5, 8, 0],
  [7, 0, 0, 0, 1, 0, 3, 9, 0],
];
*/
let board1=[
[5,0,0,4,0,0,0,6,0],
[0,0,9,0,0,0,8,0,0],
[6,4,0,0,2,0,0,0,0],
[0,0,0,0,0,1,0,0,8],
[2,0,8,0,0,0,5,0,1],
[7,0,0,5,0,0,0,0,0],
[0,0,0,0,9,0,0,8,4],
[0,0,3,0,0,0,6,0,0],
[0,6,0,0,0,3,0,0,2],
]
let board2 = [
  [1, 0, 5, 0, 0, 4, 8, 0, 0],
  [6, 0, 0, 1, 0, 0, 9, 0, 0],
  [8, 0, 4, 0, 6, 3, 0, 7, 1],
  [5, 1, 0, 0, 3, 2, 4, 0, 0], //replace second 5 with 3
  [0, 4, 0, 0, 5, 0, 1, 2, 0],
  [2, 0, 0, 0, 0, 1, 0, 0, 3],
  [0, 0, 8, 4, 2, 5, 6, 1, 0],
  [4, 0, 1, 0, 0, 9, 0, 0, 2],
  [0, 5, 0, 6, 1, 0, 3, 9, 0],
];

let board3=[
  [0, 3, 0, 0, 5, 0, 0, 4, 0],
  [0, 0, 8, 0, 1, 0, 5, 0, 0],
  [4, 6, 0, 0, 0, 0, 0, 1, 2],
  [0, 7, 0, 5, 0, 2, 0, 8, 0],
  [0, 0, 0, 6, 0, 3, 0, 0, 0],
  [0, 4, 0, 1, 0, 9, 0, 3, 0],
  [2, 5, 0, 0, 0, 0, 0, 9, 8],
  [0, 0, 1, 0, 2, 0, 6, 0, 0],
  [0, 8, 0, 0, 6, 0, 0, 2, 0],
];



//add board of colors
function addColors(board){
    /*
    used in the display to add color 
    */

    let colorArray=[
     ['','','','','','','','',''],
     ['','','','','','','','',''],
     ['','','','','','','','',''],
     ['','','','','','','','',''],
     ['','','','','','','','',''],
     ['','','','','','','','',''],
     ['','','','','','','','',''],
     ['','','','','','','','',''],
     ['','','','','','','','',''],   
    ]
    for(var i=0; i<board.length;i++){
        let row = board[i];
        for(var j=0;j<row.length;j++){
            let legalColors = getLegalNumbers(i,j,board);
            let lengthOfLegalColors = legalColors.length;
            let colorValue= colorMaps[lengthOfLegalColors];
            colorArray[i][j]=colorValue;
        }
    }
    return colorArray
}




function resetNumberCheck(numCheck){
    /*
    This function resets numberCheck in place
    source to reset the numberCheck object -> https://stackoverflow.com/questions/40836239/set-all-object-keys-to-false
    */
    Object.keys(numCheck).forEach(v => numCheck[v] = false);
}

function createSubSquares(board){
    //returns an object that is each 3x3 square of a sudoku board
    const boardSubSquares = {
    /*
    keys -> are each 3x3 section in the sudoku board
    values -> row,col indices in the board that contains each section
    source for how subsets were grabbed -> /https://stackoverflow.com/questions/51383031/slice-section-of-two-dimensional-array-in-javascript
    */
    topLeft: board.slice(0, 2 + 1).map(i => i.slice(0, 2 + 1)),
    topMiddle:board.slice(0, 2 + 1).map(i => i.slice(3, 5 + 1)),
    topRight:board.slice(0, 2 + 1).map(i => i.slice(6, 8 + 1)),
    middleLeft:board.slice(3, 5 + 1).map(i => i.slice(0, 2 + 1)),
    center:board.slice(3, 5 + 1).map(i => i.slice(3, 5 + 1)),
    middleRight:board.slice(3, 5 + 1).map(i => i.slice(6, 8 + 1)),
    bottomLeft:board.slice(6, 8 + 1).map(i => i.slice(0, 2 + 1)),
    bottomMiddle:board.slice(6, 8 + 1).map(i => i.slice(3, 5 + 1)),
    bottomRight:board.slice(6, 8 + 1).map(i => i.slice(6, 8 + 1)),
    };
    return boardSubSquares
}

function isRowOrColumnValid(rowColArr,rowBool=false,colBool=false){
    /*
    takes a sudoku row or column array
    rowBool -> if it is a row set this to true
    colCool -> if it is a column set this to true
    rowBool and colBool are mainly used for console logging purposes
    */
    resetNumberCheck(numberCheck) //reset numberCheck for the next time it needs to be accessed
    for(var j =0; j <rowColArr.length; j++){ //iterate through row values
        let val = rowColArr[j]; //grab the value
        if(numberCheck[val] == false){//make sure rowVal not already accounted for
            numberCheck[val] = true;
        }
        else{ // if a row or column contains val
            if(rowBool==true && colBool ==false){
            //console.log(val + ' already exists in row. ' + j +  ' This is an invalid solution');
            return false;
            }
            if(colBool==true && rowBool ==false){
            //console.log(val + ' already exists in column. ' + j +  ' This is an invalid solution');
            return false;
            }
            
        }
    }
    return true;
}

function isSubSquareValid(subSquare,key=null){
    /*
    This checks if a single 3x3 subSquare is correct
    */
   resetNumberCheck(numberCheck) //reset numberCheck for the next time it needs to be accessed
    for(var i = 0; i < subSquare.length; i++) {//loop through rows :: this loop is nearly the same as in the areRowsLegal function
        let row = subSquare[i]; //grab the row
        for(var j =0; j <row.length; j++){ //iterate through row values
            let rowVal = row[j]
            if(numberCheck[rowVal] == false){//make sure rowVal not already accounted for
                numberCheck[rowVal] = true;
            }
            else{ // if a row contains rowVal
                //console.log(rowVal + ' already exists in subSquare. ' + key +  ' This is an invalid solution');
                return false;
            }
        }
    }
    return true;
}


function areRowsLegal(board){
    /*
    This function checks if all rows are legal for a solution of sudoku
    board -> a sudoku board in the form of a 2d array
    https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal -> is used to see if all values in legalRows are true
    */
    let legalRows=[];
    for(var i = 0; i < board.length; i++) {//loop through rows of the board
        let row = board[i]; //grab the row
        let rowTruthVal = isRowOrColumnValid(row,rowBool=true);
        legalRows[i]=rowTruthVal;
}
    if(legalRows[0]==true){
    return legalRows.every( (val, i, arr) => val === arr[0] );   //checks if at least one value is true, and if they are all true
    }
}

function areColumnsLegal(board){
    /*
    This function checks if all columns are legal for a solution of sudoku
    board -> a sudoku board in the form of a 2d array
    source to grab column from board -> https://stackoverflow.com/questions/7848004/get-column-from-a-two-dimensional-array
    */
    let legalCols=[];
    for(var i=0; i<board.length; i++){
        let column = board.map(function(value,index) { return value[i]; }); //grab column. source is in function header
        let colTruthVal =isRowOrColumnValid(column,colBool=true);
        legalCols[i] =colTruthVal;
    }
    if(legalCols[0]==true){
    return legalCols.every( (val, i, arr) => val === arr[0] );   //checks if at least one value is true, and if they are all true
    }
}


function is3x3Legal(boardSubsetObj){
    /*
    This function takes object which contains 3x3 board subsets
    Each board needs to be legal for a solution of soduku to be legal
    */
    let legalSquares=[];
    for (const [key, value] of Object.entries(boardSubsetObj)) { // loop through each section of the board
        let i=0;
        let board = boardSubsetObj[key];//grab the subsetBoard
        let squareTruthVal=isSubSquareValid(value,key);
        legalSquares[i]=squareTruthVal;
        i++;
    }
    if(legalSquares[0]==true){
    return legalSquares.every( (val, i, arr) => val === arr[0] );   //checks if at least one value is true, and if they are all true
    }
}


function isLegalSolution(board){ //calculates if the generated solution is a legal solution
  const legalRows = areRowsLegal(board);
  const legalCols = areColumnsLegal(board);
  const subSections = createSubSquares(board); // generates 3x3 sections of the board
  const legalSubSquares = is3x3Legal(subSections);
  if (legalRows == true && legalCols == true && legalSubSquares==true){
    console.log('The solution is correct!')
    return true;
  }
  return false;
}


class Queue {
        /*
        Queue implementation used for bfs
        implementation is from https://www.geeksforgeeks.org/implementation-queue-javascript/#
        */
        constructor() {
            this.items = {}
            this.frontIndex = 0
            this.backIndex = 0
        }
        enqueue(item) {
            this.items[this.backIndex] = item
            this.backIndex++
            return item + ' inserted'
        }
        dequeue() {
            const item = this.items[this.frontIndex]
            delete this.items[this.frontIndex]
            this.frontIndex++
            return item
        }
        peek() {
            return this.items[this.frontIndex]
        }
        get printQueue() {
            return this.items;
        }
        contains(item) { //checks if item exists in the queue
        for (let i = this.frontIndex; i < this.backIndex; i++) {
            if (this.items[i] === item) {
                return true;
            }
        }
        return false;
        }
    }




/********************************************************
 *                                                      *
 *              Start of Search Algorithm Code          *
 *                                                      *
 * *****************************************************/


function getSubSquare(rowIndex,colIndex,board){
    /*
    Finds the subsquare for a given row and column
    rowIndex -> row index
    colIndex -> column index
    board -> current state of the board
    */
    //topLeft
    if(rowIndex<=2 && colIndex <=2){
        return board.slice(0, 2 + 1).map(i => i.slice(0, 2 + 1));
    }
    //topMiddle
    else if( rowIndex<=2 && (colIndex >2 && colIndex <=5)){
        return board.slice(0, 2 + 1).map(i => i.slice(3, 5 + 1));
    }
    //topRight
    else if( rowIndex<=2 && colIndex>5){
        return board.slice(0, 2 + 1).map(i => i.slice(6, 8 + 1));
    }
    //middleLeft
    else if( (rowIndex >2 && rowIndex <=5) && colIndex<=2){
        return board.slice(3, 5 + 1).map(i => i.slice(0, 2 + 1));
    }
    //center
    else if( (rowIndex >2 && rowIndex <=5) && (colIndex >2 && colIndex <=5)){
        return board.slice(3, 5 + 1).map(i => i.slice(3, 5 + 1));
    }
    //middleRight
    else if( (rowIndex >2 && rowIndex <=5) && (colIndex >5)){
        return board.slice(3, 5 + 1).map(i => i.slice(6, 8 + 1));
    }

    //bottomleft
    else if( rowIndex>5 && colIndex <=2){
        return board.slice(6, 8 + 1).map(i => i.slice(0, 2 + 1));
    }

    //bottomMiddle
    else if( rowIndex>5 && (colIndex >2 && colIndex <=5)){
        return board.slice(6, 8 + 1).map(i => i.slice(3, 5 + 1));
    }

    //bottomRight
    else if( rowIndex>5 && colIndex>5){
        return board.slice(6, 8 + 1).map(i => i.slice(6, 8 + 1));
    }

}

function getLegalNumbers(rowIndex,colIndex,board){
    /*
    This function is referenced many times throughout the script to find the legal values for a given cell
    This is the how forward checking is implemented
    rowIndex -> row index
    colIndex -> column index
    board -> current board state
    */
    let legalVals = { //domain for row column that is returned as a list
        1:true,
        2:true,
        3:true,
        4:true,
        5:true,
        6:true,
        7:true,
        8:true,
        9:true,
    }
    const square = getSubSquare(rowIndex,colIndex,board);
    for(var i = 0; i < square.length; i++) { //first remove used values from the subsquare
        for(var j = 0; j < square[i].length; j++) {
        let val = square[i][j]
        if (legalVals[val]==true){ //remove value from legal values
        legalVals[val]=false;
         }
        }
    }
    let row = board[rowIndex];
    for(var i=0; i< row.length; i++){ //next remove used values from the row
        if (row[i] != 0){
            legalVals[row[i]]=false;
        }
    }

    let column = board.map(function(value,index) { return value[colIndex]; });
    for(var i=0; i< column.length; i++){//next remove used values from the clumn
        if (column[i] != 0){
            legalVals[column[i]]=false;
        }
    }
    return Object.keys(legalVals).filter(key => legalVals[key]===true); //return array of values that only equal true
}


// Helper function to create a copy of the board
function copyBoard(board) {
    /*
    copies the board 
    this is used in all of the search algorithms as a non-reference copy
    board -> current board state
    */
    var newArray = [];

    for (var i = 0; i < board.length; i++)
        newArray[i] = board[i].slice();
    return newArray;
}


function findEmpty(board){
    /*
    finds the first empty cell in the sudoku board
    board -> current board state
    */
    
    for(var i = 0; i < board.length; i++) {
        let row = board[i];
        for(var j=0;j<row.length;j++){
            if (board[i][j]===0){
                return [i,j]
            }
        }
    }
    return [];
}




function dfs(board){
    /*
    Depth first search algorithm
    */
    //console.table(board)
    let frontier = [board];
    let explored =[];
    while (true){
        if(frontier.length === 0){ //if frontier is empty break
            console.log('frontier is empty');
            return false;
        }
        currentBoard = frontier.pop()
        if (isLegalSolution(currentBoard)){ //if the current board is the solution
            console.log('solution found')
            console.table(currentBoard);
            total.push(currentBoard);
            totalColors.push(addColors(currentBoard));
            totalColors2.push(addColors(currentBoard));
            totalColors3.push(addColors(currentBoard));
            totalBoard2.push(currentBoard);
            totalBoard3.push(currentBoard);
            drawBoard(currentBoard);
            return explored;
        }

    
        explored.push(currentBoard)//add board to explored because it is not a solution
        total.push(currentBoard);
        totalColors.push(addColors(currentBoard));
        totalColors2.push(addColors(currentBoard));
        totalColors3.push(addColors(currentBoard));
        totalBoard2.push(currentBoard);
        totalBoard3.push(currentBoard);
        //get next state -> we need to find where the first 0 is and find legal values for that spot
        let cell = findEmpty(currentBoard);
        //console.log(cell)
        //get legal values for this cell. first need to check if there are 
        if (cell.length>0){
            let row=cell[0];
            let col=cell[1];
            //now need to get legal values for this space
            let legalValues = getLegalNumbers(row,col,currentBoard); //forward checking
            if(legalValues.length>0){
                for(const num of legalValues){
                    //make board copy
                    let tempBoard = copyBoard(currentBoard);
                    tempBoard[row][col]=parseInt(num);
                    if (frontier.includes(tempBoard) ||explored.includes(tempBoard)){//if board with these values will already be tested, skip.
                        continue;
                    }
                    else{
                        frontier.push(tempBoard); //add to frontier
                    }
                }
            }
        }
    }
}





function bfs(board){
    /*
    Breadth First Search using forward checking
    */
    //console.table(board)
    let frontier = new Queue();
    frontier.enqueue(board)
    let explored =[];
    while (true){
        if(frontier.length === 0){ //if frontier is empty break
            console.log('frontier is empty');
            return false;
        }
        currentBoard = frontier.dequeue()
        //console.table(board)
        if (isLegalSolution(currentBoard)){ //if solution is found
            console.log('solution found')
            console.table(currentBoard);
            var endTime = performance.now()
            total.push(currentBoard);
            totalBoard2.push(currentBoard);
            totalBoard3.push(currentBoard);
            totalColors.push(addColors(currentBoard));
            totalColors2.push(addColors(currentBoard));
            totalColors3.push(addColors(currentBoard));
            drawBoard(currentBoard);
            return true;
        }
        explored.push(currentBoard)//add board to explored because it is not a solution
        total.push(currentBoard);
        totalBoard2.push(currentBoard);
        totalBoard3.push(currentBoard);
        totalColors.push(addColors(currentBoard));
        totalColors2.push(addColors(currentBoard));
        totalColors3.push(addColors(currentBoard));
        //get next state -> we need to find where the first 0 is and find legal values for that spot
        let cell = findEmpty(currentBoard);
        //console.log(cell)
        //get legal values for this cell_. first need to check if there are 
        if (cell.length>0){
            let row=cell[0];
            let col=cell[1];
            //console.log(row,col);
            //now need to get legal values for this space
            let legalValues = getLegalNumbers(row,col,currentBoard); //forward checking
            //console.log(legalValues)
            if(legalValues.length>0){
                for(const num of legalValues){
                    //make board copy to try values
                    let tempBoard = copyBoard(currentBoard);
                    tempBoard[row][col]=parseInt(num);
                    if (frontier.contains(tempBoard) ||explored.includes(tempBoard)){
                        continue;
                    }
                    else{
                        frontier.enqueue(tempBoard);
                    }
                }
            }
        }
    }
}

function backtracking(board){
    /*
    backtracking with forward checking
    This algorithm is similar to dfs but uses recursion instead of a frontier
    */
    if (isLegalSolution(board)){ //base case
            console.log('solution found')
            console.table(board);
            total.push(board);
            totalBoard2.push(board);
            totalBoard3.push(board);
            totalColors.push(addColors(board));
            totalColors2.push(addColors(board));
            totalColors3.push(addColors(board));
            drawBoard(board);
            return true;
    }
    //get next state -> we need to find where the first 0 is and find legal values for that spot
    let cell = findEmpty(board);

    //get legal values for this cell. first need to check if there are 
    if (cell.length>0){
        let row=cell[0];
        let col=cell[1];
        //now need to get legal values for this space
        let legalValues = getLegalNumbers(row,col,board);
        if(legalValues.length>0){
            for(const num of legalValues){
                //make board copy
                let tempBoard = copyBoard(board);
                tempBoard[row][col]=parseInt(num);//adds value to board
                total.push(tempBoard);
                totalBoard2.push(tempBoard);
                totalBoard3.push(tempBoard);
                totalColors.push(addColors(tempBoard));
                totalColors2.push(addColors(tempBoard));
                totalColors3.push(addColors(tempBoard));
                backtracking(tempBoard);
                
            }
        }
    }

}



function findAllZeros(board) {
  /*
  helper function for the minimum values remaining algorithm
  returns an array of all [row,col] pairs which have a value of 0
  */
  var zeros=[]
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        zeros.push([row,col]);
      }
    }
  }
  return zeros; 
}

function findLowestDomain(board,zeros){
    /*
    helper function for the minimum values remaining algorithm
    this function finds the row,col pair with the smallest available domain
    returns row,col pair with its available domain
    */
    let allDomains=[]
    let smallestDomain=999;
    let savedDomain=[];
    let savedRowCol=[];
    for(const value of zeros){
        let row=value[0]
        let col=value[1]
        let legalVals=getLegalNumbers(row,col,board)
        allDomains.push([row,col,legalVals]);
    }
    for(let i =0; i<allDomains.length;i++){
        let currentArr=allDomains[i];
        let row =currentArr[0];
        let col=currentArr[1];
        let domainLen = currentArr[2].length;
        if (domainLen<smallestDomain){
            smallestDomain=domainLen;
            savedDomain=currentArr[2];
            savedRowCol=[row,col];
        }

    }
    return [savedRowCol,savedDomain]
}

function minimumRemainingValues(board) {
  /*
   minimum remaining values implementation
   This algorithm finds the first index whose legal value domain is the smallest and prioritizes it
  */
  if (isLegalSolution(board)) { //if the solution is found
    console.table(board);
    total.push(board);
    totalBoard2.push(board);
    totalBoard3.push(board);
    totalColors.push(addColors(board));
    totalColors2.push(addColors(board));
    totalColors3.push(addColors(board));
    drawBoard(board);
    return board;
  }

  let remainingZeros= findAllZeros(board); //find where all of the missing values are
  //console.log(remainingZeros);
  let rowColDomain=findLowestDomain(board,remainingZeros); //get the row,col,domain
  let row=rowColDomain[0][0];
  let col=rowColDomain[0][1];
  let values=rowColDomain[1];

    for (const num of values) { //go through values
      const tempBoard = copyBoard(board);
      tempBoard[row][col] = parseInt(num);
      total.push(tempBoard);
      totalBoard2.push(tempBoard);
      totalBoard3.push(tempBoard);
      totalColors.push(addColors(tempBoard));
      totalColors2.push(addColors(tempBoard));
      totalColors3.push(addColors(tempBoard));
      var temp = minimumRemainingValues(tempBoard);
      if (temp) { //if legal
        return temp;
      }
      tempBoard[row][col] = 0;
    }
  return false;
}






function drawBoard(selectedBoard) {
    /*
    draws starting board
    */
    for (var row = 0; row < selectedBoard.length; row++) {
        for (var col = 0; col < selectedBoard[row].length; col++) {
            var cell = document.getElementById("cell" + row + col);
            if(selectedBoard[row][col] === 0){
                cell.textContent=''
                document.getElementById("cell" + row + col).style.backgroundColor=colorMaps[5];
            }
            else{
            document.getElementById("cell" + row + col).style.backgroundColor=colorMaps[0];
            cell.textContent = selectedBoard[row][col];
            }
        }
    }
}


function updateBoard(board,boardColors){//boardColors will have the hex for each board
    /*
    updates the colors as board iterates
    */
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[row].length; col++) {
            var cell = document.getElementById("cell" + row + col);
            let color=boardColors[row][col];
            if(board[row][col] === 0){
                cell.innerHTML=''
                document.getElementById("cell" + row + col).style.backgroundColor=color;
            }
            else{
                cell.innerHTML = board[row][col];
                document.getElementById("cell" + row + col).style.backgroundColor=color;
                }
            }
        }
    }


// Function to display the selected board
function displaySelectedBoard() {
    var selectedBoard = document.getElementById("myDropdown").value;
    if(selectedBoard==="board1"){
        drawBoard(board1);
    }
    else if(selectedBoard==="board2"){
        drawBoard(board2);
    }
    else if(selectedBoard==="board3"){
        drawBoard(board3);
    }
    else{
        alert("invalid board selected");
    }
}

// Function to select the search algorithm
function selectSearchAlgorithm() {
    var selectedAlgorithm = document.getElementById("algorithmDropdown").value;
    localStorage.setItem("selectedAlgorithm", selectedAlgorithm);
}

// Function to run the search algorithm when the button is clicked
function runSearchAlgorithm() {
    var selectedAlgorithm = localStorage.getItem("selectedAlgorithm");
    if (selectedAlgorithm) {
        // Get the selected board
        var selectedBoard = document.getElementById("myDropdown").value;
        if (selectedBoard==="board1"){
            var board=board1;
        }
        if (selectedBoard==="board2"){
            var board=board2;
        }
        if (selectedBoard==="board3"){
            var board=board3;
        }
        // Call the appropriate search algorithm function based on the selected algorithm
        if (selectedAlgorithm === "dfs") {
            var startTime=performance.now()
            dfs(board);
            var endTime = performance.now();
            document.getElementById("timer").innerHTML = `Depth First Search took ${Math.round(endTime - startTime)} milliseconds`;
        } else if (selectedAlgorithm === "bfs") {
            var startTime=performance.now()
            bfs(board);
            var endTime = performance.now();
            document.getElementById("timer").innerHTML = `Breadth First Search took ${Math.round(endTime - startTime)} milliseconds`;
        } else if (selectedAlgorithm === "backtracking") {
            console.log("solving")
            var startTime = performance.now();
            backtracking(board);
            var endTime = performance.now();
            document.getElementById("timer").innerHTML = `Brute Force took ${Math.round(endTime - startTime)} milliseconds`;

        } else if(selectedAlgorithm==="mrv"){
            var startTime = performance.now();
            console.log("solving")
            minimumRemainingValues(board);
            var endTime= performance.now();
            document.getElementById("timer").innerHTML = `Minimum Remaining Values took ${Math.round(endTime - startTime)} milliseconds`;
        } else if(selectedAlgorithm==="default"){
        alert("Please select a search algorithm first.");
    }
        
    } else {
        alert("Please select a search algorithm first.");
    }
}


/*
code for display buttons
*/
let counter = 0;


function increment() {
    /*
    continuously click this button to increment through the solution
    */
    var selectedBoard = document.getElementById("myDropdown").value;
    if (selectedBoard === "board1"){
        if(isLegalSolution(total[counter])){
          console.log("WOOHOO")
          
          document.getElementById("counter").innerHTML =  updateBoard(total[counter],totalColors)|| '';
          document.getElementById("timer").innerHTML = `Please Refresh the Page to Restart`;
          counter=0;
      }
      else{
      console.log(totalColors[counter])
      document.getElementById("counter").innerHTML =  updateBoard(total[counter],totalColors[counter])||'';
      counter++
      }
  }
  else if (selectedBoard === "board2"){
    if(isLegalSolution(totalBoard2[counter])){
        document.getElementById("counter").innerHTML =  updateBoard(totalBoard2[counter],totalColors2[counter]) || '';
        counter=0;
        document.getElementById("timer").innerHTML = `Please Refresh the Page to Restart`;
    }
    else{
    document.getElementById("counter").innerHTML =  updateBoard(totalBoard2[counter],totalColors2[counter])||'';
    console.log(totalBoard2)
    counter++
    }
  }
  else if (selectedBoard === "board3"){
    if(isLegalSolution(totalBoard3[counter])){
        document.getElementById("counter").innerHTML =  updateBoard(totalBoard3[counter],totalColors3[counter])|| ''
        counter=0;
        document.getElementById("timer").innerHTML = `Please Refresh the Page to Restart`;
    }
    else{
    document.getElementById("counter").innerHTML =  drawBoard(totalBoard3[counter],totalColors3[counter])||'';
    console.log(totalBoard3)
    counter++
    }
  }
  else{
    alert("please run a search algorithm first")
  }
  
}

let loopCounter = 0;

function loopBoards(){
    //Loops through the solution when clicked
    intervalID = setInterval(function(){
    var selectedBoard = document.getElementById("myDropdown").value;
    if(selectedBoard==="board1"){
        var board=total;
        var colors=totalColors;
    }
    else if(selectedBoard==="board2"){
        var board= totalBoard2;
        var colors=totalColors2;
    }
    else if(selectedBoard==="board3"){
        var board=totalBoard3;
        var colors=totalColors3;
    }
    const loopId = document.getElementById("looper");

    if(isLegalSolution(board[loopCounter])){
        loopId.innerHTML=drawBoard(board[loopCounter])||'';
        document.getElementById("timer").innerHTML = `Please Refresh the Page to Restart`;
        clearInterval(intervalID);
    }
    loopId.innerHTML=updateBoard(board[loopCounter],colors[loopCounter])||'';
    loopCounter++;
    },75)
    }