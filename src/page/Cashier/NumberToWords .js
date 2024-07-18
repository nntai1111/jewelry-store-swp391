import React, { useState } from 'react';

const NumberToWords = ({ number }) => {
  const one = (num) => {
    switch (num) {
      case 1: return 'One';
      case 2: return 'Two';
      case 3: return 'Three';
      case 4: return 'Four';
      case 5: return 'Five';
      case 6: return 'Six';
      case 7: return 'Seven';
      case 8: return 'Eight';
      case 9: return 'Nine';
      default: return '';
    }
  };

  const twoLessThan20 = (num) => {
    switch (num) {
      case 10: return 'Ten';
      case 11: return 'Eleven';
      case 12: return 'Twelve';
      case 13: return 'Thirteen';
      case 14: return 'Fourteen';
      case 15: return 'Fifteen';
      case 16: return 'Sixteen';
      case 17: return 'Seventeen';
      case 18: return 'Eighteen';
      case 19: return 'Nineteen';
      default: return '';
    }
  };

  const tens = (num) => {
    switch (num) {
      case 2: return 'Twenty';
      case 3: return 'Thirty';
      case 4: return 'Forty';
      case 5: return 'Fifty';
      case 6: return 'Sixty';
      case 7: return 'Seventy';
      case 8: return 'Eighty';
      case 9: return 'Ninety';
      default: return '';
    }
  };

  const two = (num) => {
    if (num === 0) return '';
    if (num < 10) return one(num);
    if (num < 20) return twoLessThan20(num);
    const tenner = Math.floor(num / 10);
    const rest = num - tenner * 10;
    return tens(tenner) + (rest ? ' ' + one(rest) : '');
  };

  const three = (num) => {
    const hundred = Math.floor(num / 100);
    const rest = num - hundred * 100;
    if (hundred && rest) return one(hundred) + ' Hundred ' + two(rest);
    if (!hundred && rest) return two(rest);
    if (hundred && !rest) return one(hundred) + ' Hundred';
  };

  const numToWords = (num) => {
    if (num === 0) return 'Zero';
    const billion = Math.floor(num / 1000000000);
    const million = Math.floor((num - billion * 1000000000) / 1000000);
    const thousand = Math.floor((num - billion * 1000000000 - million * 1000000) / 1000);
    const remainder = num - billion * 1000000000 - million * 1000000 - thousand * 1000;

    let result = '';
    if (billion) result += three(billion) + ' Billion';
    if (million) result += (result ? ' ' : '') + three(million) + ' Million';
    if (thousand) result += (result ? ' ' : '') + three(thousand) + ' Thousand';
    if (remainder) result += (result ? ' ' : '') + three(remainder);

    return result;
  };
};



export default NumberToWords;
