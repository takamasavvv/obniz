var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(testUtil.obnizAssert);


describe("ble", function () {

  beforeEach(function () {

    testUtil.setupObnizPromise(this, function(){});
    var stub = sinon.stub();
    this.obniz.ble.onscan = stub;
    this.obniz.ble.startScan();
    expect(this.obniz).send({ble: {scan: {duration: 30}}});
    var results = {"ble":
          {"scan_results":
                [{"event_type": "inquiry_result",
                    "address": "e5f678800700",
                    "device_type": "dumo",
                    "address_type": "public",
                    "ble_event_type": "connectable_advertisemnt",
                    "rssi": -82,
                    "adv_data": [2, 1, 26],
                    "flag": 26,
                    "scan_resp": []}]
          }
    };
    testUtil.receiveJson(this.obniz, results);
    sinon.assert.callCount(stub, 1);
    var peripheral = stub.getCall(0).args[0];
    var connectStub = sinon.stub();
    peripheral.onconnect = connectStub;
    peripheral.connect();
    expect(this.obniz).send({ble: {connect: {address: "e5f678800700"}}});
    sinon.assert.callCount(connectStub, 0);
    testUtil.receiveJson(this.obniz, {
      ble: {
        status_updates: [{
            address: "e5f678800700",
            status: "connected"
          }]
      }
    });
    sinon.assert.callCount(connectStub, 1);
    this.peripheral = peripheral;
  });
  
  
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this, done);
  });
  
  
  it("write", function () {
    var peripheral = this.peripheral;
    peripheral.getService("FF00").getCharacteristic("FF01").write([0x01, 0xe8]);
    expect(this.obniz).send(
        {ble: {write_characteristic: {
          address: "e5f678800700",
          service_uuid: "FF00",
          characteristic_uuid: "FF01",
          data: [0x01, 0xe8]
        }}});
    expect(this.obniz).to.be.finished;
  });
  
  
  it("onwrite", function () {
   
    var peripheral = this.peripheral;
    
    var stub = sinon.stub();
    peripheral.onwritecharacteristic = stub;
    peripheral.getService("FF00").getCharacteristic("FF01").write([0x01, 0xe8]);
    expect(this.obniz).send(
        {ble: {write_characteristic: {
          address: "e5f678800700",
          service_uuid: "FF00",
          characteristic_uuid: "FF01",
          data: [0x01, 0xe8]
        }}});
    
    sinon.assert.callCount(stub, 0);
    
    testUtil.receiveJson(this.obniz, {
      ble: {
        write_characteristic_results: [
          {
            address: "e5f678800700",
            service_uuid: "FF00", //hex string
            characteristic_uuid: "FF01", //hex string
            result: "success"   //success or failed
          }
        ]
      }
    });
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(3);
    
    expect(stub.getCall(0).args[0]).to.be.equal(peripheral.getService("FF00"));
    expect(stub.getCall(0).args[1]).to.be.equal(peripheral.getService("FF00").getCharacteristic("FF01"));
    expect(stub.getCall(0).args[2]).to.be.equal("success");
    expect(this.obniz).to.be.finished;
    
  });
  
  it("onwrite failed", function () {
   
    var peripheral = this.peripheral;
    
    var stub = sinon.stub();
    peripheral.onwritecharacteristic = stub;
    peripheral.getService("FF00").getCharacteristic("FF01").write([0x01, 0xe8]);
    expect(this.obniz).send(
        {ble: {write_characteristic: {
          address: "e5f678800700",
          service_uuid: "FF00",
          characteristic_uuid: "FF01",
          data: [0x01, 0xe8]
        }}});
    
    sinon.assert.callCount(stub, 0);
    
    testUtil.receiveJson(this.obniz, {
      ble: {
        write_characteristic_results: [
          {
            address: "e5f678800700",
            service_uuid: "FF00", //hex string
            characteristic_uuid: "FF01", //hex string
            result: "failed"   //success or failed
          }
        ]
      }
    });
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(3);
    
    expect(stub.getCall(0).args[0]).to.be.equal(peripheral.getService("FF00"));
    expect(stub.getCall(0).args[1]).to.be.equal(peripheral.getService("FF00").getCharacteristic("FF01"));
    expect(stub.getCall(0).args[2]).to.be.equal("failed");
    expect(this.obniz).to.be.finished;
    
  });
  
  
  it("read", function () {
    var peripheral = this.peripheral;
    
    var stub = sinon.stub();
    peripheral.onreadcharacteristic = stub;
    peripheral.getService("FF00").getCharacteristic("FF01").read();
    expect(this.obniz).send(
        {ble: {read_characteristic: {
          address: "e5f678800700",
          service_uuid: "FF00",
          characteristic_uuid: "FF01",
        }}});
    
    sinon.assert.callCount(stub, 0);
     
    testUtil.receiveJson(this.obniz, {
      ble: {
        read_characteristic_results: [
          {
            address: "e5f678800700",
            service_uuid: "FF00", //hex string
            characteristic_uuid: "FF01", //hex string
            data: [0x2e, 0x22, 0x97]   //success or failed
          }
        ]
      }
    });
    
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(3);
    
    expect(stub.getCall(0).args[0]).to.be.equal(peripheral.getService("FF00"));
    expect(stub.getCall(0).args[1]).to.be.equal(peripheral.getService("FF00").getCharacteristic("FF01"));
    expect(stub.getCall(0).args[2]).to.be.deep.equal([0x2e, 0x22, 0x97]);
    
    expect(this.obniz).to.be.finished;
  });
  
  
  
  it("error", function () {
    var stub = sinon.stub();
    var peripheral = this.peripheral;
    peripheral.onerror = stub;
    sinon.assert.callCount(stub, 0);
     
    testUtil.receiveJson(this.obniz, {
      ble: {
        errors: [
         {
            error_code : 1,
            message : "ERROR MESSAGE",
            address : "e5f678800700", //hex string or null
            service_uuid : "FF00",           //hex string or null
            characteristic_uuid : "FF01", //hex string or null
         }
        ]
      }
    });
    
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);
    
    expect(stub.getCall(0).args[0].message).to.be.equal("ERROR MESSAGE");
    
    expect(this.obniz).to.be.finished;
  });
    
});