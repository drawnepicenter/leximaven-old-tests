'use strict';/* eslint max-len:0 */var themes=require('../themes');var tools=require('../tools');var _=require('lodash');var chalk=require('chalk');var moment=require('moment');var http=require('good-guy-http')();var noon=require('noon');var xml2js=require('xml2js');var CFILE=process.env.HOME+'/.leximaven.noon';exports.command='onelook <word>';exports.aliases=['one','ol'];exports.desc='Onelook definitions';exports.builder={out:{alias:'o',desc:'Write cson, json, noon, plist, yaml, xml',default:'',type:'string'},force:{alias:'f',desc:'Force overwriting outfile',default:false,type:'boolean'},save:{alias:'s',desc:'Save flags to config file',default:false,type:'boolean'},links:{alias:'l',desc:'Include resource links',default:false,type:'boolean'}};exports.handler=function(argv){tools.checkConfig(CFILE);var config=noon.load(CFILE);var proceed=false;var reset=false;var checkStamp=tools.limitOnelook(config);config=checkStamp[0];proceed=checkStamp[1];reset=checkStamp[2];var stamp=new Date(config.onelook.date.stamp);var hours=moment(new Date()).diff(stamp,'hours');var minutes=moment(new Date()).diff(stamp,'minutes');if(proceed){(function(){var userConfig={onelook:{links:argv.l}};if(config.merge)config=_.merge({},config,userConfig);if(argv.s&&config.merge)noon.save(CFILE,config);if(argv.s&&!config.merge)throw new Error("Can't save user config, set option merge to true.");var theme=themes.loadTheme(config.theme);if(config.verbose)themes.label(theme,'down','Onelook');var acont=[];acont.push(argv.word);if(argv._.length>1){for(var i=0;i<=argv._.length-1;i++){if(argv._[i]!=='onelook'&&argv._[i]!=='one'&&argv._[i]!=='ol')acont.push(argv._[i]);}}var url='http://onelook.com/?xml=1&w='+acont.join('+');url=encodeURI(url);var tofile={type:'onelook',source:'http://www.onelook.com',url:url};var ctstyle=_.get(chalk,theme.content.style);http({url:url},function(error,response){if(!error&&response.statusCode===200){if(response.headers['x-gg-state']==='cached'){config.onelook.date.remain++;noon.save(CFILE,config);if(config.usage)console.log('Cached response, not decrementing usage.');}var body=response.body;var parser=new xml2js.Parser();parser.parseString(body,function(err,result){if(!err){var resp=result.OLResponse;var phrase=resp.OLPhrases[0];var similar=resp.OLSimilar[0];var quickdef=resp.OLQuickDef;var resources=resp.OLRes;themes.label(theme,'down','Definition');if(Array.isArray(quickdef)&&quickdef.length>1){for(var _i=0;_i<=quickdef.length-1;_i++){var item=quickdef[_i];item=item.replace(/&lt;|&gt;|\n|\/i/g,'');item=item.replace(/i"/g,'"');console.log(ctstyle(item));tofile[['definition'+_i]]=item;}}else{var definition=quickdef[0].replace(/&lt;|&gt;|\n|\/i/g,'');console.log(ctstyle(definition));tofile.definition=definition;}if(phrase){var phrases=phrase.replace(/\n/g,'');themes.label(theme,'down','Phrases',phrases);tofile.phrase=phrases;}if(similar){var sim=similar.replace(/\n/g,'');themes.label(theme,'down','Similar',sim);tofile.sim=sim;}if(config.onelook.links){themes.label(theme,'down','Resources');for(var _i2=0;_i2<=resources.length-1;_i2++){var _item=resources[_i2];var res=tools.arrToStr(_item.OLResName).replace(/\n/g,'');var link=tools.arrToStr(_item.OLResLink).replace(/\n/g,'');var home=tools.arrToStr(_item.OLResHomeLink).replace(/\n/g,'');themes.label(theme,'right',res,link);tofile[['res'+_i2]]=res;tofile[['link'+_i2]]=link;tofile[['home'+_i2]]=home;}}if(argv.o)tools.outFile(argv.o,argv.f,tofile);if(config.usage){if(reset){console.log('Timestamp expired, reset usage limits.');console.log(config.onelook.date.remain+'/'+config.onelook.date.limit+' requests remaining today.');}else console.log(config.onelook.date.remain+'/'+config.onelook.date.limit+' requests remaining today, will reset in '+(23-hours)+' hours, '+(59-minutes)+' minutes.');}}else{throw new Error(err);}});}else throw new Error('HTTP '+error.statusCode+': '+error.reponse.body);});})();}else throw new Error('Reached today\'s usage limit of '+config.onelook.date.limit+'.');};