import { useState, useEffect } from 'react';
import './App.css';

import Counter from './components/Counter.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';

function App() {
  const [gameOver, setGameOver] = useState(false);

  const [strikes, setStrikes] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('strikes'))) || 0);

  const [passes, setPasses] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('passes'))) || 10);

  const [points, setPoints] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('points'))) || 0);

  const [highScore, setHighScore] = useState(() => parseInt(JSON.parse(localStorage.getItem('highscore'))) || 0)

  const [spellsArray, setSpellsArray] = useState(() => shuffle(JSON.parse(localStorage.getItem('spells'))) || shuffle(spells))

  const [currentSpell, setCurrentSpell] = useState(spellsArray[0]);
  const [scrambledSpell, setScrambledSpell] = useState(shuffle(currentSpell));

  const [userGuess, setUserGuess] = useState('');

  const passDisabledState = (passes == 0) ? true : false;
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    localStorage.setItem('passes', JSON.stringify(passes))
  }, [passes]);

  useEffect(() => {
    localStorage.setItem('strikes', JSON.stringify(strikes));
    if (strikes >= 10) {
      setGameOver(true);
    }
  }, [strikes]);

  useEffect(() => {
    localStorage.setItem('points', JSON.stringify(points))
    if (points > highScore) {
      setHighScore(points);
      setIsNewHighScore(true);
    }
  }, [points]);

  useEffect(() => {
    localStorage.setItem('highscore', JSON.stringify(highScore))
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem('spells', JSON.stringify(spellsArray))
    setCurrentSpell(spellsArray[0])
  }, [spellsArray]);

  useEffect(() => {
    setScrambledSpell(shuffle(currentSpell));
  }, [currentSpell]);

  const nextSpell = () => {
    if (spellsArray.length > 1) {
      setSpellsArray(spellsArray.slice(1))
    } else {
      setGameOver(true);
    }

    setUserGuess('')
  }

  const resetGame = () => {
    setGameOver(false);
    setUserGuess('')
    setSpellsArray(shuffle(spells));
    setStrikes(0);
    setPasses(10);
    setPoints(0);
  }

  // setPasses(5)
  // localStorage.setItem('passes', JSON.stringify(5))
  // setStrikes(0);
  // localStorage.setItem('strikes', JSON.stringify(0))
  // setSpellsArray(spells)
  // localStorage.setItem('spells', JSON.stringify(spellsArray))


  const passHandler = () => {
    setPasses(passes - 1)
    if (passes <= 0) {
      passDisabledState = true;
    }

    nextSpell();
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (compare(e.target.firstChild.value.toLowerCase(), currentSpell)) {
      setPoints(points + 1);
      alert(`Correct! The spell was in fact '${currentSpell}'`);
    } else {
      setStrikes(strikes + 1);
      alert(`Wrong :( The spell was '${currentSpell}'`);
    }

    nextSpell();

    // Easy Mode: Do you want to test in a way that's easier because some of these are kinda super hard? Uncomment the next 2 lines, and you can see the next correct answer
    // console.log(currentSpell);
    // console.log(spellsArray);
  }

  return (
    <div className='column is-three-fifths mx-auto my-4'>
      <header>
        <h1 className='title my-4 has-text-centered'>Welcome to D&D 5e Scramble!</h1>
        <p className='subtitle has-text-centered'>In this version of Scramble, I decided to use Dungeons & Dragons 5th edition spells, because why not?</p>


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
          <Counter propertyName='Points' currentCount={points} />
          <Counter propertyName='Passes' currentCount={passes} />
          <Counter propertyName='Strikes' currentCount={strikes} />
        </div>

        <p className='is-size-1 has-text-weight-bold has-text-centered'>{scrambledSpell.toUpperCase()}</p>

        <form onSubmit={submitHandler} className='column is-three-fifths mx-auto'>
          <input type="text" name="spellGuess" id="spellGuess" value={userGuess} onChange={(e) => setUserGuess(e.target.value)} className='input is-info my-2' />
          <div className='buttons is-justify-content-center are-medium my-2'>
            <button onClick={passHandler} type="button" className='button is-danger' disabled={passDisabledState}>Pass</button>

            <button type="submit" className='button is-success'>Submit</button>
          </div>

        </form>
        
        <p className='is-size-3 has-text-weight-medium has-text-centered'>Highscore: {highScore}</p>


      </main>

      

      { /* Conditionally rendering the GameOverScreen so it does not update constantly.*/ 
      
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

        {/* 'Kill switch' that you can uncomment for testing to reset the game :) */}

        {/* <button onClick={resetGame} className="button is-small is-danger">Start again</button>   */}

    </div>
  )
}

export default App
