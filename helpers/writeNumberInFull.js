function numberInFullConverter(number) {
  // Trocar vírgula por ponto
  const stringNumber = number.toString().replace(',', '.');
  // Recuperar valor numérico
  const numericValue = parseFloat(stringNumber);
  // let floatNumber = parseFloat(numericValue);
  const integerNumber = Math.trunc(numericValue);

  let valueInFull = '';

  const {
    hundredsClass,
    thousandsClass,
    millionsClass,
    billionsClass,
  } = separateNumberClasses(integerNumber);

  const oneBillion = 1000000000;
  const oneMillion = 1000000;

  const cents = decimalPartOf(numericValue);

  // Escrever por extenso cada classe do número
  const billionsInFull =
    classesInFull(billionsClass) +
    (billionsClass > 1 ? ' bilhões ' : billionsClass != 0 ? ' bilhão ' : '');

  const millionsInFull =
    classesInFull(millionsClass) +
    (millionsClass > 1 ? ' milhões ' : millionsClass != 0 ? ' milhão ' : '');

  const thousandsInFull =
    (thousandsClass == 1 ? '' : classesInFull(thousandsClass)) +
    (thousandsClass > 0 ? ' mil ' : '');

  const hundredsInFull = classesInFull(hundredsClass);

  const brazilCurrency =
    integerNumber &&
    (integerNumber % oneBillion == 0 || integerNumber % oneMillion == 0
      ? ' de reais'
      : integerNumber > 1
      ? ' reais'
      : ' real');

  const centsInFull =
    (cents == 0 ? '' : ' e ') +
    classesInFull(cents) +
    (cents > 1 ? ' centavos' : cents == 1 ? ' centavo' : '');

  /* Só se usa o conectivo 'e' entre classes se:
     a última classe não-nula tem um número múltiplo de 100
     ou menor que 100
     e as classes anteiores e posterior ao conectivo não forem nulas */
  const biMiConnective =
    billionsClass &&
    millionsClass &&
    (millionsClass % 100 == 0 || millionsClass < 100) &&
    thousandsClass + hundredsClass == 0
      ? ' e '
      : '';
  const miThousConnective =
    (billionsClass || millionsClass) &&
    thousandsClass &&
    (thousandsClass % 100 == 0 || thousandsClass < 100) &&
    hundredsClass == 0
      ? ' e '
      : '';

  const thousHundConnective =
    hundredsClass &&
    billionsClass + millionsClass + thousandsClass &&
    (hundredsClass % 100 == 0 || hundredsClass < 100)
      ? ' e '
      : '';

  let caseSelect = null;

  if (integerNumber >= 1000000000000) caseSelect = 1;

  if (!numericValue) caseSelect = 2;

  switch (caseSelect) {
    case 1:
      valueInFull = 'Valor maior que 999 bilhões';
      break;
    case 2:
      valueInFull = 'Zero real';
      break;
    default:
      valueInFull =
        (integerNumber
          ? billionsInFull +
            biMiConnective +
            millionsInFull +
            miThousConnective +
            thousandsInFull +
            thousHundConnective +
            hundredsInFull +
            brazilCurrency
          : 'Zero real ') + centsInFull;
      valueInFull = cutDoubleSpace(valueInFull);
  }

  const capitalizedValueInFull = capitalizeFirstLetter(valueInFull);

  return capitalizedValueInFull;
}

// Retira espaços vazios duplos de uma string
function cutDoubleSpace(str) {
  str = str.replace(/\s{2,}/g, ' ');
  return str;
}

function capitalizeFirstLetter(str) {
  //pega apenas as palavras e tira todos os espaços em branco.
  return str.replace(/\w\S/, function (str) {
    //passa o primeiro caractere para maiusculo, e adiciona o todo resto minusculo
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
}

// Escreve por extenso números menores que 1000
function classesInFull(number) {
  let lessThanTwenty = [
    '',
    'um',
    'dois',
    'três',
    'quatro',
    'cinco',
    'seis',
    'sete',
    'oito',
    'nove',
    'dez',
    'onze',
    'doze',
    'treze',
    'quatorze',
    'quinze',
    'dezesseis',
    'dezessete',
    'dezoito',
    'dezenove',
  ];

  let tensAfterTwenty = [
    '',
    'vinte',
    'trinta',
    'quarenta',
    'cinquenta',
    'sessenta',
    'setenta',
    'oitenta',
    'noventa',
  ];

  let hundreds = [
    '',
    'cento',
    'duzentos',
    'trezentos',
    'quatrocentos',
    'quinhentos',
    'seiscentos',
    'setecentos',
    'oitocentos',
    'novecentos',
  ];
  let numberInFull = '';
  let { unitsPart, tensPart, hundredsPart } = splitNumber(number);

  // Se o número for múltiplo de 100
  if (!(number % 100)) {
    number == 100
      ? (numberInFull = 'cem')
      : (numberInFull = hundreds[hundredsPart]);
  } else {
    numberInFull = `${
      hundreds[hundredsPart] + (hundredsPart === 0 ? '' : ' e')
    } ${
      tensPart > 1
        ? tensAfterTwenty[tensPart - 1] +
          (unitsPart === 0 ? ' ' : ' e ') +
          lessThanTwenty[unitsPart]
        : tensPart == 0
        ? lessThanTwenty[unitsPart]
        : lessThanTwenty[unitsPart + 10]
    }`;
  }

  // Unidade nula, não usar conectivo
  unitsPart === 0 ? ' ' : ' e ';

  return numberInFull;
}

// Separa centenas, dezenas, unidades  de um número
function splitNumber(number) {
  // Separar centena
  const hundredsPart = Math.trunc(number / 100);

  // Separar dezena
  const integerQuotient = Math.trunc(number / 10);
  const tensPart = integerQuotient % 10;

  // Separar unidade
  const unitsPart = Math.trunc(number) % 10;

  return { unitsPart, tensPart, hundredsPart };
}

// Separa a parte decimal de um número
function decimalPartOf(number) {
  const integerPart = Math.trunc(number);
  const decimalPart = number - integerPart;
  const roundedDecimalPart = Math.round(decimalPart + 'e+2');

  return roundedDecimalPart;
}

// Separa número nas classes: centenas, milhares, milhões, bilhões
function separateNumberClasses(number) {
  const oneBillion = 1000000000;
  const oneMillion = 1000000;
  const oneThousand = 1000;

  const billionsClass = Math.trunc(number / oneBillion);

  const millionsClass = Math.trunc(
    (number - billionsClass * oneBillion) / oneMillion
  );

  const thousandsClass = Math.trunc(
    (number - billionsClass * oneBillion - millionsClass * oneMillion) /
      oneThousand
  );

  const hundredsClass = Math.trunc(
    number -
      billionsClass * oneBillion -
      millionsClass * oneMillion -
      thousandsClass * oneThousand
  );

  return { hundredsClass, thousandsClass, millionsClass, billionsClass };
}

export { numberInFullConverter };
