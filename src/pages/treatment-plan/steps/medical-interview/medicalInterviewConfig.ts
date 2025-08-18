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
              label: 'Choroby serca?',
              name: 'heartDisease',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby sercowo naczyniowe?',
              name: 'cardiovascularDiseases',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Nadciśnienie krwi?',
              name: 'hypertension',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Krwawienie, zaburzenia krzepnięcia krwi?',
              name: 'bloodDisorders',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby nowotworowe?',
              name: 'cancer',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Zaburzenia odżywiania?',
              name: 'eatingDisorders',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby układu odpornościowego?',
              name: 'immuneSystemDiseases',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'WZW typ B/C?',
              name: 'hepatisisBOrC',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'HIV?',
              name: 'hiv',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby neurologiczne?',
              name: 'neurologicalDiseases',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Padaczka?',
              name: 'epilepsy',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Zaburzenia hormonalne?',
              name: 'hormonalDisorders',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Cukrzyca?',
              name: 'diabetes',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Wady wrodzone?',
              name: 'congenitalDefects',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby dziedziczne?',
              name: 'hereditaryDiseases',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby reumatoidalne?',
              name: 'rheumatoidDiseases',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby układu kostnego?',
              name: 'skeletalDiseases',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby nerek?',
              name: 'kidneyDiseases',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby wątroby?',
              name: 'liverDiseases',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Choroby psychiczne?',
              name: 'mentalIllnesses',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Depresja?',
              name: 'depression',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Czy w czasie ostatnich 3 lat była konsultacja psychiatryczna?',
              name: 'psychiatricConsultationInLastThreeYears',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Astma?',
              name: 'asthma',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Alergie?',
              name: 'allergies',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
          ],
          name: 'patientDiseases',
          title: 'Czy pacjent choruje na:',
        },
        {
          description: 'Czy pacjent choruje na:',
          fields: [
            {
              label: 'ADHD?',
              name: 'adhd',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Uwagi?',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Dysleksja?',
              name: 'dyslexia',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Uwagi?',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Zespół Aspergera?',
              name: 'aspergersSyndrome',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Uwagi?',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
            },
            {
              label: 'Zaburzenia koordynacji?',
              name: 'coordinationDisorders',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jakie?',
                  placeholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
                },
              ],
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
              label: 'Poród Cesarskie cięcie?',
              name: 'caesareanSection',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Powód?',
                  placeholder: 'Opisz powód wykonania cesarskiego cięcia...',
                },
              ],
            },
            {
              label: 'Poród naturalny?',
              name: 'naturalBirth',
              type: 'conditionalField',
              conditionalFields: [
                {
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
              ],
            },
            {
              label: 'Poród wspomagany np. Poród kleszczowy',
              name: 'assistedDelivery',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Uwagi?',
                  placeholder: 'Opis...',
                },
              ],
            },
          ],
          name: 'birthData',
          title: '',
        },
        {
          description: '',
          fields: [
            {
              label: 'Wczesne karmienie piersią?',
              name: 'earlyBreastfeeding',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jak długo?',
                  placeholder: 'Opis...',
                },
              ],
            },
            {
              label: 'Karmienie butelką?',
              name: 'bottleFeeding',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jak długo?',
                  placeholder: 'Opis...',
                },
              ],
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
              label: 'Przebyty uraz zębów mlecznych/stałych?',
              name: 'toothInjury',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Kiedy? Który ząb?',
                  placeholder: 'Opisz kiedy wystąpił i który ząb...',
                },
              ],
            },
            {
              label: 'Przebyty wypadek komunikacyjny?',
              name: 'carAccident',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Kiedy?',
                  placeholder: 'Opisz kiedy wystąpił wypadek...',
                },
              ],
            },
            {
              label: 'Czy są problemy z żuciem pokarmów?',
              name: 'chewingProblems',
              type: 'checkbox',
            },
            {
              label: 'Czy są problemy z szerokim otwieraniem ust?',
              name: 'mouthOpeningProblems',
              type: 'checkbox',
            },
            {
              label: 'Czy są problemy z zaciskaniem szczęk?',
              name: 'jawClenchingProblems',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Kiedy?',
                  placeholder: 'Opisz kiedy występują problemy...',
                },
              ],
            },
            {
              label: 'Czy są problemy ze stawem skroniowo żuchwowym?',
              name: 'tmjProblems',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jakie?',
                  placeholder: 'Opisz jakie problemy ze stawem...',
                },
              ],
            },
            {
              label: 'Czy w ostatnich miesiącach / latach* pojawiły się zmiany w wyglądzie twarzy?',
              name: 'facialChanges',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jakie?',
                  placeholder: 'Opisz jakie zmiany w wyglądzie twarzy...',
                },
              ],
            },
            {
              label: 'Czy były już konsultacje ortodontyczne?',
              name: 'orthodonticConsultations',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Ile? ',
                  placeholder: 'Ile konsultacji...',
                },
                {
                  type: 'textarea',
                  label: 'Jakie zalecenia?',
                  placeholder: 'Jakie zalecenia...',
                },
              ],
            },
            {
              label: 'Czy było wcześniejsze leczenie ortodontyczne? ',
              name: 'orthodonticTreatmentHistory',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label:
                    'Proszę opisać kiedy, powód leczenia, na czym polegało, czas leczenia, przebieg: ',
                  placeholder: '',
                },
              ],
            },
            {
              label: 'Krótkie wędzidło języka?',
              name: 'tongueTie',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'conditionalField',
                  label: 'Interwencja chirurgiczna?',
                  conditionalFields: [
                    {
                      type: 'textarea',
                      label: 'Kiedy',
                      placeholder: '',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Krótkie wędzidło wargi?',
              name: 'lipTie',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'conditionalField',
                  label: 'Interwencja chirurgiczna?',
                  conditionalFields: [
                    {
                      type: 'textarea',
                      label: 'Kiedy',
                      placeholder: '',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Problemy logopedyczne?',
              name: 'speechProblems',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jakie?',
                  placeholder: 'Opisz problemy logopedyczne...',
                },
              ],
            },
            {
              label: 'Bóle głowy?',
              name: 'headaches',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jak często?',
                  placeholder: 'Jak często występują bóle głowy?',
                },
              ],
            },
          ],
          name: 'dentalHistory',
          title: '',
        },
        {
          description: 'Nawyki pacjenta',
          fields: [
            {
              label: 'Ssanie kciuka?',
              name: 'thumbSucking',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Do kiedy?',
                  placeholder: 'Do jakiego wieku?',
                },
              ],
            },
            {
              label: 'Ssanie palca?',
              name: 'fingerSucking',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Do kiedy?',
                  placeholder: 'Do jakiego wieku?',
                },
              ],
            },
            {
              label: 'Ssanie smoczka?',
              name: 'pacifierSucking',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Do kiedy?',
                  placeholder: 'Do jakiego wieku?',
                },
              ],
            },
            {
              label: 'Gra na instrumencie?',
              name: 'playsInstrument',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jakim?',
                  placeholder: 'Na jakim instrumencie?',
                },
              ],
            },
            {
              label: 'Uprawianie sportu?',
              name: 'playsSports',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jakiego?',
                  placeholder: 'Jaki sport?',
                },
              ],
            },
            {
              label: 'Czy zęby służą do czegoś poza jedzeniem?',
              name: 'teethMisuse',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Do czego?',
                  placeholder: 'Opisz do czego używane są zęby...',
                },
              ],
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
              type: 'radio',
              options: [
                {
                  value: 'hard',
                  label: 'twarde',
                },
                {
                  value: 'soft',
                  label: 'miękkie',
                },
              ],
            },
          ],
          name: 'foodPreferences',
          title: 'Preferencje pokarmowe',
        },
        {
          description: '',
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
              label: 'Czy pacjent jest/był pod opieką fizjoterapeuty?',
              name: 'physiotherapy',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Kiedy?',
                  placeholder: 'Opisz kiedy',
                },
                {
                  type: 'textarea',
                  label: 'Z jakiego powodu?',
                  placeholder: 'Opisz z jakiego powodu...',
                },
              ],
            },
            {
              label: 'Czy dziecko uczęszcza/uczęszczało na gimnastykę korekcyjną?',
              name: 'correctiveGymnastics',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Kiedy?',
                  placeholder: 'Opisz kiedy',
                },
                {
                  type: 'textarea',
                  label: 'Z jakiego powodu?',
                  placeholder: 'Opisz z jakiego powodu...',
                },
              ],
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
              label: 'Częste zapalenie migdałków?',
              name: 'tonsilInflammation',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jak często?',
                  placeholder: 'Opisz częstotliwość zapaleń...',
                },
              ],
            },
            {
              label: 'Usunięte migdałki podniebienne?',
              name: 'tonsillectomy',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Kiedy?',
                  placeholder: 'Kiedy były usunięte?',
                },
              ],
            },
            {
              label: 'Usunięty migdałek gardłowy?',
              name: 'adenoidectomy',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Kiedy?',
                  placeholder: 'Kiedy był usunięty?',
                },
              ],
            },
            {
              label: 'Inne problemy laryngologiczne (zatoki, krzywa przegroda nosa, polipy, itp.)?',
              name: 'otherEarNoseThroatProblems',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz inne problemy laryngologiczne...',
                },
              ],
            },
          ],
          name: 'laryngologicalProblems',
          title: 'Problemy laryngologiczne',
        },
        {
          description: 'Słuch',
          fields: [
            {
              label: 'Zdiagnozowane problemy ze słuchem?',
              name: 'hearingProblems',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jakie?',
                  placeholder: 'Opisz problemy ze słuchem...',
                },
              ],
            },
            {
              label: 'Zatkane uszy?',
              name: 'blockedEars',
              type: 'checkbox',
            },
            {
              label: 'Chirurgiczne odbarczanie ucha?',
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
              label: 'Oddychanie przez usta? Częstość od 1 (rzadko) do 5 (cały czas):',
              name: 'mouthBreathing',
              type: 'radio',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
            },
            {
              label:
                'Zablokowany nos? Jak mocno zablokowany? od 1 (umiarkowanie) do 5 (całkowicie):',
              name: 'blockedNose',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'radio',
                  label: 'Jak mocno zablokowany? od 1 (umiarkowanie) do 5 (całkowicie)?',
                  options: [
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                  ],
                },
                {
                  label: 'Sezonowo?',
                  name: 'seasonalProblems',
                  type: 'checkbox',
                },
              ],
            },
            {
              label: 'Chrapanie?',
              name: 'snoring',
              type: 'checkbox',
            },

            {
              label: 'Podejrzenie bezdechu sennego?',
              name: 'sleepApnea',
              type: 'checkbox',
            },
            {
              label: 'Czy wykonano badanie snu?',
              name: 'sleepStudy',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jaki wynik?',
                  placeholder: 'Opisz wyniki badania snu...',
                },
              ],
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
              label: 'Jakość snu od 1 (doskonały) do 5 (bardzo zły)?',
              type: 'radio',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
            },
            {
              label: 'Zrzyganie zębami w nocy?',
              name: 'nightTeethGrinding',
              type: 'checkbox',
            },
            {
              label: 'Łatwe wstawanie rano, z podkrążonymi oczami?',
              name: 'morningTiredness',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  placeholder: 'Opisz problemy z porannym wstawaniem...',
                },
              ],
            },
            {
              labelabel: 'Częste chodzenie podczas snu?',
              name: 'walkingWhileSpleeping',
              type: 'checbkox',
            },

            {
              label: 'Częste koszmary senne?',
              name: 'nightmares',
              type: 'checkbox',
            },
            {
              label: 'Moczenie nocne?',
              name: 'bedwetting',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jak często?',
                  placeholder: 'Opisz częstotliwość...',
                },
              ],
            },
            {
              label: 'Spanie z lekko / całkowicie* otwartą buzią?',
              name: 'sleepingWithOpenMouth',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Jak często?',
                  placeholder: 'Opisz jak często...',
                },
              ],
            },
            {
              label: 'Wstawnie rano',
              type: 'radio',
              options: [
                {
                  value: 'easy',
                  label: 'Łatwe',
                },
                {
                  value: 'hard',
                  label: 'Trudne, z podkrążonymi oczami',
                },
              ],
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
              label:
                'W jakich sytuacjach pacjent ma otwarte usta? Od 1 (bardzo rzadko) do 5 (prawie zawsze)?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
            {
              name: 'walkingTime',
              label: 'Gdy stoi?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
            {
              name: 'walkingTimeMoving',
              label: 'Podczas chodzenia?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
            {
              name: 'driving',
              label: 'Podczas jazdy samochodem?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
            {
              name: 'computerWork',
              label: 'Podczas zabawy w domu?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
            {
              name: 'sleepingMouth',
              label: 'Podczas snu?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
          ],
          name: 'openMouth',
          title: 'Otwarte usta',
        },
        {
          description: '',
          fields: [
            {
              name: 'homeworkTime',
              label: 'Podczas odrabiania prac domowych?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
            {
              name: 'playTime',
              label: 'Zabawa w domu?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
            {
              name: 'outdoorPlay',
              label: 'Zabawa na dworze?',
              options: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ],
              type: 'radio',
            },
          ],
          name: 'childrenActivities',
          title: 'Dotyczy dzieci',
        },
        {
          description: 'Alergie',
          fields: [
            {
              label: 'Alergiczny nieżyt nosa?',
              name: 'allergicRhinitis',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Czym spowodowany?',
                  placeholder: 'Opisz przyczyny alergicznego nieżytu nosa...',
                },
                {
                  type: 'textarea',
                  label: 'Od kiedy?',
                  placeholder: 'Opisz przyczyny alergicznego nieżytu nosa...',
                },
                {
                  type: 'textarea',
                  label: 'Do kiedy?',
                  placeholder: 'Opisz przyczyny alergicznego nieżytu nosa...',
                },
                {
                  name: 'rhinitisSeverity',
                  label: 'Ciężkość nieżytu nosa od 1 (umiarkowany) do 5 (ciężki):',
                  options: [
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                  ],
                  type: 'radio',
                },
                {
                  name: 'rhinitisFrequency',
                  label: 'Częstość nieżytu nosa od 1 (rzadkie) do 5 (częste):',
                  options: [
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                  ],
                  type: 'radio',
                },
              ],
            },

            {
              label: 'Alergia / nietolerancja pokarmowa?',
              name: 'foodAllergy',
              type: 'conditionalField',
              conditionalFields: [
                {
                  type: 'textarea',
                  label: 'Od kiedy?',
                  placeholder: '',
                },
                {
                  type: 'textarea',
                  label: 'Do kiedy?',
                  placeholder: '',
                },
                {
                  type: 'textarea',
                  label: 'Na jakie składniki?',
                  placeholder: 'Opisz przyczyny alergicznego nieżytu nosa...',
                },
              ],
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
