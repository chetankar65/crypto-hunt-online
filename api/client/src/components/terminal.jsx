import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import FlagInput from "./flagInput";
import "./Terminal.css"; // Add basic styling
import axios from "axios";

const Terminal = () => {
  const [input, setInput] = useState(""); // Current input command
  const [history, setHistory] = useState([]); // History of all commands and their outputs
  const [commands, setCommands] = useState([]); // Command history for up/down arrow navigation
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1); // Tracks history navigation
  const [path, setPath] = useState(["."]);
  const [flag, setFlag] = useState("");
  const [level, setLevel] = useState(0);
  const [dispLevel,setDispLevel] = useState(0);
  const terminalEndRef = useRef(null); // For scrolling to the bottom
  const { userDetails } = useContext(AuthContext);
  const inputRef = useRef(null); // Create a ref for the input field
  const rickRollRef = useRef(null); // Ref for rickroll audio
  const [rickRollPlaying, setRickRollPlaying] = useState(false);

  useEffect(() => {
    rickRollRef.current = new Audio("/lol.mp3"); // Ensure your sound file path is correct
  }, []);

  const playRickRoll = () => {
    if (!rickRollPlaying) {
      rickRollRef.current.currentTime = rickRollRef.current.currentTime; // Ensure we start from the current time
      rickRollRef.current
        .play()
        .then(() => {
          setRickRollPlaying(true);
          setTimeout(() => {
            rickRollRef.current.pause(); // Pause after 0.1 seconds
            // Do not reset currentTime to maintain the position
          }, 100); // Play for 100ms
        })
        .catch((error) => console.error("Playback failed:", error));
    } else {
      // If already playing, just play from the current time
      rickRollRef.current.play();
      setTimeout(() => {
        rickRollRef.current.pause(); // Pause after 0.1 seconds
      }, 100); // Play for another 100ms
    }
  };

  function createPathString() {
    let tempPath = "";
    for (let i = 1; i < path.length; i++) {
      tempPath += "/" + path[i];
    }
    return tempPath;
  }

  async function levelDetails() {
    try {
      const response = await axios.get(
        `/api/levels/get-level-details/${userDetails._id}`
      );
      setDispLevel(response.data.levelNo);
      setLevel(response.data.level);
      
      setFlag(response.data.flag);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    levelDetails();

  }, []);

  useEffect(() => {
    if (dispLevel > 5){
      setDispLevel("You are done! Get out!");
    }
  }, [dispLevel]);


  const commandHandler = async (command) => {
    let output = "";
    command = command.trimStart().trimEnd(); // trim trailing whitespaces
    if (command === "clear" || command === "cls") {
      setHistory([]);
      setCommands([]);
      return;
    }
    let args;
    const resp = await fetch(`/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        command: command,
        level: level,
        path: path,
        flag: flag,
      }),
    })
      .then((response) => {
        return response.json().then(function (json) {
          return response.ok ? json : Promise.reject(json);
        });
      })
      .then((json) => {
        //console.log("Server response:", json);
        args = json;
        if (args.path !== null) setPath(args.path);
        const outFinal = args.output;
        // Include the current path in the history
        setHistory([
          ...history,
          { command, output: outFinal, currentPath: createPathString() },
        ]);
      })
      .catch((error) => console.error(error));

    output = JSON.stringify(args);
    let outFinal = args.output;
    output = outFinal;
    if (args["output"] !== null) {
      setHistory([
        ...history,
        { command, output, currentPath: createPathString() },
      ]);
    }
    terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setCommands([...commands, input]); // Save command to history
      commandHandler(input); // Execute the command
      setInput(""); // Clear input
      setCurrentCommandIndex(-1); // Reset command index after command is entered
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); // Disable the default cursor behavior
      if (e.key === "ArrowUp") {
        if (commands.length > 0) {
          if (currentCommandIndex === -1) {
            setCurrentCommandIndex(0);
            const commandToShow = commands[commands.length - 1]; // Get the last command
            setInput(commandToShow); // Update input
            setTimeout(() => {
              inputRef.current.setSelectionRange(
                commandToShow.length,
                commandToShow.length
              );
            }, 0);
          } else if (currentCommandIndex < commands.length - 1) {
            setCurrentCommandIndex(currentCommandIndex + 1);
            const commandToShow =
              commands[commands.length - 1 - currentCommandIndex - 1];
            setInput(commandToShow); // Update input
            setTimeout(() => {
              inputRef.current.setSelectionRange(
                commandToShow.length,
                commandToShow.length
              );
            }, 0);
          } else {
            playRickRoll();
          }
        } else {
          playRickRoll();
        }
      } else if (e.key === "ArrowDown") {
        if (currentCommandIndex > 0) {
          setCurrentCommandIndex(currentCommandIndex - 1);
          const commandToShow =
            commands[commands.length - 1 - currentCommandIndex + 1];
          setInput(commandToShow); // Update input
          setTimeout(() => {
            inputRef.current.setSelectionRange(
              commandToShow.length,
              commandToShow.length
            );
          }, 0);
        } else if (currentCommandIndex == -1) {
          playRickRoll();
        } else {
          setInput("");
          setCurrentCommandIndex(-1); // Reset index to indicate no command is selected
          setTimeout(() => {
            inputRef.current.setSelectionRange(0, 0); // Reset cursor position
          }, 0);
        }
      }
    }
    else if ((e.ctrlKey || e.metaKey) && e.key === "f"){
        e.preventDefault();
        alert("Search functionality is disabled on this page.");
    }
  };

  const handleContainerClick = (e) => {
    if (!e.target.closest(".output-text")) {
      inputRef.current.focus();
    }
  };

  const logout = () => {
    window.location.href = `/logout`;
  };

  return (
    <div className="terminal-outer-container">
      <div className="terminal-topbar">
        <img src="/terminal.png" className="terminal-logo" alt="" />
        <div className="terminal-topbar-directory">
          level-{dispLevel + 1} | cses@cryptic:~{path.length > 1 ? createPathString(path) : ""}
        </div>
        <div className="crosses">
          <img src="/blank-circle.png" className="blank-circle" alt="" />
          <img src="/blank-circle.png" className="blank-circle" alt="" />
          <img src="/cross-circle.png" className="cross-circle" alt="" />
        </div>
      </div>
      <div
        className="terminal-container"
        onClick={handleContainerClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <pre className="title">
          {`                             o
                            /\\
                           /::\\
                          /::::\\
            ,a_a         /\\::::/\\
           {/ ''\\_      /\\ \\::/\\ \\        _________    ____  ________  ______  ______   ________  ________   ________    ___   ______
           {\\ ,_oo)    /\\ \\ \\/\\ \\ \\      / ____/   |  / __ \\/_  __/ / / / __ \\/ ____/  /_  __/ / / / ____/  / ____/ /   /   | / ____/ 
           {/  (_^____/  \\ \\ \\ \\ \\ \\    / /   / /| | / /_/ / / / / / / / /_/ / __/      / / / /_/ / __/    / /_  / /   / /| |/ / __ 
 .=.      {/ \\___)))*)    \\ \\ \\ \\ \\/   / /___/ ___ |/ ____/ / / / /_/ / _, _/ /___     / / / __  / /___   / __/ / /___/ ___ / /_/ /
(.=.\`\\   {/   /=;  ~/      \\ \\ \\ \\/    \\____/_/  |_/_/     /_/  \\____/_/ |_/_____/    /_/ /_/ /_/_____/  /_/   /_____/_/  |_\\____/
    \\ \`\\{/(   \\/\\  /        \\ \\ \\/
     \\  \`. \`\\  ) )           \\ \\/
      \\    // /_/_            \\/
       '==''---))))                                                                                     
                                                                                                                           
          `}
        </pre>
        <button onClick={logout}>Logout</button>
        <div className="output-area">
          {history.map((entry, index) => (
            <div key={index}>
              <div className="command-line">
                cses@cryptic:
                <span className="path-color">~{entry.currentPath}$</span>{" "}
                {entry.command}
              </div>
              <div className="command-output">
                {(Array.isArray(entry.output)
                  ? entry.output
                  : [entry.output]
                ).map((item, idx) => {
                  if (typeof item === "object" && item !== null) {
                    return (
                      <span
                        key={idx}
                        className={
                          item.type === "dir" ? "dir-color" : "file-color"
                        }
                      >
                        {item.name || "Unnamed"}{" "}
                      </span>
                    );
                  } else {
                    return (
                      <span className="output-text" key={idx}>
                        {item}{" "}
                      </span>
                    );
                  }
                })}
              </div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-line">
            <span className="prompt">
              cses@cryptic:
              <span className="path-color">
                ~{path.length > 1 ? createPathString(path) : ""}$
              </span>
            </span>
            <input
              type="text"
              ref={inputRef}
              className="input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </div>
        </form>
        <FlagInput flag={flag} level={dispLevel} />
      </div>
    </div>
  );
};

export default Terminal;
