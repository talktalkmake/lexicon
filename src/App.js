import React, { useReducer, useState } from 'react';
import './css/main.css';
import isWordInLexicon from './functions/isWordInLexicon';

const ACTION = {
  'ADDWORD': 'addWord',
  'REMOVEWORD': 'removeWord'
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.ADDWORD:
      // Add case for checking if the word is already in state
      return [...state, action.definition];
      break;

    case ACTION.REMOVEWORD:
      return [...state.filter(word => word.word !== action.word)];
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

  function ShowDefinitionList({ word, definitions }) {
    return (<>
      <section
        key={word}
        className='shadow bg-white rounded p-10 mt-10'>
        <article className='relative'>
          <button
            className='bg-red-600 text-white px-4 py-2 rounded-full absolute top-0 right-0'
            onClick={() => dispatch({ type: ACTION.REMOVEWORD, word })}>
            remove
          </button>
          <header className='flex'>
            <h3 className='text-2xl font-semibold uppercase tracking-widest'>{word}</h3>
            <p>{definitions.length}</p>
          </header>
          {definitions.map(definition =>
            <dl key={definition.definition}>
              <dt className='italic font-serif pt-5'>{definition.partOfSpeech}</dt>
              <dd className='text-xl'>{definition.definition}</dd>
            </dl>)}
        </article>
      </section >
    </>
    );
  }

  function ShowLexicon({ lexicon }) {
    return (lexicon.length === 0)
      ? <>
        <p className='mt-10 text-3xl'>Your lexicon has no words</p>
        <p className='mt-2 text-xl'>Search for a word at the top of the page.</p>
      </>
      : lexicon.map(word => ShowDefinitionList(word))
  }

  return (
    <div>
      <header className='bg-zinc-900 flex align-center justify-between px-5 py-2'>
        <h1 className='text-2xl text-white'>Lexicon</h1>
        <form onSubmit={e => {
          e.preventDefault();
          // dispatch({ type: ACTION.ADDWORD, word });
          getWordFromAPI();
          setWord('');
        }}>
          <input
            className='form-control px-3 py-2 rounded-l-lg'
            type='text'
            value={word}
            onChange={e => setWord(e.target.value)} />
          <button
            className='bg-pink-300 rounded-r-lg text-red-900 px-4 py-2'>
            Search for word
          </button>
          {/* <button type='submit' className='bg-blue-500 rounded-lg text-white px-4 py-2'>Add new word to collection</button> */}
        </form>
      </header>
      <div className='container p-10'>
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
      </div>
      {/* Look up a word (and its synonyms, antonyms, etc.) */}
    </div>
  );
}

export default App;