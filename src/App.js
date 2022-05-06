import React, { useReducer, useState } from 'react';
import './css/main.css';

const ACTION = {
  'ADDWORD': 'addWord'
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'addWord':
      return [...state, action.word];
      break;

    case 'removeWord':
      return [...state.filter(word => word !== action.word)];
      break;

    default:
      return state;
  }
}

function App() {

  const [words, dispatch] = useReducer(reducer, [])
  const [word, setWord] = useState('')

  function ListWords({ words }) {
    return (words.length === 0)
      ? <p>There are no words</p>
      : <>
        <table>
          <tbody>
            {words.map((word, i) => {
              return (
                <tr key={`${word}-${i}`}>
                  <td>{word}</td>
                  <td><button onClick={() => removeWord(word)} className='bg-red-600 text-white px-4 py-2 rounded-full'>remove</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
  }

  function removeWord(word) {
    dispatch({ type: 'removeWord', word })
  }

  return (
    <div className="App">
      <h1 className='text-5xl'>Lexicon</h1>
      <form onSubmit={e => {
        e.preventDefault();
        dispatch({ type: 'addWord', word });
        setWord('');
      }}>
        <input type='text' value={word} onChange={e => setWord(e.target.value)} />
        <button type='submit' className='bg-blue-500 rounded-lg text-white px-4 py-2'>Add new word to collection</button>
      </form>
      <ListWords words={words}></ListWords>
      {/* <pre>{JSON.stringify(words, null, 2)}</pre> */}
      {/* Make a collection of words */}
      {/* Add word to collection */}
      {/* Remove word from collection */}
      {/* Look up a word (and its synonyms, antonyms, etc.) */}
    </div>
  );
}

function getter() {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
      'X-RapidAPI-Key': '06678c9f50msh8e8dc3e7442f9f3p14404djsne386b9f689a7'
    }
  };

  fetch('https://wordsapiv1.p.rapidapi.com/words/hatchback/typeOf', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

export default App;