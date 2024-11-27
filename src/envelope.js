function open_envelope() {
	var envelope = document.getElementById("envelope");
	envelope.classList.remove("closed");
	envelope.classList.add("open");
	var letter = document.getElementById("letter");
	letter.classList.remove("closed");
	letter.classList.add("open");
}
function close_envelope() {
	var letter = document.getElementById("letter");
	letter.classList.remove("open");
	letter.classList.add("closed");
	var envelope = document.getElementById("envelope");
	envelope.classList.remove("open");
	envelope.classList.add("closed");
}