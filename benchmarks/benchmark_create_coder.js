// Copyright Steinwurf ApS 2015.
// Distributed under the "STEINWURF RESEARCH LICENSE 1.0".
// See accompanying file LICENSE.rst or
// http://www.steinwurf.com/licensing

// Load benchmark framework


kodo = module.require('kodo.js');

var test_amount;

var symbol_size;
var symbols;

var encoder_test = [];
var decoder_test = [];
var decoder_factory_test = [];
var encoder_factory_test = [];

// Setup and execute test
setup_test(10, 16, 160);
run_test();
print_all_tests();



function setup_test(n_test_amount, n_symbol_size, n_symbols){
    test_amount = n_test_amount;
    symbol_size = n_symbol_size;
    symbols = n_symbols;
}

function run_test(){
    run_decoder_tests();
    run_encoder_tests();
    run_decoder_factory_tests();
    run_encoder_factory_tests();
}

function run_decoder_tests(){
    decoder_factory = new kodo.decoder_factory(symbols, symbol_size);
    var base_id = "decoder_test_";
    for(var i = 0; i < test_amount; i++){
        decoder_creation_test(base_id + i, decoder_factory);
    }
}

function run_encoder_tests(){
    var encoder_factory = new kodo.encoder_factory(symbols, symbol_size);
    var base_id = "encoder_test_";
    for(var i = 0; i < test_amount; i++){
        encoder_creation_test(base_id + i, encoder_factory);
    }
}

function run_encoder_factory_tests(){
    var base_id  = "encoder_factory_test_";
    for(var i = 0; i < test_amount; i++){
        encoder_factory_creation_test(base_id + i);
    }
}

function run_decoder_factory_tests(){
    var base_id  = "decoder_factory_test_";
    for(var i = 0; i < test_amount; i++){
        decoder_factory_creation_test(base_id + i);
    }
}

function decoder_creation_test(test_id, decoder_factory){
    var start_time = new Date().getTime();
    var decoder = decoder_factory.build();
    var end_time = new Date().getTime();
    var test_time = end_time - start_time;
    decoder_test.push([test_id, start_time, end_time, test_time]);
}

function encoder_creation_test(test_id, encoder_factory){
    var start_time = new Date().getTime();
    var encoder = encoder_factory.build();
    var end_time = new Date().getTime();
    var test_time = end_time - start_time;
    encoder_test.push([test_id, start_time, end_time, test_time]);
}

function decoder_factory_creation_test(test_id){
    var start_time = new Date().getTime();
    var decoder_factory = new kodo.decoder_factory(symbols, symbol_size);
    var end_time = new Date().getTime();
    var test_time = end_time - start_time;
    decoder_factory_test.push([test_id, start_time, end_time, test_time]);
}

function encoder_factory_creation_test(test_id){
    var start_time = new Date().getTime();
    var encoder_factory = new kodo.encoder_factory(symbols, symbol_size);
    var end_time = new Date().getTime();
    var test_time = end_time - start_time;
    encoder_factory_test.push([test_id, start_time, end_time, test_time]);
}


function print_all_tests(){
    print_decoder_tests();
    console.log("\n");
    print_encoder_tests();
    console.log("\n");
    print_decoder_factory_tests();
    console.log("\n");
    print_encoder_factory_tests();
}

function print_decoder_tests(){
    console.log("Create decoder benchmark")
    print_header();
    decoder_test.forEach(function(entry){
        print_test_output(entry);
    });
}


function print_decoder_factory_tests(){
    console.log("Create decoder factory benchmark")
    print_header();
    decoder_factory_test.forEach(function(entry){
        print_test_output(entry);
    });
}



function print_encoder_tests(){
    console.log("Create encoder benchmark")
    print_header();
    encoder_test.forEach(function(entry){
        print_test_output(entry);
    });
}

function print_encoder_factory_tests(){
    console.log("Create encoder factory benchmark")
    print_header();
    encoder_factory_test.forEach(function(entry){
        print_test_output(entry);
    });
}


function print_test_output(data){
    var res = "  " + data[0] + "      " + data[1] + "      " + data[2] + "                  " +  data[3];
    console.log(res);
}

function print_header(){
    console.log("======== TEST ID ======== ==== Start Time ==== ==== End Time ==== ==== Execution Time (MS)  ====")
}
