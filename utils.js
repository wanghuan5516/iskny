/**
 * Created by 伟强 on 2015/3/8.
 */
var utils = {};

utils.path = function(p1,p2){
    return require("path").join(p1,p2);
};
utils.setResultInfo = function(req,info){
    req.session.info = info;
};
utils.showResultInfo = function(req,data){
    if(req.session && req.session.info){
      if(data){
        data.info=req.session.info;
      }
      delete req.session.info;
    }
};
//后台用户登录验证
utils.adminLoginAuthCheck = function(req,res,next){
    if(req.session.username){
        return next();
    }else{
        utils.setResultInfo(req,"操作需要登录");
        req.session.toUrl = req.originalUrl;
        res.redirect("/admin/login");
    }
};
utils.getInt = function(num,def){
    var ret = tmp = def||0;
    try{ret = parseInt(num);}catch (e){
    }
    if(isNaN(ret))
        ret = def;
    return ret;
}
//将querystring中的参数去掉空的部分
utils.makeConditions = function(obj){
    var ret = {};
    for(var key in obj){
        if(key.indexOf("page")==-1&&obj[key]){
            ret[key] = obj[key];
        }
    }
    return ret;
}
//提供操作url的方法
utils.pageUrl = function(req){

    var query = req.query;

    var replace = function(key,val){
        var query = this.query;
        if(key){
            this.query[key]=val;
        }
        var url = req.originalUrl;
        var ret="",params = [];
        if(url.indexOf("?")!=-1){
            url = url.substring(0,url.indexOf("?"))
        }
        for(var key in query){
            params.push( key+"="+query[key]);
        }
        ret = url+"?"+params.join("&");
        return ret;
    }
    var ret = function(){
        this.path=req.path;
        this.query = req.query;


    };
    ret.prototype.replace =replace;
    return new ret();
}
//分页方法
utils.pager = function(totals,page,pageSize,pageCount){
    totals = utils.getInt(totals);//总数目
    page = utils.getInt(page,1);//当前页
    pageSize = utils.getInt(pageSize,7);//页面容量
    var prev = next = 0;
    var pages = (totals%pageSize==0)?totals/pageSize:totals/pageSize +1;
    pages = parseInt(pages);
    if(page<1){
        page=1;
    }
    if(page>pages){//pages为0的时候page会为0
        page=pages;
    }
    prev = page-1;
    next = page+1;
    if(prev<1){
        prev=1;
    }
    if(next>pages){
        next=pages;
    }
    var defaultPageCount = utils.getInt(pageCount,global.pageCount);
    if(defaultPageCount>pages){
        defaultPageCount = pages;
    }
    var caculateRange = function(pageCount){
        /*if(pageCount<3){
            pageCount=3;
        }*/
        var mod = pageCount%2;//调整from或者to的位置
        var mid = (pageCount-mod)/2;
        var from = page-mid;
        var to = page+mid;
        if(pages<=pageCount){
            from = 1;
            to = pages;
        }
        if(from<1){
            from=1;
            to = from + pageCount-mod;
        }
        if(to>pages){
            to=pages;
            //设置完to再回头检查from
            from = to - pageCount+mod;
            if(from<1){
                from=1;
            }
        }
        this.from = from;
        this.to = to;
        this.pageCount = pageCount;
        this.pageIndex= [];
        for(var i=from;i<=to;i++){
            this.pageIndex.push(i);
        }
    };
    var Pager = function(){
        this.totals = totals;
        this.pages = pages;
        this.pageSize = pageSize;
        this.prev = prev;
        this.next = next;
        this.page = page;
        this.begin = page==0?0:(page-1)*pageSize;//数据开始条数，空数据要特殊处理
        this.from = this.to = 0;
        this.caculateRange(defaultPageCount);//默认是6
        return this;
    };
    Pager.prototype.caculateRange = caculateRange;
    Pager.prototype.toString =function(){
        return JSON.stringify(this);
    };
    return new Pager();
};
utils.extend = function(obj,src){
    for(var s in src||{}){
        obj[s] = src[s];
    }
    return obj;
}
var BlogModel = require("./models/blogs");
var async = require("async");
utils.handleFrontList=function(req,res,next,data){
    if(arguments.length<3)throwError(500,"错误的方法调用：handleFrontList需要最少3个参数");
    var data = data||{};
    data.title = data.title ||"文章列表";
    var view = data._view = data._view||"life";
    var body = req.body;
    var page = utils.getInt(req.query.page,1);
    data.cate = global.category;
    var conditions=utils.makeConditions(req.query);
    utils.extend(conditions,data.conditions);
    var pageSize = data.pageSize||global.pageSize_front;
    var fields = data.fields||"_id type title content clicks author time imgpath";
    var sort = data.sort||[["sort",1],["time",-1]];
    var pager;
    conditions["$where"] = "this.type!='ixuejiao'";
    async.waterfall([
        function(cb){//结果集合大小
            BlogModel.find(conditions).count(cb);
        },function(totals,cb){//查询结果
            pager = utils.pager(totals,page,pageSize,req.query.pageCount);
            BlogModel.find(conditions)
                .select(fields)
                .skip(pager.begin)
                .limit(pager.pageSize)
                .sort(sort)
                .exec(cb);
    }],function(err,result){
        if(err){next(err);return;}
        data.datas = result;
        data.conditions = conditions;
        data.pageUrl = utils.pageUrl(req);
        data.pager = pager;
        res.render(view, data);
    });
};
//几个文件操作
var getAppAbsolutePath =utils.getAppAbsolutePath = function(src){
    var path = require("path")
    return path.join(__dirname+"/public",src);
};
utils.copyFile = function(src ,dest){
    var fs = require('fs');
    var readStream = fs.createReadStream(getAppAbsolutePath(src))
    var writeStream = fs.createWriteStream(getAppAbsolutePath(dest));

    readStream.pipe(writeStream);
    readStream.on('end', function() {
        writeStream.end();
        console.log("copy success! "+dest);
    });
}
utils.moveFile = function(src ,dest){
    var fs = require('fs');
    var oldpath = getAppAbsolutePath(src);
    var readStream = fs.createReadStream(oldpath)
    var writeStream = fs.createWriteStream(getAppAbsolutePath(dest));

    readStream.pipe(writeStream);
    readStream.on('end', function() {
        writeStream.end();
        fs.unlink(oldpath);
        console.log("copy success! "+dest);
    });
}
module.exports = utils;