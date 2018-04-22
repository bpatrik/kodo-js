## Description

kodo-js gives an error for some datasizes and if we freate and build encoders in this order:
1) encoder facotory
2) build encoder
3) decoder factory
4) build decoder

For the first run it runs without error, but for the secound and later runs it can complete.

## Run output:


```
round 0
gen 0
gen 1
gen 2
gen 3
gen 4
gen 5
gen 6
gen 7
gen 8
gen 10 max rank 9
round 0 ready
round 1
gen 0
can't complete
gen 1
can't complete
gen 2
can't complete
gen 3
can't complete
gen 4
can't complete
gen 5
can't complete
gen 6
can't complete
gen 7
can't complete
gen 8
can't complete
gen 10 max rank 9
round 1 ready
```