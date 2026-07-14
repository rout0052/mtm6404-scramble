import { useState, useEffect } from 'react';
import './App.css';

import Counter from './components/Counter.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';

function App() {
  let gameOver = false;

  const [strikes, setStrikes] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('strikes'))) || 10);

  const [passes, setPasses] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('passes'))) || 10);

  const [points, setPoints] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem('points'))) || 0);

  const [spellsArray, setSpellsArray] = useState(() => JSON.parse(localStorage.getItem('spells')) || shuffle(spells))

  const [currentSpell, setCurrentSpell] = spellsArray[0];

  const passDisabledState = (passes == 0) ? true : false;

  useEffect(() => {
    localStorage.setItem('passes', JSON.stringify(passes))
  }, [passes]);

  useEffect(() => {
    localStorage.setItem('strikes', JSON.stringify(strikes));
    if(strikes >= 10) {
      gameOver = true;
    }
  }, [strikes]);

  useEffect(() => {
    localStorage.setItem('points', JSON.stringify(points))
  }, [points]);

  useEffect(() => {
    // setCurrentSpell(spellsArray[0]);
  }, [spellsArray]);

  useEffect(() => {
    console.log('The game is now over.')
  }, [gameOver]);


  // setPasses(5)
  // localStorage.setItem('passes', JSON.stringify(5))

  const passHandler = () => {
    setPasses(passes - 1)
    if (passes <= 0) {
      passDisabledState = true;
      console.log(passDisabledState)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(e.target.firstChild.value);
    // console.log(spellsArray[0])
    // compare(e.target.firstChild.value.toLowerCase(), spellsArray[0])
    if(compare(e.target.firstChild.value.toLowerCase(), spellsArray[0])) {
      console.log(true);
      setPoints(points + 1);

    } else {
      console.log(false);
      setStrikes(strikes + 1);
      console.log(strikes);
    }

    console.log(spellsArray);
    setSpellsArray(spellsArray.shift());
    console.log(spellsArray);
    console.log(shuffle(currentSpell.toUpperCase()))
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

        <p className='is-size-1 has-text-weight-bold has-text-centered'>{shuffle(currentSpell.toUpperCase())}</p>

        <form onSubmit={submitHandler} className='column is-three-fifths mx-auto'>
          <input type="text" name="spellGuess" id="spellGuess" className='input is-info my-2' />
          <div className='buttons is-justify-content-center are-medium my-2'>
            <button onClick={passHandler} type="button" className='button is-danger' disabled={passDisabledState}>Pass</button>

            <button type="submit" className='button is-success'>Submit</button>
          </div>

        </form>




      </main>

    </div>
  )
}

export default App
