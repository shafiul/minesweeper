// Extract Query string to find number of cells per row

var query = window.location.search;
if( query.substring(0, 1) == '?' ){
    query = query.substring(1);
}
if( ! query.length ){
    query = 8;
}
// query now contains number of cells....
// Create Game Object
var gameOb = new Minesweeper( parseInt(query, 10) );

gameOb.start();
//gameOb.updateStatus("Mines: " + gameOb.numMines);

// BIND EVENTS

// click event on a cell
$('.cell').mousedown(function(event){
    // Return if game over
    if( !gameOb.isGameValid ){
        return;
    }
    var cellID = $(this).attr('id');
    cellID = cellID.split( gameOb.rcJoiner );
    var row = parseInt( cellID[0] );
    var col = parseInt( cellID[1] );
    // detect which click?
    switch( event.which ){
        case 1:
            gameOb.handleNormalClick(row, col);
            break;
        case 3:
            gameOb.handleSpecialClick(row, col);
            break;
        default:
            gameOb.updateStatus("Nothing to do " + event.which);
            break;
    }
    
});

// Disable right click
$('.cell').bind("contextmenu", function(e) {
    return false;
});

// Bind new Game

$('#newGameBtn').click(function(){
    window.location.reload();
});

gameOb.updateStatus("Here you go!")
