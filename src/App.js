import './css/main.css';

function App() {
  return (
    <div className="App">
      <h1 className='text-5xl'>Lexicon</h1>
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
