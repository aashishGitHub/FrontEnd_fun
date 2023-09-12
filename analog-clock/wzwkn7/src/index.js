(function () {
  const hourHand = document.querySelector(".hour");
  const minuteHand = document.querySelector(".minute");
  const secondHand = document.querySelector(".second");

  const setTime = function () {
    const time = new Date();
    const sec = time.getSeconds();
    const secDeg = (sec / 60) * 360 - 90;
    if (secondHand) {
      secondHand.style.transform = `rotate(${secDeg}deg)`;
    }
    const min = time.getMinutes();
    const minDeg = ((min/60 * 360) + (sec/60)/60 * 360) - 90;
    minuteHand.style.transform = `rotate(${minDeg}deg)`;


    const hour = time.getHours();
    const hourDeg = hour/12 * 360 + (((min / 60)/60 * 360) + ((sec / 60) / 60)/60 * 360) - 90;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;

  };
  setTime();
  setInterval(setTime, 1000);
})();
