function calculateValues(input) {
	
	for (const [key, value] of Object.entries(CONSTANTS)) {
  		this[key] = value;
	}

	let M  = input.MONTHLY ? 1 : 0;
	let V  = input.WEEKLY ? 1 : 0;
	let L2 = input.lon_annan_anstallning;
	let T1 = input.timarvode;
	let T2 = input.antal_timmar;
	let L1 = input.onskad_lon_brutto_manad;
	let K1 = input.kostnader;
	let P1 = input.pension ? 4000 : 0;
	let B1 = input.bil ? 3500 : 0;
	let B2 = input.bil ? 4000 : 0;
	let F1 = input.rnd ? 0.10 : 0;
	let U2 = input.utdelning;

	if (input.WEEKLY) {
		T1 = input.veckoarvode;
		T2 = input.antal_veckor;
		L1 = input.onskad_lon_brutto_vecka;
	}

// -----------------------------------------------------------------
	let total_lon_bolaget = Tt = L1*12*M+L1*T2*V;
	let total_lon_tot = Ttot = Tt+L2*12;
	
	let arbetsgivaravgift = A1 = Tt*(G5-F1); // ??? hmmm
	let kommunalskatt = A2 = (Tt-G1)*G6;
	let statlig_inkomstskatt = A3 = (Ttot-G3)*G7; // EJ NEGATIV
	// TODO revise with Putte
	if (A3 < 0) {
		statlig_inkomstskatt = A3 = 0;
	}

	if (statlig_inkomstskatt < 0) {
		console.error('Statlig inkomstskatt can\'t be negative: ' + statlig_inkomstskatt);
	}
	let jobbskatteavdrag = J1 = getJobbskatteavdragFromBrutto(Ttot);

	let kommunalskatt_L2 = A4 = L2*12*G6;

	let lon_netto_Tt = Nt = Tt-A2-A3+J1;
	let lon_netto_Ttot = Ntot = L2*12-A4+Nt;

	let pensionkostnad_skatt = Pt = P1*G9*12;
	let skatt_forman_bil = Bt = B1*(G5+G6)*12;

	let lonekostnader = Ltot = Tt+A1+Pt+Bt;

// -----------------------------------------------------------------

	let omsattning = O1 = T1*T2;
	let RW = calculateRW();
	let kostnader_personal = R1 = Ltot+P1*12;
	let kostnader = R2 = K1*12+B2*12+RW;

	let vinst = V1 = O1-R1-R2;
	let skatt = S1 = V1*0.22; // Double check with Putte TODO change 0.22 -> G8
	let Vt = V1-S1;

// -----------------------------------------------------------------

	let UH = 6*G10+6*G10*0.05;

	let utdelningsmojlighet = U1 = 6*(L1+B1); // Huvudregeln
	if (UH > Tt) { // Schablonregeln
		utdelningsmojlighet = U1 = G11;
	}
	if (U1 > Vt) {
		console.error('U1 (utdelningsmöjlighet) is bigger than Vt');
	}

// -----------------------------------------------------------------

	let netto = N1 = U2-U2*G16;
	let netto_manad = N2 = (Ntot+N1)/12; // Netto per månad
	let motsvarande_lon_manad = LM = calculateMotsvarandeLon();
	let overskott = R3 = Vt-U2;


// -----------------------------------------------------------------
// Enskild firma
// -----------------------------------------------------------------

	let skatter_for_bil_och_pension = Ke = Pt+Bt;
	let La = L2*12; // Lön annan anställning
	let personal_enskild = Pe = O1-R2-Ke;
	let beskattningsbar_forvarvsinkomst = Be = Pe*0.75-G1+La;
	let kommunal_inkomstskatt = Se1 = Be*G6;
	let Se2 = (Be-G2)*G7; //statlig_inkomstskatt EJ negativ
	if (Se2 < 0) {
		console.error('Statlig inkomstskatt Se2 is negative');
		Se2 = 0;
	}
	let nedsattning_av_egenavgift = Ne = Pe*0.075;
	if (Ne > 15000) {
		nedsattning_av_egenavgift = Ne = 15000;
	}
	let egenavgifter = Ee = Be*G17-Ne;
	let jobbskatteavdrag_enskild = Je = getJobbskatteavdragFromBrutto(Be);
	let skatt_enskild = Set_ = Se1+Se2+Ee-Je;
	let netto_enskild = Net = Pe+La-Set_;

	let motsvarande_lon_enskild_manad = calculateMotsvarandeLonEnskild();
	let netto_enskild_manad = Net12 = Net/12;

// -----------------------------------------------------------------

	let output = {
		'omsattning': omsattning,
		'personal': kostnader_personal,
		'kostnader': kostnader,
		'vinst': vinst,
		'skatt': skatt,
		'skatt_enskild': skatt_enskild,
		'utdelningsmojlighet': { min: 0, max: utdelningsmojlighet },
		'netto_manad': netto_manad,
		'netto_enskild_manad': netto_enskild_manad,
		'motsvarande_lon_manad': motsvarande_lon_manad,
		'motsvarande_lon_enskild_manad': motsvarande_lon_enskild_manad,
		'overskott': overskott,
		'rw': RW
	};

	function calculateRW() {
		let diff = O1-G14;
		if ( diff < 0) {
			return G12*12;
		} else if (diff < 1000000) {
			return G12*12+G13*diff;
		} else {
			return G12*12+G13*(G15-G14);
		}
	}
	function calculateMotsvarandeLon() {
		let tabellvarde_jobbskatteavdrag = W1 = N2*12-G1*G6;
		let netto_excl_jobbskatteavdrag = W2 = getJobbskatteavdragFromNetto(W1);
		let W3 = W1-W2;

		let grans_statlig_netto = W11 = (G1+G2)*(1-G6);
		
		let LM = W3/(1-G6)/12;
		if (W3 > W11) {
			let W4 = (G1+G2)*G6;
			let W5 = (W3-G1-G2+W4)/(G6+G7);
			LM = (W11+W4+W5)/12;
		}
		return LM;
	}
	function calculateMotsvarandeLonEnskild() { // TODO this is same as above except N2 / Net
		let tabellvarde_jobbskatteavdrag_enskild = We1 = Net-G1*G6;
		let netto_excl_jobbskatteavdrag_enskild = We2 = getJobbskatteavdragFromNetto(We1);
		let We3 = We1-We2;

		let grans_statlig_netto_enskild = We11 = (G1+G2)*(1-G6);

		let LMe = We3/(1-G6)/12;
		if (We3 > We11) {
			let We4 = (G1+G2)*G6;
			let We5 = (We3-G1-G2+We4)/(G6+G7);
			LMe = (We11+We4+We5)/12;
		}
		return LMe;
	}

	return output;
}






