import _ from 'lodash';

export type CO2Unit = 'kg' | 'tonnes' | 'tonne';

export type CO2FormatNotation =
    | 'quantity-unit-short'
    | 'quantity-unit-medium'
    | 'quantity-unit-full'
    | 'quantity-unit-co2e';

interface FormattedCO2 {
    amount: string;
    unit: CO2Unit;
    formattedUnit: string;
}

export type FormatCO2Options = {
    unit?: Omit<CO2Unit, 'tonne'>;
    maximumFractionDigits?: number;
    notation?: CO2FormatNotation;
    showTonnesIfAtLeastKg?: number;
};

export const fullPrecisionAlwaysTonnesFormat: FormatCO2Options = {
    unit: 'tonnes',
    maximumFractionDigits: 100
};

export const fullPrecisionAlwaysTonnesShortFormat: FormatCO2Options = {
    ...fullPrecisionAlwaysTonnesFormat,
    notation: 'quantity-unit-short'
};

export function unitForCO2Amount(amountKg: number): CO2Unit {
    return amountKg >= thresholdToShowTonnes ? 'tonnes' : 'kg';
}

const thresholdToShowTonnes = 100000;

const co2QuantityFormatter = new Intl.NumberFormat('us-US', { maximumFractionDigits: 20 });

const shortUnits: Record<CO2Unit, string> = {
    tonne: 't',
    tonnes: 't',
    kg: 'kg'
};

const mediumUnits: Record<CO2Unit, string> = {
    tonne: 'tonne',
    tonnes: 'tonnes',
    kg: 'kg'
};

const fullUnits: Record<CO2Unit, string> = {
    tonne: 'tonne',
    tonnes: 'tonnes',
    kg: 'kg'
};

const co2eUnits: Record<CO2Unit, string> = {
    tonne: 't CO₂e',
    tonnes: 't CO₂e',
    kg: 'kg CO₂e'
};

const notationToUnitLookup: Record<CO2FormatNotation, Record<CO2Unit, string>> = {
    'quantity-unit-short': shortUnits,
    'quantity-unit-medium': mediumUnits,
    'quantity-unit-full': fullUnits,
    'quantity-unit-co2e': co2eUnits
};

export function formatCO2(
    amountKg: number,
    {
        unit: requestedUnit = undefined,
        notation = 'quantity-unit-medium',
        maximumFractionDigits = 2,
        showTonnesIfAtLeastKg = thresholdToShowTonnes
    }: FormatCO2Options = {}
): FormattedCO2 {
    let amountToFormat = amountKg;
    let unit: CO2Unit = 'kg';

    if (requestedUnit === 'tonnes' || amountKg >= showTonnesIfAtLeastKg) {
        amountToFormat = amountKg / 1000;
        unit = amountToFormat === 1 ? 'tonne' : 'tonnes';
    }

    const minDisplayableAmount = Math.pow(10, -maximumFractionDigits);
    const formattedAmount =
        amountToFormat > 0 && amountToFormat < minDisplayableAmount
            ? `< ${minDisplayableAmount}`
            : co2QuantityFormatter.format(_.round(amountToFormat, maximumFractionDigits));

    return {
        amount: formattedAmount,
        unit,
        formattedUnit: notationToUnitLookup[notation][unit]
    };
}

export function formatCO2AsString(amountKg: number, options: FormatCO2Options = {}) {
    const { amount, formattedUnit } = formatCO2(amountKg, options);
    return `${amount} ${formattedUnit}`;
}

export function toRomanNumerals(num: number) {
    let roman = '';

    for (let i = 0; i < romans.length; i++) {
        while (num >= romans[i][0]) {
            roman += romans[i][1];
            num -= romans[i][0];
        }
    }

    return roman;
}

const romans: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
];
