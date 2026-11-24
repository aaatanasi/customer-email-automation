# Customer Email Automation
*Portfolio excerpt · Google Sheets / Apps Script workflow*

Built a spreadsheet-based tool to manage individual campaign emails across contact groups. A custom menu in Google Sheets let the team handle group selection, template editing, quota checks, test sends, individual batch sending, and row-level status tracking.

One design decision: keep the optional recent-email check separate from batch preparation. The check looks for any qualifying message sent to a pending recipient within the last 24 hours, regardless of subject. A later batch works from the updated spreadsheet status rather than repeating the mailbox scan.

This small JavaScript adaptation uses fictional rows and messages to demonstrate that check and a read-only batch preview. It does **not** connect to Google, read a mailbox, update a sheet, send any messages, or include the original editor or production configuration. The supplied implementation matches the primary sender and To recipients only; aliases, Cc and Bcc are not shown. The tests exercise the offline adaptation, not the deployed Apps Script.

`Code.gs` is a separate, simplified example of the spreadsheet's custom menu. In a blank Google Sheet, it shows how Apps Script attaches preview actions to the menu on open. The actions display fictional counts and explanations only. The example is not the original production script and does not include the original template editor or any mail, spreadsheet-data, or external service access.

### Source files

- [Code.gs](Code.gs): custom Google Sheets menu with preview actions.
- [workflow.mjs](workflow.mjs): recent-send reconciliation and batch preview.

Run the checks with Node.js:

```sh
node --test workflow.test.mjs menu.test.mjs
```
