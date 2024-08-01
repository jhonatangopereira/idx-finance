import { useState } from 'react';
import Styles from './component.module.css';

export default function ConfirmPopup ({ text, onClose }: { text: string, onClose: (result: boolean) => void }) {
  return (
    <div className={Styles.Popup}>
      <p>{text}</p>
      <div>
        <button onClick={() => onClose(false)}>Não</button>
        <button onClick={() => onClose(true)}>Sim</button>
      </div>
    </div>
  );
}
