import React from 'react';
import TutorialModeUI from '@/components/TutorialModeUI';

interface Props {
  tutorialMode: boolean;
  buttonExplanation: string | null;
  tutorialStatements: Record<string, string>;
}

const TutorialTextOverlay: React.FC<Props> = ({
  tutorialMode,
  buttonExplanation,
  tutorialStatements,
}) => {
  const text = tutorialMode
    ? tutorialStatements[buttonExplanation ?? ''] || tutorialStatements.helpButton
    : null;

  return <TutorialModeUI text={text} />;
};

export default TutorialTextOverlay;
