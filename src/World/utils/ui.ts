function fadeElement(element: HTMLElement, init_opacity: number, final_opacity: number, remove: boolean, duration: number) {
  var op = init_opacity;  // initial opacity
  const timeInterval = 10; //in ms
  var decrement = (init_opacity - final_opacity) * timeInterval / duration;
  var timer = setInterval(function () {
      if (op <= final_opacity){
          clearInterval(timer);
          if (remove) {
            element.style.display = 'none';
          }
      }
      element.style.opacity = op.toString();
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op -= decrement;
  }, timeInterval);
}

export { fadeElement }