import { numberInFullConverter } from '../helpers/writeNumberInFull.js';

window.addEventListener('load', () => {
  const inputNumber = document.querySelector('#inputNumber');
  const inputText = document.querySelector('#inputText');
  const button = document.querySelector('#button');
});

button.addEventListener('click', handleClick);

// Pode ser render
function handleClick() {
  const numberValue = inputNumber.value;
  inputText.value = numberInFullConverter(numberValue);
}
