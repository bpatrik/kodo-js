///<reference path="./kodo.d.ts"/>

const KODO = require('./kodo');


const rndData = (size: number): Uint8Array => {
  const uint = new Uint8Array(size);
  for (let i = 0; i < uint.byteLength; i++) {
    uint[i] = Math.floor(Math.random() * 255);
  }
  return uint;
};
const equal = (buf1: Uint8Array, buf2: Uint8Array) => {
  if (buf1.byteLength !== buf2.byteLength) {
    return false;
  }
  for (let i = 0; i !== buf1.byteLength; i++) {
    if (buf1[i] !== buf2[i]) {
      return false;
    }
  }
  return true;
};

// constants
const symbols = 25;
const symbol_size = 1100;
const block_size = symbols * symbol_size;
const dataSize = 284034;
const end_symbols = Math.ceil((dataSize % block_size) / symbol_size);
const coders = Math.floor(dataSize / block_size);


let EFactory = null;
let DFactory = null;
let end_EFactory = null;
let end_DFactory = null;

let enc, dec, d;
try {

  // lets run it twice
  for (let i = 0; i < 2; i++) {
    console.log('round', i);
    const data = rndData(dataSize);

    // run the full encoders
    for (let j = 0; j < coders - 1; j++) {
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

      let tries = 0;
      while (!dec.is_complete() && tries++ < symbols * 2) {
        dec.read_payload(enc.write_payload().slice());
      }

      if (!dec.is_complete()) {
        console.log('can\'t complete');
      } else if (!equal(dec.copy_from_symbols().slice(0, d.byteLength), d.slice())) {
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

} catch (e) {
  console.error('ERROR:');
  console.log(e);
}
