let keyboard = {};

document.addEventListener("keydown", function (event) {
	keyboard[event.code] = true;
});
document.addEventListener("keyup", function (event) {
	keyboard[event.code] = false;
});

export { keyboard }