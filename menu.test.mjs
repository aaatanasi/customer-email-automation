import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

test('the sheet-open entry point registers only safe, functional previews', () => {
  const labels = [];
  const alerts = [];
  let registered = 0;
  const menu = {
    addItem(label, name) {labels.push([label, name]); return this;},
    addSeparator() {return this;},
    addToUi() {registered++;}
  };
  const ui = {
    createMenu(label) {assert.equal(label, 'Campaign Preview'); return menu;},
    alert(message) {alerts.push(message);}
  };
  // No sheet services, mail APIs, or network are provided.
  const sandbox = {SpreadsheetApp:{getUi:() => ui}};
  runInNewContext(readFileSync(new URL('Code.gs', import.meta.url), 'utf8'), sandbox);
  sandbox.onOpen();
  assert.equal(registered, 1);
  assert.deepEqual(labels.map(([label]) => label), [
    'Preview Selected Group', 'Explain Recent Email Check', 'Preview Pending Batch'
  ]);
  for (const [, name] of labels) sandbox[name]();
  assert.equal(alerts.length, 3);
  assert.match(alerts[0], /fictional/);
  assert.match(alerts[1], /never opens or searches a mailbox/);
  assert.match(alerts[2], /No emails were sent and no statuses changed/);
});
