function Minesweeper(numCellInRow){
    // Constants
    this.rcJoiner = 'a';
    // cell value for  mine
    this.CELLVAL_MINE = -1;
    // PROPERTIES
    this.isGameValid = true;
    this.numCellInRow = numCellInRow;
    // initiate cells array
    this.cells = new Array(this.numCellInRow);
    this.isFlagged = new Array(this.numCellInRow);
    this.isCellVisited = new Array(this.numCellInRow);
    // Others
    this.numCell = this.numCellInRow * this.numCellInRow;
    this.numMines = Math.floor(this.numCell * (2.5/16));
    this.flagCounter = 0;
    this.requiredClicks = this.numCell - this.numMines;
    console.log('Required clicks: ' + this.requiredClicks);
}

/**
 * Init
 */

Minesweeper.prototype._init = function(){
    // init some vars
    
    // Create 2D arrays
    for(var i=0; i<this.numCellInRow; i++){
        this.cells[i] = new Array(this.numCellInRow);
        this.isFlagged[i] = new Array(this.numCellInRow);
        this.isCellVisited[i] = new Array(this.numCellInRow);
    }
    // generate mines
    var gotMines = 0;
    while(gotMines < this.numMines){
        var randCellId = Math.floor( Math.random() * (this.numCell - 1 ) );
        var rcOb = this._resoluteRowCol(randCellId);
        if( typeof this.cells[ rcOb.row ][ rcOb.col ] === 'undefined' ){
            this.cells[ rcOb.row ][ rcOb.col ] = this.CELLVAL_MINE;
            gotMines++;
        }else{
            continue;
        }
        
    }
    // Initiate 2D arrays with default values
    for(i=0; i < this.numCellInRow; i++){
        for(var j=0; j < this.numCellInRow; j++){
            // Update Cell
            if( typeof this.cells[i][j] === 'undefined' ) {
                this.cells[i][j] = 0;
            }
            // Update Flags
            this.isFlagged[i][j] = false;
            // traverse for empty values
            this.isCellVisited[i][j] = false;
        }
    }
    // count mines
    this._countMines();
    
    // Update some UI 
    $('#flagAvailable').html( this.numMines );
}

/**
 * Increment Mine count in given index
 */

Minesweeper.prototype._placeSingleMine = function(r, c){
    if( this.cells[r][c] != this.CELLVAL_MINE ){
        this.cells[r][c]++;
    }
}

/**
 * Count Mines
 */

Minesweeper.prototype._countMines = function(){
    // Calculate Mines
    for(var i=0; i < this.numCellInRow; i++){
        for(var j=0; j < this.numCellInRow; j++){
            if( this.cells[i][j] == this.CELLVAL_MINE ) {
                // Mine Found! Update neighbors...
                //                console.log("Mine found in " + i + j);
                
                if( ( (i-1) >= 0) && ( (j-1) >= 0) ){ // Left-top
                    this._placeSingleMine(i-1, j-1);
                }
                if( (i-1) >= 0){ // tops
                    this._placeSingleMine(i-1, j);
                }
                if( ((i-1) >= 0) && ((j+1) < this.numCellInRow ) ){ // top-right
                    this._placeSingleMine(i-1, j+1);
                }
                if( (j-1) >= 0){
                    this._placeSingleMine(i, j-1);
                }
                if( (j+1) < this.numCellInRow ){
                    this._placeSingleMine(i, j+1);
                }
                if( ((i+1) < this.numCellInRow) && ((j-1) >= 0) ){
                    this._placeSingleMine(i+1, j-1);
                }
                if( (i+1) < this.numCellInRow ){
                    this._placeSingleMine(i+1, j);
                }
                if( ((i+1) < this.numCellInRow) && ((j+1) < this.numCellInRow) ){
                    this._placeSingleMine(i+1, j+1);
                }
            }
        }
    }
}

/**
 * Resolute Row & Column from Index
 */

Minesweeper.prototype._resoluteRowCol = function(index){
    var ret = new Object();
    ret.row = Math.floor(index/this.numCellInRow);
    ret.col = index - (this.numCellInRow * ret.row );
    return ret;
}



/**
 * Generate HTML
 */

Minesweeper.prototype._generateHTML = function(){
    var htmlStr = "";
    // place Horizontal Aisle
    for(j=0; j < this.numCellInRow; j++){
        htmlStr += "<div class='aisle horAisle'>&nbsp;</div>";
    }
    // Fill up extra space
    htmlStr += "<div class='aisle horAisleFiller'>&nbsp;</div>";
    htmlStr += "<div class='rowbreak'></div>";
    // Create Mine Cells
    for(var i=0; i < this.numCellInRow; i++){
        htmlStr += "<div class='aisle verAisle'>&nbsp;</div>";
        for(var j=0; j < this.numCellInRow; j++){
            htmlStr += "<div class = 'cell cellYellow' id = '" + i + this.rcJoiner + j + "'>&nbsp;</div>";
            htmlStr += "<div class='aisle verAisle'>&nbsp;</div>";
        }
        htmlStr += "<div class='rowbreak'></div>";
        // place Horizontal Aisle
        for(j=0; j < this.numCellInRow; j++){
            htmlStr += "<div class='aisle horAisle'>&nbsp;</div>";
        }
        // Fill up extra space
        htmlStr += "<div class='aisle horAisleFiller'>&nbsp;</div>";
        htmlStr += "<div class='rowbreak'></div>";
    }
    // inject HTML
    $("#map").html(htmlStr);
    this.updateStatus("Map generated");
}

