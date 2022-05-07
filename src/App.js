import React, { useReducer, useState } from 'react';
import './css/main.css';

const ACTION = {
  'ADDWORD': 'addWord',
  'REMOVEWORD': 'removeWord'
}

// const isWordInLexicon = (word, definitions) => definitions.findIndex(definition => definition.word === word) > -1 ? true : false

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.ADDWORD:
      // Add case for checking if the word is already in state
      return [...state, action.definition];
      break;

    case ACTION.REMOVEWORD:
      return [...state.filter(word => word !== action.wordInLexicon)];
      break;

    default:
      return state;
  }
}

function App() {

  const [lexicon, dispatch] = useReducer(reducer, [])
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

  function ShowLexicon({ lexicon }) {
    return (lexicon.length === 0)
      ? <p>There are no words</p>
      : <>
        {lexicon.map((wordInLexicon, i) =>
          <section
            key={`${wordInLexicon.word}-${i}`}
            className='shadow bg-white rounded p-10 mt-10'>
            <article className='relative'>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded-full absolute top-0 right-0'
                onClick={() => dispatch({ type: ACTION.REMOVEWORD, wordInLexicon })}>
                remove
              </button>
              <h3 className='text-2xl font-semibold uppercase tracking-widest'>{wordInLexicon.word}</h3>
              {wordInLexicon.definitions.map(definition =>
                <dl key={definition.definition}>
                  <dt className='italic font-serif pt-5'>{definition.partOfSpeech}</dt>
                  <dd className='text-xl'>{definition.definition}</dd>
                </dl>)}
            </article>
          </section >
        )}
      </>
  }

  return (
    <div className="container p-4">
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
          {definition.definitions.map(definition => <dl key={definition.definition}><dd>{definition.partOfSpeech}</dd><dt>{definition.definition}</dt></dl>)}
          <button
            onClick={() => dispatch({ type: ACTION.ADDWORD, definition })}
            className='bg-green-300 px-4 py-2 hover:bg-green-400'>
            Add {definition.word} to Lexicon
          </button>
        </section>}
      <ShowLexicon lexicon={lexicon}></ShowLexicon>
      {/* Look up a word (and its synonyms, antonyms, etc.) */}
    </div>
  );
}

export default App;