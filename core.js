/* Modelo financeiro puro, compartilhado pela interface e testes. */
(function(root){
'use strict';
const id=()=>crypto.randomUUID();
const dateOK=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function month(base,n){const [y,m,d]=base.split('-').map(Number),t=new Date(y,m-1+n,1);return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(Math.min(d,new Date(t.getFullYear(),t.getMonth()+1,0).getDate())).padStart(2,'0')}`}
function fromParts(period,day){if(!/^\d{4}-\d{2}$/.test(period)||!/^\d{1,2}$/.test(String(day)))throw Error('Selecione mês, ano e dia válidos.');const date=period+'-'+String(day).padStart(2,'0');if(!dateOK(date))throw Error('Este dia não existe no mês e ano selecionados.');return date}
function normalize(input){
 if(!input||!['entries','accounts','entities','categories'].every(k=>Array.isArray(input[k])))throw Error('Backup incompatível: faltam listas financeiras.');
 const db=structuredClone(input);
 for(const k of ['contracts','investments','insuranceTypes','subscriptionTypes','investmentTypes']){if(db[k]!==undefined&&!Array.isArray(db[k]))throw Error('Lista inválida: '+k);db[k]??=[]}
 const all=new Set();
 for(const k of ['entries','accounts','entities','categories','contracts','investments','insuranceTypes','subscriptionTypes','investmentTypes'])for(const x of db[k]){
 if(!x||typeof x.id!=='string'||!/^[a-zA-Z0-9_-]+$/.test(x.id)||all.has(x.id))throw Error('Identificador inválido ou duplicado em '+k);all.add(x.id);
 if(['entries','contracts','investments'].includes(k)){
 if(!dateOK(x.date)||typeof x.description!=='string'||!x.description.trim()||!Number.isFinite(Number(x.amount))||Number(x.amount)<0)throw Error('Lançamento inválido em '+k);
 x.amount=Number(x.amount);if(x.seriesId!=null&&typeof x.seriesId!=='string')throw Error('Série inválida');
 if(k==='contracts'){if(!['insurance','subscriptions'].includes(x.kind)||!dateOK(x.endDate)||x.endDate<x.date)throw Error('Contrato inválido')}
 else if(!['income','expense'].includes(x.type))throw Error('Tipo de movimentação inválido');
 }else if(typeof x.name!=='string'||!x.name.trim())throw Error('Cadastro inválido em '+k);
 if(k==='accounts'){delete x.opening;delete x.openingDate;}
 if(k==='entities'){x.email=typeof x.email==='string'?x.email:'';}
 }
 for(const x of db.entries)if(x.sourceId&&!db.contracts.some(c=>c.id===x.sourceId))throw Error('Saída vinculada sem contrato: backup não restaurado.');
 db.version=3;for(const name of ['Seguros','Assinaturas'])if(!db.categories.some(x=>x.name===name))db.categories.push({id:id(),name});
 sync(db);return db;
}
function sync(db){
 // Registros gerados são derivados exclusivamente dos contratos, sem duplicação.
 db.entries=db.entries.filter(x=>!x.sourceId);
 for(const c of db.contracts)if(c.amount>0)db.entries.push({id:'flow_'+c.id,sourceId:c.id,sourceKind:c.kind,type:'expense',date:c.date,description:c.description,amount:c.amount,accountId:c.accountId||'',entityId:c.entityId||'',categoryId:db.categories.find(x=>x.name===(c.kind==='insurance'?'Seguros':'Assinaturas')).id,notes:c.notes||'',seriesId:c.seriesId||null,seriesIndex:c.seriesIndex??null});
}
function occurrences(data,count,endDate){
 if(!dateOK(data.date)||!Number.isInteger(count)||count<1||count>240||!Number.isFinite(data.amount)||data.amount<0)throw Error('Data, valor ou quantidade inválida (1 a 240).');
 if(endDate&&(!dateOK(endDate)||endDate<data.date))throw Error('Término deve ser igual ou posterior ao pagamento.');
 const seriesId=count>1?id():null,result=[];
 for(let i=0;i<count;i++){const date=month(data.date,i);if(endDate&&date>endDate)break;result.push({...data,id:id(),date,seriesId,seriesIndex:count>1?i:null})}return result;
}
function remove(db,list,itemId,mode){
 const item=db[list].find(x=>x.id===itemId);if(!item)return;
 // Índice original permanece estável mesmo depois de editar a data de uma parcela.
 const future=x=>item.seriesIndex!=null&&x.seriesIndex!=null?Number(x.seriesIndex)>=Number(item.seriesIndex):x.date>=item.date;
 db[list]=db[list].filter(x=>!(x.id===item.id||(mode==='future'&&item.seriesId&&x.seriesId===item.seriesId&&future(x))));sync(db);
}
function alerts(db,now=today()){const a=Date.parse(now+'T12:00:00Z'),groups=new Map();for(const c of db.contracts){const days=Math.round((Date.parse(c.endDate+'T12:00:00Z')-a)/86400000);if(days>=0&&days<=3){const key=(c.seriesId||c.id)+'|'+c.endDate;if(!groups.has(key))groups.set(key,{...c,days})}}return [...groups.values()]}
const api={fromParts,today,dateOK,month,normalize,sync,occurrences,remove,alerts};root.Core=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
