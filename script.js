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

// to make filtering more performant, use a map which has the name which is the filter key
// (some OS&browser pairs result in 13000+ voices)
const voicesMap = new Map();
for (let voice of voices) {
	voicesMap.set(voice.name.trim(), voice);
}

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
	const key = voiceList.value;
	if (voicesMap.has(key)) {
		voice = voicesMap.get(key);
	}
};
function PopulateVoices() {
	const filter = voiceFilter.value.trim();
	const keys = voicesMap.keys().filter(name => filter == '' || name.includes(filter));

	for (let name of keys) {
		const listItem = document.createElement('option');
		listItem.textContent = name;
		listItem.setAttribute('data-lang', voicesMap.get(name).lang);
		listItem.setAttribute('data-name', voicesMap.get(name).name);
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