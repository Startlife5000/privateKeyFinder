const web3 = require('web3');
const fetch = require('node-fetch');
const fs = require('fs');
web3js = new web3(new web3.providers.HttpProvider("http://mainnet.infura.io/v3/6df3eeeda7354424a1af5db619918006"));
var minter = require('minterjs-wallet');
const express = require('express');
const app = express();


(function (delay, callback) {
	var loop = function () {
		callback();
		setTimeout(loop, delay);
	}; loop();
})(500, function () {
	generatePrivateKey()
});

function generatePrivateKey() {
    const wallet= minter.generateWallet();
    var privKey = wallet._privKey;
    var account = web3js.eth.accounts.privateKeyToAccount(privKey);
    var address = account.address;
    
    fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`)
    .then(response => response.json())
    .then(data => {
        if(data.result != "0") {
            console.log(data.result)
            fs.appendFile('addresses.txt', `Adresse : ${address}, Amount : ${data.result} , Key : ${wallet._mnemonic} \n`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }else{
            json = {
                "address": address,
                "privateKey": wallet._mnemonic,
                "Amount" : data.result
            }
            fs.appendFile('empty.txt', `${json}\n`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        } 
    });
}



app.get('/download', function(req, res){
    const file = `${__dirname}/addresses.txt`;
    res.download(file); // Set disposition and send it.
});


app.get('/boop', function(req,res){
    const wallet= minter.generateWallet();
    var privKey = wallet._privKey;
    var account = web3js.eth.accounts.privateKeyToAccount(privKey);
    var address = account.address;
    console.log(address);
    fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`)
    .then(response => response.json())
    .then(data => {
        console.log(data.result)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({account: address, privateKey: wallet._mnemonic, amount : data.result}, null, 3));
    });
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));

