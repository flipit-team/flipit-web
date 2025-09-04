export interface LGA {
  name: string;
  code: string;
}

export interface State {
  name: string;
  code: string;
  lgas: LGA[];
}

export interface Country {
  name: string;
  code: string;
  states: State[];
}

// Nigerian States with their Local Government Areas
export const NIGERIAN_LOCATIONS: Country = {
  name: 'Nigeria',
  code: 'NG',
  states: [
    {
      name: 'Abia',
      code: 'AB',
      lgas: [
        { name: 'Aba North', code: 'ABA_N' },
        { name: 'Aba South', code: 'ABA_S' },
        { name: 'Arochukwu', code: 'AROCHUKWU' },
        { name: 'Bende', code: 'BENDE' },
        { name: 'Ikwuano', code: 'IKWUANO' },
        { name: 'Isiala Ngwa North', code: 'ISIALA_N' },
        { name: 'Isiala Ngwa South', code: 'ISIALA_S' },
        { name: 'Isuikwuato', code: 'ISUIKWUATO' },
        { name: 'Obi Ngwa', code: 'OBI_NGWA' },
        { name: 'Ohafia', code: 'OHAFIA' },
        { name: 'Osisioma', code: 'OSISIOMA' },
        { name: 'Ugwunagbo', code: 'UGWUNAGBO' },
        { name: 'Ukwa East', code: 'UKWA_E' },
        { name: 'Ukwa West', code: 'UKWA_W' },
        { name: 'Umuahia North', code: 'UMUAHIA_N' },
        { name: 'Umuahia South', code: 'UMUAHIA_S' },
        { name: 'Umu Nneochi', code: 'UMU_NNEOCHI' }
      ]
    },
    {
      name: 'Adamawa',
      code: 'AD',
      lgas: [
        { name: 'Demsa', code: 'DEMSA' },
        { name: 'Fufure', code: 'FUFURE' },
        { name: 'Ganye', code: 'GANYE' },
        { name: 'Gayuk', code: 'GAYUK' },
        { name: 'Gombi', code: 'GOMBI' },
        { name: 'Grie', code: 'GRIE' },
        { name: 'Hong', code: 'HONG' },
        { name: 'Jada', code: 'JADA' },
        { name: 'Lamurde', code: 'LAMURDE' },
        { name: 'Madagali', code: 'MADAGALI' },
        { name: 'Maiha', code: 'MAIHA' },
        { name: 'Mayo Belwa', code: 'MAYO_BELWA' },
        { name: 'Michika', code: 'MICHIKA' },
        { name: 'Mubi North', code: 'MUBI_N' },
        { name: 'Mubi South', code: 'MUBI_S' },
        { name: 'Numan', code: 'NUMAN' },
        { name: 'Shelleng', code: 'SHELLENG' },
        { name: 'Song', code: 'SONG' },
        { name: 'Toungo', code: 'TOUNGO' },
        { name: 'Yola North', code: 'YOLA_N' },
        { name: 'Yola South', code: 'YOLA_S' }
      ]
    },
    {
      name: 'Akwa Ibom',
      code: 'AK',
      lgas: [
        { name: 'Abak', code: 'ABAK' },
        { name: 'Eastern Obolo', code: 'EASTERN_OBOLO' },
        { name: 'Eket', code: 'EKET' },
        { name: 'Esit Eket', code: 'ESIT_EKET' },
        { name: 'Essien Udim', code: 'ESSIEN_UDIM' },
        { name: 'Etim Ekpo', code: 'ETIM_EKPO' },
        { name: 'Etinan', code: 'ETINAN' },
        { name: 'Ibeno', code: 'IBENO' },
        { name: 'Ibesikpo Asutan', code: 'IBESIKPO_ASUTAN' },
        { name: 'Ibiono-Ibom', code: 'IBIONO_IBOM' },
        { name: 'Ika', code: 'IKA' },
        { name: 'Ikono', code: 'IKONO' },
        { name: 'Ikot Abasi', code: 'IKOT_ABASI' },
        { name: 'Ikot Ekpene', code: 'IKOT_EKPENE' },
        { name: 'Ini', code: 'INI' },
        { name: 'Itu', code: 'ITU' },
        { name: 'Mbo', code: 'MBO' },
        { name: 'Mkpat-Enin', code: 'MKPAT_ENIN' },
        { name: 'Nsit-Atai', code: 'NSIT_ATAI' },
        { name: 'Nsit-Ibom', code: 'NSIT_IBOM' },
        { name: 'Nsit-Ubium', code: 'NSIT_UBIUM' },
        { name: 'Obot Akara', code: 'OBOT_AKARA' },
        { name: 'Okobo', code: 'OKOBO' },
        { name: 'Onna', code: 'ONNA' },
        { name: 'Oron', code: 'ORON' },
        { name: 'Oruk Anam', code: 'ORUK_ANAM' },
        { name: 'Udung-Uko', code: 'UDUNG_UKO' },
        { name: 'Ukanafun', code: 'UKANAFUN' },
        { name: 'Uruan', code: 'URUAN' },
        { name: 'Urue-Offong/Oruko', code: 'URUE_OFFONG_ORUKO' },
        { name: 'Uyo', code: 'UYO' }
      ]
    },
    {
      name: 'Anambra',
      code: 'AN',
      lgas: [
        { name: 'Aguata', code: 'AGUATA' },
        { name: 'Anambra East', code: 'ANAMBRA_E' },
        { name: 'Anambra West', code: 'ANAMBRA_W' },
        { name: 'Anaocha', code: 'ANAOCHA' },
        { name: 'Awka North', code: 'AWKA_N' },
        { name: 'Awka South', code: 'AWKA_S' },
        { name: 'Ayamelum', code: 'AYAMELUM' },
        { name: 'Dunukofia', code: 'DUNUKOFIA' },
        { name: 'Ekwusigo', code: 'EKWUSIGO' },
        { name: 'Idemili North', code: 'IDEMILI_N' },
        { name: 'Idemili South', code: 'IDEMILI_S' },
        { name: 'Ihiala', code: 'IHIALA' },
        { name: 'Njikoka', code: 'NJIKOKA' },
        { name: 'Nnewi North', code: 'NNEWI_N' },
        { name: 'Nnewi South', code: 'NNEWI_S' },
        { name: 'Ogbaru', code: 'OGBARU' },
        { name: 'Onitsha North', code: 'ONITSHA_N' },
        { name: 'Onitsha South', code: 'ONITSHA_S' },
        { name: 'Orumba North', code: 'ORUMBA_N' },
        { name: 'Orumba South', code: 'ORUMBA_S' },
        { name: 'Oyi', code: 'OYI' }
      ]
    },
    {
      name: 'Bauchi',
      code: 'BA',
      lgas: [
        { name: 'Alkaleri', code: 'ALKALERI' },
        { name: 'Bauchi', code: 'BAUCHI' },
        { name: 'Bogoro', code: 'BOGORO' },
        { name: 'Damban', code: 'DAMBAN' },
        { name: 'Darazo', code: 'DARAZO' },
        { name: 'Dass', code: 'DASS' },
        { name: 'Gamawa', code: 'GAMAWA' },
        { name: 'Ganjuwa', code: 'GANJUWA' },
        { name: 'Giade', code: 'GIADE' },
        { name: 'Itas/Gadau', code: 'ITAS_GADAU' },
        { name: 'Jama\'are', code: 'JAMAARE' },
        { name: 'Katagum', code: 'KATAGUM' },
        { name: 'Kirfi', code: 'KIRFI' },
        { name: 'Misau', code: 'MISAU' },
        { name: 'Ningi', code: 'NINGI' },
        { name: 'Shira', code: 'SHIRA' },
        { name: 'Tafawa Balewa', code: 'TAFAWA_BALEWA' },
        { name: 'Toro', code: 'TORO' },
        { name: 'Warji', code: 'WARJI' },
        { name: 'Zaki', code: 'ZAKI' }
      ]
    },
    {
      name: 'Bayelsa',
      code: 'BY',
      lgas: [
        { name: 'Brass', code: 'BRASS' },
        { name: 'Ekeremor', code: 'EKEREMOR' },
        { name: 'Kolokuma/Opokuma', code: 'KOLOKUMA_OPOKUMA' },
        { name: 'Nembe', code: 'NEMBE' },
        { name: 'Ogbia', code: 'OGBIA' },
        { name: 'Sagbama', code: 'SAGBAMA' },
        { name: 'Southern Ijaw', code: 'SOUTHERN_IJAW' },
        { name: 'Yenagoa', code: 'YENAGOA' }
      ]
    },
    {
      name: 'Benue',
      code: 'BE',
      lgas: [
        { name: 'Ado', code: 'ADO' },
        { name: 'Agatu', code: 'AGATU' },
        { name: 'Apa', code: 'APA' },
        { name: 'Buruku', code: 'BURUKU' },
        { name: 'Gboko', code: 'GBOKO' },
        { name: 'Guma', code: 'GUMA' },
        { name: 'Gwer East', code: 'GWER_E' },
        { name: 'Gwer West', code: 'GWER_W' },
        { name: 'Katsina-Ala', code: 'KATSINA_ALA' },
        { name: 'Konshisha', code: 'KONSHISHA' },
        { name: 'Kwande', code: 'KWANDE' },
        { name: 'Logo', code: 'LOGO' },
        { name: 'Makurdi', code: 'MAKURDI' },
        { name: 'Obi', code: 'OBI' },
        { name: 'Ogbadibo', code: 'OGBADIBO' },
        { name: 'Ohimini', code: 'OHIMINI' },
        { name: 'Oju', code: 'OJU' },
        { name: 'Okpokwu', code: 'OKPOKWU' },
        { name: 'Oturkpo', code: 'OTURKPO' },
        { name: 'Tarka', code: 'TARKA' },
        { name: 'Ukum', code: 'UKUM' },
        { name: 'Ushongo', code: 'USHONGO' },
        { name: 'Vandeikya', code: 'VANDEIKYA' }
      ]
    },
    {
      name: 'Borno',
      code: 'BO',
      lgas: [
        { name: 'Abadam', code: 'ABADAM' },
        { name: 'Askira/Uba', code: 'ASKIRA_UBA' },
        { name: 'Bama', code: 'BAMA' },
        { name: 'Bayo', code: 'BAYO' },
        { name: 'Biu', code: 'BIU' },
        { name: 'Chibok', code: 'CHIBOK' },
        { name: 'Damboa', code: 'DAMBOA' },
        { name: 'Dikwa', code: 'DIKWA' },
        { name: 'Gubio', code: 'GUBIO' },
        { name: 'Guzamala', code: 'GUZAMALA' },
        { name: 'Gwoza', code: 'GWOZA' },
        { name: 'Hawul', code: 'HAWUL' },
        { name: 'Jere', code: 'JERE' },
        { name: 'Kaga', code: 'KAGA' },
        { name: 'Kala/Balge', code: 'KALA_BALGE' },
        { name: 'Konduga', code: 'KONDUGA' },
        { name: 'Kukawa', code: 'KUKAWA' },
        { name: 'Kwaya Kusar', code: 'KWAYA_KUSAR' },
        { name: 'Mafa', code: 'MAFA' },
        { name: 'Magumeri', code: 'MAGUMERI' },
        { name: 'Maiduguri', code: 'MAIDUGURI' },
        { name: 'Marte', code: 'MARTE' },
        { name: 'Mobbar', code: 'MOBBAR' },
        { name: 'Monguno', code: 'MONGUNO' },
        { name: 'Ngala', code: 'NGALA' },
        { name: 'Nganzai', code: 'NGANZAI' },
        { name: 'Shani', code: 'SHANI' }
      ]
    },
    {
      name: 'Cross River',
      code: 'CR',
      lgas: [
        { name: 'Abi', code: 'ABI' },
        { name: 'Akamkpa', code: 'AKAMKPA' },
        { name: 'Akpabuyo', code: 'AKPABUYO' },
        { name: 'Bakassi', code: 'BAKASSI' },
        { name: 'Bekwarra', code: 'BEKWARRA' },
        { name: 'Biase', code: 'BIASE' },
        { name: 'Boki', code: 'BOKI' },
        { name: 'Calabar Municipal', code: 'CALABAR_MUNICIPAL' },
        { name: 'Calabar South', code: 'CALABAR_S' },
        { name: 'Etung', code: 'ETUNG' },
        { name: 'Ikom', code: 'IKOM' },
        { name: 'Obanliku', code: 'OBANLIKU' },
        { name: 'Obubra', code: 'OBUBRA' },
        { name: 'Obudu', code: 'OBUDU' },
        { name: 'Odukpani', code: 'ODUKPANI' },
        { name: 'Ogoja', code: 'OGOJA' },
        { name: 'Yakuur', code: 'YAKUUR' },
        { name: 'Yala', code: 'YALA' }
      ]
    },
    {
      name: 'Delta',
      code: 'DE',
      lgas: [
        { name: 'Aniocha North', code: 'ANIOCHA_N' },
        { name: 'Aniocha South', code: 'ANIOCHA_S' },
        { name: 'Bomadi', code: 'BOMADI' },
        { name: 'Burutu', code: 'BURUTU' },
        { name: 'Ethiope East', code: 'ETHIOPE_E' },
        { name: 'Ethiope West', code: 'ETHIOPE_W' },
        { name: 'Ika North East', code: 'IKA_NE' },
        { name: 'Ika South', code: 'IKA_S' },
        { name: 'Isoko North', code: 'ISOKO_N' },
        { name: 'Isoko South', code: 'ISOKO_S' },
        { name: 'Ndokwa East', code: 'NDOKWA_E' },
        { name: 'Ndokwa West', code: 'NDOKWA_W' },
        { name: 'Okpe', code: 'OKPE' },
        { name: 'Oshimili North', code: 'OSHIMILI_N' },
        { name: 'Oshimili South', code: 'OSHIMILI_S' },
        { name: 'Patani', code: 'PATANI' },
        { name: 'Sapele', code: 'SAPELE' },
        { name: 'Udu', code: 'UDU' },
        { name: 'Ughelli North', code: 'UGHELLI_N' },
        { name: 'Ughelli South', code: 'UGHELLI_S' },
        { name: 'Ukwuani', code: 'UKWUANI' },
        { name: 'Uvwie', code: 'UVWIE' },
        { name: 'Warri North', code: 'WARRI_N' },
        { name: 'Warri South', code: 'WARRI_S' },
        { name: 'Warri South West', code: 'WARRI_SW' }
      ]
    },
    {
      name: 'Ebonyi',
      code: 'EB',
      lgas: [
        { name: 'Abakaliki', code: 'ABAKALIKI' },
        { name: 'Afikpo North', code: 'AFIKPO_N' },
        { name: 'Afikpo South', code: 'AFIKPO_S' },
        { name: 'Ebonyi', code: 'EBONYI' },
        { name: 'Ezza North', code: 'EZZA_N' },
        { name: 'Ezza South', code: 'EZZA_S' },
        { name: 'Ikwo', code: 'IKWO' },
        { name: 'Ishielu', code: 'ISHIELU' },
        { name: 'Ivo', code: 'IVO' },
        { name: 'Izzi', code: 'IZZI' },
        { name: 'Ohaozara', code: 'OHAOZARA' },
        { name: 'Ohaukwu', code: 'OHAUKWU' },
        { name: 'Onicha', code: 'ONICHA' }
      ]
    },
    {
      name: 'Edo',
      code: 'ED',
      lgas: [
        { name: 'Akoko-Edo', code: 'AKOKO_EDO' },
        { name: 'Egor', code: 'EGOR' },
        { name: 'Esan Central', code: 'ESAN_CENTRAL' },
        { name: 'Esan North-East', code: 'ESAN_NE' },
        { name: 'Esan South-East', code: 'ESAN_SE' },
        { name: 'Esan West', code: 'ESAN_W' },
        { name: 'Etsako Central', code: 'ETSAKO_CENTRAL' },
        { name: 'Etsako East', code: 'ETSAKO_E' },
        { name: 'Etsako West', code: 'ETSAKO_W' },
        { name: 'Igueben', code: 'IGUEBEN' },
        { name: 'Ikpoba Okha', code: 'IKPOBA_OKHA' },
        { name: 'Oredo', code: 'OREDO' },
        { name: 'Orhionmwon', code: 'ORHIONMWON' },
        { name: 'Ovia North-East', code: 'OVIA_NE' },
        { name: 'Ovia South-West', code: 'OVIA_SW' },
        { name: 'Owan East', code: 'OWAN_E' },
        { name: 'Owan West', code: 'OWAN_W' },
        { name: 'Uhunmwonde', code: 'UHUNMWONDE' }
      ]
    },
    {
      name: 'Ekiti',
      code: 'EK',
      lgas: [
        { name: 'Ado Ekiti', code: 'ADO_EKITI' },
        { name: 'Efon', code: 'EFON' },
        { name: 'Ekiti East', code: 'EKITI_E' },
        { name: 'Ekiti South-West', code: 'EKITI_SW' },
        { name: 'Ekiti West', code: 'EKITI_W' },
        { name: 'Emure', code: 'EMURE' },
        { name: 'Gbonyin', code: 'GBONYIN' },
        { name: 'Ido Osi', code: 'IDO_OSI' },
        { name: 'Ijero', code: 'IJERO' },
        { name: 'Ikere', code: 'IKERE' },
        { name: 'Ikole', code: 'IKOLE' },
        { name: 'Ilejemeje', code: 'ILEJEMEJE' },
        { name: 'Irepodun/Ifelodun', code: 'IREPODUN_IFELODUN' },
        { name: 'Ise/Orun', code: 'ISE_ORUN' },
        { name: 'Moba', code: 'MOBA' },
        { name: 'Oye', code: 'OYE' }
      ]
    },
    {
      name: 'Enugu',
      code: 'EN',
      lgas: [
        { name: 'Aninri', code: 'ANINRI' },
        { name: 'Awgu', code: 'AWGU' },
        { name: 'Enugu East', code: 'ENUGU_E' },
        { name: 'Enugu North', code: 'ENUGU_N' },
        { name: 'Enugu South', code: 'ENUGU_S' },
        { name: 'Ezeagu', code: 'EZEAGU' },
        { name: 'Igbo Etiti', code: 'IGBO_ETITI' },
        { name: 'Igbo Eze North', code: 'IGBO_EZE_N' },
        { name: 'Igbo Eze South', code: 'IGBO_EZE_S' },
        { name: 'Isi Uzo', code: 'ISI_UZO' },
        { name: 'Nkanu East', code: 'NKANU_E' },
        { name: 'Nkanu West', code: 'NKANU_W' },
        { name: 'Nsukka', code: 'NSUKKA' },
        { name: 'Oji River', code: 'OJI_RIVER' },
        { name: 'Udenu', code: 'UDENU' },
        { name: 'Udi', code: 'UDI' },
        { name: 'Uzo Uwani', code: 'UZO_UWANI' }
      ]
    },
    {
      name: 'FCT',
      code: 'FC',
      lgas: [
        { name: 'Abaji', code: 'ABAJI' },
        { name: 'Abuja Municipal', code: 'ABUJA_MUNICIPAL' },
        { name: 'Bwari', code: 'BWARI' },
        { name: 'Gwagwalada', code: 'GWAGWALADA' },
        { name: 'Kuje', code: 'KUJE' },
        { name: 'Kwali', code: 'KWALI' }
      ]
    },
    {
      name: 'Gombe',
      code: 'GO',
      lgas: [
        { name: 'Akko', code: 'AKKO' },
        { name: 'Balanga', code: 'BALANGA' },
        { name: 'Billiri', code: 'BILLIRI' },
        { name: 'Dukku', code: 'DUKKU' },
        { name: 'Funakaye', code: 'FUNAKAYE' },
        { name: 'Gombe', code: 'GOMBE' },
        { name: 'Kaltungo', code: 'KALTUNGO' },
        { name: 'Kwami', code: 'KWAMI' },
        { name: 'Nafada', code: 'NAFADA' },
        { name: 'Shongom', code: 'SHONGOM' },
        { name: 'Yamaltu/Deba', code: 'YAMALTU_DEBA' }
      ]
    },
    {
      name: 'Imo',
      code: 'IM',
      lgas: [
        { name: 'Aboh Mbaise', code: 'ABOH_MBAISE' },
        { name: 'Ahiazu Mbaise', code: 'AHIAZU_MBAISE' },
        { name: 'Ehime Mbano', code: 'EHIME_MBANO' },
        { name: 'Ezinihitte', code: 'EZINIHITTE' },
        { name: 'Ideato North', code: 'IDEATO_N' },
        { name: 'Ideato South', code: 'IDEATO_S' },
        { name: 'Ihitte/Uboma', code: 'IHITTE_UBOMA' },
        { name: 'Ikeduru', code: 'IKEDURU' },
        { name: 'Isiala Mbano', code: 'ISIALA_MBANO' },
        { name: 'Isu', code: 'ISU' },
        { name: 'Mbaitoli', code: 'MBAITOLI' },
        { name: 'Ngor Okpala', code: 'NGOR_OKPALA' },
        { name: 'Njaba', code: 'NJABA' },
        { name: 'Nkwerre', code: 'NKWERRE' },
        { name: 'Nwangele', code: 'NWANGELE' },
        { name: 'Obowo', code: 'OBOWO' },
        { name: 'Oguta', code: 'OGUTA' },
        { name: 'Ohaji/Egbema', code: 'OHAJI_EGBEMA' },
        { name: 'Okigwe', code: 'OKIGWE' },
        { name: 'Orlu', code: 'ORLU' },
        { name: 'Orsu', code: 'ORSU' },
        { name: 'Oru East', code: 'ORU_E' },
        { name: 'Oru West', code: 'ORU_W' },
        { name: 'Owerri Municipal', code: 'OWERRI_MUNICIPAL' },
        { name: 'Owerri North', code: 'OWERRI_N' },
        { name: 'Owerri West', code: 'OWERRI_W' },
        { name: 'Unuimo', code: 'UNUIMO' }
      ]
    },
    {
      name: 'Jigawa',
      code: 'JI',
      lgas: [
        { name: 'Auyo', code: 'AUYO' },
        { name: 'Babura', code: 'BABURA' },
        { name: 'Biriniwa', code: 'BIRINIWA' },
        { name: 'Birnin Kudu', code: 'BIRNIN_KUDU' },
        { name: 'Buji', code: 'BUJI' },
        { name: 'Dutse', code: 'DUTSE' },
        { name: 'Gagarawa', code: 'GAGARAWA' },
        { name: 'Garki', code: 'GARKI' },
        { name: 'Gumel', code: 'GUMEL' },
        { name: 'Guri', code: 'GURI' },
        { name: 'Gwaram', code: 'GWARAM' },
        { name: 'Gwiwa', code: 'GWIWA' },
        { name: 'Hadejia', code: 'HADEJIA' },
        { name: 'Jahun', code: 'JAHUN' },
        { name: 'Kafin Hausa', code: 'KAFIN_HAUSA' },
        { name: 'Kazaure', code: 'KAZAURE' },
        { name: 'Kiri Kasama', code: 'KIRI_KASAMA' },
        { name: 'Kiyawa', code: 'KIYAWA' },
        { name: 'Kaugama', code: 'KAUGAMA' },
        { name: 'Maigatari', code: 'MAIGATARI' },
        { name: 'Malam Madori', code: 'MALAM_MADORI' },
        { name: 'Miga', code: 'MIGA' },
        { name: 'Ringim', code: 'RINGIM' },
        { name: 'Roni', code: 'RONI' },
        { name: 'Sule Tankarkar', code: 'SULE_TANKARKAR' },
        { name: 'Taura', code: 'TAURA' },
        { name: 'Yankwashi', code: 'YANKWASHI' }
      ]
    },
    {
      name: 'Kaduna',
      code: 'KD',
      lgas: [
        { name: 'Birnin Gwari', code: 'BIRNIN_GWARI' },
        { name: 'Chikun', code: 'CHIKUN' },
        { name: 'Giwa', code: 'GIWA' },
        { name: 'Igabi', code: 'IGABI' },
        { name: 'Ikara', code: 'IKARA' },
        { name: 'Jaba', code: 'JABA' },
        { name: 'Jema\'a', code: 'JEMAA' },
        { name: 'Kachia', code: 'KACHIA' },
        { name: 'Kaduna North', code: 'KADUNA_N' },
        { name: 'Kaduna South', code: 'KADUNA_S' },
        { name: 'Kagarko', code: 'KAGARKO' },
        { name: 'Kajuru', code: 'KAJURU' },
        { name: 'Kaura', code: 'KAURA' },
        { name: 'Kauru', code: 'KAURU' },
        { name: 'Kubau', code: 'KUBAU' },
        { name: 'Kudan', code: 'KUDAN' },
        { name: 'Lere', code: 'LERE' },
        { name: 'Makarfi', code: 'MAKARFI' },
        { name: 'Sabon Gari', code: 'SABON_GARI' },
        { name: 'Sanga', code: 'SANGA' },
        { name: 'Soba', code: 'SOBA' },
        { name: 'Zangon Kataf', code: 'ZANGON_KATAF' },
        { name: 'Zaria', code: 'ZARIA' }
      ]
    },
    {
      name: 'Kano',
      code: 'KN',
      lgas: [
        { name: 'Ajingi', code: 'AJINGI' },
        { name: 'Albasu', code: 'ALBASU' },
        { name: 'Bagwai', code: 'BAGWAI' },
        { name: 'Bebeji', code: 'BEBEJI' },
        { name: 'Bichi', code: 'BICHI' },
        { name: 'Bunkure', code: 'BUNKURE' },
        { name: 'Dala', code: 'DALA' },
        { name: 'Dambatta', code: 'DAMBATTA' },
        { name: 'Dawakin Kudu', code: 'DAWAKIN_KUDU' },
        { name: 'Dawakin Tofa', code: 'DAWAKIN_TOFA' },
        { name: 'Doguwa', code: 'DOGUWA' },
        { name: 'Fagge', code: 'FAGGE' },
        { name: 'Gabasawa', code: 'GABASAWA' },
        { name: 'Garko', code: 'GARKO' },
        { name: 'Garun Mallam', code: 'GARUN_MALLAM' },
        { name: 'Gaya', code: 'GAYA' },
        { name: 'Gezawa', code: 'GEZAWA' },
        { name: 'Gwale', code: 'GWALE' },
        { name: 'Gwarzo', code: 'GWARZO' },
        { name: 'Kabo', code: 'KABO' },
        { name: 'Kano Municipal', code: 'KANO_MUNICIPAL' },
        { name: 'Karaye', code: 'KARAYE' },
        { name: 'Kibiya', code: 'KIBIYA' },
        { name: 'Kiru', code: 'KIRU' },
        { name: 'Kumbotso', code: 'KUMBOTSO' },
        { name: 'Kunchi', code: 'KUNCHI' },
        { name: 'Kura', code: 'KURA' },
        { name: 'Madobi', code: 'MADOBI' },
        { name: 'Makoda', code: 'MAKODA' },
        { name: 'Minjibir', code: 'MINJIBIR' },
        { name: 'Nasarawa', code: 'NASARAWA_KANO' },
        { name: 'Rano', code: 'RANO' },
        { name: 'Rimin Gado', code: 'RIMIN_GADO' },
        { name: 'Rogo', code: 'ROGO' },
        { name: 'Shanono', code: 'SHANONO' },
        { name: 'Sumaila', code: 'SUMAILA' },
        { name: 'Takai', code: 'TAKAI' },
        { name: 'Tarauni', code: 'TARAUNI' },
        { name: 'Tofa', code: 'TOFA' },
        { name: 'Tsanyawa', code: 'TSANYAWA' },
        { name: 'Tudun Wada', code: 'TUDUN_WADA' },
        { name: 'Ungogo', code: 'UNGOGO' },
        { name: 'Warawa', code: 'WARAWA' },
        { name: 'Wudil', code: 'WUDIL' }
      ]
    },
    {
      name: 'Katsina',
      code: 'KT',
      lgas: [
        { name: 'Bakori', code: 'BAKORI' },
        { name: 'Batagarawa', code: 'BATAGARAWA' },
        { name: 'Batsari', code: 'BATSARI' },
        { name: 'Baure', code: 'BAURE' },
        { name: 'Bindawa', code: 'BINDAWA' },
        { name: 'Charanchi', code: 'CHARANCHI' },
        { name: 'Dandume', code: 'DANDUME' },
        { name: 'Danja', code: 'DANJA' },
        { name: 'Dan Musa', code: 'DAN_MUSA' },
        { name: 'Daura', code: 'DAURA' },
        { name: 'Dutsi', code: 'DUTSI' },
        { name: 'Dutsin Ma', code: 'DUTSIN_MA' },
        { name: 'Faskari', code: 'FASKARI' },
        { name: 'Funtua', code: 'FUNTUA' },
        { name: 'Ingawa', code: 'INGAWA' },
        { name: 'Jibia', code: 'JIBIA' },
        { name: 'Kafur', code: 'KAFUR' },
        { name: 'Kaita', code: 'KAITA' },
        { name: 'Kankara', code: 'KANKARA' },
        { name: 'Kankia', code: 'KANKIA' },
        { name: 'Katsina', code: 'KATSINA' },
        { name: 'Kurfi', code: 'KURFI' },
        { name: 'Kusada', code: 'KUSADA' },
        { name: 'Mai\'Adua', code: 'MAIADUA' },
        { name: 'Malumfashi', code: 'MALUMFASHI' },
        { name: 'Mani', code: 'MANI' },
        { name: 'Mashi', code: 'MASHI' },
        { name: 'Matazu', code: 'MATAZU' },
        { name: 'Musawa', code: 'MUSAWA' },
        { name: 'Rimi', code: 'RIMI' },
        { name: 'Sabuwa', code: 'SABUWA' },
        { name: 'Safana', code: 'SAFANA' },
        { name: 'Sandamu', code: 'SANDAMU' },
        { name: 'Zango', code: 'ZANGO' }
      ]
    },
    {
      name: 'Kebbi',
      code: 'KE',
      lgas: [
        { name: 'Aleiro', code: 'ALEIRO' },
        { name: 'Arewa Dandi', code: 'AREWA_DANDI' },
        { name: 'Argungu', code: 'ARGUNGU' },
        { name: 'Augie', code: 'AUGIE' },
        { name: 'Bagudo', code: 'BAGUDO' },
        { name: 'Birnin Kebbi', code: 'BIRNIN_KEBBI' },
        { name: 'Bunza', code: 'BUNZA' },
        { name: 'Dandi', code: 'DANDI' },
        { name: 'Fakai', code: 'FAKAI' },
        { name: 'Gwandu', code: 'GWANDU' },
        { name: 'Jega', code: 'JEGA' },
        { name: 'Kalgo', code: 'KALGO' },
        { name: 'Koko/Besse', code: 'KOKO_BESSE' },
        { name: 'Maiyama', code: 'MAIYAMA' },
        { name: 'Ngaski', code: 'NGASKI' },
        { name: 'Sakaba', code: 'SAKABA' },
        { name: 'Shanga', code: 'SHANGA' },
        { name: 'Suru', code: 'SURU' },
        { name: 'Wasagu/Danko', code: 'WASAGU_DANKO' },
        { name: 'Yauri', code: 'YAURI' },
        { name: 'Zuru', code: 'ZURU' }
      ]
    },
    {
      name: 'Kogi',
      code: 'KO',
      lgas: [
        { name: 'Adavi', code: 'ADAVI' },
        { name: 'Ajaokuta', code: 'AJAOKUTA' },
        { name: 'Ankpa', code: 'ANKPA' },
        { name: 'Bassa', code: 'BASSA' },
        { name: 'Dekina', code: 'DEKINA' },
        { name: 'Ibaji', code: 'IBAJI' },
        { name: 'Idah', code: 'IDAH' },
        { name: 'Igalamela Odolu', code: 'IGALAMELA_ODOLU' },
        { name: 'Ijumu', code: 'IJUMU' },
        { name: 'Kabba/Bunu', code: 'KABBA_BUNU' },
        { name: 'Kogi', code: 'KOGI' },
        { name: 'Lokoja', code: 'LOKOJA' },
        { name: 'Mopa Muro', code: 'MOPA_MURO' },
        { name: 'Ofu', code: 'OFU' },
        { name: 'Ogori/Magongo', code: 'OGORI_MAGONGO' },
        { name: 'Okehi', code: 'OKEHI' },
        { name: 'Okene', code: 'OKENE' },
        { name: 'Olamaboro', code: 'OLAMABORO' },
        { name: 'Omala', code: 'OMALA' },
        { name: 'Yagba East', code: 'YAGBA_E' },
        { name: 'Yagba West', code: 'YAGBA_W' }
      ]
    },
    {
      name: 'Kwara',
      code: 'KW',
      lgas: [
        { name: 'Asa', code: 'ASA' },
        { name: 'Baruten', code: 'BARUTEN' },
        { name: 'Edu', code: 'EDU' },
        { name: 'Ekiti', code: 'EKITI_KWARA' },
        { name: 'Ifelodun', code: 'IFELODUN' },
        { name: 'Ilorin East', code: 'ILORIN_E' },
        { name: 'Ilorin South', code: 'ILORIN_S' },
        { name: 'Ilorin West', code: 'ILORIN_W' },
        { name: 'Irepodun', code: 'IREPODUN' },
        { name: 'Isin', code: 'ISIN' },
        { name: 'Kaiama', code: 'KAIAMA' },
        { name: 'Moro', code: 'MORO' },
        { name: 'Offa', code: 'OFFA' },
        { name: 'Oke Ero', code: 'OKE_ERO' },
        { name: 'Oyun', code: 'OYUN' },
        { name: 'Pategi', code: 'PATEGI' }
      ]
    },
    {
      name: 'Lagos',
      code: 'LA',
      lgas: [
        { name: 'Agege', code: 'AGEGE' },
        { name: 'Ajeromi-Ifelodun', code: 'AJEROMI_IFELODUN' },
        { name: 'Alimosho', code: 'ALIMOSHO' },
        { name: 'Amuwo-Odofin', code: 'AMUWO_ODOFIN' },
        { name: 'Apapa', code: 'APAPA' },
        { name: 'Badagry', code: 'BADAGRY' },
        { name: 'Epe', code: 'EPE' },
        { name: 'Eti Osa', code: 'ETI_OSA' },
        { name: 'Ibeju-Lekki', code: 'IBEJU_LEKKI' },
        { name: 'Ifako-Ijaiye', code: 'IFAKO_IJAIYE' },
        { name: 'Ikeja', code: 'IKEJA' },
        { name: 'Ikorodu', code: 'IKORODU' },
        { name: 'Kosofe', code: 'KOSOFE' },
        { name: 'Lagos Island', code: 'LAGOS_ISLAND' },
        { name: 'Lagos Mainland', code: 'LAGOS_MAINLAND' },
        { name: 'Mushin', code: 'MUSHIN' },
        { name: 'Ojo', code: 'OJO' },
        { name: 'Oshodi-Isolo', code: 'OSHODI_ISOLO' },
        { name: 'Shomolu', code: 'SHOMOLU' },
        { name: 'Surulere', code: 'SURULERE' }
      ]
    },
    {
      name: 'Nasarawa',
      code: 'NA',
      lgas: [
        { name: 'Akwanga', code: 'AKWANGA' },
        { name: 'Awe', code: 'AWE' },
        { name: 'Doma', code: 'DOMA' },
        { name: 'Karu', code: 'KARU' },
        { name: 'Keana', code: 'KEANA' },
        { name: 'Keffi', code: 'KEFFI' },
        { name: 'Kokona', code: 'KOKONA' },
        { name: 'Lafia', code: 'LAFIA' },
        { name: 'Nasarawa', code: 'NASARAWA' },
        { name: 'Nasarawa Egon', code: 'NASARAWA_EGON' },
        { name: 'Obi', code: 'OBI_NASARAWA' },
        { name: 'Toto', code: 'TOTO' },
        { name: 'Wamba', code: 'WAMBA' }
      ]
    },
    {
      name: 'Niger',
      code: 'NI',
      lgas: [
        { name: 'Agaie', code: 'AGAIE' },
        { name: 'Agwara', code: 'AGWARA' },
        { name: 'Bida', code: 'BIDA' },
        { name: 'Borgu', code: 'BORGU' },
        { name: 'Bosso', code: 'BOSSO' },
        { name: 'Chanchaga', code: 'CHANCHAGA' },
        { name: 'Edati', code: 'EDATI' },
        { name: 'Gbako', code: 'GBAKO' },
        { name: 'Gurara', code: 'GURARA' },
        { name: 'Katcha', code: 'KATCHA' },
        { name: 'Kontagora', code: 'KONTAGORA' },
        { name: 'Lapai', code: 'LAPAI' },
        { name: 'Lavun', code: 'LAVUN' },
        { name: 'Magama', code: 'MAGAMA' },
        { name: 'Mariga', code: 'MARIGA' },
        { name: 'Mashegu', code: 'MASHEGU' },
        { name: 'Mokwa', code: 'MOKWA' },
        { name: 'Moya', code: 'MOYA' },
        { name: 'Paikoro', code: 'PAIKORO' },
        { name: 'Rafi', code: 'RAFI' },
        { name: 'Rijau', code: 'RIJAU' },
        { name: 'Shiroro', code: 'SHIRORO' },
        { name: 'Suleja', code: 'SULEJA' },
        { name: 'Tafa', code: 'TAFA' },
        { name: 'Wushishi', code: 'WUSHISHI' }
      ]
    },
    {
      name: 'Ogun',
      code: 'OG',
      lgas: [
        { name: 'Abeokuta North', code: 'ABEOKUTA_N' },
        { name: 'Abeokuta South', code: 'ABEOKUTA_S' },
        { name: 'Ado-Odo/Ota', code: 'ADO_ODO_OTA' },
        { name: 'Egbado North', code: 'EGBADO_N' },
        { name: 'Egbado South', code: 'EGBADO_S' },
        { name: 'Ewekoro', code: 'EWEKORO' },
        { name: 'Ifo', code: 'IFO' },
        { name: 'Ijebu East', code: 'IJEBU_E' },
        { name: 'Ijebu North', code: 'IJEBU_N' },
        { name: 'Ijebu North East', code: 'IJEBU_NE' },
        { name: 'Ijebu Ode', code: 'IJEBU_ODE' },
        { name: 'Ikenne', code: 'IKENNE' },
        { name: 'Imeko Afon', code: 'IMEKO_AFON' },
        { name: 'Ipokia', code: 'IPOKIA' },
        { name: 'Obafemi Owode', code: 'OBAFEMI_OWODE' },
        { name: 'Odeda', code: 'ODEDA' },
        { name: 'Odogbolu', code: 'ODOGBOLU' },
        { name: 'Ogun Waterside', code: 'OGUN_WATERSIDE' },
        { name: 'Remo North', code: 'REMO_N' },
        { name: 'Shagamu', code: 'SHAGAMU' }
      ]
    },
    {
      name: 'Ondo',
      code: 'ON',
      lgas: [
        { name: 'Akoko North-East', code: 'AKOKO_NE' },
        { name: 'Akoko North-West', code: 'AKOKO_NW' },
        { name: 'Akoko South-West', code: 'AKOKO_SW' },
        { name: 'Akoko South-East', code: 'AKOKO_SE' },
        { name: 'Akure North', code: 'AKURE_N' },
        { name: 'Akure South', code: 'AKURE_S' },
        { name: 'Ese Odo', code: 'ESE_ODO' },
        { name: 'Idanre', code: 'IDANRE' },
        { name: 'Ifedore', code: 'IFEDORE' },
        { name: 'Ilaje', code: 'ILAJE' },
        { name: 'Ile Oluji/Okeigbo', code: 'ILE_OLUJI_OKEIGBO' },
        { name: 'Irele', code: 'IRELE' },
        { name: 'Odigbo', code: 'ODIGBO' },
        { name: 'Okitipupa', code: 'OKITIPUPA' },
        { name: 'Ondo East', code: 'ONDO_E' },
        { name: 'Ondo West', code: 'ONDO_W' },
        { name: 'Ose', code: 'OSE' },
        { name: 'Owo', code: 'OWO' }
      ]
    },
    {
      name: 'Osun',
      code: 'OS',
      lgas: [
        { name: 'Atakunmosa East', code: 'ATAKUNMOSA_E' },
        { name: 'Atakunmosa West', code: 'ATAKUNMOSA_W' },
        { name: 'Aiyedaade', code: 'AIYEDAADE' },
        { name: 'Aiyedire', code: 'AIYEDIRE' },
        { name: 'Boluwaduro', code: 'BOLUWADURO' },
        { name: 'Boripe', code: 'BORIPE' },
        { name: 'Ede North', code: 'EDE_N' },
        { name: 'Ede South', code: 'EDE_S' },
        { name: 'Ife Central', code: 'IFE_CENTRAL' },
        { name: 'Ife East', code: 'IFE_E' },
        { name: 'Ife North', code: 'IFE_N' },
        { name: 'Ife South', code: 'IFE_S' },
        { name: 'Egbedore', code: 'EGBEDORE' },
        { name: 'Ejigbo', code: 'EJIGBO' },
        { name: 'Ifedayo', code: 'IFEDAYO' },
        { name: 'Ifelodun', code: 'IFELODUN_OSUN' },
        { name: 'Ila', code: 'ILA' },
        { name: 'Ilesa East', code: 'ILESA_E' },
        { name: 'Ilesa West', code: 'ILESA_W' },
        { name: 'Irepodun', code: 'IREPODUN_OSUN' },
        { name: 'Irewole', code: 'IREWOLE' },
        { name: 'Isokan', code: 'ISOKAN' },
        { name: 'Iwo', code: 'IWO' },
        { name: 'Obokun', code: 'OBOKUN' },
        { name: 'Odo Otin', code: 'ODO_OTIN' },
        { name: 'Ola Oluwa', code: 'OLA_OLUWA' },
        { name: 'Olorunda', code: 'OLORUNDA' },
        { name: 'Oriade', code: 'ORIADE' },
        { name: 'Orolu', code: 'OROLU' },
        { name: 'Osogbo', code: 'OSOGBO' }
      ]
    },
    {
      name: 'Oyo',
      code: 'OY',
      lgas: [
        { name: 'Afijio', code: 'AFIJIO' },
        { name: 'Akinyele', code: 'AKINYELE' },
        { name: 'Atiba', code: 'ATIBA' },
        { name: 'Atisbo', code: 'ATISBO' },
        { name: 'Egbeda', code: 'EGBEDA' },
        { name: 'Ibadan North', code: 'IBADAN_N' },
        { name: 'Ibadan North-East', code: 'IBADAN_NE' },
        { name: 'Ibadan North-West', code: 'IBADAN_NW' },
        { name: 'Ibadan South-East', code: 'IBADAN_SE' },
        { name: 'Ibadan South-West', code: 'IBADAN_SW' },
        { name: 'Ibarapa Central', code: 'IBARAPA_CENTRAL' },
        { name: 'Ibarapa East', code: 'IBARAPA_E' },
        { name: 'Ibarapa North', code: 'IBARAPA_N' },
        { name: 'Ido', code: 'IDO' },
        { name: 'Irepo', code: 'IREPO' },
        { name: 'Iseyin', code: 'ISEYIN' },
        { name: 'Itesiwaju', code: 'ITESIWAJU' },
        { name: 'Iwajowa', code: 'IWAJOWA' },
        { name: 'Kajola', code: 'KAJOLA' },
        { name: 'Lagelu', code: 'LAGELU' },
        { name: 'Ogbomoso North', code: 'OGBOMOSO_N' },
        { name: 'Ogbomoso South', code: 'OGBOMOSO_S' },
        { name: 'Ogo Oluwa', code: 'OGO_OLUWA' },
        { name: 'Olorunsogo', code: 'OLORUNSOGO' },
        { name: 'Oluyole', code: 'OLUYOLE' },
        { name: 'Ona Ara', code: 'ONA_ARA' },
        { name: 'Orelope', code: 'ORELOPE' },
        { name: 'Ori Ire', code: 'ORI_IRE' },
        { name: 'Oyo', code: 'OYO' },
        { name: 'Oyo East', code: 'OYO_E' },
        { name: 'Saki East', code: 'SAKI_E' },
        { name: 'Saki West', code: 'SAKI_W' },
        { name: 'Surulere', code: 'SURULERE_OYO' }
      ]
    },
    {
      name: 'Plateau',
      code: 'PL',
      lgas: [
        { name: 'Barkin Ladi', code: 'BARKIN_LADI' },
        { name: 'Bassa', code: 'BASSA_PLATEAU' },
        { name: 'Jos East', code: 'JOS_E' },
        { name: 'Jos North', code: 'JOS_N' },
        { name: 'Jos South', code: 'JOS_S' },
        { name: 'Kanam', code: 'KANAM' },
        { name: 'Kanke', code: 'KANKE' },
        { name: 'Langtang North', code: 'LANGTANG_N' },
        { name: 'Langtang South', code: 'LANGTANG_S' },
        { name: 'Mangu', code: 'MANGU' },
        { name: 'Mikang', code: 'MIKANG' },
        { name: 'Pankshin', code: 'PANKSHIN' },
        { name: 'Qua\'an Pan', code: 'QUAAN_PAN' },
        { name: 'Riyom', code: 'RIYOM' },
        { name: 'Shendam', code: 'SHENDAM' },
        { name: 'Wase', code: 'WASE' }
      ]
    },
    {
      name: 'Rivers',
      code: 'RI',
      lgas: [
        { name: 'Abua/Odual', code: 'ABUA_ODUAL' },
        { name: 'Ahoada East', code: 'AHOADA_E' },
        { name: 'Ahoada West', code: 'AHOADA_W' },
        { name: 'Akuku-Toru', code: 'AKUKU_TORU' },
        { name: 'Andoni', code: 'ANDONI' },
        { name: 'Asari-Toru', code: 'ASARI_TORU' },
        { name: 'Bonny', code: 'BONNY' },
        { name: 'Degema', code: 'DEGEMA' },
        { name: 'Eleme', code: 'ELEME' },
        { name: 'Emuoha', code: 'EMUOHA' },
        { name: 'Etche', code: 'ETCHE' },
        { name: 'Gokana', code: 'GOKANA' },
        { name: 'Ikwerre', code: 'IKWERRE' },
        { name: 'Khana', code: 'KHANA' },
        { name: 'Obio/Akpor', code: 'OBIO_AKPOR' },
        { name: 'Ogba/Egbema/Ndoni', code: 'OGBA_EGBEMA_NDONI' },
        { name: 'Ogu/Bolo', code: 'OGU_BOLO' },
        { name: 'Okrika', code: 'OKRIKA' },
        { name: 'Omuma', code: 'OMUMA' },
        { name: 'Opobo/Nkoro', code: 'OPOBO_NKORO' },
        { name: 'Oyigbo', code: 'OYIGBO' },
        { name: 'Port Harcourt', code: 'PORT_HARCOURT' },
        { name: 'Tai', code: 'TAI' }
      ]
    },
    {
      name: 'Sokoto',
      code: 'SO',
      lgas: [
        { name: 'Binji', code: 'BINJI' },
        { name: 'Bodinga', code: 'BODINGA' },
        { name: 'Dange Shuni', code: 'DANGE_SHUNI' },
        { name: 'Gada', code: 'GADA' },
        { name: 'Goronyo', code: 'GORONYO' },
        { name: 'Gudu', code: 'GUDU' },
        { name: 'Gwadabawa', code: 'GWADABAWA' },
        { name: 'Illela', code: 'ILLELA' },
        { name: 'Isa', code: 'ISA' },
        { name: 'Kebbe', code: 'KEBBE' },
        { name: 'Kware', code: 'KWARE' },
        { name: 'Rabah', code: 'RABAH' },
        { name: 'Sabon Birni', code: 'SABON_BIRNI' },
        { name: 'Shagari', code: 'SHAGARI' },
        { name: 'Silame', code: 'SILAME' },
        { name: 'Sokoto North', code: 'SOKOTO_N' },
        { name: 'Sokoto South', code: 'SOKOTO_S' },
        { name: 'Tambuwal', code: 'TAMBUWAL' },
        { name: 'Tangaza', code: 'TANGAZA' },
        { name: 'Tureta', code: 'TURETA' },
        { name: 'Wamako', code: 'WAMAKO' },
        { name: 'Wurno', code: 'WURNO' },
        { name: 'Yabo', code: 'YABO' }
      ]
    },
    {
      name: 'Taraba',
      code: 'TA',
      lgas: [
        { name: 'Ardo Kola', code: 'ARDO_KOLA' },
        { name: 'Bali', code: 'BALI' },
        { name: 'Donga', code: 'DONGA' },
        { name: 'Gashaka', code: 'GASHAKA' },
        { name: 'Gassol', code: 'GASSOL' },
        { name: 'Ibi', code: 'IBI' },
        { name: 'Jalingo', code: 'JALINGO' },
        { name: 'Karim Lamido', code: 'KARIM_LAMIDO' },
        { name: 'Kurmi', code: 'KURMI' },
        { name: 'Lau', code: 'LAU' },
        { name: 'Sardauna', code: 'SARDAUNA' },
        { name: 'Takum', code: 'TAKUM' },
        { name: 'Ussa', code: 'USSA' },
        { name: 'Wukari', code: 'WUKARI' },
        { name: 'Yorro', code: 'YORRO' },
        { name: 'Zing', code: 'ZING' }
      ]
    },
    {
      name: 'Yobe',
      code: 'YO',
      lgas: [
        { name: 'Bade', code: 'BADE' },
        { name: 'Bursari', code: 'BURSARI' },
        { name: 'Damaturu', code: 'DAMATURU' },
        { name: 'Fika', code: 'FIKA' },
        { name: 'Fune', code: 'FUNE' },
        { name: 'Geidam', code: 'GEIDAM' },
        { name: 'Gujba', code: 'GUJBA' },
        { name: 'Gulani', code: 'GULANI' },
        { name: 'Jakusko', code: 'JAKUSKO' },
        { name: 'Karasuwa', code: 'KARASUWA' },
        { name: 'Machina', code: 'MACHINA' },
        { name: 'Nangere', code: 'NANGERE' },
        { name: 'Nguru', code: 'NGURU' },
        { name: 'Potiskum', code: 'POTISKUM' },
        { name: 'Tarmuwa', code: 'TARMUWA' },
        { name: 'Yunusari', code: 'YUNUSARI' },
        { name: 'Yusufari', code: 'YUSUFARI' }
      ]
    },
    {
      name: 'Zamfara',
      code: 'ZA',
      lgas: [
        { name: 'Anka', code: 'ANKA' },
        { name: 'Bakura', code: 'BAKURA' },
        { name: 'Birnin Magaji/Kiyaw', code: 'BIRNIN_MAGAJI_KIYAW' },
        { name: 'Bukkuyum', code: 'BUKKUYUM' },
        { name: 'Bungudu', code: 'BUNGUDU' },
        { name: 'Gummi', code: 'GUMMI' },
        { name: 'Gusau', code: 'GUSAU' },
        { name: 'Kaura Namoda', code: 'KAURA_NAMODA' },
        { name: 'Maradun', code: 'MARADUN' },
        { name: 'Maru', code: 'MARU' },
        { name: 'Shinkafi', code: 'SHINKAFI' },
        { name: 'Talata Mafara', code: 'TALATA_MAFARA' },
        { name: 'Tsafe', code: 'TSAFE' },
        { name: 'Zurmi', code: 'ZURMI' }
      ]
    }
  ]
};

