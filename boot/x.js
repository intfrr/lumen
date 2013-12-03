environment=[{}];function getenv(k){var i=(length(environment)-1);while((i>=0)){var v=environment[i][k];if(v){return(v);}i=(i-1);}}function setenv(k,v){last(environment)[k]=v;}variable={};function is_symbol_macro(k){var v=getenv(k);return((is_is(v)&&!((v==variable))&&!(is_macro(k))));}function is_macro(k){return(is_function(getenv(k)));}function is_variable(k){return((last(environment)[k]==variable));}function is_bound(x){return((is_symbol_macro(x)||is_macro(x)||is_variable(x)));}is_embed_macros=false;function is_vararg(name){return((sub(name,(length(name)-3),length(name))=="..."));}function bind1(list,value){var forms=[];var i=0;var _3=list;while((i<length(_3))){var x=_3[i];if(is_list(x)){forms=join(forms,bind1(x,["at",value,i]));}else if(is_vararg(x)){var v=sub(x,0,(length(x)-3));push(forms,["local",v,["sub",value,i]]);break;}else{push(forms,["local",x,["at",value,i]]);}i=(i+1);}return(forms);}target="js";function length(x){return(x.length);}function is_empty(list){return((length(list)==0));}function sub(x,from,upto){if(is_string(x)){return(x.substring(from,upto));}else{return(x.slice(from,upto));}}function push(arr,x){return(arr.push(x));}function pop(arr){return(arr.pop());}function last(arr){return(arr[(length(arr)-1)]);}function join(a1,a2){return(a1.concat(a2));}function reduce(f,x){if(is_empty(x)){return(x);}else if((length(x)==1)){return(x[0]);}else{return(f(x[0],reduce(f,sub(x,1))));}}function keep(f,a){var a1=[];var _5=0;var _4=a;while((_5<length(_4))){var x=_4[_5];if(f(x)){push(a1,x);}_5=(_5+1);}return(a1);}function find(f,a){var _7=0;var _6=a;while((_7<length(_6))){var x=_6[_7];var x1=f(x);if(x1){return(x1);}_7=(_7+1);}}function map(f,a){var a1=[];var _9=0;var _8=a;while((_9<length(_8))){var x=_8[_9];push(a1,f(x));_9=(_9+1);}return(a1);}function collect(f,a){var a1=[];var _11=0;var _10=a;while((_11<length(_10))){var x=_10[_11];a1=join(a1,f(x));_11=(_11+1);}return(a1);}function char(str,n){return(str.charAt(n));}function search(str,pattern,start){var i=str.indexOf(pattern,start);if((i>=0)){return(i);}}function split(str,sep){return(str.split(sep));}fs=require("fs");function read_file(path){return(fs.readFileSync(path,"utf8"));}function write_file(path,data){return(fs.writeFileSync(path,data,"utf8"));}function print(x){return(console.log(x));}function write(x){return(process.stdout.write(x));}function exit(code){return(process.exit(code));}function is_nil(x){return((x==undefined));}function is_is(x){return(!(is_nil(x)));}function is_string(x){return((type(x)=="string"));}function is_string_literal(x){return((is_string(x)&&(char(x,0)=="\"")));}function is_number(x){return((type(x)=="number"));}function is_boolean(x){return((type(x)=="boolean"));}function is_function(x){return((type(x)=="function"));}function is_composite(x){return((type(x)=="object"));}function is_atom(x){return(!(is_composite(x)));}function is_table(x){return((is_composite(x)&&is_nil(x[0])));}function is_list(x){return((is_composite(x)&&is_is(x[0])));}function parse_number(str){var n=parseFloat(str);if(!(isNaN(n))){return(n);}}function to_string(x){if(is_nil(x)){return("nil");}else if(is_boolean(x)){if(x){return("true");}else{return("false");}}else if(is_atom(x)){return((x+""));}else if(is_function(x)){return("#<function>");}else if(is_table(x)){return("#<table>");}else{var str="(";var i=0;var _14=x;while((i<length(_14))){var y=_14[i];str=(str+to_string(y));if((i<(length(x)-1))){str=(str+" ");}i=(i+1);}return((str+")"));}}function error(msg){throw(msg);return(undefined);}function type(x){return(typeof(x));}function apply(f,args){return(f.apply(f,args));}id_counter=0;function make_id(prefix){id_counter=(id_counter+1);return(("_"+(prefix||"")+id_counter));}eval_result=undefined;delimiters={"(":true,")":true,";":true,"\n":true};whitespace={" ":true,"\t":true,"\n":true};function make_stream(str){return({pos:0,string:str,len:length(str)});}function peek_char(s){if((s.pos<s.len)){return(char(s.string,s.pos));}}function read_char(s){var c=peek_char(s);if(c){s.pos=(s.pos+1);return(c);}}function skip_non_code(s){while(true){var c=peek_char(s);if(!(c)){break;}else if(whitespace[c]){read_char(s);}else if((c==";")){while((c&&!((c=="\n")))){c=read_char(s);}skip_non_code(s);}else{break;}}}read_table={};eof={};read_table[""]=function (s){var str="";while(true){var c=peek_char(s);if((c&&(!(whitespace[c])&&!(delimiters[c])))){str=(str+c);read_char(s);}else{break;}}var n=parse_number(str);if(is_is(n)){return(n);}else if((str=="true")){return(true);}else if((str=="false")){return(false);}else{return(str);}};read_table["("]=function (s){read_char(s);var l=[];while(true){skip_non_code(s);var c=peek_char(s);if((c&&!((c==")")))){push(l,read(s));}else if(c){read_char(s);break;}else{error(("Expected ) at "+s.pos));}}return(l);};read_table[")"]=function (s){return(error(("Unexpected ) at "+s.pos)));};read_table["\""]=function (s){read_char(s);var str="\"";while(true){var c=peek_char(s);if((c&&!((c=="\"")))){if((c=="\\")){str=(str+read_char(s));}str=(str+read_char(s));}else if(c){read_char(s);break;}else{error(("Expected \" at "+s.pos));}}return((str+"\""));};read_table["'"]=function (s){read_char(s);return(["quote",read(s)]);};read_table["`"]=function (s){read_char(s);return(["quasiquote",read(s)]);};read_table[","]=function (s){read_char(s);if((peek_char(s)=="@")){read_char(s);return(["unquote-splicing",read(s)]);}else{return(["unquote",read(s)]);}};function read(s){skip_non_code(s);var c=peek_char(s);if(c){return(((read_table[c]||read_table[""]))(s));}else{return(eof);}}function read_from_string(str){return(read(make_stream(str)));}operators={common:{"+":"+","-":"-","*":"*","/":"/","<":"<",">":">","=":"==","<=":"<=",">=":">="},js:{"and":"&&","or":"||","cat":"+"},lua:{"and":" and ","or":" or ","cat":".."}};function get_op(op){return((operators["common"][op]||operators[target][op]));}function is_operator(form){return((is_list(form)&&is_is(get_op(form[0]))));}function is_quoting(depth){return(is_number(depth));}function is_quasiquoting(depth){return((is_quoting(depth)&&(depth>0)));}function is_can_unquote(depth){return((is_quoting(depth)&&(depth==1)));}function macroexpand(form){if(is_symbol_macro(form)){return(macroexpand(getenv(form)));}else if(is_atom(form)){return(form);}else{var name=form[0];if((name=="quote")){return(form);}else if((name=="mac")){return(form);}else if(is_macro(name)){return(macroexpand(apply(getenv(name),sub(form,1))));}else if(((name=="fn")||(name=="each"))){var _=form[0];var args=form[1];var body=sub(form,2);push(environment,{});var _22=0;var _21=args;while((_22<length(_21))){var _20=_21[_22];setenv(_20,variable);_22=(_22+1);}var _19=join([name,args],macroexpand(body));pop(environment);return(_19);}else if((name=="def")){var _=form[0];var f=form[1];var args=form[2];var body=sub(form,3);push(environment,{});var _26=0;var _25=args;while((_26<length(_25))){var _24=_25[_26];setenv(_24,variable);_26=(_26+1);}var _23=join(["def",f,args],macroexpand(body));pop(environment);return(_23);}else{return(map(macroexpand,form));}}}function quasiexpand(form,depth){if(is_quasiquoting(depth)){if(is_atom(form)){return(["quote",form]);}else if((is_can_unquote(depth)&&(form[0]=="unquote"))){return(quasiexpand(form[1]));}else if(((form[0]=="unquote")||(form[0]=="unquote-splicing"))){return(quasiquote_list(form,(depth-1)));}else if((form[0]=="quasiquote")){return(quasiquote_list(form,(depth+1)));}else{return(quasiquote_list(form,depth));}}else if(is_atom(form)){return(form);}else if((form[0]=="quote")){return(["quote",form[1]]);}else if((form[0]=="quasiquote")){return(quasiexpand(form[1],1));}else{return(map(function (x){return(quasiexpand(x,depth));},form));}}function quasiquote_list(form,depth){var xs=[["list"]];var _28=0;var _27=form;while((_28<length(_27))){var x=_27[_28];if((is_list(x)&&is_can_unquote(depth)&&(x[0]=="unquote-splicing"))){push(xs,quasiexpand(x[1]));push(xs,["list"]);}else{push(last(xs),quasiexpand(x,depth));}_28=(_28+1);}if((length(xs)==1)){return(xs[0]);}else{return(reduce(function (a,b){return(["join",a,b]);},keep(function (x){return(((length(x)==0)||!(((length(x)==1)&&(x[0]=="list")))));},xs)));}}function compile_args(forms,is_compile){var str="(";var i=0;var _29=forms;while((i<length(_29))){var x=_29[i];var x1=(function (){if(is_compile){return(compile(x));}else{return(identifier(x));}})();str=(str+x1);if((i<(length(forms)-1))){str=(str+",");}i=(i+1);}return((str+")"));}function compile_body(forms,is_tail){var str="";var i=0;var _30=forms;while((i<length(_30))){var x=_30[i];var is_t=(is_tail&&(i==(length(forms)-1)));str=(str+compile(x,true,is_t));i=(i+1);}return(str);}function identifier(id){var id2="";var i=0;while((i<length(id))){var c=char(id,i);if((c=="-")){c="_";}id2=(id2+c);i=(i+1);}var last=(length(id)-1);if((char(id,last)=="?")){var name=sub(id2,0,last);id2=("is_"+name);}return(id2);}function compile_atom(form){if((form=="nil")){if((target=="js")){return("undefined");}else{return("nil");}}else if((is_string(form)&&!(is_string_literal(form)))){return(identifier(form));}else{return(to_string(form));}}function compile_call(form){if((length(form)==0)){return((compiler("list"))(form));}else{var f=form[0];var f1=compile(f);var args=compile_args(sub(form,1),true);if(is_list(f)){return(("("+f1+")"+args));}else if(is_string(f)){return((f1+args));}else{return(error("Invalid function call"));}}}function compile_operator(_32){var op=_32[0];var args=sub(_32,1);var str="(";var op1=get_op(op);var i=0;var _31=args;while((i<length(_31))){var arg=_31[i];if(((op1=="-")&&(length(args)==1))){str=(str+op1+compile(arg));}else{str=(str+compile(arg));if((i<(length(args)-1))){str=(str+op1);}}i=(i+1);}return((str+")"));}function compile_branch(condition,body,is_first,is_last,is_tail){var cond1=compile(condition);var body1=compile(body,true,is_tail);var tr=(function (){if((is_last&&(target=="lua"))){return(" end ");}else{return("");}})();if((is_first&&(target=="js"))){return(("if("+cond1+"){"+body1+"}"));}else if(is_first){return(("if "+cond1+" then "+body1+tr));}else if((is_nil(condition)&&(target=="js"))){return(("else{"+body1+"}"));}else if(is_nil(condition)){return((" else "+body1+" end "));}else if((target=="js")){return(("else if("+cond1+"){"+body1+"}"));}else{return((" elseif "+cond1+" then "+body1+tr));}}function bind_arguments(args,body){var args1=[];var _34=0;var _33=args;while((_34<length(_33))){var arg=_33[_34];if(is_vararg(arg)){var v=sub(arg,0,(length(arg)-3));var expr=(function (){if((target=="js")){return(["Array.prototype.slice.call","arguments",length(args1)]);}else{push(args1,"...");return(["list","..."]);}})();body=join([["local",v,expr]],body);break;}else if(is_list(arg)){var _35=make_id();push(args1,_35);body=macroexpand(join([["bind",arg,_35]],body));}else{push(args1,arg);}_34=(_34+1);}return([args1,body]);}function compile_function(args,body,name){name=(name||"");var expanded=bind_arguments(args,body);var args1=compile_args(expanded[0]);var body1=compile_body(expanded[1],true);if((target=="js")){return(("function "+name+args1+"{"+body1+"}"));}else{return(("function "+name+args1+body1+" end "));}}function quote_form(form){if(is_atom(form)){if(is_string_literal(form)){var str=sub(form,1,(length(form)-1));return(("\"\\\""+str+"\\\"\""));}else if(is_string(form)){return(("\""+form+"\""));}else{return(to_string(form));}}else{return((compiler("list"))(form,0));}}function compile_special(form,is_stmt,is_tail){var name=form[0];if((!(is_stmt)&&is_statement(name))){return(compile([["fn",[],form]],false,is_tail));}else{var is_tr=(is_stmt&&!(is_self_terminating(name)));var tr=(function (){if(is_tr){return(";");}else{return("");}})();return(((compiler(name))(sub(form,1),is_tail)+tr));}}special={};function is_special(form){return((is_list(form)&&is_is(special[form[0]])));}function compiler(name){return(special[name]["compiler"]);}function is_statement(name){return(special[name]["statement"]);}function is_self_terminating(name){return(special[name]["terminated"]);}special["do"]={compiler:function (forms,is_tail){return(compile_body(forms,is_tail));},statement:true,terminated:true};special["if"]={compiler:function (form,is_tail){var str="";var i=0;var _38=form;while((i<length(_38))){var condition=_38[i];var is_last=(i>=(length(form)-2));var is_else=(i==(length(form)-1));var is_first=(i==0);var body=form[(i+1)];if(is_else){body=condition;condition=undefined;}str=(str+compile_branch(condition,body,is_first,is_last,is_tail));i=(i+1);i=(i+1);}return(str);},statement:true,terminated:true};special["while"]={compiler:function (form){var condition=compile(form[0]);var body=compile_body(sub(form,1));if((target=="js")){return(("while("+condition+"){"+body+"}"));}else{return(("while "+condition+" do "+body+" end "));}},statement:true,terminated:true};special["def"]={compiler:function (_39){var name=_39[0];var args=_39[1];var body=sub(_39,2);var id=identifier(name);return(compile_function(args,body,id));},statement:true,terminated:true};macros="";special["mac"]={compiler:function (_40){var name=_40[0];var args=_40[1];var body=sub(_40,2);var macro=["setenv",["quote",name],join(["fn",args],body)];eval(compile_for_target("js",macro,true));if(is_embed_macros){macros=(macros+compile(macroexpand(macro),true));}return("");},statement:true,terminated:true};special["return"]={compiler:function (form){return(compile_call(join(["return"],form)));},statement:true};special["local"]={compiler:function (_41){var name=_41[0];var value=_41[1];var id=identifier(name);var keyword=(function (){if((target=="js")){return("var ");}else{return("local ");}})();if(is_nil(value)){return((keyword+id));}else{var v=compile(value);return((keyword+id+"="+v));}},statement:true};special["each"]={compiler:function (_43){var t=_43[0][0];var k=_43[0][1];var v=_43[0][2];var body=sub(_43,1);var t1=compile(t);if((target=="lua")){var body1=compile_body(body);return(("for "+k+","+v+" in pairs("+t1+") do "+body1+" end"));}else{var _42=compile_body(join([["set",v,["get",t,k]]],body));return(("for("+k+" in "+t1+"){"+_42+"}"));}},statement:true};special["set"]={compiler:function (form){if((length(form)<2)){error("Missing right-hand side in assignment");}return((compile(form[0])+"="+compile(form[1])));},statement:true};special["get"]={compiler:function (_44){var object=_44[0];var key=_44[1];var o=compile(object);var k=compile(key);if(((target=="lua")&&(char(o,0)=="{"))){o=("("+o+")");}return((o+"["+k+"]"));}};special["dot"]={compiler:function (_45){var object=_45[0];var key=_45[1];var o=compile(object);var id=identifier(key);return((o+"."+id));}};special["not"]={compiler:function (_46){var expr=_46[0];var e=compile(expr);var open=(function (){if((target=="js")){return("!(");}else{return("(not ");}})();return((open+e+")"));}};special["list"]={compiler:function (forms,depth){var open=(function (){if((target=="lua")){return("{");}else{return("[");}})();var close=(function (){if((target=="lua")){return("}");}else{return("]");}})();var str="";var i=0;var _47=forms;while((i<length(_47))){var x=_47[i];var x1=(function (){if(is_quoting(depth)){return(quote_form(x));}else{return(compile(x));}})();str=(str+x1);if((i<(length(forms)-1))){str=(str+",");}i=(i+1);}return((open+str+close));}};special["table"]={compiler:function (forms){var sep=(function (){if((target=="lua")){return("=");}else{return(":");}})();var str="{";var i=0;while((i<(length(forms)-1))){var k=forms[i];var v=compile(forms[(i+1)]);if(!(is_string(k))){error(("Illegal table key: "+to_string(k)));}if(((target=="lua")&&is_string_literal(k))){k=("["+k+"]");}str=(str+k+sep+v);if((i<(length(forms)-2))){str=(str+",");}i=(i+2);}return((str+"}"));}};special["fn"]={compiler:function (_48){var args=_48[0];var body=sub(_48,1);return(compile_function(args,body));}};special["quote"]={compiler:function (_49){var form=_49[0];return(quote_form(form));}};function is_can_return(form){if(is_special(form)){return(!(is_statement(form[0])));}else{return(true);}}function compile(form,is_stmt,is_tail){var tr=(function (){if(is_stmt){return(";");}else{return("");}})();if((is_tail&&is_can_return(form))){form=["return",form];}if(is_nil(form)){return("");}else if(is_atom(form)){return((compile_atom(form)+tr));}else if(is_operator(form)){return((compile_operator(form)+tr));}else if(is_special(form)){return(compile_special(form,is_stmt,is_tail));}else{return((compile_call(form)+tr));}}function compile_file(file){var form=undefined;var output="";var s=make_stream(read_file(file));while(true){form=read(s);if((form==eof)){break;}output=(output+compile(macroexpand(form),true));}return(output);}function compile_files(files){var output="";var _51=0;var _50=files;while((_51<length(_50))){var file=_50[_51];output=(output+compile_file(file));_51=(_51+1);}return(output);}function compile_for_target(target1,form,is_stmt){var previous=target;target=target1;var result=compile(macroexpand(form),is_stmt);target=previous;return(result);}function rep(str){return(print((to_string(eval(compile(macroexpand(read_from_string(str))))))));}function repl(){var execute=function (str){rep(str);return(write("> "));};write("> ");process.stdin.resume();process.stdin.setEncoding("utf8");return(process.stdin.on("data",execute));}function usage(){print((to_string("usage: x [options] [inputs]")));print((to_string("options:")));print((to_string("  -o <output>\tOutput file")));print((to_string("  -t <target>\tTarget language (default: lua)")));print((to_string("  -e <expr>\tExpression to evaluate")));print((to_string("  -m \t\tEmbed macro definitions in output")));return(exit());}function main(){args=sub(process.argv,2);if(((args[0]=="-h")||(args[0]=="--help"))){usage();}var inputs=[];var output=undefined;var target1=undefined;var expr=undefined;var i=0;var _52=args;while((i<length(_52))){var arg=_52[i];if(((arg=="-o")||(arg=="-t")||(arg=="-e"))){if((i==(length(args)-1))){print((to_string("missing argument for")+to_string(arg)));}else{i=(i+1);var arg2=args[i];if((arg=="-o")){output=arg2;}else if((arg=="-t")){target1=arg2;}else if((arg=="-e")){expr=arg2;}}}else if((arg=="-m")){is_embed_macros=true;}else if(("-"==sub(arg,0,1))){print((to_string("unrecognized option:")+to_string(arg)));usage();}else{push(inputs,arg);}i=(i+1);}if(output){if(target1){target=target1;}var compiled=compile_files(inputs);var main=compile(["main"],true);return(write_file(output,(compiled+macros+main)));}else{var _54=0;var _53=inputs;while((_54<length(_53))){var file=_53[_54];eval(compile_file(file));_54=(_54+1);}if(expr){return(rep(expr));}else{return(repl());}}}setenv("at",function (arr,i){if(((target=="lua")&&is_number(i))){i=(i+1);}else if((target=="lua")){i=["+",i,1];}return(["get",arr,i]);});setenv("let",function (bindings){var body=Array.prototype.slice.call(arguments,1);var i=0;var renames=[];var locals=[];while((i<length(bindings))){var id=bindings[i];if(is_bound(id)){var rename=make_id();push(renames,[id,rename]);id=rename;}else{setenv(id,variable);}push(locals,["local",id,bindings[(i+1)]]);i=(i+2);}return(join(["letsym",renames],join(locals,body)));});setenv("letmac",function (definitions){var body=Array.prototype.slice.call(arguments,1);push(environment,{});var is_embed=is_embed_macros;is_embed_macros=false;map(function (macro){return((compiler("mac"))(macro));},definitions);is_embed_macros=is_embed;var body1=macroexpand(body);pop(environment);return(join(["do"],body1));});setenv("letsym",function (expansions){var body=Array.prototype.slice.call(arguments,1);push(environment,{});map(function (pair){return(setenv(pair[0],pair[1]));},expansions);var body1=macroexpand(body);pop(environment);return(join(["do"],body1));});setenv("sym",function (name,expansion){setenv(name,expansion);return(undefined);});setenv("defvar",function (name,value){return(["set",name,value]);});setenv("bind",function (list,value){if(is_list(value)){var v=make_id();return(join(["do",["local",v,value]],bind1(list,value)));}else{return(join(["do"],bind1(list,value)));}});setenv("across",function (_2){var body=Array.prototype.slice.call(arguments,1);var list=_2[0];var v=_2[1];var i=_2[2];var start=_2[3];var l=make_id();i=(i||make_id());start=(start||0);return(["let",[i,start,l,list],["while",["<",i,["length",l]],join(["let",[v,["at",l,i]]],join(body,[["set",i,["+",i,1]]]))]]);});setenv("make-set",function (){var elements=Array.prototype.slice.call(arguments,0);return(join(["table"],collect(function (x){return([x,true]);},elements)));});setenv("language",function (){return(["quote",target]);});setenv("target",function (){var clauses=Array.prototype.slice.call(arguments,0);return(find(function (x){if((x[0]==target)){return(x[1]);}},clauses));});setenv("join*",function (){var xs=Array.prototype.slice.call(arguments,0);return(reduce(function (a,b){return(["join",a,b]);},xs));});setenv("list*",function (){var xs=Array.prototype.slice.call(arguments,0);if((length(xs)==0)){return([]);}else{var t=[];var i=0;var _13=xs;while((i<length(_13))){var x=_13[i];if((i==(length(xs)-1))){t=["join",join(["list"],t),x];}else{push(t,x);}i=(i+1);}return(t);}});setenv("cat!",function (a){var bs=Array.prototype.slice.call(arguments,1);return(["set",a,join(["cat",a],bs)]);});setenv("prn",function (){var xs=Array.prototype.slice.call(arguments,0);return(["print",join(["cat"],map(function (x){return(["to-string",x]);},xs))]);});setenv("defr",function (_16){var body=Array.prototype.slice.call(arguments,1);var char=_16[0];var stream=_16[1];return(["set",["get","read-table",char],join(["fn",[stream]],body)]);});setenv("w/scope",function (_18,expr){var bound=_18[0];var result=make_id();var arg=make_id();return(["do",["push","environment",["table"]],["across",[bound,arg],["setenv",arg,"variable"]],["let",[result,expr],["pop","environment"],result]]);});setenv("quasiquote",function (form){return(quasiexpand(form,1));});setenv("defc",function (name,_37,args){var body=Array.prototype.slice.call(arguments,3);var keys=sub(_37,0);return(["set",["get","special",["quote",name]],join(["table","compiler",join(["fn",args],body)],collect(function (k){return([k,true]);},keys))]);});main();