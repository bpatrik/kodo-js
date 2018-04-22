// Copyigrht Steinwurf ApS 2015.
// Distributed under the "STEINWURF RESEARCH LICENSE 1.0".
// See accompanying file LICENSE.rst or
// http://www.steinwurf.com/licensing

#pragma once

#include <string>

#include "coder.hpp"

namespace kodo_js
{


template<class Encoder>
emscripten::val encoder_write_symbol(Encoder& encoder, const std::string coefficients)
{	
   std::vector<uint8_t> payload(encoder.symbol_size());
   encoder.write_symbol(payload.data(),(uint8_t*) coefficients.c_str());    
   return emscripten::val(emscripten::typed_memory_view(payload.size(), payload.data()));

}

	
template<class Encoder>
emscripten::val encoder_generate(Encoder& encoder)
{	
   std::vector<uint8_t> coefficients(encoder.coefficient_vector_size());
   encoder.generate(coefficients.data());    
   return emscripten::val(emscripten::typed_memory_view(coefficients.size(), coefficients.data()));
}
		
template<class Encoder>
void encoder_set_const_symbols(Encoder& encoder, const std::string& data)
{
    auto storage =
    storage::const_storage((uint8_t*)data.c_str(), data.length());
    encoder.set_const_symbols(storage);
}

template<class Encoder>
void encoder_set_const_symbol(Encoder& encoder, uint32_t index,
                              const std::string& data)
{
    auto storage =
        storage::const_storage((uint8_t*)data.c_str(), data.length());
    encoder.set_const_symbol(index, storage);
}

template<class Encoder>
bool encoder_is_systematic_on(const Encoder& encoder)
{
    return encoder.is_systematic_on();
}

template<class Encoder>
void encoder_set_systematic_on(Encoder& encoder)
{
    encoder.set_systematic_on();
}

template<class Encoder>
void encoder_set_systematic_off(Encoder& encoder)
{
    encoder.set_systematic_off();
}

template<class Coder>
void encoder(const std::string& name)
{
    coder<Coder>(std::string("encoder") + name)
    .function("write_symbol", &encoder_write_symbol<Coder>)
    .function("generate", &encoder_generate<Coder>)
    .function("set_const_symbols", &encoder_set_const_symbols<Coder>)
    .function("set_const_symbol", &encoder_set_const_symbol<Coder>)
    .function("is_systematic_on", &encoder_is_systematic_on<Coder>)
    .function("set_systematic_on", &encoder_set_systematic_on<Coder>)
    .function("set_systematic_off", &encoder_set_systematic_off<Coder>)
    ;
}
}
