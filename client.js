window.__ModuleLoader__.load({
  id: "dsh-moss-studio",
  factory(require) {
    const module = { exports: {} }
    const exports = module.exports
    ;(function (module, exports, require) {
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  createPlugin: () => createPlugin
});
module.exports = __toCommonJS(client_exports);
var import_react15 = __toESM(require("react"), 1);

// src/i18n.js
var NS = "moss-studio";
var ZH = {
  "action.archive": "\u5F52\u6863",
  "action.adoptServer": "\u91C7\u7528\u670D\u52A1\u5668\u7248\u672C",
  "action.cancel": "\u53D6\u6D88",
  "action.close": "\u5173\u95ED",
  "action.delete": "\u5220\u9664",
  "action.deleteRecord": "\u5220\u9664\u8BB0\u5F55",
  "action.deleteRecordTitle": "\u5220\u9664\u8FD9\u6761\u8BB0\u5F55",
  "action.done": "\u5B8C\u6210",
  "action.newDraft": "\u65B0\u5EFA\u8349\u7A3F",
  "action.newDraftTitle": "\u65B0\u5EFA\u7A7A\u8349\u7A3F",
  "action.pin": "\u7F6E\u9876",
  "action.save": "\u4FDD\u5B58",
  "action.settings": "\u8BBE\u7F6E",
  "action.unarchive": "\u53D6\u6D88\u5F52\u6863",
  "action.unpin": "\u53D6\u6D88\u7F6E\u9876",
  "action.overwriteServer": "\u786E\u8BA4\u8986\u76D6",
  "confirm.deleteTitle": "\u5220\u9664\u8FD9\u6761\u8BB0\u5F55\uFF1F",
  "confirm.deleteMessage": "\u8BB0\u5F55\u4E0E\u56FE\u7247\u4F1A\u4E00\u8D77\u5220\u9664\uFF0C\u65E0\u6CD5\u6062\u590D\u3002",
  "editor.addBox": "\u52A0\u6846",
  "editor.addBoxTitle": "\u52A0\u4E00\u4E2A\u6846",
  "editor.cancelTitle": "\u53D6\u6D88\u5E76\u64A4\u9500\u672C\u6B21\u4FEE\u6539",
  "editor.deleteBox": "\u5220\u9664\u6846",
  "editor.deleteBoxTitle": "\u5220\u9664\u8FD9\u4E2A\u6846",
  "editor.empty": "\u8FD8\u6CA1\u6709\u6846\u3002\u70B9\u300C\u52A0\u6846\u300D\u653E\u4E00\u4E2A\uFF0C\u7136\u540E\u62D6\u52A8\u79FB\u52A8\u3001\u62C9\u53F3\u4E0B\u89D2\u6539\u5927\u5C0F\u3002",
  "editor.title": "\u7F16\u8F91\u5E03\u5C40 \xB7 {count} \u4E2A\u6846 \xB7 {size}",
  "editor.descPlaceholder": "\u6846\u5185\u662F\u4EC0\u4E48\uFF1A\u4E3B\u4F53\u3001\u59FF\u6001\u3001\u6750\u8D28\u3001\u5149\u7EBF",
  "editor.heightShort": "\u9AD8",
  "editor.kindPerson": "\u4EBA\u7269",
  "editor.kindText": "\u6587\u5B57",
  "editor.kindTextHint": "\u9010\u5B57\u6E32\u67D3\u7684\u6587\u5B57",
  "editor.widthShort": "\u5BBD",
  "error.delete": "\u5220\u9664\u5931\u8D25\uFF08{status}\uFF09",
  "error.flag": "\u6807\u8BB0\u5931\u8D25\uFF08{status}\uFF09",
  "error.generateRequest": "\u751F\u6210\u8BF7\u6C42\u5931\u8D25\uFF08{status}\uFF09",
  "error.cancelGeneration": "\u53D6\u6D88\u751F\u6210\u5931\u8D25\uFF08{status}\uFF09",
  "error.generation": "\u751F\u6210\u5931\u8D25",
  "error.healthRequest": "health \u8BF7\u6C42\u5931\u8D25\uFF08{status}\uFF09",
  "error.read": "\u8BFB\u53D6\u5931\u8D25\uFF1A{error}",
  "error.recordRequest": "\u8BB0\u5F55\u8BF7\u6C42\u5931\u8D25\uFF08{status}\uFF09",
  "error.recordsRequest": "records \u8BF7\u6C42\u5931\u8D25\uFF08{status}\uFF09",
  "error.retry": "\u91CD\u8BD5\u5931\u8D25\uFF08{status}\uFF09",
  "error.save": "\u4FDD\u5B58\u5931\u8D25\uFF08{status}\uFF09",
  "error.settingsRequest": "\u8BBE\u7F6E\u8BFB\u53D6\u5931\u8D25\uFF08{status}\uFF09",
  "error.stateRequest": "state \u8BF7\u6C42\u5931\u8D25\uFF08{status}\uFF09",
  "generate.currentSeed": "\u7528\u5F53\u524D seed \u751F\u6210",
  "generate.cancel": "\u53D6\u6D88\u751F\u6210",
  "generate.otherSession": "\u53E6\u4E00\u4F1A\u8BDD\u6B63\u5728\u751F\u6210",
  "generate.pending": "\u6B63\u5728\u751F\u6210\u2026\uFF08{id}\uFF09",
  "generate.percent": "\u751F\u6210 {percent}% \xB7 {step}/{maxStep} \u6B65",
  "generate.progressLabel": "\u751F\u6210\u8FDB\u5EA6",
  "generate.queuePosition": "\u961F\u5217\u7B2C {position} \u4F4D \xB7 \u5171 {pending} \u4E2A",
  "generate.queued": "\u961F\u5217\u4E2D \xB7 {id}",
  "generate.random": "\u968F\u673A seed \u751F\u6210",
  "generate.running": "\u751F\u6210\u4E2D {seconds}s",
  "history.deleteBlockedRunning": "\u8FD9\u6761\u8BB0\u5F55\u8FD8\u5728\u751F\u6210\uFF0C\u7B49\u5B83\u7ED3\u675F\u518D\u5220",
  "history.deleteWhileRunning": "\u751F\u6210\u4E2D\uFF0C\u7ED3\u675F\u540E\u624D\u80FD\u5220\u9664",
  "history.boxCount": "{count} \u6846",
  "history.empty": "\u8FD8\u6CA1\u6709\u8BB0\u5F55",
  "history.emptySession": "\u8FD9\u4E2A\u4F1A\u8BDD\u8FD8\u6CA1\u6709\u8BB0\u5F55\uFF08\u53EF\u4EE5\u5173\u6389\u300C\u672C\u4F1A\u8BDD\u300D\u770B\u5168\u90E8\uFF09",
  "history.filterSession": "\u672C\u4F1A\u8BDD",
  "history.hideArchived": "\u9690\u85CF\u5DF2\u5F52\u6863\u7684\u8BB0\u5F55",
  "history.loadMore": "\u52A0\u8F7D\u66F4\u591A",
  "history.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "history.noMatches": "\u6CA1\u6709\u5339\u914D\u300C{query}\u300D\u7684\u8BB0\u5F55",
  "history.noPrompt": "(\u65E0\u63D0\u793A\u8BCD)",
  "history.onlyThisSession": "\u53EA\u770B\u672C\u4F1A\u8BDD\u7684\u8BB0\u5F55",
  "history.pinnedTruncated": "\u7F6E\u9876\u8D85\u8FC7 50 \u6761\uFF0C\u53EA\u663E\u793A\u6700\u8FD1 50 \u6761",
  "history.pinnedTitle": "\u7F6E\u9876 {count}",
  "history.resizeTitle": "\u62D6\u52A8\u8C03\u6574\u5386\u53F2\u5217\u5BBD\uFF0C\u53CC\u51FB\u590D\u4F4D",
  "history.searchPlaceholder": "\u641C\u7D22\u63D0\u793A\u8BCD\u6216\u8BB0\u5F55\u53F7",
  "history.showAllSessions": "\u663E\u793A\u5168\u90E8\u4F1A\u8BDD\u7684\u8BB0\u5F55",
  "history.showArchived": "\u663E\u793A\u5DF2\u5F52\u6863\u7684\u8BB0\u5F55",
  "history.untitled": "\u672A\u547D\u540D\u8BB0\u5F55",
  "history.title": "\u5386\u53F2 {count}",
  "notice.draftChanged": "\u8349\u7A3F\u5DF2\u66F4\u65B0\uFF0C\u8BF7\u786E\u8BA4\u540E\u518D\u751F\u6210",
  "notice.draftConflict": "\u672C\u5730\u4FEE\u6539\u4E0E\u670D\u52A1\u5668\u8349\u7A3F\u51B2\u7A81\u3002\u91C7\u7528\u670D\u52A1\u5668\u7248\u672C\u4F1A\u4E22\u5F03\u672C\u5730\u4FEE\u6539\uFF1B\u786E\u8BA4\u8986\u76D6\u4F1A\u7528\u5F53\u524D\u672C\u5730\u5185\u5BB9\u4FDD\u5B58\u3002",
  "notice.localDraftSaved": "\u5DF2\u7528\u672C\u5730\u7248\u672C\u8986\u76D6\u670D\u52A1\u5668\u8349\u7A3F",
  "notice.overwritingDraft": "\u6B63\u5728\u4FDD\u5B58\u672C\u5730\u7248\u672C\u2026",
  "notice.serverDraftAdopted": "\u5DF2\u91C7\u7528\u670D\u52A1\u5668\u7248\u672C\uFF0C\u672C\u5730\u4FEE\u6539\u5DF2\u4E22\u5F03",
  "notice.draftSyncedFromAi": "\u8349\u7A3F\u5DF2\u88AB AI \u66F4\u65B0\uFF0C\u5DF2\u540C\u6B65\u4E3A\u6700\u65B0\u53C2\u6570",
  "notice.flagsNeedNewHost": "\u7F6E\u9876/\u5F52\u6863\u9700\u8981\u65B0\u7248\u5BBF\u4E3B\uFF1A\u91CD\u542F\u5E94\u7528\u540E\u751F\u6548\uFF08\u5F53\u524D\u8FDB\u7A0B\u8FD8\u662F\u65E7\u7248\u672C\uFF09",
  "notice.generationBusy": "\u4E0A\u4E00\u6B21\u751F\u6210\u8FD8\u5728\u8FDB\u884C",
  "notice.generationCancelled": "\u5DF2\u53D6\u6D88\u751F\u6210",
  "notice.generationCancelling": "\u6B63\u5728\u53D6\u6D88 ComfyUI \u4EFB\u52A1\u2026",
  "notice.generationDone": "\u5DF2\u5B8C\u6210\uFF1A{width}\xD7{height}\uFF0C{seconds} \u79D2",
  "notice.generationSubmitted": "\u5DF2\u63D0\u4EA4\uFF0C\u7B49\u5F85 ComfyUI \u51FA\u56FE\u2026",
  "notice.generationTimeout": "\u7B49\u5F85\u8D85\u65F6\uFF0C\u4EFB\u52A1\u53EF\u80FD\u4ECD\u5728 ComfyUI \u961F\u5217\u4E2D",
  "notice.layoutReverted": "\u5DF2\u64A4\u9500\u672C\u6B21\u5E03\u5C40\u4FEE\u6539",
  "notice.newDraft": "\u5DF2\u65B0\u5EFA\u7A7A\u8349\u7A3F",
  "notice.recordLoaded": "\u5DF2\u8F7D\u5165 {id} \u7684\u53C2\u6570",
  "notice.retrySubmitted": "\u5DF2\u6309\u8FD9\u6761\u8BB0\u5F55\u91CD\u8BD5\uFF0C\u7B49\u5F85\u51FA\u56FE\u2026",
  "panel.description": "\u672C\u673A MOSS-Image \u751F\u56FE\uFF1A\u5386\u53F2\u3001\u6846\u4F4D\u3001\u53C2\u6570",
  "panel.errorHint": "\u5237\u65B0\u9875\u9762\u53EF\u91CD\u8BD5\uFF1B\u53C2\u6570\u4ECD\u4FDD\u5B58\u5728 ~/.dsh/moss-studio\u3002",
  "panel.errorTitle": "Moss studio \u9762\u677F\u51FA\u9519",
  "params.enhanceHint": "\u5148\u7528\u672C\u5730 9B \u6269\u5199\u63D0\u793A\u8BCD\uFF08\u6709\u6846\u65F6\u4E0D\u53EF\u7528\uFF09",
  "params.negative": "\u8D1F\u5411\u63D0\u793A\u8BCD",
  "params.negativePlaceholder": "\u4E0D\u5E0C\u671B\u51FA\u73B0\u7684\u5185\u5BB9\uFF0C\u9017\u53F7\u5206\u9694",
  "params.steps": "\u6B65\u6570",
  "phase.download": "\u4E0B\u8F7D",
  "phase.probe": "\u63A2\u6D4B",
  "phase.submit": "\u63D0\u4EA4",
  "phase.wait": "\u6392\u961F",
  "preview.collapse": "\u6298\u53E0\u9884\u89C8",
  "preview.boxes": "\u5E03\u5C40\u6846 {count}",
  "preview.empty": "\u65E0\u6846\uFF1A\u6574\u5E45\u81EA\u7531\u6784\u56FE",
  "preview.editLayout": "\u7F16\u8F91\u5E03\u5C40",
  "preview.expand": "\u5C55\u5F00\u9884\u89C8",
  "preview.openEditor": "\u70B9\u51FB\u6253\u5F00\u5E03\u5C40\u7F16\u8F91\u5668",
  "prompt.label": "\u63D0\u793A\u8BCD",
  "prompt.placeholder": "\u6574\u56FE\u63CF\u8FF0\uFF1B\u6846\u5185\u7EC6\u8282\u5199\u5728\u6BCF\u4E2A\u6846\u7684 desc \u91CC",
  "result.collapse": "\u6536\u8D77\u7ED3\u679C\u533A",
  "result.collapseShort": "\u6536\u8D77\u7ED3\u679C",
  "result.delete": "\u5220\u9664\u9009\u4E2D\u8BB0\u5F55",
  "result.deleteTitle": "\u5220\u9664\u9009\u4E2D\u7684\u8BB0\u5F55",
  "result.download": "\u4E0B\u8F7D",
  "result.downloadTitle": "\u4E0B\u8F7D\u56FE\u7247",
  "result.empty": "\u7ED3\u679C\u4F1A\u663E\u793A\u5728\u8FD9\u91CC",
  "result.expand": "\u5C55\u5F00\u7ED3\u679C\u533A",
  "result.imageAlt": "\u751F\u6210\u7ED3\u679C",
  "result.imageFailed": "\u56FE\u7247\u52A0\u8F7D\u5931\u8D25\uFF0C\u70B9\u300C\u4E0B\u8F7D\u300D\u91CD\u8BD5\u6216\u91CD\u65B0\u751F\u6210",
  "result.label": "\u7ED3\u679C",
  "result.load": "\u8F7D\u5165\u53C2\u6570",
  "result.loadTitle": "\u628A\u8FD9\u6761\u8BB0\u5F55\u7684\u53C2\u6570\u8F7D\u5165\u8349\u7A3F",
  "result.noSelection": "\u672A\u9009\u4E2D\u8BB0\u5F55",
  "result.resizeTitle": "\u62D6\u52A8\u8C03\u6574\u9AD8\u5EA6\uFF0C\u53CC\u51FB\u6536\u8D77/\u5C55\u5F00",
  "result.retry": "\u91CD\u8BD5",
  "result.retryTitle": "\u7528\u8FD9\u6761\u8BB0\u5F55\u7684\u53C2\u6570\u91CD\u8BD5",
  "settings.close": "\u5173\u95ED\u8BBE\u7F6E",
  "settings.comfyUrl": "ComfyUI \u5730\u5740",
  "settings.comfyUrlHint": "\u4FDD\u5B58\u540E\u7ACB\u5373\u751F\u6548\uFF0C\u4E0B\u4E00\u6B21\u751F\u6210\u5C31\u7528\u65B0\u5730\u5740\uFF1B\u503C\u4F1A\u5199\u8FDB profile \u7684 cordis.patch.yml\u3002",
  "settings.comfyUrlReadOnly": "\u5F53\u524D profile \u6CA1\u6709\u914D\u7F6E\u7F16\u8F91\u5668\uFF0C\u8FD9\u4E00\u9879\u53EA\u80FD\u6539 cordis.patch.yml \u540E\u91CD\u542F\u3002",
  "settings.dataDir": "\u6570\u636E\u76EE\u5F55",
  "settings.defaultCfg": "\u9ED8\u8BA4 CFG",
  "settings.defaultNegative": "\u9ED8\u8BA4\u8D1F\u5411\u63D0\u793A\u8BCD",
  "settings.defaultSize": "\u9ED8\u8BA4\u5C3A\u5BF8",
  "settings.defaultSizeHint": "\u5982 1024x1024",
  "settings.defaultSteps": "\u9ED8\u8BA4\u6B65\u6570",
  "settings.defaults": "\u65B0\u8349\u7A3F\u9ED8\u8BA4\u503C\uFF08\u4E0D\u5F71\u54CD\u5DF2\u6709\u8349\u7A3F\uFF09",
  "settings.loading": "\u8BFB\u53D6\u4E2D\u2026",
  "settings.retention": "\u5386\u53F2\u4FDD\u7559\u6761\u6570\uFF080 = \u4E0D\u9650\u5236\uFF09",
  "settings.retentionAria": "\u5386\u53F2\u4FDD\u7559\u6761\u6570",
  "settings.retentionHint": "\u8D85\u51FA\u65F6\u5220\u6700\u65E7\u7684\uFF1B\u7F6E\u9876\u4E0E\u6B63\u5728\u751F\u6210\u7684\u8BB0\u5F55\u4E0D\u4F1A\u88AB\u5220\u3002",
  "settings.saved": "\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u4E00\u6B21\u751F\u6210\u4E0E\u65B0\u8349\u7A3F\u5C31\u7528\u65B0\u8BBE\u7F6E",
  "settings.timeoutValue": "{seconds} \u79D2 / {ms} \u6BEB\u79D2",
  "settings.timeouts": "\u8D85\u65F6 / \u8F6E\u8BE2",
  "settings.title": "Moss studio \u8BBE\u7F6E",
  "settings.wiring": "\u4EE5\u4E0B\u7531\u914D\u7F6E\u51B3\u5B9A\uFF0C\u9700\u6539 cordis.patch.yml \u5E76\u91CD\u542F",
  "settings.workflow": "\u5DE5\u4F5C\u6D41",
  "size.errorEmpty": "\u5BBD\u9AD8\u4E0D\u80FD\u4E3A\u7A7A",
  "size.errorMultiple": "\u5BBD\u9AD8\u5FC5\u987B\u662F 16 \u7684\u500D\u6570",
  "size.errorPositive": "\u5BBD\u9AD8\u5FC5\u987B\u662F\u6B63\u6574\u6570",
  "size.errorTooLarge": "\u8D85\u8FC7 4 MP\uFF08\u7EA6 2048\xD72048\uFF09",
  "size.errorTooSmall": "\u4F4E\u4E8E 0.25 MP\uFF08512\xD7512\uFF09",
  "size.height": "\u9AD8\u5EA6",
  "size.invalidNotSaved": "\u5C3A\u5BF8\u65E0\u6548\uFF0C\u672A\u4FDD\u5B58",
  "size.label": "\u5C3A\u5BF8",
  "size.presetPlaceholder": "\u9884\u8BBE",
  "size.presets": "\u5E38\u7528\u5C3A\u5BF8",
  "size.width": "\u5BBD\u5EA6",
  "status.comfyOffline": "ComfyUI \u79BB\u7EBF",
  "status.comfyUnreachable": "\u8FDE\u4E0D\u4E0A ComfyUI",
  "status.comfyVersion": "ComfyUI {version}",
  "status.connecting": "\u8FDE\u63A5\u4E2D",
  "status.draftConversation": "\u5BF9\u8BDD\u8349\u7A3F",
  "status.draftRoot": "\u6839\u8349\u7A3F",
  "status.draftSession": "\u8349\u7A3F\u4F1A\u8BDD\uFF1A{sessionId}",
  "status.draftUnbound": "\u672A\u7ED1\u5B9A\u4F1A\u8BDD",
  "status.loading": "\u6B63\u5728\u8BFB\u53D6 moss studio \u72B6\u6001\u2026",
  "status.ram": "\u5185\u5B58 {used}/{total} G",
  "status.vram": "\u663E\u5B58 {used}/{total} G",
  "status.memoryTitle": "\u663E\u5B58 {total} GB \u603B\u91CF\uFF0C\u5185\u5B58 {ram} GB \u603B\u91CF",
  "status.recheck": "\u91CD\u65B0\u68C0\u6D4B ComfyUI",
  "status.recheckHint": "\u70B9\u51FB\u91CD\u65B0\u68C0\u6D4B",
  "status.saving": "\u4FDD\u5B58\u4E2D\u2026",
  "viewer.fit": "\u9002\u5E94\u7A97\u53E3",
  "viewer.hint": "\u6EDA\u8F6E\u7F29\u653E \xB7 \u62D6\u52A8\u5E73\u79FB \xB7 \u53CC\u51FB\u5207\u6362 \xB7 Esc \u5173\u95ED",
  "viewer.imageAlt": "\u67E5\u770B\u751F\u6210\u7ED3\u679C",
  "viewer.next": "\u4E0B\u4E00\u5F20",
  "viewer.nextTitle": "\u4E0B\u4E00\u5F20\uFF08\u8F83\u65E7\uFF09",
  "viewer.prev": "\u4E0A\u4E00\u5F20",
  "viewer.prevTitle": "\u4E0A\u4E00\u5F20\uFF08\u8F83\u65B0\uFF09",
  "viewer.zoomAlt": "\u653E\u5927\u67E5\u770B",
  "viewer.zoomIn": "\u653E\u5927",
  "viewer.zoomOut": "\u7F29\u5C0F",
  "editor.drawHint": "\u5728\u753B\u5E03\u4E0A\u62D6\u51FA\u4E00\u4E2A\u6846\uFF1B\u6309\u4F4F Shift \u62D6\u62FD\u662F\u6846\u9009",
  "editor.keyboardHint": "Tab \u805A\u7126\u6846\uFF0CEnter \u9009\u62E9\uFF0C\u65B9\u5411\u952E\u79FB\u52A8\uFF0CDelete \u5220\u9664\uFF0CShift \u591A\u9009",
  "editor.reorder": "\u62D6\u52A8\u8C03\u5E8F\uFF1BAlt+\u2191/\u2193 \u4E5F\u53EF\u8C03\u6574\u987A\u5E8F",
  "editor.canvasLabel": "\u5E03\u5C40\u753B\u5E03",
  "editor.boxLabel": "\u5E03\u5C40\u6846 {index}\uFF1A{caption}{flags}",
  "editor.boxListLabel": "\u5E03\u5C40\u6846\u5217\u8868",
  "editor.lockedFlag": "\uFF0C\u5DF2\u9501\u5B9A",
  "editor.hiddenFlag": "\uFF0C\u5DF2\u9690\u85CF",
  "editor.selectionCount": "\u5DF2\u9009 {count} \u4E2A\u6846",
  "editor.geometry": "\u4F4D\u7F6E\u4E0E\u5927\u5C0F",
  "editor.x": "X",
  "editor.y": "Y",
  "editor.width": "\u5BBD",
  "editor.height": "\u9AD8",
  "editor.kind": "\u7C7B\u578B",
  "editor.lockAspect": "\u9501\u5B9A\u5BBD\u9AD8\u6BD4",
  "editor.undo": "\u64A4\u9500",
  "editor.redo": "\u91CD\u505A",
  "editor.duplicate": "\u590D\u5236\u6846",
  "editor.deleteSelected": "\u5220\u9664\u9009\u4E2D\u7684\u6846",
  "editor.alignLeft": "\u5DE6\u5BF9\u9F50",
  "editor.alignCenter": "\u6C34\u5E73\u5C45\u4E2D",
  "editor.alignRight": "\u53F3\u5BF9\u9F50",
  "editor.alignTop": "\u9876\u5BF9\u9F50",
  "editor.alignMiddle": "\u5782\u76F4\u5C45\u4E2D",
  "editor.alignBottom": "\u5E95\u5BF9\u9F50",
  "editor.distributeX": "\u6C34\u5E73\u7B49\u8DDD\u5206\u5E03",
  "editor.distributeY": "\u5782\u76F4\u7B49\u8DDD\u5206\u5E03",
  "editor.noDesc": "\uFF08\u672A\u586B\u5199\u63CF\u8FF0\uFF09",
  "history.show": "\u663E\u793A\u5386\u53F2\uFF08{count}\uFF09",
  "history.hide": "\u6536\u8D77\u5386\u53F2",
  "editor.lock": "\u9501\u5B9A\u4F4D\u7F6E\u4E0E\u5927\u5C0F\uFF08\u4ECD\u53EF\u7F16\u8F91\u5185\u5BB9\uFF09",
  "editor.unlock": "\u89E3\u9501\u4F4D\u7F6E\u4E0E\u5927\u5C0F",
  "editor.hide": "\u9690\u85CF\uFF08\u4E0D\u751F\u6210\uFF0C\u4E5F\u4E0D\u53C2\u4E0E\u5438\u9644\u4E0E\u7EC4\u64CD\u4F5C\uFF09",
  "editor.show": "\u663E\u793A",
  "editor.limit": "\u6700\u591A {max} \u4E2A\u6846\uFF0C\u5148\u5220\u6389\u4E00\u4E2A\u518D\u753B",
  "editor.lockSelected": "\u9501\u5B9A\u9009\u4E2D\u7684\u6846",
  "editor.unlockSelected": "\u89E3\u9501\u9009\u4E2D\u7684\u6846",
  "editor.hideSelected": "\u9690\u85CF\u9009\u4E2D\u7684\u6846\uFF08\u4E0D\u9001\u8FDB\u5DE5\u4F5C\u6D41\uFF09",
  "editor.showSelected": "\u663E\u793A\u9009\u4E2D\u7684\u6846",
  "editor.markPeople": "\u628A\u9009\u4E2D\u7684\u6846\u6807\u8BB0\u4E3A\u4EBA\u7269",
  "error.emptyDesc": "\u7B2C {index} \u4E2A\u6846\u8FD8\u6CA1\u6709\u63CF\u8FF0\uFF0C\u586B\u4E0A\u5B83\u518D\u751F\u6210",
  "error.emptyText": "\u7B2C {index} \u4E2A\u6846\u662F\u6587\u5B57\u6846\uFF0C\u8FD8\u6CA1\u6709\u5199\u5185\u5BB9",
  "error.tooManyBoxes": "\u6846\u7684\u6570\u91CF\u8D85\u8FC7 {max} \u4E2A\uFF0C\u5148\u5220\u6389\u4E00\u4E9B",
  "editor.incomplete": "{count} \u4E2A\u6846\u8FD8\u6CA1\u5199\u5B8C",
  "editor.needsDesc": "\u8FD9\u4E2A\u6846\u8FD8\u6CA1\u6709\u63CF\u8FF0\uFF0C\u751F\u6210\u524D\u8981\u586B\u4E0A",
  "editor.needsText": "\u8FD9\u4E2A\u6587\u5B57\u6846\u8FD8\u6CA1\u6709\u5185\u5BB9"
};
var EN = {
  "action.archive": "Archive",
  "action.adoptServer": "Use server version",
  "action.cancel": "Cancel",
  "action.close": "Close",
  "action.delete": "Delete",
  "action.deleteRecord": "Delete record",
  "action.deleteRecordTitle": "Delete this record",
  "action.done": "Done",
  "action.newDraft": "New draft",
  "action.newDraftTitle": "New empty draft",
  "action.pin": "Pin",
  "action.save": "Save",
  "action.settings": "Settings",
  "action.unarchive": "Unarchive",
  "action.unpin": "Unpin",
  "action.overwriteServer": "Overwrite",
  "confirm.deleteTitle": "Delete this record?",
  "confirm.deleteMessage": "The record and its image are deleted together. This cannot be undone.",
  "editor.addBox": "Add box",
  "editor.addBoxTitle": "Add a box",
  "editor.cancelTitle": "Cancel and undo this edit",
  "editor.deleteBox": "Delete box",
  "editor.deleteBoxTitle": "Delete this box",
  "editor.empty": "No boxes yet. Add one, drag it to move, drag its corner to resize.",
  "editor.title": "Edit layout \xB7 {count} boxes \xB7 {size}",
  "editor.descPlaceholder": "What is in the box: subject, pose, material, lighting",
  "editor.heightShort": "H",
  "editor.kindPerson": "Person",
  "editor.kindText": "Text",
  "editor.kindTextHint": "Text rendered verbatim",
  "editor.widthShort": "W",
  "error.delete": "Delete failed ({status})",
  "error.flag": "Could not update the flag ({status})",
  "error.generateRequest": "The generate request failed ({status})",
  "error.cancelGeneration": "Failed to cancel generation ({status})",
  "error.generation": "Generation failed",
  "error.healthRequest": "health request failed ({status})",
  "error.read": "Failed to load: {error}",
  "error.recordRequest": "record request failed ({status})",
  "error.recordsRequest": "records request failed ({status})",
  "error.retry": "Retry failed ({status})",
  "error.save": "Save failed ({status})",
  "error.settingsRequest": "settings request failed ({status})",
  "error.stateRequest": "state request failed ({status})",
  "generate.currentSeed": "Generate with the current seed",
  "generate.cancel": "Cancel generation",
  "generate.otherSession": "Another session is generating",
  "generate.pending": "Generating\u2026 ({id})",
  "generate.percent": "Generating {percent}% \xB7 step {step}/{maxStep}",
  "generate.progressLabel": "Generation progress",
  "generate.queuePosition": "Queue position {position} \xB7 {pending} total",
  "generate.queued": "Queued \xB7 {id}",
  "generate.random": "Generate with a random seed",
  "generate.running": "Generating {seconds}s",
  "history.deleteBlockedRunning": "This record is still generating; delete it after it finishes",
  "history.deleteWhileRunning": "Generating; delete it once it finishes",
  "history.boxCount": "{count} boxes",
  "history.empty": "No records yet",
  "history.emptySession": "No records in this session (turn off This session to see all)",
  "history.filterSession": "This session",
  "history.hideArchived": "Hide archived records",
  "history.loadMore": "Load more",
  "history.loading": "Loading\u2026",
  "history.noMatches": 'No records match "{query}"',
  "history.noPrompt": "(no prompt)",
  "history.onlyThisSession": "Only records from this session",
  "history.pinnedTruncated": "More than 50 pinned; only the newest 50 are shown",
  "history.pinnedTitle": "Pinned {count}",
  "history.resizeTitle": "Drag to resize the history column; double-click to reset",
  "history.searchPlaceholder": "Search prompt or record id",
  "history.showAllSessions": "Show records from every session",
  "history.showArchived": "Show archived records",
  "history.untitled": "Untitled record",
  "history.title": "History {count}",
  "notice.draftChanged": "The draft changed; review it before generating",
  "notice.draftConflict": "Local edits conflict with the server draft. Use the server version to discard local edits, or overwrite to save the current local content.",
  "notice.localDraftSaved": "The local version now overwrites the server draft",
  "notice.overwritingDraft": "Saving the local version\u2026",
  "notice.serverDraftAdopted": "Server version adopted; local edits discarded",
  "notice.draftSyncedFromAi": "The AI updated the draft; parameters synced",
  "notice.flagsNeedNewHost": "Pinning and archiving need the newer host: restart the app (this process is still the old version)",
  "notice.generationBusy": "A generation is already running",
  "notice.generationCancelled": "Generation cancelled",
  "notice.generationCancelling": "Cancelling the ComfyUI job\u2026",
  "notice.generationDone": "Done: {width}\xD7{height} in {seconds}s",
  "notice.generationSubmitted": "Submitted, waiting for ComfyUI\u2026",
  "notice.generationTimeout": "Timed out waiting; the job may still be queued in ComfyUI",
  "notice.layoutReverted": "Layout changes reverted",
  "notice.newDraft": "New empty draft",
  "notice.recordLoaded": "Loaded the parameters of {id}",
  "notice.retrySubmitted": "Retrying with this record, waiting for the image\u2026",
  "panel.description": "Local MOSS-Image generation: history, layout boxes, parameters",
  "panel.errorHint": "Reload to retry; parameters are still saved under ~/.dsh/moss-studio.",
  "panel.errorTitle": "Moss studio panel failed",
  "params.enhanceHint": "Expand the prompt with the local 9B model (unavailable with boxes)",
  "params.negative": "Negative prompt",
  "params.negativePlaceholder": "What to avoid, comma separated",
  "params.steps": "Steps",
  "phase.download": "Downloading",
  "phase.probe": "Probing",
  "phase.submit": "Submitting",
  "phase.wait": "Queued",
  "preview.collapse": "Collapse preview",
  "preview.boxes": "{count} boxes",
  "preview.empty": "No boxes: a free full-frame composition",
  "preview.editLayout": "Edit layout",
  "preview.expand": "Expand preview",
  "preview.openEditor": "Open the layout editor",
  "prompt.label": "Prompt",
  "prompt.placeholder": "Whole-image description; per-box detail goes in each box's desc",
  "result.collapse": "Collapse result area",
  "result.collapseShort": "Collapse result",
  "result.delete": "Delete selected record",
  "result.deleteTitle": "Delete selected record",
  "result.download": "Download",
  "result.downloadTitle": "Download image",
  "result.empty": "The result appears here",
  "result.expand": "Expand result area",
  "result.imageAlt": "Generated result",
  "result.imageFailed": "Image failed to load; use Download to retry or generate again",
  "result.label": "Result",
  "result.load": "Load parameters",
  "result.loadTitle": "Load this record's parameters into the draft",
  "result.noSelection": "No record selected",
  "result.resizeTitle": "Drag to resize; double-click to collapse or expand",
  "result.retry": "Retry",
  "result.retryTitle": "Retry with this record\u2019s parameters",
  "settings.close": "Close settings",
  "settings.comfyUrl": "ComfyUI address",
  "settings.comfyUrlHint": "Applies immediately to the next generation; the value is written to the profile's cordis.patch.yml.",
  "settings.comfyUrlReadOnly": "This profile has no config editor; change cordis.patch.yml and restart instead.",
  "settings.dataDir": "Data directory",
  "settings.defaultCfg": "Default CFG",
  "settings.defaultNegative": "Default negative prompt",
  "settings.defaultSize": "Default size",
  "settings.defaultSizeHint": "e.g. 1024x1024",
  "settings.defaultSteps": "Default steps",
  "settings.defaults": "Defaults for new drafts (existing drafts are untouched)",
  "settings.loading": "Loading\u2026",
  "settings.retention": "History retention (0 = unlimited)",
  "settings.retentionAria": "History retention",
  "settings.retentionHint": "The oldest are removed first; pinned and running records are kept.",
  "settings.saved": "Saved; the next generation and new drafts use it",
  "settings.timeoutValue": "{seconds}s / {ms}ms",
  "settings.timeouts": "Timeout / polling",
  "settings.title": "Moss studio settings",
  "settings.wiring": "Decided by configuration; change cordis.patch.yml and restart",
  "settings.workflow": "Workflow",
  "size.errorEmpty": "Width and height are required",
  "size.errorMultiple": "Width and height must be multiples of 16",
  "size.errorPositive": "Width and height must be positive integers",
  "size.errorTooLarge": "Above 4 MP (about 2048\xD72048)",
  "size.errorTooSmall": "Below 0.25 MP (512\xD7512)",
  "size.height": "Height",
  "size.invalidNotSaved": "Invalid size, not saved",
  "size.label": "Size",
  "size.presetPlaceholder": "Preset",
  "size.presets": "Preset size",
  "size.width": "Width",
  "status.comfyOffline": "ComfyUI offline",
  "status.comfyUnreachable": "Cannot reach ComfyUI",
  "status.comfyVersion": "ComfyUI {version}",
  "status.connecting": "connecting",
  "status.draftConversation": "Conversation draft",
  "status.draftRoot": "Root draft",
  "status.draftSession": "Draft session: {sessionId}",
  "status.draftUnbound": "No session bound",
  "status.loading": "Reading moss studio state\u2026",
  "status.ram": "RAM {used}/{total} G",
  "status.vram": "VRAM {used}/{total} G",
  "status.memoryTitle": "VRAM total {total} GB, RAM total {ram} GB",
  "status.recheck": "Check ComfyUI again",
  "status.recheckHint": "Click to check again",
  "status.saving": "Saving\u2026",
  "viewer.fit": "Fit to window",
  "viewer.hint": "Wheel to zoom \xB7 drag to pan \xB7 double-click to toggle \xB7 Esc to close",
  "viewer.imageAlt": "View the result",
  "viewer.next": "Next",
  "viewer.nextTitle": "Next (older)",
  "viewer.prev": "Previous",
  "viewer.prevTitle": "Previous (newer)",
  "viewer.zoomAlt": "Zoomed view",
  "viewer.zoomIn": "Zoom in",
  "viewer.zoomOut": "Zoom out",
  "editor.drawHint": "Drag on the canvas to draw a box; hold Shift and drag to marquee-select",
  "editor.keyboardHint": "Tab focuses boxes, Enter selects, arrows move, Delete removes, Shift multi-selects",
  "editor.reorder": "Drag to reorder; Alt+\u2191/\u2193 also changes the order",
  "editor.canvasLabel": "Layout canvas",
  "editor.boxLabel": "Layout box {index}: {caption}{flags}",
  "editor.boxListLabel": "Layout box list",
  "editor.lockedFlag": ", locked",
  "editor.hiddenFlag": ", hidden",
  "editor.selectionCount": "{count} boxes selected",
  "editor.geometry": "Position and size",
  "editor.x": "X",
  "editor.y": "Y",
  "editor.width": "W",
  "editor.height": "H",
  "editor.kind": "Type",
  "editor.lockAspect": "Lock aspect ratio",
  "editor.undo": "Undo",
  "editor.redo": "Redo",
  "editor.duplicate": "Duplicate box",
  "editor.deleteSelected": "Delete selected boxes",
  "editor.alignLeft": "Align left",
  "editor.alignCenter": "Align horizontal centres",
  "editor.alignRight": "Align right",
  "editor.alignTop": "Align top",
  "editor.alignMiddle": "Align vertical centres",
  "editor.alignBottom": "Align bottom",
  "editor.distributeX": "Distribute horizontally",
  "editor.distributeY": "Distribute vertically",
  "editor.noDesc": "(no description)",
  "history.show": "Show history ({count})",
  "history.hide": "Hide history",
  "editor.lock": "Lock position and size (content stays editable)",
  "editor.unlock": "Unlock position and size",
  "editor.hide": "Hide (exclude from generation, snapping and group operations)",
  "editor.show": "Show",
  "editor.limit": "At most {max} boxes; delete one before drawing another",
  "editor.lockSelected": "Lock the selected boxes",
  "editor.unlockSelected": "Unlock the selected boxes",
  "editor.hideSelected": "Hide the selected boxes (leave them out of the request)",
  "editor.showSelected": "Show the selected boxes",
  "editor.markPeople": "Mark the selected boxes as people",
  "error.emptyDesc": "Box {index} has no description yet; fill it in before generating",
  "error.emptyText": "Box {index} is a text box with no text yet",
  "error.tooManyBoxes": "More than {max} boxes; delete some first",
  "editor.incomplete": "{count} boxes still need text",
  "editor.needsDesc": "This box needs a description before generating",
  "editor.needsText": "This text box needs its text"
};
function fill(template, params) {
  if (params === void 0 || params === null) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) => name in params ? String(params[name]) : match);
}
function localTranslate(key, params) {
  return fill(ZH[key] ?? key, params);
}
var translate = localTranslate;
var service;
function attachLocale(locale) {
  if (locale === void 0 || locale === null || typeof locale.register !== "function") {
    return () => {
    };
  }
  const disposeDictionaries = locale.register(NS, { zh: ZH, en: EN });
  service = locale;
  translate = typeof locale.bind === "function" ? locale.bind(NS) : localTranslate;
  return () => {
    translate = localTranslate;
    service = void 0;
    if (typeof disposeDictionaries === "function") disposeDictionaries();
  };
}
function t(key, params) {
  return translate(key, params);
}
function subscribe(listener) {
  if (typeof service?.subscribe !== "function") return () => {
  };
  return service.subscribe(listener);
}
function getRevision() {
  return service?.getSnapshot?.()?.revision ?? 0;
}
function currentLocale() {
  return service?.getSnapshot?.()?.active ?? "zh";
}

// src/App.jsx
var import_react14 = __toESM(require("react"), 1);

// src/api.js
var PREFIX = "/plugins/dsh-moss-studio";
async function request(path, init) {
  const response = await fetch(`${PREFIX}${path}`, {
    credentials: "same-origin",
    headers: init?.body === void 0 ? void 0 : { "content-type": "application/json" },
    ...init
  });
  let body = null;
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("application/json")) body = await response.json().catch(() => null);
  return { status: response.status, body };
}
async function fetchState(sessionId, limit = 40, archived = false) {
  const query = new URLSearchParams({ sessionId, limit: String(limit) });
  if (archived) query.set("archived", "1");
  const { status, body } = await request(`/state?${query.toString()}`);
  if (status !== 200 || body === null) throw new Error(body?.message || t("error.stateRequest", { status }));
  return body;
}
async function fetchRecords(limit = 40, before, archived = false, search) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (typeof search === "string" && search.trim() !== "") query.set("q", search.trim());
  if (before !== void 0 && before !== null) query.set("before", before);
  if (archived) query.set("archived", "1");
  const { status, body } = await request(`/records?${query.toString()}`);
  if (status !== 200 || body === null) throw new Error(body?.message || t("error.recordsRequest", { status }));
  return { records: body.records ?? [], nextBefore: body.nextBefore ?? null };
}
async function putDraft(sessionId, patch, revision) {
  return request("/draft", {
    method: "PUT",
    body: JSON.stringify({ sessionId, patch, revision })
  });
}
async function generate(sessionId, revision, overrides) {
  return request("/generate", {
    method: "POST",
    body: JSON.stringify({ sessionId, revision, overrides })
  });
}
async function cancelGeneration(sessionId, recordId) {
  return request("/generate/cancel", {
    method: "POST",
    body: JSON.stringify({ sessionId, recordId })
  });
}
async function deleteRecord(id) {
  return request(`/records/${encodeURIComponent(id)}`, { method: "DELETE" });
}
function imageUrl(id) {
  return `${PREFIX}/image/${encodeURIComponent(id)}`;
}
async function fetchRecord(id) {
  const { status, body } = await request(`/records/${encodeURIComponent(id)}`);
  if (status !== 200 || body === null) throw new Error(body?.message || t("error.recordRequest", { status }));
  return body.record;
}
async function patchRecord(id, flags) {
  return request(`/records/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(flags)
  });
}
async function fetchHealth() {
  const { status, body } = await request("/health");
  if (status !== 200 || body === null) return { ok: false, error: t("error.healthRequest", { status }) };
  return body;
}
async function fetchSettings() {
  const { status, body } = await request("/settings");
  if (status !== 200 || body === null) throw new Error(body?.message || t("error.settingsRequest", { status }));
  return body;
}
async function saveSettings(patch) {
  return request("/settings", {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

// src/BoxCanvas.jsx
var import_react = __toESM(require("react"), 1);

// src/box-math.js
var MIN_SIZE = 0.02;
var MAX_BOXES = 24;
var HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}
function parseRatio(size) {
  const match = /^\s*(\d+)\s*[x×*]\s*(\d+)\s*$/i.exec(String(size ?? ""));
  if (match === null) return 1;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!(width > 0) || !(height > 0)) return 1;
  return width / height;
}
function reorderBoxes(boxes, from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= boxes.length || to >= boxes.length || from === to) {
    return boxes;
  }
  const next = [...boxes];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
function indexAfterReorder(index, from, to) {
  if (index === from) return to;
  if (from < to && index > from && index <= to) return index - 1;
  if (from > to && index >= to && index < from) return index + 1;
  return index;
}
function reorderLayout(boxes, characters, from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= boxes.length || to >= boxes.length || from === to) {
    return { boxes, characters: String(characters ?? "") };
  }
  const marks = new Set(String(characters ?? "").match(/\d+/g)?.map(Number) ?? []);
  const remapped = /* @__PURE__ */ new Set();
  for (const mark of marks) {
    if (mark < 1 || mark > boxes.length) continue;
    remapped.add(indexAfterReorder(mark - 1, from, to) + 1);
  }
  return {
    boxes: reorderBoxes(boxes, from, to),
    characters: [...remapped].sort((a, b) => a - b).join(",")
  };
}
function moveBox(box, dx, dy) {
  return {
    ...box,
    x: clamp(box.x + dx, 0, 1 - box.width),
    y: clamp(box.y + dy, 0, 1 - box.height)
  };
}
function moveBoxes(boxes, indices, dx, dy) {
  const wanted = new Set(indices);
  const picked = boxes.filter((_, index) => wanted.has(index));
  if (picked.length === 0) return boxes;
  const left = Math.min(...picked.map((box) => box.x));
  const top = Math.min(...picked.map((box) => box.y));
  const right = Math.max(...picked.map((box) => box.x + box.width));
  const bottom = Math.max(...picked.map((box) => box.y + box.height));
  const stepX = clamp(dx, -left, 1 - right);
  const stepY = clamp(dy, -top, 1 - bottom);
  return boxes.map((box, index) => wanted.has(index) ? moveBox(box, stepX, stepY) : box);
}
function resizeByHandle(start, handle, dx, dy, options = {}) {
  const movingLeft = handle.includes("w");
  const movingRight = handle.includes("e");
  const movingTop = handle.includes("n");
  const movingBottom = handle.includes("s");
  let left = start.x;
  let top = start.y;
  let right = start.x + start.width;
  let bottom = start.y + start.height;
  if (movingLeft) left = clamp(start.x + dx, 0, right - MIN_SIZE);
  if (movingRight) right = clamp(start.x + start.width + dx, left + MIN_SIZE, 1);
  if (movingTop) top = clamp(start.y + dy, 0, bottom - MIN_SIZE);
  if (movingBottom) bottom = clamp(start.y + start.height + dy, top + MIN_SIZE, 1);
  if (options.lockAspect !== true) {
    return { x: left, y: top, width: Math.max(MIN_SIZE, right - left), height: Math.max(MIN_SIZE, bottom - top) };
  }
  const ratio = start.width / start.height;
  const horizontal = movingLeft || movingRight;
  const vertical = movingTop || movingBottom;
  const relW = (right - left - start.width) / start.width;
  const relH = (bottom - top - start.height) / start.height;
  const driver = horizontal && vertical ? Math.abs(relW) >= Math.abs(relH) ? "width" : "height" : horizontal ? "width" : "height";
  const widthRoom = movingLeft ? right : movingRight ? 1 - left : 1;
  const heightRoom = movingTop ? bottom : movingBottom ? 1 - top : 1;
  const centre = (value, span) => 2 * Math.min(value + span / 2, 1 - (value + span / 2));
  const maxWidth = Math.min(widthRoom, horizontal ? 1 : centre(start.x, start.width));
  const maxHeight = Math.min(heightRoom, vertical ? 1 : centre(start.y, start.height));
  const ceiling = Math.max(1e-6, Math.min(maxWidth, maxHeight * ratio));
  const floor = Math.min(MIN_SIZE * Math.max(1, ratio), ceiling);
  const wanted = driver === "width" ? right - left : (bottom - top) * ratio;
  const width = clamp(wanted, floor, ceiling);
  const height = width / ratio;
  let x;
  if (movingLeft) x = right - width;
  else if (movingRight) x = left;
  else x = start.x + start.width / 2 - width / 2;
  let y;
  if (movingTop) y = bottom - height;
  else if (movingBottom) y = top;
  else y = start.y + start.height / 2 - height / 2;
  return {
    x: clamp(x, 0, 1 - width),
    y: clamp(y, 0, 1 - height),
    width,
    height
  };
}
function snapResized(box, handle, others, options = {}) {
  const threshold = options.threshold ?? 8e-3;
  const xs = [0, 0.5, 1];
  const ys = [0, 0.5, 1];
  for (const other of others) {
    xs.push(other.x, other.x + other.width / 2, other.x + other.width);
    ys.push(other.y, other.y + other.height / 2, other.y + other.height);
  }
  const nearest = (value, targets) => {
    let best;
    for (const target of targets) {
      const delta = target - value;
      if (Math.abs(delta) > threshold) continue;
      if (best === void 0 || Math.abs(delta) < Math.abs(best.delta)) best = { delta, target };
    }
    return best;
  };
  let { x, y, width, height } = box;
  const guides = [];
  if (handle.includes("e")) {
    const snap = nearest(x + width, xs);
    if (snap !== void 0) {
      width = clamp(width + snap.delta, MIN_SIZE, 1 - x);
      guides.push({ axis: "x", at: snap.target });
    }
  } else if (handle.includes("w")) {
    const snap = nearest(x, xs);
    if (snap !== void 0) {
      const right = x + width;
      x = clamp(x + snap.delta, 0, right - MIN_SIZE);
      width = right - x;
      guides.push({ axis: "x", at: snap.target });
    }
  }
  if (handle.includes("s")) {
    const snap = nearest(y + height, ys);
    if (snap !== void 0) {
      height = clamp(height + snap.delta, MIN_SIZE, 1 - y);
      guides.push({ axis: "y", at: snap.target });
    }
  } else if (handle.includes("n")) {
    const snap = nearest(y, ys);
    if (snap !== void 0) {
      const bottom = y + height;
      y = clamp(y + snap.delta, 0, bottom - MIN_SIZE);
      height = bottom - y;
      guides.push({ axis: "y", at: snap.target });
    }
  }
  return { box: { ...box, x, y, width, height }, guides };
}
function selectionBounds(boxes, indices) {
  const picked = boxes.filter((_, index) => indices.includes(index));
  if (picked.length === 0) return void 0;
  const left = Math.min(...picked.map((box) => box.x));
  const top = Math.min(...picked.map((box) => box.y));
  const right = Math.max(...picked.map((box) => box.x + box.width));
  const bottom = Math.max(...picked.map((box) => box.y + box.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}
function snapBox(box, others, options = {}) {
  const threshold = options.threshold ?? 8e-3;
  const axisTargets = { x: [0, 0.5, 1], y: [0, 0.5, 1] };
  for (const other of others) {
    axisTargets.x.push(other.x, other.x + other.width / 2, other.x + other.width);
    axisTargets.y.push(other.y, other.y + other.height / 2, other.y + other.height);
  }
  const anchorsX = [box.x, box.x + box.width / 2, box.x + box.width];
  const anchorsY = [box.y, box.y + box.height / 2, box.y + box.height];
  const best = (anchors, targets) => {
    let winner = void 0;
    for (const anchor of anchors) {
      for (const target of targets) {
        const delta = target - anchor;
        if (Math.abs(delta) > threshold) continue;
        if (winner === void 0 || Math.abs(delta) < Math.abs(winner.delta)) winner = { delta, at: target };
      }
    }
    return winner;
  };
  const snapX = best(anchorsX, axisTargets.x);
  const snapY = best(anchorsY, axisTargets.y);
  const next = {
    ...box,
    x: clamp(box.x + (snapX?.delta ?? 0), 0, 1 - box.width),
    y: clamp(box.y + (snapY?.delta ?? 0), 0, 1 - box.height)
  };
  const guides = [];
  if (snapX !== void 0) guides.push({ axis: "x", at: snapX.at });
  if (snapY !== void 0) guides.push({ axis: "y", at: snapY.at });
  return { box: next, guides };
}
function alignBoxes(boxes, indices, mode) {
  const bounds = selectionBounds(boxes, indices);
  if (bounds === void 0) return boxes;
  const wanted = new Set(indices);
  return boxes.map((box, index) => {
    if (!wanted.has(index)) return box;
    switch (mode) {
      case "left":
        return { ...box, x: bounds.x };
      case "centerX":
        return { ...box, x: bounds.x + (bounds.width - box.width) / 2 };
      case "right":
        return { ...box, x: bounds.x + bounds.width - box.width };
      case "top":
        return { ...box, y: bounds.y };
      case "middleY":
        return { ...box, y: bounds.y + (bounds.height - box.height) / 2 };
      case "bottom":
        return { ...box, y: bounds.y + bounds.height - box.height };
      default:
        return box;
    }
  });
}
function distributeBoxes(boxes, indices, axis) {
  const wanted = new Set(indices);
  const picked = boxes.map((box, index) => ({ box, index })).filter((entry) => wanted.has(entry.index));
  if (picked.length < 3) return boxes;
  const startKey = axis === "x" ? "x" : "y";
  const sizeKey = axis === "x" ? "width" : "height";
  const ordered = [...picked].sort((a, b) => a.box[startKey] - b.box[startKey]);
  const first = ordered[0].box;
  const last = ordered[ordered.length - 1].box;
  const span = last[startKey] + last[sizeKey] - first[startKey];
  const total = ordered.reduce((sum, entry) => sum + entry.box[sizeKey], 0);
  const gap = (span - total) / (ordered.length - 1);
  if (gap < 0) return boxes;
  let cursor = first[startKey];
  const placed = /* @__PURE__ */ new Map();
  for (const entry of ordered) {
    placed.set(entry.index, { ...entry.box, [startKey]: cursor });
    cursor += entry.box[sizeKey] + gap;
  }
  return boxes.map((box, index) => placed.get(index) ?? box);
}
function duplicateBoxes(boxes, indices, offset = 0.02) {
  const wanted = new Set(indices);
  const copies = [];
  boxes.forEach((box, index) => {
    if (!wanted.has(index)) return;
    copies.push({
      ...box,
      x: clamp(box.x + offset, 0, 1 - box.width),
      y: clamp(box.y + offset, 0, 1 - box.height),
      // A copy is a box you are about to adjust, so it starts unlocked and
      // visible; inheriting those flags made duplicating a finished box produce
      // a copy that could not be moved.
      locked: false,
      hidden: false
    });
  });
  const added = copies.map((_, position) => boxes.length + position);
  return { boxes: [...boxes, ...copies], added };
}
function boxFromCorners(ax, ay, bx, by) {
  const left = clamp(Math.min(ax, bx), 0, 1);
  const top = clamp(Math.min(ay, by), 0, 1);
  const right = clamp(Math.max(ax, bx), 0, 1);
  const bottom = clamp(Math.max(ay, by), 0, 1);
  const width = Math.max(MIN_SIZE, right - left);
  const height = Math.max(MIN_SIZE, bottom - top);
  return {
    x: clamp(left, 0, 1 - width),
    y: clamp(top, 0, 1 - height),
    width,
    height
  };
}
function boxProblem(box) {
  if (box === null || typeof box !== "object") return "desc";
  if (box.type === "text") return (box.text ?? "").trim() === "" ? "text" : void 0;
  return (box.desc ?? "").trim() === "" ? "desc" : void 0;
}
function boxesProblem(boxes, max = MAX_BOXES) {
  const list = Array.isArray(boxes) ? boxes : [];
  const index = list.findIndex((box) => box?.hidden !== true && boxProblem(box) !== void 0);
  if (index >= 0) return { reason: boxProblem(list[index]), index };
  if (list.length > max) return { reason: "count" };
  return void 0;
}
function defaultBox() {
  const width = 0.3;
  const height = 0.3;
  return { type: "obj", x: (1 - width) / 2, y: (1 - height) / 2, width, height, desc: "", palette: [] };
}
function frameSize(available, ratio, budget) {
  if (!(available > 0) || !(ratio > 0) || !(budget > 0)) return void 0;
  const width = Math.min(available, budget * ratio);
  return { width, height: width / ratio };
}
function labelMetrics(widthPx, heightPx) {
  if (!(widthPx >= 56) || !(heightPx >= 20)) return { show: false, fontSize: 0, lines: 0 };
  const fontSize = Math.max(9, Math.min(12, Math.round(Math.min(widthPx / 12, heightPx / 10))));
  const usable = heightPx - 18;
  const lines = Math.max(1, Math.min(6, Math.floor(usable / (fontSize * 1.35))));
  return { show: lines >= 1, fontSize, lines };
}
function aspectSizePatch(box, dimension, value) {
  if (dimension !== "width" && dimension !== "height" || !Number.isFinite(value)) return {};
  const ratio = box.width / box.height;
  if (!Number.isFinite(ratio) || !(ratio > 0)) return {};
  const minWidth = MIN_SIZE * Math.max(1, ratio);
  const maxWidth = Math.min(1, ratio);
  if (minWidth > maxWidth) return {};
  const wantedWidth = dimension === "height" ? value * ratio : value;
  const width = clamp(wantedWidth, minWidth, maxWidth);
  return { width, height: width / ratio };
}
function updateBoxGeometry(box, patch) {
  const width = clamp(Number.isFinite(patch.width) ? patch.width : box.width, MIN_SIZE, 1);
  const height = clamp(Number.isFinite(patch.height) ? patch.height : box.height, MIN_SIZE, 1);
  return {
    ...box,
    width,
    height,
    x: clamp(Number.isFinite(patch.x) ? patch.x : box.x, 0, 1 - width),
    y: clamp(Number.isFinite(patch.y) ? patch.y : box.y, 0, 1 - height)
  };
}

// src/theme.js
var SUPPORTS_COLOR_MIX = typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("color", "color-mix(in srgb, red 50%, white)");
function selectionFill(percent) {
  if (SUPPORTS_COLOR_MIX) {
    return `color-mix(in srgb, var(--dsw-alias-brand-primary, #78be91) ${percent}%, transparent)`;
  }
  return "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.18))";
}

// src/BoxCanvas.jsx
var TALL = 260;
var COMPACT = 120;
var HANDLE_SIZE = 9;
var HANDLE_CURSOR = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize"
};
var HANDLE_POSITION = {
  nw: { left: 0, top: 0 },
  n: { left: "50%", top: 0 },
  ne: { left: "100%", top: 0 },
  e: { left: "100%", top: "50%" },
  se: { left: "100%", top: "100%" },
  s: { left: "50%", top: "100%" },
  sw: { left: 0, top: "100%" },
  w: { left: 0, top: "50%" }
};
function BoxCanvas({
  boxes,
  size,
  selected,
  onSelect,
  onChange,
  onCreate,
  compact = false,
  interactive = true,
  budget: budgetProp,
  snap = true,
  lockAspect = false
}) {
  const wrapRef = (0, import_react.useRef)(null);
  const areaRef = (0, import_react.useRef)(null);
  const dragRef = (0, import_react.useRef)(null);
  const [draft, setDraft] = (0, import_react.useState)(null);
  const draftRef = (0, import_react.useRef)(null);
  const [guides, setGuides] = (0, import_react.useState)([]);
  const [available, setAvailable] = (0, import_react.useState)(0);
  const [marquee, setMarquee] = (0, import_react.useState)(null);
  const [drawing, setDrawing] = (0, import_react.useState)(null);
  const drawingRef = (0, import_react.useRef)(null);
  const marqueeRef = (0, import_react.useRef)(null);
  const lockAspectRef = (0, import_react.useRef)(lockAspect);
  lockAspectRef.current = lockAspect;
  const selection = Array.isArray(selected) ? selected.filter((index) => Number.isInteger(index) && index >= 0 && index < boxes.length) : Number.isInteger(selected) && selected >= 0 ? [selected] : [];
  (0, import_react.useEffect)(() => {
    const element = wrapRef.current;
    if (element === null || typeof ResizeObserver === "undefined") return void 0;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setAvailable(entry.contentRect.width);
    });
    observer.observe(element);
    setAvailable(element.clientWidth);
    return () => observer.disconnect();
  }, []);
  const pointOf = (0, import_react.useCallback)((event) => {
    const area = areaRef.current;
    if (area === null) return void 0;
    const rect = area.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return void 0;
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
      dx: (event.clientX - rect.left) / rect.width,
      dy: (event.clientY - rect.top) / rect.height
    };
  }, []);
  (0, import_react.useEffect)(() => {
    function onMove(event) {
      const drag = dragRef.current;
      if (drag === null) return;
      const point = pointOf(event);
      if (point === void 0) return;
      if (drag.kind === "draw") {
        const box = boxFromCorners(drag.from.x, drag.from.y, point.x, point.y);
        drawingRef.current = box;
        setDrawing(box);
        return;
      }
      if (drag.kind === "marquee") {
        const box = boxFromCorners(drag.from.x, drag.from.y, point.x, point.y);
        marqueeRef.current = box;
        setMarquee(box);
        return;
      }
      const dx = point.dx - drag.from.dx;
      const dy = point.dy - drag.from.dy;
      if (drag.kind === "move") {
        const moved = moveBoxes(drag.boxes, drag.indices, dx, dy);
        if (snap && drag.indices.length === 1) {
          const others = drag.boxes.filter((box, index) => index !== drag.indices[0] && box.hidden !== true);
          const result = snapBox(moved[drag.indices[0]], others);
          const next = [...moved];
          next[drag.indices[0]] = result.box;
          draftRef.current = next;
          setDraft(next);
          setGuides(result.guides);
        } else {
          draftRef.current = moved;
          setDraft(moved);
          setGuides([]);
        }
        return;
      }
      if (drag.kind === "resize") {
        const locked = event.shiftKey || lockAspectRef.current;
        const resized = resizeByHandle(drag.start, drag.handle, dx, dy, { lockAspect: locked });
        const next = [...drag.boxes];
        next[drag.index] = { ...drag.boxes[drag.index], ...resized };
        if (snap && !locked) {
          const others = drag.boxes.filter((box, index) => index !== drag.index && box.hidden !== true);
          const result = snapResized(next[drag.index], drag.handle, others);
          next[drag.index] = result.box;
          setGuides(result.guides);
        } else {
          setGuides([]);
        }
        draftRef.current = next;
        setDraft(next);
      }
    }
    function onUp(event) {
      const drag = dragRef.current;
      dragRef.current = null;
      const point = pointOf(event);
      if (drag !== null && drag.kind === "draw") {
        const box = point === void 0 ? drawingRef.current : boxFromCorners(drag.from.x, drag.from.y, point.x, point.y);
        drawingRef.current = null;
        setDrawing(null);
        const tiny = box === null || box.width <= MIN_SIZE * 1.5 && box.height <= MIN_SIZE * 1.5;
        if (tiny) {
          onSelect([]);
          return;
        }
        onCreate?.(box);
        return;
      }
      if (drag !== null && drag.kind === "marquee") {
        const region = point === void 0 ? marqueeRef.current : boxFromCorners(drag.from.x, drag.from.y, point.x, point.y);
        marqueeRef.current = null;
        setMarquee(null);
        if (region !== null) {
          const hits = boxes.map((box, index) => ({ box, index })).filter(({ box }) => box.x < region.x + region.width && box.x + box.width > region.x && box.y < region.y + region.height && box.y + box.height > region.y).map(({ index }) => index);
          onSelect(hits);
        }
        return;
      }
      const settled = draftRef.current;
      if (drag !== null && (drag.kind === "move" || drag.kind === "resize") && settled !== null) {
        onChange(settled);
      }
      draftRef.current = null;
      setDraft(null);
      setGuides([]);
    }
    function onCancel() {
      dragRef.current = null;
      draftRef.current = null;
      drawingRef.current = null;
      marqueeRef.current = null;
      setDraft(null);
      setDrawing(null);
      setMarquee(null);
      setGuides([]);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [boxes, onSelect, onChange, onCreate, pointOf, snap]);
  function beginDrag(event, kind, payload) {
    event.stopPropagation();
    event.preventDefault();
    const from = pointOf(event);
    if (from === void 0) return;
    dragRef.current = { kind, from, ...payload };
  }
  function onBoxPointerDown(event, index) {
    if (!interactive) return;
    if (event.button !== void 0 && event.button !== 0) return;
    const locked = boxes[index]?.locked === true;
    const additive = event.shiftKey || event.metaKey || event.ctrlKey;
    const nextSelection = additive ? selection.includes(index) ? selection.filter((item) => item !== index) : [...selection, index] : selection.includes(index) ? selection : [index];
    onSelect(nextSelection);
    if (locked || additive) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    const movable = nextSelection.filter((item) => boxes[item]?.locked !== true && (nextSelection.length === 1 || boxes[item]?.hidden !== true));
    if (movable.length === 0) {
      event.stopPropagation();
      return;
    }
    beginDrag(event, "move", { boxes, indices: movable });
  }
  function onHandlePointerDown(event, index, handle) {
    if (!interactive) return;
    if (boxes[index]?.locked === true) return;
    if (event.button !== void 0 && event.button !== 0) return;
    beginDrag(event, "resize", { boxes, index, start: boxes[index], handle });
  }
  function onAreaPointerDown(event) {
    if (!interactive) return;
    if (event.button !== void 0 && event.button !== 0) return;
    const marqueeMode = event.shiftKey;
    beginDrag(event, marqueeMode ? "marquee" : "draw", {});
    if (marqueeMode) {
      marqueeRef.current = { x: 0, y: 0, width: 0, height: 0 };
      setMarquee({ x: 0, y: 0, width: 0, height: 0 });
    }
  }
  const ratio = parseRatio(size);
  const budget = budgetProp ?? (compact ? COMPACT : TALL);
  const frame = frameSize(available, ratio, budget);
  const width = frame?.width;
  const height = frame?.height;
  const shown = draft ?? boxes;
  const bounds = selection.length > 1 ? selectionBounds(shown, selection) : void 0;
  const frameStyle = width !== void 0 ? { width, height, ...compact ? {} : { maxHeight: budget } } : { width: "100%", aspectRatio: String(ratio), maxHeight: budget };
  const toPercent = (value) => `${value * 100}%`;
  return /* @__PURE__ */ import_react.default.createElement("div", { ref: wrapRef, style: { display: "flex", justifyContent: "center", width: "100%" } }, /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      ref: areaRef,
      role: "group",
      "aria-label": t("editor.canvasLabel"),
      onPointerDown: onAreaPointerDown,
      style: {
        position: "relative",
        ...frameStyle,
        background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))",
        borderRadius: 8,
        border: "1px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.28))",
        overflow: "hidden",
        touchAction: "none",
        flexShrink: 0,
        cursor: interactive ? "crosshair" : "inherit",
        // A faint grid gives the eye something to align against while dragging.
        backgroundImage: interactive ? "linear-gradient(to right, rgba(127,127,127,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(127,127,127,0.14) 1px, transparent 1px)" : void 0,
        backgroundSize: interactive ? "10% 10%" : void 0
      }
    },
    shown.map((box, index) => {
      const active = selection.includes(index);
      const caption = box.type === "text" && (box.text ?? "").trim() !== "" ? box.text : box.desc ?? "";
      const metrics = width !== void 0 && height !== void 0 ? labelMetrics(box.width * width, box.height * height) : { show: false, fontSize: 0, lines: 0 };
      return /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          key: index,
          role: "button",
          tabIndex: interactive ? 0 : -1,
          "aria-pressed": active,
          "aria-label": t("editor.boxLabel", {
            index: index + 1,
            caption: caption.trim() !== "" ? caption : t("editor.noDesc"),
            flags: `${box.locked === true ? t("editor.lockedFlag") : ""}${box.hidden === true ? t("editor.hiddenFlag") : ""}`
          }),
          onFocus: () => {
            if (interactive && !active) onSelect([index]);
          },
          onKeyDown: (event) => {
            if (!interactive) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              const additive = event.shiftKey || event.metaKey || event.ctrlKey;
              onSelect(additive ? active ? selection.filter((item) => item !== index) : [...selection, index] : [index]);
            }
          },
          onPointerDown: (event) => onBoxPointerDown(event, index),
          style: {
            position: "absolute",
            left: toPercent(box.x),
            top: toPercent(box.y),
            width: toPercent(box.width),
            height: toPercent(box.height),
            border: `${active ? 2 : 1}px ${box.hidden === true ? "dashed" : "solid"} ${active ? "var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))" : box.hidden === true ? "rgba(190,190,190,0.4)" : "rgba(190,190,190,0.75)"}`,
            background: box.hidden === true ? "rgba(120,120,120,0.05)" : active ? selectionFill(16) : "rgba(160,160,160,0.09)",
            opacity: box.hidden === true ? 0.55 : 1,
            borderRadius: 4,
            cursor: interactive ? "move" : "inherit",
            boxSizing: "border-box",
            minWidth: `${MIN_SIZE * 100}%`,
            minHeight: `${MIN_SIZE * 100}%`
          }
        },
        metrics.show && caption.trim() !== "" ? /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              position: "absolute",
              top: 15,
              left: 4,
              right: 4,
              bottom: 4,
              fontSize: metrics.fontSize,
              lineHeight: 1.35,
              overflow: "hidden",
              color: "var(--dsw-alias-label-primary, inherit)",
              opacity: 0.85,
              pointerEvents: "none",
              wordBreak: "break-word"
            }
          },
          caption
        ) : null,
        /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            style: {
              position: "absolute",
              top: 1,
              left: 1,
              minWidth: 14,
              padding: "0 3px",
              fontSize: 9,
              lineHeight: "13px",
              textAlign: "center",
              borderRadius: 3,
              background: active ? "var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))" : "rgba(40,42,40,0.85)",
              color: active ? "var(--dsw-alias-label-primary-inverted, #0d120f)" : "#ddd",
              pointerEvents: "none"
            }
          },
          index + 1,
          box.locked === true ? " \xB7 L" : ""
        ),
        interactive && active && selection.length === 1 && box.locked !== true ? HANDLES.map((handle) => /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            key: handle,
            onPointerDown: (event) => onHandlePointerDown(event, index, handle),
            role: "presentation",
            style: {
              position: "absolute",
              ...HANDLE_POSITION[handle],
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              // Centre every handle on its corner or edge midpoint.
              marginLeft: -HANDLE_SIZE / 2,
              marginTop: -HANDLE_SIZE / 2,
              background: "var(--dsw-alias-bg-overlay, #fff)",
              border: "1px solid var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))",
              borderRadius: 2,
              cursor: HANDLE_CURSOR[handle],
              boxSizing: "border-box"
            }
          }
        )) : null
      );
    }),
    bounds !== void 0 ? /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          position: "absolute",
          left: toPercent(bounds.x),
          top: toPercent(bounds.y),
          width: toPercent(bounds.width),
          height: toPercent(bounds.height),
          border: "1px dashed var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))",
          pointerEvents: "none",
          borderRadius: 2
        }
      }
    ) : null,
    guides.map((guide, index) => /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        key: `${guide.axis}-${index}`,
        style: {
          position: "absolute",
          pointerEvents: "none",
          background: "var(--dsw-alias-state-business-primary, #2f6fed)",
          ...guide.axis === "x" ? { left: toPercent(guide.at), top: 0, bottom: 0, width: 1 } : { top: toPercent(guide.at), left: 0, right: 0, height: 1 }
        }
      }
    )),
    drawing !== null ? /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          position: "absolute",
          left: toPercent(drawing.x),
          top: toPercent(drawing.y),
          width: toPercent(drawing.width),
          height: toPercent(drawing.height),
          border: "1px dashed var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))",
          background: selectionFill(10),
          pointerEvents: "none",
          borderRadius: 2
        }
      }
    ) : null,
    marquee !== null ? /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          position: "absolute",
          left: toPercent(marquee.x),
          top: toPercent(marquee.y),
          width: toPercent(marquee.width),
          height: toPercent(marquee.height),
          border: "1px solid var(--dsw-alias-state-business-primary, #2f6fed)",
          background: "rgba(47,111,237,0.12)",
          pointerEvents: "none"
        }
      }
    ) : null,
    boxes.length === 0 && !interactive ? /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 12, opacity: 0.55 } }, t("preview.empty")) : null,
    interactive && boxes.length === 0 && drawing === null ? /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontSize: 11,
          opacity: 0.5,
          pointerEvents: "none",
          padding: 12,
          textAlign: "center",
          lineHeight: 1.6
        }
      },
      t("editor.drawHint")
    ) : null
  ));
}

// src/BoxEditor.jsx
var import_react6 = __toESM(require("react"), 1);

// src/icons.jsx
var import_react2 = __toESM(require("react"), 1);
var PATHS = {
  "person": "M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z",
  "lock": "M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z",
  "lock_open": "M240-640h360v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85h-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640Zm0 480h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM240-160v-400 400Z",
  "visibility": "M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z",
  "visibility_off": "m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z",
  "history": "M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z",
  "undo": "M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z",
  "redo": "M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z",
  "aspect_ratio": "M560-280h200v-200h-80v120H560v80ZM200-480h80v-120h120v-80H200v200Zm-40 320q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z",
  "content_copy": "M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z",
  "align_horizontal_left": "M80-80v-800h80v800H80Zm160-200v-120h400v120H240Zm0-280v-120h640v120H240Z",
  "align_horizontal_center": "M440-80v-200H240v-120h200v-160H120v-120h320v-200h80v200h320v120H520v160h200v120H520v200h-80Z",
  "align_horizontal_right": "M800-80v-800h80v800h-80ZM320-280v-120h400v120H320ZM80-560v-120h640v120H80Z",
  "align_vertical_top": "M280-80v-640h120v640H280Zm280-240v-400h120v400H560ZM80-800v-80h800v80H80Z",
  "align_vertical_center": "M280-120v-320H80v-80h200v-320h120v320h160v-200h120v200h200v80H680v200H560v-200H400v320H280Z",
  "align_vertical_bottom": "M80-80v-80h800v80H80Zm200-160v-640h120v640H280Zm280 0v-400h120v400H560Z",
  "distribute_horizontal": "M120-760h100v560H120v-560Zm310 0h100v560H430v-560Zm310 0h100v560H740v-560Z",
  "distribute_vertical": "M200-760h560v100H200v-100Zm0 280h560v100H200v-100Zm0 280h560v100H200v-100Z",
  "close": "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z",
  "zoom_in": "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z",
  "zoom_out": "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM280-540v-80h200v80H280Z",
  "fit_screen": "M800-600v-120H680v-80h120q33 0 56.5 23.5T880-720v120h-80Zm-720 0v-120q0-33 23.5-56.5T160-800h120v80H160v120H80Zm600 440v-80h120v-120h80v120q0 33-23.5 56.5T800-160H680Zm-520 0q-33 0-56.5-23.5T80-240v-120h80v120h120v80H160Zm80-160v-320h480v320H240Zm80-80h320v-160H320v160Zm0 0v-160 160Z",
  "add_box": "M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z",
  "delete": "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z",
  "download": "M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z",
  "refresh": "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z",
  "dashboard_customize": "M120-840h320v320H120v-320Zm80 80v160-160Zm320-80h320v320H520v-320Zm80 80v160-160ZM120-440h320v320H120v-320Zm80 80v160-160Zm440-80h80v120h120v80H720v120h-80v-120H520v-80h120v-120Zm-40-320v160h160v-160H600Zm-400 0v160h160v-160H200Zm0 400v160h160v-160H200Z",
  "unfold_less": "m356-160-56-56 180-180 180 180-56 56-124-124-124 124Zm124-404L300-744l56-56 124 124 124-124 56 56-180 180Z",
  "unfold_more": "M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z",
  "keyboard_arrow_up": "M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z",
  "keyboard_arrow_left": "M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z",
  "keyboard_arrow_right": "M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z",
  "keyboard_arrow_down": "M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z",
  "settings_backup_restore": "M480-400q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0 280q-139 0-241-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Z",
  "add": "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
  "check": "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z",
  "check_box": "m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z",
  "check_box_outline_blank": "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z",
  "push_pin": "m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z",
  "settings": "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z",
  "keep_off": "M680-840v80h-40v327l-80-80v-247H400v87l-87-87-33-33v-47h400ZM480-40l-40-40v-240H240v-80l80-80v-46L56-792l56-56 736 736-58 56-264-264h-6v240l-40 40ZM354-400h92l-44-44-2-2-46 46Zm126-193Zm-78 149Z",
  "archive": "m480-240 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160ZM200-640v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z",
  "unarchive": "M480-560 320-400l56 56 64-64v168h80v-168l64 64 56-56-160-160Zm-280-80v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z",
  "drag_indicator": "M120-600v-80h720v80H120Zm0 200v-80h720v80H120Zm0 200v-80h720v80H120Z"
};
function Icon({ name, size = 16, style }) {
  const d = PATHS[name];
  if (d === void 0) return null;
  return /* @__PURE__ */ import_react2.default.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 -960 960 960",
      width: size,
      height: size,
      fill: "currentColor",
      "aria-hidden": "true",
      focusable: "false",
      style: { display: "block", flexShrink: 0, ...style }
    },
    /* @__PURE__ */ import_react2.default.createElement("path", { d })
  );
}
var ICON_NAMES = Object.keys(PATHS);

// src/IconCheckbox.jsx
var import_react3 = __toESM(require("react"), 1);
function IconCheckbox({ checked, onChange, label: label2, disabled = false, title, style }) {
  const [focused, setFocused] = (0, import_react3.useState)(false);
  return /* @__PURE__ */ import_react3.default.createElement(
    "label",
    {
      title,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        position: "relative",
        ...style
      }
    },
    /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "checkbox",
        checked,
        disabled,
        onChange,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        style: {
          position: "absolute",
          width: 1,
          height: 1,
          margin: 0,
          padding: 0,
          opacity: 0,
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ import_react3.default.createElement(
      "span",
      {
        "aria-hidden": "true",
        style: {
          display: "inline-flex",
          borderRadius: 4,
          outline: focused ? "2px solid var(--dsw-alias-brand-primary, rgba(120,190,145,0.9))" : "none",
          outlineOffset: 1,
          color: checked ? "var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))" : "var(--dsw-alias-label-secondary, rgba(127,127,127,0.9))"
        }
      },
      /* @__PURE__ */ import_react3.default.createElement(Icon, { name: checked ? "check_box" : "check_box_outline_blank", size: 16 })
    ),
    label2 === void 0 ? null : /* @__PURE__ */ import_react3.default.createElement("span", { style: { fontSize: 11 } }, label2)
  );
}

// src/ScopeStyles.jsx
var import_react4 = __toESM(require("react"), 1);
function ScopeStyles() {
  return /* @__PURE__ */ import_react4.default.createElement("style", null, `
/* The host paints a 2px :focus-visible outline on every focused element and
   keeps it for read-write fields. Combined with a field's own ring that reads
   as two concentric borders, and on a container it boxes the whole row. The
   studio therefore draws exactly one indicator: the field's own ring. */
/* Padding must never add to a stated height: a box with height 100% and padding
   otherwise overflows its slot by exactly the padding, which clipped the result
   picture at the bottom of a short strip. */
.moss-studio,
.moss-studio *,
.moss-studio *::before,
.moss-studio *::after {
  box-sizing: border-box;
}

.moss-studio:focus,
.moss-studio:focus-visible,
.moss-studio *:focus,
.moss-studio *:focus-visible,
.moss-studio *:focus-within,
.moss-studio *:has(:focus-visible) {
  outline: none !important;
}

/* Fields show a soft ring hugging their border, nothing else. */
.moss-studio input:focus,
.moss-studio textarea:focus,
.moss-studio select:focus,
.moss-studio input:focus-visible,
.moss-studio textarea:focus-visible,
.moss-studio select:focus-visible {
  outline: none !important;
  border-color: var(--dsw-alias-state-business-primary, #2f6fed);
  box-shadow: 0 0 0 2px rgba(47, 111, 237, 0.35);
}

/* Native spinners render as a dark box against the dark theme and sit where
   the caret wants to be; the fields are typed into, not stepped by hand. */
.moss-studio input[type=number]::-webkit-outer-spin-button,
.moss-studio input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.moss-studio input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.moss-studio button:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(47, 111, 237, 0.35);
}

/* Layout boxes and list rows are keyboard controls too. */
.moss-studio [role="button"]:focus-visible,
.moss-studio [role="listitem"]:focus-visible,
.moss-studio [role="group"][data-box-index]:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(47, 111, 237, 0.55);
}
`);
}

// src/useDialogFocus.js
var import_react5 = require("react");
var FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function useDialogFocus(containerRef, options = {}) {
  const ready = options.ready !== false;
  const previousRef = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    const container = containerRef.current;
    if (container === null) return void 0;
    if (previousRef.current === null && typeof document !== "undefined") previousRef.current = document.activeElement;
    const preferred = options.initialFocus?.current;
    const target = ready && preferred?.matches?.(FOCUSABLE) === true ? preferred : container.querySelector(FOCUSABLE) ?? container;
    target.focus?.();
    function onKey(event) {
      if (event.key !== "Tab") return;
      const items = [...container.querySelectorAll(FOCUSABLE) ?? []].filter((node) => node.offsetParent !== null || node === document.activeElement);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    container.addEventListener("keydown", onKey);
    return () => {
      container.removeEventListener("keydown", onKey);
    };
  }, [containerRef, options.initialFocus, ready]);
  (0, import_react5.useEffect)(() => () => {
    if (previousRef.current !== null && typeof previousRef.current.focus === "function") previousRef.current.focus();
  }, []);
}

// src/BoxEditor.jsx
var row = { display: "flex", alignItems: "center", gap: 6 };
var dim = { color: "var(--dsw-alias-label-secondary, inherit)" };
var input = {
  flex: 1,
  minWidth: 0,
  boxSizing: "border-box",
  padding: "4px 6px",
  fontSize: 12,
  color: "inherit",
  background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))",
  border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
  borderRadius: 6,
  fontFamily: "inherit"
};
var button = {
  padding: "4px 10px",
  fontSize: 12,
  color: "inherit",
  background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))",
  border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
  borderRadius: 6,
  cursor: "pointer"
};
var iconButton = { ...button, padding: "2px 8px", fontSize: 11 };
var iconOnly = {
  ...button,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  padding: 0
};
var iconDanger = { ...iconOnly, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" };
var disabledLook = { opacity: 0.4, cursor: "default" };
var optionStyle = { background: "var(--dsw-alias-bg-overlay, #26282a)", color: "var(--dsw-alias-label-primary, inherit)" };
var numberInput = { ...input, flex: "0 0 auto", width: 56, textAlign: "right", padding: "3px 5px" };
var HANDLE_HISTORY = 60;
var COALESCE_MS = 500;
var GEOMETRY_KEYS = /* @__PURE__ */ new Set(["x", "y", "width", "height"]);
function geometryTargets(boxes, selection) {
  return selection.filter((index) => {
    const box = boxes[index];
    if (box === void 0 || box.locked === true) return false;
    return selection.length === 1 || box.hidden !== true;
  });
}
var EMPTY_BOXES = [];
function toSet(value) {
  return new Set((String(value ?? "").match(/\d+/g) ?? []).map(Number));
}
function toText(set) {
  return [...set].sort((a, b) => a - b).join(",");
}
function geometryOnly(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return void 0;
  const { x, y, width, height } = value;
  return [x, y, width, height].every(Number.isFinite) ? { x, y, width, height } : void 0;
}
function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}
function layoutKey(boxes, characters) {
  return JSON.stringify([stableValue(boxes), characters]);
}
function BoxEditor({ params, onApply, onAdd, onClose, onCancel }) {
  const boxes = params.boxes ?? EMPTY_BOXES;
  const characterBoxes = params.characterBoxes ?? "";
  const characters = (0, import_react6.useMemo)(() => toSet(characterBoxes), [characterBoxes]);
  const incomingLayoutKey = layoutKey(boxes, characterBoxes);
  const viewportHeight = typeof window === "undefined" ? 0 : window.innerHeight;
  const budget = Number.isFinite(viewportHeight) ? Math.min(560, Math.max(260, Math.round(viewportHeight * 0.58))) : 520;
  const [selection, setSelection] = (0, import_react6.useState)([]);
  const [draggingIndex, setDraggingIndex] = (0, import_react6.useState)(null);
  const [dropTarget, setDropTarget] = (0, import_react6.useState)(null);
  const [lockAspect, setLockAspect] = (0, import_react6.useState)(false);
  const [notice, setNotice] = (0, import_react6.useState)("");
  const charactersRef = (0, import_react6.useRef)(characterBoxes);
  const baselineKeyRef = (0, import_react6.useRef)(incomingLayoutKey);
  const localDirtyRef = (0, import_react6.useRef)(false);
  const pendingLayoutKeyRef = (0, import_react6.useRef)(null);
  const [history, setHistory] = (0, import_react6.useState)(() => ({
    stack: [{ boxes, characters: characterBoxes }],
    index: 0
  }));
  const lastCommitRef = (0, import_react6.useRef)(0);
  const lastCoalesceKeyRef = (0, import_react6.useRef)(null);
  const resetCoalesce = (0, import_react6.useCallback)(() => {
    lastCommitRef.current = 0;
    lastCoalesceKeyRef.current = null;
  }, []);
  (0, import_react6.useEffect)(() => {
    if (localDirtyRef.current && incomingLayoutKey === pendingLayoutKeyRef.current) {
      localDirtyRef.current = false;
      pendingLayoutKeyRef.current = null;
      baselineKeyRef.current = incomingLayoutKey;
      charactersRef.current = characterBoxes;
      return;
    }
    if (incomingLayoutKey === baselineKeyRef.current) return;
    const hadLocalEdits = localDirtyRef.current;
    baselineKeyRef.current = incomingLayoutKey;
    localDirtyRef.current = false;
    pendingLayoutKeyRef.current = null;
    charactersRef.current = characterBoxes;
    resetCoalesce();
    setSelection([]);
    setHistory({ stack: [{ boxes, characters: characterBoxes }], index: 0 });
    if (hadLocalEdits) setNotice(t("notice.draftSyncedFromAi"));
  }, [baselineKeyRef, boxes, characterBoxes, incomingLayoutKey, localDirtyRef, pendingLayoutKeyRef, resetCoalesce]);
  const pushHistory = (0, import_react6.useCallback)((snapshot, coalesce) => {
    setHistory((current) => {
      const stack = current.stack.slice(0, current.index + 1);
      if (coalesce === true && stack.length > 1) stack[stack.length - 1] = snapshot;
      else stack.push(snapshot);
      while (stack.length > HANDLE_HISTORY) stack.shift();
      return { stack, index: stack.length - 1 };
    });
  }, []);
  const charactersAfter = (0, import_react6.useCallback)((removed) => {
    const set = toSet(charactersRef.current);
    const kept = /* @__PURE__ */ new Set();
    for (const value of set) {
      if (removed.has(value - 1)) continue;
      let shift = 0;
      for (const index of removed) if (index < value - 1) shift += 1;
      kept.add(value - shift);
    }
    return toText(kept);
  }, []);
  const applySnapshot = (0, import_react6.useCallback)((snapshot) => {
    resetCoalesce();
    charactersRef.current = snapshot.characters;
    const key = layoutKey(snapshot.boxes, snapshot.characters);
    localDirtyRef.current = key !== baselineKeyRef.current;
    pendingLayoutKeyRef.current = localDirtyRef.current ? key : null;
    onApply(snapshot.boxes, snapshot.characters);
  }, [onApply, resetCoalesce]);
  const commit = (0, import_react6.useCallback)((nextBoxes, options = {}) => {
    const now = Date.now();
    const key = options.coalesceKey;
    const eligible = options.coalesce === true && typeof key === "string" && key !== "";
    const coalesce = eligible && now - lastCommitRef.current < COALESCE_MS && lastCoalesceKeyRef.current === key;
    lastCommitRef.current = now;
    lastCoalesceKeyRef.current = eligible ? key : null;
    const characters2 = options.characters ?? charactersRef.current;
    charactersRef.current = characters2;
    const layout = layoutKey(nextBoxes, characters2);
    localDirtyRef.current = layout !== baselineKeyRef.current;
    pendingLayoutKeyRef.current = localDirtyRef.current ? layout : null;
    onApply(nextBoxes, characters2);
    pushHistory({ boxes: nextBoxes, characters: characters2 }, coalesce);
  }, [onApply, pushHistory]);
  const undo = (0, import_react6.useCallback)(() => {
    const index = history.index - 1;
    if (index < 0) return;
    applySnapshot(history.stack[index]);
    setHistory((current) => ({ ...current, index }));
  }, [applySnapshot, history]);
  const redo = (0, import_react6.useCallback)(() => {
    const index = history.index + 1;
    if (index >= history.stack.length) return;
    applySnapshot(history.stack[index]);
    setHistory((current) => ({ ...current, index }));
  }, [applySnapshot, history]);
  const primaryIndex = selection.length > 0 ? selection[selection.length - 1] : -1;
  const primary3 = boxes[primaryIndex];
  const allLocked = selection.length > 0 && selection.every((index) => boxes[index]?.locked === true);
  const allHidden = selection.length > 0 && selection.every((index) => boxes[index]?.hidden === true);
  const movable = geometryTargets(boxes, selection);
  const incomplete = boxes.filter((box) => box.hidden !== true && boxProblem(box) !== void 0).length;
  (0, import_react6.useEffect)(() => {
    setSelection((current) => current.filter((index) => index < boxes.length));
  }, [boxes.length]);
  const remove = (0, import_react6.useCallback)((indices) => {
    const removed = new Set(indices);
    if (removed.size === 0) return;
    const next = boxes.filter((_, index) => !removed.has(index));
    commit(next, { characters: charactersAfter(removed) });
    setSelection([]);
  }, [boxes, charactersAfter, commit]);
  const duplicate = (0, import_react6.useCallback)(() => {
    const indices = [...new Set(selection.filter((index) => Number.isInteger(index) && index >= 0 && index < boxes.length))];
    if (indices.length === 0) return;
    if (boxes.length + indices.length > MAX_BOXES) {
      setNotice(t("editor.limit", { max: MAX_BOXES }));
      return;
    }
    setNotice("");
    const result = duplicateBoxes(boxes, indices);
    commit(result.boxes);
    setSelection(result.added);
  }, [boxes, commit, selection]);
  const selectAll = (0, import_react6.useCallback)(() => setSelection(boxes.map((_, index) => index)), [boxes]);
  const reorder = (0, import_react6.useCallback)((from, to) => {
    if (from === to || !Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= boxes.length || to >= boxes.length) return;
    const result = reorderLayout(boxes, charactersRef.current, from, to);
    commit(result.boxes, { characters: result.characters });
    setSelection((current) => [...new Set(current.map((index) => indexAfterReorder(index, from, to)))].sort((a, b) => a - b));
    setDraggingIndex(null);
    setDropTarget(null);
  }, [boxes, commit]);
  const record = (0, import_react6.useCallback)((result) => {
    resetCoalesce();
    if (result === void 0 || result === null || !Array.isArray(result.boxes)) return;
    const characters2 = result.characters ?? charactersRef.current;
    charactersRef.current = characters2;
    const key = layoutKey(result.boxes, characters2);
    localDirtyRef.current = key !== baselineKeyRef.current;
    pendingLayoutKeyRef.current = localDirtyRef.current ? key : null;
    pushHistory({ boxes: result.boxes, characters: characters2 }, false);
    if (typeof result.index === "number" && result.index >= 0) setSelection([result.index]);
  }, [pushHistory, resetCoalesce]);
  const addAt = (0, import_react6.useCallback)((geometry) => {
    if (boxes.length >= MAX_BOXES) {
      setNotice(t("editor.limit", { max: MAX_BOXES }));
      return;
    }
    setNotice("");
    record(onAdd?.(geometryOnly(geometry)));
  }, [boxes.length, onAdd, record]);
  const nudge = (0, import_react6.useCallback)((dx, dy) => {
    if (movable.length === 0) return;
    const axis = dx === 0 ? "y" : "x";
    commit(moveBoxes(boxes, movable, dx, dy), {
      coalesce: true,
      coalesceKey: `nudge:${movable.join(",")}:${axis}`
    });
  }, [boxes, commit, movable]);
  const move = (0, import_react6.useCallback)((mode) => {
    if (movable.length === 0) return;
    commit(alignBoxes(boxes, movable, mode));
  }, [boxes, commit, movable]);
  const spread = (0, import_react6.useCallback)((axis) => {
    if (movable.length < 3) return;
    commit(distributeBoxes(boxes, movable, axis));
  }, [boxes, commit, movable]);
  const patchBox = (0, import_react6.useCallback)((index, patch, options = {}) => {
    const current = boxes[index];
    if (current === void 0) return;
    const safePatch = current.locked === true ? Object.fromEntries(Object.entries(patch).filter(([key]) => !GEOMETRY_KEYS.has(key))) : patch;
    if (Object.keys(safePatch).length === 0) return;
    const next = boxes.map((box, position) => position === index ? updateBoxGeometry({ ...box, ...safePatch }, safePatch) : { ...box, locked: box.locked === true, hidden: box.hidden === true });
    commit(next, options.coalesceKey === void 0 ? options : { ...options, coalesce: true });
  }, [boxes, commit]);
  const setFlagFor = (0, import_react6.useCallback)((key, value) => {
    commit(boxes.map((box, index) => selection.includes(index) ? { ...box, [key]: value } : box));
  }, [boxes, commit, selection]);
  const toggleCharacter = (0, import_react6.useCallback)((indices) => {
    const set = toSet(charactersRef.current);
    const list = Array.isArray(indices) ? indices : [indices];
    const allMarked = list.length > 0 && list.every((index) => set.has(index + 1));
    for (const index of list) {
      if (allMarked) set.delete(index + 1);
      else set.add(index + 1);
    }
    commit(boxes, { characters: toText(set) });
  }, [boxes, commit]);
  const cycle = (0, import_react6.useCallback)((direction) => {
    if (boxes.length === 0) return;
    const current = primaryIndex;
    const next = current < 0 ? direction > 0 ? 0 : boxes.length - 1 : (current + direction + boxes.length) % boxes.length;
    setSelection([next]);
  }, [boxes.length, primaryIndex]);
  (0, import_react6.useEffect)(() => {
    function onKey(event) {
      const target = event.target;
      const tag = target?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable === true;
      const nativeControl = target?.closest?.("button, a[href], input, textarea, select") != null;
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key;
      if (key === "Escape") {
        if (selection.length > 0) {
          event.preventDefault();
          setSelection([]);
        } else {
          onCancel?.();
        }
        return;
      }
      if (typing) return;
      if (mod && (key === "z" || key === "Z")) {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && (key === "y" || key === "Y")) {
        event.preventDefault();
        redo();
        return;
      }
      if (mod && (key === "a" || key === "A")) {
        event.preventDefault();
        selectAll();
        return;
      }
      if (mod && (key === "d" || key === "D")) {
        event.preventDefault();
        duplicate();
        return;
      }
      if ((key === "Delete" || key === "Backspace") && !nativeControl) {
        event.preventDefault();
        remove(selection);
        return;
      }
      if (key === "[" || key === "]") {
        event.preventDefault();
        cycle(key === "]" ? 1 : -1);
        return;
      }
      if (typing || nativeControl) return;
      const step = event.shiftKey ? 0.1 : 0.01;
      const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      const delta = moves[key];
      if (delta === void 0) return;
      event.preventDefault();
      nudge(delta[0], delta[1]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle, duplicate, nudge, onCancel, redo, remove, selectAll, selection, undo]);
  const titleId = (0, import_react6.useId)();
  const cardRef = (0, import_react6.useRef)(null);
  useDialogFocus(cardRef);
  const canUndo = history.index > 0;
  const canRedo = history.index < history.stack.length - 1;
  const alignButtons = [
    ["left", "editor.alignLeft", "align_horizontal_left"],
    ["centerX", "editor.alignCenter", "align_horizontal_center"],
    ["right", "editor.alignRight", "align_horizontal_right"],
    ["top", "editor.alignTop", "align_vertical_top"],
    ["middleY", "editor.alignMiddle", "align_vertical_center"],
    ["bottom", "editor.alignBottom", "align_vertical_bottom"]
  ];
  return /* @__PURE__ */ import_react6.default.createElement(
    "div",
    {
      className: "moss-studio",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(0,0,0,0.62)",
        display: "grid",
        placeItems: "center",
        padding: 24
      },
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) onClose();
      }
    },
    /* @__PURE__ */ import_react6.default.createElement(ScopeStyles, null),
    /* @__PURE__ */ import_react6.default.createElement(
      "div",
      {
        ref: cardRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        style: {
          display: "flex",
          flexDirection: "column",
          width: "min(92vw, 1040px)",
          height: "min(88vh, 760px)",
          background: "var(--dsw-alias-bg-overlay, Canvas)",
          color: "var(--dsw-alias-label-primary, CanvasText)",
          border: "1px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.28))",
          borderRadius: 12,
          boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          overflow: "hidden",
          fontSize: 12
        }
      },
      /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...row, justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))" } }, /* @__PURE__ */ import_react6.default.createElement("span", { id: titleId, style: { fontSize: 13 } }, t("editor.title", { count: boxes.length, size: params.size })), /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...row } }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: canUndo ? iconOnly : { ...iconOnly, ...disabledLook }, disabled: !canUndo, title: t("editor.undo"), "aria-label": t("editor.undo"), onClick: undo }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "undo" })), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: canRedo ? iconOnly : { ...iconOnly, ...disabledLook }, disabled: !canRedo, title: t("editor.redo"), "aria-label": t("editor.redo"), onClick: redo }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "redo" })), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: iconOnly, title: t("editor.addBoxTitle"), "aria-label": t("editor.addBox"), onClick: () => addAt() }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "add_box" })), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: iconOnly, title: t("action.done"), "aria-label": t("action.done"), onClick: onClose }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "check" })), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: iconOnly, onClick: onCancel, "aria-label": t("action.cancel"), title: t("editor.cancelTitle") }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "close" })))),
      notice !== "" ? /* @__PURE__ */ import_react6.default.createElement("div", { style: { padding: "4px 12px", fontSize: 11, color: "var(--dsw-alias-state-error-primary, #ff8f7a)", borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))" } }, notice) : null,
      /* @__PURE__ */ import_react6.default.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } }, /* @__PURE__ */ import_react6.default.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 12, background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))" } }, /* @__PURE__ */ import_react6.default.createElement(
        BoxCanvas,
        {
          boxes,
          size: params.size,
          budget,
          selected: selection,
          lockAspect,
          onSelect: setSelection,
          onChange: (next) => commit(next),
          onCreate: addAt
        }
      )), /* @__PURE__ */ import_react6.default.createElement("div", { style: { width: 320, flexShrink: 0, borderLeft: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))", overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 6 } }, incomplete > 0 ? /* @__PURE__ */ import_react6.default.createElement("div", { style: { fontSize: 11, color: "var(--dsw-alias-state-error-primary, #ff8f7a)", padding: "2px 4px" } }, t("editor.incomplete", { count: incomplete })) : null, selection.length > 1 ? /* @__PURE__ */ import_react6.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, padding: 8, borderRadius: 8, border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))", background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.08))" } }, /* @__PURE__ */ import_react6.default.createElement("span", { style: { fontSize: 11, ...dim } }, t("editor.selectionCount", { count: selection.length })), /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...row, flexWrap: "wrap", gap: 4 } }, alignButtons.map(([mode, key, icon]) => /* @__PURE__ */ import_react6.default.createElement("button", { key: mode, type: "button", disabled: movable.length < 2, style: movable.length < 2 ? { ...iconButton, ...disabledLook } : iconButton, title: t(key), "aria-label": t(key), onClick: () => move(mode) }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: icon, size: 14 })))), /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...row, gap: 4 } }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", disabled: movable.length < 3, style: movable.length < 3 ? { ...iconButton, ...disabledLook } : iconButton, title: t("editor.distributeX"), "aria-label": t("editor.distributeX"), onClick: () => spread("x") }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "distribute_horizontal", size: 14 })), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", disabled: movable.length < 3, style: movable.length < 3 ? { ...iconButton, ...disabledLook } : iconButton, title: t("editor.distributeY"), "aria-label": t("editor.distributeY"), onClick: () => spread("y") }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "distribute_vertical", size: 14 })), /* @__PURE__ */ import_react6.default.createElement(
        "button",
        {
          type: "button",
          style: allLocked ? iconOnly : { ...iconOnly, opacity: 0.6 },
          title: allLocked ? t("editor.unlockSelected") : t("editor.lockSelected"),
          "aria-label": allLocked ? t("editor.unlockSelected") : t("editor.lockSelected"),
          "aria-pressed": allLocked,
          onClick: () => setFlagFor("locked", !allLocked)
        },
        /* @__PURE__ */ import_react6.default.createElement(Icon, { name: allLocked ? "lock" : "lock_open", size: 14 })
      ), /* @__PURE__ */ import_react6.default.createElement(
        "button",
        {
          type: "button",
          style: allHidden ? iconOnly : { ...iconOnly, opacity: 0.6 },
          title: allHidden ? t("editor.showSelected") : t("editor.hideSelected"),
          "aria-label": allHidden ? t("editor.showSelected") : t("editor.hideSelected"),
          "aria-pressed": allHidden,
          onClick: () => setFlagFor("hidden", !allHidden)
        },
        /* @__PURE__ */ import_react6.default.createElement(Icon, { name: allHidden ? "visibility_off" : "visibility", size: 14 })
      ), /* @__PURE__ */ import_react6.default.createElement(
        "button",
        {
          type: "button",
          style: iconOnly,
          title: t("editor.markPeople"),
          "aria-label": t("editor.markPeople"),
          onClick: () => toggleCharacter(selection)
        },
        /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "person", size: 14 })
      ), /* @__PURE__ */ import_react6.default.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: iconOnly, title: t("editor.duplicate"), "aria-label": t("editor.duplicate"), onClick: duplicate }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "content_copy", size: 14 })), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: iconDanger, title: t("editor.deleteSelected"), "aria-label": t("editor.deleteSelected"), onClick: () => remove(selection) }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "delete", size: 14 })))) : null, primary3 !== void 0 ? /* @__PURE__ */ import_react6.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, padding: 8, borderRadius: 8, border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))" } }, primary3.locked === true ? /* @__PURE__ */ import_react6.default.createElement("span", { style: { fontSize: 11, ...dim } }, t("editor.lock")) : null, /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...row, justifyContent: "space-between" } }, /* @__PURE__ */ import_react6.default.createElement("span", { style: { fontSize: 11, ...dim } }, t("editor.geometry")), /* @__PURE__ */ import_react6.default.createElement(
        "button",
        {
          type: "button",
          style: lockAspect ? { ...iconButton, borderColor: "var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))" } : iconButton,
          title: t("editor.lockAspect"),
          "aria-label": t("editor.lockAspect"),
          "aria-pressed": lockAspect,
          onClick: () => setLockAspect((value) => !value)
        },
        /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "aspect_ratio", size: 14 })
      )), /* @__PURE__ */ import_react6.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, [
        ["x", "editor.x", primary3.x * 100],
        ["y", "editor.y", primary3.y * 100],
        ["width", "editor.width", primary3.width * 100],
        ["height", "editor.height", primary3.height * 100]
      ].map(([field, key, value]) => /* @__PURE__ */ import_react6.default.createElement("label", { key: field, style: { ...row, gap: 4 } }, /* @__PURE__ */ import_react6.default.createElement("span", { style: { ...dim, fontSize: 11, width: 14 } }, t(key)), /* @__PURE__ */ import_react6.default.createElement(
        "input",
        {
          type: "number",
          min: 0,
          max: 100,
          step: 1,
          disabled: primary3.locked === true,
          value: Math.round(value * 10) / 10,
          "aria-label": t(key),
          onChange: (event) => {
            const next = event.target.value === "" ? 0 : Number(event.target.value);
            if (!Number.isFinite(next)) return;
            const patch = lockAspect && (field === "width" || field === "height") ? aspectSizePatch(primary3, field, next / 100) : { [field]: next / 100 };
            patchBox(primaryIndex, patch, { coalesceKey: `box:${primaryIndex}:${field}` });
          },
          style: primary3.locked === true ? { ...numberInput, ...disabledLook } : numberInput
        }
      )))), /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...row } }, /* @__PURE__ */ import_react6.default.createElement(
        "select",
        {
          value: primary3.type ?? "obj",
          onChange: (event) => patchBox(primaryIndex, { type: event.target.value }),
          style: { ...input, flex: "0 0 64px", padding: "2px 2px" },
          "aria-label": t("editor.kind")
        },
        /* @__PURE__ */ import_react6.default.createElement("option", { value: "obj", style: optionStyle }, "obj"),
        /* @__PURE__ */ import_react6.default.createElement("option", { value: "text", style: optionStyle }, "text")
      ), /* @__PURE__ */ import_react6.default.createElement(
        IconCheckbox,
        {
          checked: characters.has(primaryIndex + 1),
          onChange: () => toggleCharacter(primaryIndex),
          label: t("editor.kindPerson")
        }
      ), /* @__PURE__ */ import_react6.default.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: iconOnly, title: t("editor.duplicate"), "aria-label": t("editor.duplicate"), onClick: duplicate }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "content_copy", size: 14 })), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", style: iconDanger, title: t("editor.deleteBoxTitle"), "aria-label": t("editor.deleteBox"), onClick: () => remove([primaryIndex]) }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "delete", size: 14 })))) : /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...dim, fontSize: 11, lineHeight: 1.6, padding: 4 } }, t("editor.drawHint"), /* @__PURE__ */ import_react6.default.createElement("div", { style: { marginTop: 4 } }, t("editor.keyboardHint"))), boxes.length === 0 ? /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...dim, padding: 8, lineHeight: 1.6 } }, t("editor.empty")) : null, /* @__PURE__ */ import_react6.default.createElement("div", { role: "list", "aria-label": t("editor.boxListLabel"), style: { display: "flex", flexDirection: "column", gap: 4 } }, boxes.map((box, index) => /* @__PURE__ */ import_react6.default.createElement(
        "div",
        {
          key: index,
          role: "listitem",
          "aria-label": t("editor.boxLabel", {
            index: index + 1,
            caption: box.type === "text" ? box.text ?? t("editor.kindText") : box.desc || t("editor.noDesc"),
            flags: `${box.locked === true ? t("editor.lockedFlag") : ""}${box.hidden === true ? t("editor.hiddenFlag") : ""}`
          }),
          onDragOver: (event) => {
            if (draggingIndex === null) return;
            event.preventDefault();
            if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
            const rect = event.currentTarget.getBoundingClientRect();
            const after = event.clientY > rect.top + rect.height / 2;
            setDropTarget({ index, after });
          },
          onDrop: (event) => {
            if (draggingIndex === null) return;
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            const after = event.clientY > rect.top + rect.height / 2;
            const target = after ? index + 1 : index;
            reorder(draggingIndex, target > draggingIndex ? target - 1 : target);
          },
          onDragEnd: () => {
            setDraggingIndex(null);
            setDropTarget(null);
          },
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "6px 6px 6px 26px",
            position: "relative",
            borderRadius: 8,
            cursor: "pointer",
            background: selection.includes(index) ? selectionFill(14) : "transparent",
            border: `1px solid ${selection.includes(index) ? "var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))" : "var(--dsw-alias-border-l1, rgba(127,127,127,0.22))"}`,
            opacity: draggingIndex === null || draggingIndex === index ? 1 : 0.55,
            boxShadow: dropTarget?.index === index ? `inset 0 ${dropTarget.after ? -2 : 2}px 0 var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))` : void 0
          }
        },
        /* @__PURE__ */ import_react6.default.createElement(
          "span",
          {
            draggable: true,
            "aria-hidden": "true",
            "data-drag-index": index,
            onClick: (event) => event.stopPropagation(),
            onDragStart: (event) => {
              if (!event.dataTransfer) return;
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", String(index));
              setDraggingIndex(index);
            },
            onDragEnd: () => {
              setDraggingIndex(null);
              setDropTarget(null);
            },
            title: t("editor.reorder"),
            style: { ...iconButton, padding: 2, cursor: "grab", display: "inline-flex", alignItems: "center", justifyContent: "center", position: "absolute", left: 3, top: 8 }
          },
          /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "drag_indicator", size: 14 })
        ),
        /* @__PURE__ */ import_react6.default.createElement(
          "div",
          {
            role: "group",
            tabIndex: 0,
            "data-box-index": index,
            "aria-label": t("editor.boxLabel", {
              index: index + 1,
              caption: box.type === "text" ? box.text ?? t("editor.kindText") : box.desc || t("editor.noDesc"),
              flags: `${box.locked === true ? t("editor.lockedFlag") : ""}${box.hidden === true ? t("editor.hiddenFlag") : ""}`
            }),
            "aria-current": selection.includes(index) ? "true" : void 0,
            onFocus: () => {
              if (!selection.includes(index)) setSelection([index]);
            },
            onKeyDown: (event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                const additive = event.shiftKey || event.metaKey || event.ctrlKey;
                setSelection((current) => additive ? current.includes(index) ? current.filter((item) => item !== index) : [...current, index] : [index]);
                return;
              }
              if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
              event.preventDefault();
              event.stopPropagation();
              if (event.altKey) {
                const next2 = index + (event.key === "ArrowDown" ? 1 : -1);
                const list = event.currentTarget.closest('[role="list"]');
                reorder(index, next2);
                setTimeout(() => {
                  list?.querySelector(`[role="group"][data-box-index="${next2}"]`)?.focus();
                }, 0);
                return;
              }
              const rows = [...event.currentTarget.closest('[role="list"]').querySelectorAll('[role="group"][data-box-index]')];
              const position = rows.indexOf(event.currentTarget);
              const next = position + (event.key === "ArrowDown" ? 1 : -1);
              if (next >= 0 && next < rows.length) rows[next].focus();
            },
            onClick: (event) => {
              if (event.shiftKey || event.metaKey || event.ctrlKey) {
                setSelection((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
              } else {
                setSelection([index]);
              }
            },
            style: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1, cursor: "pointer" }
          },
          /* @__PURE__ */ import_react6.default.createElement("div", { style: { ...row } }, /* @__PURE__ */ import_react6.default.createElement("span", { style: { width: 12, ...dim, opacity: box.hidden ? 0.4 : 1 } }, index + 1), /* @__PURE__ */ import_react6.default.createElement("span", { style: { ...input, flex: 1, padding: "2px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", background: "transparent", border: "none", opacity: box.hidden ? 0.45 : 1, textDecoration: box.hidden ? "line-through" : "none" } }, box.type === "text" ? box.text ?? t("editor.kindText") : box.desc || t("editor.noDesc")), /* @__PURE__ */ import_react6.default.createElement(
            "span",
            {
              title: boxProblem(box) === void 0 ? void 0 : t(boxProblem(box) === "text" ? "editor.needsText" : "editor.needsDesc"),
              style: {
                ...dim,
                fontSize: 10,
                whiteSpace: "nowrap",
                color: boxProblem(box) === void 0 ? void 0 : "var(--dsw-alias-state-error-primary, #ff8f7a)"
              }
            },
            boxProblem(box) === void 0 ? "" : "! ",
            Math.round(box.width * 100),
            "\xD7",
            Math.round(box.height * 100)
          ), /* @__PURE__ */ import_react6.default.createElement(
            "button",
            {
              type: "button",
              style: box.locked ? { ...iconButton, padding: 2, color: "var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))" } : { ...iconButton, padding: 2, opacity: 0.55 },
              title: box.locked ? t("editor.unlock") : t("editor.lock"),
              "aria-label": box.locked ? t("editor.unlock") : t("editor.lock"),
              "aria-pressed": box.locked === true,
              onClick: (event) => {
                event.stopPropagation();
                patchBox(index, { locked: box.locked !== true });
              }
            },
            /* @__PURE__ */ import_react6.default.createElement(Icon, { name: box.locked ? "lock" : "lock_open", size: 13 })
          ), /* @__PURE__ */ import_react6.default.createElement(
            "button",
            {
              type: "button",
              style: box.hidden ? { ...iconButton, padding: 2, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" } : { ...iconButton, padding: 2, opacity: 0.55 },
              title: box.hidden ? t("editor.show") : t("editor.hide"),
              "aria-label": box.hidden ? t("editor.show") : t("editor.hide"),
              "aria-pressed": box.hidden === true,
              onClick: (event) => {
                event.stopPropagation();
                patchBox(index, { hidden: box.hidden !== true });
              }
            },
            /* @__PURE__ */ import_react6.default.createElement(Icon, { name: box.hidden ? "visibility_off" : "visibility", size: 13 })
          )),
          selection.includes(index) && selection.length === 1 ? (
            // A box's description is a sentence or two, so it gets the same
            // kind of box as the prompt: multi-line, drag the corner taller.
            /* @__PURE__ */ import_react6.default.createElement(
              "textarea",
              {
                value: box.type === "text" ? box.text ?? "" : box.desc ?? "",
                onChange: (event) => {
                  const field = box.type === "text" ? "text" : "desc";
                  patchBox(index, { [field]: event.target.value }, { coalesceKey: `box:${index}:${field}` });
                },
                placeholder: box.type === "text" ? t("editor.kindTextHint") : t("editor.descPlaceholder"),
                "aria-label": box.type === "text" ? t("editor.kindTextHint") : t("editor.descPlaceholder"),
                rows: 3,
                style: {
                  ...input,
                  // `input` carries flex:1, and a flex item ignores the height the
                  // browser's resize grip writes; opt out so dragging works.
                  flex: "0 0 auto",
                  display: "block",
                  width: "100%",
                  minHeight: 64,
                  maxHeight: 260,
                  resize: "vertical",
                  overflowY: "auto",
                  lineHeight: 1.55,
                  fontFamily: "inherit"
                }
              }
            )
          ) : null
        )
      )))))
    )
  );
}

// node_modules/@tanstack/react-virtual/dist/esm/index.js
var React6 = __toESM(require("react"), 1);
var import_react_dom = require("react-dom");

// node_modules/@tanstack/virtual-core/dist/esm/lazy-measurements.js
function getMeasurementKey(item) {
  return typeof item === "object" ? item.key : item;
}
function createLazyMeasurementsView(cache, flat) {
  const count = cache.length;
  return new Proxy(cache, {
    get(target, prop, receiver) {
      if (typeof prop === "string") {
        const c = prop.charCodeAt(0);
        if (c >= 48 && c <= 57) {
          const i = +prop;
          if (Number.isInteger(i) && i >= 0 && i < count) {
            let v = target[i];
            if (typeof v !== "object") {
              const s = flat[i * 2];
              v = target[i] = {
                index: i,
                key: v,
                start: s,
                size: flat[i * 2 + 1],
                end: s + flat[i * 2 + 1],
                lane: 0
              };
            }
            return v;
          }
        }
        if (prop === "length") return count;
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

// node_modules/@tanstack/virtual-core/dist/esm/utils.js
function memo(getDeps, fn, opts) {
  let deps = opts.initialDeps ?? [];
  let result;
  let isInitial = true;
  function memoizedFunction() {
    var _a;
    const debugEnabled = !!opts.key && !!((_a = opts.debug) == null ? void 0 : _a.call(opts));
    let depTime = 0;
    if (debugEnabled) depTime = Date.now();
    const newDeps = getDeps();
    const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
    if (!depsChanged) {
      return result;
    }
    deps = newDeps;
    let resultTime = 0;
    if (debugEnabled) resultTime = Date.now();
    result = fn(...newDeps);
    if (debugEnabled) {
      const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
      const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
      const resultFpsPercentage = resultEndTime / 16;
      const pad = (str, num) => {
        str = String(str);
        while (str.length < num) {
          str = " " + str;
        }
        return str;
      };
      console.info(
        `%c\u23F1 ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * resultFpsPercentage, 120)
        )}deg 100% 31%);`,
        opts == null ? void 0 : opts.key
      );
    }
    if ((opts == null ? void 0 : opts.onChange) && !(isInitial && opts.skipInitialOnChange)) {
      opts.onChange(result);
    }
    isInitial = false;
    return result;
  }
  memoizedFunction.updateDeps = (newDeps) => {
    deps = newDeps;
  };
  return memoizedFunction;
}
function notUndefined(value, msg) {
  if (value === void 0) {
    throw new Error(`Unexpected undefined${msg ? `: ${msg}` : ""}`);
  } else {
    return value;
  }
}
var approxEqual = (a, b) => Math.abs(a - b) < 1.01;
var debounce = (targetWindow, fn, ms) => {
  let timeoutId;
  return Object.assign(
    function(...args) {
      targetWindow.clearTimeout(timeoutId);
      timeoutId = targetWindow.setTimeout(() => fn.apply(this, args), ms);
    },
    {
      // The handle is closure-local, so a caller that has already
      // unsubscribed has no way to stop a queued call. Teardown paths use
      // this to drop the pending invocation instead of letting it land.
      cancel: () => {
        targetWindow.clearTimeout(timeoutId);
      }
    }
  );
};

// node_modules/@tanstack/virtual-core/dist/esm/scroll-classifier.js
function classifyScrollEvent({
  offset,
  isScrolling,
  elementMax,
  holdOffset,
  scrollOffset,
  pendingWrite,
  clampedMaxAtWrite,
  ownWriteAt
}) {
  var _a;
  if (isScrolling && pendingWrite === null && offset === scrollOffset) {
    return "spurious";
  }
  if (pendingWrite !== null && Math.abs(offset - pendingWrite.target) < 1.5) {
    return "readBack";
  }
  if (pendingWrite !== null && !pendingWrite.smooth && elementMax !== null && pendingWrite.target > elementMax + holdOffset + 0.5 && Math.abs(offset - (elementMax + holdOffset)) < 1.5) {
    return "clampedReadBack";
  }
  if (pendingWrite !== null && !pendingWrite.smooth && ((_a = pendingWrite.lowMaxes) == null ? void 0 : _a.some((max) => Math.abs(offset - max) < 1.5))) {
    return "clampedReadBack";
  }
  if (clampedMaxAtWrite !== null && Math.abs(offset - clampedMaxAtWrite) < 1.5) {
    return "clampedEcho";
  }
  if (!isScrolling && ownWriteAt !== null && Math.abs(offset - ownWriteAt) < 1.5) {
    return "restEcho";
  }
  return "external";
}
var isAnimating = (phase) => phase === "smooth" || phase === "smoothFinishing";
function externalRetiresCommand({
  kind,
  offset,
  command,
  target
}) {
  let fresh;
  const freshTarget = () => fresh ?? (fresh = target());
  return kind !== "spurious" && kind !== "readBack" && // Our own write, clamped (`clampedReadBack`, #1310): the command is not
  // retired by it, and reconcile retargets below the new max.
  kind !== "clampedReadBack" && (command == null ? void 0 : command.index) != null && // Nothing has been written for a command waiting for the tail; these
  // are the fling's events.
  command.phase !== "queued" && // A non-smooth write lands at once, so any other scroll event is the
  // user's, even before reconcile saw the target reached (the target may
  // keep moving, or iOS ignored the write under a finger). A write the
  // browser clamped because the sizer hasn't grown yet reads back at the
  // max, which is also where the fresh target clamps, so the check below
  // keeps it reconciling (#1294). While a smooth scroll's animation may
  // still report, its events look like a user's, so it yields only once it
  // has landed.
  !isAnimating(command.phase) && !approxEqual(offset, command.lastTargetOffset) && !approxEqual(offset, freshTarget()) && // Our own write reported again at rest (`restEcho`): nothing else has
  // moved the element, but reconcile writes only a target that moved. Once
  // the target has moved since the command wrote it, reconcile lands the
  // command there (with `scrollend`, a correction's echo arrives before
  // reconcile has run on the measurements behind it); while it has not,
  // nothing will bring the element back, and the command ends here.
  (kind !== "restEcho" || freshTarget() === command.lastTargetOffset) && // A compensation write's clamped echo (#1258) keeps the command. The
  // order is deliberate, not tidiness: this clause stays after `target()`
  // (and `clampedReadBack` before it) because `target()` can rebuild the
  // measurements, so it must run for exactly the events it always did.
  kind !== "clampedEcho";
}
var FLING_WINDOW_MS = 40;
function flingSpedUp(samples) {
  const last = samples[samples.length - 1];
  if (last === void 0) return false;
  let j = samples.length - 2;
  while (j >= 0 && last.t - samples[j].t < FLING_WINDOW_MS) j--;
  if (j < 0) return false;
  const mid = samples[j];
  let k = j - 1;
  while (k >= 0 && mid.t - samples[k].t < FLING_WINDOW_MS) k--;
  if (k < 0) return false;
  const first = samples[k];
  const recent = (last.offset - mid.offset) / (last.t - mid.t);
  const before = (mid.offset - first.offset) / (mid.t - first.t);
  return recent * before >= 0 && Math.abs(recent) >= 2 * Math.abs(before) && Math.abs(recent) - Math.abs(before) >= 0.8;
}
function flingCaught(samples) {
  const last = samples[samples.length - 1];
  if (last === void 0) return false;
  let j = samples.length - 2;
  while (j >= 0 && last.t - samples[j].t < FLING_WINDOW_MS) j--;
  if (j < 0) return false;
  const from = samples[j];
  return Math.abs(last.offset - from.offset) / (last.t - from.t) >= 0.05;
}

// node_modules/@tanstack/virtual-core/dist/esm/ios-gesture.js
var _isIOSResult;
var isIOSWebKit = () => {
  if (_isIOSResult !== void 0) return _isIOSResult;
  if (typeof navigator === "undefined") return _isIOSResult = false;
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) return _isIOSResult = true;
  const mtp = navigator.maxTouchPoints;
  return _isIOSResult = navigator.platform === "MacIntel" && mtp !== void 0 && mtp > 0;
};
var _iosMomentumOverridesWritesResult;
var iosMomentumOverridesWrites = () => {
  if (_iosMomentumOverridesWritesResult !== void 0) {
    return _iosMomentumOverridesWritesResult;
  }
  return _iosMomentumOverridesWritesResult = isIOSWebKit() && typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("overflow-anchor: auto");
};
var momentumOverridesWrites = () => !isIOSWebKit() || iosMomentumOverridesWrites();
var touchListenerOptions = {
  capture: true,
  passive: true
};
var IosGesture = class {
  constructor(host) {
    this.host = host;
    this._touch = null;
    this.inMotion = () => this._touch !== null && this._touch.phase !== "lateFling";
    this.dragging = () => {
      var _a;
      return ((_a = this._touch) == null ? void 0 : _a.phase) === "down" && this._touch.moved;
    };
    this.tail = () => {
      var _a;
      return ((_a = this._touch) == null ? void 0 : _a.phase) === "tail" ? this._touch.moved ? "fling" : "tap" : null;
    };
    this.onScroll = ({
      isScrolling,
      ownReadBack,
      moved,
      external
    }) => {
      var _a, _b, _c;
      if (isScrolling && ((_a = this._touch) == null ? void 0 : _a.phase) === "tail") {
        this._openTail(this._touch.moved || !ownReadBack, false);
      } else if (((_b = this._touch) == null ? void 0 : _b.phase) === "lateFling") {
        if (this.host.now() > this._touch.until) {
          this._touch = null;
        } else if (external && isScrolling && moved) {
          this._openTail(true, false);
        }
      }
      if (!ownReadBack && isScrolling && moved && ((_c = this._touch) == null ? void 0 : _c.phase) === "down") {
        this._touch.moved = true;
        return true;
      }
      return false;
    };
    this.touchStart = () => {
      this.end();
      this._touch = { phase: "down", moved: false };
    };
    this.touchEnd = () => {
      var _a;
      const moved = ((_a = this._touch) == null ? void 0 : _a.phase) === "down" && this._touch.moved;
      this.end();
      this._openTail(moved, moved);
    };
    this.end = () => {
      var _a;
      const win = this.host.getWindow();
      if (((_a = this._touch) == null ? void 0 : _a.phase) === "tail" && win != null) {
        win.clearTimeout(this._touch.timerId);
      }
      this._touch = null;
    };
    this.listen = (target) => {
      const onTouchStart = () => this.touchStart();
      const onTouchEnd = () => this.touchEnd();
      target.addEventListener("touchstart", onTouchStart, touchListenerOptions);
      target.addEventListener("touchend", onTouchEnd, touchListenerOptions);
      target.addEventListener("touchcancel", onTouchEnd, touchListenerOptions);
      return () => {
        target.removeEventListener(
          "touchstart",
          onTouchStart,
          touchListenerOptions
        );
        target.removeEventListener("touchend", onTouchEnd, touchListenerOptions);
        target.removeEventListener(
          "touchcancel",
          onTouchEnd,
          touchListenerOptions
        );
        this.end();
      };
    };
    this._openTail = (moved, awaitingFling) => {
      const win = this.host.getWindow();
      if (win == null) return;
      this.end();
      const tail = {
        phase: "tail",
        moved,
        awaitingFling,
        // Only fires while this tail is current: `end` clears it otherwise.
        timerId: win.setTimeout(() => {
          if (this.host.tailStillMoving()) {
            this._openTail(tail.moved, tail.awaitingFling);
            return;
          }
          this._touch = tail.awaitingFling ? { phase: "lateFling", until: this.host.now() + 1e3 } : null;
          this.host.onTailClosed();
        }, 150)
      };
      this._touch = tail;
    };
  }
  get touch() {
    return this._touch;
  }
};

// node_modules/@tanstack/virtual-core/dist/esm/index.js
var getRect = (element) => {
  const { clientWidth, clientHeight } = element;
  return { width: clientWidth, height: clientHeight };
};
var createFrameQueue = (targetWindow) => {
  const ids = /* @__PURE__ */ new Set();
  return {
    schedule: (fn) => {
      const id = targetWindow.requestAnimationFrame(() => {
        ids.delete(id);
        fn();
      });
      ids.add(id);
    },
    cancel: () => {
      ids.forEach((id) => targetWindow.cancelAnimationFrame(id));
      ids.clear();
    }
  };
};
var defaultKeyExtractor = (index) => index;
var defaultRangeExtractor = (range) => {
  const overscan = range.overscan * Math.max(range.lanes ?? 1, 1);
  const start = Math.max(range.startIndex - overscan, 0);
  const end = Math.min(range.endIndex + overscan, range.count - 1);
  const len = end - start + 1;
  const arr = new Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = start + i;
  }
  return arr;
};
var observeElementRect = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  const handler = (rect) => {
    const { width, height } = rect;
    cb({ width: Math.round(width), height: Math.round(height) });
  };
  handler(getRect(element));
  if (!targetWindow.ResizeObserver) {
    return () => {
    };
  }
  const frames = createFrameQueue(targetWindow);
  const observer = new targetWindow.ResizeObserver(() => {
    const run = () => {
      handler(getRect(element));
    };
    instance.options.useAnimationFrameWithResizeObserver ? frames.schedule(run) : run();
  });
  observer.observe(element, { box: "content-box" });
  return () => {
    observer.unobserve(element);
    frames.cancel();
  };
};
var addEventListenerOptions = {
  passive: true
};
var supportsScrollend = typeof window == "undefined" ? true : "onscrollend" in window;
var observeOffset = (instance, cb, readOffset) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  const registerScrollendEvent = instance.options.useScrollendEvent && supportsScrollend;
  let offset = 0;
  const fallback = registerScrollendEvent ? null : debounce(
    targetWindow,
    () => cb(readOffset(element), false),
    instance.options.isScrollingResetDelay
  );
  const createHandler = (isScrolling) => () => {
    offset = readOffset(element);
    fallback == null ? void 0 : fallback();
    cb(offset, isScrolling);
  };
  const handler = createHandler(true);
  const endHandler = createHandler(false);
  element.addEventListener("scroll", handler, addEventListenerOptions);
  if (registerScrollendEvent) {
    element.addEventListener("scrollend", endHandler, addEventListenerOptions);
  }
  return () => {
    element.removeEventListener("scroll", handler);
    if (registerScrollendEvent) {
      element.removeEventListener("scrollend", endHandler);
    }
    fallback == null ? void 0 : fallback.cancel();
  };
};
var observeElementOffset = (instance, cb) => observeOffset(instance, cb, (el) => {
  const { horizontal, isRtl } = instance.options;
  return horizontal ? el.scrollLeft * (isRtl && -1 || 1) : el.scrollTop;
});
var measureElement = (element, entry, instance) => {
  if (instance.options.useCachedMeasurements) {
    const index = instance.indexFromElement(element);
    const key = instance.options.getItemKey(index);
    return instance.itemSizeCache.get(key) ?? instance.options.estimateSize(index);
  }
  if (entry == null ? void 0 : entry.borderBoxSize) {
    const box = entry.borderBoxSize[0];
    if (box) {
      const size = Math.round(
        box[instance.options.horizontal ? "inlineSize" : "blockSize"]
      );
      return size;
    }
  }
  if (!entry) {
    const index = instance.indexFromElement(element);
    const key = instance.options.getItemKey(index);
    const cachedSize = instance.itemSizeCache.get(key);
    if (cachedSize !== void 0) {
      return cachedSize;
    }
  }
  return element[instance.options.horizontal ? "offsetWidth" : "offsetHeight"];
};
var scrollWithAdjustments = (offset, {
  adjustments = 0,
  behavior
}, instance) => {
  var _a;
  const { scrollElement, options } = instance;
  const adjustedOffset = offset + adjustments;
  const isRtlElement = options.horizontal && options.isRtl && scrollElement !== null && "ownerDocument" in scrollElement;
  (_a = scrollElement == null ? void 0 : scrollElement.scrollTo) == null ? void 0 : _a.call(scrollElement, {
    [options.horizontal ? "left" : "top"]: isRtlElement ? -adjustedOffset : adjustedOffset,
    behavior
  });
};
var elementScroll = scrollWithAdjustments;
var initialScrollPhase = (behavior, atTarget) => behavior === "smooth" ? atTarget ? "smoothLanded" : "smooth" : "instant";
var isSmoothScroll = (state) => (state == null ? void 0 : state.phase) === "smooth" || (state == null ? void 0 : state.phase) === "smoothLanded";
function isAppendWithTrim(prevCount, nextCount, getPreviousKey, getNextKey) {
  if (nextCount === 0) return false;
  const firstKey = getNextKey(0);
  const removedKeys = /* @__PURE__ */ new Set();
  let removedCount = 0;
  while (removedCount < prevCount) {
    const key = getPreviousKey(removedCount);
    if (key === firstKey) break;
    removedKeys.add(key);
    removedCount++;
  }
  const retainedCount = prevCount - removedCount;
  if (retainedCount === 0 || retainedCount >= nextCount) return false;
  for (let i = 0; i < retainedCount; i++) {
    if (getNextKey(i) !== getPreviousKey(removedCount + i)) return false;
  }
  for (let i = retainedCount; i < nextCount; i++) {
    if (removedKeys.has(getNextKey(i))) return false;
  }
  return true;
}
var Virtualizer = class {
  constructor(opts) {
    this.unsubs = [];
    this.scrollElement = null;
    this.targetWindow = null;
    this.isScrolling = false;
    this.scrollState = null;
    this.measurementsCache = [];
    this._singleLaneMeasurements = null;
    this.itemSizeCache = /* @__PURE__ */ new Map();
    this.itemSizeCacheVersion = 0;
    this.builtMeasurementOptions = null;
    this.builtItemSizeCacheVersion = -1;
    this.pendingResizes = [];
    this.laneAssignments = /* @__PURE__ */ new Map();
    this.pendingMin = null;
    this.prevLanes = void 0;
    this.lanesChangedFlag = false;
    this.lanesSettling = false;
    this.initialMeasurementsCacheApplied = false;
    this.pendingScrollAnchor = null;
    this.scrollRect = null;
    this.scrollOffset = null;
    this.scrollDirection = null;
    this._holdOffset = 0;
    this._reportedOverscroll = false;
    this._trailing = 0;
    this._drawnListEnd = Infinity;
    this._iosGesture = new IosGesture({
      getWindow: () => this.targetWindow,
      now: () => this.now(),
      // The end of a fling can move less than a pixel per scroll event, so
      // events can stop for 150ms while the fling is still running (seen on
      // an iPhone, 27.0.1). A command waiting for it would then be written
      // into the fling and overridden. The element having moved since the
      // last event means it has not ended: wait again. Not while our own
      // write has yet to report: that moved it.
      tailStillMoving: () => {
        const state = this.scrollState;
        if ((state == null ? void 0 : state.phase) !== "queued" || this.pendingWrite !== null) {
          return false;
        }
        const now = this._readElementOffset();
        if (now === null || this._lastElementOffset === null || Math.abs(now - this._lastElementOffset) < 1) {
          return false;
        }
        this._lastElementOffset = now;
        state.samples = [...state.samples ?? [], { t: this.now(), offset: now }];
        return true;
      },
      onTailClosed: () => {
        const state = this.scrollState;
        if ((state == null ? void 0 : state.phase) === "queued" && flingCaught(state.samples ?? [])) {
          this.scrollState = null;
        }
        this._flushHoldIfReady(true);
        this._writeAwaitingCommand();
        this._retryClampedAdjustment();
      }
    });
    this._lastElementOffset = null;
    this.pendingWrite = null;
    this._ownWriteAt = null;
    this._clampedAdjustment = null;
    this.elementsCache = /* @__PURE__ */ new Map();
    this._resizeBatch = null;
    this.now = () => {
      var _a, _b, _c;
      return ((_c = (_b = (_a = this.targetWindow) == null ? void 0 : _a.performance) == null ? void 0 : _b.now) == null ? void 0 : _c.call(_b)) ?? Date.now();
    };
    this.observer = /* @__PURE__ */ (() => {
      let _ro = null;
      let _frames = null;
      let delivering = false;
      let observeQueued = false;
      const pendingObservations = /* @__PURE__ */ new Set();
      const get = () => {
        if (_ro) {
          return _ro;
        }
        const targetWindow = this.targetWindow;
        if (!targetWindow || !targetWindow.ResizeObserver) {
          return null;
        }
        const frames = _frames = createFrameQueue(targetWindow);
        return _ro = new targetWindow.ResizeObserver((entries) => {
          const run = () => {
            const batch = { sync: false };
            this._resizeBatch = batch;
            try {
              entries.forEach(measureEntry);
            } finally {
              this._resizeBatch = null;
              if (batch.notify) {
                this.notify(batch.sync);
                this._noteClampMax();
                this._flushHoldIfReady(true);
                this._retryClampedAdjustment();
                this.measureElement(null);
              }
            }
          };
          if (this.options.useAnimationFrameWithResizeObserver) {
            frames.schedule(run);
          } else {
            delivering = true;
            try {
              run();
            } finally {
              delivering = false;
            }
          }
        });
      };
      const measureEntry = (entry) => {
        const node = entry.target;
        const index = this.indexFromElement(node);
        if (!node.isConnected) {
          this.observer.unobserve(node);
          for (const [cacheKey, cachedNode] of this.elementsCache) {
            if (cachedNode === node) {
              this.elementsCache.delete(cacheKey);
              break;
            }
          }
          return;
        }
        if (!this.isIndexInRange(index)) return;
        if (this.shouldMeasureDuringScroll(index)) {
          this.resizeItem(index, this.options.measureElement(node, entry, this));
        }
      };
      return {
        disconnect: () => {
          var _a;
          (_a = get()) == null ? void 0 : _a.disconnect();
          _frames == null ? void 0 : _frames.cancel();
          pendingObservations.clear();
          observeQueued = false;
          _ro = null;
          _frames = null;
        },
        observe: (target) => {
          const observer = get();
          if (!observer) return;
          if (!delivering) {
            observer.observe(target, { box: "border-box" });
            return;
          }
          pendingObservations.add(target);
          if (!observeQueued) {
            observeQueued = true;
            _frames == null ? void 0 : _frames.schedule(() => {
              observeQueued = false;
              pendingObservations.forEach((node) => {
                if (node.isConnected) _ro == null ? void 0 : _ro.observe(node, { box: "border-box" });
              });
              pendingObservations.clear();
            });
          }
        },
        unobserve: (target) => {
          var _a;
          pendingObservations.delete(target);
          (_a = get()) == null ? void 0 : _a.unobserve(target);
        }
      };
    })();
    this.range = null;
    this.setOptions = (opts2) => {
      var _a;
      const merged = {
        debug: false,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: false,
        getItemKey: defaultKeyExtractor,
        rangeExtractor: defaultRangeExtractor,
        onChange: () => {
        },
        measureElement,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        anchorTo: "start",
        followOnAppend: false,
        scrollEndThreshold: 1,
        isScrollingResetDelay: 150,
        enabled: true,
        isRtl: false,
        useScrollendEvent: false,
        useAnimationFrameWithResizeObserver: false,
        laneAssignmentMode: "estimate",
        useCachedMeasurements: false
      };
      for (const key in opts2) {
        const v = opts2[key];
        if (v !== void 0) merged[key] = v;
      }
      const prevOptions = this.options;
      let anchor = null;
      let followOnAppend = null;
      let edgeKeysChanged = false;
      if (prevOptions !== void 0 && prevOptions.enabled && merged.enabled && merged.anchorTo === "end" && this.scrollElement !== null) {
        const prevCount = prevOptions.count;
        const nextCount = merged.count;
        const measurements = this.getMeasurements();
        const previousItems = ((_a = this._singleLaneMeasurements) == null ? void 0 : _a.items) ?? measurements;
        const getPreviousKey = (index) => getMeasurementKey(previousItems[index]);
        const prevFirstKey = prevCount > 0 ? getPreviousKey(0) : null;
        const prevLastKey = prevCount > 0 ? getPreviousKey(prevCount - 1) : null;
        const didCountChange = nextCount !== prevCount;
        const didEdgeKeysChange = didCountChange || prevCount > 0 && nextCount > 0 && (merged.getItemKey(0) !== prevFirstKey || merged.getItemKey(nextCount - 1) !== prevLastKey);
        if (didEdgeKeysChange) {
          edgeKeysChanged = true;
          const item = prevCount > 0 ? this.getVirtualItemForOffset(this.getScrollOffset()) ?? measurements[0] : null;
          if (item) {
            anchor = [item.key, this.getScrollOffset() - item.start];
          }
          const behavior = merged.followOnAppend === true ? "auto" : merged.followOnAppend || null;
          if (behavior && nextCount > 0 && this.isAtEnd(prevOptions.scrollEndThreshold) && (prevCount === 0 || merged.getItemKey(nextCount - 1) !== prevLastKey)) {
            if (nextCount > prevCount || isAppendWithTrim(
              prevCount,
              nextCount,
              getPreviousKey,
              merged.getItemKey
            )) {
              followOnAppend = behavior;
            }
          }
        }
      }
      this.options = merged;
      if (edgeKeysChanged) {
        this.pendingMin = 0;
        this.itemSizeCacheVersion++;
      }
      let anchorDelta = null;
      if (anchor && this.scrollOffset !== null && !this._awaitingCommandReadBack()) {
        const [anchorKey, anchorOffset] = anchor;
        const newMeasurements = this.getMeasurements();
        const { count, getItemKey } = this.options;
        let idx = 0;
        while (idx < count && getItemKey(idx) !== anchorKey) {
          idx++;
        }
        if (idx < count) {
          const anchorItem = newMeasurements[idx];
          if (anchorItem) {
            const newOffset = Math.max(0, anchorItem.start + anchorOffset);
            if (!followOnAppend && newOffset !== this.scrollOffset) {
              anchorDelta = newOffset - this.scrollOffset;
              this.scrollOffset = newOffset;
            }
          }
        }
      }
      if (followOnAppend) {
        this.pendingScrollAnchor = { kind: "follow", behavior: followOnAppend };
      } else if (anchorDelta !== null) {
        if (this._canWriteScroll()) {
          this.pendingScrollAnchor = { kind: "anchor", delta: anchorDelta };
        } else {
          this._holdOffset += anchorDelta;
          this._followAnchor(anchorDelta);
        }
      }
    };
    this.notify = (sync) => {
      var _a, _b;
      (_b = (_a = this.options).onChange) == null ? void 0 : _b.call(_a, this, sync);
    };
    this.maybeNotify = memo(
      () => {
        this.calculateRange();
        return [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ];
      },
      (isScrolling) => {
        this.notify(isScrolling);
      },
      {
        key: "maybeNotify",
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    );
    this.cleanup = () => {
      var _a;
      this.unsubs.filter(Boolean).forEach((d) => d());
      this.unsubs = [];
      this.observer.disconnect();
      if (this.rafId != null && this.targetWindow) {
        this.targetWindow.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.scrollState = null;
      (_a = this._momentumStop) == null ? void 0 : _a.restore();
      this._momentumStop = null;
      this.isScrolling = false;
      this.scrollDirection = null;
      this._holdOffset = 0;
      this._reportedOverscroll = false;
      this._trailing = 0;
      this._clampedAdjustment = null;
      this.pendingWrite = null;
      this._ownWriteAt = null;
      this.scrollElement = null;
      this.targetWindow = null;
    };
    this._didMount = () => {
      return () => {
        this.cleanup();
      };
    };
    this._willUpdate = () => {
      var _a;
      const scrollElement = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== scrollElement) {
        this.cleanup();
        if (!scrollElement) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = scrollElement;
        if (this.scrollElement && "ownerDocument" in this.scrollElement) {
          this.targetWindow = this.scrollElement.ownerDocument.defaultView;
        } else {
          this.targetWindow = ((_a = this.scrollElement) == null ? void 0 : _a.window) ?? null;
        }
        this.elementsCache.forEach((cached) => {
          this.observer.observe(cached);
        });
        this.unsubs.push(
          this.options.observeElementRect(this, (rect) => {
            this.scrollRect = rect;
            this.maybeNotify();
          })
        );
        this.unsubs.push(
          this.options.observeElementOffset(this, (offset, isScrolling) => {
            var _a2, _b, _c, _d;
            const elementMax = isScrolling ? this._elementMaxScrollOffset() : null;
            this._readTrailing(elementMax);
            const wasOverscrolled = this._reportedOverscroll;
            this._reportedOverscroll = offset < 0 || elementMax !== null && offset > elementMax + 1;
            const elementOffset = offset;
            this._lastElementOffset = elementOffset;
            offset = this._toLayoutOffset(offset);
            const kind = this._classifyScrollEvent(
              offset,
              isScrolling,
              elementMax
            );
            if (kind === "spurious") return;
            if (kind === "readBack") {
              offset = this.pendingWrite.target;
            } else if (kind === "clampedReadBack" && ((_a2 = this.scrollState) == null ? void 0 : _a2.index) != null && // Not `elementMax`: an adapter can report the read-back at rest.
            offset < this.getMaxScrollOffset() - 1.5) {
              this.scrollState.lastTargetOffset = offset;
            } else if (externalRetiresCommand({
              kind,
              offset,
              command: this.scrollState,
              target: () => this.getScrollStateTarget(this.scrollState)
            })) {
              this.scrollState = null;
            }
            this.pendingWrite = null;
            if (kind === "readBack" || kind === "clampedReadBack" || kind === "clampedEcho") {
              this._ownWriteAt = offset;
            } else if (kind !== "restEcho") {
              this._ownWriteAt = null;
            }
            if (this._clampedAdjustment !== null && Math.abs(offset - this._clampedAdjustment.maxAtWrite) >= 1.5) {
              this._clampedAdjustment = null;
            }
            const prevOffset = this.getScrollOffset();
            const prevDirection = this.scrollDirection;
            this.scrollDirection = isScrolling ? prevOffset === offset ? this.scrollDirection : prevOffset < offset ? "forward" : "backward" : null;
            this.scrollOffset = offset;
            this.isScrolling = isScrolling;
            const queued = this.scrollState;
            if ((queued == null ? void 0 : queued.phase) === "queued" && kind === "external" && isScrolling) {
              if (wasOverscrolled || this._reportedOverscroll) {
                queued.samples = [];
              } else {
                const t2 = this.now();
                queued.samples = [
                  ...(queued.samples ?? []).filter(
                    (sample) => t2 - sample.t <= 200
                  ),
                  { t: t2, offset: elementOffset }
                ];
                if (prevDirection !== null && this.scrollDirection !== prevDirection || flingSpedUp(queued.samples)) {
                  this.scrollState = null;
                }
              }
            }
            if (this._iosGesture.onScroll({
              isScrolling,
              ownReadBack: kind === "readBack",
              moved: offset !== prevOffset,
              // Neither our write's read-back nor a frame of our smooth
              // animation: the user or a fling moved it.
              external: kind === "external" && ((_b = this.scrollState) == null ? void 0 : _b.phase) !== "smooth" && ((_c = this.scrollState) == null ? void 0 : _c.phase) !== "smoothFinishing"
            }) && // The user scrolls: a command still waiting for the tail is
            // theirs to override, like a written one would be.
            ((_d = this.scrollState) == null ? void 0 : _d.phase) === "queued") {
              this.scrollState = null;
            }
            this._flushHoldIfReady(true);
            if (this.scrollState) {
              this.scheduleScrollReconcile();
            }
            this.maybeNotify();
          })
        );
        if ("addEventListener" in this.scrollElement) {
          this.unsubs.push(
            this._iosGesture.listen(this.scrollElement)
          );
        }
        this._scrollToOffset(this.getScrollOffset());
        this._readTrailing(this._elementMaxScrollOffset());
        this.maybeNotify();
      }
      this._noteClampMax();
      const anchor = this.pendingScrollAnchor;
      this.pendingScrollAnchor = null;
      if (anchor && this.scrollElement && this.options.enabled) {
        if (anchor.kind === "anchor") {
          if (!this._canWriteScroll()) {
            this._holdOffset += anchor.delta;
            this._followAnchor(anchor.delta);
            this.notify(false);
          } else if (isSmoothScroll(this.scrollState) && !this._landedBeforeAnchor(this.scrollState, anchor.delta)) ;
          else {
            this._followAnchor(anchor.delta);
            this._scrollToOffset(this.getScrollOffset());
          }
        } else {
          this.scrollToEnd({ behavior: anchor.behavior });
        }
      }
      this._flushHoldIfReady(false);
      this._retryClampedAdjustment();
    };
    this._classifyScrollEvent = (offset, isScrolling, elementMax) => {
      var _a;
      return classifyScrollEvent({
        offset,
        isScrolling,
        elementMax,
        holdOffset: this._holdOffset,
        scrollOffset: this.scrollOffset,
        pendingWrite: this.pendingWrite,
        clampedMaxAtWrite: ((_a = this._clampedAdjustment) == null ? void 0 : _a.maxAtWrite) ?? null,
        ownWriteAt: this._ownWriteAt
      });
    };
    this._retryClampedAdjustment = () => {
      if (this._clampedAdjustment === null || !this.scrollElement || !this.options.enabled || !this._canWriteScroll()) {
        return;
      }
      const { target, maxAtWrite } = this._clampedAdjustment;
      const max = this.getMaxScrollOffset();
      if (max > maxAtWrite + 0.5) {
        this._clampedAdjustment = target > max + 0.5 ? { target, maxAtWrite: max } : null;
        this._scrollToOffset(target);
      }
    };
    this._writeAwaitingCommand = () => {
      const state = this.scrollState;
      if (state === null || state.phase !== "queued") return;
      const { behavior } = state;
      this.getMeasurements();
      const offset = this.getScrollStateTarget(state);
      state.lastTargetOffset = offset;
      this._clampedAdjustment = null;
      state.phase = initialScrollPhase(
        behavior,
        state.index != null && approxEqual(offset, this.getScrollOffset())
      );
      this._scrollToOffset(offset, { behavior });
      this.scheduleScrollReconcile();
    };
    this._readElementOffset = () => {
      const el = this.scrollElement;
      if (el == null) return null;
      const { horizontal, isRtl } = this.options;
      if (typeof el.scrollTop === "number") {
        return horizontal ? el.scrollLeft * (isRtl && -1 || 1) : el.scrollTop;
      }
      if (typeof el.scrollY === "number") {
        return horizontal ? el.scrollX : el.scrollY;
      }
      return null;
    };
    this._canWriteScroll = () => !(isIOSWebKit() && this._iosGesture.inMotion()) && !this._reportedOverscroll;
    this._flushHoldIfReady = (sync) => {
      var _a;
      if (this._holdOffset === 0) return;
      if (!this.scrollElement || !this.options.enabled) return;
      if (!this._canWriteScroll()) return;
      if (((_a = this.scrollState) == null ? void 0 : _a.phase) === "smooth") return;
      this._holdOffset = 0;
      if (this.scrollOffset !== null && this.scrollOffset < 0) {
        this.scrollOffset = 0;
      }
      this.notify(sync);
      const target = this.getCommandWrittenOffset() ?? this.getScrollOffset();
      this._clampedAdjustment = this._clampedBy(target);
      this._scrollToOffset(target);
    };
    this.rafId = null;
    this.getSize = () => {
      if (!this.options.enabled) {
        this.scrollRect = null;
        return 0;
      }
      this.scrollRect = this.scrollRect ?? this.options.initialRect;
      return this.scrollRect[this.options.horizontal ? "width" : "height"];
    };
    this.getScrollOffset = () => {
      if (!this.options.enabled) {
        this.scrollOffset = null;
        return 0;
      }
      this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset === "function" ? this.options.initialOffset() : this.options.initialOffset);
      return this.scrollOffset;
    };
    this.getMeasurementOptions = memo(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes,
        this.options.laneAssignmentMode,
        this.options.gap
      ],
      (count, paddingStart, scrollMargin, getItemKey, enabled, lanes, laneAssignmentMode, gap) => {
        const lanesChanged = this.prevLanes !== void 0 && this.prevLanes !== lanes;
        if (lanesChanged) {
          this.lanesChangedFlag = true;
        }
        this.prevLanes = lanes;
        this.pendingMin = null;
        return {
          count,
          paddingStart,
          scrollMargin,
          getItemKey,
          enabled,
          lanes,
          laneAssignmentMode,
          gap
        };
      },
      {
        key: false
      }
    );
    this.isIndexInRange = (index) => index >= 0 && index < this.options.count;
    this.getMeasurements = memo(
      () => [this.getMeasurementOptions(), this.itemSizeCacheVersion],
      (measurementOptions, itemSizeCacheVersion) => {
        var _a;
        const {
          count,
          paddingStart,
          scrollMargin,
          getItemKey,
          enabled,
          lanes,
          laneAssignmentMode,
          gap
        } = measurementOptions;
        this.builtMeasurementOptions = measurementOptions;
        this.builtItemSizeCacheVersion = itemSizeCacheVersion;
        this.pendingResizes = [];
        const itemSizeCache = this.itemSizeCache;
        if (!enabled) {
          this.measurementsCache = [];
          this._singleLaneMeasurements = null;
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          this.initialMeasurementsCacheApplied = false;
          return [];
        }
        if (this.laneAssignments.size > count) {
          for (const index of this.laneAssignments.keys()) {
            if (index >= count) {
              this.laneAssignments.delete(index);
            }
          }
        }
        if (this.lanesChangedFlag) {
          this.lanesChangedFlag = false;
          this.lanesSettling = true;
          this.measurementsCache = [];
          this._singleLaneMeasurements = null;
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          this.pendingMin = null;
        }
        if (!this.initialMeasurementsCacheApplied && this.measurementsCache.length === 0 && !this.lanesSettling) {
          this.initialMeasurementsCacheApplied = true;
          this.measurementsCache = this.options.initialMeasurementsCache;
          this.measurementsCache.forEach((item) => {
            this.itemSizeCache.set(item.key, item.size);
          });
        }
        const min = this.lanesSettling ? 0 : this.pendingMin ?? 0;
        this.pendingMin = null;
        if (this.lanesSettling && this.measurementsCache.length === count) {
          this.lanesSettling = false;
        }
        if (lanes === 1) {
          const need = count * 2;
          let flat = (_a = this._singleLaneMeasurements) == null ? void 0 : _a.flat;
          if (!flat || flat.length < need) {
            const next = new Float64Array(need);
            if (flat && min > 0) next.set(flat.subarray(0, min * 2));
            flat = next;
          }
          const items = min === 0 ? new Array(count) : this._singleLaneMeasurements.items.slice();
          let runningStart;
          if (min === 0) {
            runningStart = paddingStart + scrollMargin;
          } else {
            const prevIdx = min - 1;
            runningStart = flat[prevIdx * 2] + flat[prevIdx * 2 + 1] + gap;
          }
          for (let i = min; i < count; i++) {
            const key = getItemKey(i);
            items[i] = key;
            const measuredSize = itemSizeCache.get(key);
            const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i);
            flat[i * 2] = runningStart;
            flat[i * 2 + 1] = size;
            runningStart += size + gap;
          }
          this._singleLaneMeasurements = { flat, items };
          const view = createLazyMeasurementsView(items, flat);
          this.measurementsCache = view;
          return view;
        }
        const measurements = this.measurementsCache.slice(0, min);
        const laneLastIndex = new Array(lanes).fill(
          void 0
        );
        const laneEnds = new Float64Array(lanes);
        let filledLanes = 0;
        for (let m = 0; m < min; m++) {
          const item = measurements[m];
          if (item) {
            if (laneLastIndex[item.lane] === void 0) filledLanes++;
            laneLastIndex[item.lane] = m;
            laneEnds[item.lane] = item.end;
          }
        }
        for (let i = min; i < count; i++) {
          const key = getItemKey(i);
          const cachedLane = this.laneAssignments.get(i);
          let lane;
          let start;
          const shouldCacheLane = laneAssignmentMode === "estimate" || itemSizeCache.has(key);
          if (cachedLane !== void 0 && this.options.lanes > 1) {
            lane = cachedLane;
            const prevIndex = laneLastIndex[lane];
            const prevInLane = prevIndex !== void 0 ? measurements[prevIndex] : void 0;
            start = prevInLane ? prevInLane.end + gap : paddingStart + scrollMargin;
          } else if (filledLanes === lanes) {
            let bestLane = 0;
            let bestEnd = laneEnds[0];
            let bestIdx = laneLastIndex[0];
            for (let l = 1; l < lanes; l++) {
              const e = laneEnds[l];
              if (e < bestEnd || e === bestEnd && laneLastIndex[l] < bestIdx) {
                bestLane = l;
                bestEnd = e;
                bestIdx = laneLastIndex[l];
              }
            }
            lane = bestLane;
            start = bestEnd + gap;
            if (shouldCacheLane) {
              this.laneAssignments.set(i, lane);
            }
          } else {
            lane = i % this.options.lanes;
            start = paddingStart + scrollMargin;
            if (shouldCacheLane) {
              this.laneAssignments.set(i, lane);
            }
          }
          const measuredSize = itemSizeCache.get(key);
          const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i);
          const end = start + size;
          measurements[i] = {
            index: i,
            start,
            size,
            end,
            key,
            lane
          };
          if (laneLastIndex[lane] === void 0) filledLanes++;
          laneLastIndex[lane] = i;
          laneEnds[lane] = end;
        }
        this.measurementsCache = measurements;
        return measurements;
      },
      {
        key: "getMeasurements",
        debug: () => this.options.debug
      }
    );
    this.calculateRange = memo(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes,
        // scrollOffset is measured in the scroll element and the layout total
        // from the list start, so the list ends scrollMargin further down.
        this._getLayoutTotalSize() + this.options.scrollMargin,
        this._trailing
      ],
      (measurements, outerSize, scrollOffset, lanes, listEnd, trailing) => {
        if (measurements.length === 0 || outerSize === 0) {
          this.range = null;
          return null;
        }
        const maxScrollOffset = Math.max(listEnd + trailing - outerSize, 0);
        this.range = calculateRangeImpl(
          measurements,
          outerSize,
          Math.min(scrollOffset, maxScrollOffset),
          lanes,
          // Pass the typed array so binary search + forward-walk can read
          // start/end directly from Float64Array, skipping the Proxy traps.
          lanes === 1 && this._singleLaneMeasurements !== null ? this._singleLaneMeasurements.flat : null
        );
        return this.range;
      },
      {
        key: "calculateRange",
        debug: () => this.options.debug
      }
    );
    this.getVirtualIndexes = memo(
      () => {
        let startIndex = null;
        let endIndex = null;
        const range = this.calculateRange();
        if (range) {
          startIndex = range.startIndex;
          endIndex = range.endIndex;
        }
        this.maybeNotify.updateDeps([this.isScrolling, startIndex, endIndex]);
        return [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          startIndex,
          endIndex,
          this.options.lanes
        ];
      },
      (rangeExtractor, overscan, count, startIndex, endIndex, lanes) => {
        return startIndex === null || endIndex === null ? [] : rangeExtractor({
          startIndex,
          endIndex,
          overscan,
          count,
          lanes
        });
      },
      {
        key: "getVirtualIndexes",
        debug: () => this.options.debug
      }
    );
    this.indexFromElement = (node) => {
      const attributeName = this.options.indexAttribute;
      const indexStr = node.getAttribute(attributeName);
      if (!indexStr) {
        console.warn(
          `Missing attribute name '${attributeName}={index}' on measured element.`
        );
        return -1;
      }
      return parseInt(indexStr, 10);
    };
    this.shouldMeasureDuringScroll = (index) => {
      var _a;
      if (!isSmoothScroll(this.scrollState)) {
        return true;
      }
      const scrollIndex = this.scrollState.index ?? ((_a = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : _a.index);
      if (scrollIndex !== void 0 && this.range) {
        const bufferSize = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        );
        const minIndex = Math.max(0, scrollIndex - bufferSize);
        const maxIndex = Math.min(
          this.options.count - 1,
          scrollIndex + bufferSize
        );
        return index >= minIndex && index <= maxIndex;
      }
      return true;
    };
    this.measureElement = (node) => {
      if (!node) {
        this.elementsCache.forEach((cached, key2) => {
          if (!cached.isConnected) {
            this.observer.unobserve(cached);
            this.elementsCache.delete(key2);
          }
        });
        return;
      }
      const index = this.indexFromElement(node);
      if (!this.isIndexInRange(index)) return;
      const key = this.options.getItemKey(index);
      const prevNode = this.elementsCache.get(key);
      if (prevNode !== node) {
        if (prevNode) {
          this.observer.unobserve(prevNode);
        }
        this.observer.observe(node);
        this.elementsCache.set(key, node);
      }
      if (node.isConnected && (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(index)) {
        this.resizeItem(index, this.options.measureElement(node, void 0, this));
      }
    };
    this.canShiftFromPendingResizes = () => this.options.lanes === 1 && this._singleLaneMeasurements !== null && this.shouldAdjustScrollPositionOnItemSizeChange === void 0 && !this.lanesChangedFlag && !this.lanesSettling && this.getMeasurementOptions() === this.builtMeasurementOptions && this.itemSizeCacheVersion === this.builtItemSizeCacheVersion + this.pendingResizes.length;
    this.resizeItem = (index, size) => {
      var _a, _b, _c;
      if (!this.isIndexInRange(index)) return;
      let startShift = 0;
      if ((_a = this._resizeBatch) == null ? void 0 : _a.sync) {
        if (this.canShiftFromPendingResizes()) {
          for (const resize of this.pendingResizes) {
            if (resize.index < index) startShift += resize.delta;
          }
        } else {
          this.getMeasurements();
        }
      }
      let cachedSize;
      let itemStart;
      let key;
      const flat = (_b = this._singleLaneMeasurements) == null ? void 0 : _b.flat;
      if (this.options.lanes === 1 && flat != null) {
        key = this.options.getItemKey(index);
        itemStart = flat[index * 2] + startShift;
        cachedSize = flat[index * 2 + 1];
      } else {
        const item = this.measurementsCache[index];
        if (!item) return;
        key = item.key;
        itemStart = item.start;
        cachedSize = item.size;
      }
      const itemSize = this.itemSizeCache.get(key) ?? cachedSize;
      const delta = size - itemSize;
      if (delta !== 0) {
        const wasAtEnd = this.options.anchorTo === "end" && !isSmoothScroll(this.scrollState) && this.getVirtualDistanceFromEnd() <= this.options.scrollEndThreshold;
        const prevTotalSize = wasAtEnd ? this._getLayoutTotalSize() : 0;
        const scrollOffset = this.getScrollOffset();
        const isFirstMeasure = !this.itemSizeCache.has(key);
        const defaultShouldAdjust = isFirstMeasure ? (
          // First measurement: compensate any item whose top sits above the
          // fold — the estimate→actual delta must be corrected regardless of
          // scroll direction, since the whole estimated block was above it.
          itemStart < scrollOffset
        ) : (
          // Re-measurement: only compensate an item that is ENTIRELY above the
          // fold. An item that merely *spans* the fold (top above, bottom
          // below — e.g. a streaming chat message growing at its bottom)
          // changes size *below* the anchor point, so shifting scrollTop by the
          // delta would drag the viewport downward on every growth (#1218).
          // Also skip during backward scroll to avoid the "items jump while
          // scrolling up" cascade.
          itemStart + itemSize <= scrollOffset && this.scrollDirection !== "backward"
        );
        const shouldAdjustScroll = !isSmoothScroll(this.scrollState) && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(
          // The callback expects a VirtualItem; build one lazily only
          // when the consumer actually supplied a custom predicate.
          this.measurementsCache[index] ?? {
            index,
            key,
            start: itemStart,
            size: cachedSize,
            end: itemStart + cachedSize,
            lane: 0
          },
          delta,
          this
        ) : defaultShouldAdjust);
        if (this.pendingMin === null || index < this.pendingMin) {
          this.pendingMin = index;
        }
        this.itemSizeCache.set(key, size);
        this.itemSizeCacheVersion++;
        this.pendingResizes.push({ index, delta });
        let adjustedSync = false;
        if (!this._awaitingCommandReadBack()) {
          if (wasAtEnd) {
            adjustedSync = this.applyScrollAdjustment(
              this._getLayoutTotalSize() - prevTotalSize
            );
          } else if (shouldAdjustScroll) {
            adjustedSync = this.applyScrollAdjustment(delta);
          }
        }
        if (this._resizeBatch) {
          this._resizeBatch.notify = true;
          (_c = this._resizeBatch).sync || (_c.sync = adjustedSync);
          return;
        }
        this.notify(adjustedSync);
        this._noteClampMax();
        this._flushHoldIfReady(true);
        this._retryClampedAdjustment();
      } else if (this.options.lanes > 1 && !this.options.useCachedMeasurements && !this.laneAssignments.has(index)) {
        const item = this.getMeasurements()[index];
        if (item) this.laneAssignments.set(index, item.lane);
      }
    };
    this.getVirtualItems = memo(
      () => [this.getVirtualIndexes(), this.getMeasurements(), this._holdOffset],
      (indexes, measurements, hold) => {
        const virtualItems = [];
        for (let k = 0, len = indexes.length; k < len; k++) {
          const i = indexes[k];
          const measurement = measurements[i];
          virtualItems.push(
            hold === 0 ? measurement : {
              ...measurement,
              start: measurement.start - hold,
              end: measurement.end - hold
            }
          );
        }
        return virtualItems;
      },
      {
        key: "getVirtualItems",
        debug: () => this.options.debug
      }
    );
    this.getVirtualItemForOffset = (offset) => {
      var _a;
      const measurements = this.getMeasurements();
      if (measurements.length === 0) {
        return void 0;
      }
      const flat = (_a = this._singleLaneMeasurements) == null ? void 0 : _a.flat;
      const useFlat = this.options.lanes === 1 && flat != null;
      const idx = findNearestBinarySearch(
        0,
        measurements.length - 1,
        useFlat ? (i) => flat[i * 2] : (i) => notUndefined(measurements[i]).start,
        offset
      );
      return notUndefined(measurements[idx]);
    };
    this._noteClampMax = () => {
      if (!this._awaitingCommandReadBack()) return;
      const elementMax = this._elementMaxScrollOffset();
      if (elementMax === null) return;
      const write = this.pendingWrite;
      const max = Math.max(elementMax, 0) + this._holdOffset;
      if (max >= write.target) return;
      const lowMaxes = write.lowMaxes ?? (write.lowMaxes = []);
      if (lowMaxes[lowMaxes.length - 1] !== max) lowMaxes.push(max);
    };
    this.getMaxScrollOffset = () => (this._elementMaxScrollOffset() ?? 0) + this._holdOffset;
    this._toLayoutOffset = (elementOffset) => {
      var _a;
      let offset = elementOffset + this._holdOffset;
      if (((_a = this.pendingScrollAnchor) == null ? void 0 : _a.kind) === "anchor") {
        offset += this.pendingScrollAnchor.delta;
      }
      return offset;
    };
    this._readTrailing = (elementMax) => {
      if (elementMax === null) return;
      const trailing = elementMax + this.getSize() - this._drawnListEnd;
      this._trailing = trailing > 0 ? trailing : 0;
    };
    this._elementMaxScrollOffset = () => {
      const el = this.scrollElement;
      if (el === null) return null;
      if ("scrollHeight" in el) {
        return this.options.horizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
      }
      if ("document" in el) {
        const doc = el.document.documentElement;
        return this.options.horizontal ? doc.scrollWidth - el.innerWidth : doc.scrollHeight - el.innerHeight;
      }
      return null;
    };
    this._momentumStop = null;
    this._stopMomentum = (done) => {
      const el = this.scrollElement;
      const win = this.targetWindow;
      if (el === null || win === null) return;
      const scroller = "document" in el ? el.document.scrollingElement : el;
      if (!(scroller == null ? void 0 : scroller.style)) return;
      if (this._momentumStop) {
        this._momentumStop.done = done;
        return;
      }
      const { style } = scroller;
      const property = this.options.horizontal ? "overflow-x" : "overflow-y";
      const value = style.getPropertyValue(property);
      const priority = style.getPropertyPriority(property);
      const crossSize = () => this.options.horizontal ? scroller.clientHeight : scroller.clientWidth;
      const crossSizeBefore = crossSize();
      style.setProperty(property, "hidden", "important");
      if (crossSize() !== crossSizeBefore) {
        style.setProperty(property, value, priority);
        return;
      }
      const stop = {
        // False when the app replaced the hidden value: the fling may not
        // have stopped.
        restore: () => {
          if (style.getPropertyValue(property) !== "hidden" || style.getPropertyPriority(property) !== "important") {
            return false;
          }
          style.setProperty(property, value, priority);
          return true;
        },
        done
      };
      this._momentumStop = stop;
      win.requestAnimationFrame(
        () => win.requestAnimationFrame(() => {
          if (this._momentumStop !== stop) return;
          this._momentumStop = null;
          if (stop.restore()) stop.done();
        })
      );
    };
    this._clampedBy = (target) => {
      const elementMax = this._elementMaxScrollOffset();
      if (elementMax === null) return null;
      const maxAtWrite = elementMax + this._holdOffset;
      return target > maxAtWrite + 0.5 ? { target, maxAtWrite } : null;
    };
    this.getVirtualDistanceFromEnd = () => {
      return Math.max(
        this._getLayoutTotalSize() + this.options.scrollMargin - this.getSize() - this.getScrollOffset(),
        0
      );
    };
    this.getDistanceFromEnd = () => {
      return Math.max(this.getMaxScrollOffset() - this.getScrollOffset(), 0);
    };
    this.isAtEnd = (threshold = this.options.scrollEndThreshold) => {
      return this.getDistanceFromEnd() <= threshold;
    };
    this.getOffsetForAlignment = (toOffset, align, itemSize = 0) => {
      if (!this.scrollElement) return 0;
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      if (align === "auto") {
        align = toOffset >= scrollOffset + size ? "end" : "start";
      }
      if (align === "center") {
        toOffset += (itemSize - size) / 2;
      } else if (align === "end") {
        toOffset -= size;
      }
      const maxOffset = this.getMaxScrollOffset();
      return Math.max(Math.min(maxOffset, toOffset), 0);
    };
    this.getOffsetForIndex = (index, align = "auto") => {
      index = Math.max(0, Math.min(index, this.options.count - 1));
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      const item = this.getMeasurements()[index];
      if (!item) return;
      if (align === "auto") {
        if (item.end >= scrollOffset + size - this.options.scrollPaddingEnd) {
          align = "end";
        } else if (item.start <= scrollOffset + this.options.scrollPaddingStart) {
          align = "start";
        } else {
          return [scrollOffset, align];
        }
      }
      if (align === "end" && index === this.options.count - 1) {
        const maxOffset = this.getMaxScrollOffset();
        const toOffset2 = maxOffset - this.options.paddingEnd + this.options.scrollPaddingEnd;
        return [Math.max(Math.min(toOffset2, maxOffset), 0), align];
      }
      const toOffset = align === "end" ? item.end + this.options.scrollPaddingEnd : item.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(toOffset, align, item.size),
        align
      ];
    };
    this.scrollToOffset = (toOffset, { align = "start", behavior = "auto" } = {}) => {
      this._startScroll(
        { index: null, align },
        this.getOffsetForAlignment(toOffset, align),
        behavior,
        "absolute"
      );
    };
    this.scrollToIndex = (index, {
      align: initialAlign = "auto",
      behavior = "auto"
    } = {}) => {
      index = Math.max(0, Math.min(index, this.options.count - 1));
      const offsetInfo = this.getOffsetForIndex(index, initialAlign);
      if (!offsetInfo) return;
      const [offset, align] = offsetInfo;
      this._startScroll({ index, align }, offset, behavior, "absolute");
    };
    this.scrollBy = (delta, { behavior = "auto" } = {}) => {
      const offset = this.getOffsetForAlignment(
        (this.getCommandWrittenOffset() ?? this.getScrollOffset()) + delta,
        "start"
      );
      this._startScroll(
        { index: null, align: "start" },
        offset,
        behavior,
        "relative"
      );
    };
    this.scrollToEnd = ({ behavior = "auto" } = {}) => {
      if (this.options.count > 0) {
        this._startScroll(
          { index: this.options.count - 1, align: "end", toEnd: true },
          Math.max(this.getMaxScrollOffset(), 0),
          behavior,
          "absolute"
        );
        return;
      }
      this.scrollToOffset(Math.max(this.getTotalSize() - this.getSize(), 0), {
        behavior
      });
    };
    this.cancelScroll = () => {
      if (this.rafId != null && this.targetWindow) {
        this.targetWindow.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.scrollState = null;
    };
    this.getTotalSize = () => {
      const total = Math.max(this._getLayoutTotalSize() - this._holdOffset, 0);
      this._drawnListEnd = total + this.options.scrollMargin;
      return total;
    };
    this._getLayoutTotalSize = () => {
      var _a, _b;
      const measurements = this.getMeasurements();
      let end;
      if (measurements.length === 0) {
        end = this.options.scrollMargin + this.options.paddingStart;
      } else if (this.options.lanes === 1) {
        const lastIdx = measurements.length - 1;
        const flat = (_a = this._singleLaneMeasurements) == null ? void 0 : _a.flat;
        if (flat != null) {
          end = flat[lastIdx * 2] + flat[lastIdx * 2 + 1];
        } else {
          end = ((_b = measurements[lastIdx]) == null ? void 0 : _b.end) ?? 0;
        }
      } else {
        const endByLane = Array(this.options.lanes).fill(null);
        let endIndex = measurements.length - 1;
        while (endIndex >= 0 && endByLane.some((val) => val === null)) {
          const item = measurements[endIndex];
          if (endByLane[item.lane] === null) {
            endByLane[item.lane] = item.end;
          }
          endIndex--;
        }
        end = Math.max(...endByLane.filter((val) => val !== null));
      }
      return Math.max(
        end - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    };
    this.takeSnapshot = () => {
      const snapshot = [];
      if (this.itemSizeCache.size === 0) return snapshot;
      const m = this.getMeasurements();
      for (const item of m) {
        if (item && this.itemSizeCache.has(item.key)) {
          snapshot.push({
            index: item.index,
            key: item.key,
            start: item.start,
            size: item.size,
            end: item.end,
            lane: item.lane
          });
        }
      }
      return snapshot;
    };
    this._scrollToOffset = (offset, {
      adjustments,
      behavior
    } = {}) => {
      const write = {
        target: offset + (adjustments ?? 0),
        smooth: behavior === "smooth"
      };
      this.pendingWrite = write;
      this.options.scrollToFn(
        offset - this._holdOffset,
        { behavior, adjustments },
        this
      );
      return write;
    };
    this.getCommandWrittenOffset = () => this.scrollState !== null && this.pendingWrite !== null && !this.pendingWrite.smooth ? this.pendingWrite.target : null;
    this._awaitingCommandReadBack = () => {
      const writtenOffset = this.getCommandWrittenOffset();
      return !(isIOSWebKit() && this._iosGesture.dragging()) && writtenOffset !== null && !approxEqual(writtenOffset, this.getScrollOffset());
    };
    this._followOffsetTarget = (delta) => {
      if (this.scrollState !== null && this.scrollState.index == null) {
        this.scrollState.lastTargetOffset += delta;
      }
    };
    this._landedBeforeAnchor = (state, delta) => state.phase !== "queued" && (state.stableFrames > 0 || approxEqual(this.getScrollOffset() - delta, state.lastTargetOffset));
    this._followAnchor = (delta) => {
      this._followOffsetTarget(delta);
      const state = this.scrollState;
      if ((state == null ? void 0 : state.index) != null && !state.toEnd && this._landedBeforeAnchor(state, delta)) {
        this.scrollState = null;
      }
    };
    this.measure = () => {
      this.pendingMin = null;
      this.itemSizeCache.clear();
      this.laneAssignments.clear();
      this.itemSizeCacheVersion++;
      this.notify(false);
    };
    this.setOptions(opts);
  }
  /**
   * @deprecated Always 0: a scroll correction is folded into `scrollOffset`
   * at once, so there is never an outstanding adjustment to add to it. Read
   * `scrollOffset` alone.
   */
  get scrollAdjustments() {
    return 0;
  }
  // Returns `true` when it performed a synchronous `scrollTop` write this
  // tick, `false` when the delta was zero or the write was deferred (iOS).
  // `resizeItem` uses that to decide whether the follow-up `notify` must be
  // synchronous so the grown transforms commit in the same paint (#1227).
  applyScrollAdjustment(delta, behavior) {
    if (delta === 0) return false;
    if (this.options.debug) {
      console.info("correction", delta);
    }
    this._followOffsetTarget(delta);
    if (!this._canWriteScroll()) {
      this._holdOffset += delta;
      if (this.scrollOffset !== null) this.scrollOffset += delta;
      return true;
    } else {
      const offset = this.getScrollOffset();
      this._clampedAdjustment = this._clampedBy(offset + delta);
      const write = this._scrollToOffset(offset, {
        adjustments: delta,
        behavior
      });
      if (this.scrollOffset !== null) {
        if (this.pendingWrite === write) this.scrollOffset += delta;
        if (this.scrollOffset < 0) this.scrollOffset = 0;
      }
      return true;
    }
  }
  scheduleScrollReconcile() {
    if (!this.targetWindow) {
      this.scrollState = null;
      return;
    }
    if (this.rafId != null) return;
    this.rafId = this.targetWindow.requestAnimationFrame(() => {
      this.rafId = null;
      this.reconcileScroll();
    });
  }
  getScrollStateTarget(state) {
    const offsetInfo = state.toEnd ? [Math.max(this.getMaxScrollOffset(), 0)] : state.index != null ? this.getOffsetForIndex(state.index, state.align) : void 0;
    return offsetInfo ? offsetInfo[0] : state.lastTargetOffset;
  }
  reconcileScroll() {
    if (!this.scrollState) return;
    const el = this.scrollElement;
    if (!el) return;
    const MAX_RECONCILE_MS = 5e3;
    if (this.now() - this.scrollState.startedAt > MAX_RECONCILE_MS) {
      this.scrollState = null;
      return;
    }
    if (this.scrollState.phase === "queued") {
      this.scheduleScrollReconcile();
      return;
    }
    this.getMeasurements();
    const targetOffset = this.getScrollStateTarget(this.scrollState);
    const STABLE_FRAMES = this.scrollState.index == null ? 1 : this.options.useAnimationFrameWithResizeObserver ? 3 : 2;
    const targetChanged = targetOffset !== this.scrollState.lastTargetOffset;
    if (!targetChanged && approxEqual(targetOffset, this.getScrollOffset())) {
      if (this.scrollState.phase === "smooth") {
        this.scrollState.phase = "smoothLanded";
      } else if (this.scrollState.phase === "smoothFinishing") {
        this.scrollState.phase = "instant";
      }
      this.scrollState.stableFrames++;
      if (this.scrollState.stableFrames >= STABLE_FRAMES) {
        if (this.getScrollOffset() !== targetOffset) {
          this._scrollToOffset(targetOffset, { behavior: "auto" });
        }
        this.scrollState = null;
        return;
      }
    } else {
      this.scrollState.stableFrames = 0;
      if (targetChanged) {
        const viewport = this.getSize() || 600;
        const distance = Math.abs(targetOffset - this.getScrollOffset());
        const keepSmooth = isSmoothScroll(this.scrollState) && distance > viewport;
        this.scrollState.lastTargetOffset = targetOffset;
        if (keepSmooth) {
          this.scrollState.phase = "smooth";
        } else if (this.scrollState.phase === "smooth") {
          this.scrollState.phase = "smoothFinishing";
        } else if (this.scrollState.phase === "smoothLanded") {
          this.scrollState.phase = "instant";
        }
        this._scrollToOffset(targetOffset, {
          behavior: keepSmooth ? "smooth" : "auto"
        });
      }
    }
    this.scheduleScrollReconcile();
  }
  // Every scroll command starts here: it becomes the in-flight command,
  // writes its first target and leaves reconcile to retarget and retire it.
  //
  // Targets are layout offsets. A held correction is not dropped by a
  // command: the write lands the element `_holdOffset` short of the target,
  // under the rows exposed shifted by the same amount, and the flush moves
  // both together once a write is possible.
  //
  // An index or end target that is already at its offset starts a smooth
  // scroll as landed; an offset target never does, so its first scroll
  // event is read as the user's (see the scroll handler in `_willUpdate`).
  _startScroll(target, offset, behavior, kind) {
    this.pendingScrollAnchor = null;
    this._clampedAdjustment = null;
    const tail = this._iosGesture.tail();
    if (kind === "absolute" && tail !== null) {
      if (tail === "fling" && momentumOverridesWrites()) {
        this._stopMomentum(() => {
          const state = this.scrollState;
          if ((state == null ? void 0 : state.phase) !== "queued" || // A finger came down: it owns the scroll until it lifts.
          this._iosGesture.tail() !== "fling" || // In a bounce WebKit can drop the write (#1287): the tail
          // decides, as without the stop. (Not `flingCaught`: our stop
          // also ends the fling at speed, so a slow frame would read as
          // a catch and the tail would drop the command.)
          this._reportedOverscroll) {
            return;
          }
          this._iosGesture.end();
          this._flushHoldIfReady(true);
          this._writeAwaitingCommand();
        });
        this.scrollState = {
          ...target,
          startedAt: this.now(),
          lastTargetOffset: offset,
          stableFrames: 0,
          phase: "queued",
          behavior,
          samples: []
        };
        this.scheduleScrollReconcile();
        return;
      }
      this._iosGesture.end();
    }
    this.scrollState = {
      ...target,
      startedAt: this.now(),
      lastTargetOffset: offset,
      stableFrames: 0,
      behavior,
      phase: initialScrollPhase(
        behavior,
        target.index != null && approxEqual(offset, this.getScrollOffset())
      )
    };
    this._scrollToOffset(offset, { behavior });
    this.scheduleScrollReconcile();
  }
};
var findNearestBinarySearch = (low, high, getCurrentValue, value) => {
  while (low <= high) {
    const middle = (low + high) / 2 | 0;
    const currentValue = getCurrentValue(middle);
    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
function findNearestBinarySearchFlat(flat, high, value) {
  let low = 0;
  while (low <= high) {
    const middle = (low + high) / 2 | 0;
    const currentValue = flat[middle * 2];
    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }
  return low > 0 ? low - 1 : 0;
}
function calculateRangeImpl(measurements, outerSize, scrollOffset, lanes, flat) {
  const lastIndex = measurements.length - 1;
  if (measurements.length <= lanes) {
    return { startIndex: 0, endIndex: lastIndex };
  }
  if (lanes === 1 && flat !== null) {
    const startIndex2 = findNearestBinarySearchFlat(
      flat,
      lastIndex,
      scrollOffset
    );
    let endIndex2 = startIndex2;
    const limit = scrollOffset + outerSize;
    while (endIndex2 < lastIndex && flat[endIndex2 * 2] + flat[endIndex2 * 2 + 1] < limit) {
      endIndex2++;
    }
    return { startIndex: startIndex2, endIndex: endIndex2 };
  }
  const getStart = (index) => measurements[index].start;
  let startIndex = findNearestBinarySearch(0, lastIndex, getStart, scrollOffset);
  let endIndex = startIndex;
  if (lanes === 1) {
    while (endIndex < lastIndex && measurements[endIndex].end < scrollOffset + outerSize) {
      endIndex++;
    }
  } else if (lanes > 1) {
    const endPerLane = Array(lanes).fill(0);
    while (endIndex < lastIndex && endPerLane.some((pos) => pos < scrollOffset + outerSize)) {
      const item = measurements[endIndex];
      endPerLane[item.lane] = item.end;
      endIndex++;
    }
    const startPerLane = Array(lanes).fill(scrollOffset + outerSize);
    while (startIndex >= 0 && startPerLane.some((pos) => pos >= scrollOffset)) {
      const item = measurements[startIndex];
      startPerLane[item.lane] = item.start;
      startIndex--;
    }
    startIndex = Math.max(0, startIndex - startIndex % lanes);
    endIndex = Math.min(lastIndex, endIndex + (lanes - 1 - endIndex % lanes));
  }
  return { startIndex, endIndex };
}

// node_modules/@tanstack/react-virtual/dist/esm/index.js
var useIsomorphicLayoutEffect = typeof document !== "undefined" ? React6.useLayoutEffect : React6.useEffect;
function useVirtualizerBase({
  useFlushSync = true,
  directDomUpdates = false,
  directDomUpdatesMode = "transform",
  ...options
}) {
  const [, dispatch] = React6.useReducer((x) => x + 1, 0);
  const rerender = React6.useRef(dispatch).current;
  const directRef = React6.useRef({
    enabled: directDomUpdates,
    mode: directDomUpdatesMode,
    container: null,
    lastSize: null,
    // Keyed by the element itself so a remounted node (same key, new DOM
    // node — e.g. when `enabled` is toggled off then on) is treated as fresh
    // and gets its style written.
    lastPositions: /* @__PURE__ */ new WeakMap(),
    prevRange: null
  });
  directRef.current.enabled = directDomUpdates;
  directRef.current.mode = directDomUpdatesMode;
  const measuringFromRef = React6.useRef(false);
  const applyContainerSize = (instance2) => {
    const state = directRef.current;
    if (!state.enabled || !state.container) return;
    const totalSize = instance2.getTotalSize();
    if (totalSize !== state.lastSize) {
      state.lastSize = totalSize;
      const sizeAxis = instance2.options.horizontal ? "width" : "height";
      state.container.style[sizeAxis] = `${totalSize}px`;
    }
  };
  const applyItemPosition = (instance2, item, el) => {
    const state = directRef.current;
    const horizontal = !!instance2.options.horizontal;
    const next = item.start - instance2.options.scrollMargin;
    if (state.lastPositions.get(el) === next) return;
    state.lastPositions.set(el, next);
    if (state.mode === "transform") {
      el.style.transform = horizontal ? `translate3d(${next}px, 0, 0)` : `translate3d(0, ${next}px, 0)`;
    } else {
      el.style[horizontal ? "left" : "top"] = `${next}px`;
    }
  };
  const applyDirectStyles = (instance2) => {
    const state = directRef.current;
    if (!state.enabled || !state.container) return;
    applyContainerSize(instance2);
    for (const item of instance2.getVirtualItems()) {
      const el = instance2.elementsCache.get(item.key);
      if (el) applyItemPosition(instance2, item, el);
    }
  };
  const resolvedOptions = {
    ...options,
    onChange: (instance2, sync) => {
      var _a;
      const state = directRef.current;
      let shouldRerender = true;
      if (state.enabled) {
        applyDirectStyles(instance2);
        const range = instance2.range;
        const prev = state.prevRange;
        shouldRerender = !prev || prev.isScrolling !== instance2.isScrolling || prev.startIndex !== (range == null ? void 0 : range.startIndex) || prev.endIndex !== (range == null ? void 0 : range.endIndex);
        if (shouldRerender) {
          state.prevRange = range ? {
            startIndex: range.startIndex,
            endIndex: range.endIndex,
            isScrolling: instance2.isScrolling
          } : null;
        }
      }
      if (shouldRerender) {
        if (useFlushSync && sync && !measuringFromRef.current) {
          (0, import_react_dom.flushSync)(rerender);
        } else {
          rerender();
        }
      }
      (_a = options.onChange) == null ? void 0 : _a.call(options, instance2, sync);
    }
  };
  const [instance] = React6.useState(() => {
    const v = new Virtualizer(resolvedOptions);
    const measureElement2 = v.measureElement;
    v.measureElement = (node) => {
      measuringFromRef.current = true;
      try {
        measureElement2(node);
      } finally {
        measuringFromRef.current = false;
      }
      const state = directRef.current;
      if (node !== null && state.enabled && state.container) {
        const item = v.measurementsCache[v.indexFromElement(node)];
        if (item) applyItemPosition(v, item, node);
      }
    };
    return Object.assign(v, {
      containerRef: (node) => {
        const state = directRef.current;
        state.container = node;
        state.lastSize = null;
        if (node !== null) {
          applyDirectStyles(v);
        }
      }
    });
  });
  instance.setOptions(resolvedOptions);
  useIsomorphicLayoutEffect(() => {
    return instance._didMount();
  }, []);
  useIsomorphicLayoutEffect(() => {
    applyContainerSize(instance);
    return instance._willUpdate();
  });
  useIsomorphicLayoutEffect(() => {
    applyDirectStyles(instance);
  });
  return instance;
}
function useVirtualizer(options) {
  return useVirtualizerBase({
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
    ...options
  });
}

// src/FilterChip.jsx
var import_react7 = __toESM(require("react"), 1);
function FilterChip({ selected, label: label2, onClick, title, disabled = false }) {
  return /* @__PURE__ */ import_react7.default.createElement(
    "button",
    {
      type: "button",
      title,
      "aria-pressed": selected,
      disabled,
      onClick,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        height: 24,
        padding: selected ? "0 8px 0 5px" : "0 9px",
        borderRadius: 8,
        fontSize: 11,
        lineHeight: 1,
        whiteSpace: "nowrap",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        color: selected ? "inherit" : "var(--dsw-alias-label-secondary, rgba(200,200,200,0.75))",
        background: selected ? selectionFill(20) : "transparent",
        border: `1px solid ${selected ? "var(--dsw-alias-brand-primary, rgba(120,190,145,0.8))" : "var(--dsw-alias-border-l1, rgba(127,127,127,0.28))"}`,
        transition: "background 120ms ease, border-color 120ms ease"
      }
    },
    selected ? /* @__PURE__ */ import_react7.default.createElement(Icon, { name: "check", size: 13 }) : null,
    label2
  );
}

// src/useLocale.js
var import_react8 = require("react");
function useLocaleRevision() {
  return (0, import_react8.useSyncExternalStore)(subscribe, getRevision, getRevision);
}

// src/ResultPane.jsx
var import_react9 = __toESM(require("react"), 1);

// src/format.js
function gigabytes(bytes) {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) return "\u2014";
  return (bytes / 1024 ** 3).toFixed(1);
}
function usedPercent(total, free, fallback = 0) {
  if (typeof total !== "number" || typeof free !== "number" || total <= 0) return fallback;
  return Math.round((total - free) / total * 100);
}
function downloadName(recordId, prompt = "", maxChars = 40) {
  const slug = String(prompt).replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, maxChars).replace(/-+$/g, "");
  const suffix = String(recordId).slice(-4);
  return slug === "" ? `moss-${suffix}.png` : `${slug}-${suffix}.png`;
}

// src/ResultPane.jsx
var dim2 = { color: "var(--dsw-alias-label-secondary, inherit)" };
var button2 = {
  padding: "2px 8px",
  fontSize: 11,
  color: "inherit",
  background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))",
  border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
  borderRadius: 6,
  cursor: "pointer"
};
var iconOnly2 = {
  ...button2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  padding: 0
};
var iconDanger2 = { ...iconOnly2, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" };
function ResultPane({
  orientation = "row",
  shownRecordId,
  shownHasImage,
  shownRunning,
  imageBroken,
  onImageError,
  activeRecord,
  activeRecordId,
  onZoom,
  onLoad,
  onRemove,
  onRetry,
  error
}) {
  const meta = activeRecord?.result ?? null;
  const actions = /* @__PURE__ */ import_react9.default.createElement("div", { style: { display: "flex", gap: 2, flexShrink: 0 } }, activeRecord?.status === "failed" ? /* @__PURE__ */ import_react9.default.createElement("button", { type: "button", style: iconOnly2, title: t("result.retryTitle"), "aria-label": t("result.retry"), onClick: () => onRetry?.(activeRecord) }, /* @__PURE__ */ import_react9.default.createElement(Icon, { name: "refresh", size: 14 })) : null, /* @__PURE__ */ import_react9.default.createElement("button", { type: "button", style: iconOnly2, title: t("result.loadTitle"), "aria-label": t("result.load"), disabled: activeRecord === null, onClick: onLoad }, /* @__PURE__ */ import_react9.default.createElement(Icon, { name: "settings_backup_restore", size: 14 })), /* @__PURE__ */ import_react9.default.createElement(
    "button",
    {
      type: "button",
      style: iconDanger2,
      title: t("result.deleteTitle"),
      "aria-label": t("result.delete"),
      disabled: activeRecordId === null,
      onClick: onRemove
    },
    /* @__PURE__ */ import_react9.default.createElement(Icon, { name: "delete", size: 14 })
  ), shownRecordId !== null ? /* @__PURE__ */ import_react9.default.createElement(
    "a",
    {
      href: imageUrl(shownRecordId),
      download: downloadName(shownRecordId, activeRecord?.prompt ?? ""),
      title: t("result.downloadTitle"),
      "aria-label": t("result.download"),
      style: { ...iconOnly2, textDecoration: "none" }
    },
    /* @__PURE__ */ import_react9.default.createElement(Icon, { name: "download", size: 14 })
  ) : null);
  const image = /* @__PURE__ */ import_react9.default.createElement(
    "div",
    {
      onClick: () => {
        if (shownHasImage) onZoom();
      },
      style: {
        // The frame is the constraint: the picture fills it and letterboxes
        // itself. Relying on `max-height: 100%` for the <img> meant a percentage
        // against an auto-height box, which left the bottom of tall images
        // clipped once the strip got short.
        position: "relative",
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.08))",
        borderRadius: 8,
        overflow: "hidden",
        cursor: shownHasImage ? "zoom-in" : "default"
      }
    },
    shownRecordId !== null && shownHasImage && !imageBroken ? /* @__PURE__ */ import_react9.default.createElement(
      "img",
      {
        src: imageUrl(shownRecordId),
        alt: t("result.imageAlt"),
        onError: onImageError,
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block"
        }
      }
    ) : shownRunning ? /* @__PURE__ */ import_react9.default.createElement("span", { style: { fontSize: 12, ...dim2 } }, t("generate.pending", { id: shownRecordId.slice(-4) })) : /* @__PURE__ */ import_react9.default.createElement("span", { style: { fontSize: 11, ...dim2 } }, imageBroken ? t("result.imageFailed") : t("result.empty"))
  );
  const metaLine = /* @__PURE__ */ import_react9.default.createElement("span", { style: { fontSize: 11, ...dim2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, activeRecord?.id ?? t("result.noSelection"), meta !== null ? ` \xB7 ${meta.width}\xD7${meta.height} \xB7 ${meta.seconds}s \xB7 seed ${activeRecord?.params?.seed}` : "");
  if (orientation === "column") {
    return /* @__PURE__ */ import_react9.default.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0, gap: 6, padding: 8 } }, /* @__PURE__ */ import_react9.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 } }, metaLine, /* @__PURE__ */ import_react9.default.createElement("span", { style: { flex: 1 } }), actions), image, error !== "" ? /* @__PURE__ */ import_react9.default.createElement("div", { style: { fontSize: 11, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" } }, error) : null);
  }
  return /* @__PURE__ */ import_react9.default.createElement("div", { style: { display: "flex", height: "100%", minHeight: 0, gap: 8, padding: 8 } }, image, /* @__PURE__ */ import_react9.default.createElement("div", { style: { width: 168, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4, fontSize: 11 } }, /* @__PURE__ */ import_react9.default.createElement("span", { style: { ...dim2 } }, activeRecord?.id ?? t("result.noSelection")), meta !== null ? /* @__PURE__ */ import_react9.default.createElement("span", { style: { ...dim2 } }, meta.width, "\xD7", meta.height, " \xB7 ", meta.seconds, "s \xB7 seed ", activeRecord?.params?.seed) : null, /* @__PURE__ */ import_react9.default.createElement("div", { style: { marginTop: 2 } }, actions), activeRecord?.error?.message ? /* @__PURE__ */ import_react9.default.createElement("span", { style: { color: "var(--dsw-alias-state-error-primary, #ff8f7a)" } }, activeRecord.error.message) : null, error !== "" ? /* @__PURE__ */ import_react9.default.createElement("div", { style: { fontSize: 11, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" } }, error) : null));
}

// src/ConfirmDialog.jsx
var import_react10 = __toESM(require("react"), 1);
var button3 = {
  padding: "5px 14px",
  fontSize: 12,
  color: "inherit",
  background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))",
  border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.24))",
  borderRadius: 6,
  cursor: "pointer"
};
var danger = {
  ...button3,
  background: "var(--dsw-alias-state-error-primary, #d9534f)",
  borderColor: "transparent",
  color: "#fff",
  fontWeight: 600
};
function ConfirmDialog({ title, message, detail, confirmLabel = t("action.delete"), onConfirm, onCancel }) {
  const cardRef = (0, import_react10.useRef)(null);
  const cancelRef = (0, import_react10.useRef)(null);
  useDialogFocus(cardRef, { initialFocus: cancelRef });
  (0, import_react10.useEffect)(() => {
    cancelRef.current?.focus();
    function onKey(event) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return /* @__PURE__ */ import_react10.default.createElement(
    "div",
    {
      className: "moss-studio",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(0,0,0,0.62)",
        display: "grid",
        placeItems: "center",
        padding: 24
      },
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) onCancel();
      }
    },
    /* @__PURE__ */ import_react10.default.createElement(ScopeStyles, null),
    /* @__PURE__ */ import_react10.default.createElement(
      "div",
      {
        ref: cardRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": title,
        style: {
          width: "min(92vw, 420px)",
          background: "var(--dsw-alias-bg-overlay, Canvas)",
          color: "var(--dsw-alias-label-primary, CanvasText)",
          border: "1px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.28))",
          borderRadius: 12,
          boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          overflow: "hidden",
          fontSize: 12
        }
      },
      /* @__PURE__ */ import_react10.default.createElement("div", { style: { padding: "12px 14px 4px", fontSize: 13 } }, title),
      /* @__PURE__ */ import_react10.default.createElement("div", { style: { padding: "0 14px", lineHeight: 1.7 } }, /* @__PURE__ */ import_react10.default.createElement("div", null, message), detail !== void 0 && detail !== "" ? /* @__PURE__ */ import_react10.default.createElement(
        "div",
        {
          style: {
            marginTop: 6,
            padding: "6px 8px",
            borderRadius: 6,
            background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))",
            color: "var(--dsw-alias-label-secondary, inherit)",
            maxHeight: 96,
            overflow: "hidden",
            wordBreak: "break-word"
          }
        },
        detail
      ) : null),
      /* @__PURE__ */ import_react10.default.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6, padding: "12px 14px" } }, /* @__PURE__ */ import_react10.default.createElement("button", { type: "button", ref: cancelRef, style: button3, onClick: onCancel }, t("action.cancel")), /* @__PURE__ */ import_react10.default.createElement("button", { type: "button", style: danger, onClick: onConfirm }, confirmLabel))
    )
  );
}

// src/SettingsDialog.jsx
var import_react11 = __toESM(require("react"), 1);
var row2 = { display: "flex", alignItems: "center", gap: 6 };
var dim3 = { color: "var(--dsw-alias-label-secondary, inherit)" };
var input2 = {
  flex: 1,
  minWidth: 0,
  boxSizing: "border-box",
  padding: "5px 7px",
  fontSize: 12,
  color: "inherit",
  background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))",
  border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
  borderRadius: 6,
  fontFamily: "inherit"
};
var button4 = {
  padding: "4px 12px",
  fontSize: 12,
  color: "inherit",
  background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))",
  border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.24))",
  borderRadius: 6,
  cursor: "pointer"
};
var primary = {
  ...button4,
  background: "var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))",
  borderColor: "transparent",
  color: "var(--dsw-alias-button-primary-label, #0d120f)",
  fontWeight: 600
};
function SettingsDialog({ onClose, onSaved }) {
  const [loading, setLoading] = (0, import_react11.useState)(true);
  const [comfyUrl, setComfyUrl] = (0, import_react11.useState)("");
  const [retention, setRetention] = (0, import_react11.useState)("0");
  const [defaults, setDefaults] = (0, import_react11.useState)({ size: "1024x1024", steps: "25", cfg: "2.5", negative: "" });
  const [editable, setEditable] = (0, import_react11.useState)(false);
  const [wiring, setWiring] = (0, import_react11.useState)(null);
  const [saving, setSaving] = (0, import_react11.useState)(false);
  const [error, setError] = (0, import_react11.useState)("");
  const [notice, setNotice] = (0, import_react11.useState)("");
  const titleId = (0, import_react11.useId)();
  const cardRef = (0, import_react11.useRef)(null);
  const urlRef = (0, import_react11.useRef)(null);
  useDialogFocus(cardRef, { initialFocus: urlRef, ready: !loading && editable });
  (0, import_react11.useEffect)(() => {
    let alive = true;
    void (async () => {
      try {
        const state = await fetchSettings();
        if (!alive) return;
        setComfyUrl(state.settings?.comfyUrl ?? "");
        setRetention(String(state.settings?.retention ?? 0));
        setDefaults({
          size: state.settings?.defaults?.size ?? "1024x1024",
          steps: String(state.settings?.defaults?.steps ?? 25),
          cfg: String(state.settings?.defaults?.cfg ?? 2.5),
          negative: state.settings?.defaults?.negative ?? ""
        });
        setEditable(state.settings?.editable === true);
        setWiring(state.wiring ?? null);
        setError("");
      } catch (problem) {
        if (alive) setError(problem instanceof Error ? problem.message : String(problem));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  (0, import_react11.useEffect)(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const save = (0, import_react11.useCallback)(async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await saveSettings({
        comfyUrl,
        retention: Number(retention) || 0,
        defaults: {
          size: defaults.size,
          steps: Number(defaults.steps),
          cfg: Number(defaults.cfg),
          negative: defaults.negative
        }
      });
      if (result.status === 200) {
        const next = result.body?.settings ?? {};
        setComfyUrl(next.comfyUrl ?? comfyUrl);
        setNotice(t("settings.saved"));
        onSaved?.(next.comfyUrl ?? comfyUrl);
      } else {
        setError(result.body?.message ?? t("error.save", { status: result.status }));
      }
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setSaving(false);
    }
  }, [comfyUrl, retention, defaults, onSaved]);
  return /* @__PURE__ */ import_react11.default.createElement(
    "div",
    {
      className: "moss-studio",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(0,0,0,0.62)",
        display: "grid",
        placeItems: "center",
        padding: 24
      },
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) onClose();
      }
    },
    /* @__PURE__ */ import_react11.default.createElement(ScopeStyles, null),
    /* @__PURE__ */ import_react11.default.createElement(
      "div",
      {
        ref: cardRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        style: {
          display: "flex",
          flexDirection: "column",
          width: "min(92vw, 520px)",
          maxHeight: "min(88vh, 640px)",
          background: "var(--dsw-alias-bg-overlay, Canvas)",
          color: "var(--dsw-alias-label-primary, CanvasText)",
          border: "1px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.28))",
          borderRadius: 12,
          boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          overflow: "hidden",
          fontSize: 12
        }
      },
      /* @__PURE__ */ import_react11.default.createElement("div", { style: { ...row2, justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))" } }, /* @__PURE__ */ import_react11.default.createElement("span", { id: titleId, style: { fontSize: 13 } }, t("settings.title")), /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", style: { ...button4, padding: 4, border: "none", background: "transparent" }, "aria-label": t("settings.close"), title: t("action.close"), onClick: onClose }, /* @__PURE__ */ import_react11.default.createElement(Icon, { name: "close", size: 16 }))),
      /* @__PURE__ */ import_react11.default.createElement("div", { style: { padding: "10px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 } }, loading ? /* @__PURE__ */ import_react11.default.createElement("div", { style: { ...dim3 } }, t("settings.loading")) : null, /* @__PURE__ */ import_react11.default.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11 } }, t("settings.comfyUrl")), /* @__PURE__ */ import_react11.default.createElement(
        "input",
        {
          ref: urlRef,
          value: comfyUrl,
          onChange: (event) => {
            setComfyUrl(event.target.value);
            setNotice("");
          },
          onKeyDown: (event) => {
            if (event.key === "Enter") void save();
          },
          disabled: !editable || saving,
          placeholder: "http://127.0.0.1:8188",
          "aria-label": t("settings.comfyUrl"),
          style: { ...input2, flex: "0 0 auto", alignSelf: "stretch", height: 30 }
        }
      ), /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11 } }, editable ? t("settings.comfyUrlHint") : t("settings.comfyUrlReadOnly"))), /* @__PURE__ */ import_react11.default.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11 } }, t("settings.retention")), /* @__PURE__ */ import_react11.default.createElement(
        "input",
        {
          type: "number",
          min: 0,
          step: 10,
          value: retention,
          onChange: (event) => {
            setRetention(event.target.value);
            setNotice("");
          },
          disabled: !editable || saving,
          "aria-label": t("settings.retentionAria"),
          style: { ...input2, flex: "0 0 auto", alignSelf: "flex-start", width: 120, height: 28 }
        }
      ), /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11 } }, t("settings.retentionHint"))), /* @__PURE__ */ import_react11.default.createElement("div", { style: { borderTop: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))", paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 } }, /* @__PURE__ */ import_react11.default.createElement("span", { style: { fontSize: 11, ...dim3 } }, t("settings.defaults")), /* @__PURE__ */ import_react11.default.createElement("div", { style: { ...row2, gap: 6 } }, /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11, minWidth: 56 } }, t("size.label")), /* @__PURE__ */ import_react11.default.createElement(
        "input",
        {
          value: defaults.size,
          onChange: (event) => setDefaults((current) => ({ ...current, size: event.target.value })),
          disabled: !editable || saving,
          "aria-label": t("settings.defaultSize"),
          style: { ...input2, flex: "0 0 120px", width: 120 }
        }
      ), /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11 } }, t("settings.defaultSizeHint"))), /* @__PURE__ */ import_react11.default.createElement("div", { style: { ...row2, gap: 6 } }, /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11, minWidth: 56 } }, t("params.steps")), /* @__PURE__ */ import_react11.default.createElement(
        "input",
        {
          type: "number",
          min: 1,
          max: 200,
          value: defaults.steps,
          onChange: (event) => setDefaults((current) => ({ ...current, steps: event.target.value })),
          disabled: !editable || saving,
          "aria-label": t("settings.defaultSteps"),
          style: { ...input2, flex: "0 0 90px", width: 90 }
        }
      ), /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11, minWidth: 32 } }, "CFG"), /* @__PURE__ */ import_react11.default.createElement(
        "input",
        {
          type: "number",
          min: 0,
          max: 30,
          step: 0.1,
          value: defaults.cfg,
          onChange: (event) => setDefaults((current) => ({ ...current, cfg: event.target.value })),
          disabled: !editable || saving,
          "aria-label": t("settings.defaultCfg"),
          style: { ...input2, flex: "0 0 90px", width: 90 }
        }
      )), /* @__PURE__ */ import_react11.default.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11 } }, t("params.negative")), /* @__PURE__ */ import_react11.default.createElement(
        "textarea",
        {
          value: defaults.negative,
          onChange: (event) => setDefaults((current) => ({ ...current, negative: event.target.value })),
          disabled: !editable || saving,
          rows: 2,
          "aria-label": t("settings.defaultNegative"),
          style: { ...input2, flex: "0 0 auto", resize: "vertical", fontFamily: "inherit" }
        }
      ))), wiring !== null ? /* @__PURE__ */ import_react11.default.createElement("div", { style: { borderTop: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))", paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 } }, /* @__PURE__ */ import_react11.default.createElement("span", { style: { fontSize: 11, ...dim3 } }, t("settings.wiring")), /* @__PURE__ */ import_react11.default.createElement(ReadOnly, { label: t("settings.dataDir"), value: wiring.dataDir }), /* @__PURE__ */ import_react11.default.createElement(ReadOnly, { label: t("settings.workflow"), value: wiring.workflowPath }), /* @__PURE__ */ import_react11.default.createElement(ReadOnly, { label: t("settings.timeouts"), value: t("settings.timeoutValue", { seconds: Math.round((wiring.timeoutMs ?? 0) / 1e3), ms: wiring.pollMs ?? 0 }) })) : null, notice !== "" ? /* @__PURE__ */ import_react11.default.createElement("div", { style: { fontSize: 11, color: "var(--dsw-alias-state-success-primary, #5fbf7f)" } }, notice) : null, error !== "" ? /* @__PURE__ */ import_react11.default.createElement("div", { style: { fontSize: 11, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" } }, error) : null),
      /* @__PURE__ */ import_react11.default.createElement("div", { style: { ...row2, justifyContent: "flex-end", gap: 6, padding: "8px 12px", borderTop: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))" } }, /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", style: button4, onClick: onClose }, t("action.close")), /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", style: primary, disabled: !editable || saving, onClick: () => void save() }, saving ? t("status.saving") : t("action.save")))
    )
  );
}
function ReadOnly({ label: label2, value }) {
  return /* @__PURE__ */ import_react11.default.createElement("div", { style: { ...row2, alignItems: "baseline" } }, /* @__PURE__ */ import_react11.default.createElement("span", { style: { ...dim3, fontSize: 11, minWidth: 84 } }, label2), /* @__PURE__ */ import_react11.default.createElement("span", { style: { fontSize: 11, wordBreak: "break-all", opacity: 0.85 } }, value ?? "\u2014"));
}

// src/ui-prefs.js
var KEY = "moss-studio.ui";
var DEFAULT_UI = Object.freeze({
  resultHeight: 240,
  resultCollapsed: false,
  // A 360px sidebar cannot afford a 196px history column: the parameter column
  // was left about 150px wide, which clipped inputs and made the prompt
  // textarea barely usable. Narrow starts collapsed and opens on demand.
  historyWidth: { narrow: 160, wide: 280 },
  historyOpen: { narrow: false, wide: true },
  // The prompt box is resizeable; remember the height the user dragged to.
  promptHeight: 108
});
function clamp2(value, min, max, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
function memoryStorage() {
  if (typeof localStorage === "undefined") return void 0;
  return localStorage;
}
function loadUiPrefs(storage = memoryStorage()) {
  const defaults = { ...DEFAULT_UI, historyWidth: { ...DEFAULT_UI.historyWidth } };
  if (storage === void 0) return defaults;
  let raw;
  try {
    raw = JSON.parse(storage.getItem(KEY) ?? "null");
  } catch {
    raw = null;
  }
  if (raw === null || typeof raw !== "object") return defaults;
  return {
    resultHeight: clamp2(raw.resultHeight, 120, 720, DEFAULT_UI.resultHeight),
    resultCollapsed: raw.resultCollapsed === true,
    promptHeight: clamp2(raw.promptHeight, 72, 520, DEFAULT_UI.promptHeight),
    historyOpen: {
      narrow: raw.historyOpen?.narrow ?? DEFAULT_UI.historyOpen.narrow,
      wide: raw.historyOpen?.wide ?? DEFAULT_UI.historyOpen.wide
    },
    historyWidth: {
      narrow: clamp2(raw.historyWidth?.narrow, 140, 420, DEFAULT_UI.historyWidth.narrow),
      wide: clamp2(raw.historyWidth?.wide, 160, 420, DEFAULT_UI.historyWidth.wide)
    }
  };
}
function saveUiPrefs(patch, storage = memoryStorage()) {
  if (storage === void 0) return;
  const next = { ...loadUiPrefs(storage), ...patch };
  try {
    storage.setItem(KEY, JSON.stringify(next));
  } catch {
  }
}

// src/size.js
var MIN_PIXELS = 512 * 512;
var MAX_PIXELS = 2048 * 2048;
var SIZE_PRESETS = ["1024x1024", "768x1024", "1024x768", "896x1152", "1152x896", "512x512"];
function formatSize(width, height) {
  return `${width}x${height}`;
}
function sizeProblem(width, height, widthText, heightText) {
  if (String(widthText).trim() === "" || String(heightText).trim() === "") return t("size.errorEmpty");
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) {
    return t("size.errorPositive");
  }
  if (width % 16 !== 0 || height % 16 !== 0) return t("size.errorMultiple");
  const pixels = width * height;
  if (pixels < MIN_PIXELS) return t("size.errorTooSmall");
  if (pixels > MAX_PIXELS) return t("size.errorTooLarge");
  return null;
}

// src/ImageViewer.jsx
var import_react13 = __toESM(require("react"), 1);
var import_react_dom2 = require("react-dom");

// node_modules/react-zoom-pan-pinch/dist/index.esm.js
var import_react12 = __toESM(require("react"));
var import_jsx_runtime = require("react/jsx-runtime");
var roundNumber = function(num, decimal) {
  return Number(num.toFixed(decimal));
};
var checkIsNumber = function(num, defaultValue) {
  return typeof num === "number" ? num : defaultValue;
};
var handleCallback = function(context, event, callback) {
  if (callback && typeof callback === "function") {
    callback(context, event);
  }
};
var easeOut = function(t2) {
  return -Math.cos(t2 * Math.PI) / 2 + 0.5;
};
var linear = function(t2) {
  return t2;
};
var easeInQuad = function(t2) {
  return t2 * t2;
};
var easeOutQuad = function(t2) {
  return t2 * (2 - t2);
};
var easeInOutQuad = function(t2) {
  return t2 < 0.5 ? 2 * t2 * t2 : -1 + (4 - 2 * t2) * t2;
};
var easeInCubic = function(t2) {
  return t2 * t2 * t2;
};
var easeOutCubic = function(t2) {
  return --t2 * t2 * t2 + 1;
};
var easeInOutCubic = function(t2) {
  return t2 < 0.5 ? 4 * t2 * t2 * t2 : (t2 - 1) * (2 * t2 - 2) * (2 * t2 - 2) + 1;
};
var easeInQuart = function(t2) {
  return t2 * t2 * t2 * t2;
};
var easeOutQuart = function(t2) {
  return 1 - --t2 * t2 * t2 * t2;
};
var easeInOutQuart = function(t2) {
  return t2 < 0.5 ? 8 * t2 * t2 * t2 * t2 : 1 - 8 * --t2 * t2 * t2 * t2;
};
var easeInQuint = function(t2) {
  return t2 * t2 * t2 * t2 * t2;
};
var easeOutQuint = function(t2) {
  return 1 + --t2 * t2 * t2 * t2 * t2;
};
var easeInOutQuint = function(t2) {
  return t2 < 0.5 ? 16 * t2 * t2 * t2 * t2 * t2 : 1 + 16 * --t2 * t2 * t2 * t2 * t2;
};
var animations = {
  easeOut,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint
};
var settleAnimation = function(contextInstance) {
  var resolve = contextInstance.animationResolve;
  contextInstance.animationResolve = null;
  resolve === null || resolve === void 0 ? void 0 : resolve();
};
var handleCancelAnimation = function(contextInstance) {
  if (contextInstance.animationFrame !== null) {
    cancelAnimationFrame(contextInstance.animationFrame);
  }
  contextInstance.animationFrame = null;
  contextInstance.isAnimating = false;
  contextInstance.animation = null;
  contextInstance.velocity = null;
  settleAnimation(contextInstance);
};
function handleSetupAnimation(contextInstance, animationName, animationTime, callback, onFinish) {
  if (!contextInstance.mounted) {
    onFinish === null || onFinish === void 0 ? void 0 : onFinish();
    return;
  }
  var startTime = (/* @__PURE__ */ new Date()).getTime();
  var lastStep = 1;
  handleCancelAnimation(contextInstance);
  var animation = function() {
    if (!contextInstance.mounted || contextInstance.animation !== animation) {
      return;
    }
    var frameTime = (/* @__PURE__ */ new Date()).getTime() - startTime;
    var animationProgress = frameTime / animationTime;
    var animationType = animations[animationName];
    var step = animationType(animationProgress);
    if (frameTime >= animationTime) {
      contextInstance.animation = null;
      contextInstance.animationFrame = null;
      var resolve = contextInstance.animationResolve;
      contextInstance.animationResolve = null;
      callback(lastStep);
      resolve === null || resolve === void 0 ? void 0 : resolve();
      contextInstance.flushResizeAlignment();
    } else {
      callback(step);
      contextInstance.animationFrame = requestAnimationFrame(animation);
    }
  };
  contextInstance.animation = animation;
  contextInstance.animationResolve = onFinish !== null && onFinish !== void 0 ? onFinish : null;
  contextInstance.animationFrame = requestAnimationFrame(animation);
}
function isValidTargetState(targetState) {
  var scale = targetState.scale, positionX = targetState.positionX, positionY = targetState.positionY;
  if (Number.isNaN(scale) || Number.isNaN(positionX) || Number.isNaN(positionY)) {
    return false;
  }
  return true;
}
function animate(contextInstance, targetState, animationTime, animationName) {
  var isValid = isValidTargetState(targetState);
  if (!contextInstance.mounted || !isValid)
    return Promise.resolve();
  var setState = contextInstance.setState;
  var _a = contextInstance.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
  var scaleDiff = targetState.scale - scale;
  var positionXDiff = targetState.positionX - positionX;
  var positionYDiff = targetState.positionY - positionY;
  if (animationTime === 0) {
    setState(targetState.scale, targetState.positionX, targetState.positionY);
    return Promise.resolve();
  }
  return new Promise(function(resolve) {
    handleSetupAnimation(contextInstance, animationName, animationTime, function(step) {
      if (step !== 1) {
        contextInstance.isAnimating = true;
      } else {
        contextInstance.isAnimating = false;
      }
      var newScale = scale + scaleDiff * step;
      var newPositionX = positionX + positionXDiff * step;
      var newPositionY = positionY + positionYDiff * step;
      setState(newScale, newPositionX, newPositionY);
    }, resolve);
  });
}
function getComponentsSizes(wrapperComponent, contentComponent, newScale) {
  var wrapperWidth = wrapperComponent.clientWidth;
  var wrapperHeight = wrapperComponent.clientHeight;
  var contentWidth = contentComponent.offsetWidth;
  var contentHeight = contentComponent.offsetHeight;
  var newContentWidth = contentWidth * newScale;
  var newContentHeight = contentHeight * newScale;
  var newDiffWidth = wrapperWidth - newContentWidth;
  var newDiffHeight = wrapperHeight - newContentHeight;
  return {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newDiffWidth,
    newContentHeight,
    newDiffHeight
  };
}
var getBounds = function(wrapperWidth, newContentWidth, diffWidth, wrapperHeight, newContentHeight, diffHeight, centerZoomedOut) {
  var scaleWidthFactor = wrapperWidth > newContentWidth ? diffWidth * (centerZoomedOut ? 0.5 : 1) : 0;
  var scaleHeightFactor = wrapperHeight > newContentHeight ? diffHeight * (centerZoomedOut ? 0.5 : 1) : 0;
  var minPositionX = wrapperWidth - newContentWidth - scaleWidthFactor;
  var maxPositionX = scaleWidthFactor;
  var minPositionY = wrapperHeight - newContentHeight - scaleHeightFactor;
  var maxPositionY = scaleHeightFactor;
  return {
    minPositionX,
    maxPositionX,
    minPositionY,
    maxPositionY,
    scaleWidthFactor,
    scaleHeightFactor
  };
};
var calculateBounds = function(contextInstance, newScale) {
  var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent;
  var _a = contextInstance.setup, centerZoomedOut = _a.centerZoomedOut, disablePadding = _a.disablePadding;
  if (!wrapperComponent || !contentComponent) {
    throw new Error("Components are not mounted");
  }
  var _b = getComponentsSizes(wrapperComponent, contentComponent, newScale), wrapperWidth = _b.wrapperWidth, wrapperHeight = _b.wrapperHeight, newContentWidth = _b.newContentWidth, newContentHeight = _b.newContentHeight, newDiffWidth = _b.newDiffWidth, newDiffHeight = _b.newDiffHeight;
  var bounds = getBounds(wrapperWidth, newContentWidth, newDiffWidth, wrapperHeight, newContentHeight, newDiffHeight, Boolean(centerZoomedOut));
  var contentFitsCompletely = wrapperWidth >= newContentWidth && wrapperHeight >= newContentHeight;
  if (disablePadding && contentFitsCompletely && !centerZoomedOut) {
    bounds.minPositionX = 0;
    bounds.maxPositionX = 0;
    bounds.minPositionY = 0;
    bounds.maxPositionY = 0;
  }
  var _c = contextInstance.setup, propMinX = _c.minPositionX, propMaxX = _c.maxPositionX, propMinY = _c.minPositionY, propMaxY = _c.maxPositionY;
  if (propMinX != null) {
    bounds.minPositionX = wrapperWidth * (1 - newScale) + propMinX * newScale;
  }
  if (propMaxX != null) {
    bounds.maxPositionX = propMaxX * newScale;
  }
  if (propMinY != null) {
    bounds.minPositionY = wrapperHeight * (1 - newScale) + propMinY * newScale;
  }
  if (propMaxY != null) {
    bounds.maxPositionY = propMaxY * newScale;
  }
  return bounds;
};
function clamp3(v, min, max) {
  return Math.max(min, Math.min(v, max));
}
function rubberband(distance, dimension, constant) {
  if (dimension === 0 || Math.abs(dimension) === Infinity)
    return Math.pow(distance, constant * 5);
  return distance * dimension * constant / (dimension + constant * distance);
}
var MAX_RUBBER_BAND_RATIO = 0.9;
var RUBBER_BAND_CONSTANT = 0.55;
function getRubberBandPosition(position, min, max, padding) {
  if (padding <= 0)
    return clamp3(position, min, max);
  if (position < min)
    return min - rubberband(min - position, padding, RUBBER_BAND_CONSTANT);
  if (position > max)
    return max + rubberband(position - max, padding, RUBBER_BAND_CONSTANT);
  return position;
}
function getRubberBandSource(position, min, max, padding) {
  if (padding <= 0)
    return position;
  var stretch = function(offset) {
    var limited = Math.min(offset, padding * MAX_RUBBER_BAND_RATIO);
    return limited * padding / (RUBBER_BAND_CONSTANT * (padding - limited));
  };
  if (position < min)
    return min - stretch(min - position);
  if (position > max)
    return max + stretch(position - max);
  return position;
}
var boundLimiter = function(value, minBound, maxBound, isActive) {
  if (!isActive)
    return roundNumber(value, 2);
  if (value < minBound)
    return roundNumber(minBound, 2);
  if (value > maxBound)
    return roundNumber(maxBound, 2);
  return roundNumber(value, 2);
};
var handleCalculateBounds = function(contextInstance, newScale) {
  var bounds = calculateBounds(contextInstance, newScale);
  contextInstance.bounds = bounds;
  return bounds;
};
function getMouseBoundedPosition(positionX, positionY, bounds, limitToBounds, paddingValueX, paddingValueY, wrapperComponent) {
  var minPositionX = bounds.minPositionX, minPositionY = bounds.minPositionY, maxPositionX = bounds.maxPositionX, maxPositionY = bounds.maxPositionY;
  var paddingX = 0;
  var paddingY = 0;
  if (wrapperComponent) {
    paddingX = paddingValueX;
    paddingY = paddingValueY;
  }
  var x = boundLimiter(positionX, minPositionX - paddingX, maxPositionX + paddingX, limitToBounds);
  var y = boundLimiter(positionY, minPositionY - paddingY, maxPositionY + paddingY, limitToBounds);
  return { x, y };
}
function getPanBoundedPosition(positionX, positionY, bounds, limitToBounds, paddingX, paddingY, rubberBand) {
  var minPositionX = bounds.minPositionX, minPositionY = bounds.minPositionY, maxPositionX = bounds.maxPositionX, maxPositionY = bounds.maxPositionY;
  var limit = function(position, min, max, padding) {
    if (limitToBounds && rubberBand && padding > 0) {
      return roundNumber(getRubberBandPosition(position, min, max, padding), 2);
    }
    return boundLimiter(position, min - padding, max + padding, limitToBounds);
  };
  return {
    x: limit(positionX, minPositionX, maxPositionX, paddingX),
    y: limit(positionY, minPositionY, maxPositionY, paddingY)
  };
}
function handleCalculateZoomPositions(contextInstance, mouseX, mouseY, newScale, bounds, limitToBounds) {
  var _a = contextInstance.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
  var scaleDifference = newScale - scale;
  if (!Number.isFinite(mouseX) || !Number.isFinite(mouseY)) {
    console.error("Mouse X and Y position were not provided!");
    return { x: positionX, y: positionY };
  }
  var calculatedPositionX = positionX - mouseX * scaleDifference;
  var calculatedPositionY = positionY - mouseY * scaleDifference;
  var newPositions = getMouseBoundedPosition(calculatedPositionX, calculatedPositionY, bounds, limitToBounds, 0, 0, null);
  return newPositions;
}
var MIN_SAFE_SCALE = 1e-7;
function checkZoomBounds(zoom, minScale, maxScale, zoomPadding, enablePadding) {
  var scalePadding = enablePadding ? zoomPadding : 0;
  var minScaleWithPadding = Math.max(minScale - scalePadding, MIN_SAFE_SCALE);
  var maxScaleWithPadding = maxScale + scalePadding;
  if (!Number.isNaN(maxScale) && zoom >= maxScaleWithPadding)
    return maxScaleWithPadding;
  if (!Number.isNaN(minScale) && zoom <= minScaleWithPadding)
    return minScaleWithPadding;
  return Math.max(zoom, MIN_SAFE_SCALE);
}
var isPanningStartAllowed = function(contextInstance, event) {
  var excluded = contextInstance.setup.panning.excluded;
  var isInitialized = contextInstance.isInitialized, wrapperComponent = contextInstance.wrapperComponent;
  var target = event.target;
  var isElementNode = function(node) {
    return !!node && typeof node === "object" && node.nodeType === 1 && typeof node.contains === "function";
  };
  var isWrapperChild = typeof event.composedPath === "function" ? event.composedPath().some(function(node) {
    return isElementNode(node) && !!(wrapperComponent === null || wrapperComponent === void 0 ? void 0 : wrapperComponent.contains(node));
  }) : !!(wrapperComponent === null || wrapperComponent === void 0 ? void 0 : wrapperComponent.contains(target));
  var isAllowed = isInitialized && target && isWrapperChild;
  if (!isAllowed)
    return false;
  var isExcluded = isExcludedNode(target, excluded);
  if (isExcluded)
    return false;
  if (isDraggableTarget(target) || isEditableTarget(target)) {
    return false;
  }
  return true;
};
var isPanningAllowed = function(contextInstance) {
  var isInitialized = contextInstance.isInitialized, isPanning = contextInstance.isPanning, setup = contextInstance.setup;
  var disabled = setup.panning.disabled;
  var isAllowed = isInitialized && isPanning && !disabled;
  if (!isAllowed)
    return false;
  return true;
};
var CLICK_DISTANCE = 5;
function isPanBlockedAtBounds(contextInstance, dx, dy) {
  var bounds = contextInstance.bounds, setup = contextInstance.setup, state = contextInstance.state;
  if (!bounds || !setup.limitToBounds || !dx && !dy)
    return false;
  var isHorizontal = Math.abs(dx) >= Math.abs(dy);
  if (isHorizontal ? setup.panning.lockAxisX : setup.panning.lockAxisY) {
    return true;
  }
  var delta = isHorizontal ? dx : dy;
  var position = isHorizontal ? state.positionX : state.positionY;
  var min = isHorizontal ? bounds.minPositionX : bounds.minPositionY;
  var max = isHorizontal ? bounds.maxPositionX : bounds.maxPositionY;
  return delta > 0 ? position >= max - 0.5 : position <= min + 0.5;
}
var getPaddingValue = function(contextInstance, size, explicitScale) {
  var setup = contextInstance.setup, state = contextInstance.state;
  var minScale = setup.minScale, disablePadding = setup.disablePadding, centerZoomedOut = setup.centerZoomedOut;
  var scale = explicitScale !== null && explicitScale !== void 0 ? explicitScale : state.scale;
  if (size > 0 && scale >= minScale && !disablePadding && !centerZoomedOut) {
    return size;
  }
  return 0;
};
function isRubberBandEnabled(contextInstance) {
  var _a = contextInstance.setup, limitToBounds = _a.limitToBounds, autoAlignment = _a.autoAlignment;
  return limitToBounds && !autoAlignment.disabled;
}
function getPanSourcePosition(contextInstance) {
  var bounds = contextInstance.bounds, setup = contextInstance.setup, state = contextInstance.state;
  var positionX = state.positionX, positionY = state.positionY;
  if (!bounds || !isRubberBandEnabled(contextInstance)) {
    return { x: positionX, y: positionY };
  }
  var _a = setup.autoAlignment, sizeX = _a.sizeX, sizeY = _a.sizeY;
  return {
    x: getRubberBandSource(positionX, bounds.minPositionX, bounds.maxPositionX, getPaddingValue(contextInstance, sizeX)),
    y: getRubberBandSource(positionY, bounds.minPositionY, bounds.maxPositionY, getPaddingValue(contextInstance, sizeY))
  };
}
var handlePanningSetup = function(contextInstance, event) {
  var _a = getPanSourcePosition(contextInstance), positionX = _a.x, positionY = _a.y;
  contextInstance.isPanning = true;
  var x = event.clientX;
  var y = event.clientY;
  contextInstance.startCoords = { x: x - positionX, y: y - positionY };
};
var handleTouchPanningSetup = function(contextInstance, event) {
  var touches = event.touches;
  var _a = getPanSourcePosition(contextInstance), positionX = _a.x, positionY = _a.y;
  contextInstance.isPanning = true;
  var oneFingerTouch = touches.length === 1;
  if (oneFingerTouch) {
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    contextInstance.startCoords = { x: x - positionX, y: y - positionY };
  }
};
function handlePanToBounds(contextInstance) {
  var _a = contextInstance.state, positionX = _a.positionX, positionY = _a.positionY, scale = _a.scale;
  var _b = contextInstance.setup, disabled = _b.disabled, limitToBounds = _b.limitToBounds, centerZoomedOut = _b.centerZoomedOut;
  var wrapperComponent = contextInstance.wrapperComponent;
  if (disabled || !wrapperComponent || !contextInstance.bounds)
    return;
  var _c = contextInstance.bounds, maxPositionX = _c.maxPositionX, minPositionX = _c.minPositionX, maxPositionY = _c.maxPositionY, minPositionY = _c.minPositionY;
  var xChanged = positionX > maxPositionX || positionX < minPositionX;
  var yChanged = positionY > maxPositionY || positionY < minPositionY;
  var mousePosX = positionX > maxPositionX ? wrapperComponent.clientWidth : contextInstance.setup.minPositionX || 0;
  var mousePosY = positionY > maxPositionY ? wrapperComponent.clientHeight : contextInstance.setup.minPositionY || 0;
  var _d = handleCalculateZoomPositions(contextInstance, mousePosX, mousePosY, scale, contextInstance.bounds, limitToBounds || centerZoomedOut), x = _d.x, y = _d.y;
  return {
    scale,
    positionX: xChanged ? x : positionX,
    positionY: yChanged ? y : positionY
  };
}
function handleNewPosition(contextInstance, newPositionX, newPositionY, paddingValueX, paddingValueY) {
  var limitToBounds = contextInstance.setup.limitToBounds;
  var wrapperComponent = contextInstance.wrapperComponent, bounds = contextInstance.bounds;
  var _a = contextInstance.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
  if (wrapperComponent === null || bounds === null || newPositionX === positionX && newPositionY === positionY) {
    return;
  }
  var _b = getPanBoundedPosition(newPositionX, newPositionY, bounds, limitToBounds, paddingValueX, paddingValueY, isRubberBandEnabled(contextInstance)), x = _b.x, y = _b.y;
  contextInstance.setState(scale, x, y);
}
var getPanningClientPosition = function(contextInstance, clientX, clientY) {
  var startCoords = contextInstance.startCoords;
  var panning = contextInstance.setup.panning;
  var lockAxisX = panning.lockAxisX, lockAxisY = panning.lockAxisY;
  var _a = getPanSourcePosition(contextInstance), positionX = _a.x, positionY = _a.y;
  if (!startCoords) {
    return { x: positionX, y: positionY };
  }
  var mouseX = clientX - startCoords.x;
  var mouseY = clientY - startCoords.y;
  var newPositionX = lockAxisX ? positionX : mouseX;
  var newPositionY = lockAxisY ? positionY : mouseY;
  return { x: newPositionX, y: newPositionY };
};
var DeviceType;
(function(DeviceType2) {
  DeviceType2["TRACK_PAD"] = "track_pad";
  DeviceType2["MOUSE"] = "mouse";
  DeviceType2["TOUCH"] = "touch";
})(DeviceType || (DeviceType = {}));
var isVelocityCalculationAllowed = function(contextInstance) {
  var mounted = contextInstance.mounted, wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent;
  var _a = contextInstance.setup, disabled = _a.disabled, velocityAnimation = _a.velocityAnimation, limitToBounds = _a.limitToBounds;
  var scale = contextInstance.state.scale;
  var disabledVelocity = velocityAnimation.disabled;
  if (disabledVelocity || disabled || !mounted)
    return false;
  if (!wrapperComponent || !contentComponent)
    return false;
  if (!limitToBounds)
    return true;
  var contentOverflows = wrapperComponent.clientWidth < contentComponent.offsetWidth * scale || wrapperComponent.clientHeight < contentComponent.offsetHeight * scale;
  return contentOverflows;
};
var isVelocityAllowed = function(contextInstance) {
  var mounted = contextInstance.mounted, velocity = contextInstance.velocity, bounds = contextInstance.bounds;
  var _a = contextInstance.setup, disabled = _a.disabled, velocityAnimation = _a.velocityAnimation;
  var disabledVelocity = velocityAnimation.disabled;
  var isAllowed = !disabledVelocity && !disabled && mounted;
  if (!isAllowed)
    return false;
  if (!velocity || !bounds)
    return false;
  return true;
};
function getVelocityMoveTime(contextInstance, velocity) {
  var velocityAnimation = contextInstance.setup.velocityAnimation;
  var animationTime = velocityAnimation.animationTime, maxAnimationTime = velocityAnimation.maxAnimationTime, inertia = velocityAnimation.inertia;
  return Math.min(animationTime * Math.max(1, Math.abs(velocity / inertia)), maxAnimationTime);
}
function getVelocityPosition(newPosition, startPosition, currentPosition, isLocked, limitToBounds, minPosition, maxPosition, minTarget, maxTarget, step) {
  if (limitToBounds) {
    if (startPosition > maxPosition && currentPosition > maxPosition) {
      var calculatedPosition = maxPosition + (newPosition - maxPosition) * step;
      if (calculatedPosition > maxTarget)
        return maxTarget;
      if (calculatedPosition < maxPosition)
        return maxPosition;
      return calculatedPosition;
    }
    if (startPosition < minPosition && currentPosition < minPosition) {
      var calculatedPosition = minPosition + (newPosition - minPosition) * step;
      if (calculatedPosition < minTarget)
        return minTarget;
      if (calculatedPosition > minPosition)
        return minPosition;
      return calculatedPosition;
    }
  }
  if (isLocked)
    return startPosition;
  return boundLimiter(newPosition, minPosition, maxPosition, limitToBounds);
}
function getSizeMultiplier(wrapperComponent) {
  var defaultMultiplier = 1;
  var value = wrapperComponent.clientWidth / window.innerWidth;
  if (Number.isNaN(value)) {
    return defaultMultiplier;
  }
  return Math.min(defaultMultiplier, value);
}
var getMinMaxVelocity = function(velocity, maxStrength, sensitivity) {
  var defaultMultiplier = 0;
  var value = velocity * sensitivity;
  if (Number.isNaN(value)) {
    return defaultMultiplier;
  }
  if (velocity < 0) {
    return Math.max(value, -maxStrength);
  }
  return Math.min(value, maxStrength);
};
function handleCalculateVelocity(contextInstance, position, device) {
  var _a, _b;
  var isAllowed = isVelocityCalculationAllowed(contextInstance);
  if (!isAllowed) {
    return;
  }
  var lastMousePosition = contextInstance.lastMousePosition, velocityTime = contextInstance.velocityTime, setup = contextInstance.setup;
  var wrapperComponent = contextInstance.wrapperComponent;
  var _c = setup.velocityAnimation, maxStrengthMouse = _c.maxStrengthMouse, maxStrengthTouch = _c.maxStrengthTouch, sensitivityTouch = _c.sensitivityTouch, sensitivityMouse = _c.sensitivityMouse;
  var now = Date.now();
  if (lastMousePosition && velocityTime && wrapperComponent) {
    var sizeMultiplier = getSizeMultiplier(wrapperComponent);
    var sensitivity = (_a = {}, _a[DeviceType.TOUCH] = sensitivityTouch, _a[DeviceType.MOUSE] = sensitivityMouse, _a)[device];
    var maxStrength = (_b = {}, _b[DeviceType.TOUCH] = maxStrengthTouch, _b[DeviceType.MOUSE] = maxStrengthMouse, _b)[device];
    var distanceX = position.x - lastMousePosition.x;
    var distanceY = position.y - lastMousePosition.y;
    var velocityX = getMinMaxVelocity(distanceX / sizeMultiplier, maxStrength, sensitivity);
    var velocityY = getMinMaxVelocity(distanceY / sizeMultiplier, maxStrength, sensitivity);
    var interval = now - velocityTime;
    var speed = distanceX * distanceX + distanceY * distanceY;
    var velocity = getMinMaxVelocity(Math.sqrt(speed) / interval, maxStrength, sensitivity);
    contextInstance.velocity = { velocityX, velocityY, total: velocity };
  }
  contextInstance.lastMousePosition = position;
  contextInstance.velocityTime = now;
}
function handleVelocityPanning(contextInstance) {
  var velocity = contextInstance.velocity, bounds = contextInstance.bounds, setup = contextInstance.setup, wrapperComponent = contextInstance.wrapperComponent;
  var isAllowed = isVelocityAllowed(contextInstance);
  if (!isAllowed || !velocity || !bounds || !wrapperComponent) {
    return;
  }
  var velocityX = velocity.velocityX, velocityY = velocity.velocityY, total = velocity.total;
  var maxPositionX = bounds.maxPositionX, minPositionX = bounds.minPositionX, maxPositionY = bounds.maxPositionY, minPositionY = bounds.minPositionY;
  var limitToBounds = setup.limitToBounds, autoAlignment = setup.autoAlignment;
  var zoomAnimation = setup.zoomAnimation, panning = setup.panning;
  var lockAxisY = panning.lockAxisY, lockAxisX = panning.lockAxisX;
  var animationType = zoomAnimation.animationType;
  var sizeX = autoAlignment.sizeX, sizeY = autoAlignment.sizeY, velocityAlignmentTime = autoAlignment.velocityAlignmentTime;
  var alignAnimationTime = velocityAlignmentTime;
  var moveAnimationTime = getVelocityMoveTime(contextInstance, total);
  var finalAnimationTime = Math.max(moveAnimationTime, alignAnimationTime);
  var paddingValueX = getPaddingValue(contextInstance, sizeX);
  var paddingValueY = getPaddingValue(contextInstance, sizeY);
  var isRubberBand = isRubberBandEnabled(contextInstance);
  var paddingX = isRubberBand ? paddingValueX : paddingValueX * wrapperComponent.clientWidth / 100;
  var paddingY = isRubberBand ? paddingValueY : paddingValueY * wrapperComponent.clientHeight / 100;
  var maxTargetX = maxPositionX + paddingX;
  var minTargetX = minPositionX - paddingX;
  var maxTargetY = maxPositionY + paddingY;
  var minTargetY = minPositionY - paddingY;
  var startState = contextInstance.state;
  var startTime = (/* @__PURE__ */ new Date()).getTime();
  handleSetupAnimation(contextInstance, animationType, finalAnimationTime, function(step) {
    var _a = contextInstance.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
    var frameTime = (/* @__PURE__ */ new Date()).getTime() - startTime;
    var animationProgress = frameTime / alignAnimationTime;
    var alignAnimation = animations[autoAlignment.animationType];
    var alignStep = 1 - alignAnimation(Math.min(1, animationProgress));
    var customStep = 1 - step;
    var newPositionX = positionX + velocityX * customStep;
    var newPositionY = positionY + velocityY * customStep;
    var currentPositionX = getVelocityPosition(newPositionX, startState.positionX, positionX, lockAxisX, limitToBounds, minPositionX, maxPositionX, minTargetX, maxTargetX, alignStep);
    var currentPositionY = getVelocityPosition(newPositionY, startState.positionY, positionY, lockAxisY, limitToBounds, minPositionY, maxPositionY, minTargetY, maxTargetY, alignStep);
    if (positionX !== newPositionX || positionY !== newPositionY) {
      contextInstance.setState(scale, currentPositionX, currentPositionY);
      var onPanning = contextInstance.props.onPanning;
      if (onPanning) {
        onPanning(getContext(contextInstance), {});
      }
    }
  });
}
function handlePanningStart(contextInstance, event) {
  var _a = contextInstance.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
  contextInstance.panStartPosition = { x: positionX, y: positionY };
  handleCancelAnimation(contextInstance);
  handleCalculateBounds(contextInstance, scale);
  if ("touches" in event) {
    handleTouchPanningSetup(contextInstance, event);
  } else {
    handlePanningSetup(contextInstance, event);
  }
}
function handleAlignToBounds(contextInstance, customAnimationTime) {
  var scale = contextInstance.state.scale;
  var _a = contextInstance.setup, minScale = _a.minScale, autoAlignment = _a.autoAlignment;
  var disabled = autoAlignment.disabled, sizeX = autoAlignment.sizeX, sizeY = autoAlignment.sizeY, animationTime = autoAlignment.animationTime, animationType = autoAlignment.animationType;
  var isDisabled = disabled || scale < minScale || !sizeX && !sizeY;
  if (isDisabled)
    return;
  if (contextInstance.isResizeAlignmentPending) {
    handleCalculateBounds(contextInstance, scale);
  }
  var targetState = handlePanToBounds(contextInstance);
  if (!targetState)
    return;
  var _b = contextInstance.state, positionX = _b.positionX, positionY = _b.positionY;
  var isNoop = targetState.positionX === positionX && targetState.positionY === positionY;
  if (!isNoop) {
    animate(contextInstance, targetState, customAnimationTime !== null && customAnimationTime !== void 0 ? customAnimationTime : animationTime, animationType);
  }
}
function handlePanning(contextInstance, clientX, clientY, device) {
  var startCoords = contextInstance.startCoords, setup = contextInstance.setup;
  var _a = setup.autoAlignment, sizeX = _a.sizeX, sizeY = _a.sizeY;
  if (!startCoords)
    return;
  var _b = getPanningClientPosition(contextInstance, clientX, clientY), x = _b.x, y = _b.y;
  var paddingValueX = getPaddingValue(contextInstance, sizeX);
  var paddingValueY = getPaddingValue(contextInstance, sizeY);
  handleCalculateVelocity(contextInstance, { x, y }, device);
  handleNewPosition(contextInstance, x, y, paddingValueX, paddingValueY);
}
function handlePanningEnd(contextInstance, velocityDisabled) {
  if (contextInstance.isPanning) {
    var velocity = contextInstance.velocity, wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent;
    contextInstance.isPanning = false;
    var _a = contextInstance.state, positionX = _a.positionX, positionY = _a.positionY, scale = _a.scale;
    var start = contextInstance.panStartPosition;
    contextInstance.panStartPosition = null;
    if (start) {
      var dx = positionX - start.x;
      var dy = positionY - start.y;
      if (dx * dx + dy * dy <= Math.pow(CLICK_DISTANCE, 2)) {
        handleAlignToBounds(contextInstance);
        return;
      }
    }
    contextInstance.isAnimating = false;
    contextInstance.animation = null;
    if (contextInstance.isResizeAlignmentPending) {
      handleCalculateBounds(contextInstance, scale);
    }
    var wrapperWidth = (wrapperComponent === null || wrapperComponent === void 0 ? void 0 : wrapperComponent.clientWidth) || 0;
    var wrapperHeight = (wrapperComponent === null || wrapperComponent === void 0 ? void 0 : wrapperComponent.clientHeight) || 0;
    var contentWidth = ((contentComponent === null || contentComponent === void 0 ? void 0 : contentComponent.offsetWidth) || 0) * scale;
    var contentHeight = ((contentComponent === null || contentComponent === void 0 ? void 0 : contentComponent.offsetHeight) || 0) * scale;
    var isContentOverflowing = !contextInstance.setup.limitToBounds || wrapperWidth < contentWidth || wrapperHeight < contentHeight;
    var shouldAnimate = !velocityDisabled && velocity && velocity.total > 0.1 && isContentOverflowing;
    if (shouldAnimate) {
      handleVelocityPanning(contextInstance);
    } else {
      handleAlignToBounds(contextInstance);
    }
  }
}
function handleZoomToPoint(contextInstance, scale, mouseX, mouseY) {
  var _a = contextInstance.setup, minScale = _a.minScale, maxScale = _a.maxScale, limitToBounds = _a.limitToBounds;
  var newScale = checkZoomBounds(roundNumber(scale, 2), minScale, maxScale, 0, false);
  var bounds = handleCalculateBounds(contextInstance, newScale);
  var _b = handleCalculateZoomPositions(contextInstance, mouseX, mouseY, newScale, bounds, limitToBounds), x = _b.x, y = _b.y;
  return { scale: newScale, positionX: x, positionY: y };
}
function handleAlignToScaleBounds(contextInstance, mousePositionX, mousePositionY) {
  var scale = contextInstance.state.scale;
  var wrapperComponent = contextInstance.wrapperComponent;
  var _a = contextInstance.setup, minScale = _a.minScale, maxScale = _a.maxScale, limitToBounds = _a.limitToBounds, zoomAnimation = _a.zoomAnimation;
  var disabled = zoomAnimation.disabled, animationTime = zoomAnimation.animationTime, animationType = zoomAnimation.animationType;
  var isWithinBounds = scale >= minScale && scale <= maxScale;
  var isDisabled = disabled || isWithinBounds;
  if (scale >= 1 || limitToBounds) {
    handleAlignToBounds(contextInstance);
  }
  if (isDisabled || !wrapperComponent || !contextInstance.mounted)
    return;
  var mouseX = mousePositionX || wrapperComponent.clientWidth / 2;
  var mouseY = mousePositionY || wrapperComponent.clientHeight / 2;
  var targetScale = scale < minScale ? minScale : maxScale;
  var targetState = handleZoomToPoint(contextInstance, targetScale, mouseX, mouseY);
  if (targetState) {
    animate(contextInstance, targetState, animationTime, animationType);
  }
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t2) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t2[p] = s[p];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
var initialState = {
  previousScale: 1,
  scale: 1,
  positionX: 0,
  positionY: 0
};
var initialSetup = {
  disabled: false,
  minPositionX: null,
  maxPositionX: null,
  minPositionY: null,
  maxPositionY: null,
  minScale: 1,
  maxScale: 8,
  limitToBounds: true,
  centerZoomedOut: false,
  centerOnInit: false,
  fitOnInit: false,
  disablePadding: false,
  smooth: true,
  detached: false,
  wheel: {
    step: 0.015,
    disabled: false,
    wheelDisabled: false,
    touchPadDisabled: false,
    activationKeys: [],
    excluded: []
  },
  trackPadPanning: {
    disabled: true,
    velocityDisabled: false,
    speed: 1,
    lockAxisX: false,
    lockAxisY: false,
    activationKeys: [],
    excluded: []
  },
  panning: {
    disabled: false,
    velocityDisabled: false,
    lockAxisX: false,
    lockAxisY: false,
    allowLeftClickPan: true,
    allowMiddleClickPan: true,
    allowRightClickPan: true,
    suppressClickAfterPan: true,
    releaseAtBounds: false,
    activationKeys: [],
    excluded: []
  },
  pinch: {
    step: 5,
    disabled: false,
    allowPanning: true,
    excluded: []
  },
  keyboard: {
    disabled: true,
    panStep: 50,
    zoomStep: 0.25,
    animationTime: 100,
    animationType: "easeOut",
    excluded: []
  },
  doubleClick: {
    disabled: false,
    step: 0.7,
    mode: "zoomIn",
    animationType: "easeOut",
    animationTime: 200,
    excluded: []
  },
  zoomAnimation: {
    disabled: false,
    size: 0.4,
    animationTime: 200,
    animationType: "easeOut"
  },
  autoAlignment: {
    disabled: false,
    sizeX: 100,
    sizeY: 100,
    animationTime: 200,
    velocityAlignmentTime: 400,
    animationType: "easeOut"
  },
  velocityAnimation: {
    disabled: false,
    sensitivityMouse: 1,
    sensitivityTouch: 1.2,
    maxStrengthMouse: 20,
    maxStrengthTouch: 40,
    inertia: 1,
    animationTime: 300,
    maxAnimationTime: 800,
    animationType: "easeOut"
  }
};
var baseClasses = {
  wrapperClass: "react-transform-wrapper",
  contentClass: "react-transform-component"
};
var createState = function(props) {
  var _a, _b, _c, _d, _e, _f, _g;
  var minScale = Math.max((_a = props.minScale) !== null && _a !== void 0 ? _a : initialSetup.minScale, 1e-7);
  var maxScale = (_b = props.maxScale) !== null && _b !== void 0 ? _b : initialSetup.maxScale;
  var rawScale = (_c = props.initialScale) !== null && _c !== void 0 ? _c : initialState.scale;
  var scale = Math.min(Math.max(rawScale, minScale), maxScale);
  var positionX = boundLimiter(typeof props.initialPositionX === "number" ? props.initialPositionX : initialState.positionX, (_d = props.minPositionX) !== null && _d !== void 0 ? _d : -Infinity, (_e = props.maxPositionX) !== null && _e !== void 0 ? _e : Infinity, props.minPositionX != null || props.maxPositionX != null);
  var positionY = boundLimiter(typeof props.initialPositionY === "number" ? props.initialPositionY : initialState.positionY, (_f = props.minPositionY) !== null && _f !== void 0 ? _f : -Infinity, (_g = props.maxPositionY) !== null && _g !== void 0 ? _g : Infinity, props.minPositionY != null || props.maxPositionY != null);
  return {
    previousScale: scale,
    scale,
    positionX,
    positionY
  };
};
var createSetup = function(props) {
  var newSetup = __assign({}, initialSetup);
  Object.keys(props).forEach(function(key) {
    var k = key;
    var validValue = typeof props[k] !== "undefined";
    var validParameter = typeof initialSetup[k] !== "undefined";
    if (validParameter && validValue) {
      var dataType = Object.prototype.toString.call(initialSetup[k]);
      var isObject = dataType === "[object Object]";
      var isArray = dataType === "[object Array]";
      if (isObject) {
        newSetup[k] = __assign(__assign({}, initialSetup[k]), props[k]);
      } else if (isArray) {
        newSetup[k] = __spreadArray(__spreadArray([], initialSetup[k], true), props[k], true);
      } else {
        newSetup[k] = props[k];
      }
    }
  });
  if (newSetup.minScale <= 0) {
    newSetup.minScale = 1e-7;
  }
  return newSetup;
};
var handleCalculateButtonZoom = function(contextInstance, delta, step) {
  var scale = contextInstance.state.scale;
  var wrapperComponent = contextInstance.wrapperComponent, setup = contextInstance.setup;
  var maxScale = setup.maxScale, minScale = setup.minScale, zoomAnimation = setup.zoomAnimation;
  var size = zoomAnimation.size;
  if (!wrapperComponent) {
    throw new Error("Wrapper is not mounted");
  }
  var targetScale = scale + delta * step;
  var newScale = checkZoomBounds(roundNumber(targetScale, 3), minScale, maxScale, size, false);
  return newScale;
};
function runZoomAnimation(contextInstance, targetState, animationTime, animationType) {
  var _a, _b;
  var wrapperComponent = contextInstance.wrapperComponent;
  var _c = contextInstance.props, onZoomStart = _c.onZoomStart, onZoom = _c.onZoom, onZoomStop = _c.onZoomStop;
  var event = new MouseEvent("mousemove", { bubbles: true });
  var ctx = getContext(contextInstance);
  handleCallback(ctx, event, onZoomStart);
  handleCallback(ctx, event, onZoom);
  var done = animate(contextInstance, targetState, animationTime, animationType);
  var win = (_b = (_a = wrapperComponent === null || wrapperComponent === void 0 ? void 0 : wrapperComponent.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView) !== null && _b !== void 0 ? _b : typeof window !== "undefined" ? window : null;
  if (win) {
    win.setTimeout(function() {
      if (!contextInstance.mounted)
        return;
      handleCallback(getContext(contextInstance), event, onZoomStop);
    }, animationTime);
  }
  return done;
}
function handleZoomToViewCenter(contextInstance, delta, step, animationTime, animationType) {
  var wrapperComponent = contextInstance.wrapperComponent;
  var _a = contextInstance.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
  var zoomAnimation = contextInstance.setup.zoomAnimation;
  if (!wrapperComponent) {
    console.error("No WrapperComponent found");
    return Promise.resolve();
  }
  var effectiveAnimationTime = zoomAnimation.disabled ? 0 : animationTime;
  var wrapperWidth = wrapperComponent.clientWidth;
  var wrapperHeight = wrapperComponent.clientHeight;
  var mouseX = (wrapperWidth / 2 - positionX) / scale;
  var mouseY = (wrapperHeight / 2 - positionY) / scale;
  var newScale = handleCalculateButtonZoom(contextInstance, delta, step);
  var targetState = handleZoomToPoint(contextInstance, newScale, mouseX, mouseY);
  if (!targetState) {
    console.error("Error during zoom event. New transformation state was not calculated.");
    return Promise.resolve();
  }
  return runZoomAnimation(contextInstance, targetState, effectiveAnimationTime, animationType);
}
function runPanAnimation(contextInstance, targetState, animationTime, animationType) {
  var _a, _b;
  var wrapperComponent = contextInstance.wrapperComponent;
  var _c = contextInstance.props, onPanningStart = _c.onPanningStart, onPanning = _c.onPanning, onPanningStop = _c.onPanningStop;
  var event = new MouseEvent("mousemove", { bubbles: true });
  var ctx = getContext(contextInstance);
  handleCallback(ctx, event, onPanningStart);
  handleCallback(ctx, event, onPanning);
  var done = animate(contextInstance, targetState, animationTime, animationType);
  var win = (_b = (_a = wrapperComponent === null || wrapperComponent === void 0 ? void 0 : wrapperComponent.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView) !== null && _b !== void 0 ? _b : typeof window !== "undefined" ? window : null;
  if (win) {
    win.setTimeout(function() {
      if (!contextInstance.mounted)
        return;
      handleCallback(getContext(contextInstance), event, onPanningStop);
    }, animationTime);
  }
  return done;
}
function calculateFitToView(contextInstance, mode, minFitScale, maxFitScale) {
  if (mode === void 0) {
    mode = "contain";
  }
  var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent, setup = contextInstance.setup;
  if (!wrapperComponent || !contentComponent)
    return null;
  var contentWidth = contentComponent.offsetWidth;
  var contentHeight = contentComponent.offsetHeight;
  var wrapperWidth = wrapperComponent.clientWidth;
  var wrapperHeight = wrapperComponent.clientHeight;
  if (!contentWidth || !contentHeight || !wrapperWidth || !wrapperHeight) {
    return null;
  }
  var ratioX = wrapperWidth / contentWidth;
  var ratioY = wrapperHeight / contentHeight;
  var scale = mode === "cover" ? Math.max(ratioX, ratioY) : Math.min(ratioX, ratioY);
  if (maxFitScale !== void 0)
    scale = Math.min(scale, maxFitScale);
  if (minFitScale !== void 0)
    scale = Math.max(scale, minFitScale);
  scale = checkZoomBounds(scale, setup.minScale, setup.maxScale, 0, false);
  return getCenterPosition(scale, wrapperComponent, contentComponent);
}
var NAMED_POSITION_SHARE = {
  left: 0,
  top: 0,
  center: 0.5,
  right: 1,
  bottom: 1
};
function hasNamedInitialPosition(contextInstance) {
  var _a = contextInstance.props, initialPositionX = _a.initialPositionX, initialPositionY = _a.initialPositionY;
  return typeof initialPositionX === "string" || typeof initialPositionY === "string";
}
function applyNamedInitialPosition(contextInstance, target) {
  var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent, props = contextInstance.props;
  var initialPositionX = props.initialPositionX, initialPositionY = props.initialPositionY;
  if (!wrapperComponent || !contentComponent)
    return target;
  var place = function(name, wrapperSize, contentSize) {
    return (wrapperSize - contentSize * target.scale) * NAMED_POSITION_SHARE[name];
  };
  return {
    scale: target.scale,
    positionX: typeof initialPositionX === "string" ? place(initialPositionX, wrapperComponent.clientWidth, contentComponent.offsetWidth) : target.positionX,
    positionY: typeof initialPositionY === "string" ? place(initialPositionY, wrapperComponent.clientHeight, contentComponent.offsetHeight) : target.positionY
  };
}
function getResetScale(contextInstance) {
  var fitOnInit = contextInstance.setup.fitOnInit;
  if (fitOnInit) {
    var fitted = calculateFitToView(contextInstance, fitOnInit === "cover" ? "cover" : "contain");
    if (fitted)
      return fitted.scale;
  }
  return createState(contextInstance.props).scale;
}
function resetTransformations(contextInstance, animationTime, animationType, onResetTransformation) {
  var setup = contextInstance.setup, wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent;
  var limitToBounds = setup.limitToBounds, centerOnInit = setup.centerOnInit, fitOnInit = setup.fitOnInit;
  var initialTransformation = createState(contextInstance.props);
  var _a = contextInstance.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
  if (!wrapperComponent)
    return Promise.resolve();
  if (fitOnInit) {
    var fit_1 = calculateFitToView(contextInstance, fitOnInit === "cover" ? "cover" : "contain");
    if (fit_1) {
      var fitted = applyNamedInitialPosition(contextInstance, fit_1);
      if (scale === fitted.scale && positionX === fitted.positionX && positionY === fitted.positionY) {
        return Promise.resolve();
      }
      onResetTransformation === null || onResetTransformation === void 0 ? void 0 : onResetTransformation();
      return runZoomAnimation(contextInstance, fitted, animationTime, animationType);
    }
  }
  var targetPositionX = initialTransformation.positionX;
  var targetPositionY = initialTransformation.positionY;
  if (centerOnInit && contentComponent) {
    var centered = getCenterPosition(initialTransformation.scale, wrapperComponent, contentComponent);
    targetPositionX = centered.positionX;
    targetPositionY = centered.positionY;
  }
  var named = applyNamedInitialPosition(contextInstance, {
    scale: initialTransformation.scale,
    positionX: targetPositionX,
    positionY: targetPositionY
  });
  targetPositionX = named.positionX;
  targetPositionY = named.positionY;
  var newBounds = calculateBounds(contextInstance, initialTransformation.scale);
  var boundedPositions = getMouseBoundedPosition(targetPositionX, targetPositionY, newBounds, limitToBounds, 0, 0, wrapperComponent);
  var newState = {
    scale: initialTransformation.scale,
    positionX: boundedPositions.x,
    positionY: boundedPositions.y
  };
  if (scale === initialTransformation.scale && positionX === initialTransformation.positionX && positionY === initialTransformation.positionY) {
    return Promise.resolve();
  }
  onResetTransformation === null || onResetTransformation === void 0 ? void 0 : onResetTransformation();
  return runZoomAnimation(contextInstance, newState, animationTime, animationType);
}
var toRect = function(target) {
  if ("getBoundingClientRect" in target) {
    var rect = target.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  }
  return target;
};
function getUnionRect(nodes) {
  var rects = nodes.map(toRect);
  var left = Math.min.apply(Math, rects.map(function(r) {
    return r.x;
  }));
  var top = Math.min.apply(Math, rects.map(function(r) {
    return r.y;
  }));
  var right = Math.max.apply(Math, rects.map(function(r) {
    return r.x + r.width;
  }));
  var bottom = Math.max.apply(Math, rects.map(function(r) {
    return r.y + r.height;
  }));
  return { x: left, y: top, width: right - left, height: bottom - top };
}
function getOffset(element, wrapper, content, state) {
  var offset = toRect(element);
  var wrapperOffset = wrapper.getBoundingClientRect();
  var contentOffset = content.getBoundingClientRect();
  var xOff = wrapperOffset.x * state.scale;
  var yOff = wrapperOffset.y * state.scale;
  return {
    x: (offset.x - contentOffset.x + xOff) / state.scale,
    y: (offset.y - contentOffset.y + yOff) / state.scale
  };
}
function calculateZoomToRect(contextInstance, rect, customZoom, customOffsetX, customOffsetY, minFitScale, maxFitScale) {
  if (customOffsetX === void 0) {
    customOffsetX = 0;
  }
  if (customOffsetY === void 0) {
    customOffsetY = 0;
  }
  var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent, state = contextInstance.state;
  var _a = contextInstance.setup, limitToBounds = _a.limitToBounds, minScale = _a.minScale, maxScale = _a.maxScale;
  if (!wrapperComponent || !contentComponent)
    return state;
  var wrapperRect = wrapperComponent.getBoundingClientRect();
  var nodeOffset = getOffset(rect, wrapperComponent, contentComponent, state);
  var nodeLeft = nodeOffset.x;
  var nodeTop = nodeOffset.y;
  var nodeWidth = rect.width / state.scale;
  var nodeHeight = rect.height / state.scale;
  var scaleX = wrapperComponent.clientWidth / nodeWidth;
  var scaleY = wrapperComponent.clientHeight / nodeHeight;
  var targetScale = customZoom || Math.min(scaleX, scaleY);
  if (maxFitScale !== void 0) {
    targetScale = Math.min(targetScale, maxFitScale);
  }
  if (minFitScale !== void 0) {
    targetScale = Math.max(targetScale, minFitScale);
  }
  var newScale = checkZoomBounds(targetScale, minScale, maxScale, 0, false);
  var offsetX = (wrapperRect.width - nodeWidth * newScale) / 2;
  var offsetY = (wrapperRect.height - nodeHeight * newScale) / 2;
  var newPositionX = (wrapperRect.left - nodeLeft) * newScale + offsetX + customOffsetX;
  var newPositionY = (wrapperRect.top - nodeTop) * newScale + offsetY + customOffsetY;
  var bounds = calculateBounds(contextInstance, newScale);
  var _b = getMouseBoundedPosition(newPositionX, newPositionY, bounds, limitToBounds, 0, 0, wrapperComponent), x = _b.x, y = _b.y;
  return { positionX: x, positionY: y, scale: newScale };
}
function clientToContentPoint(contextInstance, clientX, clientY) {
  var wrapperComponent = contextInstance.wrapperComponent, state = contextInstance.state;
  if (!wrapperComponent)
    return { x: 0, y: 0 };
  var rect = wrapperComponent.getBoundingClientRect();
  return {
    x: (clientX - rect.left - state.positionX) / state.scale,
    y: (clientY - rect.top - state.positionY) / state.scale
  };
}
function contentToClientPoint(contextInstance, x, y) {
  var wrapperComponent = contextInstance.wrapperComponent, state = contextInstance.state;
  if (!wrapperComponent)
    return { x: 0, y: 0 };
  var rect = wrapperComponent.getBoundingClientRect();
  return {
    x: rect.left + state.positionX + x * state.scale,
    y: rect.top + state.positionY + y * state.scale
  };
}
var zoomIn = function(contextInstance) {
  return function(step, animationTime, animationType) {
    if (step === void 0) {
      step = 0.5;
    }
    if (animationTime === void 0) {
      animationTime = 300;
    }
    if (animationType === void 0) {
      animationType = "easeOut";
    }
    return handleZoomToViewCenter(contextInstance, 1, step, animationTime, animationType);
  };
};
var zoomOut = function(contextInstance) {
  return function(step, animationTime, animationType) {
    if (step === void 0) {
      step = 0.5;
    }
    if (animationTime === void 0) {
      animationTime = 300;
    }
    if (animationType === void 0) {
      animationType = "easeOut";
    }
    return handleZoomToViewCenter(contextInstance, -1, step, animationTime, animationType);
  };
};
var setTransform = function(contextInstance) {
  return function(newPositionX, newPositionY, newScale, animationTime, animationType) {
    if (animationTime === void 0) {
      animationTime = 300;
    }
    if (animationType === void 0) {
      animationType = "easeOut";
    }
    var _a = contextInstance.state, positionX = _a.positionX, positionY = _a.positionY, scale = _a.scale;
    var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent;
    var disabled = contextInstance.setup.disabled;
    if (disabled || !wrapperComponent || !contentComponent) {
      return Promise.resolve();
    }
    var targetState = {
      positionX: Number.isNaN(newPositionX) ? positionX : newPositionX,
      positionY: Number.isNaN(newPositionY) ? positionY : newPositionY,
      scale: Number.isNaN(newScale) ? scale : newScale
    };
    return animate(contextInstance, targetState, animationTime, animationType);
  };
};
var resetTransform = function(contextInstance) {
  return function(animationTime, animationType) {
    if (animationTime === void 0) {
      animationTime = 200;
    }
    if (animationType === void 0) {
      animationType = "easeOut";
    }
    return resetTransformations(contextInstance, animationTime, animationType);
  };
};
var centerView = function(contextInstance) {
  return function(scale, animationTime, animationType) {
    if (animationTime === void 0) {
      animationTime = 200;
    }
    if (animationType === void 0) {
      animationType = "easeOut";
    }
    var state = contextInstance.state, wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent;
    if (wrapperComponent && contentComponent) {
      var targetState = getCenterPosition(scale || state.scale, wrapperComponent, contentComponent);
      return animate(contextInstance, targetState, animationTime, animationType);
    }
    return Promise.resolve();
  };
};
var zoomToPoint = function(contextInstance) {
  return function(scale, clientX, clientY, animationTime, animationType) {
    if (animationTime === void 0) {
      animationTime = 300;
    }
    if (animationType === void 0) {
      animationType = "easeOut";
    }
    var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent, setup = contextInstance.setup;
    if (setup.disabled || !wrapperComponent || !contentComponent) {
      return Promise.resolve();
    }
    var point = clientToContentPoint(contextInstance, clientX, clientY);
    var targetState = handleZoomToPoint(contextInstance, scale, point.x, point.y);
    if (!targetState)
      return Promise.resolve();
    var effectiveAnimationTime = setup.zoomAnimation.disabled ? 0 : animationTime;
    return runZoomAnimation(contextInstance, targetState, effectiveAnimationTime, animationType);
  };
};
var clientToContent = function(contextInstance) {
  return function(clientX, clientY) {
    return clientToContentPoint(contextInstance, clientX, clientY);
  };
};
var contentToClient = function(contextInstance) {
  return function(x, y) {
    return contentToClientPoint(contextInstance, x, y);
  };
};
var resolveTargets = function(contextInstance, node) {
  var _a;
  var wrapperComponent = contextInstance.wrapperComponent;
  if (!wrapperComponent)
    return [];
  var rootNode = wrapperComponent.getRootNode();
  var root = rootNode && "getElementById" in rootNode ? rootNode : (_a = wrapperComponent.ownerDocument) !== null && _a !== void 0 ? _a : typeof document !== "undefined" ? document : null;
  var list = Array.isArray(node) ? node : [node];
  return list.map(function(item) {
    return typeof item === "string" ? root === null || root === void 0 ? void 0 : root.getElementById(item) : item;
  }).filter(function(element) {
    return !!element && wrapperComponent.contains(element);
  });
};
var zoomToElement = function(contextInstance) {
  return function(node, scaleOrOptions, animationTime, animationType, offsetX, offsetY) {
    var _a, _b, _c, _d;
    if (animationTime === void 0) {
      animationTime = 600;
    }
    if (animationType === void 0) {
      animationType = "easeOut";
    }
    if (offsetX === void 0) {
      offsetX = 0;
    }
    if (offsetY === void 0) {
      offsetY = 0;
    }
    handleCancelAnimation(contextInstance);
    var options = typeof scaleOrOptions === "object" && scaleOrOptions !== null ? scaleOrOptions : { scale: scaleOrOptions };
    var targets = resolveTargets(contextInstance, node);
    if (!contextInstance.wrapperComponent || targets.length === 0) {
      return Promise.resolve();
    }
    var targetState = calculateZoomToRect(contextInstance, getUnionRect(targets), options.scale, (_a = options.offsetX) !== null && _a !== void 0 ? _a : offsetX, (_b = options.offsetY) !== null && _b !== void 0 ? _b : offsetY, options.minScale, options.maxScale);
    return animate(contextInstance, targetState, (_c = options.animationTime) !== null && _c !== void 0 ? _c : animationTime, (_d = options.animationType) !== null && _d !== void 0 ? _d : animationType);
  };
};
var fitToView = function(contextInstance) {
  return function(options) {
    var _a, _b, _c;
    if (options === void 0) {
      options = {};
    }
    var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent, setup = contextInstance.setup;
    if (setup.disabled || !wrapperComponent || !contentComponent) {
      return Promise.resolve();
    }
    var targetState = calculateFitToView(contextInstance, (_a = options.mode) !== null && _a !== void 0 ? _a : "contain", options.minScale, options.maxScale);
    if (!targetState)
      return Promise.resolve();
    var animationTime = setup.zoomAnimation.disabled ? 0 : (_b = options.animationTime) !== null && _b !== void 0 ? _b : 200;
    return runZoomAnimation(contextInstance, targetState, animationTime, (_c = options.animationType) !== null && _c !== void 0 ? _c : "easeOut");
  };
};
var panBy = function(contextInstance) {
  return function(deltaX, deltaY, animationTime, animationType) {
    if (animationTime === void 0) {
      animationTime = 200;
    }
    if (animationType === void 0) {
      animationType = "easeOut";
    }
    var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent, setup = contextInstance.setup, state = contextInstance.state;
    if (setup.disabled || !wrapperComponent || !contentComponent) {
      return Promise.resolve();
    }
    if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
      return Promise.resolve();
    }
    var bounds = handleCalculateBounds(contextInstance, state.scale);
    var _a = getMouseBoundedPosition(state.positionX + deltaX, state.positionY + deltaY, bounds, setup.limitToBounds, 0, 0, wrapperComponent), x = _a.x, y = _a.y;
    if (x === state.positionX && y === state.positionY) {
      return Promise.resolve();
    }
    return runPanAnimation(contextInstance, { scale: state.scale, positionX: x, positionY: y }, animationTime, animationType);
  };
};
var getControls = function(contextInstance) {
  return {
    instance: contextInstance,
    state: contextInstance.state,
    zoomIn: zoomIn(contextInstance),
    zoomOut: zoomOut(contextInstance),
    setTransform: setTransform(contextInstance),
    resetTransform: resetTransform(contextInstance),
    centerView: centerView(contextInstance),
    zoomToElement: zoomToElement(contextInstance),
    zoomToPoint: zoomToPoint(contextInstance),
    clientToContent: clientToContent(contextInstance),
    contentToClient: contentToClient(contextInstance),
    fitToView: fitToView(contextInstance),
    panBy: panBy(contextInstance)
  };
};
var getState = function(contextInstance) {
  return {
    instance: contextInstance,
    state: contextInstance.state
  };
};
var getContext = function(contextInstance) {
  var ref = {};
  Object.assign(ref, getState(contextInstance));
  Object.assign(ref, getControls(contextInstance));
  return ref;
};
var passiveSupported = false;
function makePassiveEventOption() {
  try {
    var options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    return options;
  } catch (err) {
    passiveSupported = false;
    return passiveSupported;
  }
}
var matchPrefix = ".".concat(baseClasses.wrapperClass);
var isExcludedNode = function(node, excluded) {
  return excluded.some(function(exclude) {
    return node.matches("".concat(matchPrefix, " ").concat(exclude, ", ").concat(matchPrefix, " .").concat(exclude, ", ").concat(matchPrefix, " ").concat(exclude, " *, ").concat(matchPrefix, " .").concat(exclude, " *"));
  });
};
var EDITABLE_TAGS = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT", "OPTION"]);
var CONTENT_EDITABLE_SELECTOR = '[contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]';
var DRAGGABLE_SELECTOR = '[draggable="true"]';
var asElement = function(node) {
  if (!node || typeof node.closest !== "function") {
    return null;
  }
  return node;
};
var isEditableTarget = function(node) {
  var element = asElement(node);
  if (!element)
    return false;
  if (EDITABLE_TAGS.has(element.tagName))
    return true;
  if (element.isContentEditable)
    return true;
  return element.closest(CONTENT_EDITABLE_SELECTOR) !== null;
};
var isDraggableTarget = function(node) {
  var element = asElement(node);
  if (!element)
    return false;
  return element.closest(DRAGGABLE_SELECTOR) !== null;
};
var cancelTimeout = function(timeout) {
  if (timeout) {
    clearTimeout(timeout);
  }
};
var roundScaleForTransform = function(scale) {
  return Number.parseFloat(scale.toFixed(8));
};
var STYLE_MARKER = "data-react-zoom-pan-pinch";
function injectStylesheet(wrapper, css, nonce) {
  if (!css || typeof wrapper.getRootNode !== "function")
    return;
  var doc = wrapper.ownerDocument;
  var root = wrapper.getRootNode();
  var isShadowRoot = root.nodeType === 11 && "host" in root;
  var container = isShadowRoot ? root : doc.head;
  if (!container)
    return;
  var existing = container.querySelectorAll("style[".concat(STYLE_MARKER, "]"));
  for (var index = 0; index < existing.length; index += 1) {
    if (existing[index].textContent === css)
      return;
  }
  var style = doc.createElement("style");
  style.setAttribute(STYLE_MARKER, "");
  if (nonce)
    style.setAttribute("nonce", nonce);
  style.textContent = css;
  container.appendChild(style);
}
var getTransformStyles = function(x, y, scale) {
  var s = roundScaleForTransform(scale);
  return "translate(".concat(x, "px, ").concat(y, "px) scale(").concat(s, ")");
};
var getCenterPosition = function(scale, wrapperComponent, contentComponent) {
  var contentWidth = contentComponent.offsetWidth * scale;
  var contentHeight = contentComponent.offsetHeight * scale;
  var centerPositionX = (wrapperComponent.clientWidth - contentWidth) / 2;
  var centerPositionY = (wrapperComponent.clientHeight - contentHeight) / 2;
  return {
    scale,
    positionX: centerPositionX,
    positionY: centerPositionY
  };
};
function mergeRefs(refs) {
  return function(value) {
    refs.forEach(function(ref) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var useIsomorphicLayoutEffect2 = typeof window !== "undefined" ? import_react12.useLayoutEffect : import_react12.useEffect;
var KEYBOARD_KEYS = {
  panLeft: ["ArrowLeft"],
  panRight: ["ArrowRight"],
  panUp: ["ArrowUp"],
  panDown: ["ArrowDown"],
  zoomIn: ["+", "="],
  zoomOut: ["-", "_"],
  reset: ["0"]
};
var isHandledKey = function(key) {
  return Object.values(KEYBOARD_KEYS).some(function(keys) {
    return keys.includes(key);
  });
};
function handleKeyboardNavigation(contextInstance, event) {
  var _a = contextInstance.setup, disabled = _a.disabled, keyboard = _a.keyboard, panning = _a.panning;
  if (disabled || keyboard.disabled)
    return false;
  if (event.defaultPrevented)
    return false;
  if (event.ctrlKey || event.metaKey || event.altKey)
    return false;
  if (!isHandledKey(event.key))
    return false;
  var target = event.target;
  if (isEditableTarget(target))
    return false;
  if (target && typeof target.matches === "function" && isExcludedNode(target, keyboard.excluded)) {
    return false;
  }
  var panStep = keyboard.panStep, zoomStep = keyboard.zoomStep, animationTime = keyboard.animationTime, animationType = keyboard.animationType;
  var controls = getControls(contextInstance);
  var key = event.key;
  var stepX = panning.lockAxisX ? 0 : panStep;
  var stepY = panning.lockAxisY ? 0 : panStep;
  if (key === "ArrowLeft") {
    controls.panBy(stepX, 0, animationTime, animationType);
  } else if (key === "ArrowRight") {
    controls.panBy(-stepX, 0, animationTime, animationType);
  } else if (key === "ArrowUp") {
    controls.panBy(0, stepY, animationTime, animationType);
  } else if (key === "ArrowDown") {
    controls.panBy(0, -stepY, animationTime, animationType);
  } else if (key === "+" || key === "=") {
    controls.zoomIn(zoomStep, animationTime, animationType);
  } else if (key === "-" || key === "_") {
    controls.zoomOut(zoomStep, animationTime, animationType);
  } else if (key === "0") {
    controls.resetTransform(animationTime, animationType);
  }
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
  return true;
}
var measureSizes = function(wrapperComponent, contentComponent) {
  return {
    wrapperWidth: wrapperComponent.offsetWidth,
    wrapperHeight: wrapperComponent.offsetHeight,
    contentWidth: contentComponent.offsetWidth,
    contentHeight: contentComponent.offsetHeight
  };
};
var hasSizeChanged = function(previous, current) {
  return !previous || previous.wrapperWidth !== current.wrapperWidth || previous.wrapperHeight !== current.wrapperHeight || previous.contentWidth !== current.contentWidth || previous.contentHeight !== current.contentHeight;
};
var isPointerGestureActive = function(contextInstance) {
  return contextInstance.isPanning || contextInstance.isPinching;
};
var isGestureActive = function(contextInstance) {
  return isPointerGestureActive(contextInstance) || contextInstance.wheelStopEventTimer !== null || contextInstance.wheelAnimationTimer !== null;
};
function calculateResizeAlignment(contextInstance) {
  var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent, setup = contextInstance.setup, state = contextInstance.state;
  if (!wrapperComponent || !contentComponent)
    return null;
  var bounds = handleCalculateBounds(contextInstance, state.scale);
  var limitToBounds = setup.limitToBounds, centerZoomedOut = setup.centerZoomedOut;
  if (!limitToBounds && !centerZoomedOut)
    return null;
  var _a = getMouseBoundedPosition(state.positionX, state.positionY, bounds, true, 0, 0, wrapperComponent), x = _a.x, y = _a.y;
  var isAligned = x === roundNumber(state.positionX, 2) && y === roundNumber(state.positionY, 2);
  if (isAligned)
    return null;
  return { scale: state.scale, positionX: x, positionY: y };
}
var stopResizeTracking = function(contextInstance) {
  contextInstance.animation = null;
  contextInstance.animationFrame = null;
  contextInstance.isAnimating = false;
  contextInstance.resizeAnimation = null;
};
function startResizeTracking(contextInstance) {
  var animationTime = contextInstance.setup.autoAlignment.animationTime;
  var tau = Math.max(animationTime / 5, 1);
  handleCancelAnimation(contextInstance);
  var lastFrameTime = Date.now();
  var track = function() {
    if (!contextInstance.mounted || contextInstance.animation !== track) {
      return;
    }
    var now = Date.now();
    var frameTime = Math.max(now - lastFrameTime, 1);
    lastFrameTime = now;
    var targetState = calculateResizeAlignment(contextInstance);
    if (!targetState) {
      stopResizeTracking(contextInstance);
      return;
    }
    var _a = contextInstance.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
    var factor = 1 - Math.exp(-frameTime / tau);
    var x = positionX + (targetState.positionX - positionX) * factor;
    var y = positionY + (targetState.positionY - positionY) * factor;
    var isSettled = Math.abs(targetState.positionX - x) < 0.5 && Math.abs(targetState.positionY - y) < 0.5;
    if (isSettled) {
      x = targetState.positionX;
      y = targetState.positionY;
    }
    contextInstance.isAnimating = !isSettled;
    contextInstance.setState(scale, x, y);
    if (isSettled) {
      stopResizeTracking(contextInstance);
      return;
    }
    contextInstance.animationFrame = requestAnimationFrame(track);
  };
  contextInstance.animation = track;
  contextInstance.resizeAnimation = track;
  contextInstance.animationResolve = null;
  contextInstance.animationFrame = requestAnimationFrame(track);
}
function handleResizeAlignment(contextInstance) {
  if (contextInstance.setup.disabled) {
    handleCalculateBounds(contextInstance, contextInstance.state.scale);
    return;
  }
  if (isPointerGestureActive(contextInstance)) {
    contextInstance.isResizeAlignmentPending = true;
    return;
  }
  var isOwnAnimation = contextInstance.animation !== null && contextInstance.animation === contextInstance.resizeAnimation;
  if (contextInstance.animation && !isOwnAnimation) {
    var scale = contextInstance.state.scale;
    var _a = contextInstance.setup, minScale = _a.minScale, maxScale = _a.maxScale;
    if (scale < minScale || scale > maxScale) {
      contextInstance.isResizeAlignmentPending = true;
      return;
    }
    handleCancelAnimation(contextInstance);
  }
  var targetState = calculateResizeAlignment(contextInstance);
  if (!targetState) {
    if (isOwnAnimation)
      stopResizeTracking(contextInstance);
    return;
  }
  if (isOwnAnimation)
    return;
  if (contextInstance.setup.autoAlignment.animationTime === 0) {
    contextInstance.setState(targetState.scale, targetState.positionX, targetState.positionY);
    return;
  }
  startResizeTracking(contextInstance);
}
function handleSizeChange(contextInstance) {
  var wrapperComponent = contextInstance.wrapperComponent, contentComponent = contextInstance.contentComponent;
  if (!wrapperComponent || !contentComponent)
    return;
  var sizes = measureSizes(wrapperComponent, contentComponent);
  if (!hasSizeChanged(contextInstance.measuredSizes, sizes))
    return;
  contextInstance.measuredSizes = sizes;
  handleResizeAlignment(contextInstance);
}
var isWheelAllowed = function(contextInstance, event) {
  var _a = contextInstance.setup.wheel, disabled = _a.disabled, wheelDisabled = _a.wheelDisabled, touchPadDisabled = _a.touchPadDisabled, excluded = _a.excluded;
  var isInitialized = contextInstance.isInitialized;
  var target = event.target;
  var isAllowed = isInitialized && !disabled && target;
  if (!isAllowed)
    return false;
  if (event.deltaY === 0)
    return false;
  if (wheelDisabled && !event.ctrlKey)
    return false;
  if (touchPadDisabled && event.ctrlKey)
    return false;
  var isExcluded = isExcludedNode(target, excluded);
  if (isExcluded)
    return false;
  var keysPressed = contextInstance.isPressingKeys(contextInstance.setup.wheel.activationKeys);
  if (!keysPressed)
    return false;
  return true;
};
var isWheelPanningAllowed = function(contextInstance, event) {
  var _a = contextInstance.setup, disabled = _a.disabled, trackPadPanning = _a.trackPadPanning;
  var activationKeys = trackPadPanning.activationKeys, excluded = trackPadPanning.excluded;
  if (!contextInstance.wrapperComponent || !contextInstance.contentComponent) {
    return false;
  }
  if (disabled || trackPadPanning.disabled || event.ctrlKey) {
    return false;
  }
  if (contextInstance.isPanning)
    return false;
  var isAllowed = isWheelAllowed(contextInstance, event);
  if (isAllowed)
    return false;
  var target = event.target;
  var isExcluded = isExcludedNode(target, excluded);
  if (isExcluded)
    return false;
  var keysPressed = contextInstance.isPressingKeys(activationKeys);
  if (!keysPressed)
    return false;
  return true;
};
var WHEEL_LINE_HEIGHT = 16;
function getWheelPanDelta(event, wrapperComponent, speed) {
  var unitX = 1;
  var unitY = 1;
  if (event.deltaMode === 1) {
    unitX = WHEEL_LINE_HEIGHT;
    unitY = WHEEL_LINE_HEIGHT;
  } else if (event.deltaMode === 2) {
    unitX = wrapperComponent.clientWidth;
    unitY = wrapperComponent.clientHeight;
  }
  var x = event.deltaX * unitX;
  var y = event.deltaY * unitY;
  if (event.shiftKey && !x) {
    x = y;
    y = 0;
  }
  return { x: x * speed, y: y * speed };
}
var getDeltaY = function(event) {
  if (event) {
    return event.deltaY < 0 ? 1 : -1;
  }
  return 0;
};
function getDelta(event, customDelta) {
  var deltaY = getDeltaY(event);
  var delta = checkIsNumber(customDelta, deltaY);
  return delta;
}
function getMousePosition(event, contentComponent, scale) {
  var contentRect = contentComponent.getBoundingClientRect();
  var mouseX = 0;
  var mouseY = 0;
  if ("clientX" in event) {
    mouseX = (event.clientX - contentRect.left) / scale;
    mouseY = (event.clientY - contentRect.top) / scale;
  } else {
    var touch = event.touches[0];
    mouseX = (touch.clientX - contentRect.left) / scale;
    mouseY = (touch.clientY - contentRect.top) / scale;
  }
  if (Number.isNaN(mouseX) || Number.isNaN(mouseY)) {
    console.error("No mouse or touch offset found");
    return { x: 0, y: 0 };
  }
  return {
    x: mouseX,
    y: mouseY
  };
}
var handleCalculateWheelZoom = function(contextInstance, delta, step, disable, getTarget) {
  var scale = contextInstance.state.scale;
  var wrapperComponent = contextInstance.wrapperComponent, setup = contextInstance.setup;
  var maxScale = setup.maxScale, minScale = setup.minScale, zoomAnimation = setup.zoomAnimation, disablePadding = setup.disablePadding;
  var size = zoomAnimation.size, disabled = zoomAnimation.disabled;
  if (!wrapperComponent) {
    throw new Error("Wrapper is not mounted");
  }
  var targetScale = scale + delta * step;
  if (getTarget)
    return targetScale;
  var paddingEnabled = disable ? false : !disabled;
  var newScale = checkZoomBounds(targetScale, minScale, maxScale, size, paddingEnabled && !disablePadding);
  return newScale;
};
var handleWheelZoomStop = function(contextInstance, event) {
  var previousWheelEvent = contextInstance.previousWheelEvent;
  var scale = contextInstance.state.scale;
  var _a = contextInstance.setup, maxScale = _a.maxScale, minScale = _a.minScale;
  if (!previousWheelEvent)
    return false;
  if (scale < maxScale || scale > minScale)
    return true;
  if (Math.sign(previousWheelEvent.deltaY) !== Math.sign(event.deltaY))
    return true;
  if (previousWheelEvent.deltaY > 0 && previousWheelEvent.deltaY < event.deltaY)
    return true;
  if (previousWheelEvent.deltaY < 0 && previousWheelEvent.deltaY > event.deltaY)
    return true;
  if (Math.sign(previousWheelEvent.deltaY) !== Math.sign(event.deltaY))
    return true;
  return false;
};
var isPinchStartAllowed = function(contextInstance, event) {
  var _a = contextInstance.setup.pinch, disabled = _a.disabled, excluded = _a.excluded;
  var isInitialized = contextInstance.isInitialized;
  var target = event.target;
  var isAllowed = isInitialized && !disabled && target;
  if (!isAllowed)
    return false;
  var isExcluded = isExcludedNode(target, excluded);
  if (isExcluded)
    return false;
  return true;
};
var isPinchAllowed = function(contextInstance) {
  var disabled = contextInstance.setup.pinch.disabled;
  var isInitialized = contextInstance.isInitialized, pinchStartDistance = contextInstance.pinchStartDistance;
  var isAllowed = isInitialized && !disabled && pinchStartDistance !== null;
  if (!isAllowed)
    return false;
  return true;
};
var calculateTouchMidPoint = function(event, scale, contentComponent) {
  var contentRect = contentComponent.getBoundingClientRect();
  var touches = event.touches;
  var firstPointX = touches[0].clientX - contentRect.left;
  var firstPointY = touches[0].clientY - contentRect.top;
  var secondPointX = touches[1].clientX - contentRect.left;
  var secondPointY = touches[1].clientY - contentRect.top;
  return {
    x: (firstPointX + secondPointX) / 2 / scale,
    y: (firstPointY + secondPointY) / 2 / scale
  };
};
var getTouchDistance = function(event) {
  return Math.sqrt(Math.pow(event.touches[0].pageX - event.touches[1].pageX, 2) + Math.pow(event.touches[0].pageY - event.touches[1].pageY, 2));
};
var DEFAULT_PINCH_STEP = 5;
var calculatePinchZoom = function(contextInstance, currentDistance) {
  var pinchStartScale = contextInstance.pinchStartScale, pinchStartDistance = contextInstance.pinchStartDistance, setup = contextInstance.setup;
  var maxScale = setup.maxScale, minScale = setup.minScale, zoomAnimation = setup.zoomAnimation, disablePadding = setup.disablePadding, pinch = setup.pinch;
  var size = zoomAnimation.size, disabled = zoomAnimation.disabled;
  var step = pinch.step;
  if (!pinchStartScale || pinchStartDistance === null) {
    throw new Error("Pinch touches distance was not provided");
  }
  if (currentDistance < 0) {
    return contextInstance.state.scale;
  }
  var touchProportion = currentDistance / pinchStartDistance;
  var rawScale = touchProportion * pinchStartScale;
  var scaleDelta = (rawScale - pinchStartScale) * (step / DEFAULT_PINCH_STEP);
  var computed = pinchStartScale + scaleDelta;
  var scale = computed === Infinity ? 0 : roundNumber(computed, 10);
  return checkZoomBounds(scale, minScale, maxScale, size, !disabled && !disablePadding);
};
var wheelStopEventTime = 160;
var wheelAnimationTime = 100;
var handleWheelStart = function(contextInstance, event) {
  var _a = contextInstance.props, onWheelStart = _a.onWheelStart, onZoomStart = _a.onZoomStart;
  handleCancelAnimation(contextInstance);
  if (!contextInstance.wheelStopEventTimer) {
    handleCallback(getContext(contextInstance), event, onWheelStart);
    handleCallback(getContext(contextInstance), event, onZoomStart);
  }
};
var handleWheelZoom = function(contextInstance, event) {
  var _a = contextInstance.props, onWheel = _a.onWheel, onZoom = _a.onZoom;
  var contentComponent = contextInstance.contentComponent, setup = contextInstance.setup, state = contextInstance.state;
  var scale = state.scale;
  var limitToBounds = setup.limitToBounds, centerZoomedOut = setup.centerZoomedOut, zoomAnimation = setup.zoomAnimation, wheel = setup.wheel, disablePadding = setup.disablePadding, smooth = setup.smooth;
  var size = zoomAnimation.size, disabled = zoomAnimation.disabled;
  var step = wheel.step;
  if (!contentComponent) {
    throw new Error("Component not mounted");
  }
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
  var isPanning = contextInstance.isPanning;
  var delta = getDelta(event, null);
  var zoomStep = smooth ? step * Math.abs(event.deltaY) : step;
  var newScale = handleCalculateWheelZoom(contextInstance, delta, zoomStep, !event.ctrlKey || isPanning);
  if (scale === newScale)
    return;
  var bounds = handleCalculateBounds(contextInstance, newScale);
  var mousePosition = getMousePosition(event, contentComponent, scale);
  var isPaddingDisabled = disabled || size === 0 || centerZoomedOut || disablePadding;
  var isLimitedToBounds = limitToBounds && isPaddingDisabled;
  var _b = handleCalculateZoomPositions(contextInstance, mousePosition.x, mousePosition.y, newScale, bounds, isLimitedToBounds), x = _b.x, y = _b.y;
  contextInstance.previousWheelEvent = event;
  contextInstance.setState(newScale, x, y);
  if (isPanning) {
    handlePanningSetup(contextInstance, event);
    contextInstance.lastMousePosition = null;
    contextInstance.velocity = null;
  }
  handleCallback(getContext(contextInstance), event, onWheel);
  handleCallback(getContext(contextInstance), event, onZoom);
};
var handleWheelStop = function(contextInstance, event) {
  var _a = contextInstance.props, onWheelStop = _a.onWheelStop, onZoomStop = _a.onZoomStop;
  cancelTimeout(contextInstance.wheelAnimationTimer);
  contextInstance.wheelAnimationTimer = setTimeout(function() {
    if (!contextInstance.mounted)
      return;
    contextInstance.wheelAnimationTimer = null;
    if (contextInstance.isPanning)
      return;
    handleAlignToScaleBounds(contextInstance, event.x, event.y);
    contextInstance.flushResizeAlignment();
  }, wheelAnimationTime);
  var hasStoppedZooming = handleWheelZoomStop(contextInstance, event);
  if (hasStoppedZooming) {
    cancelTimeout(contextInstance.wheelStopEventTimer);
    contextInstance.wheelStopEventTimer = setTimeout(function() {
      if (!contextInstance.mounted)
        return;
      contextInstance.wheelStopEventTimer = null;
      handleCallback(getContext(contextInstance), event, onWheelStop);
      handleCallback(getContext(contextInstance), event, onZoomStop);
      contextInstance.flushResizeAlignment();
    }, wheelStopEventTime);
  }
};
var handleWheelPanningStart = function(contextInstance, event) {
  var _a = contextInstance.props, onWheelStart = _a.onWheelStart, onPanningStart = _a.onPanningStart;
  handleCancelAnimation(contextInstance);
  if (!contextInstance.wheelStopEventTimer) {
    if (!contextInstance.wheelAnimationTimer) {
      handleCalculateBounds(contextInstance, contextInstance.state.scale);
    }
    handleCallback(getContext(contextInstance), event, onWheelStart);
    handleCallback(getContext(contextInstance), event, onPanningStart);
  }
};
var handleWheelPanningStop = function(contextInstance, event) {
  var _a = contextInstance.props, onWheelStop = _a.onWheelStop, onPanningStop = _a.onPanningStop;
  cancelTimeout(contextInstance.wheelAnimationTimer);
  contextInstance.wheelAnimationTimer = setTimeout(function() {
    if (!contextInstance.mounted)
      return;
    handleAlignToScaleBounds(contextInstance, event.x, event.y);
    contextInstance.wheelAnimationTimer = null;
    contextInstance.flushResizeAlignment();
  }, wheelAnimationTime);
  var hasStoppedZooming = handleWheelZoomStop(contextInstance, event);
  if (hasStoppedZooming) {
    cancelTimeout(contextInstance.wheelStopEventTimer);
    contextInstance.wheelStopEventTimer = setTimeout(function() {
      if (!contextInstance.mounted)
        return;
      contextInstance.wheelStopEventTimer = null;
      handleCallback(getContext(contextInstance), event, onWheelStop);
      handleCallback(getContext(contextInstance), event, onPanningStop);
      contextInstance.flushResizeAlignment();
    }, wheelStopEventTime);
  }
};
var getTouchCenter = function(event) {
  var totalX = 0;
  var totalY = 0;
  for (var i = 0; i < 2; i += 1) {
    totalX += event.touches[i].clientX;
    totalY += event.touches[i].clientY;
  }
  var x = totalX / 2;
  var y = totalY / 2;
  return { x, y };
};
var handlePinchStart = function(contextInstance, event) {
  var distance = getTouchDistance(event);
  contextInstance.pinchStartDistance = distance;
  contextInstance.lastDistance = distance;
  contextInstance.pinchStartScale = contextInstance.state.scale;
  contextInstance.isPanning = false;
  contextInstance.isPinching = true;
  contextInstance.pinchPreviousCenter = getTouchCenter(event);
  handleCancelAnimation(contextInstance);
};
var handlePinchZoom = function(contextInstance, event) {
  var contentComponent = contextInstance.contentComponent, pinchStartDistance = contextInstance.pinchStartDistance, wrapperComponent = contextInstance.wrapperComponent, pinchPreviousCenter = contextInstance.pinchPreviousCenter;
  var scale = contextInstance.state.scale;
  var _a = contextInstance.setup, limitToBounds = _a.limitToBounds, centerZoomedOut = _a.centerZoomedOut, zoomAnimation = _a.zoomAnimation, autoAlignment = _a.autoAlignment, pinch = _a.pinch, panning = _a.panning;
  var disabled = zoomAnimation.disabled, size = zoomAnimation.size;
  var allowPanning = pinch.allowPanning;
  if (pinchStartDistance === null || !contentComponent)
    return;
  var midPoint = calculateTouchMidPoint(event, scale, contentComponent);
  if (!Number.isFinite(midPoint.x) || !Number.isFinite(midPoint.y))
    return;
  var currentDistance = getTouchDistance(event);
  var newScale = calculatePinchZoom(contextInstance, currentDistance);
  var center = getTouchCenter(event);
  var scaleDiff = scale / newScale;
  var panX = (center.x - ((pinchPreviousCenter === null || pinchPreviousCenter === void 0 ? void 0 : pinchPreviousCenter.x) || 0)) * scaleDiff;
  var panY = (center.y - ((pinchPreviousCenter === null || pinchPreviousCenter === void 0 ? void 0 : pinchPreviousCenter.y) || 0)) * scaleDiff;
  if (newScale === scale && panX === 0 && panY === 0)
    return;
  contextInstance.pinchPreviousCenter = center;
  var bounds = handleCalculateBounds(contextInstance, newScale);
  var isPaddingDisabled = disabled || size === 0 || centerZoomedOut;
  var isLimitedToBounds = limitToBounds && isPaddingDisabled;
  var _b = handleCalculateZoomPositions(contextInstance, midPoint.x, midPoint.y, newScale, bounds, isLimitedToBounds), x = _b.x, y = _b.y;
  contextInstance.pinchMidpoint = midPoint;
  contextInstance.lastDistance = currentDistance;
  if (panning.disabled || !allowPanning) {
    contextInstance.setState(newScale, x, y);
  } else {
    var sizeX = autoAlignment.sizeX, sizeY = autoAlignment.sizeY;
    var paddingValueX = getPaddingValue(contextInstance, sizeX, newScale);
    var paddingValueY = getPaddingValue(contextInstance, sizeY, newScale);
    var newPositionX = x + panX;
    var newPositionY = y + panY;
    var _c = getMouseBoundedPosition(newPositionX, newPositionY, bounds, limitToBounds, paddingValueX, paddingValueY, wrapperComponent), finalX = _c.x, finalY = _c.y;
    contextInstance.setState(newScale, finalX, finalY);
  }
};
var handlePinchStop = function(contextInstance) {
  var pinchMidpoint = contextInstance.pinchMidpoint;
  contextInstance.velocity = null;
  contextInstance.lastDistance = null;
  contextInstance.pinchMidpoint = null;
  contextInstance.pinchStartScale = null;
  contextInstance.pinchStartDistance = null;
  contextInstance.isPinching = false;
  handleAlignToScaleBounds(contextInstance, pinchMidpoint === null || pinchMidpoint === void 0 ? void 0 : pinchMidpoint.x, pinchMidpoint === null || pinchMidpoint === void 0 ? void 0 : pinchMidpoint.y);
};
var handleDoubleClickStop = function(contextInstance, event) {
  var onZoomStop = contextInstance.props.onZoomStop;
  var animationTime = contextInstance.setup.doubleClick.animationTime;
  cancelTimeout(contextInstance.doubleClickStopEventTimer);
  contextInstance.doubleClickStopEventTimer = setTimeout(function() {
    contextInstance.doubleClickStopEventTimer = null;
    if (!contextInstance.mounted)
      return;
    handleCallback(getContext(contextInstance), event, onZoomStop);
  }, animationTime);
};
var handleDoubleClickResetMode = function(contextInstance, event) {
  var _a = contextInstance.props, onZoomStart = _a.onZoomStart, onZoom = _a.onZoom;
  var _b = contextInstance.setup.doubleClick, animationTime = _b.animationTime, animationType = _b.animationType;
  handleCallback(getContext(contextInstance), event, onZoomStart);
  resetTransformations(contextInstance, animationTime, animationType, function() {
    return handleCallback(getContext(contextInstance), event, onZoom);
  });
  handleDoubleClickStop(contextInstance, event);
};
function getDoubleClickScale(mode) {
  return mode === "zoomOut" ? -1 : 1;
}
var RESET_SCALE_TOLERANCE = 1e-3;
function handleDoubleClick(contextInstance, event) {
  var setup = contextInstance.setup, doubleClickStopEventTimer = contextInstance.doubleClickStopEventTimer, state = contextInstance.state, contentComponent = contextInstance.contentComponent;
  var scale = state.scale;
  var _a = contextInstance.props, onZoomStart = _a.onZoomStart, onZoom = _a.onZoom;
  var _b = setup.doubleClick, disabled = _b.disabled, mode = _b.mode, step = _b.step, animationTime = _b.animationTime, animationType = _b.animationType;
  if (disabled)
    return;
  if (doubleClickStopEventTimer)
    return;
  if (mode === "reset") {
    return handleDoubleClickResetMode(contextInstance, event);
  }
  if (mode === "toggle") {
    var resetScale = getResetScale(contextInstance);
    if (Math.abs(scale - resetScale) > RESET_SCALE_TOLERANCE) {
      return handleDoubleClickResetMode(contextInstance, event);
    }
  }
  if (!contentComponent)
    return console.error("No ContentComponent found");
  var delta = getDoubleClickScale(mode);
  var newScale = handleCalculateButtonZoom(contextInstance, delta, step);
  if (scale === newScale)
    return;
  handleCallback(getContext(contextInstance), event, onZoomStart);
  var mousePosition = getMousePosition(event, contentComponent, scale);
  var targetState = handleZoomToPoint(contextInstance, newScale, mousePosition.x, mousePosition.y);
  if (!targetState) {
    return console.error("Error during zoom event. New transformation state was not calculated.");
  }
  handleCallback(getContext(contextInstance), event, onZoom);
  animate(contextInstance, targetState, animationTime, animationType);
  handleDoubleClickStop(contextInstance, event);
}
var isDoubleClickAllowed = function(contextInstance, event) {
  var isInitialized = contextInstance.isInitialized, setup = contextInstance.setup, wrapperComponent = contextInstance.wrapperComponent;
  var _a = setup.doubleClick, disabled = _a.disabled, excluded = _a.excluded;
  var target = event.target;
  var isWrapperChild = wrapperComponent === null || wrapperComponent === void 0 ? void 0 : wrapperComponent.contains(target);
  var isAllowed = isInitialized && target && isWrapperChild && !disabled;
  if (!isAllowed)
    return false;
  var isExcluded = isExcludedNode(target, excluded);
  if (isExcluded)
    return false;
  if (isEditableTarget(target))
    return false;
  return true;
};
var ZoomPanPinch = (
  /** @class */
  /* @__PURE__ */ (function() {
    function ZoomPanPinch2(props) {
      var _this = this;
      this.mounted = true;
      this.onChangeCallbacks = /* @__PURE__ */ new Set();
      this.onInitCallbacks = /* @__PURE__ */ new Set();
      this.onTransformCallbacks = /* @__PURE__ */ new Set();
      this.wrapperComponent = null;
      this.contentComponent = null;
      this.isInitialized = false;
      this.bounds = null;
      this.previousWheelEvent = null;
      this.wheelStopEventTimer = null;
      this.wheelAnimationTimer = null;
      this.isPanning = false;
      this.isWheelPanning = false;
      this.startCoords = null;
      this.panStartPosition = null;
      this.panGesture = null;
      this.lastTouch = null;
      this.isPinching = false;
      this.distance = null;
      this.lastDistance = null;
      this.pinchStartDistance = null;
      this.pinchStartScale = null;
      this.pinchMidpoint = null;
      this.pinchPreviousCenter = null;
      this.doubleClickStopEventTimer = null;
      this.velocity = null;
      this.velocityTime = null;
      this.lastMousePosition = null;
      this.isAnimating = false;
      this.animation = null;
      this.animationFrame = null;
      this.animationResolve = null;
      this.initObserverTimer = null;
      this.isInitialLayoutPending = false;
      this.measuredSizes = null;
      this.isResizeAlignmentPending = false;
      this.resizeAnimation = null;
      this.pressedKeys = {};
      this.selectionLock = null;
      this.mount = function() {
        _this.mounted = true;
        _this.initializeWindowEvents();
      };
      this.unmount = function() {
        _this.mounted = false;
        _this.cleanupWindowEvents();
      };
      this.update = function(newProps) {
        _this.props = newProps;
        _this.setup = createSetup(newProps);
        if (_this.wrapperComponent && _this.contentComponent && !isGestureActive(_this)) {
          handleCalculateBounds(_this, _this.state.scale);
        }
      };
      this.clearTimers = function() {
        if (_this.wheelStopEventTimer)
          clearTimeout(_this.wheelStopEventTimer);
        if (_this.wheelAnimationTimer)
          clearTimeout(_this.wheelAnimationTimer);
        if (_this.doubleClickStopEventTimer) {
          clearTimeout(_this.doubleClickStopEventTimer);
        }
        if (_this.initObserverTimer)
          clearTimeout(_this.initObserverTimer);
        _this.wheelStopEventTimer = null;
        _this.wheelAnimationTimer = null;
        _this.doubleClickStopEventTimer = null;
        _this.initObserverTimer = null;
      };
      this.initializeWindowEvents = function() {
        var _a, _b, _c, _d;
        var passive = makePassiveEventOption();
        var currentDocument = (_a = _this.wrapperComponent) === null || _a === void 0 ? void 0 : _a.ownerDocument;
        var currentWindow = currentDocument === null || currentDocument === void 0 ? void 0 : currentDocument.defaultView;
        (_b = _this.wrapperComponent) === null || _b === void 0 ? void 0 : _b.addEventListener("wheel", _this.onWheelPanning, passive);
        (_c = _this.wrapperComponent) === null || _c === void 0 ? void 0 : _c.addEventListener("keyup", _this.setKeyUnPressed, passive);
        (_d = _this.wrapperComponent) === null || _d === void 0 ? void 0 : _d.addEventListener("keydown", _this.setKeyPressed, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.addEventListener("mousedown", _this.onPanningStart, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.addEventListener("mousemove", _this.onPanning, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.addEventListener("mouseup", _this.onPanningStop, passive);
        currentDocument === null || currentDocument === void 0 ? void 0 : currentDocument.addEventListener("mouseleave", _this.clearPanning, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.addEventListener("keyup", _this.setKeyUnPressed, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.addEventListener("keydown", _this.setKeyPressed, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.addEventListener("blur", _this.handleWindowBlur);
      };
      this.cleanupWindowEvents = function() {
        var _a, _b, _c, _d, _e;
        var passive = makePassiveEventOption();
        var currentDocument = (_a = _this.wrapperComponent) === null || _a === void 0 ? void 0 : _a.ownerDocument;
        var currentWindow = currentDocument === null || currentDocument === void 0 ? void 0 : currentDocument.defaultView;
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.removeEventListener("mousedown", _this.onPanningStart, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.removeEventListener("mousemove", _this.onPanning, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.removeEventListener("mouseup", _this.onPanningStop, passive);
        currentDocument === null || currentDocument === void 0 ? void 0 : currentDocument.removeEventListener("mouseleave", _this.clearPanning, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.removeEventListener("keyup", _this.setKeyUnPressed, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.removeEventListener("keydown", _this.setKeyPressed, passive);
        currentWindow === null || currentWindow === void 0 ? void 0 : currentWindow.removeEventListener("blur", _this.handleWindowBlur);
        (_b = _this.wrapperComponent) === null || _b === void 0 ? void 0 : _b.removeEventListener("wheel", _this.onWheelPanning, passive);
        (_c = _this.wrapperComponent) === null || _c === void 0 ? void 0 : _c.removeEventListener("keyup", _this.setKeyUnPressed, passive);
        (_d = _this.wrapperComponent) === null || _d === void 0 ? void 0 : _d.removeEventListener("keydown", _this.setKeyPressed, passive);
        _this.cleanupWrapperEvents();
        _this.clearTimers();
        handleCancelAnimation(_this);
        _this.unlockTextSelection();
        (_e = _this.observer) === null || _e === void 0 ? void 0 : _e.disconnect();
        _this.observer = void 0;
        _this.isInitialLayoutPending = false;
        _this.isResizeAlignmentPending = false;
        _this.resizeAnimation = null;
      };
      this.cleanupWrapperEvents = function() {
        var wrapper = _this.wrapperComponent;
        if (!wrapper)
          return;
        var passive = makePassiveEventOption();
        wrapper.removeEventListener("wheel", _this.onWheelZoom, passive);
        wrapper.removeEventListener("dblclick", _this.onDoubleClick, passive);
        wrapper.removeEventListener("keydown", _this.onKeyboardNavigation, passive);
        wrapper.removeEventListener("touchstart", _this.onTouchPanningStart, passive);
        wrapper.removeEventListener("touchmove", _this.onTouchPanning, passive);
        wrapper.removeEventListener("touchend", _this.onTouchPanningStop, passive);
        wrapper.removeEventListener("scroll", _this.onWrapperScroll, passive);
      };
      this.handleInitializeWrapperEvents = function(wrapper) {
        var passive = makePassiveEventOption();
        wrapper.addEventListener("wheel", _this.onWheelZoom, passive);
        wrapper.addEventListener("dblclick", _this.onDoubleClick, passive);
        wrapper.addEventListener("keydown", _this.onKeyboardNavigation, passive);
        wrapper.addEventListener("touchstart", _this.onTouchPanningStart, passive);
        wrapper.addEventListener("touchmove", _this.onTouchPanning, passive);
        wrapper.addEventListener("touchend", _this.onTouchPanningStop, passive);
        wrapper.addEventListener("scroll", _this.onWrapperScroll, passive);
      };
      this.onWrapperScroll = function() {
        var wrapper = _this.wrapperComponent;
        if (!wrapper)
          return;
        var scrollLeft = wrapper.scrollLeft, scrollTop = wrapper.scrollTop;
        if (!scrollLeft && !scrollTop)
          return;
        wrapper.scrollLeft = 0;
        wrapper.scrollTop = 0;
        var _a = _this.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
        _this.setState(scale, positionX - scrollLeft, positionY - scrollTop);
      };
      this.handleInitialize = function() {
        var _a = _this.setup, centerOnInit = _a.centerOnInit, fitOnInit = _a.fitOnInit;
        _this.applyTransformation();
        _this.onInitCallbacks.forEach(function(callback) {
          return callback(getContext(_this));
        });
        if (centerOnInit || fitOnInit || hasNamedInitialPosition(_this)) {
          var applied = _this.applyInitialLayout();
          _this.isInitialLayoutPending = true;
          if (_this.initObserverTimer)
            clearTimeout(_this.initObserverTimer);
          if (applied) {
            _this.initObserverTimer = setTimeout(function() {
              _this.initObserverTimer = null;
              _this.isInitialLayoutPending = false;
            }, 5e3);
          }
        }
      };
      this.observeSizes = function(wrapperComponent, contentComponent) {
        var _a;
        (_a = _this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        _this.observer = void 0;
        _this.measuredSizes = measureSizes(wrapperComponent, contentComponent);
        if (typeof ResizeObserver === "undefined")
          return;
        _this.observer = new ResizeObserver(_this.onSizeChange);
        _this.observer.observe(wrapperComponent);
        _this.observer.observe(contentComponent);
      };
      this.onSizeChange = function() {
        var _a = _this, wrapperComponent = _a.wrapperComponent, contentComponent = _a.contentComponent;
        if (!_this.mounted || !wrapperComponent || !contentComponent)
          return;
        if (_this.isInitialLayoutPending) {
          var hasSize = (contentComponent.offsetWidth > 0 || contentComponent.offsetHeight > 0) && wrapperComponent.clientWidth > 0 && wrapperComponent.clientHeight > 0;
          if (!hasSize)
            return;
          _this.isInitialLayoutPending = false;
          if (_this.initObserverTimer)
            clearTimeout(_this.initObserverTimer);
          _this.initObserverTimer = null;
          _this.onInitCallbacks.forEach(function(callback) {
            return callback(getContext(_this));
          });
          _this.applyInitialLayout();
          _this.measuredSizes = measureSizes(wrapperComponent, contentComponent);
          handleCalculateBounds(_this, _this.state.scale);
          return;
        }
        handleSizeChange(_this);
      };
      this.flushResizeAlignment = function() {
        if (!_this.isResizeAlignmentPending)
          return;
        _this.isResizeAlignmentPending = false;
        handleResizeAlignment(_this);
      };
      this.onWheelZoom = function(event) {
        var disabled = _this.setup.disabled;
        if (disabled)
          return;
        _this.syncModifierKeys(event);
        var isAllowed = isWheelAllowed(_this, event);
        if (!isAllowed)
          return;
        handleWheelStart(_this, event);
        handleWheelZoom(_this, event);
        handleWheelStop(_this, event);
      };
      this.onWheelPanning = function(event) {
        var onPanning = _this.props.onPanning;
        var trackPadPanning = _this.setup.trackPadPanning;
        var lockAxisX = trackPadPanning.lockAxisX, lockAxisY = trackPadPanning.lockAxisY, speed = trackPadPanning.speed;
        var wrapper = _this.wrapperComponent;
        _this.syncModifierKeys(event);
        var isAllowed = isWheelPanningAllowed(_this, event);
        if (!isAllowed || !wrapper)
          return;
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
        var delta = getWheelPanDelta(event, wrapper, speed);
        var deltaX = lockAxisX ? 0 : delta.x;
        var deltaY = lockAxisY ? 0 : delta.y;
        if (!deltaX && !deltaY)
          return;
        var _a = _this.setup.autoAlignment, sizeX = _a.sizeX, sizeY = _a.sizeY;
        var paddingValueX = getPaddingValue(_this, sizeX);
        var paddingValueY = getPaddingValue(_this, sizeY);
        handleWheelPanningStart(_this, event);
        var source = getPanSourcePosition(_this);
        var newPositionX = source.x - deltaX;
        var newPositionY = source.y - deltaY;
        handleNewPosition(_this, newPositionX, newPositionY, paddingValueX, paddingValueY);
        handleCallback(getContext(_this), event, onPanning);
        handleWheelPanningStop(_this, event);
      };
      this.onPanningStart = function(event) {
        var _a = _this.setup, disabled = _a.disabled, panning = _a.panning;
        var onPanningStart = _this.props.onPanningStart;
        if (disabled || panning.disabled)
          return;
        _this.syncModifierKeys(event);
        var isAllowed = isPanningStartAllowed(_this, event);
        if (!isAllowed)
          return;
        var keysPressed = _this.isPressingKeys(_this.setup.panning.activationKeys);
        if (!keysPressed)
          return;
        if (event.button === 0 && !_this.setup.panning.allowLeftClickPan)
          return;
        if (event.button === 1 && !_this.setup.panning.allowMiddleClickPan)
          return;
        if (event.button === 2 && !_this.setup.panning.allowRightClickPan)
          return;
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
        handleCancelAnimation(_this);
        handlePanningStart(_this, event);
        _this.startPanGesture(event.clientX, event.clientY);
        _this.lockTextSelection();
        _this.focusForKeyboard();
        handleCallback(getContext(_this), event, onPanningStart);
      };
      this.onPanning = function(event) {
        var disabled = _this.setup.disabled;
        var onPanning = _this.props.onPanning;
        if (disabled)
          return;
        _this.syncModifierKeys(event);
        if (_this.isPanning && event.buttons === 0) {
          _this.clearPanning(event);
          return;
        }
        var isAllowed = isPanningAllowed(_this);
        if (!isAllowed)
          return;
        var keysPressed = _this.isPressingKeys(_this.setup.panning.activationKeys);
        if (!keysPressed)
          return;
        if (_this.trackPanGesture(event.clientX, event.clientY)) {
          _this.onPanningStop(event);
          return;
        }
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
        handlePanning(_this, event.clientX, event.clientY, DeviceType.MOUSE);
        handleCallback(getContext(_this), event, onPanning);
      };
      this.onPanningStop = function(event) {
        var _a;
        var _b = _this.setup.panning, velocityDisabled = _b.velocityDisabled, suppressClickAfterPan = _b.suppressClickAfterPan;
        var onPanningStop = _this.props.onPanningStop;
        if (_this.isPanning) {
          var isDrag = !!((_a = _this.panGesture) === null || _a === void 0 ? void 0 : _a.isDrag);
          _this.panGesture = null;
          _this.unlockTextSelection();
          handlePanningEnd(_this, velocityDisabled);
          handleCallback(getContext(_this), event, onPanningStop);
          _this.flushResizeAlignment();
          if (isDrag && suppressClickAfterPan && event.type === "mouseup") {
            _this.suppressNextClick();
          }
        }
      };
      this.startPanGesture = function(clientX, clientY) {
        _this.panGesture = {
          startX: clientX,
          startY: clientY,
          hasMoved: false,
          isDrag: false
        };
      };
      this.trackPanGesture = function(clientX, clientY) {
        var gesture = _this.panGesture;
        if (!gesture)
          return false;
        var dx = clientX - gesture.startX;
        var dy = clientY - gesture.startY;
        if (!dx && !dy)
          return false;
        var isFirstMove = !gesture.hasMoved;
        gesture.hasMoved = true;
        if (dx * dx + dy * dy > Math.pow(CLICK_DISTANCE, 2))
          gesture.isDrag = true;
        return isFirstMove && _this.setup.panning.releaseAtBounds && isPanBlockedAtBounds(_this, dx, dy);
      };
      this.suppressNextClick = function() {
        var _a;
        var wrapper = _this.wrapperComponent;
        var win = (_a = wrapper === null || wrapper === void 0 ? void 0 : wrapper.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
        if (!wrapper || !win)
          return;
        var swallow = function(event) {
          var path = typeof event.composedPath === "function" ? event.composedPath() : [];
          var isInside = path.includes(wrapper) || wrapper.contains(event.target);
          if (!isInside)
            return;
          event.preventDefault();
          event.stopPropagation();
        };
        win.addEventListener("click", swallow, { capture: true, once: true });
        win.setTimeout(function() {
          win.removeEventListener("click", swallow, { capture: true });
        }, 0);
      };
      this.onPinchStart = function(event) {
        var disabled = _this.setup.disabled;
        var onPinchStart = _this.props.onPinchStart;
        if (disabled)
          return;
        var isAllowed = isPinchStartAllowed(_this, event);
        if (!isAllowed)
          return;
        handlePinchStart(_this, event);
        handleCancelAnimation(_this);
        handleCallback(getContext(_this), event, onPinchStart);
      };
      this.onPinch = function(event) {
        var disabled = _this.setup.disabled;
        var onPinch = _this.props.onPinch;
        if (disabled)
          return;
        var isAllowed = isPinchAllowed(_this);
        if (!isAllowed)
          return;
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
        handlePinchZoom(_this, event);
        handleCallback(getContext(_this), event, onPinch);
      };
      this.onPinchStop = function(event) {
        var onPinchStop = _this.props.onPinchStop;
        if (_this.pinchStartScale) {
          handlePinchStop(_this);
          handleCallback(getContext(_this), event, onPinchStop);
          _this.flushResizeAlignment();
        }
      };
      this.onTouchPanningStart = function(event) {
        var _a = _this.setup, disabled = _a.disabled, doubleClick = _a.doubleClick;
        var onPanningStart = _this.props.onPanningStart;
        if (disabled)
          return;
        var isDoubleTapAllowed = !(doubleClick === null || doubleClick === void 0 ? void 0 : doubleClick.disabled);
        var isDoubleTap = _this.lastTouch && +/* @__PURE__ */ new Date() - _this.lastTouch < 200;
        if (isDoubleTapAllowed && isDoubleTap && event.touches.length === 1) {
          _this.lastTouch = null;
          _this.onDoubleClick(event);
        } else {
          _this.lastTouch = +/* @__PURE__ */ new Date();
          handleCancelAnimation(_this);
          var touches = event.touches;
          var isPanningAction = touches.length === 1;
          var isPinchAction = touches.length === 2;
          var isAllowed = isPanningStartAllowed(_this, event);
          if (isPanningAction) {
            if (!isAllowed || _this.setup.panning.disabled)
              return;
            handleCancelAnimation(_this);
            handlePanningStart(_this, event);
            _this.startPanGesture(touches[0].clientX, touches[0].clientY);
            _this.lockTextSelection();
            _this.focusForKeyboard();
            handleCallback(getContext(_this), event, onPanningStart);
          }
          if (isPinchAction) {
            _this.onPinchStart(event);
          }
        }
      };
      this.onTouchPanning = function(event) {
        var disabled = _this.setup.disabled;
        var onPanning = _this.props.onPanning;
        if (_this.isPanning && event.touches.length === 1) {
          if (disabled)
            return;
          var isAllowed = isPanningAllowed(_this);
          if (!isAllowed)
            return;
          var touch = event.touches[0];
          if (_this.trackPanGesture(touch.clientX, touch.clientY)) {
            _this.onPanningStop(event);
            return;
          }
          if (event.cancelable) {
            event.preventDefault();
          }
          event.stopPropagation();
          handlePanning(_this, touch.clientX, touch.clientY, DeviceType.TOUCH);
          handleCallback(getContext(_this), event, onPanning);
        } else if (event.touches.length > 1) {
          _this.onPinch(event);
        }
      };
      this.onTouchPanningStop = function(event) {
        _this.onPanningStop(event);
        _this.onPinchStop(event);
      };
      this.onDoubleClick = function(event) {
        var disabled = _this.setup.disabled;
        if (disabled)
          return;
        var isAllowed = isDoubleClickAllowed(_this, event);
        if (!isAllowed)
          return;
        handleDoubleClick(_this, event);
      };
      this.clearPanning = function(event) {
        if (_this.isPanning) {
          _this.onPanningStop(event);
        }
      };
      this.handleWindowBlur = function() {
        _this.pressedKeys = {};
        if (_this.isPanning) {
          _this.isPanning = false;
          _this.startCoords = null;
          _this.panGesture = null;
        }
        _this.unlockTextSelection();
        _this.flushResizeAlignment();
      };
      this.syncModifierKeys = function(event) {
        var ctrlKey = event.ctrlKey, metaKey = event.metaKey, shiftKey = event.shiftKey, altKey = event.altKey;
        if (typeof ctrlKey === "boolean")
          _this.pressedKeys.Control = ctrlKey;
        if (typeof metaKey === "boolean")
          _this.pressedKeys.Meta = metaKey;
        if (typeof shiftKey === "boolean")
          _this.pressedKeys.Shift = shiftKey;
        if (typeof altKey === "boolean")
          _this.pressedKeys.Alt = altKey;
      };
      this.setKeyPressed = function(e) {
        _this.pressedKeys[e.key] = true;
      };
      this.setKeyUnPressed = function(e) {
        _this.pressedKeys[e.key] = false;
      };
      this.isPressingKeys = function(keys) {
        if (typeof keys === "function") {
          return keys(Object.entries(_this.pressedKeys).filter(function(_a) {
            var pressed = _a[1];
            return pressed;
          }).map(function(_a) {
            var key = _a[0];
            return key;
          }));
        }
        if (!keys.length) {
          return true;
        }
        return Boolean(keys.every(function(key) {
          return _this.pressedKeys[key];
        }));
      };
      this.onKeyboardNavigation = function(event) {
        handleKeyboardNavigation(_this, event);
      };
      this.focusForKeyboard = function() {
        var _a;
        var wrapper = _this.wrapperComponent;
        if (!wrapper || _this.setup.keyboard.disabled)
          return;
        var active = (_a = wrapper.ownerDocument) === null || _a === void 0 ? void 0 : _a.activeElement;
        if (active && wrapper.contains(active))
          return;
        if (typeof wrapper.focus === "function") {
          wrapper.focus({ preventScroll: true });
        }
      };
      this.lockTextSelection = function() {
        var wrapper = _this.wrapperComponent;
        if (!wrapper || _this.selectionLock)
          return;
        _this.selectionLock = {
          userSelect: wrapper.style.userSelect,
          webkitUserSelect: wrapper.style.webkitUserSelect
        };
        wrapper.style.userSelect = "none";
        wrapper.style.webkitUserSelect = "none";
      };
      this.unlockTextSelection = function() {
        var lock = _this.selectionLock;
        _this.selectionLock = null;
        var wrapper = _this.wrapperComponent;
        if (!wrapper || !lock)
          return;
        wrapper.style.userSelect = lock.userSelect;
        wrapper.style.webkitUserSelect = lock.webkitUserSelect;
      };
      this.applyInitialLayout = function() {
        var _a = _this.setup, fitOnInit = _a.fitOnInit, centerOnInit = _a.centerOnInit;
        var _b = _this, wrapperComponent = _b.wrapperComponent, contentComponent = _b.contentComponent;
        if (!wrapperComponent || !contentComponent)
          return false;
        var hasSizes = wrapperComponent.clientWidth > 0 && wrapperComponent.clientHeight > 0 && (contentComponent.offsetWidth > 0 || contentComponent.offsetHeight > 0);
        var _c = _this.state, scale = _c.scale, positionX = _c.positionX, positionY = _c.positionY;
        var target = { scale, positionX, positionY };
        var fitted = fitOnInit ? calculateFitToView(_this, fitOnInit === "cover" ? "cover" : "contain") : null;
        if (fitted) {
          target = fitted;
        } else if (fitOnInit || centerOnInit) {
          target = getCenterPosition(scale, wrapperComponent, contentComponent);
        }
        var placed = applyNamedInitialPosition(_this, target);
        _this.setState(placed.scale, placed.positionX, placed.positionY);
        return hasSizes;
      };
      this.setCenter = function() {
        if (_this.wrapperComponent && _this.contentComponent) {
          var targetState = getCenterPosition(_this.state.scale, _this.wrapperComponent, _this.contentComponent);
          _this.setState(targetState.scale, targetState.positionX, targetState.positionY);
        }
      };
      this.handleTransformStyles = function(x, y, scale) {
        if (_this.props.customTransform) {
          return _this.props.customTransform(x, y, scale);
        }
        return getTransformStyles(x, y, scale);
      };
      this.getContext = function() {
        return getContext(_this);
      };
      this.applyTransformation = function() {
        if (!_this.mounted || !_this.contentComponent)
          return;
        var _a = _this.state, scale = _a.scale, positionX = _a.positionX, positionY = _a.positionY;
        var transform = _this.handleTransformStyles(positionX, positionY, scale);
        if (!_this.props.detached) {
          _this.contentComponent.style.transform = transform;
        }
        _this.onTransformCallbacks.forEach(function(callback) {
          return callback({
            scale,
            positionX,
            positionY,
            previousScale: _this.state.previousScale,
            ref: getContext(_this)
          });
        });
      };
      this.setState = function(scale, positionX, positionY) {
        var onTransform = _this.props.onTransform;
        if (!Number.isNaN(scale) && !Number.isNaN(positionX) && !Number.isNaN(positionY)) {
          var safeScale = Math.max(scale, 1e-7);
          if (safeScale !== _this.state.scale) {
            _this.state.previousScale = _this.state.scale;
            _this.state.scale = safeScale;
          }
          _this.state.positionX = positionX;
          _this.state.positionY = positionY;
          _this.applyTransformation();
          var ctx_1 = getContext(_this);
          _this.onChangeCallbacks.forEach(function(callback) {
            return callback(ctx_1);
          });
          handleCallback(ctx_1, { scale: _this.state.scale, positionX, positionY }, onTransform);
        } else {
          console.error("Detected NaN set state values");
        }
      };
      this.onTransform = function(callback) {
        if (!_this.onTransformCallbacks.has(callback)) {
          _this.onTransformCallbacks.add(callback);
        }
        return function() {
          _this.onTransformCallbacks.delete(callback);
        };
      };
      this.onChange = function(callback) {
        if (!_this.onChangeCallbacks.has(callback)) {
          _this.onChangeCallbacks.add(callback);
        }
        return function() {
          _this.onChangeCallbacks.delete(callback);
        };
      };
      this.onInit = function(callback) {
        if (!_this.onInitCallbacks.has(callback)) {
          _this.onInitCallbacks.add(callback);
        }
        return function() {
          _this.onInitCallbacks.delete(callback);
        };
      };
      this.init = function(wrapperComponent, contentComponent) {
        _this.mounted = true;
        _this.cleanupWindowEvents();
        _this.wrapperComponent = wrapperComponent;
        _this.contentComponent = contentComponent;
        handleCalculateBounds(_this, _this.state.scale);
        _this.handleInitializeWrapperEvents(wrapperComponent);
        _this.handleInitialize();
        _this.observeSizes(wrapperComponent, contentComponent);
        _this.initializeWindowEvents();
        _this.isInitialized = true;
        var ctx = getContext(_this);
        handleCallback(ctx, void 0, _this.props.onInit);
      };
      this.props = props;
      this.setup = createSetup(this.props);
      this.state = createState(this.props);
    }
    return ZoomPanPinch2;
  })()
);
var Context = import_react12.default.createContext(null);
var getContent = function(children, ctx) {
  if (typeof children === "function") {
    return children(ctx);
  }
  return children;
};
var TransformWrapper = import_react12.default.forwardRef(function(props, ref) {
  var instanceRef = (0, import_react12.useRef)(null);
  if (instanceRef.current === null) {
    instanceRef.current = new ZoomPanPinch(props);
  }
  var instance = instanceRef.current;
  var content = getContent(props.children, getControls(instance));
  (0, import_react12.useImperativeHandle)(ref, function() {
    return getControls(instance);
  }, [instance]);
  (0, import_react12.useEffect)(function() {
    instance.mount();
    return function() {
      instance.unmount();
    };
  }, [instance]);
  (0, import_react12.useEffect)(function() {
    instance.update(props);
  }, [instance, props]);
  return (0, import_jsx_runtime.jsx)(Context.Provider, __assign({ value: instance }, { children: content }));
});
var KeepScale = import_react12.default.forwardRef(function(props, ref) {
  var localRef = (0, import_react12.useRef)(null);
  var instance = (0, import_react12.useContext)(Context);
  useIsomorphicLayoutEffect2(function() {
    var applyInverseScale = function(scale) {
      if (localRef.current) {
        var positionX = 0;
        var positionY = 0;
        localRef.current.style.transform = instance.handleTransformStyles(positionX, positionY, 1 / scale);
      }
    };
    applyInverseScale(instance.state.scale);
    return instance.onChange(function(ctx) {
      applyInverseScale(ctx.instance.state.scale);
    });
  }, [instance]);
  return (0, import_jsx_runtime.jsx)("div", __assign({}, props, { ref: mergeRefs([localRef, ref]) }));
});
var transformComponent_module = { "wrapper": "transform-component-module_wrapper__SPB86", "content": "transform-component-module_content__FBWxo", "infiniteGrid": "transform-component-module_infiniteGrid__Z-aP3" };
var stylesheet$1 = ".transform-component-module_wrapper__SPB86 {\n  position: relative;\n  width: -moz-fit-content;\n  width: fit-content;\n  height: -moz-fit-content;\n  height: fit-content;\n  overflow: hidden;\n  -webkit-touch-callout: none; /* iOS Safari */\n  /* Text stays selectable (#467); the instance applies an inline lock\n     only while a pan gesture is active. */\n  margin: 0;\n  padding: 0;\n  transform: translate3d(0, 0, 0);\n}\n.transform-component-module_content__FBWxo {\n  display: flex;\n  flex-wrap: wrap;\n  width: -moz-fit-content;\n  width: fit-content;\n  height: -moz-fit-content;\n  height: fit-content;\n  margin: 0;\n  padding: 0;\n  transform-origin: 0% 0%;\n}\n.transform-component-module_content__FBWxo img {\n  pointer-events: none;\n}\n.transform-component-module_infiniteGrid__Z-aP3 {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  background-image: radial-gradient(\n    circle,\n    rgba(0, 0, 0, 0.12) 1px,\n    transparent 1px\n  );\n  background-size: 20px 20px;\n  background-position: 0 0;\n}\n";
var styles = transformComponent_module;
var stylesheet = stylesheet$1;
var TransformComponent = function(_a) {
  var _b;
  var children = _a.children, _c = _a.wrapperClass, wrapperClass = _c === void 0 ? "" : _c, _d = _a.contentClass, contentClass = _d === void 0 ? "" : _d, wrapperStyle = _a.wrapperStyle, contentStyle = _a.contentStyle, _e = _a.wrapperProps, wrapperProps = _e === void 0 ? {} : _e, _f = _a.contentProps, contentProps = _f === void 0 ? {} : _f, _g = _a.infinite, infinite = _g === void 0 ? false : _g, nonce = _a.nonce, _h = _a.disableStyleInjection, disableStyleInjection = _h === void 0 ? false : _h;
  var instance = (0, import_react12.useContext)(Context);
  var init = instance.init, cleanupWindowEvents = instance.cleanupWindowEvents;
  var wrapperRef = (0, import_react12.useRef)(null);
  var contentRef = (0, import_react12.useRef)(null);
  var gridRef = (0, import_react12.useRef)(null);
  useIsomorphicLayoutEffect2(function() {
    var wrapper = wrapperRef.current;
    var content = contentRef.current;
    if (wrapper !== null && !disableStyleInjection) {
      injectStylesheet(wrapper, stylesheet, nonce);
    }
    if (wrapper !== null && content !== null && init) {
      init === null || init === void 0 ? void 0 : init(wrapper, content);
    }
    return function() {
      cleanupWindowEvents === null || cleanupWindowEvents === void 0 ? void 0 : cleanupWindowEvents();
    };
  }, []);
  (0, import_react12.useEffect)(function() {
    if (!infinite)
      return;
    var grid = gridRef.current;
    if (!grid)
      return;
    var sync = function() {
      var _a2 = instance.state, positionX = _a2.positionX, positionY = _a2.positionY;
      grid.style.backgroundPosition = "".concat(positionX, "px ").concat(positionY, "px");
    };
    sync();
    return instance.onChange(sync);
  }, [infinite, instance]);
  var keyboardEnabled = !((_b = instance.setup.keyboard) === null || _b === void 0 ? void 0 : _b.disabled);
  return (0, import_jsx_runtime.jsxs)("div", __assign({
    // The wrapper is a keyboard-operated widget when navigation is on.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex: keyboardEnabled ? 0 : void 0
  }, wrapperProps, { ref: wrapperRef, className: "".concat(baseClasses.wrapperClass, " ").concat(styles.wrapper, " ").concat(wrapperClass), style: wrapperStyle }, { children: [infinite && (0, import_jsx_runtime.jsx)("div", { ref: gridRef, className: styles.infiniteGrid, "aria-hidden": true }), (0, import_jsx_runtime.jsx)("div", __assign({}, contentProps, { ref: contentRef, className: "".concat(baseClasses.contentClass, " ").concat(styles.content, " ").concat(contentClass), style: __assign(__assign({
    // Inline so the zoom anchor survives environments where the
    // stylesheet is not applied, e.g. a shadow root (#371, #444).
    transformOrigin: "0 0"
  }, contentStyle), { transform: getTransformStyles(instance.state.positionX, instance.state.positionY, instance.state.scale) }) }, { children }))] }));
};
function getOverlapArea(a, b) {
  var overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  var overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return overlapX * overlapY;
}
function isElementVisible(opts) {
  var elementX = opts.elementX, elementY = opts.elementY, elementWidth = opts.elementWidth, elementHeight = opts.elementHeight, scale = opts.scale, positionX = opts.positionX, positionY = opts.positionY, viewportWidth = opts.viewportWidth, viewportHeight = opts.viewportHeight, _a = opts.margin, margin = _a === void 0 ? 0 : _a, _b = opts.threshold, threshold = _b === void 0 ? 0 : _b;
  var viewport = {
    x: -margin,
    y: -margin,
    width: viewportWidth + 2 * margin,
    height: viewportHeight + 2 * margin
  };
  var element = {
    x: elementX * scale + positionX,
    y: elementY * scale + positionY,
    width: elementWidth * scale,
    height: elementHeight * scale
  };
  if (threshold <= 0) {
    var intersectsX = element.x < viewport.x + viewport.width && element.x + element.width > viewport.x;
    var intersectsY = element.y < viewport.y + viewport.height && element.y + element.height > viewport.y;
    return intersectsX && intersectsY;
  }
  var elementArea = element.width * element.height;
  if (elementArea <= 0)
    return false;
  var overlap = getOverlapArea(viewport, element);
  return overlap / elementArea >= threshold;
}
var Virtualize = import_react12.default.forwardRef(function(_a, ref) {
  var x = _a.x, y = _a.y, width = _a.width, height = _a.height, _b = _a.margin, margin = _b === void 0 ? 0 : _b, _c = _a.threshold, threshold = _c === void 0 ? 0 : _c, _d = _a.placeholder, placeholder = _d === void 0 ? null : _d, onShow = _a.onShow, onHide = _a.onHide, children = _a.children, className = _a.className, style = _a.style;
  var instance = (0, import_react12.useContext)(Context);
  var computeVisible = function() {
    var wrapper = instance.wrapperComponent;
    if (!wrapper)
      return false;
    return isElementVisible({
      elementX: x,
      elementY: y,
      elementWidth: width,
      elementHeight: height,
      scale: instance.state.scale,
      positionX: instance.state.positionX,
      positionY: instance.state.positionY,
      viewportWidth: wrapper.clientWidth,
      viewportHeight: wrapper.clientHeight,
      margin,
      threshold
    });
  };
  var _e = (0, import_react12.useState)(computeVisible), visible = _e[0], setVisible = _e[1];
  var visibleRef = (0, import_react12.useRef)(false);
  var onShowRef = (0, import_react12.useRef)(onShow);
  var onHideRef = (0, import_react12.useRef)(onHide);
  onShowRef.current = onShow;
  onHideRef.current = onHide;
  useIsomorphicLayoutEffect2(function() {
    var check = function() {
      var _a2, _b2;
      if (!instance.wrapperComponent)
        return;
      var nowVisible = computeVisible();
      if (nowVisible !== visibleRef.current) {
        visibleRef.current = nowVisible;
        setVisible(nowVisible);
        if (nowVisible) {
          (_a2 = onShowRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onShowRef);
        } else {
          (_b2 = onHideRef.current) === null || _b2 === void 0 ? void 0 : _b2.call(onHideRef);
        }
      }
    };
    check();
    var unsubChange = instance.onChange(check);
    var unsubInit;
    if (!instance.wrapperComponent) {
      unsubInit = instance.onInit(function() {
        return check();
      });
    }
    return function() {
      unsubChange();
      unsubInit === null || unsubInit === void 0 ? void 0 : unsubInit();
    };
  }, [instance, x, y, width, height, margin, threshold]);
  if (!visible) {
    return placeholder ? (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: placeholder }) : null;
  }
  return (0, import_jsx_runtime.jsx)("div", __assign({ ref, className, style }, { children }));
});

// src/ImageViewer.jsx
var chrome = {
  color: "rgba(255,255,255,0.92)",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: 6,
  padding: "3px 10px",
  fontSize: 12,
  cursor: "pointer"
};
var chromeIcon = {
  ...chrome,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  padding: 0
};
function ImageViewer({ recordId, onClose, onNavigate, prevId, nextId }) {
  const [scale, setScale] = (0, import_react13.useState)(1);
  const zoomRef = (0, import_react13.useRef)(null);
  const zoomBy = (method) => {
    const api = zoomRef.current;
    if (api !== null && api !== void 0 && typeof api[method] === "function") api[method](0.2);
  };
  const fit = () => {
    const api = zoomRef.current;
    if (api !== null && api !== void 0 && typeof api.resetTransform === "function") api.resetTransform();
  };
  (0, import_react13.useEffect)(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && prevId !== null && prevId !== void 0) onNavigate?.(prevId);
      if (event.key === "ArrowRight" && nextId !== null && nextId !== void 0) onNavigate?.(nextId);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, prevId, nextId]);
  const onTransformed = (0, import_react13.useCallback)((ref) => {
    const next = ref?.state?.scale;
    if (typeof next === "number") setScale(next);
  }, []);
  const node = /* @__PURE__ */ import_react13.default.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": t("viewer.imageAlt"),
      onMouseDown: (event) => event.stopPropagation(),
      onClick: (event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onClose();
      },
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 2147483e3,
        background: "rgba(0,0,0,0.62)",
        display: "grid",
        placeItems: "center",
        padding: "4vh 4vw",
        isolation: "isolate"
      }
    },
    /* @__PURE__ */ import_react13.default.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "min(92vw, 1280px)",
          height: "min(86vh, 900px)",
          background: "#0b0d0c",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 12,
          boxShadow: "0 24px 72px rgba(0,0,0,0.55)",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ import_react13.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#0b0d0c" } }, /* @__PURE__ */ import_react13.default.createElement("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.65)" } }, recordId), /* @__PURE__ */ import_react13.default.createElement("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.65)" } }, Math.round(scale * 100), "%"), /* @__PURE__ */ import_react13.default.createElement("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t("viewer.hint")), /* @__PURE__ */ import_react13.default.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ import_react13.default.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } }, /* @__PURE__ */ import_react13.default.createElement(
        "button",
        {
          type: "button",
          style: { ...chromeIcon, opacity: prevId === null || prevId === void 0 ? 0.4 : 1 },
          title: t("viewer.prevTitle"),
          "aria-label": t("viewer.prev"),
          disabled: prevId === null || prevId === void 0,
          onClick: () => onNavigate?.(prevId)
        },
        /* @__PURE__ */ import_react13.default.createElement(Icon, { name: "keyboard_arrow_left", size: 18 })
      ), /* @__PURE__ */ import_react13.default.createElement(
        "button",
        {
          type: "button",
          style: { ...chromeIcon, opacity: nextId === null || nextId === void 0 ? 0.4 : 1 },
          title: t("viewer.nextTitle"),
          "aria-label": t("viewer.next"),
          disabled: nextId === null || nextId === void 0,
          onClick: () => onNavigate?.(nextId)
        },
        /* @__PURE__ */ import_react13.default.createElement(Icon, { name: "keyboard_arrow_right", size: 18 })
      )), /* @__PURE__ */ import_react13.default.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } }, /* @__PURE__ */ import_react13.default.createElement("button", { type: "button", style: chromeIcon, title: t("viewer.zoomOut"), "aria-label": t("viewer.zoomOut"), onClick: () => zoomBy("zoomOut") }, /* @__PURE__ */ import_react13.default.createElement(Icon, { name: "zoom_out", size: 18 })), /* @__PURE__ */ import_react13.default.createElement("button", { type: "button", style: chromeIcon, title: t("viewer.zoomIn"), "aria-label": t("viewer.zoomIn"), onClick: () => zoomBy("zoomIn") }, /* @__PURE__ */ import_react13.default.createElement(Icon, { name: "zoom_in", size: 18 })), /* @__PURE__ */ import_react13.default.createElement("button", { type: "button", style: chromeIcon, title: t("viewer.fit"), "aria-label": t("viewer.fit"), onClick: fit }, /* @__PURE__ */ import_react13.default.createElement(Icon, { name: "fit_screen", size: 18 })), /* @__PURE__ */ import_react13.default.createElement("button", { type: "button", style: chromeIcon, title: t("action.close"), "aria-label": t("action.close"), onClick: onClose }, /* @__PURE__ */ import_react13.default.createElement(Icon, { name: "close", size: 18 })))),
      /* @__PURE__ */ import_react13.default.createElement(
        TransformWrapper,
        {
          minScale: 0.5,
          maxScale: 8,
          initialScale: 1,
          fitOnInit: true,
          centerOnInit: true,
          limitToBounds: false,
          wheel: { step: 8e-4 },
          zoomAnimation: { size: 0.2 },
          doubleClick: { mode: "toggle", step: 0.7 },
          panning: { velocityDisabled: true },
          onTransformed,
          ref: zoomRef
        },
        () => /* @__PURE__ */ import_react13.default.createElement("div", { style: { flex: 1, minHeight: 0, overflow: "hidden" } }, /* @__PURE__ */ import_react13.default.createElement(
          TransformComponent,
          {
            wrapperStyle: { width: "100%", height: "100%" },
            contentStyle: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }
          },
          /* @__PURE__ */ import_react13.default.createElement(
            "img",
            {
              src: imageUrl(recordId),
              alt: t("viewer.zoomAlt"),
              draggable: false,
              style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain", userSelect: "none" }
            }
          )
        ))
      )
    )
  );
  if (typeof document === "undefined") return node;
  return (0, import_react_dom2.createPortal)(node, document.body);
}

// src/App.jsx
var POLL_MS = 1500;
var PHASE_KEY = { probe: "phase.probe", submit: "phase.submit", wait: "phase.wait", download: "phase.download" };
var SAVE_DELAY_MS = 500;
var panel = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
  // Nothing may paint past the panel: on a short viewport the columns inside
  // have to fit, not spill into the host's scroller. Fixed-position dialogs are
  // unaffected by this.
  overflow: "hidden",
  fontSize: 12,
  color: "inherit"
};
var row3 = { display: "flex", alignItems: "center", gap: 6 };
var dim4 = { color: "var(--dsw-alias-label-secondary, inherit)" };
var label = { fontSize: 11, opacity: 0.68, minWidth: 44 };
var input3 = {
  flex: 1,
  minWidth: 0,
  boxSizing: "border-box",
  padding: "4px 6px",
  fontSize: 12,
  color: "inherit",
  background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))",
  border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
  borderRadius: 6,
  fontFamily: "inherit"
};
var button5 = {
  padding: "4px 10px",
  fontSize: 12,
  color: "inherit",
  background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))",
  border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
  borderRadius: 6,
  cursor: "pointer"
};
var primary2 = {
  ...button5,
  background: "var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))",
  borderColor: "var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))",
  color: "var(--dsw-alias-label-primary-inverted, #0d120f)",
  fontWeight: 600
};
var iconButton2 = { ...button5, padding: "2px 8px", fontSize: 11 };
var iconOnly3 = {
  ...button5,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  padding: 0
};
var iconDanger3 = { ...iconOnly3, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" };
var rowAction = {
  ...iconOnly3,
  width: 22,
  height: 22,
  background: "var(--dsw-alias-bg-layer-2, rgba(40,42,40,0.96))",
  boxShadow: "0 1px 4px rgba(0,0,0,0.35)"
};
function HistoryRow({ record, active, onSelect, onDelete, onPin, onArchive }) {
  const [hovered, setHovered] = (0, import_react14.useState)(false);
  const [focused, setFocused] = (0, import_react14.useState)(false);
  const revealed = hovered || focused;
  return /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      role: "group",
      tabIndex: 0,
      "aria-label": record.prompt === "" ? t("history.untitled") : record.prompt,
      onClick: () => onSelect(record.id),
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(record.id);
        }
      },
      style: {
        position: "relative",
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "left",
        padding: 5,
        borderRadius: 6,
        cursor: "pointer",
        color: "inherit",
        background: active ? selectionFill(16) : "transparent",
        border: `1px solid ${active ? "var(--dsw-alias-brand-primary, rgba(120,190,145,0.9))" : "var(--dsw-alias-border-l1, rgba(127,127,127,0.18))"}`,
        opacity: record.archived ? 0.55 : 1
      }
    },
    /* @__PURE__ */ import_react14.default.createElement(
      "span",
      {
        style: {
          width: 38,
          height: 38,
          flexShrink: 0,
          borderRadius: 4,
          overflow: "hidden",
          background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))",
          display: "grid",
          placeItems: "center",
          fontSize: 9,
          ...record.hasImage ? {} : dim4
        }
      },
      record.hasImage ? /* @__PURE__ */ import_react14.default.createElement("img", { src: imageUrl(record.id), alt: "", loading: "lazy", style: { width: "100%", height: "100%", objectFit: "cover" } }) : record.status
    ),
    /* @__PURE__ */ import_react14.default.createElement("span", { style: { minWidth: 0, flex: 1 } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: { display: "block", fontSize: 11, lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, record.prompt === "" ? t("history.noPrompt") : record.prompt), /* @__PURE__ */ import_react14.default.createElement("span", { style: { display: "block", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ...dim4 } }, timeOf(record.createdAt), " \xB7 ", record.size, " \xB7 ", t("history.boxCount", { count: record.boxCount })), /* @__PURE__ */ import_react14.default.createElement("span", { style: { display: "block", fontSize: 10, ...dim4 } }, record.status === "done" ? `${record.seconds}s` : record.status)),
    /* @__PURE__ */ import_react14.default.createElement(
      "div",
      {
        style: {
          position: "absolute",
          right: 4,
          top: 4,
          display: "flex",
          gap: 2,
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? "auto" : "none",
          transition: "opacity 120ms ease"
        }
      },
      /* @__PURE__ */ import_react14.default.createElement(
        "button",
        {
          type: "button",
          style: { ...rowAction, color: record.pinned ? "var(--dsw-alias-brand-primary, rgba(120,190,145,0.95))" : "inherit" },
          title: record.pinned ? t("action.unpin") : t("action.pin"),
          "aria-label": record.pinned ? t("action.unpin") : t("action.pin"),
          onClick: (event) => {
            event.stopPropagation();
            onPin?.(record);
          }
        },
        /* @__PURE__ */ import_react14.default.createElement(Icon, { name: record.pinned ? "keep_off" : "push_pin", size: 14 })
      ),
      /* @__PURE__ */ import_react14.default.createElement(
        "button",
        {
          type: "button",
          style: { ...rowAction, color: record.archived ? "var(--dsw-alias-brand-primary, rgba(120,190,145,0.95))" : "inherit" },
          title: record.archived ? t("action.unarchive") : t("action.archive"),
          "aria-label": record.archived ? t("action.unarchive") : t("action.archive"),
          onClick: (event) => {
            event.stopPropagation();
            onArchive?.(record);
          }
        },
        /* @__PURE__ */ import_react14.default.createElement(Icon, { name: record.archived ? "unarchive" : "archive", size: 14 })
      ),
      /* @__PURE__ */ import_react14.default.createElement(
        "button",
        {
          type: "button",
          disabled: record.status === "running",
          style: { ...rowAction, color: "var(--dsw-alias-state-error-primary, #ff8f7a)", opacity: record.status === "running" ? 0.45 : 1 },
          title: record.status === "running" ? t("history.deleteWhileRunning") : t("action.deleteRecordTitle"),
          "aria-label": t("action.deleteRecord"),
          onClick: (event) => {
            event.stopPropagation();
            onDelete(record.id);
          }
        },
        /* @__PURE__ */ import_react14.default.createElement(Icon, { name: "delete", size: 14 })
      )
    )
  );
}
var optionStyle2 = { background: "var(--dsw-alias-bg-overlay, #26282a)", color: "var(--dsw-alias-label-primary, inherit)" };
function timeOf(value) {
  if (typeof value !== "number" || value === 0) return "\u2014";
  const tag = currentLocale();
  return new Date(value).toLocaleTimeString(tag.startsWith("zh") ? "zh-CN" : tag, { hour: "2-digit", minute: "2-digit" });
}
function toCharacterSet(value) {
  return new Set((String(value ?? "").match(/\d+/g) ?? []).map(Number));
}
function StudioPanel({ sessionId = "global", wide = false }) {
  useLocaleRevision();
  const [params, setParams] = (0, import_react14.useState)(null);
  const [records, setRecords] = (0, import_react14.useState)([]);
  const [activeRecordId, setActiveRecordId] = (0, import_react14.useState)(null);
  const [activeRecord, setActiveRecord] = (0, import_react14.useState)(null);
  const [notice, setNotice] = (0, import_react14.useState)("");
  const [error, setError] = (0, import_react14.useState)("");
  const [saving, setSaving] = (0, import_react14.useState)(false);
  const [busy, setBusy] = (0, import_react14.useState)(false);
  const [generationRecordId, setGenerationRecordId] = (0, import_react14.useState)(null);
  const [elapsed, setElapsed] = (0, import_react14.useState)(0);
  const [phase, setPhase] = (0, import_react14.useState)("");
  const [progress, setProgress] = (0, import_react14.useState)(null);
  const [flagLocalOnly, setLocalOnly] = (0, import_react14.useState)(false);
  const [query, setQuery] = (0, import_react14.useState)("");
  const [showArchived, setShowArchived] = (0, import_react14.useState)(false);
  const [comfy, setComfy] = (0, import_react14.useState)(null);
  const [settingsOpen, setSettingsOpen] = (0, import_react14.useState)(false);
  const [pendingDelete, setPendingDelete] = (0, import_react14.useState)(null);
  const [queue, setQueue] = (0, import_react14.useState)({ busy: false, sessionId: null });
  const [pinnedRecords, setPinnedRecords] = (0, import_react14.useState)([]);
  const [pinnedTruncated, setPinnedTruncated] = (0, import_react14.useState)(false);
  const [matches, setMatches] = (0, import_react14.useState)(null);
  const [older, setOlder] = (0, import_react14.useState)([]);
  const [nextBefore, setNextBefore] = (0, import_react14.useState)(void 0);
  const [loadingMore, setLoadingMore] = (0, import_react14.useState)(false);
  const historyRef = (0, import_react14.useRef)(null);
  const [showCanvas, setShowCanvas] = (0, import_react14.useState)(true);
  const [zoom, setZoom] = (0, import_react14.useState)(false);
  const openViewer = (0, import_react14.useCallback)(() => setZoom(true), []);
  const [editorOpen, setEditorOpen] = (0, import_react14.useState)(false);
  const initialUiRef = (0, import_react14.useRef)(null);
  if (initialUiRef.current === null) initialUiRef.current = loadUiPrefs();
  const initialUi = initialUiRef.current;
  const [resultHeight, setResultHeight] = (0, import_react14.useState)(initialUi.resultHeight);
  const [resultCollapsed, setResultCollapsed] = (0, import_react14.useState)(initialUi.resultCollapsed);
  const [historyWidth, setHistoryWidth] = (0, import_react14.useState)(wide ? initialUi.historyWidth.wide : initialUi.historyWidth.narrow);
  const [historyResizing, setHistoryResizing] = (0, import_react14.useState)(false);
  const [historyOpen, setHistoryOpen] = (0, import_react14.useState)(wide ? initialUi.historyOpen.wide : initialUi.historyOpen.narrow);
  const [promptHeight, setPromptHeight] = (0, import_react14.useState)(initialUi.promptHeight);
  const promptRef = (0, import_react14.useRef)(null);
  const historyResizeRef = (0, import_react14.useRef)(null);
  const [resizing, setResizing] = (0, import_react14.useState)(false);
  const resizeRef = (0, import_react14.useRef)(null);
  const revisionRef = (0, import_react14.useRef)(0);
  const [revision, setRevision] = (0, import_react14.useState)(0);
  const dirtyRef = (0, import_react14.useRef)(false);
  const saveTimer = (0, import_react14.useRef)(null);
  const pendingPatchRef = (0, import_react14.useRef)({});
  const savingRef = (0, import_react14.useRef)(false);
  const savePromiseRef = (0, import_react14.useRef)(null);
  const conflictRef = (0, import_react14.useRef)(false);
  const [conflict, setConflict] = (0, import_react14.useState)(false);
  const conflictParamsRef = (0, import_react14.useRef)(null);
  const latestServerRef = (0, import_react14.useRef)(null);
  const localEpochRef = (0, import_react14.useRef)(0);
  const paramsRef = (0, import_react14.useRef)(null);
  const editorSnapshot = (0, import_react14.useRef)(null);
  const pinnedRef = (0, import_react14.useRef)(false);
  const [imageBroken, setImageBroken] = (0, import_react14.useState)(false);
  paramsRef.current = params;
  const applyServerState = (0, import_react14.useCallback)((state) => {
    if (!dirtyRef.current) {
      revisionRef.current = state.revision;
      paramsRef.current = state.params;
      setParams(state.params);
    }
    setRevision(state.revision);
    latestServerRef.current = { revision: state.revision, params: state.params };
    setProgress(state.generation?.sessionId === sessionId ? state.generation.progress ?? null : null);
    setQueue({
      busy: state.generation !== null && state.generation !== void 0,
      sessionId: state.generation?.sessionId ?? null,
      recordId: state.generation?.recordId ?? null
    });
    setRecords(state.records);
    setPinnedRecords(state.pinned ?? []);
    setPinnedTruncated(state.pinnedTruncated === true);
    setNextBefore((current) => current === null ? null : state.nextBefore ?? null);
    if (!pinnedRef.current) {
      const newest = state.records[0];
      const latestDone = state.records.find((record) => record.hasImage);
      const target = newest?.status === "running" ? newest.id : latestDone?.id ?? null;
      setActiveRecordId((current) => current === target ? current : target);
    }
  }, [sessionId]);
  const refresh = (0, import_react14.useCallback)(async () => {
    try {
      const state = await fetchState(sessionId, 40, showArchived);
      applyServerState(state);
      setError("");
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    }
  }, [sessionId, applyServerState, showArchived]);
  (0, import_react14.useEffect)(() => {
    void refresh();
  }, [refresh]);
  const checkHealth = (0, import_react14.useCallback)(async () => {
    try {
      const health = await fetchHealth();
      setComfy(health.comfy ?? { ok: false });
      setQueue({ busy: health.busy === true, sessionId: health.busySession ?? null, recordId: health.busyRecordId ?? null });
      setProgress(health.busy === true && health.busySession === sessionId ? health.progress ?? null : null);
    } catch {
      setComfy({ ok: false });
    }
  }, [sessionId]);
  (0, import_react14.useEffect)(() => {
    void checkHealth();
    const timer = setInterval(() => {
      void checkHealth();
    }, 5e3);
    return () => clearInterval(timer);
  }, [checkHealth]);
  const [pushed, setPushed] = (0, import_react14.useState)(() => typeof EventSource === "function");
  (0, import_react14.useEffect)(() => {
    if (!pushed) {
      const timer = setInterval(() => {
        void refresh();
      }, POLL_MS);
      return () => clearInterval(timer);
    }
    let source;
    let pending;
    let retry;
    let disposed = false;
    let failures = 0;
    const open = () => {
      if (disposed) return;
      try {
        source = new EventSource(`/plugins/dsh-moss-studio/events?sessionId=${encodeURIComponent(sessionId)}`);
      } catch {
        setPushed(false);
        return;
      }
      source.onopen = () => {
        failures = 0;
      };
      source.onmessage = (event) => {
        let payload = null;
        try {
          payload = JSON.parse(event.data);
        } catch {
        }
        if (payload?.kind === "progress" && typeof payload.phase === "string") {
          if (payload.sessionId === void 0 || payload.sessionId === sessionId) {
            setPhase(payload.phase);
            setProgress(payload);
            setQueue({ busy: true, sessionId: payload.sessionId ?? sessionId, recordId: payload.recordId ?? null });
          }
        }
        if (payload?.kind === "error" && typeof payload.message === "string") {
          if (payload.sessionId === void 0 || payload.sessionId === sessionId) setError(payload.message);
        }
        if (pending !== void 0) return;
        pending = setTimeout(() => {
          pending = void 0;
          void refresh();
        }, 120);
      };
      source.onerror = () => {
        source?.close();
        if (disposed) return;
        failures += 1;
        if (failures >= 4) {
          setPushed(false);
          return;
        }
        retry = setTimeout(open, Math.min(15e3, 1e3 * 2 ** (failures - 1)));
      };
    };
    open();
    return () => {
      disposed = true;
      if (pending !== void 0) clearTimeout(pending);
      if (retry !== void 0) clearTimeout(retry);
      source?.close();
    };
  }, [pushed, sessionId, refresh]);
  (0, import_react14.useEffect)(() => {
    const externalBusy = queue.busy && queue.sessionId === sessionId;
    if (!busy && !externalBusy) {
      setElapsed(0);
      setPhase("");
      return void 0;
    }
    const started = Date.now();
    const timer = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1e3)), 500);
    return () => clearInterval(timer);
  }, [busy, queue.busy, queue.sessionId, sessionId]);
  (0, import_react14.useEffect)(() => {
    saveUiPrefs({
      resultHeight,
      resultCollapsed,
      historyOpen: wide ? { ...loadUiPrefs().historyOpen, wide: historyOpen } : { ...loadUiPrefs().historyOpen, narrow: historyOpen },
      promptHeight,
      historyWidth: wide ? { ...loadUiPrefs().historyWidth, wide: historyWidth } : { ...loadUiPrefs().historyWidth, narrow: historyWidth }
    });
  }, [resultHeight, resultCollapsed, historyWidth, historyOpen, promptHeight, wide]);
  (0, import_react14.useEffect)(() => {
    const element = promptRef.current;
    if (element === null || typeof ResizeObserver === "undefined") return void 0;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? entry.target.offsetHeight);
        if (height >= 72) setPromptHeight(height);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  (0, import_react14.useEffect)(() => {
    if (!historyResizing) return void 0;
    function onMove(event) {
      const drag = historyResizeRef.current;
      if (drag === null) return;
      setHistoryWidth(Math.min(420, Math.max(160, drag.width + (event.clientX - drag.x))));
    }
    function onUp() {
      historyResizeRef.current = null;
      setHistoryResizing(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [historyResizing]);
  (0, import_react14.useEffect)(() => {
    if (!resizing) return void 0;
    function onMove(event) {
      const drag = resizeRef.current;
      if (drag === null) return;
      const next = Math.min(720, Math.max(120, drag.height - (event.clientY - drag.y)));
      setResultHeight(next);
    }
    function onUp() {
      resizeRef.current = null;
      setResizing(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [resizing]);
  const flush = (0, import_react14.useCallback)(async () => {
    if (saveTimer.current !== null) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (conflictRef.current) return false;
    if (savingRef.current) {
      const saved = await savePromiseRef.current;
      if (!saved || conflictRef.current) return false;
      return flush();
    }
    const patch = pendingPatchRef.current;
    pendingPatchRef.current = {};
    if (Object.keys(patch).length === 0) return true;
    const epoch = localEpochRef.current;
    savingRef.current = true;
    setSaving(true);
    const task = (async () => {
      try {
        const { status, body } = await putDraft(sessionId, patch, revisionRef.current);
        if (status === 409 && body !== null) {
          revisionRef.current = body.revision;
          setRevision(body.revision);
          pendingPatchRef.current = { ...patch, ...pendingPatchRef.current };
          conflictParamsRef.current = body.params ?? null;
          latestServerRef.current = { revision: body.revision, params: body.params };
          dirtyRef.current = true;
          conflictRef.current = true;
          setConflict(true);
          setNotice(t("notice.draftChanged"));
          return false;
        }
        if (status === 200 && body !== null) {
          revisionRef.current = body.revision;
          setRevision(body.revision);
          conflictRef.current = false;
          conflictParamsRef.current = null;
          setConflict(false);
          if (epoch === localEpochRef.current && Object.keys(pendingPatchRef.current).length === 0) {
            dirtyRef.current = false;
            setError("");
          }
          return true;
        }
        pendingPatchRef.current = { ...patch, ...pendingPatchRef.current };
        dirtyRef.current = true;
        setError(body?.message ?? t("error.save", { status }));
        return false;
      } catch (problem) {
        pendingPatchRef.current = { ...patch, ...pendingPatchRef.current };
        dirtyRef.current = true;
        setError(problem instanceof Error ? problem.message : String(problem));
        return false;
      }
    })();
    savePromiseRef.current = task;
    try {
      return await task;
    } finally {
      savingRef.current = false;
      savePromiseRef.current = null;
      setSaving(false);
    }
  }, [sessionId]);
  const flushAll = (0, import_react14.useCallback)(async () => {
    let saved = await flush();
    while (saved && Object.keys(pendingPatchRef.current).length > 0) saved = await flush();
    return saved;
  }, [flush]);
  const adoptServerDraft = (0, import_react14.useCallback)(() => {
    const server = latestServerRef.current?.params ?? conflictParamsRef.current;
    if (server === null || server === void 0) return;
    if (saveTimer.current !== null) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    pendingPatchRef.current = {};
    localEpochRef.current += 1;
    dirtyRef.current = false;
    conflictRef.current = false;
    conflictParamsRef.current = null;
    revisionRef.current = latestServerRef.current?.revision ?? revisionRef.current;
    setRevision(revisionRef.current);
    paramsRef.current = server;
    setParams(server);
    setConflict(false);
    setError("");
    setNotice(t("notice.serverDraftAdopted"));
  }, []);
  const overwriteServerDraft = (0, import_react14.useCallback)(async () => {
    if (!conflictRef.current) return;
    conflictRef.current = false;
    conflictParamsRef.current = null;
    revisionRef.current = latestServerRef.current?.revision ?? revisionRef.current;
    setRevision(revisionRef.current);
    setConflict(false);
    setError("");
    setNotice(t("notice.overwritingDraft"));
    const saved = await flushAll();
    if (saved) setNotice(t("notice.localDraftSaved"));
  }, [flushAll]);
  const update = (0, import_react14.useCallback)((patch) => {
    const next = { ...paramsRef.current ?? {}, ...patch };
    paramsRef.current = next;
    setParams(next);
    pendingPatchRef.current = { ...pendingPatchRef.current, ...patch };
    localEpochRef.current += 1;
    dirtyRef.current = true;
    if (!conflictRef.current && saveTimer.current !== null) clearTimeout(saveTimer.current);
    if (!conflictRef.current) saveTimer.current = setTimeout(() => {
      void flush();
    }, SAVE_DELAY_MS);
  }, [flush]);
  const replaceDraft = (0, import_react14.useCallback)((next, message) => {
    paramsRef.current = next;
    setParams(next);
    pendingPatchRef.current = { ...next };
    localEpochRef.current += 1;
    dirtyRef.current = true;
    conflictRef.current = false;
    conflictParamsRef.current = null;
    setConflict(false);
    if (saveTimer.current !== null) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void flush();
    }, SAVE_DELAY_MS);
    if (message !== void 0) setNotice(message);
  }, [flush]);
  const [widthText, setWidthText] = (0, import_react14.useState)("1024");
  const [heightText, setHeightText] = (0, import_react14.useState)("1024");
  const [sizeHint, setSizeHint] = (0, import_react14.useState)(null);
  (0, import_react14.useEffect)(() => {
    const parts = String(params?.size ?? "").split("x");
    if (parts.length !== 2) return;
    setWidthText(parts[0]);
    setHeightText(parts[1]);
    setSizeHint(null);
  }, [params?.size]);
  const commitSize = (0, import_react14.useCallback)((widthSource, heightSource) => {
    const width = Number(widthSource);
    const height = Number(heightSource);
    const problem = sizeProblem(width, height, widthSource, heightSource);
    if (problem !== null) {
      setSizeHint(problem);
      return;
    }
    setSizeHint(null);
    const next = formatSize(width, height);
    if (next !== paramsRef.current?.size) update({ size: next });
  }, [update]);
  const addBox = (0, import_react14.useCallback)((geometry) => {
    const current = paramsRef.current ?? {};
    const boxes2 = [...current.boxes ?? []];
    boxes2.push(geometry === void 0 ? defaultBox() : { ...defaultBox(), ...geometry });
    update({ boxes: boxes2 });
    setShowCanvas(true);
    return { index: boxes2.length - 1, boxes: boxes2, characters: current.characterBoxes ?? "" };
  }, [update]);
  const applyBoxes = (0, import_react14.useCallback)((nextBoxes, characters) => {
    const patch = { boxes: nextBoxes };
    if (characters !== void 0) patch.characterBoxes = characters;
    update(patch);
  }, [update]);
  const newDraft = (0, import_react14.useCallback)(() => {
    update({ prompt: "", boxes: [], seed: -1, characterBoxes: "", enhance: false });
    setNotice(t("notice.newDraft"));
  }, [update]);
  const openEditor = (0, import_react14.useCallback)(() => {
    editorSnapshot.current = structuredClone(paramsRef.current ?? {});
    setZoom(false);
    setEditorOpen(true);
  }, []);
  const closeEditor = (0, import_react14.useCallback)(() => setEditorOpen(false), []);
  const cancelEditor = (0, import_react14.useCallback)(() => {
    const snapshot = editorSnapshot.current;
    setEditorOpen(false);
    if (snapshot === null) return;
    replaceDraft(snapshot, t("notice.layoutReverted"));
  }, [replaceDraft]);
  const waitForCompletion = (0, import_react14.useCallback)(async (recordId) => {
    const started = Date.now();
    while (Date.now() - started < 6e5) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const state = await fetchState(sessionId);
      applyServerState(state);
      const record = typeof recordId === "string" ? state.records.find((entry) => entry.id === recordId) : state.records.find((entry) => entry.sessionId === sessionId && entry.status === "running") ?? state.records.find((entry) => entry.sessionId === sessionId);
      if (record !== void 0 && record.status !== "running") {
        if (record.status === "failed") {
          if (record.error?.message === "\u5DF2\u53D6\u6D88") {
            setError("");
            setNotice(t("notice.generationCancelled"));
          } else {
            setError(record.error?.message ?? t("error.generation"));
            setNotice("");
          }
        } else {
          pinnedRef.current = false;
          setImageBroken(false);
          setActiveRecordId(record.id);
          setNotice(t("notice.generationDone", { width: record.width, height: record.height, seconds: record.seconds }));
        }
        return;
      }
    }
    setNotice(t("notice.generationTimeout"));
  }, [sessionId, applyServerState]);
  const runGenerate = (0, import_react14.useCallback)(async () => {
    if (busy) return;
    const problem = boxesProblem(paramsRef.current?.boxes);
    if (problem !== void 0) {
      setError(problem.reason === "count" ? t("error.tooManyBoxes", { max: MAX_BOXES }) : t(problem.reason === "text" ? "error.emptyText" : "error.emptyDesc", { index: problem.index + 1 }));
      setNotice("");
      return;
    }
    setBusy(true);
    setProgress({ phase: "submit", elapsed: 0 });
    setError("");
    setNotice(t("notice.generationSubmitted"));
    try {
      const saved = await flushAll();
      if (!saved) return;
      const { status, body } = await generate(sessionId, revisionRef.current);
      if (status === 409 && body !== null) {
        revisionRef.current = body.revision;
        setRevision(body.revision);
        setParams(body.params);
        dirtyRef.current = false;
        setNotice(t("notice.draftChanged"));
        return;
      }
      if (status === 429) {
        setNotice(t("notice.generationBusy"));
        return;
      }
      if (status !== 202) {
        setError(body?.message ?? t("error.generateRequest", { status }));
        return;
      }
      setGenerationRecordId(body.recordId ?? null);
      await waitForCompletion(body.recordId);
    } catch (problem2) {
      setError(problem2 instanceof Error ? problem2.message : String(problem2));
    } finally {
      setBusy(false);
      setGenerationRecordId(null);
      setProgress(null);
    }
  }, [busy, flushAll, sessionId, waitForCompletion]);
  const cancelCurrentGeneration = (0, import_react14.useCallback)(async () => {
    const sameSessionBusy = queue.busy && queue.sessionId === sessionId;
    if (!busy && !sameSessionBusy) return;
    const recordId = generationRecordId ?? queue.recordId ?? null;
    if (recordId === null) return;
    try {
      const { status, body } = await cancelGeneration(sessionId, recordId);
      if (status !== 200) {
        setError(body?.message ?? t("error.cancelGeneration", { status }));
        return;
      }
      setNotice(t("notice.generationCancelling"));
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    }
  }, [busy, generationRecordId, queue, sessionId]);
  const retryRecord = (0, import_react14.useCallback)(async (record) => {
    if (busy || record === null || record === void 0) return;
    setBusy(true);
    setProgress({ phase: "submit", elapsed: 0 });
    setError("");
    setNotice(t("notice.retrySubmitted"));
    try {
      const { status, body } = await generate(sessionId, void 0, record.params);
      if (status === 429) {
        setNotice(t("notice.generationBusy"));
        return;
      }
      if (status !== 202) {
        setError(body?.message ?? t("error.retry", { status }));
        return;
      }
      setGenerationRecordId(body.recordId ?? null);
      await waitForCompletion(body.recordId);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setBusy(false);
      setGenerationRecordId(null);
      setProgress(null);
    }
  }, [busy, sessionId, waitForCompletion]);
  const generateRandom = (0, import_react14.useCallback)(() => {
    update({ seed: -1 });
    setTimeout(() => {
      void runGenerate();
    }, SAVE_DELAY_MS + 80);
  }, [update, runGenerate]);
  const selectRecord = (0, import_react14.useCallback)(async (id) => {
    pinnedRef.current = true;
    setImageBroken(false);
    setActiveRecordId(id);
    try {
      setActiveRecord(await fetchRecord(id));
    } catch {
      setActiveRecord(null);
    }
  }, []);
  (0, import_react14.useEffect)(() => {
    if (activeRecordId === null) {
      setActiveRecord(null);
      return void 0;
    }
    let alive = true;
    void fetchRecord(activeRecordId).then((record) => {
      if (alive) setActiveRecord(record);
    }).catch(() => {
    });
    return () => {
      alive = false;
    };
  }, [activeRecordId]);
  (0, import_react14.useEffect)(() => {
    setImageBroken(false);
  }, [activeRecordId]);
  const loadRecord = (0, import_react14.useCallback)(() => {
    if (activeRecord === null) return;
    replaceDraft(activeRecord.params, t("notice.recordLoaded", { id: activeRecord.id }));
  }, [activeRecord, replaceDraft]);
  const removeRecordById = (0, import_react14.useCallback)(async (id) => {
    try {
      const { status, body } = await deleteRecord(id);
      if (status === 409) {
        setError(body?.message ?? t("history.deleteBlockedRunning"));
        return;
      }
      if (status !== 200) {
        setError(body?.message ?? t("error.delete", { status }));
        return;
      }
      setError("");
      if (id === activeRecordId) {
        setActiveRecordId(null);
        setActiveRecord(null);
      }
      await refresh();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    }
  }, [activeRecordId, refresh]);
  const toggleFlag = (0, import_react14.useCallback)(async (record, flags) => {
    try {
      const { status, body } = await patchRecord(record.id, flags);
      if (status === 405) {
        setError(t("notice.flagsNeedNewHost"));
        return;
      }
      if (status !== 200) {
        setError(body?.message ?? t("error.flag", { status }));
        return;
      }
      setError("");
      await refresh();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    }
  }, [refresh]);
  const removeRecord = (0, import_react14.useCallback)(async () => {
    if (activeRecordId === null) return;
    await removeRecordById(activeRecordId);
  }, [activeRecordId, removeRecordById]);
  const characterSet = (0, import_react14.useMemo)(() => toCharacterSet(params?.characterBoxes), [params?.characterBoxes]);
  const mergedRecords = (() => {
    const seen = new Set(records.map((record) => record.id));
    return [...records, ...older.filter((record) => !seen.has(record.id))];
  })();
  const needle = query.trim().toLowerCase();
  (0, import_react14.useEffect)(() => {
    if (needle === "") {
      setMatches(null);
      return void 0;
    }
    let alive = true;
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const page = await fetchRecords(50, void 0, showArchived, needle);
          if (alive) setMatches(page.records);
        } catch (problem) {
          if (alive) setError(problem instanceof Error ? problem.message : String(problem));
        }
      })();
    }, 220);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [needle, showArchived]);
  const visibleRecords = (needle === "" ? mergedRecords : matches ?? []).filter((record) => flagLocalOnly ? record.sessionId === sessionId : true);
  const loadMore = (0, import_react14.useCallback)(async () => {
    if (loadingMore || nextBefore === null || nextBefore === void 0 || query.trim() !== "") return;
    setLoadingMore(true);
    try {
      const page = await fetchRecords(40, nextBefore, showArchived);
      setOlder((current) => {
        const seen = new Set(current.map((record) => record.id));
        return [...current, ...page.records.filter((record) => !seen.has(record.id))];
      });
      setNextBefore(page.nextBefore);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextBefore, showArchived]);
  const rowVirtualizer = useVirtualizer({
    count: visibleRecords.length,
    getScrollElement: () => historyRef.current,
    estimateSize: () => 64,
    overscan: 6
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const onHistoryScroll = (0, import_react14.useCallback)((event) => {
    const element = event.currentTarget;
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 120) void loadMore();
  }, [loadMore]);
  const selectForDelete = (0, import_react14.useCallback)((id) => {
    if (id === null || id === void 0) return;
    const found = mergedRecords.find((record) => record.id === id) ?? (activeRecord?.id === id ? activeRecord : { id });
    setPendingDelete(found);
  }, [mergedRecords, activeRecord]);
  if (params === null) {
    return /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...panel, padding: 16, ...dim4 } }, error !== "" ? t("error.read", { error }) : t("status.loading"));
  }
  const boxes = params.boxes ?? [];
  const shownRecordId = activeRecordId ?? records.find((record) => record.hasImage)?.id ?? null;
  const shownSummary = records.find((record) => record.id === shownRecordId);
  const viewableIds = (needle === "" ? mergedRecords : matches ?? []).filter((record) => record.hasImage).map((record) => record.id);
  const viewIndex = shownRecordId === null ? -1 : viewableIds.indexOf(shownRecordId);
  const previousId = viewIndex > 0 ? viewableIds[viewIndex - 1] : null;
  const followingId = viewIndex >= 0 && viewIndex + 1 < viewableIds.length ? viewableIds[viewIndex + 1] : null;
  const otherBusy = queue.busy && queue.sessionId !== null && queue.sessionId !== sessionId;
  const sessionBusy = busy || queue.busy && queue.sessionId === sessionId;
  const activeGenerationRecordId = generationRecordId ?? queue.recordId ?? null;
  const progressPercent = typeof progress?.percent === "number" && Number.isFinite(progress.percent) ? Math.min(100, Math.max(0, progress.percent)) : null;
  const queuePosition = typeof progress?.queuePosition === "number" && progress.queuePosition > 0 ? progress.queuePosition : null;
  const progressText = queuePosition !== null ? t("generate.queuePosition", { position: queuePosition, pending: progress.queuePending ?? queuePosition }) : progressPercent !== null ? t("generate.percent", { percent: Math.round(progressPercent), step: progress.step ?? "\u2014", maxStep: progress.maxStep ?? "\u2014" }) : (progress?.phase ?? phase) === "" ? "" : t(PHASE_KEY[progress?.phase ?? phase] ?? (progress?.phase ?? phase));
  const shownHasImage = shownSummary === void 0 ? shownRecordId !== null : shownSummary.hasImage;
  const shownRunning = shownSummary?.status === "running";
  const running = records.find((record) => record.status === "running");
  return /* @__PURE__ */ import_react14.default.createElement("div", { className: "moss-studio", style: panel }, /* @__PURE__ */ import_react14.default.createElement(ScopeStyles, null), /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, justifyContent: "space-between", gap: 8, padding: "6px 8px", borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))" } }, /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, gap: 6, minWidth: 0 } }, /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", style: iconOnly3, title: t("action.newDraftTitle"), "aria-label": t("action.newDraft"), onClick: newDraft }, /* @__PURE__ */ import_react14.default.createElement(Icon, { name: "add" })), /* @__PURE__ */ import_react14.default.createElement(
    "button",
    {
      type: "button",
      title: `${comfy?.ok ? `${t("status.comfyVersion", { version: comfy.version })} \xB7 ${comfy.url ?? ""}` : `${t("status.comfyUnreachable")}${comfy?.error ? `\uFF1A${comfy.error}` : ""}`}\uFF08${t("status.recheckHint")}\uFF09`,
      "aria-label": t("status.recheck"),
      onClick: () => {
        setComfy(null);
        void checkHealth();
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "1px 6px",
        borderRadius: 10,
        fontSize: 10,
        font: "inherit",
        whiteSpace: "nowrap",
        cursor: "pointer",
        background: "transparent",
        border: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.28))",
        color: comfy?.ok ? "inherit" : "var(--dsw-alias-state-error-primary, #ff8f7a)"
      }
    },
    /* @__PURE__ */ import_react14.default.createElement(
      "span",
      {
        "aria-hidden": "true",
        style: {
          width: 6,
          height: 6,
          borderRadius: 3,
          background: comfy === null ? "var(--dsw-alias-label-secondary, #888)" : comfy.ok ? "var(--dsw-alias-state-success-primary, #5fbf7f)" : "var(--dsw-alias-state-error-primary, #ff8f7a)"
        }
      }
    ),
    comfy === null ? t("status.connecting") : comfy.ok ? t("status.comfyVersion", { version: comfy.version }) : t("status.comfyOffline")
  ), /* @__PURE__ */ import_react14.default.createElement("span", { style: { fontSize: 10, ...dim4, whiteSpace: "nowrap" }, title: t("status.draftSession", { sessionId }) }, sessionId === "root" ? t("status.draftRoot") : sessionId === "global" ? t("status.draftUnbound") : t("status.draftConversation")), /* @__PURE__ */ import_react14.default.createElement(
    "span",
    {
      title: t("status.memoryTitle", { total: gigabytes(comfy?.gpu?.vramTotal), ram: gigabytes(comfy?.ramTotal) }),
      style: {
        fontSize: 10,
        whiteSpace: "nowrap",
        display: "inline-flex",
        gap: 8,
        color: comfy?.gpu !== void 0 && usedPercent(comfy.gpu.vramTotal, comfy.gpu.vramFree) >= 90 ? "var(--dsw-alias-state-error-primary, #ff8f7a)" : "var(--dsw-alias-label-secondary, inherit)"
      }
    },
    /* @__PURE__ */ import_react14.default.createElement("span", null, t("status.vram", {
      used: gigabytes(comfy?.gpu?.vramTotal === void 0 ? void 0 : comfy.gpu.vramTotal - (comfy.gpu.vramFree ?? 0)),
      total: gigabytes(comfy?.gpu?.vramTotal)
    })),
    /* @__PURE__ */ import_react14.default.createElement("span", null, t("status.ram", {
      used: gigabytes(comfy?.ramTotal === void 0 ? void 0 : comfy.ramTotal - (comfy.ramFree ?? 0)),
      total: gigabytes(comfy?.ramTotal)
    }))
  )), /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, gap: 4, flexShrink: 0 } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: { fontSize: 10, ...dim4 } }, saving ? t("status.saving") : `revision ${revision}`), /* @__PURE__ */ import_react14.default.createElement(
    "button",
    {
      type: "button",
      style: historyOpen ? iconOnly3 : { ...iconOnly3, opacity: 0.65 },
      title: historyOpen ? t("history.hide") : t("history.show", { count: mergedRecords.length }),
      "aria-label": historyOpen ? t("history.hide") : t("history.show", { count: mergedRecords.length }),
      "aria-pressed": historyOpen,
      onClick: () => setHistoryOpen((value) => !value)
    },
    /* @__PURE__ */ import_react14.default.createElement(Icon, { name: "history" })
  ), /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", style: iconOnly3, title: t("action.settings"), "aria-label": t("action.settings"), onClick: () => setSettingsOpen(true) }, /* @__PURE__ */ import_react14.default.createElement(Icon, { name: "settings" })))), /* @__PURE__ */ import_react14.default.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } }, historyOpen ? /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      className: "moss-scroller",
      style: {
        width: historyWidth,
        flexShrink: 0,
        borderRight: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
        display: "flex",
        flexDirection: "column",
        minHeight: 0
      }
    },
    /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, justifyContent: "space-between", padding: "6px 6px 4px", gap: 4 } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: { fontSize: 11, ...dim4 } }, t("history.title", { count: visibleRecords.length }), mergedRecords.length > visibleRecords.length ? ` / ${mergedRecords.length}` : ""), /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, gap: 4 } }, /* @__PURE__ */ import_react14.default.createElement(
      FilterChip,
      {
        selected: flagLocalOnly,
        label: t("history.filterSession"),
        title: flagLocalOnly ? t("history.showAllSessions") : t("history.onlyThisSession"),
        onClick: () => setLocalOnly((value) => !value)
      }
    ), /* @__PURE__ */ import_react14.default.createElement(
      FilterChip,
      {
        selected: showArchived,
        label: t("action.archive"),
        title: showArchived ? t("history.hideArchived") : t("history.showArchived"),
        onClick: () => {
          setShowArchived((value) => !value);
          setOlder([]);
          setNextBefore(void 0);
        }
      }
    ))),
    /* @__PURE__ */ import_react14.default.createElement("div", { style: { padding: "0 6px 6px" } }, /* @__PURE__ */ import_react14.default.createElement(
      "input",
      {
        value: query,
        onChange: (event) => setQuery(event.target.value),
        placeholder: t("history.searchPlaceholder"),
        style: { ...input3, width: "100%", boxSizing: "border-box", fontSize: 11 }
      }
    )),
    pinnedRecords.length > 0 ? /* @__PURE__ */ import_react14.default.createElement("div", { style: { padding: "0 6px 6px", borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))", marginBottom: 6 } }, /* @__PURE__ */ import_react14.default.createElement("div", { style: { fontSize: 10, ...dim4, marginBottom: 4 }, title: pinnedTruncated ? t("history.pinnedTruncated") : void 0 }, t("history.pinnedTitle", { count: pinnedRecords.length }), pinnedTruncated ? " +" : ""), pinnedRecords.map((record) => /* @__PURE__ */ import_react14.default.createElement("div", { key: record.id, style: { paddingBottom: 5 } }, /* @__PURE__ */ import_react14.default.createElement(
      HistoryRow,
      {
        record,
        active: record.id === activeRecordId,
        onSelect: (id) => void selectRecord(id),
        onDelete: (id) => selectForDelete(id),
        onPin: (row4) => void toggleFlag(row4, { pinned: !row4.pinned }),
        onArchive: (row4) => void toggleFlag(row4, { archived: !row4.archived })
      }
    )))) : null,
    /* @__PURE__ */ import_react14.default.createElement(
      "div",
      {
        ref: historyRef,
        onScroll: onHistoryScroll,
        style: { flex: 1, minHeight: 0, overflowY: "auto", padding: "0 6px" }
      },
      visibleRecords.length === 0 ? /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...dim4, padding: 8, lineHeight: 1.6 } }, needle !== "" ? t("history.noMatches", { query: query.trim() }) : flagLocalOnly ? t("history.emptySession") : t("history.empty")) : null,
      virtualRows.length === 0 ? visibleRecords.map((record) => /* @__PURE__ */ import_react14.default.createElement("div", { key: record.id, style: { paddingBottom: 5 } }, /* @__PURE__ */ import_react14.default.createElement(
        HistoryRow,
        {
          record,
          active: record.id === activeRecordId,
          onSelect: (id) => void selectRecord(id),
          onDelete: (id) => selectForDelete(id),
          onPin: (row4) => void toggleFlag(row4, { pinned: !row4.pinned }),
          onArchive: (row4) => void toggleFlag(row4, { archived: !row4.archived })
        }
      ))) : /* @__PURE__ */ import_react14.default.createElement("div", { style: { height: rowVirtualizer.getTotalSize(), position: "relative" } }, virtualRows.map((item) => {
        const record = visibleRecords[item.index];
        if (record === void 0) return null;
        return /* @__PURE__ */ import_react14.default.createElement(
          "div",
          {
            key: record.id,
            "data-index": item.index,
            ref: rowVirtualizer.measureElement,
            style: { position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${item.start}px)`, paddingBottom: 5 }
          },
          /* @__PURE__ */ import_react14.default.createElement(
            HistoryRow,
            {
              record,
              active: record.id === activeRecordId,
              onSelect: (id) => void selectRecord(id),
              onDelete: (id) => selectForDelete(id),
              onPin: (row4) => void toggleFlag(row4, { pinned: !row4.pinned }),
              onArchive: (row4) => void toggleFlag(row4, { archived: !row4.archived })
            }
          )
        );
      })),
      nextBefore !== null && nextBefore !== void 0 && needle === "" ? /* @__PURE__ */ import_react14.default.createElement("div", { style: { textAlign: "center", padding: "4px 0 8px" } }, /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", style: iconButton2, onClick: () => void loadMore(), disabled: loadingMore }, loadingMore ? t("history.loading") : t("history.loadMore"))) : null
    )
  ), /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      onPointerDown: (event) => {
        event.preventDefault();
        historyResizeRef.current = { x: event.clientX, width: historyWidth };
        setHistoryResizing(true);
      },
      onDoubleClick: () => setHistoryWidth(wide ? 280 : 160),
      title: t("history.resizeTitle"),
      style: {
        width: 5,
        flexShrink: 0,
        cursor: "col-resize",
        background: historyResizing ? "var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))" : "transparent"
      }
    }
  )) : null, /* @__PURE__ */ import_react14.default.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ import_react14.default.createElement("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, justifyContent: "space-between", marginBottom: 4 } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: label }, t("prompt.label"))), /* @__PURE__ */ import_react14.default.createElement(
    "textarea",
    {
      ref: promptRef,
      value: params.prompt,
      onChange: (event) => update({ prompt: event.target.value }),
      placeholder: t("prompt.placeholder"),
      rows: 4,
      style: {
        ...input3,
        width: "100%",
        height: promptHeight,
        minHeight: 72,
        maxHeight: 520,
        resize: "vertical",
        overflowY: "auto",
        lineHeight: 1.55,
        fontFamily: "inherit"
      }
    }
  )), /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, justifyContent: "space-between", marginBottom: 4 } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: { ...label, minWidth: 0 } }, t("preview.boxes", { count: boxes.length })), /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3 } }, /* @__PURE__ */ import_react14.default.createElement(
    "button",
    {
      type: "button",
      style: iconOnly3,
      title: showCanvas ? t("preview.collapse") : t("preview.expand"),
      "aria-label": showCanvas ? t("preview.collapse") : t("preview.expand"),
      onClick: () => setShowCanvas((value) => !value)
    },
    /* @__PURE__ */ import_react14.default.createElement(Icon, { name: showCanvas ? "unfold_less" : "unfold_more" })
  ), /* @__PURE__ */ import_react14.default.createElement(
    "button",
    {
      type: "button",
      style: iconOnly3,
      title: t("preview.editLayout"),
      "aria-label": t("preview.editLayout"),
      onClick: openEditor
    },
    /* @__PURE__ */ import_react14.default.createElement(Icon, { name: "dashboard_customize" })
  ))), showCanvas ? /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      onClick: openEditor,
      title: t("preview.openEditor"),
      style: { cursor: "zoom-in" }
    },
    /* @__PURE__ */ import_react14.default.createElement(
      BoxCanvas,
      {
        boxes,
        size: params.size,
        selected: -1,
        onSelect: () => {
        },
        onChange: () => {
        },
        interactive: false,
        compact: boxes.length === 0
      }
    )
  ) : null), /* @__PURE__ */ import_react14.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, /* @__PURE__ */ import_react14.default.createElement("div", { style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, gap: 4, alignItems: "center" } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: label }, t("size.label")), /* @__PURE__ */ import_react14.default.createElement(
    "input",
    {
      type: "number",
      min: 16,
      step: 16,
      value: widthText,
      onChange: (event) => setWidthText(event.target.value),
      onBlur: () => commitSize(widthText, heightText),
      "aria-label": t("size.width"),
      style: { ...input3, flex: "0 0 64px", width: 64, textAlign: "right" }
    }
  ), /* @__PURE__ */ import_react14.default.createElement("span", { style: { ...dim4, fontSize: 11 } }, "\xD7"), /* @__PURE__ */ import_react14.default.createElement(
    "input",
    {
      type: "number",
      min: 16,
      step: 16,
      value: heightText,
      onChange: (event) => setHeightText(event.target.value),
      onBlur: () => commitSize(widthText, heightText),
      "aria-label": t("size.height"),
      style: { ...input3, flex: "0 0 64px", width: 64, textAlign: "right" }
    }
  ), /* @__PURE__ */ import_react14.default.createElement(
    "select",
    {
      value: SIZE_PRESETS.includes(params.size) ? params.size : "",
      onChange: (event) => {
        if (event.target.value === "") return;
        const [w, h] = event.target.value.split("x");
        setWidthText(w);
        setHeightText(h);
        update({ size: event.target.value });
      },
      "aria-label": t("size.presets"),
      style: { ...input3, flex: "0 0 96px", width: 96 }
    },
    /* @__PURE__ */ import_react14.default.createElement("option", { value: "", style: optionStyle2 }, t("size.presetPlaceholder")),
    SIZE_PRESETS.map((size) => /* @__PURE__ */ import_react14.default.createElement("option", { key: size, value: size, style: optionStyle2 }, size))
  )), sizeHint !== null ? /* @__PURE__ */ import_react14.default.createElement("div", { style: { fontSize: 10, color: "var(--dsw-alias-state-error-primary, #ff8f7a)", margin: "2px 0 0 34px" } }, sizeHint) : null), /* @__PURE__ */ import_react14.default.createElement("label", { style: row3 }, /* @__PURE__ */ import_react14.default.createElement("span", { style: label }, t("params.steps")), /* @__PURE__ */ import_react14.default.createElement("input", { type: "number", min: 1, max: 200, value: params.steps, onChange: (event) => update({ steps: Number(event.target.value) || 1 }), style: input3 })), /* @__PURE__ */ import_react14.default.createElement("label", { style: row3 }, /* @__PURE__ */ import_react14.default.createElement("span", { style: label }, "CFG"), /* @__PURE__ */ import_react14.default.createElement("input", { type: "number", min: 0, max: 30, step: 0.1, value: params.cfg, onChange: (event) => update({ cfg: Number(event.target.value) || 0 }), style: input3 })), /* @__PURE__ */ import_react14.default.createElement("label", { style: row3 }, /* @__PURE__ */ import_react14.default.createElement("span", { style: label }, "seed"), /* @__PURE__ */ import_react14.default.createElement("input", { type: "number", value: params.seed, onChange: (event) => update({ seed: Number(event.target.value) }), style: input3 }))), /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, justifyContent: "space-between", marginBottom: 4 } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: label }, t("params.negative"))), /* @__PURE__ */ import_react14.default.createElement(
    "textarea",
    {
      value: params.negative,
      onChange: (event) => update({ negative: event.target.value }),
      placeholder: t("params.negativePlaceholder"),
      rows: 2,
      style: { ...input3, width: "100%", display: "block", resize: "vertical", lineHeight: 1.5 }
    }
  )), /* @__PURE__ */ import_react14.default.createElement(
    IconCheckbox,
    {
      checked: params.enhance,
      disabled: boxes.length > 0,
      onChange: (event) => update({ enhance: event.target.checked }),
      label: t("params.enhanceHint")
    }
  )), /* @__PURE__ */ import_react14.default.createElement("div", { style: { borderTop: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))", padding: "6px 10px", display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, flexWrap: "wrap" } }, /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", style: primary2, disabled: sessionBusy || otherBusy || sizeHint !== null, onClick: generateRandom }, sessionBusy ? `${t("generate.running", { seconds: elapsed })}${progressText === "" ? "" : ` \xB7 ${progressText}`}` : otherBusy ? t("generate.otherSession") : t("generate.random")), /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", style: button5, disabled: sessionBusy || otherBusy || sizeHint !== null, onClick: () => void runGenerate() }, t("generate.currentSeed")), sessionBusy && activeGenerationRecordId !== null ? /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", style: button5, onClick: () => void cancelCurrentGeneration() }, t("generate.cancel")) : null, running !== void 0 && !sessionBusy ? /* @__PURE__ */ import_react14.default.createElement("span", { style: { fontSize: 11, ...dim4 } }, t("generate.queued", { id: running.id.slice(-4) })) : null, sessionBusy && progressPercent !== null ? /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      role: "progressbar",
      "aria-label": t("generate.progressLabel"),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(progressPercent),
      style: { width: "100%", height: 4, borderRadius: 2, overflow: "hidden", background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.18))" }
    },
    /* @__PURE__ */ import_react14.default.createElement("div", { style: { width: `${progressPercent}%`, height: "100%", background: "var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))" } })
  ) : null, sessionBusy && progressText !== "" ? /* @__PURE__ */ import_react14.default.createElement("span", { style: { fontSize: 11, ...dim4 } }, progressText) : null, sizeHint !== null ? /* @__PURE__ */ import_react14.default.createElement("span", { style: { fontSize: 11, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" } }, t("size.invalidNotSaved")) : null), conflict ? /* @__PURE__ */ import_react14.default.createElement("div", { role: "alert", style: { display: "flex", flexDirection: "column", gap: 4, padding: 6, borderRadius: 8, border: "1px solid var(--dsw-alias-state-warning-primary, rgba(235,180,70,0.55))", background: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.12))" } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: { fontSize: 11 } }, t("notice.draftConflict")), /* @__PURE__ */ import_react14.default.createElement("div", { style: { ...row3, flexWrap: "wrap", gap: 4 } }, /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", style: button5, disabled: conflictParamsRef.current === null, onClick: adoptServerDraft }, t("action.adoptServer")), /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", style: primary2, onClick: () => void overwriteServerDraft() }, t("action.overwriteServer")))) : null, notice !== "" ? /* @__PURE__ */ import_react14.default.createElement("div", { style: { fontSize: 11, ...dim4 } }, notice) : null, error !== "" ? /* @__PURE__ */ import_react14.default.createElement("div", { style: { fontSize: 11, color: "var(--dsw-alias-state-error-primary, #ff8f7a)" } }, error) : null)), wide ? /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      style: {
        width: "38%",
        minWidth: 340,
        flexShrink: 0,
        borderLeft: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
        minHeight: 0,
        display: "flex"
      }
    },
    /* @__PURE__ */ import_react14.default.createElement(
      ResultPane,
      {
        orientation: "column",
        shownRecordId,
        shownHasImage,
        shownRunning,
        imageBroken,
        onImageError: () => setImageBroken(true),
        activeRecord,
        activeRecordId,
        onZoom: openViewer,
        onLoad: loadRecord,
        onRemove: () => selectForDelete(activeRecordId),
        onRetry: (record) => void retryRecord(record),
        error
      }
    )
  ) : null), wide ? null : /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      onPointerDown: (event) => {
        event.preventDefault();
        resizeRef.current = { y: event.clientY, height: resultHeight };
        setResizing(true);
      },
      onDoubleClick: () => setResultCollapsed((value) => !value),
      title: t("result.resizeTitle"),
      style: {
        height: 6,
        flexShrink: 0,
        cursor: "row-resize",
        background: resizing ? "var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))" : "var(--dsw-alias-border-l1, rgba(127,127,127,0.22))",
        borderTop: "1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))"
      }
    }
  ), /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      style: {
        height: resultCollapsed ? 32 : resultHeight,
        // The strip states a preferred height, but it must yield when the
        // column is shorter: with `flexShrink: 0` it kept its full height and
        // pushed the picture past the bottom edge instead of fitting it.
        // The parameter column uses flex-basis 0, so every missing pixel comes
        // out of this strip first.
        flexShrink: 1,
        minHeight: resultCollapsed ? 32 : 88,
        // A stored pixel height can exceed a short sidebar; cap it to the share
        // of the column it may take, so the picture shrinks instead of being
        // pushed below the edge.
        maxHeight: resultCollapsed ? 32 : "55%",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        overflow: "hidden",
        background: "var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.06))"
      }
    },
    /* @__PURE__ */ import_react14.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "2px 8px 0", flexShrink: 0 } }, /* @__PURE__ */ import_react14.default.createElement("span", { style: { fontSize: 11, ...dim4 } }, t("result.label")), /* @__PURE__ */ import_react14.default.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ import_react14.default.createElement(
      "button",
      {
        type: "button",
        style: iconOnly3,
        title: resultCollapsed ? t("result.expand") : t("result.collapse"),
        "aria-label": resultCollapsed ? t("result.expand") : t("result.collapseShort"),
        onClick: () => setResultCollapsed((value) => !value)
      },
      /* @__PURE__ */ import_react14.default.createElement(Icon, { name: resultCollapsed ? "keyboard_arrow_up" : "keyboard_arrow_down" })
    )),
    resultCollapsed ? null : /* @__PURE__ */ import_react14.default.createElement("div", { style: { flex: 1, minHeight: 0 } }, /* @__PURE__ */ import_react14.default.createElement(
      ResultPane,
      {
        orientation: "row",
        shownRecordId,
        shownHasImage,
        shownRunning,
        imageBroken,
        onImageError: () => setImageBroken(true),
        activeRecord,
        activeRecordId,
        onZoom: openViewer,
        onLoad: loadRecord,
        onRemove: () => selectForDelete(activeRecordId),
        onRetry: (record) => void retryRecord(record),
        error
      }
    ))
  )), editorOpen ? /* @__PURE__ */ import_react14.default.createElement(
    BoxEditor,
    {
      params,
      onApply: applyBoxes,
      onAdd: addBox,
      onClose: closeEditor,
      onCancel: cancelEditor
    }
  ) : null, pendingDelete !== null ? /* @__PURE__ */ import_react14.default.createElement(
    ConfirmDialog,
    {
      title: t("confirm.deleteTitle"),
      message: t("confirm.deleteMessage"),
      detail: [pendingDelete.prompt, pendingDelete.id].filter((part) => typeof part === "string" && part !== "").join(" \xB7 "),
      onCancel: () => setPendingDelete(null),
      onConfirm: () => {
        const id = pendingDelete.id;
        setPendingDelete(null);
        void removeRecordById(id);
      }
    }
  ) : null, settingsOpen ? /* @__PURE__ */ import_react14.default.createElement(
    SettingsDialog,
    {
      onClose: () => setSettingsOpen(false),
      onSaved: () => {
        setComfy(null);
      }
    }
  ) : null, zoom && shownRecordId !== null ? /* @__PURE__ */ import_react14.default.createElement(
    ImageViewer,
    {
      recordId: shownRecordId,
      prevId: previousId,
      nextId: followingId,
      onNavigate: (id) => {
        setImageBroken(false);
        setActiveRecordId(id);
        void selectRecord(id);
      },
      onClose: () => setZoom(false)
    }
  ) : null);
}

// src/client.jsx
var PANEL_ID = "moss-studio";
var TAB_ID = "dsh-moss-studio";
var TAB_KIND = "moss-studio";
var PanelBoundary = class extends import_react15.default.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error !== null) {
      return import_react15.default.createElement(
        "div",
        { style: { padding: 16, fontSize: 12, opacity: 0.8, lineHeight: 1.6 } },
        import_react15.default.createElement("div", null, t("panel.errorTitle")),
        import_react15.default.createElement("div", { style: { opacity: 0.7, marginTop: 6 } }, String(this.state.error?.message ?? this.state.error)),
        import_react15.default.createElement("div", { style: { opacity: 0.55, marginTop: 6 } }, t("panel.errorHint"))
      );
    }
    return this.props.children;
  }
};
function createPlugin() {
  function PanelIcon({ size = 16, active = false }) {
    const edge = typeof size === "number" && size > 0 ? size : 16;
    const brand = active ? "var(--dsw-alias-brand-primary, #78be91)" : "currentColor";
    return import_react15.default.createElement(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: edge,
          height: edge,
          flexShrink: 0
        }
      },
      import_react15.default.createElement(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          width: edge,
          height: edge,
          fill: "none",
          "aria-hidden": "true",
          focusable: "false",
          style: { display: "block" }
        },
        import_react15.default.createElement("rect", { x: 2, y: 3, width: 9, height: 18, rx: 2, fill: brand, opacity: 0.9 }),
        import_react15.default.createElement("rect", { x: 13, y: 3, width: 9, height: 7, rx: 2, fill: brand, opacity: 0.55 }),
        import_react15.default.createElement("rect", { x: 13, y: 12, width: 9, height: 9, rx: 2, fill: brand, opacity: 0.3 })
      )
    );
  }
  function TabBody(props) {
    let fromTab;
    try {
      fromTab = props?.useTabInfo?.()?.tab?.sessionId;
    } catch {
    }
    const sessionId = typeof props?.sessionId === "string" && props.sessionId !== "" ? props.sessionId : typeof fromTab === "string" && fromTab !== "" ? fromTab : "global";
    return import_react15.default.createElement(StudioPanel, { sessionId });
  }
  const ROOT_SESSION = "root";
  function StudioMainPanel() {
    function Main() {
      return import_react15.default.createElement(StudioPanel, { sessionId: ROOT_SESSION, wide: true });
    }
    return Main;
  }
  return {
    // Internal seam for tests and embedding; the loader ignores it.
    components: { StudioPanel, BoxEditor, BoxCanvas, ConfirmDialog, SettingsDialog, ResultPane },
    inject: ["locale", "slots", "sidebarRightTabs", "sidebarRight"],
    apply(ctx) {
      const safe = (label2, run) => {
        try {
          ctx.effect(run, label2);
        } catch (error) {
          console.error(`[moss-studio] ${label2} registration failed`, error);
        }
      };
      const injectInto = (owner, label2, register) => safe(label2, () => {
        if (typeof ctx.slots?.inject !== "function") throw new Error("slots.inject unavailable");
        return ctx.slots.inject(owner, () => {
          try {
            return register();
          } catch (error) {
            console.error(`[moss-studio] ${label2} registration failed`, error);
            return () => {
            };
          }
        });
      });
      const locale = typeof ctx.get === "function" ? ctx.get("locale") : ctx.locale;
      if (locale !== void 0 && locale !== null) {
        safe("locale", () => ctx.effect(() => attachLocale(locale), "moss-studio: locale dictionaries"));
      }
      safe("moss-studio: tab type", () => ctx.sidebarRightTabs.register({
        id: TAB_ID,
        kind: TAB_KIND,
        priority: "extension",
        // The contract reads `title(address)` and calls guide titles, so both are functions.
        title: () => "Moss studio",
        guide: [{
          id: "moss-studio",
          order: 100,
          title: () => "Moss studio",
          description: () => t("panel.description"),
          // The start page cards render this; a guide entry without one is the only
          // card in the grid with a blank leading slot.
          icon: PanelIcon
        }]
      }));
      injectInto("sidebar.right.pane.tab", "moss-studio: panel body", () => ctx.slots.register(
        { name: "sidebar.right.pane.tab", key: TAB_ID },
        TabBody
      ));
      injectInto("sidebar.panellist", "moss-studio: sidebar icon", () => ctx.slots.register(
        { name: "sidebar.panellist", id: PANEL_ID, order: 40, label: () => "Moss studio" },
        PanelIcon
      ));
      const Main = StudioMainPanel();
      injectInto("main", "moss-studio: main panel", () => ctx.slots.register(
        { name: "main", key: PANEL_ID },
        Main
      ));
    }
  };
}

    })(module, exports, require)
    const plugin = module.exports.createPlugin()
    return plugin
  },
})
