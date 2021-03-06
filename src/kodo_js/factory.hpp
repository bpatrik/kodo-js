// Copyright Steinwurf ApS 2015.
// Distributed under the "STEINWURF RESEARCH LICENSE 1.0".
// See accompanying file LICENSE.rst or
// http://www.steinwurf.com/licensing

#pragma once

#include <emscripten/bind.h>

#include <string>

namespace kodo_js
{

template<class Factory>
void factory_set_symbols(Factory& factory, uint32_t symbol_size)
{
    factory.set_symbols(symbol_size);
}

template<class Factory>
uint32_t factory_symbols(Factory& factory)
{
    return factory.symbols();
}

template<class Factory>
void factory_set_symbol_size(Factory& factory, uint32_t symbol_size)
{
    factory.set_symbol_size(symbol_size);
}

template<class Factory>
uint32_t factory_symbol_size(Factory& factory)
{
    return factory.symbol_size();
}

template<class Factory>
typename Factory::pointer factory_build(Factory& factory)
{
    return factory.build();
}

template<class Factory>
void factory(const std::string& name)
{
    using namespace emscripten;

    class_<Factory>((name + "_factory").c_str())
    .constructor<fifi::api::field, uint32_t, uint32_t>()
    .function("set_symbols", &factory_set_symbols<Factory>)
    .function("symbols", &factory_symbols<Factory>)
    .function("set_symbol_size", &factory_set_symbol_size<Factory>)
    .function("symbol_size", &factory_symbol_size<Factory>)
    .function("build", &factory_build<Factory>)
    ;
}
}
