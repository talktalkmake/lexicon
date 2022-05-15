const getPartOfSpeech = wordType => {
    switch(wordType){
      case 'noun':
        return 'bg-emerald-100';
      case 'verb':
        return 'bg-indigo-100';
      case 'adverb':
        return 'bg-lime-100';
      case 'adjective':
        return 'bg-rose-100';
      default:
        return 'red';
    }
  }
  export default getPartOfSpeech;