var baseBet = 1; // Basebet in Bits
var baseMultiplier = 2; // the base multiplier

// Toying around with this might break the bot!
var startBalance = engine.getBalance();
var myUsername = engine.getUsername();
var lastGame;
var firstGame = true;
var currentBet;
var currentMultiplier = baseMultiplier;
var lossStreak = 0;
var currentProfit = 0;
var highProfit = 0;
var lowProfit = 0;

// On start of the bot!

if(typeof jQuery === "undefined"){
	// Yes, you really need jQuery for this script to work
	var script = document.createElement('script'); 
	script.src = 'https://code.jquery.com/jquery-3.0.0.min.js'; // the URL to the jQuery library
	document.documentElement.firstChild.appendChild(script) // now append the script into HEAD, it will fetch and be executed
}


console.clear();
console.log('====== FinlayDaG33k\'s BustaBit Bot Gen.3 ======');
console.log('Starting balance: ' + (engine.getBalance() / 100).toFixed(2) + ' bits');

engine.on('game_starting', function(info) {
    console.log('====== New Game ======');
    console.log('[BustaBot3] Total profit: ' + ((engine.getBalance() - startBalance) / 100) + ' Bits');
	currentProfit = (engine.getBalance() - startBalance) / 100;
	if(currentProfit > highProfit){
		highProfit = currentProfit;
	}
	if(currentProfit < lowProfit){
		lowProfit = currentProfit;
	}
	console.log('[BustaBot3] High profit: ' + highProfit + ' Bits');
	console.log('[BustaBot3] Low profit: ' + lowProfit + ' Bits');
	lastGame = engine.lastGamePlay();
	
	
	if(lastGame == 'LOST' && !firstGame){ 
		// if the last game was lost, and it's not the first game.
		lossStreak++; // increase the lossStreak by 1.
		$.ajax({
			url: 'https://dev.finlaydag33k.nl/bot/?losses=' + lossStreak,
			type: 'GET',
			async: false, // gotta wait for the AJAX request to complete.
			success: function(data){ 
				var json = JSON.parse(data);
				//console.log(json);
				currentBet = (baseBet * 100) * json.betMultiplier;
				currentMultiplier = json.gameMultiplier;
				console.log('[BustaBot3] Changing bet to ' + (currentBet / 100)+ ' Bits @ '+ currentMultiplier + 'x');
			},
			error: function(data) {
				alert('Something went wrong, Skipping the game!'); //or whatever
			}
		});
	}else{ 
		// if it's the firstgame, the last game was not played, or the last game was won.
		lossStreak = 0; // reset the losstreak.
		currentBet = (baseBet * 100); // go back to the baseBet.
		currentMultiplier = baseMultiplier;
		console.log('[BustaBot3] Changing bet to ' + (currentBet / 100) + ' Bits');
	}
	
	
	console.log('[BustaBot3] Betting ' + (currentBet / 100) + ' Bits, cashing out at ' + currentMultiplier + 'x');
	firstGame = false;
	
	if (currentBet <= engine.getBalance()){ // Ensure we have enough to bet.
		engine.placeBet(currentBet, Math.round(currentMultiplier * 100), false);
	}
});

engine.on('game_started', function(data) {
    console.log('[BustaBot3] Game Started!');
});

engine.on('game_crash', function(data) {
    console.log('[BustaBot3] Game crashed at '+ (data.game_crash / 100) + 'x');
});

engine.on('cashed_out', function(data) {
	if(data.username == myUsername){
		console.log('[BustaBot3] Successfully cashed out at ' + (data.stopped_at / 100) + 'x!');
	}
});
