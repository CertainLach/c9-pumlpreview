define(['require'], function (req) {
    function encode64(data) {
            var r = "";
            for (var i = 0; i < data.length; i += 3) {
                if (i + 2 == data.length) {
                    r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
                }
                else if (i + 1 == data.length) {
                    r += append3bytes(data.charCodeAt(i), 0, 0);
                }
                else {
                    r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
                }
            }
            return r;
        }

        function append3bytes(b1, b2, b3) {
            return encode6bit((b1 >> 2) & 0x3F) +
                encode6bit((((b1 & 0x3) << 4) | (b2 >> 4)) & 0x3F) +
                encode6bit((((b2 & 0xF) << 2) | (b3 >> 6)) & 0x3F) +
                encode6bit((b3 & 0x3F) & 0x3F);
        }

        function encode6bit(b) {
            if (b < 10) {
                return String.fromCharCode(48 + b);
            }
            b -= 10;
            if (b < 26) {
                return String.fromCharCode(65 + b);
            }
            b -= 26;
            if (b < 26) {
                return String.fromCharCode(97 + b);
            }
            b -= 26;
            if (b == 0) {
                return '-';
            }
            if (b == 1) {
                return '_';
            }
            return '?';
        }
    
    return function (code,deflateObj) {
        return "//www.plantuml.com/plantuml/img/" + encode64(deflateObj.RawDeflate.deflate(code));
    }
});