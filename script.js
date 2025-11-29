const txtInput = document.querySelector('#txtInput');
const voiceFilter = document.querySelector('#voiceFilter');
const voiceList = document.querySelector('#voiceList');
const btnSpeak = document.querySelector('#btnSpeak');
const pitchSpeak = document.querySelector('#pitch');
const volSpeak = document.querySelector('#vol');
const rateSpeak = document.querySelector('#rate');
const synth = window.speechSynthesis;
const voices = synth.getVoices();

// sort by name alphabetically
voices.sort((a,b) => a.name.localeCompare(b.name))

var voice;

btnSpeak.addEventListener('click', () => {
	var toSpeak = new SpeechSynthesisUtterance(txtInput.value);
	toSpeak.voice = voice;
	toSpeak.pitch = pitchSpeak.value / 50;//from 0 to 2
	toSpeak.volume = volSpeak.value / 100;//from 0 to 1
	toSpeak.rate = 0.1 + rateSpeak.value / (10 + 1 / 9.9);// from 0.1 to 10
	synth.cancel();
	synth.speak(toSpeak);
});

PopulateVoices();
if (speechSynthesis !== undefined) {
	speechSynthesis.onvoiceschanged = applyFilter;
}

voiceList.onchange = () => {
	synth.getVoices().forEach((tvoice) => {
		if (voiceList.value == tvoice.name) {
			voice = tvoice;
		}
	});
};
function PopulateVoices() {
	for (let voice of voices) {
		if (!voice.name.includes(voiceFilter.value)) {
			continue;
		}
		var listItem = document.createElement('option');
		listItem.textContent = voice.name;
		listItem.setAttribute('data-lang', voice.lang);
		listItem.setAttribute('data-name', voice.name);
		voiceList.appendChild(listItem);
	}
}
function applyFilter() {
	ClearVoices();
	PopulateVoices();
}
function ClearVoices() {
	const children = voiceList.children.length;
	for (let i = 0; i < children; i++) {
		voiceList.removeChild(voiceList.children[0]);
	}
}