/**
 * Create Map
 */

Minesweeper.prototype._createMap = function(){
    // init
    this._init();
    
    // print
    this._generateHTML();
}

/**
 * Update Status
 */
Minesweeper.prototype.updateStatus = function(status){
    $("#status").html(status);
}



/**
 * Start a game
 */

Minesweeper.prototype.start = function(){
    this._createMap();
// test print 
//    this.printAll();
}

/**
 *
 */

Minesweeper.prototype.handleNormalClick = function(r, c){
    if( this.cells[r][c] == this.CELLVAL_MINE ){
        this.updateStatus("Bomb click on " + r + c);
        // Mine clicked! Finish Game
        this.stopGame(false);
    }else if( this.cells[r][c] == 0 ){
        // Empty field clicked
        this.updateStatus("Empty Cell click on " + r + c);
        this.emptyCellClicked(r, c);
    }else{
        // Normal, just reveal itself.
        //        this.updateStatus("Normal on " + r + c);
        if( ! this.isCellVisited[r][c] ){
            this.isCellVisited[r][c] = true;
            this.requiredClicks--;
        }
        
        $('#' + r + this.rcJoiner + c).html( this.cells[r][c] );
    }
    console.log('Required clicks', this.requiredClicks);
    // Check if won?
    if( this.requiredClicks == 0 ){
        this.stopGame(true);
    }
}

/**
 * Traverses empty cells recursively
 */

Minesweeper.prototype.emptyCellClicked = function(r, c){
    if( (this.cells[r][c] == 0) && (! this.isCellVisited[r][c]) ){
        // This is empty cell. Update the cell style
        $('#' + r + this.rcJoiner + c).attr('class', 'cell cellGray');
        // Make this cell visited
        this.isCellVisited[r][c] = true;
        this.requiredClicks--;
        // traverse valid neighbors
        if( ( (r-1) >= 0) && ( (c-1) >= 0) ){ // Left-top
            this.emptyCellClicked(r-1, c-1);
        }
        if( (r-1) >= 0){ // tops
            this.emptyCellClicked(r-1, c);
        }
        if( ((r-1) >= 0) && ((c+1) < this.numCellInRow ) ){ // top-right
            this.emptyCellClicked(r-1, c+1);
        }
        if( (c-1) >= 0){
            this.emptyCellClicked(r, c-1);
        }
        if( (c+1) < this.numCellInRow ){
            this.emptyCellClicked(r, c+1);
        }
        if( ((r+1) < this.numCellInRow) && ((c-1) >= 0) ){
            this.emptyCellClicked(r+1, c-1);
        }
        if( (r+1) < this.numCellInRow ){
            this.emptyCellClicked(r+1, c);
        }
        if( ((r+1) < this.numCellInRow) && ((c+1) < this.numCellInRow) ){
            this.emptyCellClicked(r+1, c+1);
        }
        
    }else if( this.cells[r][c] != 0 ){
        // Normal cell, just reveal itself...
        //        console.log("Normal found on " + r + c);
        // Reveal cell if not visited already
        if(! this.isCellVisited[r][c] ){
            this.isCellVisited[r][c] = true;
            this.requiredClicks--;
        }
        $('#' + r + this.rcJoiner + c).html( this.cells[r][c] );
    }
}

/**
 * Handle special click e.g. Right-button click
 */

Minesweeper.prototype.handleSpecialClick = function(r, c){
    // ignore flag in whitespace
    if( this.cells[r][c] == 0 ){
        return;
    }
    if( this.isFlagged[r][c] ){
        // Unflag...
        this.isFlagged[r][c] = false;
        this.flagCounter--;
        $('#' + r + this.rcJoiner + c).attr('class', 'cell cellYellow');
    }else{
        //  Flag.
        if( this.flagCounter == this.numMines ){
            // Outrun?
            alert('Already used maximum number of flags! Unflag some and try again');
            return;
        }
        this.isFlagged[r][c] = true;
        this.flagCounter++;
        $('#' + r + this.rcJoiner + c).attr('class', 'cell cellBlue');
    }
    // Update Status
    $('#flagUsed').html(this.flagCounter);
}


/**
 * Take actions to stop the game
 */
Minesweeper.prototype.stopGame = function(isWinner){
    isWinner = (typeof isWinner === 'undefined')?(true):(isWinner);
    // Stop the timer
    $('#clock').find('.stop').click();
    this.isGameValid = false;
    if(isWinner){
        var h = $('#clock').find('.hr').text();
        var m = $('#clock').find('.min').text();
        var s = $('#clock').find('.sec').text();
        alert('You won! Time required: ' + h + ":" + m + ":" + s);
    }else{
        this.printAll();
    }
}

/**
 * Reveal all cells
 */

Minesweeper.prototype.printAll = function(){
    for(var i=0; i < this.numCellInRow; i++){
        for(var j=0; j < this.numCellInRow; j++){
            if( this.cells[i][j] == this.CELLVAL_MINE ){
                $('#' + i + this.rcJoiner + j).attr('class', 'cell cellRed');
            }else if( this.cells[i][j] == 0 ){
                $('#' + i + this.rcJoiner + j).attr('class', 'cell cellGray');
            }else{
                $('#' + i + this.rcJoiner + j).attr('class', 'cell cellYellow');
                $('#' + i + this.rcJoiner + j).html( this.cells[i][j] );
            }
            
        }
    }
    this.updateStatus("Minefield printed");
}