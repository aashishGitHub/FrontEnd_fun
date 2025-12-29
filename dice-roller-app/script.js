
(() =>{

  function generateDiceNumber () {
     return Math.floor(Math.random() * 6) + 1;
  } 
  function generateDiceNumbers (numberOfDice) {
    return Array.from({ length: numberOfDice }, () => generateDiceNumber());
  }
  function displayDiceNumbers (diceNumbers) {
    const diceContainer = document.querySelector('.dice-container');
    diceContainer.innerHTML = diceNumbers.map(number => `<div class="dice-face">${number}</div>`).join('');
  }
  function rollDice () {
    const numberOfDice = document.querySelector('#dice-input').value;
    const diceNumbers = generateDiceNumbers(numberOfDice);
    displayDiceNumbers(diceNumbers);
  }

  function resetDice () {
    const diceContainer = document.querySelector('.dice-container');
    diceContainer.innerHTML = '';
    document.querySelector('#dice-input').value = '';
  }
  document.querySelector('#roll-button')?.addEventListener('click', rollDice);
  document.querySelector('#reset-button')?.addEventListener('click', resetDice);
})();