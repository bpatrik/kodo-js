// Copyright Steinwurf ApS 2015.
// Distributed under the "STEINWURF RESEARCH LICENSE 1.0".
// See accompanying file LICENSE.rst or
// http://www.steinwurf.com/licensing

// Load unit testing framework
var fs = require('fs')
var path = require('path')
filedata = fs.readFileSync(path.join(__dirname, 'shoulda.js'),'utf8')
eval(filedata)



kodo = module.require('kodo.js');

var test_amount;

var symbol_size;
var symbols;

var encoder_test = [];
var decoder_test = [];
var decoder_factory_test = [];
var encoder_factory_test = [];

var encode_decode_test = [];

// Setup and execute test
setup_test(10, 16, 160);
run_test();
print_all_tests();
console.log("\n");
setup_test(10, 32, 160);
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
    run_encode_decode_tests();
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

function run_encode_decode_tests(){
    var base_id  = "encode_decode_test_";
    for(var i = 0; i < test_amount; i++){
        encode_decoded_test(base_id + i);
    }
}

// Benchmark functions

function decoder_creation_test(test_id, decoder_factory){
    var start_time = new Date().getTime();
    var decoder = decoder_factory.build();
    var end_time = new Date().getTime();
    var test_time = end_time - start_time;
    decoder_test.push([test_id, test_time]);
}

function encoder_creation_test(test_id, encoder_factory){
    var start_time = new Date().getTime();
    var encoder = encoder_factory.build();
    var end_time = new Date().getTime();
    var test_time = end_time - start_time;
    encoder_test.push([test_id, test_time]);
}

function decoder_factory_creation_test(test_id){
    var start_time = new Date().getTime();
    var decoder_factory = new kodo.decoder_factory(symbols, symbol_size);
    var end_time = new Date().getTime();
    var test_time = end_time - start_time;
    decoder_factory_test.push([test_id, test_time]);
}

function encoder_factory_creation_test(test_id){
    var start_time = new Date().getTime();
    var encoder_factory = new kodo.encoder_factory(symbols, symbol_size);
    var end_time = new Date().getTime();
    var test_time = end_time - start_time;
    encoder_factory_test.push([test_id, test_time]);
}

function encode_decoded_test(test_id){
    var encoder_factory = new kodo.encoder_factory(symbols, symbol_size);
    var encoder = encoder_factory.build();

    var decoder_factory = new kodo.decoder_factory(symbols, symbol_size);
    var decoder = decoder_factory.build();

    var data_in = random_string(encoder.block_size());

    encoder.set_symbols(data_in);

    var number_of_packets = 0;

    var start_time = new Date().getTime();

    while(!decoder.is_complete()){
        var packet = encoder.write_payload();
        number_of_packets = number_of_packets + 1;
        decoder.read_payload(packet);

        // Make sure we don't get an infinite loop.
        assert.isTrue(number_of_packets <= symbols);
    }

    var end_time = new Date().getTime();
    var test_time = end_time - start_time;

    encode_decode_test.push([test_id, test_time]);

    data_out = decoder.copy_from_symbols();
    assert.arrayEqual(data_in, data_out);
}



// Helper functions
function random_string(length) {
    var s = ""

    var random_char=function() {
        var n = Math.floor(Math.random() * 62)
        if(n < 10) return n //1-10
        if(n < 36) return String.fromCharCode(n + 55) //A-Z
        return String.fromCharCode(n + 61) //a-z
    }

    while(s.length < length) s += random_char()
    return s
}


// Print functions

function print_all_tests(){
    print_decoder_tests();
    console.log("\n");
    print_encoder_tests();
    console.log("\n");
    print_decoder_factory_tests();
    console.log("\n");
    print_encoder_factory_tests();
    console.log("\n");
    print_encode_decode_tests();
}

function print_test_average_time(data){
    console.log("Average test time: " + calculated_average_time(data) + " ms");
}

function print_decoder_tests(){
    console.log("Create decoder benchmark");
    print_symbol_and_symbol_size();
    // decoder_test.forEach(function(entry){
    //     print_test_output(entry);
    // });
    print_test_average_time(decoder_test);
}


function print_decoder_factory_tests(){
    console.log("Create decoder factory benchmark");
    print_symbol_and_symbol_size();
    // decoder_factory_test.forEach(function(entry){
    //     print_test_output(entry);
    // });
    print_test_average_time(decoder_factory_test);
}



function print_encoder_tests(){
    console.log("Create encoder benchmark");
    print_symbol_and_symbol_size();
    // encoder_test.forEach(function(entry){
    //     print_test_output(entry);
    // });
    print_test_average_time(encoder_test);
}

function print_encoder_factory_tests(){
    console.log("Create encoder factory benchmark");
    print_symbol_and_symbol_size();
    // encoder_factory_test.forEach(function(entry){
    //     print_test_output(entry);
    // });
    print_test_average_time(encoder_factory_test);
}

function print_encode_decode_tests(){
    console.log("Perform decoding and encoding benchmark");
    print_symbol_and_symbol_size();
    // encode_decode_test.forEach(function(entry){
    //     print_test_output(entry);
    // });
    print_test_average_time(encode_decode_test);
}


function print_test_output(data){
    console.log("Test id: " + data[0] + " Execution time: " + data[1] + " ms");
}



function calculated_average_time(data){
    var total = 0;
    data.forEach(function(entry){
        total = total + entry[1];
    })

    return total / data.length;
}

function print_symbol_and_symbol_size(){
    console.log("Symbols: " + symbols + " Symbol size: " + symbol_size);
}
