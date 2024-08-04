("use strict");

async function getState() {
  const result = await chrome.storage.local.get("extensionState");
  return result.extensionState || "ON";
}

async function setState(state) {
  await chrome.storage.local.set({ extensionState: state });
}

async function updateBadge(state) {
  await chrome.action.setBadgeText({ text: state });
  await chrome.action.setBadgeBackgroundColor({
    color: state === "ON" ? "#4CAF50" : "#F44336",
  });
}

async function updateRuleset(state) {
  if (state === "ON") {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["ruleset_1"],
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ["ruleset_1"],
    });
  }
  console.log(
    `${state} - Ruleset IDs:`,
    await chrome.declarativeNetRequest.getEnabledRulesets()
  );
}

chrome.runtime.onInstalled.addListener(async () => {
  const state = await getState();
  await updateRuleset(state);
  await updateBadge(state);
});

chrome.action.onClicked.addListener(async () => {
  const currentState = await getState();
  const nextState = currentState === "ON" ? "OFF" : "ON";

  await setState(nextState);
  await updateBadge(nextState);
  await updateRuleset(nextState);
});
