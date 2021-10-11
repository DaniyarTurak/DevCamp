const romanToInt = (s) => {
    const roman = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000
    };

    let res = 0;
    if (s.length == 1) {
        return roman[s[0]];
    }

    for (let i=0; i<s.length-1; i++) {
        
        if (roman[s[i]] >= roman[s[i+1]]) {
            res += roman[s[i]];
        } else {
            res += roman[s[i+1]] - roman[s[i]];
            i++;
        }

        if (i == s.length-2) {
            res += roman[s[i+1]];
        }
    }


    return res;
};

console.log(romanToInt("XXI"));
console.log(romanToInt("D"));
console.log(romanToInt("MDCXCV"));