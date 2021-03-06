require( '../db.js' );
var mongoose = require( 'mongoose' );
// var Block     = mongoose.model( 'Block' );
// var Transaction     = mongoose.model( 'Transaction' );
// var LogEvent     = mongoose.model( 'LogEvent' );
// var Address     = mongoose.model( 'Address' );
// var Witness = mongoose.model('Witness');
var TokenTransfer = mongoose.model('TokenTransfer');


async function changeTransfer(){
    let txList = await TokenTransfer.find()
    if(txList && txList.length>0){
        for(var i=0;i<txList.length;i++){
            let contractAdd=txList[i].contractAdd;
            let from=txList[i].from;
            let to=txList[i].to;
            if(txList[i].contractAdd.substr(0,2)=="0x"){
                contractAdd = "0x"+txList[i].contractAdd.substr(2)
            }
            if(txList[i].from.substr(0,2)=="0x"){
                from = "0x"+txList[i].from.substr(2)
            }
            if(txList[i].to.substr(0,2)=="0x"){
                to = "0x"+txList[i].to.substr(2)
            }
            await Witness.update({"_id":txList[i]._id},{$set:{
                "from":from,
                "to":to,
                "contractAdd":contractAdd
            }})
        }
        console.log("ok---")
    }
}
changeTransfer()

async function changeWitness(){
    let txList = await Witness.find().sort({"balance":-1})
    if(txList && txList.length>0){
        for(var i=0;i<txList.length;i++){
            let miner;
            if(txList[i].miner.substr(0,2)=="0x"){
                miner = "0x"+txList[i].miner.substr(2)
            }
            await Witness.update({"_id":txList[i]._id},{$set:{"miner":miner}})
        }
        console.log("ok---")
    }
}
// changeWitness()

async function changeLogEvent(){
    let txList = await LogEvent.find().sort({"balance":-1})
    if(txList && txList.length>0){
        for(var i=0;i<txList.length;i++){
            let from;
            let to;
            let address;
            if(txList[i].address.substr(0,2)=="0x"){
                address = "0x"+txList[i].address.substr(2)
            }
            if(txList[i].from.substr(0,2)=="0x"){
                from = "0x"+txList[i].from.substr(2)
            }
            if(txList[i].to.substr(0,2)=="0x"){
                to = "0x"+txList[i].to.substr(2)
            }
            await LogEvent.update({"_id":txList[i]._id},{$set:{"address":address,"from":from,"to":to}})
        }
        console.log("ok---")
    }
}
// changeLogEvent()

// async function changeTransaction(){
//     let txList = await Transaction.find().sort({"balance":-1})
//     if(txList && txList.length>0){
//         for(var i=0;i<txList.length;i++){
//             let from;
//             let to;
//             if(txList[i].from.substr(0,2)=="0x"){
//                 from = "0x"+txList[i].from.substr(2)
//             }
//             if(txList[i].to.substr(0,2)=="0x"){
//                 to = "0x"+txList[i].to.substr(2)
//             }
//             console.log("addr--",txList[i].addr)
//             await Transaction.update({"_id":txList[i]._id},{$set:{"from":from,"to":to}})
//         }
//         console.log("ok---")
//     }
// }
// changeTransaction()

async function changeAddr(){
    let txList = await Address.find().sort({"balance":-1})
    if(txList && txList.length>0){
        for(var i=0;i<txList.length;i++){
            if(txList[i].addr.substr(0,2)=="0x"){
                console.log("addr--",txList[i].addr)
                // let new_addr ="0x"+txList[i].addr.substr(2);
                // await Address.update({"_id":txList[i]._id},{$set:{"addr":new_addr}})
            }
        }
        console.log("ok---")
    }
}
// changeAddr();
async function changeBlock(){
    let txList = await Block.find({},{"miner":true}).limit(100000)
    if(txList && txList.length>0){
        for(var i=0;i<txList.length;i++){
            if(txList[i].miner.substr(0,2)=="0x"){
                console.log("addr--",txList[i].miner)
                let new_addr ="0x"+txList[i].miner.substr(2);
                await Block.update({"_id":txList[i]._id},{$set:{"addr":new_addr}})
            }
        }
        console.log("ok---")
    }
    
}
// changeBlock();