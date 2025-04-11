export const toggleTutorialMode = (setTutorialMode, setClickedElements, setButtonExplanation) => {
    setTutorialMode((prev) => !prev);
    setClickedElements({});
    setButtonExplanation(null);
  };
  
  export const handleTutorialClick = (id, tutorialMode, setClickedElements, setButtonExplanation) => {
    if (!tutorialMode) return;
    setClickedElements((prev) => (prev[id] ? {} : { [id]: true }));
    setButtonExplanation((prev) => (prev === id ? null : id));
  };
  
  export const getTutorialStyle = (tutorialMode, clickedElements, id) =>
    tutorialMode
      ? {
          borderWidth: 4,
          borderColor: clickedElements[id] ? '#FFC067' : '#FF0000',
          borderStyle: 'solid',
        }
      : {};
  