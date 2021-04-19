let CONSTANTS = new (function() {

	// Stående input, vissa ändras per år
	this.grundavdrag = this.G1 = 14000;
	this.grans_statlig = this.G2 = 523200;
	this.G3 = this.G1 + this.G2;
	this.G4 = this.G3 / 12;
	this.ag = this.G5 = 0.3142; // %
	this.kommunalskatt = this.G6 = 0.30; // %
	this.statlig_inkomstskatt = this.G7 = 0.20; // %
	this.vinstskatt = this.G8 = 0.2060; // %
	this.skatt_pension = this.G9 = 0.2426; // %
	this.ibb = this.G10 = 68200;
	this.schablon = this.G11 = 183700;
	this.avgift_rw_bas = this.G12 = 499;
	//this.avgift_rw_rorlig = this.G13 = 0.0249; // %
	//this.grans_rw_rorlig_under = this.G14 = 200000;
	this.grans_rw_rorlig_over = this.G15 = 1200000;
	this.skatt_utdelning = this.G16 = 0.20; // %
	this.G17 = 0.2897; // %
	this.G18 = 15000; // Ett värde som motsvarar typ enklare försäkring, bokföring etc ink i RW

})();

let avgift_rw_rorlig_tabell = [
	[100000, 0.045],
	[200000, 0.04],
	[300000, 0.035],
	[400000, 0.03],
	[500000, 0.025],
	[600000, 0.02],
	[700000, 0.018],
	[800000, 0.016],
	[900000, 0.014],
	[1000000, 0.012],
	[1100000, 0.01],
	[1200000, 0.008]
];

let jobbskatteavdragTabell = [
	{ brutto:  100000, netto:  74200, avdrag: 10004 },
	{ brutto:  150000, netto: 109200, avdrag: 13636 },
	{ brutto:  200000, netto: 144200, avdrag: 17442 },
	{ brutto:  250000, netto: 179200, avdrag: 21035 },
	{ brutto:  300000, netto: 214200, avdrag: 24628 },
	{ brutto:  350000, netto: 249200, avdrag: 28221 },
	{ brutto:  400000, netto: 284200, avdrag: 30252 },
	{ brutto:  500000, netto: 354200, avdrag: 30252 },
	{ brutto:  600000, netto: 408800, avdrag: 30252 },
	{ brutto:  700000, netto: 458800, avdrag: 28465 },
	{ brutto:  900000, netto: 558800, avdrag: 22466 },
	{ brutto: 1100000, netto: 658800, avdrag: 16466 },
	{ brutto: 1300000, netto: 758800, avdrag: 10465 },
	{ brutto: 1500000, netto: 858800, avdrag:  4465 },
	{ brutto: Infinity, netto: Infinity, avdrag:  0 },
];

function getJobbskatteavdragFromBrutto(brutto) {

	for (let i = 0; i < jobbskatteavdragTabell.length; i++) {
		if(brutto <= jobbskatteavdragTabell[i].brutto) {
			return jobbskatteavdragTabell[i].avdrag;
		}
	}
	console.error('Couldn\'t return jobbskatteavdrag for brutto: ' + brutto);
	return 0;
};

function getJobbskatteavdragFromNetto(netto) {
	for (let i = 0; i < jobbskatteavdragTabell.length; i++) {
		if(netto <= jobbskatteavdragTabell[i].netto) {
			return jobbskatteavdragTabell[i].avdrag;
		}
	}
	console.error('Couldn\'t return jobbskatteavdrag for netto: ' + netto);
	return 0;
}


