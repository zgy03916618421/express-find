/**
 * Created by Administrator on 2016/7/18.
 */
var syncRequest=require('sync-request');
var cheerio=require('cheerio');
var key='小王子';
var url='https://www.amazon.cn/s/ref=nb_sb_noss?__mk_zh_CN=亚马逊网站&url=search-alias%3Dstripbooks&field-keywords='+key;
var codeurl=encodeURI(url);

//var searchUrl='https://www.amazon.cn/s/ref=nb_sb_noss?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&url=search-alias%Dstripbooks&field-keywords=%E5%B0%8F%E7%8E%8B%E5%AD%90';
var searchRes=syncRequest('GET',codeurl,{
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    }
});
var searchBody=searchRes.getBody().toString();
$=cheerio.load(searchBody);
var detailUrl=$('#result_0 div.a-column a').attr('href');
var detailRes=syncRequest('GET',detailUrl,{
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    }
});
var detailBody=detailRes.getBody().toString();
var body=detailD(detailBody);
var result={};
result['Amazon']=detailF(body);
console.log(result);
function detailD(data) {
    $=cheerio.load(data);
    var text=$("#tmmSwatches li.selected span.a-button-inner").text();
    var index=text.indexOf('Kindle电子书');
    if(index>=0){
        var href=$('#tmmSwatches li.unselected a').attr('href');
        var url='https://www.amazon.cn'+href;
        var res=syncRequest('GET',url)
        var body=res.getBody().toString();
        return body;
    }
    return data;
}
function detailF(data) {
    var byline='';
    var keyvalue={
        '出版社':'publisher',
        '平装':'page',
        '开本':'format',
        'ISBN':'ISBN',
        '条形码':'Barcode',
        '商品尺寸':'size',
        '商品重量':'weight',
        '品牌':'Brands',
        'ASIN':'ASIN'
    }
    $('#byline span.author ').each(function (id,item) {
        byline=byline+$(item).find('a').text()+$(item).find('span.contribution').text().trim();
    })
    var d=byline.lastIndexOf('(作者)');
    var result={};
    result['title']=$('#productTitle').text();
    result['author']=byline.substring(0,d+4);
    result['tranlate']=byline.substring(d+5);
    var images=[];
    // images.push($('#main-image-container img').attr('src'));
    //images.push();
    var img=JSON.parse($('#main-image-container img').attr('data-a-dynamic-image'));
    for(var key in img){
        images.push(key);
    }
    result['img']=images;
    result['rate']=$('#reviewStarsLinkedCustomerReviews span').text();
    var len=$('#detail_bullets_id ul').children('li').length-$('#detail_bullets_id ul').children('li li').length;
    $('#detail_bullets_id ul').children().each(function (id,item) {
        if(id==len-2)
        {return false}
        else{
            var a=$(item).text().trim().replace("：",":").replace(/[\r\n]/g,"").split(":");
            result[keyvalue[a[0]]]=a[1]
        }
    })
    return result;
}