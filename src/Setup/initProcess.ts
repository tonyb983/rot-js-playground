import * as keypress from "keypress";

export const consoleCodes = {
    hideCursor: "\x1b[?25h",
    showCursor: "\x1b[?25l",
    resetCursorPosition: (proc?: NodeJS.Process) => proc == null ? `\x1b[${process.stdout.rows + 1};1H` : `\x1b[${proc.stdout.rows + 1};1H`,
}

export const initializeProcess = (proc: NodeJS.Process) => {
    // when the program terminates, put the console back the way we found it
    proc.on("exit", function () {
        // move cursor to the bottom left corner
        proc.stdout.write(consoleCodes.resetCursorPosition(proc));
        // show the cursor again
        proc.stdout.write(consoleCodes.showCursor);
    });
    // during the game, hide the cursor from display
    proc.stdout.write(consoleCodes.hideCursor);

    // put the keyboard into raw mode, so we can get individual keypress events
    keypress(proc.stdin);
    proc.stdin.setRawMode(true);
    proc.stdin.resume();

    // add a handler to listen for "quit game" commands
    proc.stdin.on("keypress", function (ch: string) {
        // if the user pressed Ctrl+C or ESC
        if (ch === "\u0003" || ch === "\u001b") {
            // then quit the game
            proc.exit(0);
        }
    });
}
