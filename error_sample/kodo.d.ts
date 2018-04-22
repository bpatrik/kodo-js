declare module KODO {
  enum field {
    binary, binary4, binary8, binary16, prime2325
  }

  interface Koder {
    write_payload(): Uint8Array;

    payload_size(): number;

    block_size(): number;

    symbol_size(): number;

    symbols(): number;

    rank(): number;


    is_symbol_pivot(index: number): boolean;

    coefficient_vector_size(): number;

    delete();

  }

  interface Encoder extends KODO.Koder {

    write_symbol(coefficients: Uint8Array): Uint8Array;

    is_systematic_on(): boolean;

    set_systematic_off();

    set_systematic_on();

    generate(): Uint8Array;

    set_const_symbols(data: Uint8Array);

    set_const_symbol(index: number, data: Uint8Array);

  }

  interface Decoder extends KODO.Koder {
    is_complete(): boolean;

    symbols_uncoded(): number;

    copy_from_symbols(): Uint8Array;

    is_symbol_uncoded(index: number): boolean;

    read_payload(payload: Uint8Array);

    read_symbol(payload: Uint8Array, coefficients: Uint8Array);

    symbols_partially_decoded(): number;

  }

  interface encoder_factory {
    constructor(field: field, symbols: number, symbol_size: number);

    build(): Encoder;

    delete();
  }

  interface decoder_factory {
    constructor(field: field, symbols: number, symbol_size: number);

    build(): Decoder;

    delete();
  }
}
