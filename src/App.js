import React, { useReducer, useState } from 'react';
import './css/main.css';
import { PlusCircleIcon, BookOpenIcon, TrashIcon, SearchIcon } from '@heroicons/react/outline'
import Spinner from './components/Spinner';
import isWordInLexicon from './functions/isWordInLexicon';
import getPartOfSpeech from './functions/getPartOfSpeech';
import GoodHTMLResponse from './functions/goodHTMLResponse';
import ACTION from './functions/ACTION';

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
    case ACTION.REMOVEWORD:
      setLocalStorage([...state.filter(word => word.word !== action.word)]);
      return [...state.filter(word => word.word !== action.word)];
    default:
      return state;
  }
}

function App() {
  // State
  const [lexicon, dispatch] = useReducer(reducer, getLocalStorage() || []);
  // The string in the search bar
  const [word, setWord] = useState(false);
  // a list of defintitions for the given word
  const [definitions, setDefinitions] = useState(false);
  // Are the given word's definitions truncated?
  const [showMore, setShowMore] = useState(new Array(lexicon.length).fill(true));
  // Tell the user if processing is happening behind the scenes
  const [isLoading, setIsLoading] = useState(false);
  // If the given word has no defintions (e.g. "rarararrareee"), tell the user
  const [error, setError] = useState({ 'status': false, 'word': '' });

  async function getWordFromAPI() {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
        'X-RapidAPI-Key': '06678c9f50msh8e8dc3e7442f9f3p14404djsne386b9f689a7'
      }
    }

    try {
      const getJson = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`, options);
      if (!GoodHTMLResponse(getJson.status)) {
        setError({ 'status': true, 'word': word });
        setDefinitions([]);
        setIsLoading(false);
        return;
      }
      const json = await getJson.json();
      setDefinitions(json);
      setError({ 'status': false, 'word': '' });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
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
    return (
      <article
        key={word}
        className={`${truncated && `overflow-hidden max-h-64 `}shadow bg-white rounded p-4 pb-16 mb-10 sm:pb-20 relative`}>
        {inLexicon
          ? <button
            className='bg-white text-red-700 hover:text-white hover:bg-red-700 px-4 py-2 rounded-full absolute top-4 right-4 sm:top-4 sm:right-4'
            onClick={() => dispatch({ type: ACTION.REMOVEWORD, word })}>
            <TrashIcon className="h-5 w-5" />
          </button>
          :
          <>
            <button
              onClick={() => {
                dispatch({ type: ACTION.ADDWORD, newWord: { word, definitions: [...definitions] } });
                setDefinitions('');
              }}
              className='bg-green-300 hover:bg-green-400 px-4 py-2 rounded-full absolute top-4 right-4 sm:top-4 sm:right-4 flex items-center'>
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add to Lexicon
            </button>
          </>
        }
        <header className='flex'>
          <h3 className='text-2xl font-semibold uppercase tracking-widest'>{word}</h3>
          <p>{numberOfDefinitions}</p>
        </header>
        {definitions.map(({ definition, partOfSpeech }) =>
          <dl key={definition} className='flex mt-2'>
            <dt className=' mr-2'>
              <span className={`font-serif ${getPartOfSpeech(partOfSpeech)}`}>{partOfSpeech}</span>
            </dt>
            <dd className='text-base'>{definition}</dd>
          </dl>
        )}
        {truncated ?
          <footer className='bg-gradient-to-t from-white absolute left-0 right-0 bottom-0 h-10'>
            <button
              onClick={() => handleSetShowMore(i)}
              className='bg-gray-500 text-white px-4 py-2 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2'
            >Show more</button>
          </footer>
          :
          <footer className='absolute left-0 right-0 bottom-0 h-10'>
            <button
              onClick={() => handleSetShowMore(i)}
              className='bg-gray-100 px-4 py-2 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2'
            >Show less</button>
          </footer>
        }
      </article>
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
      {isLoading && <Spinner></Spinner>}
      <header
        className='bg-zinc-900 sm:flex align-center justify-between px-5 py-2 items-center'>
        <div
          className='flex items-center'>
          <BookOpenIcon className="h-7 w-7 text-white mr-2" />
          <h1 className='text-2xl text-white'>Lexicon</h1>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          setIsLoading(true);
          getWordFromAPI();
          setWord('');
        }}
          className='flex'
        >
          <input
            className='form-control px-3 py-2 rounded-l-lg'
            type='text'
            value={word || ''}
            onChange={e => setWord(e.target.value)} />
          <button
            className='bg-green-300 hover:bg-green-400 rounded-r-lg  px-4 py-2'
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          {/* <button type='submit' className='bg-blue-500 rounded-lg text-white px-4 py-2'>Add new word to collection</button> */}
        </form>
      </header>
      <nav>
      </nav>
      <div className='container p-4 sm:p-10 mx-auto'>
        {error.status
          && <h3 className='text-2xl text-center mb-4'>Could not find a definition for
            <span className='font-bold'>{error.word}</span>
            . Please try again</h3>
        }
        {!error.status && definitions && ShowDefinitionList(definitions)}
        <ShowLexicon lexicon={lexicon}></ShowLexicon>
      </div>
      {/* Look up a word (and its synonyms, antonyms, etc.) */}
    </div>
  );
}

export default App;