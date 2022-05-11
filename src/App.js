import React, { useReducer, useState, useEffect } from 'react';
import './css/main.css';
import isWordInLexicon from './functions/isWordInLexicon';
import { BookOpenIcon, TrashIcon, SearchIcon } from '@heroicons/react/outline'

const ACTION = {
  'ADDWORD': 'addWord',
  'REMOVEWORD': 'removeWord'
}

function setLocalStorage(state) {
  localStorage.setItem('lexicon', JSON.stringify(state))
}
function getLocalStorage() {
  return localStorage.getItem('lexicon')
    ? JSON.parse(localStorage.getItem('lexicon'))
    : false;
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.ADDWORD:
      setLocalStorage([action.newWord, ...state]);
      return [action.newWord, ...state];
      break;

    case ACTION.REMOVEWORD:
      setLocalStorage([...state.filter(word => word.word !== action.word)]);
      return [...state.filter(word => word.word !== action.word)];
      break;

    default:
      return state;
  }
}

function App() {

  const [lexicon, dispatch] = useReducer(reducer, getLocalStorage() || []);
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [showMore, setShowMore] = useState(new Array(lexicon.length).fill(true));

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

  const handleSetShowMore = i => {
    const updatedSetShowMoreVal = [...showMore];
    updatedSetShowMoreVal[i] = !showMore[i];
    setShowMore(updatedSetShowMoreVal);
  }

  function ShowDefinitionList({ word, definitions }, i) {
    const numberOfDefinitions = definitions.length;
    const multipleDefinitions = numberOfDefinitions > 1;
    const truncated = multipleDefinitions && showMore[i];
    const inLexicon = isWordInLexicon(word, lexicon);
    return (<>
      <article
        key={word}
        className={`${truncated && `overflow-hidden max-h-64 `}shadow bg-white rounded p-4 pb-16 mb-10 sm:p-10 sm:pb-20 relative`}>
        {inLexicon
          ? <button
            className='bg-red-600 text-white px-4 py-2 rounded-full absolute top-4 right-4 sm:top-10 sm:right-10'
            onClick={() => dispatch({ type: ACTION.REMOVEWORD, word })}>
            remove</button>
          :
          <>
            <button
              onClick={() => {
                dispatch({ type: ACTION.ADDWORD, newWord: { word, definitions: [...definitions] } });
                setDefinition('');
              }}
              className='bg-green-300 hover:bg-green-400 px-4 py-2 rounded-full absolute top-4 right-4 sm:top-10 sm:right-10'>
              Add to Lexicon</button>
          </>
        }

        <header className='flex'>
          <h3 className='text-2xl font-semibold uppercase tracking-widest'>{word}</h3>
          <p>{numberOfDefinitions}</p>
        </header>
        {definitions.map(definition =>
          <dl key={definition.definition}>
            <dt className='italic font-serif pt-5'>{definition.partOfSpeech}</dt>
            <dd className='text-xl'>{definition.definition}</dd>
          </dl>
        )}
        {truncated ?
          <footer className='bg-gradient-to-t from-white absolute left-0 right-0 bottom-0 h-40'>
            <button
              onClick={() => handleSetShowMore(i)}
              className='bg-gray-500 text-white px-4 py-2 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2'
            >Show more</button>
          </footer>
          :
          <footer className='absolute left-0 right-0 bottom-0 h-40'>
            <button
              onClick={() => handleSetShowMore(i)}
              className='bg-gray-100 px-4 py-2 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2'
            >Show less</button>
          </footer>
        }
      </article >
    </>
    );
  }

  function ShowLexicon({ lexicon }) {
    return (lexicon.length === 0)
      ? <>
        <p className='mt-10 text-3xl'>Your lexicon has no words</p>
        <p className='mt-2 text-xl'>Search for a word at the top of the page.</p>
      </>
      : lexicon.map((word, i) => ShowDefinitionList(word, i))
  }

  return (
    <div>
      <header className='bg-zinc-900 sm:flex align-center justify-between px-5 py-2'>
        <h1 className='text-2xl text-white'>Lexicon</h1>
        <form onSubmit={e => {
          e.preventDefault();
          // dispatch({ type: ACTION.ADDWORD, word });
          getWordFromAPI();
          setWord('');
        }}
          className='flex'
        >
          <input
            className='form-control px-3 py-2 rounded-l-lg'
            type='text'
            value={word}
            onChange={e => setWord(e.target.value)} />
          <button
            className='bg-pink-300 rounded-r-lg text-red-900 px-4 py-2'>
            Search
          </button>
          {/* <button type='submit' className='bg-blue-500 rounded-lg text-white px-4 py-2'>Add new word to collection</button> */}
        </form>
      </header>
      <div className='container p-4 sm:p-10'>
        {definition && ShowDefinitionList(definition)}
        <ShowLexicon lexicon={lexicon}></ShowLexicon>
      </div>
      {/* Look up a word (and its synonyms, antonyms, etc.) */}
    </div>
  );
}

export default App;