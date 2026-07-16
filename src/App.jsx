import { useState, useEffect } from 'react';

// App.css is blank as I used Bulma, but just in case of future changes :)
import './App.css';

// Imports components
import Counter from './components/Counter.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';

function App() {
  // MAIN VARIABLES SETUP

  // Creates the gameOver state for whether the game is over, and sets it to false by default.
  const [gameOver, setGameOver] = useState(false);

  // Creates the strikes state, with a default of either a parsed version of the locally stored 'strikes' value if it exists, or 0.
  const [strikes, setStrikes] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('strikes'))) || 0);

  // Creates the passes state, with a default of either a parsed version of the locally stored 'passes' value if it exists, or 10.
  const [passes, setPasses] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('passes'))) || 10);

  // Creates the points state, with a default of either a parsed version of the locally stored 'strikes' value if it exists, or 0.
  const [points, setPoints] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('points'))) || 0);

  // Creates the highScore state, with a default of either a parsed version of the locally stored 'highScore' value if it exists, or 0.
  const [highScore, setHighScore] = useState(() => parseInt(JSON.parse(localStorage.getItem('highscore'))) || 0)

  // Creates the spellsArray state, with a default of either a shuffled version of the locally stored 'spells' value if it exists, or a fresh shuffled spells array from src/data/spells.js 
  const [spellsArray, setSpellsArray] = useState(() => shuffle(JSON.parse(localStorage.getItem('spells'))) || shuffle(spells))

  // Creates the state to hold the currentSpell item, which is just the first item in the spellsArray
  const [currentSpell, setCurrentSpell] = useState(spellsArray[0]);

  // Creates the state to hold the shuffled version of the current spell. This is set in a state, as it would reshuffle with every character typed into the input as it would re-render the component. 
  const [scrambledSpell, setScrambledSpell] = useState(shuffle(currentSpell));

  // Creates the state to hold the value of the input field. This allows the program to clear it easily on submit
  const [userGuess, setUserGuess] = useState('');

  // This const is used to disable the pass button when the user runs out of passes.
  const passDisabledState = (passes <= 0) ? true : false;

  // This state monitors whether the user has reached a new high score, and is false by default. This is used for the GAME OVER screen, to give a shiny "New" badge when the player beats their high score 
  const [isNewHighScore, setIsNewHighScore] = useState(false);


  // USE EFFECTS 

  // Updates the local storages passes amount when there is a change to passes.
  useEffect(() => {
    localStorage.setItem('passes', JSON.stringify(passes))
  }, [passes]);

  // Updates the local storages strikes amount when there is a change to strikes, then checks if the amount is more than or equal to 10. If it is, the gameOver state is changed to false.
  useEffect(() => {
    localStorage.setItem('strikes', JSON.stringify(strikes));
    if (strikes >= 10) {
      setGameOver(true);
    }
  }, [strikes]);

  // Updates the local storages points amount when there is a change to points. Additionally, checks whether the points is more than the highScore, and if it does, set the new high school, and set the bool of it being a new high score to true. 
  useEffect(() => {
    localStorage.setItem('points', JSON.stringify(points))
    if (points > highScore) {
      setHighScore(points);
      setIsNewHighScore(true);
    }
  }, [points]);

  // Updates the local storages highScore amount when there is a change to highScore
  useEffect(() => {
    localStorage.setItem('highscore', JSON.stringify(highScore))
  }, [highScore]);

  // Updates the local storages spells array when there is a change to the spell array. Additionally, resets the current spell to the first element of the new array.
  useEffect(() => {
    localStorage.setItem('spells', JSON.stringify(spellsArray))
    setCurrentSpell(spellsArray[0])
  }, [spellsArray]);

  // When the current spell changes, shuffle the new one.
  useEffect(() => {
    setScrambledSpell(shuffle(currentSpell));
  }, [currentSpell]);


  // FUNCTIONS

  // This function is triggered when the game tries to go to the next spell in the array
  const nextSpell = () => {
    // If the length is greater than 1, aka there is another spell to go through
    if (spellsArray.length > 1) {
      // Set the spellsArray to spells array, with the first value sliced off
      setSpellsArray(spellsArray.slice(1))
    } else {
      // If there is not another spell to go through, its game over
      setGameOver(true);
    }

    // Clears the input field
    setUserGuess('')
  }

  // This function is triggered when the user clicks the start over button in the Game Over Screen, or uses the hidden 'kill switch' I put in for development / testing 
  const resetGame = () => {
    // Sets to default values
    setGameOver(false);
    setUserGuess('')
    // Sets the spellArray to the spells array from data, but shuffled. Its the same spells as the player's first game, but in a different order
    setSpellsArray(shuffle(spells));
    // Sets to default values
    setStrikes(0);
    setPasses(10);
    setPoints(0);
  }

  // Handler function for when the user passes the spell
  const passHandler = () => {
    // Sets the passes to one less
    setPasses(passes - 1)
    
    // If the user has run out of passes 
    if (passes <= 0) {
      // Disable the pass button
      passDisabledState = true;
    }

    // Moves to next spell
    nextSpell();
  }

  // Submit handler for when the form submits. Can use both the submit button and the enter key
  const submitHandler = (e) => {
    // Prevents page refresh
    e.preventDefault();

    // Compares the value of the input (changes to all lowercase) to the current spell. If the comparison is true...
    if (compare(e.target.firstChild.value.toLowerCase(), currentSpell)) {
      // Increase the points by 1
      setPoints(points + 1);
      // Tell the user they were right with an alert
      alert(`Correct! The spell was in fact '${currentSpell}'`);
    
    // If the comparison is false...
    } else {
      // Increase the strikes 
      setStrikes(strikes + 1);
      // Tells the user they were wrong, and what the spell was (because honestly it would drive me crazy if I didn't know what it was.)
      alert(`Wrong :( The spell was '${currentSpell}'`);
    }

    // Moves onto the next spell
    nextSpell();

    // Easy Mode: Do you want to test in a way that's easier because some of these are kinda super hard? Uncomment the next 2 lines, and you can see the next correct answer.
    
    // console.log(currentSpell);
    // console.log(spellsArray);
  }

  return (
    <div className='column is-three-fifths mx-auto my-4'>
      <header>
        {/* Scramblemancy - noun. Divination into what the shuffle algorithm did to the beloved DND spell names */}
        <h1 className='title my-4 has-text-centered'>Welcome to D&D 5e Scramblemancy!</h1>
        <p className='subtitle has-text-centered'>In this version of Scramble, I decided to use Dungeons & Dragons 5th edition spells, because why not?</p>

        {/* Used the Message component template from Bulma: https://bulma.io/documentation/components/message/ */}
        <article className="message is-info">
          <div className="message-header">
            <p>Instructions</p>
          </div>
          <div className="message-body">
            <p>A scrambled name for a D&D 5e spell will appear above the input line. Unscramble the name, and then press the submit button. <strong>All of the spells chosen are 1 word, and can range from a cantrip to level 9.</strong></p>
            <br />
            <p>You have a total of 10 strikes for the <strong>entire game</strong>, which are incurred when you submit a wrong guess. </p>
            <br />
            <p>You also have 10 passes for difficult names. By clicking the pass button, you will move onto a new spell, but you lose the opportunity to get points for that answer.</p>
          </div>
        </article>
      </header>

      <main className='my-6'>
        <div className='is-flex is-justify-content-space-evenly my-4'>
          {/* Sets up the counters for the points, passes, and strikes */}
          <Counter propertyName='Points' currentCount={points} />
          <Counter propertyName='Passes' currentCount={passes} />
          <Counter propertyName='Strikes' currentCount={strikes} />
        </div>

        {/* Puts the scrambledSpell in uppercase for the user to guess from */}
        <p className='is-size-1 has-text-weight-bold has-text-centered'>{scrambledSpell.toUpperCase()}</p>

        {/* Form holding the input and buttons. Runs submitHandler on submit */}
        <form onSubmit={submitHandler} className='column is-three-fifths mx-auto'>
          {/* Value equal to userGuess, and changes it when the input is changed */}
          <input type="text" name="spellGuess" id="spellGuess" value={userGuess} onChange={(e) => setUserGuess(e.target.value)} className='input is-info my-2' />
          <div className='buttons is-justify-content-center are-medium my-2'>
            {/* Pass button, on click runs passHandler, and is disabled based on whether the user has run out of passes */}
            <button onClick={passHandler} type="button" className='button is-danger' disabled={passDisabledState}>Pass</button>

            {/* Submit button */}
            <button type="submit" className='button is-success'>Submit</button>
          </div>

        </form>

        {/* Shows the users high score to work towards */}
        <p className='is-size-3 has-text-weight-medium has-text-centered'>Highscore: {highScore}</p>
      </main>

      

      { /* Conditionally rendering the GameOverScreen so it does not update constantly.
        *     
        *     Explanation of the GameOverScreen element
        *       modalStatus is based on gameOver bool
        *       passes the resetGame function to the component to use for the 'Start Again' button
        *       passes the highScore, and whether the highScore is new or not (isNewHighScore bool)
        *       passes an array of objects to be used for the player stats.
        *         
        */    
      
      gameOver ?
        <GameOverScreen
          modalStatus={gameOver}

          resetHandler={resetGame}

          highScore={{ value: highScore, new: isNewHighScore }}

          playerStats={[
            { name: 'Total Points', value: points, key: crypto.randomUUID() },
            { name: 'Passes Remaining', value: passes, key: crypto.randomUUID()},
            { name: 'Total Strikes', value: strikes, key: crypto.randomUUID() }
          ]}
        />
        : ''}

        {/* 'Kill switch' that you can uncomment below for testing to reset the game :) */}

        {/* <button onClick={resetGame} className="button is-small is-danger">Start again</button>   */}
    </div>
  )
}

export default App
