function numberInFullConverter(number) {
  // Trocar vírgula por ponto
  const stringNumber = number.toString().replace(',', '.');
  // Recuperar valor numérico
  const numericValue = parseFloat(stringNumber);
  // Separar parte inteira
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
  const upperLimit = 999 * oneBillion;

  const cents = fractionalParteOf(numericValue);
  let centsLength = null;

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

  // Caso o valor esteja acima do limite de 999bilhões, mostrar aviso ao usuário
  if (integerNumber >= upperLimit) caseSelect = 1;

  // Caso o valor seja nulo, o resultado será Zero real
  if (!numericValue) caseSelect = 2;

  // Caso sejam usados mais que dois dígitos após a vírgula,
  // mostrar aviso ao usuário
  // evitando comportamento inadequado para o caso de R$ 0,100
  if (cents) centsLength = fractionalPartCounter(number);

  if (centsLength > 2) caseSelect = 3;

  switch (caseSelect) {
    case 1:
      valueInFull = 'Valor maior que 999 bilhões';
      break;
    case 2:
      valueInFull = 'Zero real';
      break;
    case 3:
      valueInFull = ' Os centavos devem ter menos que três dígitos';
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
  // return centsLength;
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

// Informa o número de casas decimais de um número
function fractionalPartCounter(number) {
  // Forma alternativa de conversão número-string
  const stringNumber = number + '';
  // Trocar vírgula por ponto
  const newStringNumber = stringNumber.replace(',', '.');
  const stringFractionalPart = newStringNumber.split('.');
  const fractionalLength = stringFractionalPart[1].length;

  return fractionalLength;
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
function fractionalParteOf(number) {
  const integralPart = Math.trunc(number);
  const fractionalPart = number - integralPart;
  const roundedFractionalPart = Math.round(fractionalPart + 'e+2');

  return roundedFractionalPart;
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
