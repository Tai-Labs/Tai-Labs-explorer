#!/usr/bin/env node
var mongoose = require( 'mongoose' );
var Contract = mongoose.model('Contract');
var pageSize = 10;
var page = 0;
var totalPage = 0;
var resultData={"totalPage":0, "list":null, "page":0};

module.exports = function(req, res){
  page = req.body.page;
  if(isNaN(page) || page<0)
    page = 0;
  
  totalPage = req.body.totalPage;
  if(isNaN(totalPage) || totalPage<0)
    totalPage = 0;

  resultData.totalPage = totalPage;
  resultData.page = page;
  resultData.list = null;
  try{
    if(resultData.totalPage == 0){
      Contract.count({ERC:{$gt:0}}).exec(function(err,c){
        if(err){
          console.log("tokenlist err: ", err);
          res.write(JSON.stringify(resultData));
          res.end();
          return;
        }
        resultData.totalPage = Math.ceil(c/pageSize);
        if(page>=resultData.totalPage){
          resultData.page = 0;
          page=0;
        }
        getList(res);
      });
    }else{
      getList(res)
    }
  } catch (e) {
    console.error(e);
    res.write(JSON.stringify(resultData));
    res.end();
  }
};

function getList(res){
  contractFind = Contract.find({ERC:{$gt:0}}, "tokenName address").skip(page*pageSize).limit(pageSize).lean(true);
  contractFind.exec(function (err, docs) {
    if(err){
      console.log("tokenlist getList err: ", err);
      res.write(JSON.stringify(resultData));
      res.end();
      return;
    }
    resultData.list=docs;
    res.write(JSON.stringify(resultData));
    res.end();
  });
}