// Helper functions
export const getStateByCode = (code: string): State | undefined => {
  return NIGERIAN_LOCATIONS.states.find(state => state.code === code);
};

export const getLGAByCode = (stateCode: string, lgaCode: string): LGA | undefined => {
  const state = getStateByCode(stateCode);
  return state?.lgas.find(lga => lga.code === lgaCode);
};

export const formatLocation = (stateCode: string, lgaCode?: string): string => {
  const state = getStateByCode(stateCode);
  if (!state) return '';
  
  if (!lgaCode) return `${state.name}, Nigeria`;
  
  const lga = getLGAByCode(stateCode, lgaCode);
  if (!lga) return `${state.name}, Nigeria`;
  
  return `${lga.name}, ${state.name}, Nigeria`;
};

export const parseLocation = (locationString: string): { stateCode?: string; lgaCode?: string } | null => {
  // Try to parse a formatted location string back to codes
  // This is useful for reverse lookup from stored location strings
  const parts = locationString.split(', ');
  if (parts.length < 2) return null;
  
  const stateName = parts[parts.length - 2]; // Second to last should be state
  const lgaName = parts.length >= 3 ? parts[0] : undefined; // First should be LGA if present
  
  const state = NIGERIAN_LOCATIONS.states.find(s => s.name === stateName);
  if (!state) return null;
  
  if (lgaName) {
    const lga = state.lgas.find(l => l.name === lgaName);
    if (lga) {
      return { stateCode: state.code, lgaCode: lga.code };
    }
  }
  
  return { stateCode: state.code };
};