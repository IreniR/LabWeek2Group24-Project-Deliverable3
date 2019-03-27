var Sudoku = ( function ( $ ){
	var _instance, _game,
		defaultConfig = {
			// If set to true, the game will validate the numbers
			// as the player inserts them. If it is set to false,
			// validation will only happen at the end.
			'validate_on_insert': true,
		};
		paused = false;
		counter = 0;

 	//initialize game
	function init( config ) {
		conf = $.extend( {}, defaultConfig, config );
		_game = new Game( conf );
		return {

			/** Public methods **/
			//display board
			getBoard: function() {
				return _game.buildGUI();
			},

			//reset game board
			resetBoard: function() {
				_game.resetGame();
			},

			//validates game board
			validateBoard: function() {
				var isValid;

				isValid = _game.validateMatrix();
				$( '.sudoku-container' ).toggleClass( 'valid-matrix', isValid );
			}
		};
	}
 	
 	//game process
	function Game( config ) {
		
		//game initialization
		this.config = config;
		
		//set game parameters
		this.recursionCounter = 0;
		this.$cellMatrix = {};
		this.matrix = {};
		this.validation = {};

		this.resetValidationMatrices();
		return this;
	}


	Game.prototype = {

		//builds the board UI
		buildGUI: function() {
	var $td, $tr,
		$table = $( '<table>' )
			.addClass( 'container' );
 
	// for each row
	for ( var i = 0; i < 9; i++ ) {
		$tr = $( '<tr>' );
		this.$cellMatrix[i] = {};
		// for each columns in that row
		for ( var j = 0; j < 9; j++ ) {
			// keep input max length to 1
			this.$cellMatrix[i][j] = $( '<input>' )
				.attr( 'maxlength', 1 )
				// Keep row/col data
				.data( 'row', i )
				.data( 'col', j )
				// listen for keyup event
				.on( 'keyup', $.proxy( this.onKeyUp, this ) );
 
			$td = $( '<td>' ).append( this.$cellMatrix[i][j] );
			// Calculate section ID
			sectIDi = Math.floor( i / 3 );
			sectIDj = Math.floor( j / 3 );
			// Set the design for different sections
			if ( ( sectIDi + sectIDj ) % 2 === 0 ) {
				$td.addClass( 'sudoku-section-one' );
			} else {
				$td.addClass( 'sudoku-section-two' );
			}
			// Build the row
			$tr.append( $td );
		}
		// add the row to the table(board)
		$table.append( $tr );
	}
	// Return the table
	return $table;
},

//handle key up event
onKeyUp: function( e ) {
	var sectRow, sectCol, secIndex,
		starttime, endtime, elapsed,
		isValid = true,

		//sets val to the inserted value
		val = $.trim( $( e.currentTarget ).val() ),

		//sets row and col to the inserted value's row and column
		row = $( e.currentTarget ).data( 'row' ),
		col = $( e.currentTarget ).data( 'col' );
 
	// Reset board validation class
	$( '.sudoku-container' ).removeClass( 'valid-matrix' );
 
	// validate, but only if validate_on_insert setting is set to true
	if ( this.config.validate_on_insert ) {

		//checks if number can be inserted
		isValid = this.validateNumber( val, row, col, this.matrix.row[row][col] );

		// displays error for invalid input
		$( e.currentTarget ).toggleClass( 'sudoku-input-error', !isValid );
	}
 
	// Calculate section identifiers
	sectRow = Math.floor( row / 3 );
	sectCol = Math.floor( col / 3 );
	secIndex = ( row % 3 ) * 3 + ( col % 3 );
 
	// adds inserted value to matrix of game parameters
	this.matrix.row[row][col] = val;
	this.matrix.col[col][row] = val;
	this.matrix.sect[sectRow][sectCol][secIndex] = val;
},


		//Reset the board and the game parameters
		resetGame: function() {
			this.resetValidationMatrices();

			//for each cell
			for ( var row = 0; row < 9; row++ ) {
				for ( var col = 0; col < 9; col++ ) {
					// reset board inputs
					this.$cellMatrix[row][col].val( '' );
				}
			}

			$( '.sudoku-container input' ).removeAttr( 'disabled' );
			$( '.sudoku-container' ).removeClass( 'valid-matrix' );
		},

		
		//Reset and rebuild the validation matrices
		resetValidationMatrices: function() {
			this.matrix = { 'row': {}, 'col': {}, 'sect': {} };
			this.validation = { 'row': {}, 'col': {}, 'sect': {} };

			// Build the row/col matrix and validation arrays
			for ( var i = 0; i < 9; i++ ) {
				this.matrix.row[i] = [ '', '', '', '', '', '', '', '', '' ];
				this.matrix.col[i] = [ '', '', '', '', '', '', '', '', '' ];
				this.validation.row[i] = [];
				this.validation.col[i] = [];
			}

			// Build the section matrix and validation arrays
			for ( var row = 0; row < 3; row++ ) {
				this.matrix.sect[row] = [];
				this.validation.sect[row] = {};
				for ( var col = 0; col < 3; col++ ) {
					this.matrix.sect[row][col] = [ '', '', '', '', '', '', '', '', '' ];
					this.validation.sect[row][col] = [];
				}
			}
		},


 //Checks if current number can be inserted
validateNumber: function( num, rowID, colID, oldNum ) {
	var isValid = true,
		// Section
		sectRow = Math.floor( rowID / 3 ),
		sectCol = Math.floor( colID / 3 );
 
	// The old number, the number that previously resided in the current section
	oldNum = oldNum || '';
 
	// Remove oldNum from all the validation matrices if it exists in them.
	if ( this.validation.row[rowID].indexOf( oldNum ) > -1 ) {
		this.validation.row[rowID].splice(
			this.validation.row[rowID].indexOf( oldNum ), 1
		);
	}
	if ( this.validation.col[colID].indexOf( oldNum ) > -1 ) {
		this.validation.col[colID].splice(
			this.validation.col[colID].indexOf( oldNum ), 1
		);
	}
	if ( this.validation.sect[sectRow][sectCol].indexOf( oldNum ) > -1 ) {
		this.validation.sect[sectRow][sectCol].splice(
			this.validation.sect[sectRow][sectCol].indexOf( oldNum ), 1
		);
	}

	// Skip if empty value
	if ( num !== '' ) {

		// Validate value
		if (
			// Make sure value is a number
			$.isNumeric( num ) &&
			// Make sure value is within range
			Number( num ) > 0 &&
			Number( num ) <= 9
		) {

			// Check if it already exists in validation array
			if (
				$.inArray( num, this.validation.row[rowID] ) > -1 ||
				$.inArray( num, this.validation.col[colID] ) > -1 ||
				$.inArray( num, this.validation.sect[sectRow][sectCol] ) > -1
			) {
				isValid = false;
			} else {
				isValid = true;
			}
		}
 
		// Insert new value into validation array even if it isn't
		// valid. This is on purpose: If there are two numbers in the
		// same row/col/section and one is replaced, the other still
		// exists and should be reflected in the validation.
		// The validation will keep records of duplicates so it can
		// remove them safely when validating later changes.
		this.validation.row[rowID].push( num );
		this.validation.col[colID].push( num );
		this.validation.sect[sectRow][sectCol].push( num );
	}
	return isValid;
},

		
		//Validate the entire matrix
		validateMatrix: function() {
			var isValid, val, $element,
				hasError = false;

			// Go over entire board, and compare to the cached
			// validation arrays
			for ( var row = 0; row < 9; row++ ) {
				for ( var col = 0; col < 9; col++ ) {
					val = this.matrix.row[row][col];
					// Validate the value
					isValid = this.validateNumber( val, row, col, val );

					//checks for wrong type of input
					this.$cellMatrix[row][col].toggleClass( 'sudoku-input-error', !isValid );

					if ( !isValid ) {
						hasError = true;
					}
				}
			}
			return !hasError;
		},

	};
  
	return {
		// Get the game instance
		getInstance: function( config ) {
			//if instance is not initialized, intializes instance
			if ( !_instance ) {
				_instance = init( config );
			}
			return _instance;
		}
	};
} )( jQuery );