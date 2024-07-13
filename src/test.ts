class Base64 {
    private static readonly TEMPLATE = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`;
    // 私有化构造器
    private constructor() { }
    // 类唯一实例
    private static readonly Instance = new Base64;
    // 获取类实例方法
    public static getInstance() {
        return Base64.Instance;
    }
    // 字符串转数组
    private characterStringToArray(cs: string) {
        return cs.split('');
    }
    private toBinary(value: number) {
        return value.toString(2);
    }
    // 二进制数填充
    private binaryPadding(value: string | number, length: number = 8, fill: string = '0') {
        if (typeof value === 'string') {
            return value.padStart(length, fill);
        }
        return this.toBinary(value).padStart(length, fill);
    }
    // 字符串转二进制
    private characterStringToUtf8Binary = (cs: string) => {
        if (!cs) return cs;
        // 字符数组
        const characters = this.characterStringToArray(cs);
        let utf8Binary = '';
        characters.forEach(character => {
            utf8Binary += this.characterToUtf8Binary(character);
        });
        return utf8Binary;
    };
    private characterToUtf8Binary(character = '') {
        let binary = '';
        // 获取当前字符对应的 utf-16 的码元(通俗说法是获取对应的 unicode 的码点)
        const codePoint = character.charCodeAt(0);
        const codePointHex = +`0x${codePoint.toString(16)}`;
        if (codePoint >= 0 && codePoint <= 0x7f) { // 0xxxxxxx
            binary += this.binaryPadding(0x0 | (codePointHex & 0x7f));
        } else if (codePoint >= 0x80 && codePoint <= 0x7ff) { // 110xxxxx 10xxxxxx
            binary += this.binaryPadding(0xc0 | ((codePointHex >> 6) & 0x1f));
            binary += this.binaryPadding(0x80 | (codePointHex & 0x3f));
        } else if (codePoint >= 0x800 && codePoint <= 0xffff) { // 1110xxxx 10xxxxxx 10xxxxxx
            binary += this.binaryPadding(0xe0 | ((codePointHex >> 12) & 0x0f));
            binary += this.binaryPadding(0x80 | ((codePointHex >> 6) & 0x3f));
            binary += this.binaryPadding(0x80 | (codePointHex & 0x3f));
        } else if (codePoint >= 0x10000 && codePoint <= 0x10ffff) { // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            binary += this.binaryPadding(0xf0 | ((codePointHex >> 18) & 0x07));
            binary += this.binaryPadding(0x80 | ((codePointHex >> 12) & 0x3f));
            binary += this.binaryPadding(0x80 | ((codePointHex >> 6) & 0x3f));
            binary += this.binaryPadding(0x80 | (codePointHex & 0x3f));
        }
        return binary;
    };
    public encode(cs: string) {
        const utf8Binary = this.characterStringToUtf8Binary(cs);
        const { length } = utf8Binary;
        const toBeFilledBitsLength = length % 6;
        const map: any = {
            2: {
                padStart: '00',
                padEnd: '0000',
                ext: '==',
            },
            4: {
                padStart: '00',
                padEnd: '00',
                ext: '=',
            },
        };
        let tailCode = '';
        if (toBeFilledBitsLength) { // 有待填充的位
            const bits = utf8Binary.slice(length - toBeFilledBitsLength);
            const { padStart, padEnd, ext } = map[toBeFilledBitsLength];
            const index = Number.parseInt(`${padStart}${bits}${padEnd}`, 2);
            tailCode = `${Base64.TEMPLATE[index]}${ext}`;
        }
        const justBits = utf8Binary.slice(0, length - toBeFilledBitsLength);
        const groupLength = justBits.length / 6;
        let base64 = '';
        for (let i = 0; i < groupLength; i++) {
            const index = Number.parseInt(this.binaryPadding(justBits.slice(i * 6, i * 6 + 6)), 2);
            base64 += Base64.TEMPLATE[index];
        }
        base64 = `${base64}${tailCode}`;
        return base64;
    }
}

export default Base64;