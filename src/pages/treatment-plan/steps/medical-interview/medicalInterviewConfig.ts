export const fieldConfigs = {
  sections: [
    {
      description:
        'Proszę szczegółowo odpowiedzieć na wszystkie pytania, aby pomóc w postawieniu diagnozy i ułożeniu planu leczenia.',
      name: 'medicalHistory',
      subsections: [
        {
          description: null,
          fields: [
            {
              checkboxLabel: 'Choroby serca?',
              name: 'heartDisease',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby sercowo naczyniowe?',
              name: 'cardiovascularDiseases',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Nadciśnienie krwi?',
              name: 'hypertension',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Krwawienie, zaburzenia krzepnięcia krwi?',
              name: 'bloodDisorders',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby nowotworowe?',
              name: 'cancer',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Zaburzenia odżywiania?',
              name: 'eatingDisorders',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby układu odpornościowego?',
              name: 'immuneSystemDiseases',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'WZW typ B/C?',
              name: 'hepatisisBOrC',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'HIV?',
              name: 'hiv',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby neurologiczne?',
              name: 'neurologicalDiseases',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Padaczka?',
              name: 'epilepsy',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Zaburzenia hormonalne?',
              name: 'hormonalDisorders',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Cukrzyca?',
              name: 'diabetes',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Wady wrodzone?',
              name: 'congenitalDefects',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby dziedziczne?',
              name: 'hereditaryDiseases',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby reumatoidalne?',
              name: 'rheumatoidDiseases',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby układu kostnego?',
              name: 'skeletalDiseases',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby nerek?',
              name: 'kidneyDiseases',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby wątroby?',
              name: 'liverDiseases',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Choroby psychiczne?',
              name: 'mentalIllnesses',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Depresja?',
              name: 'depression',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Czy w czasie ostatnich 3 lat była konsultacja psychiatryczna?',
              name: 'psychiatricConsultationInLastThreeYears',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Astma?',
              name: 'asthma',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Alergie?',
              name: 'allergies',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
          ],
          name: 'patientDiseases',
          title: 'Czy pacjent choruje na:',
        },
        {
          description: 'Czy pacjent choruje na:',
          fields: [
            {
              checkboxLabel: 'ADHD?',
              name: 'adhd',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Uwagi?',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Dysleksja?',
              name: 'dyslexia',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Uwagi?',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Zespół Aspergera?',
              name: 'aspergersSyndrome',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Uwagi?',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
            {
              checkboxLabel: 'Zaburzenia koordynacji?',
              name: 'coordinationDisorders',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jakie?',
                placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              },
            },
          ],
          name: 'patientDisorders',
          title: 'Czy podejrzewa się lub zdiagnozowano zaburzenia:',
        },
        {
          description: '',
          fields: [
            {
              name: 'surgeries',
              textFieldLabel: 'Pobyty w szpitalu i operacje. Kiedy i z jakiego powodu?',
              textFieldPlaceholder: 'Opisz pobyty w szpitalu i przebyte operacje...',
              type: 'textarea',
            },
            {
              name: 'medications',
              textFieldLabel: 'Przyjmowane leki:',
              textFieldPlaceholder: 'Opisz przyjmowane leki...',
              type: 'textarea',
            },
            {
              name: 'notes',
              textFieldLabel: 'Inne uwagi:',
              textFieldPlaceholder: 'Inne uwagi dotyczące historii medycznej pacjenta...',
              type: 'textarea',
            },
          ],
          name: 'patientDisorders',
          title: '',
        },
      ],
      title: 'Historia medyczna',
    },
    {
      name: 'infancy',
      description: '',
      fields: [],
      title: 'Okres niemowlęcy',
      subsections: [
        {
          description: '',
          fields: [
            {
              checkboxLabel: 'Poród Cesarskie cięcie?',
              name: 'caesareanSection',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Powód?',
                placeholder: 'Opisz powód wykonania cesarskiego cięcia...',
              },
            },
            {
              checkboxLabel: 'Poród naturalny?',
              name: 'naturalBirth',
              type: 'conditionalField',
              conditionalField: {
                type: 'radio',
                label: 'Poziom trudności? Od 1 (łatwy) do 5 (trudny)',
                options: [
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                ],
              },
            },
            {
              checkboxLabel: 'Poród wspomagany np. Poród kleszczowy',
              name: 'assistedDelivery',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Uwagi?',
                placeholder: 'Opis...',
              },
            },
          ],
          name: 'birthData',
          title: '',
        },
        {
          description: '',
          fields: [
            {
              checkboxLabel: 'Wczesne karmienie piersią?',
              name: 'earlyBreastfeeding',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jak długo?',
                placeholder: 'Opis...',
              },
            },
            {
              checkboxLabel: 'Karmienie butelką?',
              name: 'bottleFeeding',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jak długo?',
                placeholder: 'Opis...',
              },
            },
            {
              name: 'firstSolidFood',
              textFieldLabel: 'W jakim wieku podano pierwszy nie płynny pokarm?',
              textFieldPlaceholder: 'Wiek...',
              type: 'textarea',
            },
            {
              name: 'hardnessOfFirstFood',
              label: 'Twardość pierwszego pokarmu?',
              type: 'radio',
              options: [
                { value: 'soft', label: 'miękki' },
                { value: 'hard', label: 'twardy' },
              ],
            },
            {
              name: 'wasInitialFeedingDifficulty',
              label: 'Czy początki karmienia były trudne?',
              type: 'checkbox',
            },
            {
              name: 'spoonFeedingAge',
              textFieldLabel: 'W jakim wieku rozpoczęto karmienie łyżeczką?',
              textFieldPlaceholder: 'Wiek...',
              type: 'textarea',
            },
            {
              name: 'spoonFeedingDescription',
              textFieldLabel: 'Reakcja dziecka:',
              textFieldPlaceholder: 'Opisz reakcję dziecka na karmienie łyżeczką...',
              type: 'textarea',
            },
          ],
          name: 'feeding',
          title: '',
        },
        {
          description: '',
          fields: [
            {
              name: 'comments',
              textFieldLabel: 'Uwagi:',
              textFieldPlaceholder: 'Opisz uwagi dotyczące karmienia okresu niemowlęcego...',
              type: 'textarea',
            },
          ],
          name: 'comments',
          title: '',
        },
      ],
    },
    {
      description: '',
      name: 'dentalInterview',
      subsections: [
        {
          description: 'Historia stomatologiczna pacjenta',
          fields: [
            {
              checkboxLabel: 'Przebyty uraz zębów mlecznych/stałych?',
              name: 'toothInjury',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy? Który ząb?',
                placeholder: 'Opisz kiedy wystąpił i który ząb...',
              },
            },
            {
              checkboxLabel: 'Przebyty wypadek komunikacyjny?',
              name: 'carAccident',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy?',
                placeholder: 'Opisz kiedy wystąpił wypadek...',
              },
            },
            {
              checkboxLabel: 'Czy są problemy z żuciem pokarmów?',
              name: 'chewingProblems',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz problemy z żuciem...',
              },
            },
            {
              checkboxLabel: 'Czy są problemy z szerokim otwieraniem ust?',
              name: 'mouthOpeningProblems',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz problemy z otwieraniem ust...',
              },
            },
            {
              checkboxLabel: 'Czy są problemy z zaciskaniem szczęk?',
              name: 'jawClenchingProblems',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy?',
                placeholder: 'Opisz kiedy występują problemy...',
              },
            },
            {
              checkboxLabel: 'Czy są problemy ze stawem skroniowo żuchwowym?',
              name: 'tmjProblems',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jakie?',
                placeholder: 'Opisz jakie problemy ze stawem...',
              },
            },
            {
              checkboxLabel:
                'Czy w ostatnich miesiącach / latach* pojawiły się zmiany w wyglądzie twarzy?',
              name: 'facialChanges',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jakie?',
                placeholder: 'Opisz jakie zmiany w wyglądzie twarzy...',
              },
            },
            {
              checkboxLabel: 'Czy były już konsultacje ortodontyczne?',
              name: 'orthodonticConsultations',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Ile? Jakie zalecenia?',
                placeholder: 'Ile konsultacji i jakie zalecenia...',
              },
            },
            {
              name: 'orthodonticTreatmentHistory',
              textFieldLabel:
                'Czy było wcześniejsze leczenie ortodontyczne? Proszę opisać kiedy, powód leczenia, na czym polegało, czas leczenia, przebieg:',
              textFieldPlaceholder: 'Opisz historię leczenia ortodontycznego...',
              type: 'textarea',
            },
          ],
          name: 'dentalHistory',
          title: '',
        },
        {
          description: 'Nawyki pacjenta',
          fields: [
            {
              checkboxLabel: 'Ssanie kciuka?',
              name: 'thumbSucking',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Do kiedy?',
                placeholder: 'Do jakiego wieku?',
              },
            },
            {
              checkboxLabel: 'Ssanie palca?',
              name: 'fingerSucking',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Do kiedy?',
                placeholder: 'Do jakiego wieku?',
              },
            },
            {
              checkboxLabel: 'Ssanie smoczka?',
              name: 'pacifierSucking',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Do kiedy?',
                placeholder: 'Do jakiego wieku?',
              },
            },
            {
              checkboxLabel: 'Gra na instrumencie?',
              name: 'playsInstrument',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jakim?',
                placeholder: 'Na jakim instrumencie?',
              },
            },
            {
              checkboxLabel: 'Uprawianie sportu?',
              name: 'playsSports',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jakiego?',
                placeholder: 'Jaki sport?',
              },
            },
            {
              checkboxLabel: 'Czy zęby służą do czegoś poza jedzeniem?',
              name: 'teethMisuse',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Do czego?',
                placeholder: 'Opisz do czego używane są zęby...',
              },
            },
            {
              label: 'Krótkie wędzidło języka?',
              name: 'tongueTie',
              type: 'checkbox',
            },
            {
              checkboxLabel: 'Interwencja chirurgiczna?',
              name: 'tongueSurgery',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy?',
                placeholder: 'Kiedy była interwencja?',
              },
            },
            {
              label: 'Krótkie wędzidło wargi?',
              name: 'lipTie',
              type: 'checkbox',
            },
            {
              checkboxLabel: 'Interwencja chirurgiczna?',
              name: 'lipSurgery',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy?',
                placeholder: 'Kiedy była interwencja?',
              },
            },
            {
              checkboxLabel: 'Problemy logopedyczne?',
              name: 'speechProblems',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jakie?',
                placeholder: 'Opisz problemy logopedyczne...',
              },
            },
            {
              checkboxLabel: 'Bóle głowy?',
              name: 'headaches',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jak często?',
                placeholder: 'Jak często występują bóle głowy?',
              },
            },
          ],
          name: 'habits',
          title: 'Nawyki',
        },
        {
          description: 'Preferencje pokarmowe',
          fields: [
            {
              name: 'hardFoods',
              label: 'Twarde pokarmy?',
              type: 'checkbox',
            },
            {
              name: 'softFoods',
              label: 'Miękkie pokarmy?',
              type: 'checkbox',
            },
          ],
          name: 'foodPreferences',
          title: 'Preferencje pokarmowe',
        },
        {
          description: 'Postawa i rozwój',
          fields: [
            {
              label: 'Głowa wysunięta do przodu?',
              name: 'forwardHeadPosture',
              type: 'checkbox',
            },
            {
              label: 'Asymetria ramion?',
              name: 'shoulderAsymmetry',
              type: 'checkbox',
            },
            {
              label: 'Ściągnięcie ramion do przodu?',
              name: 'forwardShoulders',
              type: 'checkbox',
            },
            {
              label: 'Garbienie się?',
              name: 'hunching',
              type: 'checkbox',
            },
            {
              label: 'Asymetria bioder?',
              name: 'hipAsymmetry',
              type: 'checkbox',
            },
            {
              checkboxLabel: 'Czy pacjent jest/był pod opieką fizjoterapeuty?',
              name: 'physiotherapy',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy? Z jakiego powodu?',
                placeholder: 'Opisz kiedy i z jakiego powodu...',
              },
            },
            {
              checkboxLabel: 'Czy dziecko uczęszcza/uczęszczało na gimnastykę korekcyjną?',
              name: 'correctiveGymnastics',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy? Z jakiego powodu?',
                placeholder: 'Opisz kiedy i z jakiego powodu...',
              },
            },
            {
              name: 'additionalNotes',
              textFieldLabel: 'Inne:',
              textFieldPlaceholder: 'Dodatkowe uwagi...',
              type: 'textarea',
            },
          ],
          name: 'posture',
          title: 'Postawa',
        },
      ],
      title: 'Wywiad stomatologiczny',
    },
    {
      description: 'Problemy laryngologiczne i alergologiczne',
      name: 'allergicProblems',
      subsections: [
        {
          description: 'Problemy laryngologiczne',
          fields: [
            {
              checkboxLabel: 'Często zapalenie migdałków?',
              name: 'tonsilInflammation',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jak często?',
                placeholder: 'Opisz częstotliwość zapaleń...',
              },
            },
            {
              checkboxLabel: 'Usunięte migdałki podniebienne?',
              name: 'tonsillectomy',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy?',
                placeholder: 'Kiedy były usunięte?',
              },
            },
            {
              checkboxLabel: 'Usunięty migdałek gardłowy?',
              name: 'adenoidectomy',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Kiedy?',
                placeholder: 'Kiedy był usunięty?',
              },
            },
            {
              checkboxLabel:
                'Inne problemy laryngologiczne (zatoki, krzywa przegroda nosa, polipy, itp.)?',
              name: 'otherEarNoseThroatProblems',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz inne problemy laryngologiczne...',
              },
            },
          ],
          name: 'laryngologicalProblems',
          title: 'Problemy laryngologiczne',
        },
        {
          description: 'Słuch',
          fields: [
            {
              checkboxLabel: 'Zdiagnozowane problemy ze słuchem?',
              name: 'hearingProblems',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jakie?',
                placeholder: 'Opisz problemy ze słuchem...',
              },
            },
            {
              label: 'Zatłane uszy?',
              name: 'blockedEars',
              type: 'checkbox',
            },
            {
              label: 'Chirurgiczne odbarzanie ucha?',
              name: 'earSurgery',
              type: 'checkbox',
            },
            {
              name: 'otherHearingProblems',
              textFieldLabel: 'Inne problemy?',
              textFieldPlaceholder: 'Opisz inne problemy ze słuchem...',
              type: 'textarea',
            },
          ],
          name: 'hearing',
          title: 'Słuch',
        },
        {
          description: 'Oddech',
          fields: [
            {
              checkboxLabel: 'Oddychanie przez usta?',
              name: 'mouthBreathing',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Częstość od 1 (rzadko) do 5 (cały czas)?',
                placeholder: 'Oceń częstość oddychania przez usta...',
              },
            },
            {
              checkboxLabel: 'Zablokowany nos?',
              name: 'blockedNose',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jak mocno zablokowany? od 1 (umiarkowanie) do 5 (całkowicie)?',
                placeholder: 'Oceń stopień zablokowania nosa...',
              },
            },
            {
              checkboxLabel: 'Częste kłopoty podczas snu?',
              name: 'sleepProblems',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz kłopoty podczas snu...',
              },
            },
            {
              label: 'Sezonowo?',
              name: 'seasonalProblems',
              type: 'checkbox',
            },
            {
              checkboxLabel: 'Chrapanie?',
              name: 'snoring',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz problem chrapania...',
              },
            },
            {
              checkboxLabel: 'Podejrzenie bezdechu sennego?',
              name: 'sleepApnea',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz objawy bezdechu sennego...',
              },
            },
            {
              checkboxLabel: 'Czy wykonano badanie snu?',
              name: 'sleepStudy',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jaki wynik?',
                placeholder: 'Opisz wyniki badania snu...',
              },
            },
            {
              checkboxLabel: 'Łatwe wstawanie rano, z podkrążonymi oczami?',
              name: 'morningTiredness',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz problemy z porannym wstawaniem...',
              },
            },
          ],
          name: 'breathing',
          title: 'Oddech',
        },
        {
          description: 'Sen',
          fields: [
            {
              name: 'sleepQuality',
              textFieldLabel: 'Jakość snu od 1 (doskonały) do 5 (bardzo zły)?',
              textFieldPlaceholder: 'Oceń jakość snu...',
              type: 'textarea',
            },
            {
              checkboxLabel: 'Zrzyganie zębami w nocy?',
              name: 'nightTeethGrinding',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz zrzyganie zębami...',
              },
            },
            {
              checkboxLabel: 'Częste kłopoty podczas snu?',
              name: 'frequentSleepTroubles',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz częste kłopoty podczas snu...',
              },
            },
            {
              checkboxLabel: 'Moczenie nocne?',
              name: 'bedwetting',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jak często?',
                placeholder: 'Opisz częstotliwość...',
              },
            },
            {
              checkboxLabel: 'Spanie z lekko / całkowicie otwartą buzią?',
              name: 'sleepingWithOpenMouth',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Jak często?',
                placeholder: 'Opisz jak często...',
              },
            },
          ],
          name: 'sleep',
          title: 'Sen',
        },
        {
          description: 'Otwarte usta',
          fields: [
            {
              name: 'mouthOpenSituations',
              textFieldLabel:
                'W jakich sytuacjach pacjent ma otwarte usta? Od 1 (bardzo rzadko) do 5 (prawie zawsze)?',
              textFieldPlaceholder: 'Opisz sytuacje gdy pacjent ma otwarte usta...',
              type: 'textarea',
            },
            {
              name: 'walkingTime',
              textFieldLabel: 'Gdy stoi?',
              textFieldPlaceholder: 'Oceń od 1 do 5...',
              type: 'textarea',
            },
            {
              name: 'walkingTimeMoving',
              textFieldLabel: 'Podczas chodzenia?',
              textFieldPlaceholder: 'Oceń od 1 do 5...',
              type: 'textarea',
            },
            {
              name: 'driving',
              textFieldLabel: 'Podczas jazdy samochodem?',
              textFieldPlaceholder: 'Oceń od 1 do 5...',
              type: 'textarea',
            },
            {
              name: 'computerWork',
              textFieldLabel: 'Podczas zabawy w domu?',
              textFieldPlaceholder: 'Oceń od 1 do 5...',
              type: 'textarea',
            },
            {
              name: 'sleepingMouth',
              textFieldLabel: 'Podczas snu?',
              textFieldPlaceholder: 'Oceń od 1 do 5...',
              type: 'textarea',
            },
          ],
          name: 'openMouth',
          title: 'Otwarte usta',
        },
        {
          description: 'Dotyczące dzieci',
          fields: [
            {
              name: 'homeworkTime',
              textFieldLabel: 'Podczas odrabiania prac domowych?',
              textFieldPlaceholder: 'Oceń od 1 do 5...',
              type: 'textarea',
            },
            {
              name: 'playTime',
              textFieldLabel: 'Zabawa w domu?',
              textFieldPlaceholder: 'Oceń od 1 do 5...',
              type: 'textarea',
            },
            {
              name: 'outdoorPlay',
              textFieldLabel: 'Zabawa na dworze?',
              textFieldPlaceholder: 'Oceń od 1 do 5...',
              type: 'textarea',
            },
          ],
          name: 'childrenActivities',
          title: 'Dotyczące dzieci',
        },
        {
          description: 'Alergie',
          fields: [
            {
              checkboxLabel: 'Alergiczny nieżyt nosa?',
              name: 'allergicRhinitis',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                label: 'Czym spowodowany?',
                placeholder: 'Opisz przyczyny alergicznego nieżytu nosa...',
              },
            },
            {
              name: 'allergyOnsetFrom',
              textFieldLabel: 'Od kiedy?',
              textFieldPlaceholder: 'Od kiedy występują alergie...',
              type: 'textarea',
            },
            {
              name: 'allergyOnsetTo',
              textFieldLabel: 'Do kiedy?',
              textFieldPlaceholder: 'Do kiedy występują alergie...',
              type: 'textarea',
            },
            {
              name: 'allergyFrequency',
              textFieldLabel: 'Częstość nieżytu od 1 (rzadko) do 5 (często)?',
              textFieldPlaceholder: 'Oceń częstość nieżytu...',
              type: 'textarea',
            },
            {
              checkboxLabel: 'Alergia / nietolerancja pokarmowa?',
              name: 'foodAllergy',
              type: 'conditionalField',
              conditionalField: {
                type: 'textarea',
                placeholder: 'Opisz alergię pokarmową...',
              },
            },
            {
              name: 'foodAllergyOnsetFrom',
              textFieldLabel: 'Od kiedy?',
              textFieldPlaceholder: 'Od kiedy występuje alergia pokarmowa...',
              type: 'textarea',
            },
            {
              name: 'foodAllergyOnsetTo',
              textFieldLabel: 'Do kiedy?',
              textFieldPlaceholder: 'Do kiedy występuje alergia pokarmowa...',
              type: 'textarea',
            },
            {
              name: 'allergySymptoms',
              textFieldLabel: 'Na jakie składniki?',
              textFieldPlaceholder: 'Wymień składniki wywołujące alergię...',
              type: 'textarea',
            },
          ],
          name: 'allergies',
          title: 'Alergie',
        },
      ],
      title: 'Problemy laryngologiczne i alergologiczne',
    },
  ],
  template: 'medicalInterview',
}
