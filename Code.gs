// Spreadsheet-bound Apps Script example. Fictional state only; no mail access.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Campaign Preview')
    .addItem('Preview Selected Group', 'previewSelectedGroup')
    .addItem('Explain Recent Email Check', 'explainRecentEmailCheck')
    .addSeparator()
    .addItem('Preview Pending Batch', 'previewPendingBatch')
    .addToUi();
}

function previewSelectedGroup() {
  SpreadsheetApp.getUi().alert(
    'Sample group: Spring Preview\n' +
    '3 pending · 1 marked sent · 1 needs review\n\n' +
    'These counts are fictional. No sheet was read or modified.'
  );
}

function explainRecentEmailCheck() {
  SpreadsheetApp.getUi().alert(
    'The original manual check matched recent outgoing messages ' +
    'to pending contacts within 24 hours, regardless of subject. ' +
    'Batch preparation did not repeat that check.\n\n' +
    'This example never opens or searches a mailbox.'
  );
}

function previewPendingBatch() {
  SpreadsheetApp.getUi().alert(
    'Dry run: 2 of 3 example pending contacts fit the sample limit.\n\n' +
    'No emails were sent and no statuses changed.'
  );
}
