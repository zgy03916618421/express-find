/**
 * Created by Administrator on 2016/7/18.
 */
var express=require('express');
var app=express();
var route=require('./router')
app.use('/',route);
app.listen(10000);