import {schoolNames,schoolAliases,normalized,collection,matches,safeUrl,locationLabel,matchingPassages,excerpt,isDraft,isYearbook,viewerUrl,parseCatalog} from './catalog-core.mjs';

'use strict';
const groups=['All collections','Yearbooks','Schools & History','Athletics','Honors & Recognition','Academics, Arts & Activities','Photos & Ephemera','Oral Histories'];
const collectionAliases={'School History':'Schools & History','Honors':'Honors & Recognition','Academics Arts and Activities':'Academics, Arts & Activities','Photos and Ephemera':'Photos & Ephemera'};
const oldSchoolNames={'acshs':'Allen County–Scottsville High School','allen-county-high':'Allen County High School','scottsville-high':'Scottsville High School','community':'Community Schools'};
const oldSchoolAliases={'acshs':'ACSHS ACS Allen County Scottsville High School Patriots','allen-county-high':'ACHS Allen County High School Patriots','scottsville-high':'SHS Scottsville High School Pointers'};
const state={items:[],school:'',collection:'All collections',year:'',query:'',page:0,loaded:false,error:false};
const $=id=>document.getElementById(id);
function element(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
function recordExcerpt(item){const p=matchingPassages(item,state.query)[0];return p?locationLabel(p)+' — '+excerpt(p.text,state.query):excerpt(item.description||item.sourceCitation||'Open this record to explore its sources.',state.query);}
function render(){
 document.body.classList.toggle('pointer',state.school==='scottsville-high');
 document.querySelectorAll('[data-school]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.school===state.school)));
 $('collections').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===state.collection)));
 $('catalog-heading').textContent=state.school?(schoolNames[state.school]||'School archive'):'The archive';
 const found=state.items.filter(item=>matches(item,state));const start=state.page*24;const visible=found.slice(start,start+24);
 $('count').textContent=state.error?'Catalog unavailable':!state.loaded?'Loading catalog…':found.length+' '+(found.length===1?'record':'records');
 const results=$('results');results.replaceChildren();
 if(!visible.length){const box=element('div',undefined,'empty');const filtered=state.query||state.school||state.year||state.collection!=='All collections';
 box.append(element('h3',state.error?'We couldn’t load the catalog.':!state.loaded?'Opening the archive…':state.items.length===0?'Our collection begins here.':'No matching records yet.'));
 box.append(element('p',state.error?'Please reload the page to try again.':!state.loaded?'Please wait while the public catalog loads.':state.items.length===0?'The archive’s shelves are ready. Reviewed yearbooks, photographs, and stories will appear here as they are added.':filtered?'Try another spelling, a broader search, or clear the filters.':'More records will be added as they are reviewed.'));results.append(box);
 }else visible.forEach(item=>{const card=element('button',undefined,'record');card.type='button';card.append(element('span',collection(item)+(item.year?' · '+item.year:''),'type'),element('h3',item.title||'Untitled record'),element('p',recordExcerpt(item)),element('span','Explore record →','small'));card.addEventListener('click',()=>showItem(item));results.append(card);});
 $('pagination').hidden=found.length<=24;$('page-number').textContent='Page '+(state.page+1)+' of '+Math.max(1,Math.ceil(found.length/24));$('previous').disabled=state.page===0;$('next').disabled=start+24>=found.length;
}
function change(){state.page=0;render();}
function showItem(item){
 $('detail-title').textContent=item.title||'Untitled record';const content=$('detail-content');content.replaceChildren();
 content.append(element('p',[collection(item),item.year,schoolNames[item.schoolId]||item.schoolId].filter(Boolean).join(' · '),'small'));
 if(item.description)content.append(element('p',item.description));
 if(item.people?.length)content.append(element('p','People: '+item.people.join('; ')));
 if(item.tags?.length)content.append(element('p','Tags: '+item.tags.join('; '),'small'));
 if(item.sourceCitation)content.append(element('p','Source: '+item.sourceCitation,'small'));
 const url=safeUrl(item.mediaUrl);if(url){const link=element('a','View source material ↗','media');link.href=url;link.target='_blank';link.rel='noopener noreferrer';content.append(link);if(item.allowDownload===true){const download=element('a','Open download source ↗','media');download.href=url;download.target='_blank';download.rel='noopener noreferrer';content.append(download,element('p','Download options depend on the source viewer.','small'));}}
 if(isYearbook(item)){const found=matchingPassages(item,state.query)[0];const link=element('a','Open yearbook viewer →','media');link.href=viewerUrl(item,found?.digitalPage||1,state.query);content.append(link);}
 const passages=item.passages||[];if(passages.length)content.append(element('h3','Searchable source passages'));
 passages.forEach(p=>{const block=element('section',undefined,'passage');block.append(element('b',locationLabel(p)),element('p',isDraft(p)?'Computer-generated text; may contain errors.':'Verified transcription.','text-status'),element('blockquote',p.text||''),element('small',p.sourceCitation||item.sourceCitation||''));if(isYearbook(item)&&p.digitalPage){const link=element('a','Open this page →','page-link');link.href=viewerUrl(item,p.digitalPage,state.query);block.append(link);}content.append(block);});
 $('detail-dialog').showModal();
}
groups.forEach(name=>{const b=element('button',name,'chip');b.type='button';b.setAttribute('aria-pressed',String(name===state.collection));b.addEventListener('click',()=>{state.collection=name;change();});$('collections').append(b);});
document.querySelectorAll('[data-school]').forEach(b=>b.addEventListener('click',()=>{state.school=state.school===b.dataset.school?'':b.dataset.school;change();$('browse').scrollIntoView({block:'start'});}));
$('search-form').addEventListener('submit',e=>{e.preventDefault();state.query=$('query').value;change();$('browse').scrollIntoView({block:'start'});});
$('query').addEventListener('input',()=>{state.query=$('query').value;change();});
$('year').addEventListener('change',()=>{state.year=$('year').value;change();});
$('reset').addEventListener('click',()=>{Object.assign(state,{query:'',school:'',year:'',collection:'All collections'});$('query').value='';$('year').value='';change();});
$('previous').addEventListener('click',()=>{state.page--;render();});$('next').addEventListener('click',()=>{state.page++;render();});
$('close-detail').addEventListener('click',()=>$('detail-dialog').close());$('contributor').addEventListener('click',()=>$('contributor-dialog').showModal());$('close-contributor').addEventListener('click',()=>$('contributor-dialog').close());
render();
fetch('./data/catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Catalog request failed');return r.json();}).then(data=>{
 state.items=parseCatalog(data);
 [...new Set(state.items.map(i=>String(i.year||'')).filter(Boolean))].sort().reverse().forEach(y=>{const option=element('option',y);option.value=y;$('year').append(option);});state.loaded=true;render();
}).catch(()=>{state.loaded=true;state.error=true;render();});
