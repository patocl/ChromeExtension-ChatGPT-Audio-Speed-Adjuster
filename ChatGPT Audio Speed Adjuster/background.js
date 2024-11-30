function setPlaybackRate(playbackRate) {
  document
      .querySelectorAll("audio")
      .forEach((v) => (v.playbackRate = playbackRate));
}

function getPlaybackRate() {
    let playbackRate = prompt("Adjust Audio Speed", "1.0");

    // If the user cancels, return the default value
    if (playbackRate === null) {
        return 1.0; 
    }

    // Convert the input to a number and validate it
    const numericRate = parseFloat(playbackRate);

    if (isNaN(numericRate) || numericRate <= 0) {
        alert("Invalid audio speed. Please enter a positive number.");
        return 1.0; // Default value in case of error
    }

    return numericRate;
}

function onClick(tab) {
  chrome.scripting
      .executeScript({
          target: {
              tabId: tab.id
          },
          func: getPlaybackRate,
      })
      .then((injectionResults) => {
          for (const {
                  result: playbackRate
              }
              of injectionResults) {
              chrome.scripting.executeScript({
                  target: {
                      tabId: tab.id,
                      allFrames: true
                  },
                  func: setPlaybackRate,
                  args: [playbackRate],
              });
          }
      });
}
chrome.action.onClicked.addListener(function(tab) {
  onClick(tab);
});
chrome.commands.onCommand.addListener(function(command, tab) {
  if (command === "set_playback_rate") {
      onClick(tab);
  }
});