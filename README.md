# Hearts
I wanted to play Hearts with three friends without the need to make an account, install an app, or get paired with strangers/robots. So I made this.

![Screenshot choosing cards to trade](https://i.imgur.com/tYsfzyn.png)
![Screenshot playing a trick](https://i.imgur.com/Fw3JqJh.png)

#### Things it does
_Please file an issue (or PR) if there is something else you want Hearts to do._
 - Lets you play Hearts with three of your friends in your browser
 - Looks decent on three screens
 - Keep score between rounds
 - Take a card back if played incorrectly
 - Rejoin if you lose connection (though this only works if at least one of your friends stayed on the page)

#### Things it does not do (yet)
 - Check that the move you made was allowed 
   - As with Hearts live, though, you may redo your move if you made a mistake
 - Sort the cards in your hand
 - Save a game for you & your friends to return to later
 - Collect any sort of stats or keep player profiles

## Tech used
The app is (more-or-less) a single-page application served via a Node Express app. The game state is handled by a [Vue](https://github.com/vuejs/vue) component, and game updates are streamed between players via [Socket.io](https://github.com/socketio/socket.io). 

Special thanks to the [Deck of Cards API](https://deckofcardsapi.com/) for the wonderful API methods & card images.

## Running locally
Make sure you have Node installed. Then, 
1. Clone the repository
2. From inside the folder, run `npm install` 
3. Run `npm start`, and you may access Hearts locally at `localhost:9090`

## Do whatever you want with it
Clone it. Fork it. Twist it. Bop it. 
 
