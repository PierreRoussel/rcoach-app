import { useState } from 'react';
import './RessentiButton.scss';

export default function RessentiButton(props: any) {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <button
      className={`ressenti-button ${
        isSelected ? 'ressenti-button--selected' : ''
      }`}
      style={{ flex: 1 }}
      onClick={() => {
        setIsSelected(true);
        return props.ressentiSelected(props.id);
      }}
    >
      <i
        style={{
          background: `var(--${props.couleur})`,
          color: `var(--${props.couleur}-dark)`,
        }}
        className={'iconoir-' + props.icone}
      />
      <span>{props.libelle}</span>
    </button>
  );
}
