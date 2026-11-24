import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reconcile, previewBatch} from './workflow.mjs';

const now = Date.UTC(2026, 0, 12, 12);
const sender = 'team@example.test';
const h = 60 * 60 * 1000;
const rows = [
  {email:'Casey@EXAMPLE.TEST',status:'PENDING'},
  {email:'avery@example.test',status:'PENDING'},
  {email:'Jules@example.test',status:'PENDING'},
  {email:' jules@example.test ',status:'pending'},
  {email:'morgan@example.test',status:'PENDING'},
  {email:'MORGAN@EXAMPLE.TEST',status:'REVIEW'},
  {email:'skye@example.test',status:''},
  {email:'broken',status:'PENDING'},
];
const history = [
  {from:'Portfolio Demo <team@example.test>',to:'Casey <CASEY@EXAMPLE.TEST>',subject:'Unrelated subject',at:now-24*h},
  {from:sender,to:'casey@example.test',subject:'Another subject',at:now-h},
  {from:sender,to:'avery@example.test',at:now-25*h},
  {from:'reply@example.test',to:'avery@example.test',at:now-h},
  {from:sender,to:'skye@example.test',at:now-h},
];
test('manual 24 hour scan ignores subject, retains latest, and leaves other statuses unchanged',()=>{
  const next=reconcile(rows,history,{sender,now});
  assert.deepEqual(next.map(r=>r.status),['SENT','PENDING','PENDING','pending','PENDING','REVIEW','','PENDING']);
  assert.equal(next[0].matchedAt,now-h);
  assert.equal(rows[0].status,'PENDING');
});
test('scan limit fails safely before changing rows',()=>{
  assert.throws(()=>reconcile(rows,history,{sender,now,limit:1}),/scan limit/);
  assert.equal(rows[0].status,'PENDING');
});
test('batch preview consumes reconciliation results, excludes review duplicates and invalid rows',()=>{
  const next=reconcile(rows,history,{sender,now});
  assert.deepEqual(previewBatch(next),['avery@example.test','jules@example.test']);
  assert.deepEqual(previewBatch(next,{quota:1}),['avery@example.test']);
  assert.deepEqual(previewBatch(next,{quota:0}),[]);
});
