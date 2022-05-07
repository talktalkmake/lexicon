import React, { useReducer, useState } from 'react';
import './css/main.css';

const ACTION = {
  'ADDWORD': 'addWord',
  'REMOVEWORD': 'removeWord'
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.ADDWORD:
      return [...state, action.definition];
      break;

    case ACTION.REMOVEWORD:
      return [...state.filter(word => word !== action.word)];
      break;

    default:
      return state;
  }
}

function App() {

  const [words, dispatch] = useReducer(reducer, [])
  const [word, setWord] = useState('')
  const [definition, setDefinition] = useState('')

  function getWordFromAPI() {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
        'X-RapidAPI-Key': '06678c9f50msh8e8dc3e7442f9f3p14404djsne386b9f689a7'
      }
    }

    fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`, options)
      .then(response => response.json())
      .then(response => setDefinition(response))
      .catch(err => console.error(err));
  }

  function ListWords({ words }) {
    return (words.length === 0)
      ? <p>There are no words</p>
      : <>
        <table className='table-auto shadow w-full'>
          <tbody>
            {words.map((word, i) =>
              <tr key={`${word.word}-${i}`}>
                <td className='px-4 py-2'>
                  {word.word}
                  {word.definitions.map(definition => <dl><dt>{definition.partOfSpeech}</dt><dd>{definition.definition}</dd></dl>)}
                </td>
                <td className='px-4 py-2'><button onClick={() => dispatch({ type: ACTION.REMOVEWORD, word })} className='bg-red-600 text-white px-4 py-2 rounded-full'>remove</button></td>
              </tr>
            )}
          </tbody>
        </table>
      </>
  }

  return (
    <div className="App p-4">
      <h1 className='text-5xl'>Lexicon</h1>
      <form onSubmit={e => {
        e.preventDefault();
        // dispatch({ type: ACTION.ADDWORD, word });
        getWordFromAPI();
        setWord('');
      }}>
        <input type='text' value={word} onChange={e => setWord(e.target.value)} />
        <button className='bg-blue-900 rounded-lg text-white px-4 py-2'>Search for word</button>
        {/* <button type='submit' className='bg-blue-500 rounded-lg text-white px-4 py-2'>Add new word to collection</button> */}
      </form>
      {definition
        && <section>
          {definition.definitions.map(definition => <dl><dd>{definition.partOfSpeech}</dd><dt>{definition.definition}</dt></dl>)}
          <button
            onClick={() => dispatch({ type: ACTION.ADDWORD, definition })}
            className='bg-green-300 px-4 py-2 hover:bg-green-400'>Add {definition.word} to Lexicon</button>
        </section>}
      <ListWords words={words}></ListWords>
      <pre>{JSON.stringify(words, null, 2)}</pre>
      {/* Make a collection of words */}
      {/* Add word to collection */}
      {/* Remove word from collection */}
      {/* Look up a word (and its synonyms, antonyms, etc.) */}
    </div>
  );
}

export default App;