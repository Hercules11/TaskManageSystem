var express = require('express');
var router = express.Router();
var sqlQuery = require('../../../module/Mysql');
var moment = require('moment');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/exam/taskExam.ejs');
});

//获取表格数据
router.get('/api/taskExam',async (req, res)=>{
  let page = parseInt(req.query.page);
    let limitNum = parseInt(req.query.limit);
  let sqlStr = "select * from exam ORDER BY _date DESC limit ?,? ";
  let sqlStr1 = "select count(id) as examNum from exam";
  let result1 =  await sqlQuery(sqlStr1)
  let count =result1[0].examNum
  let arr = [(page-1)*limitNum,limitNum]

  let result =await sqlQuery(sqlStr,arr)
  let options = {
    "code": 0,
    "msg": "",
    "count": count,
    "data": Array.from(result)
  } 
res.json(options)
})
//加载检查详情页面
//因为选择的是*全部数据，因此列名要自己命名。如果指定列，就不用命名了

//渲染详情页面
router.get('/examItem',async (req,res)=>{
  let name = req.query.name;
  // console.log(name)
  let finish_time = req.query.date;
// console.log(finish_time)
let sqlStr = "select id from task where name like CONCAT(?,'%')";
let  id = await sqlQuery(sqlStr,[name]);
let result = JSON.parse(JSON.stringify(id))
let signal = result[0].id;
// console.log(result[0].id)

  res.render('admin/exam/examItem',{signal,finish_time})
})
//20200516,明明是参数没有传进来，编译器却说我sql语句有问题，还好我在navicate里运行测试过了
//编程就是这样，有些东西，还是要相信自己的逻辑判断，分析数据传输形式，处理方法，
router.get('/api/examItem',async(req,res)=>{
  let id = req.query.id;
  let finish_time = req.query.date;
  var current_time =  moment(finish_time).format('YYYY-MM-DD');
// console.log(current_time)
let params = [id,current_time];
console.log(params[0])
  let sqlStr = "SELECT name,item_id,scores,location,standard,state,method,period from (exec_item INNER JOIN form_item on item_id=form_item.id) INNER JOIN task ON exec_id=task.id WHERE exec_id=? AND _date like CONCAT(?,'%')";
  let result = await sqlQuery(sqlStr,params)  
  // console.log(result)
  let options = {
    "code": 0,
    "msg": "",
    "data": Array.from(result)
  } 
res.json(options)

})

module.exports = router;
