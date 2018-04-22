///<reference path="./kodo.d.ts"/>
var KODO = require('./kodo');
var rndData = function (size) {
    var uint = new Uint8Array(size);
    for (var i = 0; i < uint.byteLength; i++) {
        uint[i] = Math.floor(Math.random() * 255);
    }
    return uint;
};
var equal = function (buf1, buf2) {
    if (buf1.byteLength !== buf2.byteLength) {
        return false;
    }
    for (var i = 0; i !== buf1.byteLength; i++) {
        if (buf1[i] !== buf2[i]) {
            return false;
        }
    }
    return true;
};
// constants
var symbols = 25;
var symbol_size = 1100;
var block_size = symbols * symbol_size;
var dataSize = 284034;
var end_symbols = Math.ceil((dataSize % block_size) / symbol_size);
var coders = Math.floor(dataSize / block_size);
var EFactory = null;
var DFactory = null;
var end_EFactory = null;
var end_DFactory = null;
var enc, dec, d;
try {
    // lets run it twice
    for (var i = 0; i < 2; i++) {
        console.log('round', i);
        var data = rndData(dataSize);
        // run the full encoders
        for (var j = 0; j < coders - 1; j++) {
            console.log('gen', j);
            if (!EFactory) {
                EFactory = new KODO.encoder_factory(KODO.field.binary8, symbols, symbol_size);
            }
            enc = EFactory.build();
            if (!DFactory) {
                DFactory = new KODO.decoder_factory(KODO.field.binary8, symbols, symbol_size);
            }
            dec = DFactory.build();
            d = data.slice(j * symbols * symbol_size, (j + 1) * symbols * symbol_size);
            if (enc.is_systematic_on()) {
                enc.set_systematic_off();
            }
            enc.set_const_symbols(d.slice());
            var tries = 0;
            while (!dec.is_complete() && tries++ < symbols * 2) {
                dec.read_payload(enc.write_payload().slice());
            }
            if (!dec.is_complete()) {
                console.log('can\'t complete');
            }
            else if (!equal(dec.copy_from_symbols().slice(0, d.byteLength), d.slice())) {
                console.log('decoding error');
            }
            enc.delete();
            dec.delete();
        }
        // run the smaller encoder
        console.log('gen', coders, 'max rank', end_symbols);
        if (!end_EFactory) {
            end_EFactory = new KODO.encoder_factory(KODO.field.binary8, end_symbols, symbol_size);
        }
        enc = end_EFactory.build();
        if (!end_DFactory) {
            end_DFactory = new KODO.decoder_factory(KODO.field.binary8, end_symbols, symbol_size);
        }
        dec = end_DFactory.build();
        d = data.slice(coders * block_size, (coders + 1) * block_size);
        enc.set_const_symbols(d);
        while (!dec.is_complete()) {
            dec.read_payload(enc.write_payload().slice());
        }
        if (!dec.is_complete()) {
            console.log('can\'t complete');
        }
        if (!equal(dec.copy_from_symbols().slice(0, d.byteLength), d.slice())) {
            console.log('decoding error');
        }
        enc.delete();
        dec.delete();
        console.log('round', i, 'ready');
    }
}
catch (e) {
    console.error('ERROR:');
    console.log(e);
}
//# sourceMappingURL=test.js.map